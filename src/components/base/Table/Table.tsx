import { ScrollView, styled, ThemeableStack, withStaticProperties } from 'tamagui'

const style = {
  borderColor: '$textOutline',
  backgroundColor: 'white',
  overflow: 'hidden',
  flexDirection: 'row',
  variants: {
    splited: {
      start: {
        borderLeftWidth: 1,
        borderTopWidth: 1,
        borderTopLeftRadius: '$space.small',
      },
      end: {
        borderTopRightRadius: '$space.small',
        borderRightWidth: 1,
        borderTopWidth: 1,
      },
      top: {
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderLeftWidth: 1,
        borderTopLeftRadius: '$space.small',
        borderTopRightRadius: '$space.small',
      },
      bottom: {
        borderBlockEndWidth: 1,
        borderBottomLeftRadius: '$space.small',
        borderBottomRightRadius: '$space.small',
        borderWidth: 1,
        borderTopWidth: 0,
      },
      false: {
        borderWidth: 1,
        borderRadius: '$space.small',
      },
    },
  } as const,
  defaultVariants: {
    splited: false,
  },
} as const

export const FixedTableFrame = styled(ThemeableStack, style)
export const ScrollableTableFrame = styled(ScrollView, {
  borderColor: '$textOutline',
  backgroundColor: 'white',
  contentContainerStyle: {
    flexDirection: 'row',
    flexGrow: 1,
  },
  variants: style.variants,
  defaultVariants: style.defaultVariants,
})

export const TableFrame = withStaticProperties(FixedTableFrame, {
  ScrollView: ScrollableTableFrame,
})
