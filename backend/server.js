import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs/promises";
import { existsSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import multer from "multer";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "portfolio_secure_jwt_secret_2026";

// Directories
const IS_VERCEL = Boolean(process.env.VERCEL);
const DATA_DIR = IS_VERCEL
  ? "/tmp"
  : process.env.DATA_DIR || path.join(__dirname, "data");
const DB_PATH = path.join(DATA_DIR, "db.json");
const ORIGINAL_DB_PATH = path.join(__dirname, "data", "db.json");
const UPLOAD_DIR = IS_VERCEL
  ? "/tmp/uploads"
  : process.env.UPLOAD_DIR || path.join(__dirname, "uploads");

if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
if (!existsSync(UPLOAD_DIR)) mkdirSync(UPLOAD_DIR, { recursive: true });

// --- Security: In-Memory Sliding-Window Rate Limiter ---
function createRateLimiter({ windowMs, maxRequests, message }) {
  const hits = new Map();

  const cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of hits.entries()) {
      if (now > record.resetTime) {
        hits.delete(key);
      }
    }
  }, 5 * 60 * 1000);
  if (cleanupTimer.unref) cleanupTimer.unref();

  return (req, res, next) => {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
      req.socket.remoteAddress ||
      "127.0.0.1";
    const now = Date.now();
    let record = hits.get(ip);

    if (!record || now > record.resetTime) {
      record = { count: 1, resetTime: now + windowMs };
      hits.set(ip, record);
      return next();
    }

    record.count++;
    if (record.count > maxRequests) {
      const retryAfterSec = Math.ceil((record.resetTime - now) / 1000);
      res.setHeader("Retry-After", String(retryAfterSec));
      return res.status(429).json({
        error: message || "Too many requests. Please try again later.",
        retryAfterSeconds: retryAfterSec,
      });
    }

    next();
  };
}

// Rate limiters for different sensitivity levels
const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 10,
  message: "Too many authentication attempts from this IP. Please wait 15 minutes.",
});

const enquiryLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 15,
  message: "Too many contact enquiries sent from this IP. Please wait a few minutes.",
});

const apiLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 300,
  message: "High traffic detected. Please slow down.",
});

// Sanitization Helper to prevent Stored XSS
function sanitizeText(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .trim();
}

// Configured CORS Origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5000",
  "http://127.0.0.1:5000",
  process.env.NEXT_PUBLIC_SITE_URL,
  process.env.ALLOWED_ORIGIN,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. server-side Next.js fetch, mobile apps, curl)
      if (!origin) return callback(null, true);
      // In development or if origin matches configured domains / Vercel preview domains
      if (
        process.env.NODE_ENV !== "production" ||
        allowedOrigins.some((allowed) => origin.startsWith(allowed)) ||
        origin.endsWith(".vercel.app") ||
        origin.includes("localhost") ||
        origin.includes("127.0.0.1")
      ) {
        return callback(null, true);
      }
      return callback(new Error("CORS policy violation: Origin not allowed"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.use(apiLimiter);
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// Secure static file serving with sandboxing for SVGs
app.use(
  "/uploads",
  express.static(UPLOAD_DIR, {
    setHeaders: (res, filePath) => {
      res.setHeader("X-Content-Type-Options", "nosniff");
      if (filePath.endsWith(".svg")) {
        res.setHeader("Content-Security-Policy", "default-src 'none'; sandbox");
      }
    },
  })
);

// File Upload Configuration with Multer
const ALLOWED_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".svg",
  ".avif",
]);

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif",
]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const baseName = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 50);
    const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1e5)}`;
    cb(null, `${baseName}_${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max file size
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ALLOWED_EXTENSIONS.has(ext) || ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only image files (JPG, PNG, WEBP, GIF, SVG, AVIF) are allowed."), false);
    }
  },
});

