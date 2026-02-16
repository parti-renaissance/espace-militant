import { useState } from 'react'
import { YStack } from 'tamagui'
import { StoryObj } from '@storybook/react'

import { VoxButton } from '@/components/Button'

import OnboardModal from './OnboardModal'

const meta = {
  title: 'Onboard/OnboardModal',
  component: OnboardModal,
  argTypes: {
    open: {
      control: 'boolean',
      description: "Contrôle l'ouverture du modal",
    },
  },
}

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { open: false, onClose: () => {} },
  render: function ProfilsStory() {
    const [openAdherent, setOpenAdherent] = useState(false)
    const [openSympathisant, setOpenSympathisant] = useState(false)
    const [openCadre, setOpenCadre] = useState(false)
    return (
      <YStack gap="$medium" width={250}>
        <VoxButton theme="blue" onPress={() => setOpenAdherent(true)} width="100%">
          Adhérent
        </VoxButton>
        <VoxButton theme="blue" onPress={() => setOpenSympathisant(true)} width="100%">
          Sympathisant
        </VoxButton>
        <VoxButton theme="purple" onPress={() => setOpenCadre(true)} width="100%">
          Cadre
        </VoxButton>

        <OnboardModal
          open={openAdherent}
          onClose={() => setOpenAdherent(false)}
          profileOverride={{
            first_name: 'Marie',
            tags: [{ code: 'adherent:a_jour_2026' }],
            cadre_access: false,
          }}
        />
        <OnboardModal
          open={openSympathisant}
          onClose={() => setOpenSympathisant(false)}
          profileOverride={{
            first_name: 'Jean',
            tags: [{ code: 'sympathisant:autre_parti' }],
            cadre_access: false,
          }}
        />
        <OnboardModal
          open={openCadre}
          onClose={() => setOpenCadre(false)}
          profileOverride={{
            first_name: 'Pierre',
            tags: [{ code: 'adherent:a_jour_2026' }],
            cadre_access: true,
          }}
        />
      </YStack>
    )
  },
}

export default meta
