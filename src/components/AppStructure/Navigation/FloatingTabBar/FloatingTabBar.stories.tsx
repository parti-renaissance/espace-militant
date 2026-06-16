import { StyleSheet, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Text, YStack } from 'tamagui'
import { Plus } from '@tamagui/lucide-icons'

import { VoxButton } from '@/components/Button'

import FloatingTabBar from './FloatingTabBar'
import { mockCadreSheetFooter, mockCadreSheetHeader } from './mockComponents'
import { mockCadreSheetItems, mockCadreTabItems, mockCadreTabItemsWithBadges, mockMembreTabItems } from './mockData'

const SURFACE_PAGE = '#FAF7F4'

const SCROLL_BLOCK_TEMPLATES = [
  { color: '#D4E8F7', title: 'Actualités' },
  { color: '#E8D4F0', title: 'Événements' },
  { color: '#D4F0E0', title: 'Actions' },
  { color: '#F7E8D4', title: 'Formations' },
  { color: '#F0D4D4', title: 'Publications' },
  { color: '#E0E4F0', title: 'Messagerie' },
  { color: '#D4F0F0', title: 'Débattre' },
  { color: '#F0E8D4', title: 'Soutenir' },
] as const

const SCROLL_BLOCKS = Array.from({ length: 16 }, (_, index) => {
  const template = SCROLL_BLOCK_TEMPLATES[index % SCROLL_BLOCK_TEMPLATES.length]
  const cycle = Math.floor(index / SCROLL_BLOCK_TEMPLATES.length) + 1

  return {
    color: template.color,
    title: cycle > 1 ? `${template.title} ${cycle}` : template.title,
  }
})

const ScrollablePageContent = () => (
  <YStack gap={12} padding={16} paddingBottom={200}>
    {SCROLL_BLOCKS.map((block, index) => (
      <View key={`${block.title}-${index}`} style={[styles.block, { backgroundColor: block.color }]}>
        <Text fontSize={16} fontWeight="700" color="#2A2422" marginBottom={8}>
          {block.title}
        </Text>
        <Text fontSize={14} lineHeight={20} color="#4A4340">
          Bloc {index + 1} — contenu scrollable sous la FloatingTabBar.
        </Text>
      </View>
    ))}
  </YStack>
)

const scrollablePageDecorator = (Story: React.ComponentType) => (
  <YStack flex={1} width="100%" maxWidth={500} minHeight={500} backgroundColor={SURFACE_PAGE} position="relative">
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <ScrollablePageContent />
    </ScrollView>
    <Story />
  </YStack>
)

const MockActionButton = () => (
  <VoxButton theme="pink" size="md" iconLeft={Plus} onPress={() => {}}>
    Action
  </VoxButton>
)

const cadreSheetProps = {
  cadreSheetItems: mockCadreSheetItems,
  cadreSheetHeader: mockCadreSheetHeader,
  cadreSheetFooter: mockCadreSheetFooter,
}

export default {
  title: 'Navigation/FloatingTabBar',
  component: FloatingTabBar,
  decorators: [scrollablePageDecorator],
}

export function NavMembre() {
  return <FloatingTabBar items={mockMembreTabItems} initialActiveId="accueil" />
}

export function NavCadre() {
  return <FloatingTabBar items={mockCadreTabItems} initialActiveId="accueil" {...cadreSheetProps} />
}

export function NavCadreAvecActionEtBadge() {
  return <FloatingTabBar items={mockCadreTabItemsWithBadges} initialActiveId="accueil" floatingContent={<MockActionButton />} {...cadreSheetProps} />
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  block: {
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
  },
})
