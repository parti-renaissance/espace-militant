import React from 'react'
import { StyleSheet, View } from 'react-native'
import Text from '@/components/base/Text'
import Button from '@/components/Button'
import { spacing } from '@/styles/spacing'
import { gray } from '@tamagui/colors'
import { Info } from '@tamagui/lucide-icons'

interface Props {
  name: string
  onToggle: () => void
}
export default function ReferralFormIncentive({ name, onToggle }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Info />
      </View>

      <View style={styles.textContainer}>
        <Text bold>Connaissez-vous son adresse postale ?</Text>
        <Text style={{ lineHeight: 20 }}>En préinscrivant entièrement {name}, vous multipliez par 10 ses chances d’adhérer.</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button variant={'text'} onPress={onToggle}>
          <Text color="$orange6">Préinscrire</Text>
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    padding: spacing.margin,
    borderRadius: spacing.margin,
    backgroundColor: gray.gray1,
  },
  iconContainer: {
    paddingRight: spacing.margin,
  },
  textContainer: {
    flex: 1,
  },
  buttonContainer: {
    justifyContent: 'flex-end',
  },
})
