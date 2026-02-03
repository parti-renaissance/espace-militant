import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getToken, Spinner, useMedia, YStack } from "tamagui";
import { ArrowLeft } from "@tamagui/lucide-icons";
import { Layout, LayoutFlatList } from "@/components/AppStructure";
import { RestMessageListItem } from "@/services/publications/schema";
import { PublicationCadreItem } from "./components/ListItem";
import { PublicationsListHeader } from "./components/Header";
import { usePaginatedMessages } from "@/services/publications/hook";
import { useGetExecutiveScopes, useMutateExecutiveScope } from "@/services/profile/hook";
import DeleteModal from "@/features_next/publications/components/DeleteModal";
import { ForbiddenError, UnauthorizedError } from "@/core/errors";
import { AccessDeny } from "@/components/AccessDeny";
import { VoxButton } from "@/components/Button";
import { ListSkeleton } from "./components/ListSkeleton";
import EmptyState from "./components/EmptyState";
import EmptyStateWithFilters from "./components/EmptyStateWithFilters";

export type PublicationsFilters = {
  status?: 'draft' | 'sent';
};

function PublicationsContent({ scope, accessDenyButton }: { scope: string; accessDenyButton?: React.ReactNode }) {
  const media = useMedia();
  const [deleteMessageId, setDeleteMessageId] = useState<string | null>(null);
  const [filters, setFilters] = useState<PublicationsFilters>({});
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error, refetch, isRefetching } = usePaginatedMessages(scope, filters.status);
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);

  const publications = useMemo(() => {
    return data?.pages.flatMap((page: { items: RestMessageListItem[] }) => page.items) || [];
  }, [data]);

  useEffect(() => {
    if (!isRefetching) {
      setIsManualRefreshing(false);
    }
  }, [isRefetching]);

  const handleManualRefresh = useCallback(() => {
    setIsManualRefreshing(true);
    refetch();
  }, [refetch]);

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

  const handleFilterChange = useCallback((newFilters: PublicationsFilters) => {
    setFilters(newFilters);
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters({});
  }, []);

  const headerComponent = useMemo(() => {
    return <PublicationsListHeader onFilterChange={handleFilterChange} filters={filters} />;
  }, [handleFilterChange, filters]);

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

  // Vérifier s'il y a des filtres actifs
  const hasActiveFilters = useMemo(() => {
    return filters.status !== undefined;
  }, [filters]);

  // Afficher le header seulement s'il y a des éléments OU des filtres actifs
  const shouldShowHeader = useMemo(() => {
    return publications.length > 0 || hasActiveFilters;
  }, [publications.length, hasActiveFilters]);

  // Gérer l'affichage selon l'état de chargement et les erreurs
  const listEmptyComponent = useMemo(() => {
    if (isLoading) {
      return <ListSkeleton />;
    }
    
    if (error instanceof UnauthorizedError || error instanceof ForbiddenError) {
      return (
        <AccessDeny 
          message="Votre rôle cadre actif ne vous permet pas d'accéder à cette fonctionnalité." 
          Button={accessDenyButton}
        />
      );
    }
    
    // Si aucun résultat et filtres actifs, afficher le composant avec bouton de réinitialisation
    if (hasActiveFilters) {
      return <EmptyStateWithFilters filters={filters} onResetFilters={handleResetFilters} />;
    }
    
    // Si aucun résultat et aucun filtre, afficher l'état vide normal
    return <EmptyState />;
  }, [isLoading, error, accessDenyButton, hasActiveFilters, filters, handleResetFilters]);

  return (
    <>
      <Layout.Main maxWidth={892}>
        <LayoutFlatList<RestMessageListItem>
          padding={media.sm ? false : undefined}
          data={publications}
          renderItem={renderItem}
          keyExtractor={(item) => item.uuid}
          ListHeaderComponent={shouldShowHeader ? headerComponent : undefined}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          hasMore={hasNextPage ?? false}
          ListEmptyComponent={listEmptyComponent}
          refreshing={isManualRefreshing}
          onRefresh={handleManualRefresh}
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
    if (previousScope) {
      mutateScope({
        scope: previousScope,
      });
      setPreviousScope(null);
    }
  }, [mutateScope, previousScope]);

  const accessDenyButton = previousScope ? (
    <VoxButton theme="purple" iconLeft={ArrowLeft} onPress={handleReturnToPreviousScope}>
      Revenir au rôle précédent
    </VoxButton>
  ) : undefined;

  return (
    <PublicationsContent scope={defaultScope} accessDenyButton={accessDenyButton} />
  )
}