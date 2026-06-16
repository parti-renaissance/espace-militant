import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { YStack } from 'tamagui'

/** @type{import("@storybook/react").Preview} */
const preview = {
  parameters: {
    noBackground: true,
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },

  decorators: [
    (Story) => (
      <GestureHandlerRootView style={{ flex: 1, width: '100%' }}>
        <YStack flex={1} width="100%" backgroundColor="$white1" justifyContent="center" alignItems="center">
          <YStack flex={1} width="100%" $gtSm={{ maxWidth: 800 }} backgroundColor="$white1" justifyContent="center" alignItems="center">
            <Story />
          </YStack>
        </YStack>
      </GestureHandlerRootView>
    ),
  ],
}

export default preview
