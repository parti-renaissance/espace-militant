import React, { useMemo, useCallback } from "react";
import { useGetExecutiveScopes, useMutateExecutiveScope } from "@/services/profile/hook";
import { useGetAvailableSenders } from "@/services/publications/hook";
import { IndexContent } from './components/IndexContent'
import { IndexSkeleton } from './components/IndexSkeleton'

export default function MessagePageIndex() {
  const { data: scopes, isLoading } = useGetExecutiveScopes();
  const { mutate: mutateScope } = useMutateExecutiveScope();

  const availableScopes = useMemo(
    () => (scopes?.list || []).filter((scope) => scope.features.includes("publications")),
    [scopes?.list]
  );

  const scopeCodes = useMemo(() => availableScopes.map((scope) => scope.code), [availableScopes]);

  const handleScopeChange = useCallback((scope: string) => {
    mutateScope({ scope });
  }, [mutateScope]);

  const selectedScope = useMemo(() => {
    if (scopeCodes.length === 0) return undefined;
    const defaultCode = scopes?.default?.code;
    return defaultCode && scopeCodes.includes(defaultCode) ? defaultCode : scopeCodes[0];
  }, [scopes?.default?.code, scopeCodes]);

  const scopeOptions = useMemo(
    () => availableScopes.map((scope) => ({ value: scope.code, label: scope.name })),
    [availableScopes]
  );

  useGetAvailableSenders({
    scope: selectedScope || '',
  });

  if (isLoading) {
    return <IndexSkeleton />
  }

  return (
    <IndexContent 
      scopeOptions={scopeOptions}
      selectedScope={selectedScope}
      onScopeChange={handleScopeChange}
    />
  );
}

export function MessagePageIndexSkeleton() {
  return <IndexSkeleton />
}