// Database Helpers
async function readDb() {
  try {
    if (!existsSync(DB_PATH) && existsSync(ORIGINAL_DB_PATH)) {
      try {
        const seedData = await fs.readFile(ORIGINAL_DB_PATH, "utf-8");
        await fs.writeFile(DB_PATH, seedData, "utf-8");
      } catch (seedErr) {
        console.error("Failed to seed Vercel DB:", seedErr);
      }
    }
    const raw = await fs.readFile(DB_PATH, "utf-8");
    const db = JSON.parse(raw);

    // Initialize or migrate admin credentials if needed
    if (!db.admin) {
      db.admin = {
        username: "admin",
        email: "moon3d.xx@gmail.com",
        passwordHash: bcrypt.hashSync("admin123", 10),
      };
      await writeDb(db);
    } else if (db.admin.password) {
      // Convert plain text password to bcrypt hash
      db.admin.passwordHash = bcrypt.hashSync(db.admin.password, 10);
      delete db.admin.password;
      await writeDb(db);
    }

    return db;
  } catch (err) {
    console.error("Error reading database:", err);
    return {
      admin: {
        username: "admin",
        email: "moon3d.xx@gmail.com",
        passwordHash: bcrypt.hashSync("admin123", 10),
      },
      hero: {},
      profile: {},
      projects: [],
      vehicleCategories: [],
      experiences: [],
      productions: [],
      softwareTools: [],
      enquiries: [],
    };
  }
}

async function writeDb(data) {
  const tempPath = `${DB_PATH}.tmp`;
  await fs.writeFile(tempPath, JSON.stringify(data, null, 2), "utf-8");
  await fs.rename(tempPath, DB_PATH);
}

// Auth Helper Middleware
function verifyAuthToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized. Missing token." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized. Invalid or expired token." });
  }
}

