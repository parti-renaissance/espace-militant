import { GeneralConventionsDenyCard } from '@/screens/generalConventions/components/DenyCard'
import EmptyFormaState from '@/screens/generalConventions/components/EmptyFormaState'
import { FormaCard } from '@/screens/generalConventions/components/FormaCard'
import { useGetGeneralConventions } from '@/services/general-convention/hook'
import { useGetSuspenseProfil } from '@/services/profile/hook'
import { useMedia, XStack } from 'tamagui'

const Section = () => {
  const { data } = useGetGeneralConventions()
  const { sm } = useMedia()
  const { data: user } = useGetSuspenseProfil()
  const isAdherent = user?.tags?.find((tag) => tag.code.startsWith('adherent:'))

  if (!isAdherent) {
    return <GeneralConventionsDenyCard topVisual={0} />
  }

  if (data.length === 0) {
    return <EmptyFormaState />
  }

  return (
    <XStack flexWrap="wrap" alignItems={'flex-start'} maxWidth={1200} gap={'$4'} $gtSm={{ gap: '$8' }} justifyContent="center">
      {data.map((generalConvention, index) => (
        <FormaCard key={index} payload={generalConvention} rounded={!sm} />
      ))}
    </XStack>
  )
}

export default Section
