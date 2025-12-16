import React, { useCallback } from "react";
import { useRouter } from "expo-router";
import Text from "@/components/base/Text";
import { VoxButton } from "@/components/Button";
import VoxCard from "@/components/VoxCard/VoxCard";
import { SenderView } from "@/features_next/publications/components/SenderView";
import { ChartColumn, Copy, Eye, Pen, Trash2 } from "@tamagui/lucide-icons";
import { useMedia, XStack, YStack } from "tamagui";
import { StatCard } from "../../detail/components/PublicationGlobalStatsCards";
import { RestMessageListItem } from "@/services/publications/schema";
import { relativeDateFormatter } from "@/utils/DateFormatter";

interface PublicationCadreItemProps {
  item: RestMessageListItem;
  onDeletePress?: (messageId: string) => void;
  scope?: string;
}

export function PublicationCadreItem({ item, onDeletePress, scope }: PublicationCadreItemProps) {
  const media = useMedia()
  const router = useRouter()

  const handleDeletePress = useCallback(() => {
    if (onDeletePress) {
      onDeletePress(item.uuid);
    }
  }, [item.uuid, onDeletePress]);

  const handleEdit = useCallback(() => {
    const navigationParams: { id: string; scope?: string } = { id: item.uuid };
    if (scope) {
      navigationParams.scope = scope;
    }
    router.push({
      pathname: '/publications/creer',
      params: navigationParams,
    });
  }, [item.uuid, scope, router]);

  const handleView = useCallback(() => {
    router.push({
      pathname: '/publications/[id]',
      params: { id: item.uuid },
    });
  }, [item.uuid, router]);

  const handleStats = useCallback(() => {
    router.push({
      pathname: '/publications/[id]',
      params: { id: item.uuid, section: 'stats' },
    });
  }, [item.uuid, router]);

  return (
    <VoxCard>
      <VoxCard.Content gap={20}>
        <YStack gap="$small">
          {item.sender && <SenderView sender={{
            uuid: item.sender.uuid,
            first_name: item.sender?.first_name,
            last_name: item.sender?.last_name,
            image_url: item.sender?.image_url,
            role: item.sender?.role,
            instance: item.sender?.instance,
            zone: item.sender?.zone,
            theme: item.sender?.theme,
          }} status={item.status} />}

          <Text fontSize={media.md ? 18 : 14} semibold>
            {item.subject}
          </Text>
          <XStack gap={media.md ? '$small' : '$large'} flexWrap="wrap" >
            { item.status === 'sent' && item.sent_at ? (
              <Text.MD secondary>
                Publiée le <Text.MD secondary semibold>{relativeDateFormatter(item.sent_at)}</Text.MD> par <Text.MD secondary semibold>{item.author.first_name} {item.author.last_name}</Text.MD>
              </Text.MD>
            ) : (
              <Text.MD secondary>
                Créée le <Text.MD secondary semibold>{relativeDateFormatter(item.created_at)}</Text.MD> par <Text.MD secondary semibold>{item.author.first_name} {item.author.last_name}</Text.MD>
              </Text.MD>
            )}
          </XStack>
        </YStack>

        {(item.statistics && item.status === 'sent') && (
          <XStack gap="$small" flexWrap="wrap">
            <XStack gap="$small" flexGrow={1} width={media.md ? '100%' : undefined}>
              <StatCard value={item.statistics.unique_notifications ?? 'N/A'} label="Notifications" small theme="gray" />
              <StatCard value={item.statistics.unique_emails ?? 'N/A'} label="Emails" small theme="gray" />
              <StatCard value={item.statistics.unique_impressions.total ?? 'N/A'} label="Impressions" small theme="gray" />
            </XStack>
            <XStack gap="$small" flexGrow={1} width={media.md ? '100%' : undefined}>
              <StatCard value={item.statistics.unique_opens.total ?? 'N/A'} label="Ouvertures" small theme="gray" />
              <StatCard value={item.statistics.unique_clicks.total ?? 'N/A'} label="Clics" small theme="gray" />
              <StatCard value={item.statistics.unsubscribed.total ?? 'N/A'} label="Désabonnements" small theme="gray" />
            </XStack>
          </XStack>
        )}
        {item.status === 'draft' ? (
          <XStack gap="$small" justifyContent={media.md ? 'space-between' : 'flex-start'}>
            <XStack gap="$small">
              <VoxButton variant="outlined" theme="gray" iconLeft={Pen} size="md" onPress={handleEdit}>Modifier</VoxButton>
            </XStack>
            <XStack gap="$small">
              <VoxButton variant="text" theme="orange" iconLeft={Trash2} size="md" onPress={handleDeletePress} shrink={media.md}>Supprimer</VoxButton>
            </XStack>
          </XStack>
        ) : (
          <XStack gap="$small" justifyContent={media.md ? 'space-between' : 'flex-start'}>
            <XStack gap="$small">
              <VoxButton variant="outlined" theme="gray" iconLeft={Eye} size="md" onPress={handleView}>Voir</VoxButton>
              <VoxButton variant="outlined" theme="gray" iconLeft={ChartColumn} size="md" onPress={handleStats}>Stats</VoxButton>
            </XStack>
            <XStack gap="$small" display="none">
              <VoxButton variant="text" theme="gray" iconLeft={Pen} size="md" onPress={handleEdit} shrink={media.md}>Modifier</VoxButton>
              <VoxButton variant="text" theme="gray" iconLeft={Copy} size="md" onPress={() => {}} shrink={media.md}>Dupliquer</VoxButton>
            </XStack>
          </XStack>
        )}
      </VoxCard.Content>
    </VoxCard>
  )
}