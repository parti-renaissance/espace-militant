import React, { useCallback } from 'react'
import { FlatList, ListRenderItemInfo } from 'react-native'
import BoundarySuspenseWrapper from '@/components/BoundarySuspenseWrapper'
import PageLayout from '@/components/layouts/PageLayout/PageLayout'
import * as metatags from '@/config/metatags'
import { EventFormScreenSkeleton } from '@/features/events/pages/create-edit/index'
import { StyleRendererContextProvider } from '@/features/message/components/Editor/context/styleRenderContext'
import { ButtonRenderer } from '@/features/message/components/Editor/NodeRenderer/ButtonRenderer'
import { ImageRenderer } from '@/features/message/components/Editor/NodeRenderer/ImageRenderer'
import { RichTextRenderer } from '@/features/message/components/Editor/NodeRenderer/RichTextRenderer'
import * as S from '@/features/message/components/Editor/schemas/messageBuilderSchema'
import TestMessage from '@/features/message/data/test'
import Head from 'expo-router/head'
import { YStack } from 'tamagui'
import defaultTheme from '../../components/Editor/themes/default-theme'

const dataTest = S.MessageSchema.safeParse(TestMessage)

const MessagePreviewPage: React.FC = () => {
  return (
    <PageLayout webScrollable bg="$gray3">
      <PageLayout.SideBarLeft showOn="gtLg" maxWidth={200}></PageLayout.SideBarLeft>
      <BoundarySuspenseWrapper fallback={<EventFormScreenSkeleton />}>
        <PreviewRendererScreen />
      </BoundarySuspenseWrapper>
      <PageLayout.SideBarRight maxWidth={200} />
    </PageLayout>
  )
}

const RenderNode = (props: { data: S.Node; edgePosition?: 'leading' | 'trailing' | 'alone'; id: string }) => {
  switch (props.data.type) {
    case 'image':
      return <ImageRenderer data={props.data} edgePosition={props.edgePosition} />
    case 'button':
      return <ButtonRenderer data={props.data} edgePosition={props.edgePosition} />
    case 'richtext':
      return <RichTextRenderer id={props.id} data={props.data} edgePosition={props.edgePosition} />

    default:
      return null
  }
}

const data = dataTest.success ? dataTest.data : undefined

const RenderFields = (props: { data: S.Message }) => {
  const getFieldEdge = useCallback(
    (index: number) => {
      if (!data?.content) return undefined
      if (index === 0 && data?.content.length === 1) {
        return 'alone'
      } else if (index === 0) {
        return 'leading'
      } else if (index === data?.content.length - 1) {
        return 'trailing'
      }
      return undefined
    },
    [data?.content.length],
  )

  const RenderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<S.Node>) => <RenderNode data={item} id={index + 'id'} edgePosition={getFieldEdge(index)} />,
    [],
  )
  const keyExtractor = useCallback((props: S.Node, index: number) => `${props.type}-${index}`, [])
  return <FlatList data={props.data.content} renderItem={RenderItem} keyExtractor={keyExtractor} />
}

function PreviewRendererScreen() {
  return (
    <>
      <Head>
        <title>{metatags.createTitle('Nouvel événement')}</title>
      </Head>

      <YStack flex={1} gap="$medium" backgroundColor="white" mt="$xxlarge" borderRadius={16} overflow="hidden">
        <StyleRendererContextProvider value={defaultTheme}>
          <RenderFields data={data!} />
        </StyleRendererContextProvider>
      </YStack>
    </>
  )
}

export default MessagePreviewPage
