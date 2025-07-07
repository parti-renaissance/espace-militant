import { CSSProperties } from 'react'
import { getThemeStyle } from '@/features/message/components/Editor/hooks/useThemeStyle'
import * as S from '@/features/message/components/Editor/schemas/messageBuilderSchema'
// import { Button, Column, Row } from '@react-email/components'
import { stringifyCSSProperties } from 'react-style-stringify'

// <Row style={wrapperStyle as CSSProperties}>
//   <Column>
//     <Button href={props.data.content.link} style={{ ...containerStyle, ...baseStyle } as CSSProperties}>
//       {props.data.content.text}
//     </Button>
//   </Column>
// </Row>
export const buttonRenderer = (props: { theme: S.MessageStyle; data: S.ButtonNode; edgePosition?: 'leading' | 'trailing' | 'alone' }) => {
  const { containerStyle, baseStyle, wrapperStyle: { paddingTop, paddingBottom, paddingLeft, paddingRight, ...wrapperStyle } } = getThemeStyle(props.theme, props.data, props.edgePosition)
  if (!props.data.content) return ''

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
              <td data-id="__react-email-column" style="${stringifyCSSProperties({ paddingTop, paddingBottom, paddingLeft, paddingRight } as CSSProperties)}">
                  <a
                      href="${props.data.content.link ?? 'parti.re'}"
                      style="
                          line-height: 100%;
                          text-decoration: none;
                          display: inline-block;
                          max-width: 100%;
                          mso-padding-alt: 0px;
                              box-sizing: border-box;
                          ${stringifyCSSProperties({ ...containerStyle, ...baseStyle } as CSSProperties)}
                      "
                      target="_blank"
                      ><span
                          ><!--[if mso
                              ]><i
                                  style="
                                      mso-font-width: 300%;
                                      mso-text-raise: 28.5;
                                  "
                                  hidden
                                  >&#8202;&#8202;</i
                              ><!
                          [endif]--></span
                      ><span
                          style="
                              max-width: 100%;
                              display: inline-block;
                              line-height: 120%;
                              mso-padding-alt: 0px;
                              mso-text-raise: 14.25px;
                          "
                          >${props.data.content.text ?? ''}</span
                      ><span
                          ><!--[if mso
                              ]><i style="mso-font-width: 300%" hidden
                                  >&#8202;&#8202;&#8203;</i
                              ><!
                          [endif]--></span
                      ></a
                  >
              </td>
          </tr>
      </tbody>
  </table>`
}
