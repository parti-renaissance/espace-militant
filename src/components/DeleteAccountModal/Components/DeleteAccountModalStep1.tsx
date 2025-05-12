import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'
import { Image, styled, View, XStack, YStack } from 'tamagui'

interface Props {
  onClose: () => void
  onConfirm: () => void
  isAdherent: boolean
}

export default function DeleteAccountModalStep1({ onClose, onConfirm, isAdherent }: Readonly<Props>) {
  return (
    <>
      <View backgroundColor="#F9F9FA" alignItems="center" paddingVertical={48}>
        <Image source={isAdherent ? require('../Assets/DeleteAccount/deleteAccount.png') : require('../Assets/DeleteAccount/deleteAccountAlt.png')} />
      </View>

      <YStack padding={'$medium'} gap={'$large'} paddingHorizontal={'$medium'}>
        <Text fontWeight={'bold'} marginBottom={'24'} fontSize={16}>
          Nous sommes désolés de vous voir partir...
        </Text>
        <JustificationText>
          Renaissance a été fondé sur la conviction que chaque voix compte et que l’engagement de chacun d’entre vous est essentiel pour faire vivre nos
          valeurs et renforcer notre démocratie.
        </JustificationText>
        <JustificationText>
          Votre départ représente un soutien de moins dans cette aventure collective, et nous espérons que nos chemins se croiseront à nouveau.
        </JustificationText>
        {isAdherent ? (
          <>
            <JustificationText>
              Néanmoins, une fois votre désadhésion réalisée, nous supprimerons votre compte ainsi que toutes vos données personnelles. Vous ne recevrez plus 
              aucun email de notre part, ni de celle de nos instances locales.
            </JustificationText>
            <JustificationText>
              Vous pourrez bien entendu réadhérer plus tard, mais nous ne serons pas en mesure de restaurer votre historique.
            </JustificationText>
          </>
        ) : (
          <>
            <JustificationText>
              Néanmoins, une fois votre compte supprimé, nous effacerons toutes vos données personnelles. Vous ne recevrez plus aucun email de notre part, 
              ni de celle de nos instances locales.
            </JustificationText>
            <JustificationText>
              Vous pourrez bien entendu recréer un compte plus tard, mais nous ne serons pas en mesure de restaurer votre historique.
            </JustificationText>
          </>
        )}
        <JustificationText>Êtes-vous vraiment certain(e) de votre décision ?</JustificationText>
      </YStack>

      <XStack gap="$medium" justifyContent="flex-end" paddingBottom={'$medium'} paddingHorizontal={'$medium'}>
        <VoxButton variant="outlined" onPress={onClose}>
          Annuler
        </VoxButton>
        <VoxButton variant="outlined" theme="orange" onPress={onConfirm}>
          J’en suis certain
        </VoxButton>
      </XStack>
    </>
  )
}

const JustificationText = styled(Text, {
  color: '$textSecondary',
  lineHeight: '20px',
})
