import { routes, type VercelConfig } from "@vercel/config/v1";

const BACKEND_URL = process.env.BACKEND_URL;

if (!BACKEND_URL) {
  throw new Error("BACKEND_URL 환경변수가 설정되지 않았습니다.");
}

export const config: VercelConfig = {
  rewrites: [
    routes.rewrite("/api/:path*", `${BACKEND_URL}/api/:path*`),

    routes.rewrite("/(.*)", "/index.html"),
  ],
};
