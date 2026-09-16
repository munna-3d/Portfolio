import {
  Project,
  VehicleCategory,
  HeroContent,
  ProfileContent,
  ExperienceItem,
  ProductionItem,
} from "@/types";
import { projects as defaultProjects } from "@/data/projects";
import { vehicleCategories as defaultVehicleCategories } from "@/data/vehicle-categories";
import { defaultProductions } from "@/data/productions";
import { defaultExperiences } from "@/data/experiences";

export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export const defaultHero: HeroContent = {
  name: "MUNNA AHMED",
  role: "Senior 3D Artist",
  subtitle: "Hard-Surface Modeling • Automotive Design • PBR Texturing",
  section2Headline: "Mastering Hard-Surface & Automotive Visualization.",
  section2Sub:
    "5+ years of expertise in delivering production-ready assets for games and real-time engines.",
  section3Headline: "Precision in modeling & PBR Texturing.",
  section3Sub: "Built for Unreal Engine, Unity, and high-end visualization.",
  heroImage: "/sequence/frame_000.webp",
};

export const defaultProfile: ProfileContent = {
  name: "Munna Ahmed",
  title: "Certified 3D Artist",
  bio: "Currently available for select freelance opportunities and high-impact 3D production roles.",
  email: "moon3d.xx@gmail.com",
  phone: "+91 9957277403",
  location: "Assam, India",
  socials: [
    { name: "ArtStation", url: "https://moon3dx.artstation.com/" },
    { name: "LinkedIn", url: "https://www.linkedin.com/in/moon3d/" },
    { name: "Fiverr", url: "https://www.fiverr.com/s/zWKmWr3" },
    { name: "YouTube", url: "https://www.youtube.com/@moon3d" },
  ],
};

export interface PortfolioData {
  hero: HeroContent;
  profile: ProfileContent;
  projects: Project[];
  vehicleCategories: VehicleCategory[];
  experiences: ExperienceItem[];
  productions: ProductionItem[];
}

export interface MediaItem {
  filename: string;
  url: string;
  size: number;
  createdAt: string;
}

export interface AdminUser {
  username: string;
  email: string;
}

// ---------------- AUTH TOKEN MANAGEMENT ----------------
const TOKEN_KEY = "portfolio_admin_jwt";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

export function getAuthHeaders(): HeadersInit {
  const token = getStoredToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Admin Login
 */
export async function loginAdmin(username: string, password: string): Promise<{ token: string; user: AdminUser }> {
  const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Login failed");
  }

  setStoredToken(data.token);
  return data;
}

/**
 * Verify current admin token
 */
export async function verifyAuth(): Promise<AdminUser | null> {
  const token = getStoredToken();
  if (!token) return null;

  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      clearStoredToken();
      return null;
    }
    const data = await res.json();
    return data.user;
  } catch {
    return null;
  }
}

/**
 * Change Admin Password
 */
export async function changeAdminPassword(currentPassword: string, newPassword: string) {
  const res = await fetch(`${BACKEND_URL}/api/auth/change-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to update password");
  }
  return data;
}

/**
 * Format image URLs: prepends backend host for /uploads paths
 */
export function formatImageUrl(url: string): string {
  if (!url) return "";
  if (url.startsWith("/uploads")) {
    return `${BACKEND_URL}${url}`;
  }
  return url;
}

// ---------------- CONTENT APIS ----------------

/**
 * Fetch all content from the backend with automatic graceful fallback
 */
export async function fetchContent(): Promise<PortfolioData> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/content`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch content from backend");
    const data = await res.json();
    return {
      hero: data.hero || defaultHero,
      profile: data.profile || defaultProfile,
      projects: data.projects?.length ? data.projects : defaultProjects,
      vehicleCategories: data.vehicleCategories?.length
        ? data.vehicleCategories
        : defaultVehicleCategories,
      experiences: data.experiences?.length
        ? data.experiences
        : defaultExperiences,
      productions: data.productions?.length
        ? data.productions
        : defaultProductions,
    };
  } catch {
    // Graceful offline fallback
    return {
      hero: defaultHero,
      profile: defaultProfile,
      projects: defaultProjects,
      vehicleCategories: defaultVehicleCategories,
      experiences: defaultExperiences,
      productions: defaultProductions,
    };
  }
}

/**
 * Fetch a single project by slug from backend with fallback
 */
export async function fetchProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/projects/${slug}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const project = await res.json();
      return project;
    }
  } catch {
    // fallback below
  }
  return defaultProjects.find((p) => p.slug === slug) || null;
}

/**
 * Fetch vehicle categories from backend with fallback
 */
