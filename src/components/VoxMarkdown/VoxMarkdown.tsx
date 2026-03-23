import React, { Component, useMemo } from 'react'
import { Linking, Text } from 'react-native'
import Markdown from 'react-native-markdown-display'
import FitImage from 'react-native-fit-image'
import { useTheme } from 'tamagui'

const STREAMING_CURSOR = '▎'

const bodyFontSize = 14
const bodyLineHeight = 22
const fontRegular = 'PublicSans-Regular'
const fontMedium = 'PublicSans-Medium'
const fontBold = 'PublicSans-Bold'
const fontMono = 'monospace'

/** Équilibre les blocs de code non fermés (```) pour éviter les erreurs de parsing pendant le streaming. */
function sanitizeIncompleteCodeBlocks(text: string): string {
  const tripleBacktickCount = (text.match(/```/g) ?? []).length
  if (tripleBacktickCount % 2 !== 0) {
    return `${text}\n\`\`\``
  }
  return text
}

type MarkdownErrorBoundaryProps = {
  content: string
  children: React.ReactNode
}

type MarkdownErrorBoundaryState = {
  hasError: boolean
}

class MarkdownErrorBoundary extends Component<MarkdownErrorBoundaryProps, MarkdownErrorBoundaryState> {
  state: MarkdownErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): MarkdownErrorBoundaryState {
    return { hasError: true }
  }

  componentDidUpdate(prevProps: MarkdownErrorBoundaryProps) {
    if (prevProps.content !== this.props.content && this.state.hasError) {
      this.setState({ hasError: false })
    }
  }

  render() {
    if (this.state.hasError) {
      return <Text style={{ fontFamily: fontRegular, fontSize: bodyFontSize, lineHeight: bodyLineHeight }}>{this.props.content}</Text>
    }
    return this.props.children
  }
}

export type VoxMarkdownProps = {
  content: string
  isStreaming?: boolean
}

