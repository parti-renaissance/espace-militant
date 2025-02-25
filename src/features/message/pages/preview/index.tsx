import React, { useCallback } from 'react'
import { FlatList, ListRenderItemInfo } from 'react-native'
import BoundarySuspenseWrapper from '@/components/BoundarySuspenseWrapper'
import PageLayout from '@/components/layouts/PageLayout/PageLayout'
import * as metatags from '@/config/metatags'
import { EventFormScreenSkeleton } from '@/features/events/pages/create-edit/index'
import { ImageRenderer } from '@/features/message/components/NodeRenderer/ImageRenderer'
import TestMessage from '@/features/message/data/test'
import * as S from '@/features/message/schemas/messageBuilderSchema'
import Head from 'expo-router/head'
import { YStack } from 'tamagui'
import { ButtonRenderer } from '../../components/NodeRenderer/ButtonRenderer'
import { RichTextRenderer } from '../../components/NodeRenderer/RichTextRenderer'
import { StyleRendererContextProvider } from '../../context/styleRenderContext'
import defaultTheme from '../../themes/default-theme'

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

const RenderNode = (props: { data: S.Node }) => {
  switch (props.data.type) {
    case 'image':
      return <ImageRenderer data={props.data} />
    case 'button':
      return <ButtonRenderer data={props.data} />
    case 'doc':
      return <RichTextRenderer data={props.data} />

    default:
      return null
  }
}

const data = dataTest.success ? dataTest.data : undefined

const RenderFields = (props: { data: S.Message }) => {
  const RenderItem = useCallback(({ item }: ListRenderItemInfo<S.Node>) => <RenderNode data={item} />, [])
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
