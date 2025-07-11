import React, { useState } from "react";
import PageLayout from "@/components/layouts/PageLayout/PageLayout";
import { Image, ScrollView, XStack, YStack } from "tamagui";
import { VoxButton } from "@/components/Button";
import { Link } from "expo-router";
import Text from "@/components/base/Text";
import { ChevronRight, FileEdit, FileText, X } from "@tamagui/lucide-icons";
import { ExternalLink } from "@/screens/shared/ExternalLink";
import VoxCard from "@/components/VoxCard/VoxCard";
import { useGetExecutiveScopes } from "@/services/profile/hook";
import { useGetAvailableSenders } from "@/services/publications/hook";
import MessageScopeSelector from "@/features/publications/components/MessageScopeSelector";
import { ImageSourcePropType, Platform } from "react-native";

const postSimpleImage = require('@/assets/images/post-simple.png');
const postWithCtaImage = require('@/assets/images/post-with-cta.png');
const postIllustratedImage = require('@/assets/images/post-illustrated.png');

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
              <Text.SM display="none">Besoin d'en savoir plus ?
                <Text.SM
                  textDecorationLine="underline"
                  textDecorationDistance={2}
                  color="$blue5"
                  onPress={() => ExternalLink.openUrl("https://parti.re")}
                >
                  Consultez l'aide.
                </Text.SM>
              </Text.SM>
            </Text.SM>
          </YStack>
          <VoxButton
            display="none"
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

const PostCard = ({ title, description, image, href, icon }: { title: string, description: string, image?: ImageSourcePropType, href: string, icon?: React.ReactNode }) => {
  return (
    <Link href={href as any} asChild>
      <VoxCard
        borderRadius="$medium"
        shadowColor="rgb(145, 158, 171)"
        shadowOpacity={0.16}
        shadowOffset={{ width: 0, height: 2 }}
        shadowRadius={6}
        elevation={Platform.OS === 'android' ? 3 : undefined}
        cursor="pointer"
        hoverStyle={{
          shadowColor: "rgb(145, 158, 171)",
          shadowOpacity: 0.24,
          shadowOffset: { width: 0, height: 5 },
          shadowRadius: 18,
          elevation: Platform.OS === 'android' ? 4 : undefined,
        }}
        pressStyle={{
          shadowColor: "rgb(145, 158, 171)",
          shadowOpacity: 0.36,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 4,
          elevation: Platform.OS === 'android' ? 2 : undefined,
        }}
      >
        <VoxCard.Content>
          <XStack gap="$medium" alignItems="center">
            {image ? <Image source={image} width={48} height={64} /> : <YStack width={48} height={48} borderRadius="$small" backgroundColor="$gray1" justifyContent="center" alignItems="center">{icon}</YStack>}
            <YStack gap="$xsmall" flexShrink={1}>
              <Text.MD semibold>{title}</Text.MD>
              <Text.SM secondary>{description}</Text.SM>
            </YStack>
            <YStack justifyContent="center" marginLeft="auto">
              <ChevronRight size={16} color="$primary" />
            </YStack>
          </XStack>
        </VoxCard.Content>
      </VoxCard>
    </Link>
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

  // Preload senders for the selected scope
  useGetAvailableSenders({
    scope: selectedScope || '',
  });

  const scopeOptions = (scopes?.list || [])
    .filter((scope) => scope.features.includes("publications"))
    .map((scope) => ({ value: scope.code, label: scope.name }));

  return (
    <PageLayout webScrollable>
      <PageLayout.MainSingleColumn>
        <ScrollView backgroundColor="$surface" flex={1}>
          <YStack gap="$xlarge" maxWidth={550} width="100%" marginHorizontal="auto" padding="$medium" paddingBottom={100} $sm={{ maxWidth: '100%' }}>
            <HelpCard />
            {scopeOptions.length > 0 && (
              <MessageScopeSelector label="Pour" value={selectedScope} onChange={setSelectedScope} />
            )}
            <PostCard
              title="Mes brouillons"
              description="Reprenez là où vous vous étiez arrêté"
              href={selectedScope ? `/publications/draft?scope=${selectedScope}` : "/publications/draft"}
              icon={<FileEdit size={20} color="$gray6" />}
            />
            <YStack gap="$medium">
              <Text.MD semibold secondary>Démarrer à partir d'un template</Text.MD>
              <PostCard
                title="Post d'information"
                description="Simple texte."
                image={postSimpleImage}
                href={selectedScope ? `/publications/creer?scope=${selectedScope}&template=${encodeURIComponent(JSON.stringify([{ type: 'richtext' }]))}` : "/publications/creer"}
              />
              <PostCard
                title="Appel à l'action"
                description="Zone de texte et bouton."
                image={postWithCtaImage}
                href={selectedScope ? `/publications/creer?scope=${selectedScope}&template=${encodeURIComponent(JSON.stringify([
                  { type: 'richtext' },
                  { type: 'button' }
                ]))}` : "/publications/creer"}
              />
              <PostCard
                title="Post illustré avec appel à l'action"
                description="Image d’entête, texte et bouton."
                image={postIllustratedImage}
                href={selectedScope ? `/publications/creer?scope=${selectedScope}&template=${encodeURIComponent(JSON.stringify([
                  { type: 'image' },
                  { type: 'richtext' },
                  { type: 'button' }
                ]))}` : "/publications/creer"}
              />
            </YStack>
          </YStack>
        </ScrollView>
      </PageLayout.MainSingleColumn>
    </PageLayout>
  );
};

export default MessagePageIndex; 