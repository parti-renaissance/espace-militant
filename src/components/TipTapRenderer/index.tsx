import React from 'react'
import Text from '@/components/base/Text'
import { Href, Link } from 'expo-router'
import { isWeb, XStack, YStack } from 'tamagui'
import VoxCard from '../VoxCard/VoxCard'
import * as S from './schema'
import * as U from './utils'

type RenderFn<A, P extends object = Record<string, unknown>> = (props: { data: A } & P) => React.ReactNode

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

const RenderText: RenderFn<S.TipText> = ({ data }) => {
  const marks = data.marks?.map(({ type }) => type)
  const link = data.marks?.find(U.isTipLinkMark)
  if (link) {
    return (
      <Link href={link.attrs.href as Href} target="_blank">
        <Text.MD
          color="$blue5"
          textDecorationLine="underline"
          multiline
          semibold={marks?.includes('bold')}
          fontStyle={marks?.includes('italic') ? 'italic' : 'normal'}
        >
          {data.text}
        </Text.MD>
      </Link>
    )
  }
  return (
    <Text.MD multiline color="$gray8" semibold={marks?.includes('bold')} fontStyle={marks?.includes('italic') ? 'italic' : 'normal'}>
      {data.text}
    </Text.MD>
  )
}

const RenderParagraph: RenderFn<S.TipParagraph> = ({ data }) => {
  return data.content ? (
    <Text.MD tag="p" marginVertical={4} color="$gray8">
      {data.content.map((x, i) => {
        if (U.isTipNonSupported(x)) return <RenderNonSupported key={x.type + i} data={x} />
        if (U.isTipText(x)) return <RenderText key={x.type + i} data={x} />
        if (U.isTipHardBreak(x)) return <RenderHardBreak key={x.type + i} data={x} />
        return null
      })}
    </Text.MD>
  ) : (
    <Text.MD tag="p">{isWeb ? <Text.BR /> : null}</Text.MD>
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

const RenderListItem: RenderFn<S.TipListItem, ListItemOptions> = ({ data: { content }, options }) => {
  return (
    <XStack gap="$small" alignItems="center">
      {options?.type === 'number' ? <Text.XSM secondary>{options.number}.</Text.XSM> : <Text.SM secondary>•</Text.SM>}
      {content?.map((x, i) => <RenderParagraph key={x.type + i} data={x} />)}
    </XStack>
  )
}

const RenderBulletList: RenderFn<S.TipBulletList> = ({ data: { content } }) => {
  return (
    <YStack paddingLeft="$small" mb="$small">
      {content.map((x, i) => (
        <RenderListItem key={x.type + i} data={x} />
      ))}
    </YStack>
  )
}

const RenderOrderedList: RenderFn<S.TipOrderedList> = ({ data: { content } }) => {
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
        />
      ))}
    </YStack>
  )
}

export const RenderContent: RenderFn<S.TipContent[], { id?: string }> = ({ data, ...props }) => {
  const id = props.id ?? 'no-id'
  return data.map((x, i) => {
    if (U.isTipNonSupported(x)) {
      return <RenderNonSupported key={id + i + x.type} data={x} />
    }

    if (U.isTipParagraph(x)) {
      return <RenderParagraph key={id + i + x.type} data={x} />
    }

    if (U.isTipBulletList(x)) {
      return <RenderBulletList key={id + i + x.type} data={x} />
    }

    if (U.isTipOrderedList(x)) {
      return <RenderOrderedList key={id + i + x.type} data={x} />
    }

    return null
  })
}

export const TipTapRenderer = (props: { content: string; id?: string }) => {
  const { content, type } = U.parseJsonEditorContent(props.content)
  if (type === 'string') {
    return <VoxCard.Description markdown>{content}</VoxCard.Description>
  } else {
    return (
      <YStack>
        <RenderContent id={props.id} data={content.content} />
      </YStack>
    )
  }
}
