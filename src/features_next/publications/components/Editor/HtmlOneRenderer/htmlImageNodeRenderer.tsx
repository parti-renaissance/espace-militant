import { CSSProperties } from 'react'
import { stringifyCSSProperties } from 'react-style-stringify'

import { getThemeStyle } from '@/features_next/publications/components/Editor/hooks/useThemeStyle'
import * as S from '@/features_next/publications/components/Editor/schemas/messageBuilderSchema'

// <Row style={wrapperStyle as CSSProperties}>
//   <Column style={containerStyle as CSSProperties}>
//     <Img src={url} style={{ ...dynStyle, ...baseStyle } as CSSProperties} />
//   </Column>
// </Row>

export const imageRenderer = (props: { theme: S.MessageStyle; data: S.ImageNode; edgePosition?: 'leading' | 'trailing' | 'alone' }) => {
  const { containerStyle, baseStyle, wrapperStyle } = getThemeStyle(props.theme, props.data, props.edgePosition)
  if (!props.data.content) return ''
  const { width, height, url, link_url } = props.data.content
  const dynStyle = {
    aspectRatio: width / height,
  }

  const imageTag = `<img
      src="${url}"
      style="${stringifyCSSProperties({ ...dynStyle, ...baseStyle } as CSSProperties)}; margin: 0 !important;"
  />`

  const imageContent = link_url
    ? `<a
        href="${link_url}"
        style="text-decoration: none; display: block;"
        target="_blank"
    >${imageTag}</a>`
    : imageTag

  return `<table
      align="center"
      width="100%"
      border="0"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="${stringifyCSSProperties(wrapperStyle as CSSProperties)}"
  >
      <tbody style="width: 100%">
          <tr style="width: 100%">
              <td data-id="__react-email-column" ${props.edgePosition === 'leading' ? '' : 'class="padding-responsive"'} style="${stringifyCSSProperties(containerStyle as CSSProperties)}">
                  ${imageContent}
              </td>
          </tr>
      </tbody>
  </table>`
}
