import React, { useCallback } from "react";
import Text from "@/components/base/Text";
import { Sparkle } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { Image, YStack } from "tamagui";
import { VoxButton } from "@/components/Button";

const EmptyStateIllustration = require('../../../assets/empty-publication.png');

export default function EmptyState() {
  const router = useRouter();

  const handleCreatePublication = useCallback(() => {
    router.push('/publications');
  }, [router]);

  return (
    <YStack alignItems="center" justifyContent="center" flex={1} gap={32} py={42} px={16}>
      <Image source={EmptyStateIllustration} width={178} height={189} objectFit="contain" />
      <YStack gap={24}>
        <Text.MD semibold secondary textAlign="center" textWrap="balance">Aucune publication pour le moment</Text.MD>
        <Text.MD secondary textAlign="center" textWrap="balance">
          Les publications vous permettent de communiquer avec vos militants directement dans l’application et par email.
        </Text.MD>
      </YStack>
      <YStack>
        <VoxButton variant="outlined" theme="purple" iconLeft={Sparkle} onPress={handleCreatePublication}>
          Envoyer ma première publication
        </VoxButton>
      </YStack>
    </YStack>
  )
}