import Badge from '@/components/Badge'
import { ActivistTag } from '@/data/Activist/schema'
import { getActivistTagTheme } from '@/data/Activist/utils'
import { View, ViewProps } from 'tamagui'

export default function ActivistTags({ tags, ...props }: { tags: Array<ActivistTag> } & ViewProps) {
  return tags.length > 0 ? (
    <View flexDirection={'row'} gap={8} flexWrap={'wrap'} {...props}>
      {tags.map((el) => (
        <Badge key={el.type} theme={getActivistTagTheme(el.type)}>
          {el.label}
        </Badge>
      ))}
    </View>
  ) : null
}
