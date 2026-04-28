import { CSSProperties } from 'react'
import { stringifyCSSProperties } from 'react-style-stringify'

import { getThemeStyle } from '@/features_next/publications/components/Editor/hooks/useThemeStyle'
import * as S from '@/features_next/publications/components/Editor/schemas/messageBuilderSchema'

const HEADING_BASE = 'font-family:Public Sans,Helvetica,Arial,sans-serif;font-weight:600;line-height:1.35;color:hsl(211,24%, 17%);'

const HEADING_STYLES: Record<string, string> = {
  h1: 'font-size:28px;margin:0 0 16px 0;',
  h2: 'font-size:22px;margin:32px 0 12px 0;',
  h3: 'font-size:19px;margin:24px 0 8px 0;',
  h4: 'font-size:17px;margin:20px 0 8px 0;',
  h5: 'font-size:15px;margin:16px 0 6px 0;',
  h6: 'font-size:14px;margin:16px 0 6px 0;',
}

function applyStyleToTag(html: string, tag: string, styleToInject: string): string {
  const regex = new RegExp(`<${tag}([^>]*)>`, 'gi')
  return html.replace(regex, (fullTag, attributes) => {
    if (attributes.includes('style=')) {
      return fullTag.replace(/style=(["'])(.*?)\1/i, `style=$1$2;${styleToInject}$1`)
    }
    return `<${tag}${attributes} style="${styleToInject}">`
  })
}

export const richTextRenderer = (props: { theme: S.MessageStyle; data: S.RichTextNode; edgePosition?: 'leading' | 'trailing' | 'alone' }) => {
  const { wrapperStyle, containerStyle } = getThemeStyle(props.theme, props.data, props.edgePosition)

  if (!props.data.content?.html) return ''

  let processedHtml = props.data.content.html
  processedHtml = processedHtml.replace(/<p>\s*<br\s*\/?>\s*<\/p>/gi, '<p><br /><br /></p>')
  processedHtml = applyStyleToTag(processedHtml, 'p', 'min-height:20px;')

  Object.entries(HEADING_STYLES).forEach(([tag, style]) => {
    processedHtml = applyStyleToTag(processedHtml, tag, `${HEADING_BASE}${style}`)
  })

  return `
    <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="${stringifyCSSProperties(wrapperStyle as CSSProperties)}">
      <tbody>
        <tr style="width:100%;">
          <td class="padding-responsive" style="${stringifyCSSProperties(containerStyle as CSSProperties)}">
            ${processedHtml}
          </td>
        </tr>
      </tbody>
    </table>`
}
