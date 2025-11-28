import { Linking } from 'react-native'
import { VoxButton } from '@/components/Button'
import { z } from 'zod'
import { RestDetailedProfileResponseSchema } from '@/services/profile/schema'

type Props = {
  profile?: z.infer<typeof RestDetailedProfileResponseSchema>
  assemblyName: string
}

const buildCreateCommitteeUrl = ({ public_id, first_name, last_name, postal_address, assembly, phone, email }:
    { public_id: string; first_name: string; last_name: string; postal_address: string; assembly: string; phone: string; email: string }) => {
  const baseUrl = 'https://form.parti.re/r/mVAvra'
  const params = new URLSearchParams({
    public_id,
    first_name,
    last_name,
    postal_address,
    assembly,
    phone,
    email,
  })
  return `${baseUrl}?${params.toString()}`
}

export const CommitteeCreationButton = ({ profile, assemblyName }: Props) => {
  if (!profile) return null

  const handlePress = () => {
    const postalParts = [
      profile.post_address?.address,
      profile.post_address?.postal_code,
      profile.post_address?.city_name ?? profile.post_address?.city,
    ].filter(Boolean)

    const postal_address = postalParts.join(' ')

    const url = buildCreateCommitteeUrl({
      public_id: profile.id,
      first_name: profile.first_name,
      last_name: profile.last_name,
      postal_address,
      assembly: assemblyName ?? "Inconnu",
      phone: profile?.phone?.number ?? "",
      email: profile.email_address,
    })

    Linking.openURL(url)
  }

  return (
    <VoxButton variant="outlined" onPress={handlePress}>
      Je souhaite créer un comité
    </VoxButton>
  )
}
