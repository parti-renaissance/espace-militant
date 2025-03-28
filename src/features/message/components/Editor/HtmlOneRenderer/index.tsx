import * as S from '@/features/message/components/Editor/schemas/messageBuilderSchema'
import htmlNodeRenderer from './htmlNodeRenderer'

export const getHTML = (theme: S.MessageStyle, x: S.Message) => {
  return htmlNodeRenderer({ data: x, theme })
}
export default htmlNodeRenderer
