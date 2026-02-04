import { Calendar } from '@tamagui/lucide-icons'

import VoxCard from '@/components/VoxCard/VoxCard'

export const CategoryChip = ({ children }: { children?: string }) => {
  return (
    <VoxCard.Chip icon={Calendar} theme="blue" testID="event-category-chip">
      {children ?? 'Évenement'}
    </VoxCard.Chip>
  )
}
