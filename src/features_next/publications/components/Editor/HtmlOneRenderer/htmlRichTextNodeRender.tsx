import { CSSProperties } from 'react'
import { stringifyCSSProperties } from 'react-style-stringify'

import { getThemeStyle } from '@/features_next/publications/components/Editor/hooks/useThemeStyle'
import * as S from '@/features_next/publications/components/Editor/schemas/messageBuilderSchema'

/** Texte secondaire (même jeton que VoxRichText aperçu / TipTapRenderer $gray8). Le primaire est hsl(211,24%, 17%). */
const HEADING_EMAIL_BASE = 'font-family:Public Sans,Helvetica,Arial,sans-serif;font-weight:600;line-height:1.35;hsl(211,24%, 17%)'

const HEADING_EMAIL: Record<string, string> = Object.fromEntries(
  (
    [
      ['h1', '28px', '0px 0 16px 0'],
      ['h2', '22px', '32px 0 12px 0'],
      ['h3', '19px', '24px 0 8px 0'],
      ['h4', '17px', '20px 0 8px 0'],
      ['h5', '15px', '16px 0 6px 0'],
      ['h6', '14px', '16px 0 6px 0'],
    ] as const
  ).map(([tag, size, margin]) => [tag, `${HEADING_EMAIL_BASE}font-size:${size};margin:${margin};`]),
)

function mergeOpeningTagStyle(html: string, tag: string, style: string): string {
  return html.replace(new RegExp(`<${tag}([^>]*)>`, 'gi'), (_, rawAttrs: string) => {
    const attrs = rawAttrs.trim()
    const found = attrs.match(/\sstyle\s*=\s*(["'])((?:(?!\1)[^])*)\1/i)
    if (!found) {
      return `<${tag}${attrs ? ` ${attrs}` : ''} style="${style}">`
    }
    const [full, q, prev] = found
    const merged = `${prev.replace(/;?\s*$/, '')};${style}`
    return `<${tag} ${attrs.replace(full, `style=${q}${merged}${q}`)}>`
  })
}

function inlineHeadingStyles(html: string): string {
  return Object.entries(HEADING_EMAIL).reduce((acc, [tag, style]) => mergeOpeningTagStyle(acc, tag, style), html)
}

export const richTextRenderer = (props: { theme: S.MessageStyle; data: S.RichTextNode; edgePosition?: 'leading' | 'trailing' | 'alone' }) => {
  const { wrapperStyle, containerStyle } = getThemeStyle(props.theme, props.data, props.edgePosition)
  if (!props.data.content) return ''
  const { html } = props.data.content

  // Ajout du style inline min-height:20px à chaque <p>
  const minHeightStyle = 'min-height:20px;'
  const htmlWithMinHeight = html.replace(/<p(.*?)>/g, `<p$1 style="${minHeightStyle}">`)
  const htmlWithHeadings = inlineHeadingStyles(htmlWithMinHeight)

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
        ${htmlWithHeadings}
        </td>
      </tr>
    </tbody>
  </table>`

  return content
}
