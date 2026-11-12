import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",

    // Archived backups and temporary scripts
    "backup-*/**",
    "**/*.backup.*",
    "**/*.before-*",
    "**/page.backup.tsx",
    "add-voice-button.cjs",
    "add-voice-isolation.cjs",
    "fix-voice-isolation.cjs",
  ]),
]);

export default eslintConfig;