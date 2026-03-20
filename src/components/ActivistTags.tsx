import { View, ViewProps } from 'tamagui'

import Badge from '@/components/Badge'

import { ActivistTag, ActivistTagTypes } from '@/data/Activist/schema'
import { getActivistTagTheme } from '@/data/Activist/utils'

export default function ActivistTags({ tags, ...props }: { tags: Array<ActivistTag> } & ViewProps) {
  return tags.length > 0 ? (
    <View flexDirection={'row'} gap={8} flexWrap={'wrap'} {...props}>
      {tags.map((el, index) => (
        <Badge key={`${el.code}-${index}`} theme={getActivistTagTheme(el.type as ActivistTagTypes)}>
          {el.label}
        </Badge>
      ))}
    </View>
  ) : null
}
