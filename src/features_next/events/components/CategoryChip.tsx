import VoxCard from '@/components/VoxCard/VoxCard'
import { Calendar } from '@tamagui/lucide-icons'

export const CategoryChip = ({ children }: { children?: string }) => {
  return (
    <VoxCard.Chip icon={Calendar} theme="blue" testID="event-category-chip">
      {children ?? 'Évenement'}
    </VoxCard.Chip>
  )
}
