import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // Ignore build output
  { ignores: ["dist"] },

  {
    // Base recommended rules
    extends: [js.configs.recommended, ...tseslint.configs.recommended],

    // Apply only to TS/TSX files
    files: ["**/*.{ts,tsx}"],

    // Language settings
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },

    // Plugins
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },

    // Custom rules
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
);
