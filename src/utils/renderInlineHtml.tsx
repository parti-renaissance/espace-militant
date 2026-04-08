import React, { ReactNode } from 'react'

import Text from '@/components/base/Text'

type InlineHtmlInput = string | ReactNode | undefined

function stripHtmlTags(value: string) {
  return value.replace(/<[^>]+>/g, '')
}

/**
 * Render a limited subset of inline HTML used by backend help texts.
 * Supported tags: <strong>, <b>, <em>, <i>, <u>, <br>.
 */
export function renderInlineHtml(value: InlineHtmlInput): ReactNode {
  if (typeof value !== 'string' || !value) return value

  const segments = value
    .split(/(<strong[^>]*>.*?<\/strong>|<b[^>]*>.*?<\/b>|<em[^>]*>.*?<\/em>|<i[^>]*>.*?<\/i>|<u[^>]*>.*?<\/u>|<br\s*\/?>)/gi)
    .filter(Boolean)

  return (
    <Text.SM secondary>
      {segments.map((segment, index) => {
        const key = `html-seg-${index}`

        if (/<br\s*\/?>/i.test(segment)) return '\n'

        if (/<(strong|b)[^>]*>(.*?)<\/\1>/i.test(segment)) {
          const content = stripHtmlTags(segment)
          return (
            <Text.SM key={key} secondary semibold>
              {content}
            </Text.SM>
          )
        }

        if (/<(em|i)[^>]*>(.*?)<\/\1>/i.test(segment)) {
          const content = stripHtmlTags(segment)
          return (
            <Text.SM key={key} secondary style={{ fontStyle: 'italic' }}>
              {content}
            </Text.SM>
          )
        }

        if (/<u[^>]*>(.*?)<\/u>/i.test(segment)) {
          const content = stripHtmlTags(segment)
          return (
            <Text.SM key={key} secondary style={{ textDecorationLine: 'underline' }}>
              {content}
            </Text.SM>
          )
        }

        return stripHtmlTags(segment)
      })}
    </Text.SM>
  )
}
