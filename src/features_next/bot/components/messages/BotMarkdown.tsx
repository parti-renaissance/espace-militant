import VoxMarkdown from '@/components/VoxMarkdown/VoxMarkdown'

import { htmlToMarkdown } from '../../utils/htmlToMarkdown'

type Props = {
  content: string
  isStreaming?: boolean
}

const BOT_TEXT_STYLE = {
  fontFamily: 'PublicSans-Regular',
  fontSize: 14,
  lineHeight: 20,
  letterSpacing: 0,
}

const BOT_STYLE_OVERRIDE = {
  body: BOT_TEXT_STYLE,
  paragraph: { ...BOT_TEXT_STYLE, marginTop: 0, marginBottom: 0 },
  strong: { ...BOT_TEXT_STYLE, fontFamily: 'PublicSans-Bold' },
  em: { ...BOT_TEXT_STYLE, fontStyle: 'italic' as const },
  list_item: BOT_TEXT_STYLE,
  bullet_list_content: BOT_TEXT_STYLE,
  ordered_list_content: BOT_TEXT_STYLE,
  blockquote: BOT_TEXT_STYLE,
}

export default function BotMarkdown({ content, isStreaming }: Props) {
  return <VoxMarkdown content={htmlToMarkdown(content)} isStreaming={isStreaming} styleOverride={BOT_STYLE_OVERRIDE} />
}
