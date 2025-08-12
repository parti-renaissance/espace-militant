/** @type{import("@storybook/react-native").StorybookConfig} */
module.exports = {
  stories: ['../src/**/*.stories.?(ts|tsx|js|jsx)', '../src/screens/**/*.stories.?(ts|tsx|js|jsx)'],
  addons: [
    '@storybook/addon-ondevice-controls',
    '@storybook/addon-ondevice-actions',
    '@storybook/addon-docs',
    '@storybook/addon-essentials',
  ],
  framework: {
    name: '@storybook/react-native',
    options: {},
  },
  docs: {
    autodocs: true,
    defaultName: 'Documentation',
  },
}
