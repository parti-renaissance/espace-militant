import { GeneralConventionsDenyCard } from '@/screens/generalConventions/components/DenyCard'
import EmptyFormaState from '@/screens/generalConventions/components/EmptyFormaState'
import { FormaCard } from '@/screens/generalConventions/components/FormaCard'
import { useGetGeneralConventions } from '@/services/general-convention/hook'
import { useGetSuspenseProfil } from '@/services/profile/hook'
import { XStack } from 'tamagui'

const Section = () => {
  const { data: user } = useGetSuspenseProfil()
  const isAdherent = user?.tags?.find((tag) => tag.type === 'adherent')
  const { data } = useGetGeneralConventions(!!isAdherent)

  if (!isAdherent) {
    return <GeneralConventionsDenyCard topVisual={0} />
  }

  if (!Array.isArray(data) || data.length === 0) {
    return <EmptyFormaState />
  }

  return (
    <XStack flexWrap="wrap" alignItems={'flex-start'} maxWidth={1200} gap={'$4'} $gtSm={{ gap: '$8' }} justifyContent="center">
      {data.map((generalConvention, index) => (
        <FormaCard key={index} payload={generalConvention} />
      ))}
    </XStack>
  )
}

export default Section
