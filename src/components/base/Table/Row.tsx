import { styled, ThemeableStack, withStaticProperties } from 'tamagui'

export const RowFrame = styled(ThemeableStack, {
  borderBottomWidth: 1,
  borderBottomColor: '$textOutline',
  overflow: 'hidden',
  padding: '$medium',
  gap: '$medium',
  flexDirection: 'row',
  alignContent: 'center',
  alignItems: 'center',
})

export const RowHeader = styled(RowFrame, {
  backgroundColor: '$gray1',
})

export const RowFooter = styled(RowFrame, {
  borderBottomWidth: 0,
})

const Row = withStaticProperties(RowFrame, {
  Header: RowHeader,
  Footer: RowFooter,
})

export default Row