function VoxMarkdownComponent({ content, isStreaming = false }: VoxMarkdownProps) {
  const theme = useTheme()

  const displayContent = useMemo(() => {
    let raw = content
    if (isStreaming && raw) {
      raw = `${raw}${STREAMING_CURSOR}`
      raw = sanitizeIncompleteCodeBlocks(raw)
    }
    return raw
  }, [content, isStreaming])

  const markdownStyles = useMemo(() => {
    const primary = theme.textPrimary?.val ?? '#1a1a1a'
    const linkColor = theme.blue6?.val ?? theme.blue5?.val ?? '#2563eb'
    const codeBg = theme.gray2?.val ?? theme.background?.val ?? 'rgba(0,0,0,0.06)'
    const grayBorder = theme.gray5?.val ?? theme.gray4?.val ?? '#8a8a8a'
    const gray2 = theme.gray2?.val ?? '#e5e9ef'
    const gray4 = theme.gray4?.val ?? '#8a8a8a'

    return {
      body: {
        fontFamily: fontRegular,
        fontSize: bodyFontSize,
        lineHeight: bodyLineHeight,
        color: primary,
      },
      paragraph: {
        fontFamily: fontRegular,
        fontSize: bodyFontSize,
        lineHeight: bodyLineHeight,
        color: primary,
        marginTop: 0,
        marginBottom: 8,
      },
      heading1: {
        fontFamily: fontBold,
        fontSize: 22,
        lineHeight: 28,
        color: primary,
        marginTop: 16,
        marginBottom: 8,
      },
      heading2: {
        fontFamily: fontBold,
        fontSize: 20,
        lineHeight: 26,
        color: primary,
        marginTop: 14,
        marginBottom: 6,
      },
      heading3: {
        fontFamily: fontBold,
        fontSize: 18,
        lineHeight: 24,
        color: primary,
        marginTop: 12,
        marginBottom: 6,
      },
      heading4: {
        fontFamily: fontMedium,
        fontSize: 16,
        lineHeight: 22,
        color: primary,
        marginTop: 10,
        marginBottom: 4,
      },
      heading5: {
        fontFamily: fontMedium,
        fontSize: 15,
        lineHeight: 20,
        color: primary,
        marginTop: 8,
        marginBottom: 4,
      },
      heading6: {
        fontFamily: fontMedium,
        fontSize: 14,
        lineHeight: 20,
        color: primary,
        marginTop: 8,
        marginBottom: 4,
      },
      strong: {
        fontFamily: fontBold,
        fontSize: bodyFontSize,
        color: primary,
      },
      em: {
        fontFamily: fontRegular,
        fontSize: bodyFontSize,
        fontStyle: 'italic' as const,
        color: primary,
      },
      link: {
        color: linkColor,
        fontFamily: fontRegular,
        fontSize: bodyFontSize,
      },
      image_wrapper: {
        width: '100%' as const,
        marginVertical: 12,
      },
      image: {
        width: '100%' as const,
        height: 250,
        resizeMode: 'contain' as const,
        borderRadius: 8,
      },
      blockquote: {
        borderLeftWidth: 1,
        borderLeftColor: gray4,
        paddingHorizontal: 12,
        paddingVertical: 4,
        marginVertical: 4,
        fontFamily: fontRegular,
        fontSize: bodyFontSize,
        lineHeight: bodyLineHeight,
        color: primary,
        fontStyle: 'italic' as const,
      },
      hr: {
        backgroundColor: grayBorder,
        height: 1,
        marginVertical: 16,
      },
      bullet_list: {
        marginVertical: 6,
        paddingLeft: 8,
      },
      ordered_list: {
        marginVertical: 6,
        paddingLeft: 8,
      },
      list_item: {
        flexDirection: 'row' as const,
        justifyContent: 'flex-start' as const,
        alignItems: 'flex-start' as const,
        fontFamily: fontRegular,
        fontSize: bodyFontSize,
        lineHeight: bodyLineHeight,
        color: primary,
        marginVertical: 2,
      },
      bullet_list_icon: {
        marginLeft: 4,
        marginRight: 8,
        fontFamily: fontRegular,
        fontSize: bodyFontSize,
        color: primary,
      },
      bullet_list_content: {
        flex: 1,
        fontFamily: fontRegular,
        fontSize: bodyFontSize,
        lineHeight: bodyLineHeight,
        color: primary,
      },
      ordered_list_icon: {
        marginLeft: 4,
        marginRight: 8,
        fontFamily: fontRegular,
        fontSize: bodyFontSize,
        color: primary,
      },
      ordered_list_content: {
        flex: 1,
        fontFamily: fontRegular,
        fontSize: bodyFontSize,
        lineHeight: bodyLineHeight,
        color: primary,
      },
      fence: {
        fontFamily: fontMono,
        fontSize: 13,
        lineHeight: 20,
        color: primary,
        backgroundColor: codeBg,
        padding: 12,
        borderRadius: 8,
        marginVertical: 8,
        overflow: 'hidden' as const,
      },
      code_inline: {
        fontFamily: fontMono,
        fontSize: 13,
        color: primary,
        backgroundColor: codeBg,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
      },
      table: {
        borderWidth: 1,
        borderColor: gray4,
        borderRadius: 8,
        marginVertical: 12,
        overflow: 'hidden' as const,
      },
      thead: {
        backgroundColor: gray2,
      },
      tr: {
        flexDirection: 'row' as const,
        borderBottomWidth: 1,
        borderBottomColor: gray4,
      },
      th: {
        flex: 1,
        padding: 8,
        fontWeight: 'bold' as const,
        fontFamily: fontBold,
        fontSize: bodyFontSize,
        color: primary,
      },
      td: {
        flex: 1,
        padding: 8,
        fontFamily: fontRegular,
        fontSize: bodyFontSize,
        color: primary,
      },
    }
  }, [theme.textPrimary?.val, theme.blue6?.val, theme.blue5?.val, theme.gray2?.val, theme.gray5?.val, theme.gray4?.val, theme.background?.val])

  const markdownRules = useMemo(
    () => ({
      image: (node: any, _children: any, _parent: any, rulesStyles: any, allowedImageHandlers: string[], defaultImageHandler: string | null) => {
        const { src, alt } = node.attributes

        const show =
          allowedImageHandlers.filter((value) => src.toLowerCase().startsWith(value.toLowerCase())).length > 0

        if (show === false && defaultImageHandler === null) return null

        return (
          <FitImage
            key={node.key}
            indicator
            style={rulesStyles._VIEW_SAFE_image}
            source={{
              uri: show === true ? src : `${defaultImageHandler}${src}`,
            }}
            {...(alt
              ? {
                  accessible: true,
                  accessibilityLabel: alt,
                }
              : {})}
          />
        )
      },
    }),
    [],
  )

  const handleLinkPress = useMemo(
    () =>
      (url: string): boolean => {
        Linking.openURL(url).catch(() => {})
        return false
      },
    [],
  )

  if (!displayContent) {
    return null
  }

  return (
    <MarkdownErrorBoundary content={content}>
      <Markdown style={markdownStyles} mergeStyle={false} onLinkPress={handleLinkPress} rules={markdownRules}>
        {displayContent}
      </Markdown>
    </MarkdownErrorBoundary>
  )
}

export const VoxMarkdown = React.memo(VoxMarkdownComponent)

export default VoxMarkdown