// Root Welcome Route
app.get("/", (req, res) => {
  res.json({
    status: "online",
    message: "Portfolio API Backend Server is running smoothly",
    timestamp: new Date().toISOString(),
    endpoints: {
      health: "/api/health",
      content: "/api/content",
      projects: "/api/projects",
      vehicleCategories: "/api/vehicle-categories",
      experiences: "/api/experiences",
      productions: "/api/productions",
    },
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ---------------- AUTH ROUTES ----------------

// Admin Login
app.post("/api/auth/login", authLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const cleanUser = String(username).trim().toLowerCase();
    const rawPass = String(password);
    const cleanPass = String(password).trim();

    const db = await readDb();
    const admin = db.admin || {};

    const allowedUsernames = [
      admin.username?.toLowerCase(),
      admin.email?.toLowerCase(),
      db.profile?.email?.toLowerCase(),
      "admin",
      "munna",
      "moon3d",
      "moon-3d",
    ].filter(Boolean);

    const isMatchUser = allowedUsernames.includes(cleanUser);

    if (!isMatchUser) {
      console.warn(`[AUTH] Login failed: Unknown username/email "${cleanUser}"`);
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Verify password strictly via bcrypt against stored passwordHash
    let isMatchPass = false;
    if (admin.passwordHash) {
      isMatchPass = Boolean(
        bcrypt.compareSync(rawPass, admin.passwordHash) ||
        bcrypt.compareSync(cleanPass, admin.passwordHash)
      );
    } else {
      // First-time seed fallback only if no hash was generated yet
      isMatchPass = cleanPass === "admin123" || rawPass === "admin123";
      if (isMatchPass) {
        db.admin.passwordHash = bcrypt.hashSync("admin123", 10);
        await writeDb(db);
      }
    }

    if (!isMatchPass) {
      console.warn(`[AUTH] Login failed: Incorrect password for "${cleanUser}"`);
      return res.status(401).json({ error: "Invalid username or password" });
    }

    console.log(`[AUTH] Login successful for "${cleanUser}"`);

    // Sign JWT token valid for 7 days
    const token = jwt.sign(
      { username: admin.username || "admin", email: admin.email || "moon3d.xx@gmail.com", role: "admin" },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: {
        username: admin.username || "admin",
        email: admin.email || "moon3d.xx@gmail.com",
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

// Verify Auth Token
app.get("/api/auth/verify", verifyAuthToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// Change Admin Password
app.put("/api/auth/change-password", verifyAuthToken, authLimiter, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current and new passwords are required" });
    }

    const cleanCurrent = String(currentPassword).trim();
    const cleanNew = String(newPassword).trim();

    if (cleanNew.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters" });
    }

    const db = await readDb();
    const isCurrentValid = Boolean(
      (db.admin?.passwordHash && bcrypt.compareSync(String(currentPassword), db.admin.passwordHash)) ||
      (db.admin?.passwordHash && bcrypt.compareSync(cleanCurrent, db.admin.passwordHash))
    );

    if (!isCurrentValid) {
      return res.status(401).json({ error: "Current password does not match" });
    }

    db.admin.passwordHash = bcrypt.hashSync(cleanNew, 10);
    await writeDb(db);

    console.log("[AUTH] Admin password updated successfully");
    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error("Password change error:", err);
    res.status(500).json({ error: "Failed to update password" });
  }
});

// ---------------- MEDIA LIBRARY ROUTES ----------------

// Get all uploaded media files
app.get("/api/media", async (req, res) => {
  try {
    const files = await fs.readdir(UPLOAD_DIR);
    const mediaList = await Promise.all(
      files.map(async (filename) => {
        try {
          const filePath = path.join(UPLOAD_DIR, filename);
          const stat = await fs.stat(filePath);
          return {
            filename,
            url: `/uploads/${filename}`,
            size: stat.size,
            createdAt: stat.birthtime || stat.mtime,
          };
        } catch {
          return null;
        }
      })
    );

    // Filter out nulls and sort newest first
    const validMedia = mediaList
      .filter(Boolean)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json(validMedia);
  } catch (err) {
    console.error("Error fetching media list:", err);
    res.status(500).json({ error: "Failed to fetch media list" });
  }
});

// Delete uploaded media file
app.delete("/api/media/:filename", verifyAuthToken, async (req, res) => {
  try {
    const safeFilename = path.basename(req.params.filename);
    const resolvedPath = path.resolve(UPLOAD_DIR, safeFilename);

    // Prevent path traversal attack
    if (!resolvedPath.startsWith(path.resolve(UPLOAD_DIR))) {
      return res.status(403).json({ error: "Access denied. Invalid file path." });
    }

    if (existsSync(resolvedPath)) {
      await fs.unlink(resolvedPath);
      res.json({ success: true, message: "File deleted" });
    } else {
      res.status(404).json({ error: "File not found" });
    }
  } catch (err) {
    console.error("Error deleting media file:", err);
    res.status(500).json({ error: "Failed to delete file" });
  }
});

// ---------------- CONTENT ROUTES ----------------

// Get all content in one request
app.get("/api/content", async (req, res) => {
  try {
    const db = await readDb();
    // Exclude admin credentials and private enquiries from public content response
    const { admin, enquiries, ...publicData } = db;
    res.json(publicData);
  } catch (error) {
    console.error("Error reading content:", error);
    res.status(500).json({ error: "Failed to read content" });
  }
});

// Image Upload Endpoint (Protected)
app.post("/api/upload", verifyAuthToken, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({
    url: fileUrl,
    filename: req.file.filename,
    size: req.file.size,
    mimetype: req.file.mimetype,
  });
});

// Multiple image upload endpoint (Protected)
app.post("/api/upload-multiple", verifyAuthToken, upload.array("images", 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  }
  const urls = req.files.map((file) => `/uploads/${file.filename}`);
  res.json({ urls });
});

// Hero Section
app.get("/api/hero", async (req, res) => {
  const db = await readDb();
  res.json(db.hero || {});
});

app.put("/api/hero", verifyAuthToken, async (req, res) => {
  try {
    const db = await readDb();
    db.hero = { ...db.hero, ...req.body };
    await writeDb(db);
    res.json({ success: true, hero: db.hero });
  } catch (err) {
    console.error("Error updating hero:", err);
    res.status(500).json({ error: "Failed to update hero data" });
  }
});

// Profile & Contact Info
app.get("/api/profile", async (req, res) => {
  const db = await readDb();
  res.json(db.profile || {});
});

app.put("/api/profile", verifyAuthToken, async (req, res) => {
  try {
    const db = await readDb();
    db.profile = { ...db.profile, ...req.body };
    await writeDb(db);
    res.json({ success: true, profile: db.profile });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ error: "Failed to update profile data" });
  }
});

// Projects / Portfolio Products
app.get("/api/projects", async (req, res) => {
  const db = await readDb();
  res.json(db.projects || []);
});

app.get("/api/projects/:slug", async (req, res) => {
  const db = await readDb();
  const project = (db.projects || []).find((p) => p.slug === req.params.slug);
  if (!project) return res.status(404).json({ error: "Project not found" });
  res.json(project);
});

app.post("/api/projects", verifyAuthToken, async (req, res) => {
  try {
    const db = await readDb();
    const newProject = req.body;
    if (!newProject.slug || !newProject.title) {
      return res.status(400).json({ error: "slug and title are required" });
    }
    const exists = (db.projects || []).some((p) => p.slug === newProject.slug);
    if (exists) {
      return res.status(400).json({ error: "Project with this slug already exists" });
    }
    db.projects = [...(db.projects || []), newProject];
    await writeDb(db);
    res.status(201).json({ success: true, project: newProject });
  } catch (err) {
    console.error("Error creating project:", err);
    res.status(500).json({ error: "Failed to create project" });
  }
});

app.put("/api/projects/:slug", verifyAuthToken, async (req, res) => {
  try {
    const db = await readDb();
    const index = (db.projects || []).findIndex((p) => p.slug === req.params.slug);
    if (index === -1) return res.status(404).json({ error: "Project not found" });

    db.projects[index] = { ...db.projects[index], ...req.body };
    await writeDb(db);
    res.json({ success: true, project: db.projects[index] });
  } catch (err) {
    console.error("Error updating project:", err);
    res.status(500).json({ error: "Failed to update project" });
  }
});

app.delete("/api/projects/:slug", verifyAuthToken, async (req, res) => {
  try {
    const db = await readDb();
    db.projects = (db.projects || []).filter((p) => p.slug !== req.params.slug);
    await writeDb(db);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting project:", err);
    res.status(500).json({ error: "Failed to delete project" });
  }
});

// Vehicle Art Categories
app.get("/api/vehicle-categories", async (req, res) => {
  const db = await readDb();
  res.json(db.vehicleCategories || []);
});

// Reorder Vehicle Categories
app.put("/api/vehicle-categories-reorder", verifyAuthToken, async (req, res) => {
  try {
    const { slugs, categories } = req.body;
    const db = await readDb();

    if (Array.isArray(categories) && categories.length > 0) {
      db.vehicleCategories = categories;
      await writeDb(db);
      return res.json({ success: true, vehicleCategories: db.vehicleCategories });
    }

    if (Array.isArray(slugs) && slugs.length > 0) {
      const currentMap = new Map((db.vehicleCategories || []).map((c) => [c.slug, c]));
      const newOrdered = [];
      for (const slug of slugs) {
        if (currentMap.has(slug)) {
          newOrdered.push(currentMap.get(slug));
          currentMap.delete(slug);
        }
      }
      for (const remaining of currentMap.values()) {
        newOrdered.push(remaining);
      }
      db.vehicleCategories = newOrdered;
      await writeDb(db);
      return res.json({ success: true, vehicleCategories: db.vehicleCategories });
    }

    res.status(400).json({ error: "Invalid data. Expected categories or slugs array." });
  } catch (err) {
    console.error("Error reordering vehicle categories:", err);
    res.status(500).json({ error: "Failed to reorder vehicle categories" });
  }
});

app.get("/api/vehicle-categories/:slug", async (req, res) => {
  const db = await readDb();
  const category = (db.vehicleCategories || []).find((c) => c.slug === req.params.slug);
  if (!category) return res.status(404).json({ error: "Category not found" });
  res.json(category);
});

app.post("/api/vehicle-categories", verifyAuthToken, async (req, res) => {
  try {
    const db = await readDb();
    const newCategory = req.body;
    if (!newCategory.slug || !newCategory.title) {
      return res.status(400).json({ error: "slug and title are required" });
    }
    db.vehicleCategories = [...(db.vehicleCategories || []), newCategory];
    await writeDb(db);
    res.status(201).json({ success: true, category: newCategory });
  } catch (err) {
    console.error("Error creating category:", err);
    res.status(500).json({ error: "Failed to create category" });
  }
});

app.put("/api/vehicle-categories/:slug", verifyAuthToken, async (req, res) => {
  try {
    const db = await readDb();
    const index = (db.vehicleCategories || []).findIndex((c) => c.slug === req.params.slug);
    if (index === -1) return res.status(404).json({ error: "Category not found" });

    db.vehicleCategories[index] = { ...db.vehicleCategories[index], ...req.body };
    await writeDb(db);
    res.json({ success: true, category: db.vehicleCategories[index] });
  } catch (err) {
    console.error("Error updating category:", err);
    res.status(500).json({ error: "Failed to update category" });
  }
});

app.delete("/api/vehicle-categories/:slug", verifyAuthToken, async (req, res) => {
  try {
    const db = await readDb();
    db.vehicleCategories = (db.vehicleCategories || []).filter((c) => c.slug !== req.params.slug);
    await writeDb(db);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting category:", err);
    res.status(500).json({ error: "Failed to delete category" });
  }
});

// Experiences
app.get("/api/experiences", async (req, res) => {
  const db = await readDb();
  res.json(db.experiences || []);
});

app.post("/api/experiences", verifyAuthToken, async (req, res) => {
  try {
    const db = await readDb();
    const newExp = { id: `exp-${Date.now()}`, ...req.body };
    db.experiences = [...(db.experiences || []), newExp];
    await writeDb(db);
    res.status(201).json({ success: true, experience: newExp });
  } catch (err) {
    console.error("Error creating experience:", err);
    res.status(500).json({ error: "Failed to add experience" });
  }
});

app.put("/api/experiences/:id", verifyAuthToken, async (req, res) => {
  try {
    const db = await readDb();
    const index = (db.experiences || []).findIndex((e) => e.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Experience not found" });

    db.experiences[index] = { ...db.experiences[index], ...req.body };
    await writeDb(db);
    res.json({ success: true, experience: db.experiences[index] });
  } catch (err) {
    console.error("Error updating experience:", err);
    res.status(500).json({ error: "Failed to update experience" });
  }
});

app.delete("/api/experiences/:id", verifyAuthToken, async (req, res) => {
  try {
    const db = await readDb();
    db.experiences = (db.experiences || []).filter((e) => e.id !== req.params.id);
    await writeDb(db);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting experience:", err);
    res.status(500).json({ error: "Failed to delete experience" });
  }
});

// Productions
app.get("/api/productions", async (req, res) => {
  const db = await readDb();
  res.json(db.productions || []);
});

app.post("/api/productions", verifyAuthToken, async (req, res) => {
  try {
    const db = await readDb();
    const newProd = { id: `prod-${Date.now()}`, ...req.body };
    db.productions = [...(db.productions || []), newProd];
    await writeDb(db);
    res.status(201).json({ success: true, production: newProd });
  } catch (err) {
    console.error("Error creating production:", err);
    res.status(500).json({ error: "Failed to add production" });
  }
});

app.put("/api/productions/:id", verifyAuthToken, async (req, res) => {
  try {
    const db = await readDb();
    const index = (db.productions || []).findIndex((p) => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Production not found" });

    db.productions[index] = { ...db.productions[index], ...req.body };
    await writeDb(db);
    res.json({ success: true, production: db.productions[index] });
  } catch (err) {
    console.error("Error updating production:", err);
    res.status(500).json({ error: "Failed to update production" });
  }
});

app.delete("/api/productions/:id", verifyAuthToken, async (req, res) => {
  try {
    const db = await readDb();
    db.productions = (db.productions || []).filter((p) => p.id !== req.params.id);
    await writeDb(db);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting production:", err);
    res.status(500).json({ error: "Failed to delete production" });
  }
});

// ---------------- SOFTWARE ARSENAL ROUTES ----------------

// Get all software tools
app.get("/api/software", async (req, res) => {
  const db = await readDb();
  res.json(db.softwareTools || []);
});

// Reorder software tools (Protected)
app.put("/api/software-reorder", verifyAuthToken, async (req, res) => {
  try {
    const { tools, ids } = req.body;
    const db = await readDb();

    if (Array.isArray(tools) && tools.length > 0) {
      db.softwareTools = tools;
      await writeDb(db);
      return res.json({ success: true, softwareTools: db.softwareTools });
    }

    if (Array.isArray(ids) && ids.length > 0) {
      const currentMap = new Map((db.softwareTools || []).map((t) => [t.id, t]));
      const newOrdered = [];
      for (const id of ids) {
        if (currentMap.has(id)) {
          newOrdered.push(currentMap.get(id));
          currentMap.delete(id);
        }
      }
      for (const remaining of currentMap.values()) {
        newOrdered.push(remaining);
      }
      db.softwareTools = newOrdered;
      await writeDb(db);
      return res.json({ success: true, softwareTools: db.softwareTools });
    }

    res.status(400).json({ error: "Invalid data. Expected tools or ids array." });
  } catch (err) {
    console.error("Error reordering software tools:", err);
    res.status(500).json({ error: "Failed to reorder software tools" });
  }
});

// Create new software tool (Protected)
app.post("/api/software", verifyAuthToken, async (req, res) => {
  try {
    const db = await readDb();
    const { name, icon, category, invert } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Software name is required" });
    }
    const newTool = {
      id: req.body.id || `tool-${Date.now()}`,
      name: name.trim(),
      icon: (icon || "").trim(),
      category: (category || "").trim(),
      invert: Boolean(invert),
    };
    db.softwareTools = [...(db.softwareTools || []), newTool];
    await writeDb(db);
    res.status(201).json({ success: true, tool: newTool });
  } catch (err) {
    console.error("Error creating software tool:", err);
    res.status(500).json({ error: "Failed to create software tool" });
  }
});

// Update software tool (Protected)
app.put("/api/software/:id", verifyAuthToken, async (req, res) => {
  try {
    const db = await readDb();
    const index = (db.softwareTools || []).findIndex((t) => t.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Software tool not found" });

    db.softwareTools[index] = {
      ...db.softwareTools[index],
      ...req.body,
      id: req.params.id, // Preserve ID
    };
    await writeDb(db);
    res.json({ success: true, tool: db.softwareTools[index] });
  } catch (err) {
    console.error("Error updating software tool:", err);
    res.status(500).json({ error: "Failed to update software tool" });
  }
});

// Delete software tool (Protected)
app.delete("/api/software/:id", verifyAuthToken, async (req, res) => {
  try {
    const db = await readDb();
    db.softwareTools = (db.softwareTools || []).filter((t) => t.id !== req.params.id);
    await writeDb(db);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting software tool:", err);
    res.status(500).json({ error: "Failed to delete software tool" });
  }
});

// ---------------- ENQUIRIES / CONTACT ROUTES ----------------

// Submit new enquiry (Public)
app.post("/api/enquiries", enquiryLimiter, async (req, res) => {
  try {
    const { name, email, phone, category, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are required." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(email).trim())) {
      return res.status(400).json({ error: "Please provide a valid email address." });
    }

    const cleanEnquiry = {
      id: `enq-${Date.now()}`,
      name: sanitizeText(name).slice(0, 100),
      email: String(email).trim().toLowerCase().slice(0, 150),
      phone: sanitizeText(phone || "").slice(0, 50),
      category: sanitizeText(category || "General Inquiry").slice(0, 80),
      message: sanitizeText(message).slice(0, 3000),
      status: "unread",
      ip: req.ip || req.headers["x-forwarded-for"] || "127.0.0.1",
      createdAt: new Date().toISOString(),
    };

    const db = await readDb();
    db.enquiries = [cleanEnquiry, ...(db.enquiries || [])];
    await writeDb(db);

    console.log(`[ENQUIRY] New contact enquiry from ${cleanEnquiry.name} (${cleanEnquiry.email})`);
    res.status(201).json({ success: true, message: "Enquiry submitted successfully", id: cleanEnquiry.id, enquiry: cleanEnquiry });
  } catch (err) {
    console.error("Error saving enquiry:", err);
    res.status(500).json({ error: "Failed to submit enquiry" });
  }
});

// Get all enquiries (Protected)
app.get("/api/enquiries", verifyAuthToken, async (req, res) => {
  try {
    const db = await readDb();
    res.json(db.enquiries || []);
  } catch (err) {
    console.error("Error fetching enquiries:", err);
    res.status(500).json({ error: "Failed to fetch enquiries" });
  }
});

// Update enquiry status (Protected)
app.patch("/api/enquiries/:id/status", verifyAuthToken, async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["unread", "read", "replied", "archived"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const db = await readDb();
    const enquiry = (db.enquiries || []).find((e) => e.id === req.params.id);
    if (!enquiry) {
      return res.status(404).json({ error: "Enquiry not found" });
    }

    enquiry.status = status;
    await writeDb(db);
    res.json({ success: true, enquiry });
  } catch (err) {
    console.error("Error updating enquiry status:", err);
    res.status(500).json({ error: "Failed to update enquiry status" });
  }
});

// Delete enquiry (Protected)
app.delete("/api/enquiries/:id", verifyAuthToken, async (req, res) => {
  try {
    const db = await readDb();
    db.enquiries = (db.enquiries || []).filter((e) => e.id !== req.params.id);
    await writeDb(db);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting enquiry:", err);
    res.status(500).json({ error: "Failed to delete enquiry" });
  }
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  }
  if (err) {
    return res.status(400).json({ error: err.message || "An unexpected error occurred" });
  }
  next();
});

// Start Server
if (!IS_VERCEL) {
  const HOST = process.env.HOST || "0.0.0.0";
  app.listen(PORT, HOST, () => {
    console.log(`Portfolio Backend running on http://${HOST}:${PORT}`);
    console.log(`API Base: http://${HOST}:${PORT}/api`);
    console.log(`Uploads available at: http://${HOST}:${PORT}/uploads`);
  });
}

export default app;
