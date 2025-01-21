import { ComponentPropsWithoutRef } from 'react'
import { VoxButton } from '@/components/Button'
import { ChevronLeft, ChevronRight } from '@tamagui/lucide-icons'

export default function NavItem({ arrow, ...props }: ComponentPropsWithoutRef<typeof VoxButton> & { arrow?: 'left' | 'right' }) {
  return (
    <VoxButton variant="soft" size="sm" {...props} borderRadius="$space.small" shrink theme="gray" iconLeft={arrow === 'left' ? ChevronLeft : ChevronRight} />
  )
}
