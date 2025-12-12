import { View, YStack } from 'tamagui'
import { EluBlock } from './DeclaEluCard'

const codeCased = [
  'elu:cotisation_ok:exempte',
  'elu:cotisation_ok:soumis',
  'elu:cotisation_ok:non_soumis',
  'elu:attente_declaration',
  'elu:cotisation_nok',
  'elu:exempte_et_adherent_cotisation_nok',
] as const

export default {
  title: 'BlocksElu',
  component: EluBlock,
}

export function Default() {
  return (
    <YStack gap="$medium" justifyContent="center">
      {codeCased.map((code) => (
        <View maxWidth={500}>
          <EluBlock code={[code]} declaration={1600} cotisation={20} onPressIbanForm={() => {}} onPressDeclaForm={() => {}} />
        </View>
      ))}
    </YStack>
  )
}
