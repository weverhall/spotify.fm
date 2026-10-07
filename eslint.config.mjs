import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import stylisticPlugin from "@stylistic/eslint-plugin";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    files: ["**/*.ts","**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        tsconfigRootDir: process.cwd(),
        project: ["./tsconfig.json"],
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "@stylistic": stylisticPlugin,
    },
    rules: {
      "@stylistic/semi":"error",
      "@typescript-eslint/no-unsafe-assignment":"error",
      "@typescript-eslint/no-explicit-any":"error",
      "@typescript-eslint/no-unused-vars":["error",{argsIgnorePattern:"^_"}],
      "@typescript-eslint/restrict-template-expressions":"error",
      "@typescript-eslint/restrict-plus-operands":"error",
      "@next/next/no-html-link-for-pages":"off",
    },
  },
  {
    files: ["tests/unit/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any":"off",
      "@typescript-eslint/no-unsafe-assignment":"off",
    },
  },
]);
