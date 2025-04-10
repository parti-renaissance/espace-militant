import Text from '@/components/base/Text'
import { Image, View } from 'tamagui'

export default function ReferralListEmptyState() {
  return (
    <View width={'100%'} height={300} backgroundColor={'$gray1'} padding={'$8'} borderRadius={'$4'} justifyContent={'center'} alignItems={'center'} gap={'$8'}>
      <Image source={require('@/assets/illustrations/empty-list.png')} />
      <Text.MD fontWeight={500} color={'$textSecondary'}>
        Aucun parrainage pour le moment.
      </Text.MD>
    </View>
  )
}
