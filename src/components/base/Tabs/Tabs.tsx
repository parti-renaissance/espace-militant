import { XStack, YStack } from 'tamagui'

import Text from '@/components/base/Text'

type TabItem<TabId extends string> = {
  id: TabId
  label: string
}

type TabsProps<TabId extends string> = {
  tabs: TabItem<TabId>[]
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

export default function Tabs<TabId extends string>({ tabs, activeTab, onTabChange }: TabsProps<TabId>) {
  return (
    <XStack borderBottomWidth={2} borderColor="$borderColor" paddingHorizontal="$medium" mt="$xsmall">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <YStack
            key={tab.id}
            onPress={() => onTabChange(tab.id)}
            paddingVertical={12}
            marginBottom={-1}
            flex={1}
            flexShrink={0}
            cursor="pointer"
            group
            backgroundColor="transparent"
            hoverStyle={{ backgroundColor: 'transparent' }}
            pressStyle={{ backgroundColor: 'transparent' }}
            role="tab"
            aria-selected={isActive}
          >
            <YStack position="relative">
              <Text.MD
                semibold
                textAlign="center"
                color={isActive ? '$blue5' : '$textPrimary'}
                $group-hover={!isActive ? { color: '$blue4' } : undefined}
                $group-press={!isActive ? { color: '$blue4' } : undefined}
              >
                {tab.label}
              </Text.MD>
            </YStack>
            {isActive && <XStack position="absolute" bottom={-1} left={1} right={1} height={2} backgroundColor="$blue5" borderRadius={1} />}
          </YStack>
        )
      })}
    </XStack>
  )
}
