import React from "react";
import { Layout, LayoutFlatList } from "@/components/AppStructure";
import Text from "@/components/base/Text";
import { getToken, XStack, YStack } from "tamagui";
import { RestMessageListItem } from "@/services/publications/schema";
import { PublicationCadreItem } from "./components/item";
import { VoxButton } from "@/components/Button";
import { Sparkle } from "@tamagui/lucide-icons";

const FakeData: RestMessageListItem[] = [
  {
    uuid: '123',
    author: {
      uuid: 'author-1',
      first_name: 'John',
      last_name: 'Doe',
    },
    sender: {
      uuid: 'sender-1',
      first_name: 'Jane',
      last_name: 'Smith',
      image_url: null,
      scope: null,
      instance: null,
      zone: null,
      role: 'Admin',
      theme: null,
    },
    label: 'Publication 1',
    subject: 'Subject 1',
    status: 'published',
    sent_at: null,
    recipient_count: 100,
    source: 'web',
    created_at: '2021-01-01',
    synchronized: true,
    from_name: 'John Doe',
    statistics: {
      sent: 100,
      opens: 50,
      open_rate: 0.5,
      clicks: 20,
      click_rate: 0.2,
      unsubscribe: 2,
      unsubscribe_rate: 0.02,
    },
    preview_link: null,
  },
  {
    uuid: '456',
    author: {
      uuid: 'author-2',
      first_name: 'Alice',
      last_name: 'Johnson',
    },
    sender: {
      uuid: 'sender-2',
      first_name: 'Bob',
      last_name: 'Williams',
      image_url: null,
      scope: null,
      instance: null,
      zone: null,
      role: 'Editor',
      theme: null,
    },
    label: 'Publication 2',
    subject: 'Subject 2',
    status: 'draft',
    sent_at: null,
    recipient_count: 200,
    source: 'web',
    created_at: '2021-01-02',
    synchronized: false,
    from_name: 'Alice Johnson',
    statistics: {
      sent: 0,
      opens: 0,
      open_rate: 0,
      clicks: 0,
      click_rate: 0,
      unsubscribe: 0,
      unsubscribe_rate: 0,
    },
    preview_link: null,
  },
  {
    uuid: '789',
    author: {
      uuid: 'author-3',
      first_name: 'Charlie',
      last_name: 'Brown',
    },
    sender: {
      uuid: 'sender-2',
      first_name: 'Bob',
      last_name: 'Williams',
      image_url: null,
      scope: null,
      instance: null,
      zone: null,
      role: 'Editor',
      theme: null,
    },
    label: 'Publication 3',
    subject: 'Subject 3',
    status: 'published',
    sent_at: '2021-01-03',
    recipient_count: 300,
    source: 'web',
    created_at: '2021-01-03',
    synchronized: true,
    from_name: 'Charlie Brown',
    statistics: {
      sent: 200,
      opens: 100,
      open_rate: 0.5,
      clicks: 40,
      click_rate: 0.2,
      unsubscribe: 4,
      unsubscribe_rate: 0.02,
    },
    preview_link: null,
  },
]

const headerComponent = () => {
  return (
    <XStack justifyContent="space-between" alignItems="flex-start" marginBottom="$medium">
      <YStack flex={1} gap="$small">
        <Text.LG semibold>Mes publications</Text.LG>
        <Text.SM secondary>Gérez et analyser vos publications depuis votre tableau de bord</Text.SM>
      </YStack>
      <VoxButton variant="soft" theme="purple" iconLeft={Sparkle} size="lg" onPress={() => { }}>Nouvelle publication</VoxButton>
    </XStack>
  )
}

export default function PublicationsScreen() {
  return (
    <Layout.Main maxWidth={892}>
      <LayoutFlatList<RestMessageListItem>
        data={FakeData}
        renderItem={({ item }) => <PublicationCadreItem item={item} />}
        keyExtractor={(item) => item.uuid}
        ListHeaderComponent={headerComponent}
        ListEmptyComponent={
          <YStack alignItems="center" margin={16}>
            <Text.MD color="$gray6">Aucune publication trouvée</Text.MD>
          </YStack>
        }
        contentContainerStyle={{
          gap: getToken('$medium', 'space'),
        }}
      />
    </Layout.Main>
  )
}