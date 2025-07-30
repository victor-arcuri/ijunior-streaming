import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  ...tseslint.configs.recommended,

  // Disable formatting rules (interference with Prettier)
  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    name: 'disable-style-conflicts',
    rules: {
      ...prettier.rules,
    },
  },
]);
