import VoxCard, {VoxCardAuthorProps, VoxCardDateProps, VoxCardLocationProps } from '@/components/VoxCard/VoxCard'
import { XStack, Button, Text } from 'tamagui'

export interface EventVoxCardProps {
  payload: {
    title: string,
    tag: string,
    type: 'news' | 'event' | 'riposte' | 'action',
    image?: string,
  } & VoxCardDateProps & VoxCardLocationProps & VoxCardAuthorProps
}


const EventCard = ({payload}: EventVoxCardProps) => {
  const chipVariant = { [`${payload.type}`]: true }
  return (
    <VoxCard>
      <VoxCard.Chip {...chipVariant}>{payload.tag}</VoxCard.Chip>
      <VoxCard.Title>{payload.title}</VoxCard.Title>
      {payload.image && <VoxCard.Image image={payload.image}/> }
      <VoxCard.Date date={payload.date}/>
      <VoxCard.Location location={payload.location}/>
      <VoxCard.Author author={payload.author}/>
      <XStack justifyContent="space-between">
        <Button size="$2.5" backgroundColor="$white1" borderWidth="$1" paddingHorizontal="$4" borderColor="$gray3">
          <Text fontFamily="$PublicSans" fontWeight="$6" color="$gray8">Voir l'événement</Text>
        </Button>
        <Button size="$2.5" backgroundColor="$gray8" paddingHorizontal="$4">
          <Text fontFamily="$PublicSans" fontWeight="$6" color="$white1">M'inscrire</Text>
        </Button>
      </XStack>
    </VoxCard>
  )
}



export default EventCard




