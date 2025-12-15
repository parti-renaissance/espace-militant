import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { Layout, LayoutFlatList } from "@/components/AppStructure";
import Text from "@/components/base/Text";
import { getToken, Spinner, useMedia, XStack, YStack } from "tamagui";
import { RestMessageListItem } from "@/services/publications/schema";
import { PublicationCadreItem } from "./components/item";
import { VoxButton } from "@/components/Button";
import { Sparkle } from "@tamagui/lucide-icons";
import { usePaginatedMessages } from "@/services/publications/hook";
import { useGetExecutiveScopes } from "@/services/profile/hook";
import DeleteModal from "@/features_next/publications/components/DeleteModal";

export default function PublicationsScreen() {
  const router = useRouter();
  const media = useMedia();
  const { data: scopes } = useGetExecutiveScopes();
  const defaultScope = useMemo(() => scopes?.default?.code || '', [scopes?.default?.code]);
  const [deleteMessageId, setDeleteMessageId] = useState<string | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = usePaginatedMessages(defaultScope);

  const publications = useMemo(() => {
    return data?.pages.flatMap((page: { items: RestMessageListItem[] }) => page.items) || [];
  }, [data]);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleDeletePress = useCallback((messageId: string) => {
    setDeleteMessageId(messageId);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setDeleteMessageId(null);
  }, []);

  const handleCreatePublication = useCallback(() => {
    router.push('/publications');
  }, [router]);

  const headerComponent = useCallback(() => {
    return (
      <XStack justifyContent="space-between" alignItems="flex-start" marginBottom="$medium">
        <YStack flex={1} gap="$small">
          <Text.LG semibold>Mes publications</Text.LG>
          <Text.SM secondary>Gérez et analyser vos publications depuis votre tableau de bord</Text.SM>
        </YStack>
        <VoxButton variant="soft" theme="purple" iconLeft={Sparkle} size="lg" onPress={handleCreatePublication}>Nouvelle publication</VoxButton>
      </XStack>
    )
  }, [handleCreatePublication]);

  const renderItem = useCallback(({ item }: { item: RestMessageListItem }) => {
    return <PublicationCadreItem item={item} onDeletePress={handleDeletePress} scope={defaultScope} />;
  }, [handleDeletePress, defaultScope]);

  const contentContainerStyle = useMemo(() => {
    const baseStyle: { gap: number; paddingTop?: number; marginTop?: number } = {
      gap: getToken('$medium', 'space'),
    };
    
    if (media.sm) {
      baseStyle.paddingTop = 0;
      baseStyle.marginTop = -1;
    }
    
    return baseStyle;
  }, [media.sm]);

  return (
    <>
      <Layout.Main maxWidth={892}>
        <LayoutFlatList<RestMessageListItem>
          data={publications}
          renderItem={renderItem}
          keyExtractor={(item) => item.uuid}
          ListHeaderComponent={media.sm ? undefined : headerComponent}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          hasMore={hasNextPage ?? false}
          ListEmptyComponent={
            isLoading ? null : (
              <YStack alignItems="center" margin={16}>
                <Text.MD color="$gray6">Aucune publication trouvée</Text.MD>
              </YStack>
            )
          }
          ListFooterComponent={
            hasNextPage ? (
              <YStack p="$medium" pb="$large">
                <Spinner size="large" />
              </YStack>
            ) : null
          }
          contentContainerStyle={contentContainerStyle}
        />
      </Layout.Main>
      <DeleteModal
        isOpen={deleteMessageId !== null}
        onClose={handleCloseDeleteModal}
        messageId={deleteMessageId}
        scope={defaultScope}
      />
    </>
  )
}
