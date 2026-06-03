import type { Meta, StoryObj } from '@storybook/react'
import { YStack } from 'tamagui'

import AppDownloadCTA from '@/components/ProfileCards/AppDownloadCTA/AppDownloadCTA'

const meta = {
  title: 'Profil CTA/App Download',
  component: AppDownloadCTA,
  decorators: [
    (Story) => (
      <YStack width={400} maxWidth="100%" padding="$medium" backgroundColor="$gray50">
        <Story />
      </YStack>
    ),
  ],
} satisfies Meta<typeof AppDownloadCTA>

export default meta

type Story = StoryObj<typeof AppDownloadCTA>

export const Large: Story = {
  args: {
    size: 'large',
  },
}

export const Medium: Story = {
  args: {
    size: 'medium',
  },
}

export const AllSizes: Story = {
  render: () => (
    <YStack gap="$large">
      <AppDownloadCTA size="large" />
      <AppDownloadCTA size="medium" />
    </YStack>
  ),
}
