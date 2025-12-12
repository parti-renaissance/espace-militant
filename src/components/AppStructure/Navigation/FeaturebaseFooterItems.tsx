import React from 'react'
import { ScrollView } from 'react-native'
import { RefreshCcw, CircleHelp, LifeBuoy } from '@tamagui/lucide-icons'
import { YStack } from 'tamagui'
import { VoxButton } from '@/components/Button'
import { NavItem } from './NavItem'
import type { IconComponent } from '@/models/common.model'
import { useOpenExternalContent } from '@/hooks/useOpenExternalContent'
import { useGetExecutiveScopes } from '@/services/profile/hook'

type FeaturebaseItem = {
  icon: IconComponent
  text: string
  externalUrlSlug?: string
}

const FEATUREBASE_ITEMS: FeaturebaseItem[] = [
  { icon: RefreshCcw, text: 'Dernières mises à jour', externalUrlSlug: '/', },
  { icon: CircleHelp, text: 'Demande de retours', externalUrlSlug: '/demandes-et-retours', },
  { icon: LifeBuoy, text: "Centre d'aide", externalUrlSlug: '/centre-d-aide', },
]

type FeaturebaseFooterItemProps = {
  variant: 'button' | 'navItem'
  onPress?: (item: FeaturebaseItem) => void
  collapsed?: boolean
}

export const FeaturebaseFooterItems = ({ variant, collapsed }: FeaturebaseFooterItemProps) => {
  const openExternalContentHook = useOpenExternalContent({ slug: 'cadre' })
  const { data: executiveScopes } = useGetExecutiveScopes();

  if (!executiveScopes?.default?.features?.includes('featurebase')) {
    return null;
  }
  
  const handleItemPress = (item: FeaturebaseItem) => {
    if (item.externalUrlSlug) {
      const stateUrl = `${item.externalUrlSlug}?scope=${executiveScopes?.default?.code}`;
      openExternalContentHook.open({ state: stateUrl })()
    }
  }

  if (variant === 'button') {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingRight: 32, paddingLeft: 16, paddingTop: 16 }}
      >
        {FEATUREBASE_ITEMS.map((item) => (
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
      {FEATUREBASE_ITEMS.map((item) => (
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
