import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import { usePaginatedMessages } from '@/services/messages/hook';
import { useGetExecutiveScopes } from '@/services/profile/hook';
import { useRouter } from 'expo-router';
import PageLayout from '@/components/layouts/PageLayout/PageLayout';
import VoxCard from '@/components/VoxCard/VoxCard';
import { Spinner, View, XStack, YStack } from 'tamagui';
import Text from '@/components/base/Text';
import SkeCard from '@/components/Skeleton/CardSkeleton';
import { Clock, PenLine } from '@tamagui/lucide-icons';
import { relativeDateFormatter } from '@/utils/DateFormatter';
import { VoxButton } from '@/components/Button';
import { RestMessageListItem } from '@/services/messages/schema';
import SenderView from '../../components/SenderView';

const MessageItem = ({ item }: { item: RestMessageListItem }) => {
  const router = useRouter();

  const handlePress = useCallback(() => {
    router.push({
      pathname: '/messages/[id]/editer',
      params: { id: item.uuid },
    })
  }, [item.uuid])

  return (
    <VoxCard
      onPress={handlePress}
      marginBottom="$small"
      cursor="pointer"
    >
      <VoxCard.Content>
        <SenderView sender={item.sender} />
        <Text.MD semibold>
          {item.subject}
          {item.status === "draft" ? (<Text.MD semibold color="#D02828"> (Brouillon)</Text.MD>) : null}
        </Text.MD>
        <XStack justifyContent="space-between">
          <XStack gap="$xsmall" alignItems="center">
            <Clock size={16} color="$textSecondary" />
            <Text.SM secondary>
              Créé {relativeDateFormatter(item.created_at)}
            </Text.SM>
          </XStack>
          <VoxButton variant="outlined" iconLeft={PenLine} size="sm" onPress={handlePress}>Éditer / publier</VoxButton>
        </XStack>
      </VoxCard.Content>
    </VoxCard>
  );
};

const PaginatedMessagesPage = () => {
  const { data: scopes } = useGetExecutiveScopes();
  const defaultScope = scopes?.default?.code;
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = usePaginatedMessages(defaultScope || '', 'draft');

  const messages = data?.pages.flatMap((page) => page.items) || [];

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) return (
    <PageLayout webScrollable>
      <PageLayout.MainSingleColumn>
        <YStack alignItems="center" marginTop={16} maxWidth={550} alignSelf="center" width="100%" gap="$small">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeCard key={i} width="100%">
              <SkeCard.Content>
                <SkeCard.Title />
                <SkeCard.Description />
              </SkeCard.Content>
            </SkeCard>
          ))}
        </YStack>
      </PageLayout.MainSingleColumn>
    </PageLayout>
  );
  if (error) return (
    <View alignItems="center" margin={20}><Text.MD color="$red10">Erreur de chargement</Text.MD></View>
  );

  return (
    <PageLayout webScrollable>
      <PageLayout.MainSingleColumn>
        <FlatList
          data={messages}
          contentContainerStyle={{ maxWidth: 550, alignSelf: 'center', width: '100%', paddingBottom: 100, paddingTop: 16 }}
          renderItem={({ item }) => <MessageItem item={item} />}
          keyExtractor={(item) => item.uuid}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.2}
          ListFooterComponent={isFetchingNextPage ? <View alignItems="center" margin={16}><Spinner color="$blue9" /></View> : null}
        />
      </PageLayout.MainSingleColumn>
    </PageLayout>
  );
};

export default PaginatedMessagesPage;
