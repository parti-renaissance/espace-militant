import React, { useId } from 'react'
import { View } from 'react-native'
import { Defs, LinearGradient, Rect, Stop, Svg } from 'react-native-svg'
import { Href, Link } from 'expo-router'
import { isWeb, XStack, YStack } from 'tamagui'

import Text from '@/components/base/Text'

import { useHits } from '@/services/hits/hook'
import { ObjectType } from '@/services/hits/schema'
import { handleLinkPress, isInternalLink } from '@/utils/linkHandler'
import { HEADING_LAYOUT } from '@/components/VoxRichText/constants'

import VoxCard from '../VoxCard/VoxCard'
import * as S from './schema'
import * as U from './utils'

type RenderFn<A, P extends object = Record<string, unknown>> = (props: { data: A } & P) => React.ReactNode

type HitsContext = {
  object_id?: string
  object_type?: ObjectType
  onLinkClick?: (target_url: string, button_name: string) => void
}

// Composant wrapper pour limiter le nombre de lignes
const LimitedContent = ({ children, numberOfLines }: { children: React.ReactNode; numberOfLines?: number }) => {
  if (!numberOfLines) return <>{children}</>

  const uniqueId = useId()
  const gradientId = `fadeGradient-${uniqueId.replace(/:/g, '-')}`

  return (
    <YStack maxHeight={numberOfLines * 20 + 20} position="relative" overflow="hidden">
      {Array.isArray(children) ? children.slice(0, numberOfLines) : children}
      {Array.isArray(children) && children?.length > 1 ? (
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, maxHeight: 40, height: '100%', userSelect: 'none' }}>
          <Svg width="100%" height="100%">
            <Defs>
              <LinearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="white" stopOpacity="0" />
                <Stop offset="100%" stopColor="white" stopOpacity="1" />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill={`url(#${gradientId})`} />
          </Svg>
        </View>
      ) : null}
    </YStack>
  )
}

const RenderNonSupported: RenderFn<S.TipNonSupported> = () => null

const RenderHardBreak: RenderFn<S.TipHardBreak> = () =>
  isWeb ? (
    <>
      <Text.BR />
      <Text.BR />
    </>
  ) : (
    <Text.BR />
  )

const headingLineHeight = (fontSize: number) => Math.round(fontSize * 1.35)

