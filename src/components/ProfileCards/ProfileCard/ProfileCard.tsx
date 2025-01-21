import { TouchableOpacity } from 'react-native'
import ProfileTags from '@/components/ActivistTags'
import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import ProfilePicture from '@/components/ProfilePicture'
import VoxCard from '@/components/VoxCard/VoxCard'
import { RestProfilResponse } from '@/services/profile/schema'
import { ChevronRight, Repeat } from '@tamagui/lucide-icons'
import { Link } from 'expo-router'
import { View, YStack } from 'tamagui'

export interface ProfileCardProps {
  firstName?: string
  lastName?: string
  src?: string
  onButtonPress?: () => void
  tags?: RestProfilResponse['tags']
}

export default function ProfileCard({ firstName = '', lastName = '', tags, onButtonPress, src }: ProfileCardProps) {
  return (
    <VoxCard inside bg={'$white1'}>
      <VoxCard.Content gap={'$medium'}>
        <Link href={'/profil'} asChild>
          <TouchableOpacity>
            <View alignItems={'center'} flexDirection={'row'}>
              <YStack marginRight={'$3'}>
                <ProfilePicture
                  fullName={`${firstName} ${lastName}`}
                  alt="profile picture"
                  size="$4"
                  src={src}
                  backgroundColor="$gray1"
                  textColor="$gray4"
                  fontWeight={'$6'}
                  rounded
                />
              </YStack>
              <YStack>
                <Text fontFamily={'$PublicSans'} color={'$textPrimary'} fontWeight={'500'} fontSize={14}>
                  {firstName} {lastName}
                </Text>
              </YStack>
              <YStack flex={1} alignItems={'flex-end'}>
                <ChevronRight color={'$textSecondary'} />
              </YStack>
            </View>
          </TouchableOpacity>
        </Link>

        <ProfileTags tags={tags || []} />

        {onButtonPress && (
          <YStack>
            <VoxButton width="100%" pop variant="soft" theme="purple" iconLeft={Repeat} onPress={onButtonPress}>
              Mon espace cadre
            </VoxButton>
          </YStack>
        )}
      </VoxCard.Content>
    </VoxCard>
  )
}
