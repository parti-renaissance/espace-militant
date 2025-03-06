import { CSSProperties } from 'react'
import { getThemeStyle } from '@/features/message/components/Editor/hooks/useThemeStyle'
import * as S from '@/features/message/components/Editor/schemas/messageBuilderSchema'
import { stringifyCSSProperties } from 'react-style-stringify'

export const containerRenderer = (props: { data: string; theme: S.MessageStyle }) => {
  const { containerStyle, wrapperStyle } = getThemeStyle(props.theme)
  return `<body style="${stringifyCSSProperties(wrapperStyle as CSSProperties)}">
      <!--/$-->
      <table
          align="center"
          width="100%"
          border="0"
          cellpadding="0"
          cellspacing="0"
          role="presentation"
          style="
              margin-left: auto;
              margin-right: auto;
              box-sizing: border-box;
              padding-top: 1rem;
              padding-bottom: 1rem;
              height: 100vh;
              ${stringifyCSSProperties(containerStyle as CSSProperties)}
          "
      >
          <tbody>
              <tr style="width: 100%">
                  <td>${props.data}</td>
              </tr>
          </tbody>
      </table>
      <!--/$-->
  </body>`
}
