import React, { useState } from "react";
import PageLayout from "@/components/layouts/PageLayout/PageLayout";
import { ScrollView, XStack, YStack } from "tamagui";
import { VoxButton } from "@/components/Button";
import { Link } from "expo-router";
import Text from "@/components/base/Text";
import { X } from "@tamagui/lucide-icons";
import { ExternalLink } from "@/screens/shared/ExternalLink";
import VoxCard from "@/components/VoxCard/VoxCard";
import { useGetExecutiveScopes } from "@/services/profile/hook";
import MessageScopeSelector from "@/features/message/components/MessageScopeSelector";

const HelpCard = () => {
  const [isOpen, setIsOpen] = useState(true)
  if (!isOpen) {
    return null;
  }
  return (
    <VoxCard backgroundColor="$textOutline" borderRadius="$medium">
      <VoxCard.Content>
        <XStack gap="$medium">
          <YStack flexShrink={1}>
            <Text.SM lineHeight={20}>
              <Text.SM semibold>Votre publication sera diffusée sur l'accueil de l'espace Militants de vos destinataires. Elle leur sera également envoyée par email.</Text.SM>
              <Text.SM>Besoin d'en savoir plus ?  <Text.SM
                textDecorationLine="underline"
                textDecorationDistance={2}
                color="$blue5"
                onPress={() => ExternalLink.openUrl("https://parti.re")}
              >
                Consultez l'aide.
              </Text.SM></Text.SM>
            </Text.SM>
          </YStack>
          <VoxButton
            theme="gray"
            backgroundColor="white"
            variant="soft"
            textColor="black"
            size="xs"
            shrink
            iconLeft={X} onPress={() => setIsOpen(false)}
          />
        </XStack>
      </VoxCard.Content>
    </VoxCard>
  )
}

const MessagePageIndex = () => {
  const { data: scopes } = useGetExecutiveScopes();
  const [selectedScope, setSelectedScope] = useState<string | undefined>(() => {
    if (!scopes?.default?.code) return undefined;
    const available = (scopes?.list || [])
      .filter((scope) => scope.features.includes("publications"))
      .map((scope) => scope.code);
    return available.includes(scopes.default.code) ? scopes.default.code : undefined;
  });

  const scopeOptions = (scopes?.list || [])
    .filter((scope) => scope.features.includes("publications"))
    .map((scope) => ({ value: scope.code, label: scope.name }));

  return (
    <PageLayout webScrollable>
      <PageLayout.MainSingleColumn>
        <ScrollView backgroundColor="$surface" flex={1}>
          <YStack gap="$medium" maxWidth={550} width="100%" marginHorizontal="auto" padding="$medium" $sm={{ maxWidth: '100%' }}>
            <HelpCard />
            {scopeOptions.length > 0 && (
              <MessageScopeSelector value={selectedScope} onChange={setSelectedScope} />
            )}
            <Link 
              href="/messages/draft"
              asChild>
              <VoxButton theme="blue" variant="soft" size="lg">
                Mes brouillons
              </VoxButton>
            </Link>
            <Text.MD semibold secondary>Démarrer à partir d’un template</Text.MD>
            <Link 
              href={selectedScope ? `/messages/creer?scope=${selectedScope}&template=${encodeURIComponent(JSON.stringify([{type:'richtext'}]))}` : "/messages/creer"} 
              asChild>
              <VoxButton theme="blue" variant="soft" size="lg" disabled={!selectedScope}>
                Post Simple
              </VoxButton>
            </Link>
            <Link 
              href={selectedScope ? `/messages/creer?scope=${selectedScope}&template=${encodeURIComponent(JSON.stringify([
                {type:'richtext'},
                {type:'button'}
              ]))}` : "/messages/creer"} 
              asChild>
              <VoxButton theme="blue" variant="soft" size="lg" disabled={!selectedScope}>
                Post simple avec appel à l’action
              </VoxButton>
            </Link>
            <Link 
              href={selectedScope ? `/messages/creer?scope=${selectedScope}&template=${encodeURIComponent(JSON.stringify([
                {type:'image'},
                {type:'richtext'},
                {type:'button'}
              ]))}` : "/messages/creer"} 
              asChild>
              <VoxButton theme="blue" variant="soft" size="lg" disabled={!selectedScope}>
                Post illustré avec appel à l’action
              </VoxButton>
            </Link>
          </YStack>
        </ScrollView>
      </PageLayout.MainSingleColumn>
    </PageLayout>
  );
};

export default MessagePageIndex; 