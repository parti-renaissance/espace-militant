import { buttonRenderer } from '@/features/message/components/Editor/HtmlOneRenderer/htmlButtonNodeRenderer'
import { imageRenderer } from '@/features/message/components/Editor/HtmlOneRenderer/htmlImageNodeRenderer'
import { richTextRenderer } from '@/features/message/components/Editor/HtmlOneRenderer/htmlRichTextNodeRender'
import * as S from '@/features/message/components/Editor/schemas/messageBuilderSchema'
import { RestAvailableSendersResponse } from '@/services/messages/schema'
import { containerRenderer } from './htmlContainerRenderer'

const renderNode = (props: { theme: S.MessageStyle; data: S.Node; edgePosition?: 'leading' | 'trailing' | 'alone' }) => {
  switch (props.data.type) {
    case 'image':
      return imageRenderer({ theme: props.theme, data: props.data, edgePosition: props.edgePosition })
    case 'button':
      return buttonRenderer({ theme: props.theme, data: props.data, edgePosition: props.edgePosition })
    case 'richtext':
      return richTextRenderer({ theme: props.theme, data: props.data, edgePosition: props.edgePosition })

    default:
      return null
  }
}

const htmlNodeRenderer = (props: { 
  data: S.Message; 
  theme: S.MessageStyle;
  sender?: RestAvailableSendersResponse[number] | null;
}) => {
  const getFieldEdge = (index: number) => {
    if (index === 0 && props.data?.content.length === 1) {
      return 'alone'
    } else if (index === 0) {
      return 'leading'
    } else if (index === props.data?.content.length - 1) {
      return 'trailing'
    }
    return undefined
  }

  return containerRenderer({
    theme: props.theme,
    content:
      props.data?.content
        .map((item, index) => renderNode({ data: item, edgePosition: getFieldEdge(index), theme: props.theme }))
        .filter(Boolean)
        .join('') ?? '',
    sender: props.sender,
    subject: props.data?.metaData?.subject,
  })
}

export default htmlNodeRenderer
