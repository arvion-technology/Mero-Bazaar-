// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
<<<<<<< HEAD
  ...tseslint.configs.recommended,
=======
  ...tseslint.configs.recommendedTypeChecked,
>>>>>>> origin/aashika
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
<<<<<<< HEAD
=======
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
>>>>>>> origin/aashika
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
<<<<<<< HEAD
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
=======
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      "prettier/prettier": ["error", { endOfLine: "auto" }],
>>>>>>> origin/aashika
    },
  },
);
