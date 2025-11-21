import React from 'react'
import { ScrollView } from 'react-native'
import { YStack } from 'tamagui'
import { RefreshCcw, CircleHelp, LifeBuoy } from '@tamagui/lucide-icons'
import { NavItem } from './NavItem'
import { VoxButton } from '@/components/Button'
import type { IconComponent } from '@/models/common.model'

type HelpMenuItem = {
  icon: IconComponent
  text: string
}

const HELP_MENU_ITEMS: HelpMenuItem[] = [
  { icon: RefreshCcw, text: 'Dernières mises à jour' },
  { icon: CircleHelp, text: 'Demande de retours' },
  { icon: LifeBuoy, text: "Centre d'aide" },
]

type HelpMenuItemsProps = {
  variant: 'button' | 'navItem'
  onPress?: (item: HelpMenuItem) => void
  collapsed?: boolean
}

export const HelpMenuItems = ({ variant, collapsed }: HelpMenuItemsProps) => {
  const handleItemPress = (item: HelpMenuItem) => {
    console.log('item', item)
  }

  if (variant === 'button') {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingRight: 32, paddingLeft: 16, paddingTop: 16 }}
      >
        {HELP_MENU_ITEMS.map((item) => (
          <VoxButton
            key={item.text}
            variant="outlined"
            theme="gray"
            iconLeft={item.icon}
            onPress={() => handleItemPress(item)}
          >
            {item.text}
          </VoxButton>
        ))}
      </ScrollView>
    )
  }

  // variant === 'navItem'
  return (
    <YStack gap={4}>
      {HELP_MENU_ITEMS.map((item) => (
        <NavItem
          key={item.text}
          iconLeft={item.icon}
          text={item.text}
          theme="purple"
          externalLink
          collapsed={collapsed}
          onPress={() => handleItemPress(item)}
        />
      ))}
    </YStack>
  )
}

