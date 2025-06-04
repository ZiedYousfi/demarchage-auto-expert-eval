import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";


export default [
  {
    ignores: ["**/node_modules/**", "**/dist/**"]
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node }
    }
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
];
