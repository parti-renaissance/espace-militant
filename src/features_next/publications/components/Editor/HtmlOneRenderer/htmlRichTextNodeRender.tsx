import { CSSProperties } from 'react'
import { getThemeStyle } from '@/features_next/publications/components/Editor/hooks/useThemeStyle'
import * as S from '@/features_next/publications/components/Editor/schemas/messageBuilderSchema'
import { stringifyCSSProperties } from 'react-style-stringify'

export const richTextRenderer = (props: { theme: S.MessageStyle; data: S.RichTextNode; edgePosition?: 'leading' | 'trailing' | 'alone' }) => {
  const { wrapperStyle, containerStyle } = getThemeStyle(props.theme, props.data, props.edgePosition)
  if (!props.data.content) return ''
  const { html } = props.data.content

  // Ajout du style inline min-height:20px à chaque <p>
  const minHeightStyle = 'min-height:20px;';
  const htmlWithMinHeight = html.replace(/<p(.*?)>/g, `<p$1 style="${minHeightStyle}">`);

  const content = `<table
      align="center"
      width="100%"
      border="0"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="${stringifyCSSProperties(wrapperStyle as CSSProperties)}"
  >
    <tbody>
      <tr style="width:100%;" >
        <td class="padding-responsive" style="${stringifyCSSProperties(containerStyle as CSSProperties)}">
        ${htmlWithMinHeight}
        </td>
      </tr>
    </tbody>
  </table>`

  return content;
}
