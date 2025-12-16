import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "expo-router";
import { Layout, LayoutFlatList } from "@/components/AppStructure";
import Text from "@/components/base/Text";
import { getToken, Spinner, useMedia, XStack, YStack } from "tamagui";
import { RestMessageListItem } from "@/services/publications/schema";
import { PublicationCadreItem } from "./components/ListItem";
import { PublicationsListHeader } from "./components/Header";
import { usePaginatedMessagesSuspense } from "@/services/publications/hook";
import { useGetExecutiveScopes, useMutateExecutiveScope } from "@/services/profile/hook";
import DeleteModal from "@/features_next/publications/components/DeleteModal";
import BoundarySuspenseWrapper, { DefaultErrorFallback } from "@/components/BoundarySuspenseWrapper";
import { ForbiddenError, UnauthorizedError } from "@/core/errors";
import { AccessDeny } from "@/components/AccessDeny";
import ListSkeleton from "./components/ListSkeleton";
import { VoxButton } from "@/components/Button";
import { ArrowLeft } from "@tamagui/lucide-icons";

function PublicationsContent({ scope }: { scope: string }) {
  const router = useRouter();
  const media = useMedia();
  const [deleteMessageId, setDeleteMessageId] = useState<string | null>(null);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = usePaginatedMessagesSuspense(scope);

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
    return <PublicationsListHeader />;
  }, [handleCreatePublication]);

  const renderItem = useCallback(({ item }: { item: RestMessageListItem }) => {
    return <PublicationCadreItem item={item} onDeletePress={handleDeletePress} scope={scope} />;
  }, [handleDeletePress, scope]);

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
        scope={scope}
      />
    </>
  )
}

export default function PublicationsScreen() {
  const { data: scopes } = useGetExecutiveScopes();
  const { mutate: mutateScope } = useMutateExecutiveScope();
  const defaultScope = useMemo(() => scopes?.default?.code || '', [scopes?.default?.code]);
  const previousScopeRef = useRef<string | null>(null);
  const [previousScope, setPreviousScope] = useState<string | null>(null);

  useEffect(() => {
    if (previousScopeRef.current !== null && previousScopeRef.current !== defaultScope) {
      setPreviousScope(previousScopeRef.current);
    } else if (previousScopeRef.current === defaultScope) {
      setPreviousScope(null);
    }
    previousScopeRef.current = defaultScope;
  }, [defaultScope]);

  const handleReturnToPreviousScope = useCallback(() => {
    if (previousScope && scopes?.list) {
      mutateScope({
        scope: previousScope,
        lastAvailableScopes: scopes.list.map((s) => s.code),
      });
      setPreviousScope(null);
    }
  }, [mutateScope, scopes?.list, previousScope]);

  const accessDenyButton = previousScope ? (
    <VoxButton theme="purple" iconLeft={ArrowLeft} onPress={handleReturnToPreviousScope}>
      Revenir au scope précédent
    </VoxButton>
  ) : undefined;

  return (
    <BoundarySuspenseWrapper 
      key={defaultScope}
      fallback={<ListSkeleton />} 
      errorChildren={(payload) => {
        console.log('payload', payload);
        if (payload.error instanceof UnauthorizedError || payload.error instanceof ForbiddenError) {
          return <AccessDeny 
            message="Votre rôle cadre actif ne vous permet pas d'accéder à cette fonctionnalité." 
            Button={accessDenyButton}
          />
        } else {
          return <DefaultErrorFallback {...payload} />
        }
      }}
    >
      <PublicationsContent scope={defaultScope} />
    </BoundarySuspenseWrapper>
  )
}