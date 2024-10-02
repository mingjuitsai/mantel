import globals from "globals";
import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    files: ["**/*.js"], languageOptions: {
      sourceType: "module", globals: {
        ...globals.browser,
        ...globals.node,
      },
    }
  },
  { languageOptions: { globals: globals.browser } },
];