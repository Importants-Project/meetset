import {fileURLToPath, URL} from "node:url";
import path from 'path';

import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    build: {
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, "index.html"),
                home: path.resolve(__dirname, "src/views/Home.vue"),
                calendar: path.resolve(__dirname, "src/views/Calendar.vue"),
                admin: path.resolve(__dirname, "src/views/Admin.vue"),
            },
        },
    },

    server: {
        host: true,
    },
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `@import "@/assets/main.scss";`,
                },
            },
        },
    },
});
