import { Linking } from 'react-native'
import { VoxButton } from '@/components/Button'
import { z } from 'zod'
import { RestDetailedProfileResponseSchema } from '@/services/profile/schema'

type Props = {
  profile?: z.infer<typeof RestDetailedProfileResponseSchema>
  committeeName: string
  assemblyName: string
}

const buildCandidateUrl = ({ public_id, first_name, last_name, phone, email, postal_address, assembly, committee}: 
    { public_id: string; first_name: string; last_name: string; phone: string; email: string; postal_address: string; assembly: string; committee: string }) => {
  const baseUrl = 'https://form.parti.re/r/3jYJ7a'
  const params = new URLSearchParams({
    public_id,
    first_name,
    last_name,
    postal_address,
    assembly,
    committee,
    phone,
    email,
  })

  return `${baseUrl}?${params.toString()}`
}

export const CommitteeCandidateButton = ({
  profile,
  committeeName,
  assemblyName,
}: Props) => {
  if (!profile) return null

  const postal_address = `${profile.post_address?.address ?? ''} ${profile.post_address?.postal_code ?? ''} ${profile.post_address?.city_name ?? ''}`.trim()

  const handlePress = () => {
    const url = buildCandidateUrl({
      public_id: profile.id,
      first_name: profile.first_name,
      last_name: profile.last_name,
      phone: profile.phone?.number ?? "",
      email: profile.email_address,
      postal_address,
      assembly: assemblyName ?? "Inconnu",
      committee: committeeName ?? "Inconnu",
    })

    Linking.openURL(url)
  }

  return (
    <VoxButton variant="outlined" onPress={handlePress}>
      Candidater
    </VoxButton>
  )
}
