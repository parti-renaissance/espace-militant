import * as S from '@/features/message/components/Editor/schemas/messageBuilderSchema'
import { RestAvailableSendersResponse, RestGetMessageResponse } from '@/services/messages/schema'
import htmlNodeRenderer from './htmlNodeRenderer'

export const getHTML = (
  theme: S.MessageStyle, 
  x: S.Message, 
  sender?: RestAvailableSendersResponse[number] | null,
) => {
  return htmlNodeRenderer({ data: x, theme, sender })
}
export default htmlNodeRenderer
