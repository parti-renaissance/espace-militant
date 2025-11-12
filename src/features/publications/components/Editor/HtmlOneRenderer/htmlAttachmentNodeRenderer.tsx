import { CSSProperties } from 'react'
import { getThemeStyle } from '@/features/publications/components/Editor/hooks/useThemeStyle'
import * as S from '@/features/publications/components/Editor/schemas/messageBuilderSchema'
import { RestAvailableSendersResponse } from '@/services/publications/schema'
import { stringifyCSSProperties } from 'react-style-stringify'

export const attachmentRenderer = (props: { theme: S.MessageStyle; data: S.AttachmentNode; edgePosition?: 'leading' | 'trailing' | 'alone'; sender?: RestAvailableSendersResponse[number] | null }) => {
  const { containerStyle, wrapperStyle: { paddingTop, paddingBottom, paddingLeft, paddingRight, ...wrapperStyle } } = getThemeStyle(props.theme, props.data, props.edgePosition)
  if (!props.data.content) return ''

  const containerStyles: CSSProperties = {
    ...(containerStyle as CSSProperties),
    display: 'block',
    textDecoration: 'none',
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
              <td data-id="__react-email-column" class="padding-responsive" align="center" style="text-align: center;" style="${stringifyCSSProperties({ paddingTop, paddingBottom, paddingLeft, paddingRight } as CSSProperties)}">
                  <a
                      href="${props.data.content.url ?? '#'}"
                      download="${props.data.content.title ?? 'fichier'}"
                      style="${stringifyCSSProperties(containerStyles)}"
                      target="_blank"
                  >
                      <table border="0" cellpadding="0" cellspacing="0">
                          <tr>
                              <td style="padding-right: 10px; vertical-align: middle;">
                                  <img src="https://staging-doc.parti.re/public/7a4e7fadc774584582b2c223afb0b95e5614da11112debf2055b3d47ccf3ae78/8e2ce139-9369-45fe-bc8f-dd613df6a46a.png" alt="File Down" width="16" height="16" style="display: block;" />
                              </td>
                              <td style="vertical-align: middle;">
                                  <div style="color: #212b36; font-size: 14px; font-weight: 500;">
                                      ${props.data.content.title ?? ''}
                                  </div>
                              </td>
                          </tr>
                      </table>
                  </a>
              </td>
          </tr>
      </tbody>
  </table>`
}

