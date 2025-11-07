import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import json from "@eslint/json";
import css from "@eslint/css";
import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default defineConfig([
  // 🌐 Base JS + TS config
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },

  // 🟦 TypeScript rules
  tseslint.configs.recommended,

  // 📄 JSON rules (for configs, but not lockfiles)
  {
    files: ["**/*.json"],
    plugins: { json },
    language: "json/json",
    extends: ["json/recommended"],
  },

  // 🎨 CSS linting
  {
    files: ["**/*.css"],
    plugins: { css },
    language: "css/css",
    extends: ["css/recommended"],
  },

  // 🧹 Ignore files you don’t want ESLint to scan
  {
    ignores: ["node_modules/**", "dist/**", "package-lock.json"],
  },

  // ✨ Prettier (disables conflicting ESLint formatting rules)
  eslintConfigPrettier,
]);
