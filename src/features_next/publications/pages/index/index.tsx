import React, { useState, useEffect, useMemo } from "react";
import { useGetExecutiveScopes } from "@/services/profile/hook";
import { useGetAvailableSenders } from "@/services/publications/hook";
import { IndexContent } from './components/IndexContent'
import { IndexSkeleton } from './components/IndexSkeleton'

export default function MessagePageIndex() {
  const { data: scopes, isLoading } = useGetExecutiveScopes();
  const [selectedScope, setSelectedScope] = useState<string | undefined>(undefined);

  const availableScopes = useMemo(
    () => (scopes?.list || []).filter((scope) => scope.features.includes("publications")),
    [scopes?.list]
  );

  const scopeCodes = useMemo(() => availableScopes.map((scope) => scope.code), [availableScopes]);

  useEffect(() => {
    if (scopeCodes.length === 0 || (selectedScope && scopeCodes.includes(selectedScope))) return;

    const defaultCode = scopes?.default?.code;
    setSelectedScope(defaultCode && scopeCodes.includes(defaultCode) ? defaultCode : scopeCodes[0]);
  }, [scopes?.default?.code, scopeCodes, selectedScope]);

  useGetAvailableSenders({
    scope: selectedScope || '',
  });

  const scopeOptions = useMemo(
    () => availableScopes.map((scope) => ({ value: scope.code, label: scope.name })),
    [availableScopes]
  );

  if (isLoading) {
    return <IndexSkeleton />
  }

  return (
    <IndexContent 
      scopeOptions={scopeOptions}
      selectedScope={selectedScope}
      onScopeChange={setSelectedScope}
    />
  );
}

export function MessagePageIndexSkeleton() {
  return <IndexSkeleton />
}
