// vite.config.js
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        host: true, // listen on all addresses (0.0.0.0)
        port: 5173, // optional, default is 5173
    },
});
