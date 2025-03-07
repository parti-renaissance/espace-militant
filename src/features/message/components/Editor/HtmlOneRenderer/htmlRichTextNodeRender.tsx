import { CSSProperties } from 'react'
import { getThemeStyle } from '@/features/message/components/Editor/hooks/useThemeStyle'
import * as S from '@/features/message/components/Editor/schemas/messageBuilderSchema'
import { stringifyCSSProperties } from 'react-style-stringify'

export const richTextRenderer = (props: { theme: S.MessageStyle; data: S.RichTextNode; edgePosition?: 'leading' | 'trailing' | 'alone' }) => {
  const { wrapperStyle } = getThemeStyle(props.theme, props.data, props.edgePosition)
  if (!props.data.content) return ''
  const { html } = props.data.content

  return `<table
      align="center"
      width="100%"
      border="0"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="${stringifyCSSProperties(wrapperStyle as CSSProperties)}"
  >
    <tbody>
      <tr style="width:100%">
        <td>
        ${html}
        </td>
      </tr>
    </tbody>
  </table>`
}
