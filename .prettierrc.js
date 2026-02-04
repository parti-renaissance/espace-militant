/** @typedef  {import("prettier").Config} PrettierConfig */
/** @typedef  {import("@ianvs/prettier-plugin-sort-imports").PluginConfig} SortImportsConfig */

/** @type { PrettierConfig | SortImportsConfig | TailwindConfig } */
const config = {
  plugins: ['@ianvs/prettier-plugin-sort-imports'],
  importOrder: [
    '^react$',
    '^react-native(.*)$',
    '^@react-(.*)$',
    '^expo(.*)$',
    '^tamagui(.*)$',
    '^@tamagui/(.*)$',
    '<THIRD_PARTY_MODULES>',
    '',
    '^@/components/(.*)$',
    '^@/features.*$',
    '',
    '^@/(.*)$',
    '',
    '^[./]',
  ],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrderTypeScriptVersion: '4.4.0',
  endOfLine: 'lf',
  printWidth: 160,
  semi: false,
  singleQuote: true,
  jsxSingleQuote: false,
  trailingComma: 'all',
}

module.exports = config
