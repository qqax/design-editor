import baseConfig from './eslint/eslint.config.mjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ESLINT_DISABLED_FILES } from './eslint/disabledFiles.js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default [
  {
    name: 'global-ignores',
    ignores: [
      '**/dist/**',
      '**/.next/**',
      '**/node_modules/**',
      ...ESLINT_DISABLED_FILES
    ],
  },

  ...baseConfig,

  {
    name: 'override',
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        tsconfigRootDir: __dirname,
      },
    },
    settings: {
      'import-x/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      'import-x/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: true,
        },
      ],
      'id-length': [
        'error',
        {
          min: 1,
          max: 50,
          exceptions: ['z', 'e', 'i', 'j', 'k', '_'],
          properties: 'always',
          exceptionPatterns: ['^[0-9]+$'],
        },
      ],
      "react/no-unknown-property": [
        "error",
        {
          "ignore": ["cmdk-input-wrapper"]
        }
      ],
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-invalid-void-type': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      'import-x/prefer-default-export': 'off',
      'no-console': 'error',
      'import-x/no-cycle': 'off',
      'import-x/extensions': 'off',
      'react/jsx-fragments': ['error', 'element'],
      'jsx-a11y/click-events-have-key-event': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/anchor-is-valid': 'off',
      'jsx-a11y/no-noninteractive-element-interactions': 'off',
      'react/require-default-props': 'off',
      '@typescript-eslint/no-floating-promises': 'error',
      'no-void': 'off',
      'no-irregular-whitespace': 'off',
      'default-case': 'off',
      'no-nested-ternary': 'off',
      'consistent-return': 'off',
      'import-x/no-unresolved': 'off',
      'import-x/export': 'off',
      'import-x/no-namespace': 'off',
      'react/function-component-definition': 'off',
      'react/jsx-no-bind': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
    },
  },

  eslintPluginPrettierRecommended,
];
