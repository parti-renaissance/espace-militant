import React, { useState } from "react";
import { Image, useMedia, XStack, YStack } from "tamagui";
import { VoxButton } from "@/components/Button";
import { Link } from "expo-router";
import Text from "@/components/base/Text";
import { ChevronRight, FileEdit, X } from "@tamagui/lucide-icons";
import VoxCard from "@/components/VoxCard/VoxCard";
import MessageScopeSelector from "../../../components/MessageScopeSelector";
import { ImageSourcePropType, Platform } from "react-native";
import Layout from '@/components/AppStructure/Layout/Layout';
import LayoutScrollView from '@/components/AppStructure/Layout/LayoutScrollView';

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

interface IndexContentProps {
  scopeOptions: Array<{ value: string; label: string }>
  selectedScope?: string
  onScopeChange: (scope: string | undefined) => void
}

export function IndexContent({ scopeOptions, selectedScope, onScopeChange }: IndexContentProps) {
  return (
    <Layout.Main>
      <LayoutScrollView>
        <YStack gap="$xlarge" width="100%" marginHorizontal="auto" paddingBottom={100}>
          <HelpCard />
          {scopeOptions.length > 0 && (
            <MessageScopeSelector label="Pour" value={selectedScope} onChange={onScopeChange} />
          )}
          <PostCard
            title="Mes brouillons"
            description="Reprenez là où vous vous étiez arrêté"
            href={selectedScope ? `/publications/brouillons?scope=${selectedScope}` : "/publications/brouillons"}
            icon={<FileEdit size={20} color="$gray6" />}
          />
          <YStack gap="$medium">
            <Text.MD semibold secondary>Démarrer à partir d'un template</Text.MD>
            <PostCard
              title="Post d'information"
              description="Simple texte."
              image={postSimpleImage}
              href={selectedScope ? `/publications/creer?scope=${selectedScope}&template=${encodeURIComponent(JSON.stringify([{ type: 'richtext', id: 'text' }]))}` : "/publications/creer"}
            />
            <PostCard
              title="Appel à l'action"
              description="Zone de texte et bouton."
              image={postWithCtaImage}
              href={selectedScope ? `/publications/creer?scope=${selectedScope}&template=${encodeURIComponent(JSON.stringify([
                { type: 'richtext', id: 'text' },
                { type: 'button', id: 'cta' }
              ]))}` : "/publications/creer"}
            />
            <PostCard
              title="Post illustré avec appel à l'action"
              description="Image d'entête, texte et bouton."
              image={postIllustratedImage}
              href={selectedScope ? `/publications/creer?scope=${selectedScope}&template=${encodeURIComponent(JSON.stringify([
                { type: 'image', id: 'image' },
                { type: 'richtext', id: 'text' },
                { type: 'button', id: 'cta' }
              ]))}` : "/publications/creer"}
            />
          </YStack>
        </YStack>
      </LayoutScrollView>
    </Layout.Main>
  );
}

