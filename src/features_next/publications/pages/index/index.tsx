import React, { useState } from "react";
import { useGetExecutiveScopes } from "@/services/profile/hook";
import { useGetAvailableSenders } from "@/services/publications/hook";
import { IndexContent } from './components/IndexContent'
import { IndexSkeleton } from './components/IndexSkeleton'

export default function MessagePageIndex() {
  const { data: scopes, isLoading } = useGetExecutiveScopes();
  const [selectedScope, setSelectedScope] = useState<string | undefined>(() => {
    const defaultCode = scopes?.default?.code;
    if (!defaultCode) return undefined;
    const available = (scopes?.list || [])
      .filter((scope) => scope.features.includes("publications"))
      .map((scope) => scope.code);
    return available.includes(defaultCode) ? defaultCode : undefined;
  });

  // Preload senders for the selected scope
  useGetAvailableSenders({
    scope: selectedScope || '',
  });

  const scopeOptions = (scopes?.list || [])
    .filter((scope) => scope.features.includes("publications"))
    .map((scope) => ({ value: scope.code, label: scope.name }));

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
