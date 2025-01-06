import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ),
  {
    rules: {
      "react/display-name": "off",
      "@next/next/no-img-element": "off",
      "react/no-unescaped-entities": "off",
      "import/no-anonymous-default-export": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-explicit-any": ["off", { ignoreRestArgs: true }],
      "newline-before-return": "error",
      "import/newline-after-import": ["error", { count: 1 }],
      "@typescript-eslint/ban-types": [
        "error",
        {
          extendDefaults: true,
          types: {
            "{}": false,
          },
        },
      ],
    },
    plugins: ["jsx-a11y"],
    settings: {
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: ["./tsconfig.json"],
        },
      },
    },
  },
];

export default eslintConfig;
