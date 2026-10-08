import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import flowbiteReact from "flowbite-react/plugin/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tailwindcss(), flowbiteReact()],
    server: {
      proxy: {
        "/api/v1/admins": {
          target: env.BACKEND_URL,
          changeOrigin: true,
          cookieDomainRewrite: "",
        },
      },
    },
  };
});