const RenderText: RenderFn<S.TipText, { editMode?: boolean; previewMode?: boolean; headingFontSize?: number } & HitsContext> = ({
  data,
  onLinkClick,
  editMode = false,
  previewMode = false,
  headingFontSize,
}) => {
  const marks = data.marks?.map(({ type }) => type)
  const link = data.marks?.find(U.isTipLinkMark)
  const variable = data.marks?.find(U.isTipVariableMark)
  const h = headingFontSize
  const hLh = h != null ? headingLineHeight(h) : undefined

  const handlePress = async (e?: { preventDefault?: () => void }) => {
    if (!link) return
    await handleLinkPress(link.attrs.href, onLinkClick, data.text, e)
  }

  // Render variable with badge styling
  if (variable) {
    const fontStyle = marks?.includes('italic') ? ('italic' as const) : ('normal' as const)

    if (editMode) {
      return h != null ? (
        <Text
          fontSize={h}
          lineHeight={hLh}
          fontWeight={marks?.includes('bold') ? '700' : '600'}
          fontStyle={fontStyle}
          color="$purple5"
        >
          {data.text ? `{{${data.text}}}` : ' variable inconnue'}
        </Text>
      ) : (
        <Text.MD multiline semibold={marks?.includes('bold')} fontStyle={fontStyle} color="$purple5">
          {data.text ? `{{${data.text}}}` : ' variable inconnue'}
        </Text.MD>
      )
    } else if (previewMode) {
      return h != null ? (
        <Text
          fontSize={h}
          lineHeight={hLh}
          fontWeight={marks?.includes('bold') ? '700' : '600'}
          fontStyle={fontStyle}
          color="$gray8"
        >
          {' '}
          {data.text ? `<<${data.text}>>` : ' variable inconnue'}{' '}
        </Text>
      ) : (
        <Text.MD multiline semibold={marks?.includes('bold')} fontStyle={fontStyle} color="$gray8">
          {' '}
          {data.text ? `<<${data.text}>>` : ' variable inconnue'}{' '}
        </Text.MD>
      )
    } else {
      return h != null ? (
        <Text
          fontSize={h}
          lineHeight={hLh}
          fontWeight={marks?.includes('bold') ? '700' : '600'}
          fontStyle={fontStyle}
          color="$gray8"
        >
          {variable?.attrs?.value ?? data.text ?? ''}
        </Text>
      ) : (
        <Text.MD multiline semibold={marks?.includes('bold')} fontStyle={fontStyle} color="$gray8">
          {variable?.attrs?.value ?? data.text ?? ''}
        </Text.MD>
      )
    }
  }

  if (link) {
    const url = link.attrs.href
    const internal = isInternalLink(url)

    if (isWeb) {
      return (
        <Link href={link.attrs.href as Href} target={internal ? undefined : '_blank'} onPress={handlePress}>
          {h != null ? (
            <Text
              fontSize={h}
              lineHeight={hLh}
              color="$blue5"
              textDecorationLine="underline"
              fontWeight={marks?.includes('bold') ? '700' : '600'}
              fontStyle={marks?.includes('italic') ? 'italic' : 'normal'}
            >
              {data.text}
            </Text>
          ) : (
            <Text.MD
              color="$blue5"
              textDecorationLine="underline"
              multiline
              semibold={marks?.includes('bold')}
              fontStyle={marks?.includes('italic') ? 'italic' : 'normal'}
            >
              {data.text}
            </Text.MD>
          )}
        </Link>
      )
    } else {
      return h != null ? (
        <Text
          fontSize={h}
          lineHeight={hLh}
          color="$blue5"
          textDecorationLine="underline"
          fontWeight={marks?.includes('bold') ? '700' : '600'}
          fontStyle={marks?.includes('italic') ? 'italic' : 'normal'}
          onPress={handlePress}
          cursor="pointer"
        >
          {data.text}
        </Text>
      ) : (
        <Text.MD
          color="$blue5"
          textDecorationLine="underline"
          multiline
          semibold={marks?.includes('bold')}
          fontStyle={marks?.includes('italic') ? 'italic' : 'normal'}
          onPress={handlePress}
          cursor="pointer"
        >
          {data.text}
        </Text.MD>
      )
    }
  }
  return h != null ? (
    <Text
      fontSize={h}
      lineHeight={hLh}
      color="$gray8"
      fontWeight={marks?.includes('bold') ? '700' : '600'}
      fontStyle={marks?.includes('italic') ? 'italic' : 'normal'}
    >
      {data.text}
    </Text>
  ) : (
    <Text.MD multiline color="$gray8" semibold={marks?.includes('bold')} fontStyle={marks?.includes('italic') ? 'italic' : 'normal'}>
      {data.text}
    </Text.MD>
  )
}

const RenderParagraph: RenderFn<S.TipParagraph, { editMode?: boolean; previewMode?: boolean } & HitsContext> = ({
  data,
  onLinkClick,
  editMode = false,
  previewMode = false,
}) => {
  return data.content ? (
    <Text.MD tag="p" marginVertical={0} color="$gray8">
      {data.content.map((x, i) => {
        if (U.isTipNonSupported(x)) return <RenderNonSupported key={x.type + i} data={x} />
        if (U.isTipText(x)) return <RenderText key={x.type + i} data={x} onLinkClick={onLinkClick} editMode={editMode} previewMode={previewMode} />
        if (U.isTipHardBreak(x)) return <RenderHardBreak key={x.type + i} data={x} />
        return null
      })}
    </Text.MD>
  ) : (
    <Text.MD tag="p">{isWeb ? <Text.BR /> : null}</Text.MD>
  )
}