export async function fetchVehicleCategories(): Promise<VehicleCategory[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/vehicle-categories`, {
      cache: "no-store",
    });
    if (res.ok) {
      const categories = await res.json();
      if (Array.isArray(categories) && categories.length > 0) return categories;
    }
  } catch {
    // fallback below
  }
  return defaultVehicleCategories;
}

/**
 * Fetch a single vehicle category by slug from backend with fallback
 */
export async function fetchVehicleCategoryBySlug(slug: string): Promise<VehicleCategory | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/vehicle-categories/${slug}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const category = await res.json();
      return category;
    }
  } catch {
    // fallback below
  }
  return defaultVehicleCategories.find((c) => c.slug === slug) || null;
}

/**
 * Update Hero Section
 */
export async function updateHero(hero: Partial<HeroContent>) {
  const res = await fetch(`${BACKEND_URL}/api/hero`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(hero),
  });
  if (!res.ok) throw new Error("Failed to update hero");
  return res.json();
}

/**
 * Update Profile Section
 */
export async function updateProfile(profile: Partial<ProfileContent>) {
  const res = await fetch(`${BACKEND_URL}/api/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(profile),
  });
  if (!res.ok) throw new Error("Failed to update profile");
  return res.json();
}

/**
 * Create or Update Project
 */
export async function saveProject(project: Project, isNew: boolean = false) {
  const url = isNew
    ? `${BACKEND_URL}/api/projects`
    : `${BACKEND_URL}/api/projects/${project.slug}`;
  const method = isNew ? "POST" : "PUT";
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(project),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to save project");
  }
  return res.json();
}

/**
 * Delete Project
 */
export async function deleteProject(slug: string) {
  const res = await fetch(`${BACKEND_URL}/api/projects/${slug}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete project");
  return res.json();
}

/**
 * Create or Update Vehicle Category
 */
export async function saveVehicleCategory(
  category: VehicleCategory,
  isNew: boolean = false
) {
  const url = isNew
    ? `${BACKEND_URL}/api/vehicle-categories`
    : `${BACKEND_URL}/api/vehicle-categories/${category.slug}`;
  const method = isNew ? "POST" : "PUT";
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(category),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to save vehicle category");
  }
  return res.json();
}

/**
 * Delete Vehicle Category
 */
export async function deleteVehicleCategory(slug: string) {
  const res = await fetch(`${BACKEND_URL}/api/vehicle-categories/${slug}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete vehicle category");
  return res.json();
}

/**
 * Reorder Vehicle Categories (swapping, moving up/down, custom sequence)
 */
export async function reorderVehicleCategories(
  categoriesOrSlugs: VehicleCategory[] | string[]
) {
  const isCategoriesArray =
    Array.isArray(categoriesOrSlugs) &&
    categoriesOrSlugs.length > 0 &&
    typeof categoriesOrSlugs[0] === "object";

  const body = isCategoriesArray
    ? { categories: categoriesOrSlugs }
    : { slugs: categoriesOrSlugs };

  const res = await fetch(`${BACKEND_URL}/api/vehicle-categories-reorder`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to reorder vehicle categories");
  }
  return res.json();
}

// ---------------- MEDIA APIS ----------------

/**
 * Fetch all files in Media Library
 */
export async function fetchMediaList(): Promise<MediaItem[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/media`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch media");
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

/**
 * Delete file from Media Library
 */
export async function deleteMediaFile(filename: string) {
  const res = await fetch(`${BACKEND_URL}/api/media/${filename}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to delete file");
  }
  return res.json();
}

/**
 * Upload Image File to Backend
 */
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch(`${BACKEND_URL}/api/upload`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Image upload failed");
  }
  const data = await res.json();
  return data.url;
}

// ---------------- EXPERIENCES APIS ----------------

/**
 * Fetch all experience items with fallback
 */
export async function fetchExperiences(): Promise<ExperienceItem[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/experiences`, {
      cache: "no-store",
    });
    if (res.ok) {
      const exps = await res.json();
      if (Array.isArray(exps) && exps.length > 0) return exps;
    }
  } catch {
    // fallback below
  }
  return defaultExperiences;
}

/**
 * Create or Update Experience Item
 */
export async function saveExperience(
  experience: ExperienceItem,
  isNew: boolean = false
) {
  const url = isNew
    ? `${BACKEND_URL}/api/experiences`
    : `${BACKEND_URL}/api/experiences/${experience.id}`;
  const method = isNew ? "POST" : "PUT";
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(experience),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to save experience");
  }
  return res.json();
}

/**
 * Delete Experience Item
 */
export async function deleteExperience(id: string) {
  const res = await fetch(`${BACKEND_URL}/api/experiences/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete experience");
  return res.json();
}

// ---------------- PRODUCTIONS APIS ----------------

/**
 * Fetch all production credits with fallback
 */
export async function fetchProductions(): Promise<ProductionItem[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/productions`, {
      cache: "no-store",
    });
    if (res.ok) {
      const prods = await res.json();
      if (Array.isArray(prods) && prods.length > 0) return prods;
    }
  } catch {
    // fallback below
  }
  return defaultProductions;
}

/**
 * Create or Update Production Credit
 */
export async function saveProduction(
  production: ProductionItem,
  isNew: boolean = false
) {
  const url = isNew
    ? `${BACKEND_URL}/api/productions`
    : `${BACKEND_URL}/api/productions/${production.id}`;
  const method = isNew ? "POST" : "PUT";
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(production),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to save production credit");
  }
  return res.json();
}

/**
 * Delete Production Credit
 */
export async function deleteProduction(id: string) {
  const res = await fetch(`${BACKEND_URL}/api/productions/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete production credit");
  return res.json();
}

