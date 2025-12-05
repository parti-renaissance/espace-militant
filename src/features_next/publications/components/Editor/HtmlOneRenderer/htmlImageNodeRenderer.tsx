import { CSSProperties } from 'react'
import { getThemeStyle } from '@/features_next/publications/components/Editor/hooks/useThemeStyle'
import * as S from '@/features_next/publications/components/Editor/schemas/messageBuilderSchema'
import { stringifyCSSProperties } from 'react-style-stringify'

// <Row style={wrapperStyle as CSSProperties}>
//   <Column style={containerStyle as CSSProperties}>
//     <Img src={url} style={{ ...dynStyle, ...baseStyle } as CSSProperties} />
//   </Column>
// </Row>

export const imageRenderer = (props: { theme: S.MessageStyle; data: S.ImageNode; edgePosition?: 'leading' | 'trailing' | 'alone' }) => {
  const { containerStyle, baseStyle, wrapperStyle } = getThemeStyle(props.theme, props.data, props.edgePosition)
  if (!props.data.content) return ''
  const { width, height, url } = props.data.content
  const dynStyle = {
    aspectRatio: width / height,
  }

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
                  <img
                      src="${url}"
                      style="${stringifyCSSProperties({ ...dynStyle, ...baseStyle } as CSSProperties)}; margin: 0 !important;"
                  />
              </td>
          </tr>
      </tbody>
  </table>`
}
