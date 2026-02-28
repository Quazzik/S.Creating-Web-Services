import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/", component: "index" },
    { path: "/about", component: "about" },
    { path: "/feedback", component: "feedback" },
    { path: "/dictionaries", component: "dictionaries" },
    { path: "/403", component: "403" },
  ],
  npmClient: 'npm',
  locale: {
    default: 'ru-RU',
    antd: true,
  },
});