const RenderHeading: RenderFn<S.TipHeading, { editMode?: boolean; previewMode?: boolean } & HitsContext> = ({
  data,
  onLinkClick,
  editMode = false,
  previewMode = false,
}) => {
  const { level } = data.attrs

  if (!data.content?.length) return null

  const semanticLevel = Math.min(Math.max(level, 1), 6) as keyof typeof HEADING_LAYOUT
  const { fontSize, marginTop, marginBottom } = HEADING_LAYOUT[semanticLevel] ?? HEADING_LAYOUT[3]
  const tag = `h${semanticLevel}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  const lineHeight = headingLineHeight(fontSize)

  return (
    <Text
      tag={tag}
      fontSize={fontSize}
      lineHeight={lineHeight}
      fontWeight="600"
      color="$gray8"
      marginTop={marginTop}
      marginBottom={marginBottom}
    >
      {data.content.map((x, i) => {
        if (U.isTipNonSupported(x)) return <RenderNonSupported key={x.type + i} data={x} />
        if (U.isTipText(x)) {
          return (
            <RenderText
              key={x.type + i}
              data={x}
              onLinkClick={onLinkClick}
              editMode={editMode}
              previewMode={previewMode}
              headingFontSize={fontSize}
            />
          )
        }
        if (U.isTipHardBreak(x)) return <RenderHardBreak key={x.type + i} data={x} />
        return <React.Fragment key={`unsupported-${i}`} />
      })}
    </Text>
  )
}

type ListItemOptions = {
  options?:
    | {
        type: 'bullet'
      }
    | {
        type: 'number'
        number: number
      }
}

const RenderListItem: RenderFn<S.TipListItem, ListItemOptions & HitsContext> = ({ data: { content }, options, onLinkClick }) => {
  return (
    <XStack gap="$small" alignItems="center">
      {options?.type === 'number' ? <Text.XSM secondary>{options.number}.</Text.XSM> : <Text.SM secondary>•</Text.SM>}
      {content?.map((x, i) => (
        <RenderParagraph key={x.type + i} data={x} onLinkClick={onLinkClick} />
      ))}
    </XStack>
  )
}

const RenderBulletList: RenderFn<S.TipBulletList, HitsContext> = ({ data: { content }, onLinkClick }) => {
  return (
    <YStack paddingLeft="$small" mb="$small">
      {content.map((x, i) => (
        <RenderListItem key={x.type + i} data={x} onLinkClick={onLinkClick} />
      ))}
    </YStack>
  )
}

const RenderOrderedList: RenderFn<S.TipOrderedList, HitsContext> = ({ data: { content }, onLinkClick }) => {
  return (
    <YStack paddingLeft="$small" mb="$small">
      {content.map((x, i) => (
        <RenderListItem
          key={x.type + i}
          data={x}
          options={{
            type: 'number',
            number: i + 1,
          }}
          onLinkClick={onLinkClick}
        />
      ))}
    </YStack>
  )
}

export const RenderContent: RenderFn<S.TipContent[], { id?: string; numberOfLines?: number; editMode?: boolean; previewMode?: boolean } & HitsContext> = ({
  data,
  numberOfLines,
  onLinkClick,
  editMode = false,
  previewMode = false,
  ...props
}) => {
  const id = props.id ?? 'no-id'

  const content = data.map((x, i) => {
    if (U.isTipNonSupported(x)) {
      return <RenderNonSupported key={id + i + x.type} data={x} />
    }

    if (U.isTipParagraph(x)) {
      return <RenderParagraph key={id + i + x.type} data={x} onLinkClick={onLinkClick} editMode={editMode} previewMode={previewMode} />
    }

    if (U.isTipHeading(x)) {
      return (
        <RenderHeading
          key={id + i + x.type}
          data={x}
          onLinkClick={onLinkClick}
          editMode={editMode}
          previewMode={previewMode}
        />
      )
    }

    if (U.isTipBulletList(x)) {
      return <RenderBulletList key={id + i + x.type} data={x} onLinkClick={onLinkClick} />
    }

    if (U.isTipOrderedList(x)) {
      return <RenderOrderedList key={id + i + x.type} data={x} onLinkClick={onLinkClick} />
    }

    return null
  })

  return <LimitedContent numberOfLines={numberOfLines}>{content}</LimitedContent>
}

export const TipTapRenderer = (props: {
  content: string
  id?: string
  numberOfLines?: number
  object_id?: string
  object_type?: ObjectType
  editMode?: boolean
  previewMode?: boolean
}) => {
  const { trackClick } = useHits()
  const { content, type } = U.parseJsonEditorContent(props.content)

  const onLinkClick = React.useMemo(() => {
    if (!props.object_id || !props.object_type) return undefined

    return (target_url: string, button_name: string) => {
      try {
        trackClick({
          object_id: props.object_id,
          object_type: props.object_type,
          target_url,
          button_name,
        })
      } catch (error) {
        // Silently ignore tracking errors - they should not impact user experience
        if (__DEV__) {
          // eslint-disable-next-line no-console
          console.warn('[TipTapRenderer] trackClick error:', error)
        }
      }
    }
  }, [props.object_id, props.object_type, trackClick])

  if (type === 'string') {
    return (
      <LimitedContent numberOfLines={props.numberOfLines}>
        <VoxCard.Description markdown>{content}</VoxCard.Description>
      </LimitedContent>
    )
  } else {
    return (
      <YStack>
        <RenderContent
          id={props.id}
          data={content.content}
          numberOfLines={props.numberOfLines}
          object_id={props.object_id}
          object_type={props.object_type}
          onLinkClick={onLinkClick}
          editMode={props.editMode}
          previewMode={props.previewMode}
        />
      </YStack>
    )
  }
}
