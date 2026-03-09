import React from 'react'
import { styled, useMedia, View, ViewProps, XStack, YStack } from 'tamagui'
import { Mail, Monitor, Phone, Smartphone } from '@tamagui/lucide-icons'

import Text from '@/components/base/Text'
import ProfilePicture from '@/components/ProfilePicture'
import VoxCard from '@/components/VoxCard/VoxCard'

import { Chip } from '@/components'
import { IconComponent } from '@/models/common.model'
import { RestAdherentListItem } from '@/services/adherents/schema'

// 1. On crée le conteneur stylé
const ChipContainer = styled(View, {
  bg: '$gray1',
  w: 24,
  h: 24,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 4,
})

const StatusBadge = styled(View, {
  position: 'absolute',
  top: -2,
  right: -3,
  w: 8,
  h: 8,
  borderRadius: 6,
  borderWidth: 1.5,
  borderColor: 'white',

  variants: {
    status: {
      active: { bg: '$green9' },
      inactive: { bg: '$orange9' },
      neutral: { bg: '$gray4' },
    },
  } as const,
})

export type ContactStatus = 'active' | 'inactive' | 'neutral' | 'disabled'

type ContactStatusChipProps = ViewProps & {
  status: ContactStatus
  Icon: IconComponent
}

export function ContactStatusChip({ status, Icon, ...props }: ContactStatusChipProps) {
  const isDisabled = status === 'disabled'

  return (
    <ChipContainer {...props}>
      <Icon size={12} color={isDisabled ? '$textDisabled' : '$primary'} />
      {!isDisabled && <StatusBadge status={status} />}
    </ChipContainer>
  )
}

export function MilitantCadreItem({ public_id, first_name, last_name, image_url, age }: RestAdherentListItem) {
  const media = useMedia()

  const isMobileLayout = media.md || media.sm
  const col1Width = isMobileLayout ? '100%' : '25%'
  const col2Width = isMobileLayout ? '100%' : '30%'
  const col3Width = isMobileLayout ? '50%' : '25%'
  const col4Width = isMobileLayout ? '50%' : '20%'

  return (
    <VoxCard>
      <VoxCard.Content>
        <XStack flexWrap="wrap" width="100%" rowGap={isMobileLayout ? 16 : 0}>
          {/* --- COLONNE 1 : PROFIL --- */}
          <XStack width={col1Width} pr={8} alignItems="center" gap={12} overflow="hidden">
            <ProfilePicture size={40} rounded src={image_url ?? undefined} fullName={`${first_name} ${last_name}`} alt={`${first_name} ${last_name}`} />
            <YStack flex={1} overflow="hidden">
              <Text.SM medium numberOfLines={1}>
                {first_name} {last_name}
              </Text.SM>
              {age != null && (
                <Text.SM secondary medium numberOfLines={1}>
                  {age} ans
                </Text.SM>
              )}
              {public_id && (
                <Text.XSM secondary medium numberOfLines={1}>
                  {public_id}
                </Text.XSM>
              )}
            </YStack>
          </XStack>

          {/* --- COLONNE 2 : TAGS --- */}
          <YStack width={col2Width} pr={8} gap={6} overflow="hidden">
            <XStack gap={4}>
              <Chip theme="yellow">Todo Tag adherent</Chip>
            </XStack>
            <XStack gap={4}>
              <Chip theme="purple">Todo cadre</Chip>
              <Chip theme="purple">+2</Chip>
            </XStack>
            <XStack gap={4}>
              <Chip theme="orange">Todo élu</Chip>
              <Chip theme="orange">+1</Chip>
            </XStack>
          </YStack>

          {/* --- COLONNE 3 : LOCALISATION & STATUT --- */}
          <YStack width={col3Width} pr={8} gap={2} overflow="hidden">
            <Text.SM semibold numberOfLines={1}>
              Circonscription
            </Text.SM>
            <Text.SM semibold numberOfLines={1}>
              Commune
            </Text.SM>
            <Text.SM secondary regular numberOfLines={1}>
              Comité
            </Text.SM>
            <XStack gap={12} mt={4} flexWrap="wrap">
              <ContactStatusChip status="active" Icon={Smartphone} />
              <ContactStatusChip status="disabled" Icon={Monitor} />
              <ContactStatusChip status="neutral" Icon={Phone} />
              <ContactStatusChip status="inactive" Icon={Mail} />
            </XStack>
          </YStack>

          {/* --- COLONNE 4 : SCORES & DATES --- */}
          <YStack width={col4Width} overflow="hidden">
            <XStack display="none">
              <Text.SM semibold numberOfLines={1}>
                TODO score RFE
              </Text.SM>
            </XStack>
            <XStack gap={12}>
              <YStack>
                <Text.XSM secondary numberOfLines={1}>
                  Ancienneté
                </Text.XSM>
                <Text.SM semibold numberOfLines={1}>
                  2023
                </Text.SM>
              </YStack>
              <YStack>
                <Text.XSM secondary numberOfLines={1}>
                  Cotisation
                </Text.XSM>
                <Text.SM semibold numberOfLines={1}>
                  2023
                </Text.SM>
              </YStack>
            </XStack>
          </YStack>
        </XStack>
      </VoxCard.Content>
    </VoxCard>
  )
}
