import React, { useCallback } from 'react';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';
import VoxCard from '@/components/VoxCard/VoxCard';
import { Spinner, getToken, XStack, YStack, useMedia } from 'tamagui';
import Text from '@/components/base/Text';
import { Clock, PenLine, ArrowLeft } from '@tamagui/lucide-icons';
import { relativeDateFormatter } from '@/utils/DateFormatter';
import { VoxButton } from '@/components/Button';
import { RestMessageListItem } from '@/services/publications/schema';
import SenderView from '../../../components/SenderView';
import { InfiniteData } from '@tanstack/react-query';
import Layout from '@/components/AppStructure/Layout/Layout';
import LayoutFlatList from '@/components/AppStructure/Layout/LayoutFlatList';

interface DraftContentProps {
  data?: InfiniteData<unknown, unknown>
  fetchNextPage: () => void
  hasNextPage?: boolean
  isFetchingNextPage: boolean
  scopeFromParams?: string
}

const BackButton = () => {
  const router = useRouter()

  const handleBack = () => {
    if (Platform.OS === 'web') {
      if (router.canGoBack()) {
        router.back()
      } else {
        router.push('/(militant)/publications')
      }
    } else {
      if (router.canGoBack()) {
        router.back()
      } else {
        router.dismissAll()
      }
    }
  }

  return (
    <VoxButton 
      variant="text" 
      iconLeft={ArrowLeft} 
      borderRadius={16}
      onPress={handleBack}
    >
      Retour
    </VoxButton>
  )
}

const PublicationItem = ({ item, scope }: { item: RestMessageListItem; scope?: string }) => {
  const router = useRouter();

  const handlePress = useCallback(() => {
    const navigationParams: { id: string; scope?: string } = { id: item.uuid };
    if (scope) {
      navigationParams.scope = scope;
    }

    router.push({
      pathname: '/app/publications/creer',
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

export function DraftContent({ data, fetchNextPage, hasNextPage, isFetchingNextPage, scopeFromParams }: DraftContentProps) {
  const publications = data?.pages.flatMap((page: { items: RestMessageListItem[] }) => page.items) || [];

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderItem = useCallback(({ item }: { item: RestMessageListItem }) => {
    return <PublicationItem item={item} scope={scopeFromParams} />
  }, [scopeFromParams]);

  return (
    <Layout.Main>
      <LayoutFlatList<RestMessageListItem>
        padding="left"
        data={publications}
        renderItem={renderItem}
        keyExtractor={(item) => item.uuid}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        hasMore={hasNextPage ?? false}
        ListHeaderComponent={
          <XStack alignItems="flex-start" alignSelf="flex-start">
            <BackButton />
          </XStack>
        }
        contentContainerStyle={{
          gap: getToken('$medium', 'space'),
        }}
        ListEmptyComponent={
          <YStack alignItems="center" margin={16}>
            <Text.MD color="$gray6">Aucune publication trouvée</Text.MD>
          </YStack>
        }
        ListFooterComponent={
          hasNextPage ? (
            <YStack p="$medium" pb="$large">
              <Spinner size="large" />
            </YStack>
          ) : null
        }
      />
    </Layout.Main>
  );
}

