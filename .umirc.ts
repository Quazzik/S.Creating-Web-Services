import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/", component: "index" },
    { path: "/about", component: "about" },
    { path: "/feedback", component: "feedback" },
    { path: "/dictionaries", component: "dictionaries" },
    { path: "/cars", component: "cars" },
    { path: "/401", component: "401" },
  ],
  npmClient: 'npm',
  locale: {
    default: 'ru-RU',
    antd: true,
  },
});
