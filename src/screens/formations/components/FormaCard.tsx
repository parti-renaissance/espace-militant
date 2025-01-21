import { Linking } from 'react-native'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import SkeCard from '@/components/Skeleton/CardSkeleton'
import VoxCard from '@/components/VoxCard/VoxCard'
import { useFileDownload } from '@/hooks/useFileDownload'
import { useGetFormationLink } from '@/services/formations/hook'
import { RestGetFormationsResponse } from '@/services/formations/schema'
import { Download, Eye, GraduationCap } from '@tamagui/lucide-icons'
import { snakeCase } from 'lodash'
import { XStack, YStackProps } from 'tamagui'

const LinkBtn = (props: { uuid: string }) => {
  const { mutateAsync, isPending } = useGetFormationLink(props.uuid)
  const handlePress = async () => {
    const { link } = await mutateAsync()
    Linking.openURL(link)
  }
  return (
    <VoxButton variant="outlined" iconLeft={Eye} loading={isPending} onPress={handlePress}>
      Voir la formation
    </VoxButton>
  )
}

const DownloadBtn = (props: { fileName: string; uuid: string }) => {
  const { handleDownload, isPending } = useFileDownload()
  const fileName = snakeCase(props.fileName)
  const handlePress = () => handleDownload({ url: `/api/v3/formations/${props.uuid}/file`, fileName, mimeType: 'application/pdf', UTI: 'com.adobe.pdf' })
  return (
    <VoxButton variant="outlined" iconLeft={Download} loading={isPending} onPress={handlePress}>
      Télécharger
    </VoxButton>
  )
}

const Btn = ({ payload }: { payload: RestGetFormationsResponse[number] }) => {
  if (payload.content_type === 'file') {
    return <DownloadBtn fileName={payload.title} uuid={payload.uuid} />
  } else {
    return <LinkBtn uuid={payload.uuid} />
  }
  return null
}

type Props = {
  payload: RestGetFormationsResponse[number]
  last?: boolean
}

export const FormaCard = ({ payload, last, ...props }: Props & YStackProps) => {
  const chipLabel = payload.visibility === 'local' ? 'Formation locale' : 'Formation nationale'
  const chipTheme = payload.visibility === 'local' ? 'green' : 'blue'
  return (
    <VoxCard.Content borderBottomWidth={last ? 0 : 1} borderColor="$textOutline" padding={0} paddingBottom={last ? 0 : 16} backgroundColor="$white1" {...props}>
      <XStack justifyContent="space-between">
        <VoxCard.Chip theme={chipTheme} icon={GraduationCap}>
          {chipLabel}
        </VoxCard.Chip>
        {payload.category ? <VoxCard.Chip>{payload.category}</VoxCard.Chip> : null}
      </XStack>
      <Text.LG>{payload.title}</Text.LG>
      {payload.description ? <VoxCard.Description markdown>{payload.description}</VoxCard.Description> : null}
      <Btn payload={payload} />
    </VoxCard.Content>
  )
}

export const FormaCardSkeleton = ({ last, ...props }: Omit<Props, 'payload'> & YStackProps) => {
  return (
    <SkeCard>
      <SkeCard.Content
        borderBottomWidth={last ? 0 : 1}
        padding={0}
        paddingBottom={last ? 0 : 16}
        borderColor={'$textOutline'}
        backgroundColor="$white1"
        {...props}
      >
        <XStack justifyContent="space-between">
          <SkeCard.Chip />
          <SkeCard.Chip />
        </XStack>
        <SkeCard.Title />
        <SkeCard.Description />
        <SkeCard.Button />
      </SkeCard.Content>
    </SkeCard>
  )
}
