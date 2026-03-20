import { createRequire } from 'node:module'
import eslint from '@eslint/js'
import reactHooks from 'eslint-plugin-react-hooks'
import unusedImports from 'eslint-plugin-unused-imports'
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'

const require = createRequire(import.meta.url)
const reactHooksPlatformOS = require('./eslint-rules/index.js')

export default defineConfig(
  {
    ignores: [
      'dist/**',
      '**/node_modules/**',
      'android/app/build/**',
      'ios/build/**',
      '.expo/**',
      '**/mapbox-gl*.js',
      'src/screens/**',
      // Config / tooling (Node env, CommonJS)
      '.prettierrc.js',
      'babel.config.js',
      'metro.config.cjs',
      'vite.worker.config.js',
      // Scripts (CI, build, prepare)
      '.github/scripts/**',
      'scripts/**',
      // Generated / third-party
      '.tamagui/**',
      'themes.ts',
      '.storybook/**',
      'assets/fonts/generated-*',
      'assets/images/generated-*',
      'public/firebase-messaging-sw.js',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  // Désactiver rules-of-hooks et utiliser notre règle qui autorise le garde Platform.OS (optimisation RN web)
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      'react-hooks-platform-os': reactHooksPlatformOS,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'off',
      'react-hooks-platform-os/rules-of-hooks-allow-platform-os': 'error',
    },
  },
  {
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      'no-console': 'warn',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
)
