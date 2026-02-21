import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/", component: "index" },
    { path: "/about", component: "about" },
    { path: "/feedback", component: "feedback" },
    { path: "/dictionaries", component: "dictionaries" }
  ],
  npmClient: 'npm',
  locale: {
    default: 'ru-RU',
    antd: true,
  },
});
