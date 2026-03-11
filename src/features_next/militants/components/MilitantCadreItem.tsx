import React, { memo } from 'react'
import { styled, useMedia, View, ViewProps, XStack, YStack } from 'tamagui'
import { Mail, Monitor, Phone, Smartphone } from '@tamagui/lucide-icons'

import Text from '@/components/base/Text'
import ProfilePicture from '@/components/ProfilePicture'
import VoxCard from '@/components/VoxCard/VoxCard'

import { Chip } from '@/components'
import { IconComponent } from '@/models/common.model'
import type { RestAdherentListItem } from '@/services/adherents/schema'

type ChipTheme = 'yellow' | 'blue' | 'gray' | 'purple' | 'orange'
type TagLike = { label: string; code?: string }

const TagChipRow = memo(function TagChipRow({ tags, theme }: { tags?: TagLike[] | null; theme: ChipTheme }) {
  const list = tags ?? []
  if (!list.length) return null
  const first = list[0]
  const restCount = Math.max(0, list.length - 1)
  return (
    <XStack overflow="hidden" minWidth={0} flexWrap="nowrap" gap={4} alignItems="center">
      <Chip theme={theme} flexShrink={1} minWidth={0}>
        <Text.SM numberOfLines={1} ellipsizeMode="tail" semibold color="$color5" textTransform="capitalize">
          {first.label}
        </Text.SM>
      </Chip>
      {restCount > 0 && <Chip theme={theme}>{`+${restCount}`}</Chip>}
    </XStack>
  )
})

const yearFromIsoDate = (iso?: string | null): string | null => {
  if (!iso) return null
  const y = new Date(iso).getFullYear()
  return Number.isNaN(y) ? null : String(y)
}

const subscriptionStatus = (channel?: { available: boolean; subscribed: boolean }): ContactStatus => {
  if (!channel?.available) return 'disabled'
  return channel.subscribed ? 'active' : 'inactive'
}

const getAdherentTagChipStyle = (code?: string): ChipTheme => {
  if (!code) return 'blue'
  if (code.includes('adherent:a_jour')) return 'yellow'
  if (code.includes('adherent')) return 'blue'
  return 'gray'
}

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

interface ContactStatusChipProps extends ViewProps {
  status: ContactStatus
  Icon: IconComponent
}

export const ContactStatusChip = memo(function ContactStatusChip({ status, Icon, ...props }: ContactStatusChipProps) {
  const isDisabled = status === 'disabled'
  return (
    <ChipContainer {...props} role="img" aria-label={isDisabled ? 'Canal désactivé' : `Canal ${status}`}>
      <Icon size={12} color={isDisabled ? '$textDisabled' : '$primary'} />
      {!isDisabled && <StatusBadge status={status} />}
    </ChipContainer>
  )
})

const SUBSCRIPTION_CHANNELS: { key: keyof RestAdherentListItem['subscriptions']; Icon: IconComponent }[] = [
  { key: 'mobile', Icon: Smartphone },
  { key: 'web', Icon: Monitor },
  { key: 'sms', Icon: Phone },
  { key: 'email', Icon: Mail },
]

const SubscriptionChannelsRow = memo(function SubscriptionChannelsRow({
  subscriptions,
}: {
  subscriptions: RestAdherentListItem['subscriptions'] | null | undefined
}) {
  return (
    <XStack gap={12} mt={4} flexWrap="wrap" role="list" aria-label="Canaux de contact">
      {SUBSCRIPTION_CHANNELS.map(({ key, Icon }) => (
        <ContactStatusChip key={key} status={subscriptionStatus(subscriptions?.[key])} Icon={Icon} />
      ))}
    </XStack>
  )
})

export type MilitantCadreItemProps = RestAdherentListItem & {
  onPress: () => void
}

function MilitantCadreItemInner({
  public_id,
  first_name,
  last_name,
  image_url,
  age,
  adherent_tags,
  static_tags,
  elect_tags,
  instances = [],
  subscriptions,
  account_created_at,
  first_contribution_at,
  roles,
  onPress,
}: MilitantCadreItemProps) {
  const media = useMedia()

  const isMobileLayout = media.md || media.sm
  const col1Width = isMobileLayout ? '100%' : '25%'
  const col2Width = isMobileLayout ? '100%' : '30%'
  const col3Width = isMobileLayout ? '50%' : '25%'
  const col4Width = isMobileLayout ? '50%' : '20%'

  const circonscription = instances.find((i) => i.type === 'circonscription')
  const assembly = instances.find((i) => i.type === 'assembly')
  const committee = instances.find((i) => i.type === 'committee')
  const anciennete = yearFromIsoDate(account_created_at)
  const cotisationYear = yearFromIsoDate(first_contribution_at) ?? anciennete
  const displayName = [first_name, last_name].filter(Boolean).join(' ') || ''
  const listItemAriaLabel = [displayName, age != null ? `${age} ans` : null, public_id].filter(Boolean).join(', ')

  return (
    <VoxCard
      tag="button"
      focusable
      role="listitem"
      aria-label={listItemAriaLabel || undefined}
      onPress={onPress}
      cursor="pointer"
      focusVisibleStyle={{
        outlineWidth: 2,
        outlineColor: '$gray2',
        outlineStyle: 'solid',
      }}
    >
      <VoxCard.Content>
        <XStack flexWrap="wrap" width="100%" rowGap={isMobileLayout ? 16 : 0}>
          <XStack width={col1Width} pr={8} alignItems="center" gap={12} overflow="hidden">
            <ProfilePicture size={40} rounded src={image_url ?? undefined} fullName={displayName} alt={displayName} />
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

          <YStack width={col2Width} pr={8} gap={6} overflow="hidden" minWidth={0} justifyContent="center">
            {adherent_tags && <TagChipRow tags={adherent_tags} theme={getAdherentTagChipStyle(adherent_tags?.[0]?.code)} />}
            {roles && <TagChipRow tags={roles} theme="purple" />}
            {elect_tags && <TagChipRow tags={elect_tags} theme="orange" />}
            {static_tags && <TagChipRow tags={static_tags} theme="gray" />}
          </YStack>

          <YStack width={col3Width} pr={8} gap={2} overflow="hidden">
            {circonscription && (
              <Text.SM semibold numberOfLines={1}>
                {circonscription.name}
              </Text.SM>
            )}
            {assembly && (
              <Text.SM semibold numberOfLines={1}>
                {assembly.name}
              </Text.SM>
            )}
            {committee && (
              <Text.SM secondary regular numberOfLines={1}>
                {committee.name}
              </Text.SM>
            )}
            <SubscriptionChannelsRow subscriptions={subscriptions} />
          </YStack>

          <YStack width={col4Width} overflow="hidden">
            <XStack gap={12}>
              {anciennete && (
                <YStack>
                  <Text.XSM secondary numberOfLines={1}>
                    Ancienneté
                  </Text.XSM>
                  <Text.SM semibold numberOfLines={1}>
                    {anciennete}
                  </Text.SM>
                </YStack>
              )}
              {cotisationYear && (
                <YStack>
                  <Text.XSM secondary numberOfLines={1}>
                    Cotisation
                  </Text.XSM>
                  <Text.SM semibold numberOfLines={1}>
                    {cotisationYear}
                  </Text.SM>
                </YStack>
              )}
            </XStack>
          </YStack>
        </XStack>
      </VoxCard.Content>
    </VoxCard>
  )
}

export const MilitantCadreItem = memo(MilitantCadreItemInner)
