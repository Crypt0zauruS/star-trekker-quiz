const ContentSecurityPolicy = `
  default-src 'self' vercel.live;
  script-src 'self' 'unsafe-eval' 'unsafe-inline' cdn.vercel-insights.com vercel.live;
  style-src 'self' 'unsafe-inline' cdnjs.cloudflare.com googleapis.com fonts.googleapis.com;
  media-src 'none';
  img-src * data: cdn.vercel-insights.com vercel.live cdnjs.cloudflare.com *.walletconnect.com *.walletconnect.org;
  connect-src * *.walletconnect.com *.walletconnect.org;
  font-src 'self' fonts.gstatic.com;
  frame-src * *.walletconnect.com *.walletconnect.org;
`.replace(/\n/g, "");

const securityHeaders = [
  { key: "Content-Security-Policy", value: ContentSecurityPolicy },
  { key: "Referrer-Policy", value: "origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },

  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
