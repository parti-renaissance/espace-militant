import React from 'react'
import { RestTimelineFeedAuthor } from '@/services/timeline-feed/schema'
import VoxCard from '@/components/VoxCard/VoxCard'
import SenderView, { SenderViewProps } from '@/features_next/publications/components/SenderView'
import { relativeDateFormatter } from '@/utils/DateFormatter'
import { VoxButton } from '@/components/Button'
import { Eye } from '@tamagui/lucide-icons'
import { router } from 'expo-router'
import Text from '@/components/base/Text'
import { RichTextRenderer } from '@/features_next/publications/components/Editor/NodeRenderer/RichTextRenderer'
import { ImageRenderer } from '@/features_next/publications/components/Editor/NodeRenderer/ImageRenderer'
import { ButtonRenderer } from '@/features_next/publications/components/Editor/NodeRenderer/ButtonRenderer'
import { AttachmentRenderer } from '@/features_next/publications/components/Editor/NodeRenderer/AttachmentRenderer'
import * as S from '@/features_next/publications/components/Editor/schemas/messageBuilderSchema'
import { useMedia, XStack, YStack } from 'tamagui'

export type PublicationCardProps = {
  title?: string | null
  description?: string | null
  author?: RestTimelineFeedAuthor
  date?: string | null
  uuid?: string | null
  showFullContent?: boolean
}

const PublicationCard = ({ title, description, author, date, uuid, showFullContent = false }: PublicationCardProps) => {
  const media = useMedia()

  const renderContent = () => {
    if (!description) return null

    try {
      const parsed = JSON.parse(description)
      if (parsed.content && Array.isArray(parsed.content)) {
        if (showFullContent) {
          return (
            <YStack pt="$small" gap="$small">
              {parsed.content.map((item: S.Node, index: number) => {
                if (item.type === 'image') {
                  return (
                    <ImageRenderer
                      key={`content-image-${index}`}
                      data={item as S.ImageNode}
                      edgePosition={index === 0 ? "leading" : undefined}
                      displayToolbar={false}
                    />
                  )
                }
                if (item.type === 'richtext') {
                  return (
                    <RichTextRenderer
                      key={`content-text-${index}`}
                      id={`content-text-${index}`}
                      data={item as S.RichTextNode}
                      displayToolbar={false}
                      object_id={uuid || undefined}
                    />
                  )
                }
                if (item.type === 'button') {
                  return (
                    <ButtonRenderer
                      publicationUuid={uuid || undefined}
                      key={`content-button-${index}`}
                      data={item as S.ButtonNode}
                      displayToolbar={false}
                      allowHits={true}
                    />
                  )
                }
                if (item.type === 'attachment') {
                  return (
                    <AttachmentRenderer
                      key={`content-attachment-${index}`}
                      data={item as S.AttachmentNode}
                      displayToolbar={false}
                      senderThemeColor={author?.theme?.primary ?? undefined}
                    />
                  )
                }
                return null
              })}
            </YStack>
          )
        } else {
          const nonButtonContent = parsed.content.filter((item: S.Node) => item.type !== 'button')
          
          if (nonButtonContent.length === 0) return null

          const firstItem = nonButtonContent[0]
          const firstTextItem = nonButtonContent.find((item: S.Node) => item.type === 'richtext')

          if (firstItem.type === 'image') {
            return (
              <YStack pt="$small">
                <ImageRenderer
                  key="preview-image"
                  data={firstItem as S.ImageNode}
                  edgePosition="leading"
                  displayToolbar={false}
                />
                {firstTextItem && (
                  <RichTextRenderer
                    key="preview-text"
                    id="preview-text"
                    data={firstTextItem as S.RichTextNode}
                    displayToolbar={false}
                    numberOfLines={3}
                    object_id={uuid || undefined}
                  />
                )}
              </YStack>
            )
          }

          if (firstItem.type === 'richtext') {
            return (
              <RichTextRenderer
                key="preview-text"
                id="preview-text"
                data={firstItem as S.RichTextNode}
                displayToolbar={false}
                numberOfLines={4}
                object_id={uuid || undefined}
              />
            )
          }
        }
        
        return null
      }
    } catch (e) {
      return <Text.MD numberOfLines={showFullContent ? undefined : 3}>{description}</Text.MD>
    }

    return null
  }

  return (
    <VoxCard borderLeftWidth={media.sm ? 0 : 1} borderRightWidth={media.sm ? 0 : 1}>
      <VoxCard.Content padding={0} gap={0}>
        <YStack px="$medium" pt="$medium" pb="$small" gap="$medium">
          {author && author.first_name && author.last_name && author.uuid && <SenderView sender={author as SenderViewProps} datetime={date ? relativeDateFormatter(date) : undefined} />}
          <Text.LG semibold>{title}</Text.LG>
        </YStack>
        {renderContent()}
        { !showFullContent ? (
          <XStack px="$medium" pb="$medium" pt="$small" gap="$medium" justifyContent="flex-end">
            <VoxButton variant="outlined" theme="blue" iconLeft={Eye} size="sm" disabled={!uuid} onPress={() => { router.push({ pathname: '/publications/[id]', params: { id: uuid ?? '', source: 'page_timeline' } }) }}>Lire</VoxButton>
          </XStack>
        ) : <YStack pb="$medium"></YStack>}
      </VoxCard.Content>
    </VoxCard>
  )
}

export default PublicationCard 