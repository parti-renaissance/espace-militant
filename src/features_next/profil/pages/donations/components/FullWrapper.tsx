import Text from '@/components/base/Text'
import VoxCard from '@/components/VoxCard/VoxCard'

export const FullWrapper = (props: { children: React.ReactNode; title: string; full?: boolean }) =>
  props.full ? (
    <VoxCard>
      <VoxCard.Content>
        <Text.LG>{props.title}</Text.LG>
        {props.children}
      </VoxCard.Content>
    </VoxCard>
  ) : (
    props.children
  )
