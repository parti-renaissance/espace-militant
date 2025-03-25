import { NamedExoticComponent } from 'react'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import VoxCard from '@/components/VoxCard/VoxCard'
import { DoubleCircle, DoubleDiamond, DoubleTriangle } from '@/features/profil/pages/instances/components/icons'
import { GeneralConventionOrganizerEnum } from '@/screens/generalConventions/types'
import { RestGeneralConventionResponse } from '@/services/general-convention/schema'
import { Eye, Users } from '@tamagui/lucide-icons'
import { router } from 'expo-router'
import { isWeb, XStack, YStack, YStackProps } from 'tamagui'

const LinkBtn = ({ uuid }: { uuid: string }) => {
  return (
    <VoxButton
      variant="outlined"
      alignSelf={'center'}
      iconLeft={Eye}
      onPress={() => {
        router.navigate({
          pathname: '/etats-generaux/[id]',
          params: { id: uuid },
        })
      }}
    >
      Lire
    </VoxButton>
  )
}

type Props = {
  payload: RestGeneralConventionResponse
}

export const Icon = ({ organizer }: { organizer: GeneralConventionOrganizerEnum }) => {
  const getIcon = (): [NamedExoticComponent | null, string | null] => {
    switch (organizer) {
      case GeneralConventionOrganizerEnum.ASSEMBLY:
        return [DoubleCircle, 'Assemblée']
      case GeneralConventionOrganizerEnum.DISTRICT:
        return [DoubleTriangle, 'Circonscription']
      case GeneralConventionOrganizerEnum.COMMITTEE:
        return [DoubleDiamond, 'Comité']
      default:
        return [null, null]
    }
  }

  const [IconComponent, label] = getIcon()

  if (!IconComponent || !label) {
    return null
  }

  return <VoxCard.Chip icon={isWeb ? IconComponent : undefined}>{label}</VoxCard.Chip>
}

export const Title = ({ payload }) => {
  const title = (() => {
    return payload.department_zone ? `${payload.department_zone.name} (${payload.department_zone.code})` : ''
  })()

  return (
    <Text.MD primary semibold>
      {title}
    </Text.MD>
  )
}

export const FormaCard = ({ payload, ...props }: Props & YStackProps) => {
  return (
    <YStack
      $sm={{ borderRadius: 0 }}
      overflow="hidden"
      boxSizing={'border-box'}
      borderColor="$textOutline"
      borderWidth={1}
      width={'100%'}
      minWidth={300}
      $gtSm={{ width: '45%', borderRadius: 16 }}
      $gtMd={{ width: '30%' }}
    >
      <VoxCard style={{ borderRadius: '0' }} inside width={'100%'}>
        <VoxCard.Content padding={20} {...props}>
          <XStack justifyContent="space-between">
            <YStack gap={16}>
              <Icon organizer={payload.organizer} />
              <Title payload={payload} />
              <XStack gap={8} alignItems="center">
                <Users size={12} color="$textPrimary" />
                <Text.SM primary alignItems="center" gap={4}>
                  {payload.members_count} contributeur{payload.members_count > 1 ? 's' : ''}
                </Text.SM>
              </XStack>
            </YStack>
            <LinkBtn uuid={payload.uuid} />
          </XStack>
        </VoxCard.Content>
      </VoxCard>
    </YStack>
  )
}
