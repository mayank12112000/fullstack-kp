import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
  ],
})
