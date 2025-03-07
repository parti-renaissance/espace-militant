// import { CSSProperties } from 'react'
// import { getThemeStyle } from '@/features/message/components/Editor/hooks/useThemeStyle'
import * as S from '@/features/message/components/Editor/schemas/messageBuilderSchema'

// import { stringifyCSSProperties } from 'react-style-stringify'

export const containerRenderer = (props: { data: string; theme: S.MessageStyle }) => {
  return props.data
}
