import Text from '@/components/base/Text'
import { isWeb, XStack, YStack } from 'tamagui'
import VoxCard from '../VoxCard/VoxCard'
import * as S from './schema'
import * as U from './utils'

type RenderFn<A, P extends object = Record<string, unknown>> = (props: { data: A } & P) => React.ReactNode

const RenderText: RenderFn<S.TipText> = ({ data }) => {
  const marks = data.marks?.map(({ type }) => type)
  return (
    <Text.SM multiline secondary semibold={marks?.includes('bold')} fontStyle={marks?.includes('italic') ? 'italic' : 'normal'}>
      {data.text}
    </Text.SM>
  )
}

const RenderParagraph: RenderFn<S.TipParagraph> = ({ data }) => {
  return data.content ? (
    <Text.SM tag="p">
      {data.content.map((x) => (
        <RenderText data={x} />
      ))}
    </Text.SM>
  ) : (
    <Text.SM tag="p">{isWeb ? <Text.BR /> : null}</Text.SM>
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
      {content?.map((x) => <RenderParagraph data={x} />)}
    </XStack>
  )
}

const RenderBulletList: RenderFn<S.TipBulletList> = ({ data: { content } }) => {
  return (
    <YStack paddingLeft="$small" mb="$small">
      {content.map((x) => (
        <RenderListItem data={x} />
      ))}
    </YStack>
  )
}

const RenderOrderedList: RenderFn<S.TipOrderedList> = ({ data: { content } }) => {
  return (
    <YStack paddingLeft="$small" mb="$small">
      {content.map((x, i) => (
        <RenderListItem
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

const RenderContent: RenderFn<S.TipContent[]> = ({ data }) => {
  return data.map((x, i) => {
    if (U.isTipParagraph(x)) {
      return <RenderParagraph key={i + x.type} data={x} />
    }

    if (U.isTipBulletList(x)) {
      return <RenderBulletList key={i + x.type} data={x} />
    }

    if (U.isTipOrderedList(x)) {
      return <RenderOrderedList key={i + x.type} data={x} />
    }

    return null
  })
}

export const TipTapRenderer = (props: { content: string }) => {
  const { content, type } = U.parseJsonEditorContent(props.content)
  if (type === 'string') {
    return <VoxCard.Description markdown>{content}</VoxCard.Description>
  } else {
    return (
      <YStack>
        <RenderContent data={content.content} />
      </YStack>
    )
  }
}
