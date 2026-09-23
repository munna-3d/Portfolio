
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

async function run() {
  console.log("=== MOON 3D STUDIO PRODUCTION LAUNCH AUDIT & VERIFICATION ===");

  // 1. Health check
  console.log("\n[1] Checking Backend Health...");
  try {
    const healthRes = await fetch(`${BACKEND_URL}/api/health`);
    assert(healthRes.ok, `Backend /api/health returned ${healthRes.status}`);
  } catch (err) {
    assert(false, `Backend connection failed: ${err.message}`);
  }

  // 2. Submit Contact Enquiry
  console.log("\n[2] Testing Public Contact Enquiry Submission (POST /api/enquiries)...");
  let testEnquiryId = null;
  try {
    const submitRes = await fetch(`${BACKEND_URL}/api/enquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "QA Production Lead",
        email: "lead.qa@moon3dstudio.test",
        phone: "+91 9998887776",
        category: "Freelance Work",
        message: "E2E verification of Moon 3D Studio production inquiry pipeline.",
      }),
    });
    assert(submitRes.status === 201, `Submission status is 201 Created (got ${submitRes.status})`);
    const submitData = await submitRes.json();
    assert(submitData.enquiry && submitData.enquiry.id, `Enquiry created with ID ${submitData.enquiry?.id}`);
    assert(submitData.enquiry.status === "unread", "Initial enquiry status is 'unread'");
    testEnquiryId = submitData.enquiry?.id;
  } catch (err) {
    assert(false, `Enquiry submission failed: ${err.message}`);
  }

  // 3. Admin Authentication
  console.log("\n[3] Testing Admin Authentication (POST /api/auth/login)...");
  let authToken = null;
  try {
    const loginRes = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "admin123" }),
    });
    assert(loginRes.ok, `Admin login returned ${loginRes.status}`);
    const loginData = await loginRes.json();
    authToken = loginData.token;
    assert(!!authToken, "JWT Auth token received successfully");
  } catch (err) {
    assert(false, `Admin login failed: ${err.message}`);
  }

  // 4. Admin Fetch Enquiries
  console.log("\n[4] Testing Admin Enquiries Retrieval (GET /api/enquiries)...");
  try {
    const listRes = await fetch(`${BACKEND_URL}/api/enquiries`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    assert(listRes.ok, `GET /api/enquiries returned ${listRes.status}`);
    const list = await listRes.json();
    assert(Array.isArray(list), "Enquiries payload is an Array");
    const found = list.find((e) => e.id === testEnquiryId);
    assert(!!found, `Created test enquiry found in Admin Inbox (Total in DB: ${list.length})`);
  } catch (err) {
    assert(false, `Admin enquiries list failed: ${err.message}`);
  }

  // 5. Admin Update Enquiry Status
  console.log("\n[5] Testing Admin Enquiry Status Update (PATCH /api/enquiries/:id/status)...");
  try {
    const patchRes = await fetch(`${BACKEND_URL}/api/enquiries/${testEnquiryId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ status: "read" }),
    });
    assert(patchRes.ok, `PATCH status returned ${patchRes.status}`);
    const patchData = await patchRes.json();
    assert(patchData.enquiry.status === "read", "Status updated to 'read'");
  } catch (err) {
    assert(false, `Admin status patch failed: ${err.message}`);
  }

  // 6. Security Check: Public Content Endpoint Data Privacy
  console.log("\n[6] Testing Public Content API Privacy (/api/content)...");
  try {
    const contentRes = await fetch(`${BACKEND_URL}/api/content`);
    const content = await contentRes.json();
    assert(!content.admin, "admin credentials strictly excluded from public content");
    assert(!content.enquiries, "client enquiries strictly excluded from public content");
  } catch (err) {
    assert(false, `Public content check failed: ${err.message}`);
  }

  // 7. Next.js Robots.txt
  console.log("\n[7] Testing Next.js robots.txt (/robots.txt)...");
  try {
    const robotsRes = await fetch(`${NEXT_URL}/robots.txt`);
    assert(robotsRes.ok, `GET /robots.txt returned ${robotsRes.status}`);
    const robotsText = await robotsRes.text();
    assert(robotsText.includes("Disallow: /admin"), "robots.txt blocks /admin");
    assert(robotsText.includes("Disallow: /api/"), "robots.txt blocks /api/");
    assert(robotsText.includes("sitemap.xml"), "robots.txt points to sitemap.xml");
  } catch (err) {
    assert(false, `robots.txt check failed: ${err.message}`);
  }

  // 8. Next.js Sitemap.xml
  console.log("\n[8] Testing Next.js sitemap.xml (/sitemap.xml)...");
  try {
    const sitemapRes = await fetch(`${NEXT_URL}/sitemap.xml`);
    assert(sitemapRes.ok, `GET /sitemap.xml returned ${sitemapRes.status}`);
    const sitemapText = await sitemapRes.text();
    assert(sitemapText.includes("<loc>"), "sitemap.xml contains valid XML loc tags");
    assert(sitemapText.includes("projects/vehicle-art"), "sitemap contains vehicle-art route");
    assert(sitemapText.includes("sports-cars"), "sitemap contains sports-cars category");
  } catch (err) {
    assert(false, `sitemap.xml check failed: ${err.message}`);
  }

  // 9. Next.js Security Headers
  console.log("\n[9] Testing Production Security Headers on / ...");
  try {
    const homeRes = await fetch(`${NEXT_URL}/`);
    assert(homeRes.ok, `GET / returned ${homeRes.status}`);
    const headers = homeRes.headers;
    assert(headers.get("x-frame-options") === "SAMEORIGIN", `X-Frame-Options: ${headers.get("x-frame-options")}`);
    assert(headers.get("x-content-type-options") === "nosniff", `X-Content-Type-Options: ${headers.get("x-content-type-options")}`);
    assert(headers.get("referrer-policy") === "strict-origin-when-cross-origin", `Referrer-Policy: ${headers.get("referrer-policy")}`);
    assert(headers.has("permissions-policy"), `Permissions-Policy present: ${headers.get("permissions-policy")}`);
  } catch (err) {
    assert(false, `Security headers check failed: ${err.message}`);
  }

  // 10. Next.js 404 Page
  console.log("\n[10] Testing Custom Branded 404 Page...");
  try {
    const notFoundRes = await fetch(`${NEXT_URL}/route-that-does-not-exist`);
    assert(notFoundRes.status === 404, `Unknown route returned 404 status (got ${notFoundRes.status})`);
    const notFoundText = await notFoundRes.text();
    assert(notFoundText.includes("Digital Coordinates Not Found") || notFoundText.includes("404"), "Custom 404 text rendered");
  } catch (err) {
    assert(false, `404 check failed: ${err.message}`);
  }

  // 11. Public Route Reachability Check
  console.log("\n[11] Testing Public Route Reachability...");
  const routes = [
    "/",
    "/contact",
    "/projects/vehicle-art",
    "/projects/vehicle-art/sports-cars",
    "/projects/vehicle-art/off-road",
    "/projects/vehicle-art/sci-fi",
    "/projects/vehicle-art/trucks",
    "/projects/vehicle-art/bikes",
    "/projects/vehicle-art/concept",
    "/projects/hard-surface-asset",
    "/projects/environment-design",
  ];

  for (const route of routes) {
    try {
      const res = await fetch(`${NEXT_URL}${route}`);
      assert(res.ok, `Route ${route} returned HTTP ${res.status}`);
    } catch (err) {
      assert(false, `Route ${route} failed: ${err.message}`);
    }
  }

  console.log("\n=======================================================");
  if (failures === 0) {
    console.log("✅ ALL AUDIT VERIFICATION CHECKS PASSED PERFECTLY!");
  } else {
    console.error(`❌ ${failures} VERIFICATION CHECKS FAILED.`);
  }
  console.log("=======================================================");
}

run();
