import { useMedia, XStack, YStack } from 'tamagui'
import { Clock } from '@tamagui/lucide-icons'

import Text from '@/components/base/Text'
import ProfilePicture from '@/components/ProfilePicture'
import VoxCard, { VoxCardFrameProps } from '@/components/VoxCard/VoxCard'

import { RestTimelineFeedSocialMedia } from '@/services/timeline-feed/schema'
import { relativeDateFormatter } from '@/utils/DateFormatter'

import VideoFeedPostVisibility from '@/features_next/video/components/feed/VideoFeedPostVisibility'

import SocialPostDescription from './SocialPostDescription'
import SocialPostMedia from './SocialPostMedia'

export type SocialPostCardProps = {
  /** Identifiant stable du post (ex. objectID du feed) pour la lecture vidéo exclusive. */
  contentId: string
  description: string | null
  date: string | null
  author: {
    name: string | null
    username: string | null
    pictureLink?: string
  }
  media?: RestTimelineFeedSocialMedia | null
  image?: {
    url: string | null
    width: number | null
    height: number | null
  } | null
} & VoxCardFrameProps

const SocialPostCard = ({ contentId, description, date, author, media, image, ...props }: SocialPostCardProps) => {
  const mediaLayout = useMedia()

  return (
    <VoxCard borderLeftWidth={mediaLayout.sm ? 0 : 1} borderRightWidth={mediaLayout.sm ? 0 : 1} {...props}>
      <VoxCard.Content padding={0} gap={0}>
        <XStack p="$medium" alignItems="center" justifyContent="space-between" gap="$small">
          <XStack gap="$small" alignItems="center" flex={1} flexShrink={1}>
            <ProfilePicture size="$2" rounded src={author.pictureLink} alt="Photo de profil" fullName={author.name ?? author.username ?? ''} />
            <YStack flexShrink={1} gap={2}>
              {author.name ? (
                <Text.SM semibold numberOfLines={1}>
                  {author.name}
                </Text.SM>
              ) : null}
              {author.username ? (
                <Text.SM secondary numberOfLines={1}>
                  {author.username}
                </Text.SM>
              ) : null}
            </YStack>
          </XStack>
          <XStack gap="$xsmall" alignItems="center" flexShrink={0}>
            <Clock size={14} color="$textSecondary" />
            <Text.SM secondary>{relativeDateFormatter(date)}</Text.SM>
          </XStack>
        </XStack>

        <VideoFeedPostVisibility contentId={contentId} media={media}>
          <SocialPostMedia contentId={contentId} media={media} image={image} />
        </VideoFeedPostVisibility>

        {description ? (
          <YStack px="$medium" pb="$medium" pt="$small">
            <SocialPostDescription description={description} />
          </YStack>
        ) : null}
      </VoxCard.Content>
    </VoxCard>
  )
}

export default SocialPostCard
