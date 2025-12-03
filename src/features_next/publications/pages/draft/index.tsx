import React from 'react';
import { usePaginatedMessages } from '@/services/publications/hook';
import { useGetExecutiveScopes } from '@/services/profile/hook';
import { useLocalSearchParams } from 'expo-router';
import { DraftContent } from './components/DraftContent'
import { DraftSkeleton } from './components/DraftSkeleton'

export default function DraftPage() {
  const { data: scopes } = useGetExecutiveScopes();
  const params = useLocalSearchParams<{ scope?: string }>();
  const scopeFromParams = params?.scope;
  const defaultScope = scopeFromParams || scopes?.default?.code;
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = usePaginatedMessages(defaultScope || '', 'draft');

  if (isLoading) {
    return <DraftSkeleton />
  }

  return (
    <DraftContent 
      data={data}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      scopeFromParams={scopeFromParams}
    />
  );
}

export function DraftPageSkeleton() {
  return <DraftSkeleton />
}
