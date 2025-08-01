import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import { usePaginatedMessages } from '@/services/publications/hook';
import { useGetExecutiveScopes } from '@/services/profile/hook';
import { useRouter, useLocalSearchParams } from 'expo-router';
import PageLayout from '@/components/layouts/PageLayout/PageLayout';
import VoxCard from '@/components/VoxCard/VoxCard';
import { Spinner, View, XStack, YStack, useMedia } from 'tamagui';
import Text from '@/components/base/Text';
import SkeCard from '@/components/Skeleton/CardSkeleton';
import { Clock, PenLine } from '@tamagui/lucide-icons';
import { relativeDateFormatter } from '@/utils/DateFormatter';
import { VoxButton } from '@/components/Button';
import { RestMessageListItem } from '@/services/publications/schema';
import SenderView from '../../components/SenderView';

const PublicationItem = ({ item, scope }: { item: RestMessageListItem; scope?: string }) => {
  const router = useRouter();

  const handlePress = useCallback(() => {
    const navigationParams: { id: string; scope?: string } = { id: item.uuid };
    if (scope) {
      navigationParams.scope = scope;
    }

    router.push({
      pathname: '/publications/creer',
      params: navigationParams,
    })
  }, [item.uuid, scope])

  return (
    <VoxCard
      onPress={handlePress}
      marginBottom="$small"
      cursor="pointer"
    >
      <VoxCard.Content>
        <SenderView sender={item.sender} />
        <Text.MD semibold>
          {item.subject || 'Sans titre'}
          {item.status === "draft" ? (<Text.MD regular color="#D02828"> (Brouillon)</Text.MD>) : null}
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

const DraftPage = () => {
  const media = useMedia();
  const { data: scopes } = useGetExecutiveScopes();
  const params = useLocalSearchParams<{ scope?: string }>();
  const scopeFromParams = params?.scope;
  const defaultScope = scopeFromParams || scopes?.default?.code;
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = usePaginatedMessages(defaultScope || '', 'draft');

  const publications = data?.pages.flatMap((page) => page.items) || [];

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) return (
    <PageLayout webScrollable>
      <PageLayout.MainSingleColumn>
        <YStack alignItems="center" marginTop={16} maxWidth={520} $sm={{ maxWidth: '100%' }} alignSelf="center" width="100%" gap="$small">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeCard key={i} width="100%" height={195}>
              <SkeCard.Content>
                <SkeCard.Chip />
                <SkeCard.Author />
                <SkeCard.Title />
                <SkeCard.Line width="30%" />
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
        <YStack paddingTop='$medium' $gtSm={{ paddingTop: '$xxlarge' }}>
          <FlatList
            data={publications}
            contentContainerStyle={{ maxWidth: media.sm ? '100%' : 520, alignSelf: 'center', width: '100%', paddingBottom: 100 }}
            renderItem={({ item }) => <PublicationItem item={item} scope={scopeFromParams} />}
            keyExtractor={(item) => item.uuid}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.2}
            ListFooterComponent={isFetchingNextPage ? <View alignItems="center" margin={16}><Spinner color="$blue9" /></View> : null}
            ListEmptyComponent={<View alignItems="center" margin={16}><Text.MD color="$gray6">Aucune publication trouvée</Text.MD></View>}
          />
        </YStack>
      </PageLayout.MainSingleColumn>
    </PageLayout>
  );
};

export default DraftPage;
