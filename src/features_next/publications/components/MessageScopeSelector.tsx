import React, { useMemo } from "react";
import Select, { SF, SelectOption } from "@/components/base/Select/SelectV3";
import { useGetExecutiveScopes } from "@/services/profile/hook";
import { getFormatedScope as getFormatedScopeData } from "@/features/scopes-selector/utils";
import { RestUserScopesResponse } from "@/services/profile/schema";
import { Sparkle } from "@tamagui/lucide-icons";

interface MessageScopeSelectorProps {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
}

const getFormatedScope = (scope: RestUserScopesResponse[number]): SelectOption<string> => {
  const { name, description } = getFormatedScopeData(scope);
  return {
    value: scope.code,
    label: [
      <SF.Text key="name" semibold>{name}</SF.Text>,
      ' ',
      <SF.Text key="description">{description}</SF.Text>,
    ],
    theme: 'purple',
    icon: Sparkle,
  };
};

const MessageScopeSelector: React.FC<MessageScopeSelectorProps> = ({ value, onChange, label = "En tant que", disabled }) => {
  const { data: scopes } = useGetExecutiveScopes();
  const scopeOptions = useMemo(
    () => (scopes?.list || [])
      .filter((scope) => scope.features.includes("publications"))
      .map(getFormatedScope),
    [scopes?.list]
  );

  if (scopeOptions.length === 0) return null;

  return (
    <Select
      label={label}
      value={value}
      options={scopeOptions}
      onChange={onChange}
      size="lg"
      theme="purple"
      placeholder="Sélectionnez un rôle"
      disabled={disabled}
      matchTextWithTheme
    />
  );
};

export default MessageScopeSelector; 