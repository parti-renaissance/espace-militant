import Text from "@/components/base/Text";
import { VoxButton } from "@/components/Button";
import VoxCard from "@/components/VoxCard/VoxCard";
import { FiltersChips } from "@/features_next/publications/components/FiltersChips";
import { SenderView } from "@/features_next/publications/components/SenderView";
import { ChartColumn, Copy, Eye, Pen } from "@tamagui/lucide-icons";
import { useMedia, XStack, YStack } from "tamagui";
import { StatCard } from "../../detail/components/PublicationGlobalStatsCards";
import { RestMessageListItem } from "@/services/publications/schema";
import { relativeDateFormatter } from "@/utils/DateFormatter";

export function PublicationCadreItem({ item }: { item: RestMessageListItem }) {
  const media = useMedia()

  return (
    <VoxCard>
      <VoxCard.Content gap={20}>
        <YStack gap="$small">
          {item.sender && <SenderView sender={{
            uuid: item.sender.uuid,
            first_name: item.sender?.first_name ?? 'Utilisateur',
            last_name: item.sender?.last_name ?? 'Inconnu',
            role: item.sender?.role,
            instance: item.sender?.instance,
            zone: item.sender?.zone,
            theme: item.sender?.theme,
          }} status={item.status} />}

          <Text fontSize={media.md ? '20' : '14'} semibold>
            {item.subject}
          </Text>
          <XStack gap={media.md ? '$small' : '$large'} flexWrap="wrap" >
            <Text.MD secondary>
              Publiée le <Text.MD secondary semibold>{relativeDateFormatter(item.created_at)}</Text.MD> par <Text.MD secondary semibold>{item.author.first_name} {item.author.last_name}</Text.MD>
            </Text.MD>
          </XStack>
        </YStack>
        <FiltersChips
          selectedFilters={{
            zone: 'example-zone',
            committee: 'example-committee',
            adherent_tags: 'example-adherent-tags',
          }}
          isStatic
        />

        {(item.statistics && item.status === 'published') && (
          <XStack gap="$small" flexWrap="wrap">
            <XStack gap="$small" flexGrow={1} width={media.md ? '100%' : undefined}>
              <StatCard value={item.statistics.sent} label="Notifications" small theme="gray" />
              <StatCard value="N/A" label="Emails" small theme="gray" />
              <StatCard value="N/A" label="Impressions" small theme="gray" />
            </XStack>
            <XStack gap="$small" flexGrow={1} width={media.md ? '100%' : undefined}>
              <StatCard value={item.statistics.opens} label="Ouvertures" small theme="gray" />
              <StatCard value={item.statistics.clicks} label="Clics" small theme="gray" />
              <StatCard value={item.statistics.unsubscribe} label="Désabonnements" small theme="gray" />
            </XStack>
          </XStack>
        )}

        <XStack gap="$small" justifyContent={media.md ? 'space-between' : 'flex-start'}>
          <XStack gap="$small">
            <VoxButton variant="outlined" theme="gray" iconLeft={Eye} size="md" onPress={() => { }}>Voir</VoxButton>
            <VoxButton variant="outlined" theme="gray" iconLeft={ChartColumn} size="md" onPress={() => { }}>Stats</VoxButton>
          </XStack>
          <XStack gap="$small">
            <VoxButton variant="text" theme="gray" iconLeft={Pen} size="md" onPress={() => { }} shrink={media.md}>Modifier</VoxButton>
            <VoxButton variant="text" theme="gray" iconLeft={Copy} size="md" onPress={() => { }} shrink={media.md}>Dupliquer</VoxButton>
          </XStack>
        </XStack>
      </VoxCard.Content>
    </VoxCard>
  )
}