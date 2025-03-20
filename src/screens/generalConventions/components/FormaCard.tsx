import { NamedExoticComponent } from 'react'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import VoxCard from '@/components/VoxCard/VoxCard'
import { DoubleCircle, DoubleDiamond, DoubleTriangle } from '@/features/profil/pages/instances/components/icons'
import { GeneralConventionOrganizerEnum } from '@/screens/generalConventions/types'
import { RestGeneralConventionResponse } from '@/services/general-convention/schema'
import { Eye, Users } from '@tamagui/lucide-icons'
import { XStack, YStackProps } from 'tamagui'

const LinkBtn = (props: { uuid: string }) => {
  return (
    <VoxButton variant="outlined" iconLeft={Eye} onPress={() => {}}>
      Lire
    </VoxButton>
  )
}

type Props = {
  payload: RestGeneralConventionResponse
  rounded: boolean
}

const Icon = ({ organizer }: { organizer: GeneralConventionOrganizerEnum }) => {
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

  const [Icon, label] = getIcon()

  if (!Icon || !label) {
    return null
  }

  return <VoxCard.Chip icon={Icon}>{label}</VoxCard.Chip>
}

export const FormaCard = ({ payload, rounded, ...props }: Props & YStackProps) => {
  const title = (() => {
    if (payload.organizer === GeneralConventionOrganizerEnum.ASSEMBLY) {
      return payload.department_zone ? `${payload.department_zone.name} (${payload.department_zone.code})` : ''
    }

    if (payload.organizer === GeneralConventionOrganizerEnum.COMMITTEE) {
      return payload.committee?.name
    }

    if (payload.organizer === GeneralConventionOrganizerEnum.DISTRICT) {
      const district = payload.district_zone
      if (!district) {
        return ''
      }
      const codeParts = district.code.split('-')
      const number = parseInt(codeParts[1])

      return `${number}${number > 1 ? 'e' : 'ère'} circonscription • ${district.name.split(' (')[0]} (${codeParts[0]})`
    }

    return ''
  })()
  return (
    <VoxCard
      style={{ borderRadius: rounded ? 16 : 0 }}
      boxSizing={'border-box'}
      borderColor="$textOutline"
      borderWidth={1}
      inside
      width={'100%'}
      $gtSm={{ width: '45%' }}
      $gtMd={{ width: '30%' }}
    >
      <VoxCard.Content padding={20} {...props}>
        <XStack justifyContent="space-between" alignItems="center">
          <Icon organizer={payload.organizer} />
          {payload.department_zone && (
            <Text.SM secondary medium>
              {payload.department_zone.name} ({payload.department_zone.code})
            </Text.SM>
          )}
        </XStack>
        <Text.MD primary semibold>
          {title}
        </Text.MD>

        <XStack gap={8} alignItems="center">
          <Users size={12} color="$textPrimary" />
          <Text.SM primary alignItems="center" gap={4}>
            {payload.members_count} contributeur{payload.members_count > 1 ? 's' : ''}
          </Text.SM>
        </XStack>
        {payload.general_summary && <VoxCard.Description markdown>{payload.general_summary}</VoxCard.Description>}
        <LinkBtn uuid={payload.uuid} />
      </VoxCard.Content>
    </VoxCard>
  )
}
