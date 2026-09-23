import type { NextConfig } from "next";

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' blob: data: https: http://localhost:5000 http://127.0.0.1:5000;
  font-src 'self' data: https://fonts.gstatic.com;
  connect-src 'self' http://localhost:5000 http://127.0.0.1:5000 https://docs.google.com https:;
  media-src 'self' blob: data:;
  frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com;
  frame-ancestors 'self';
  form-action 'self' https://docs.google.com;
  base-uri 'self';
  object-src 'none';
`.replace(/\s{2,}/g, " ").trim();

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Content-Security-Policy",
    value: cspHeader,
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
