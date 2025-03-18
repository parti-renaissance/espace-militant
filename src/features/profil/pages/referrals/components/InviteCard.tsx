import React from 'react'
import { StyleSheet, View } from 'react-native'
import Text from '@/components/base/Text'
import VoxCard from '@/components/VoxCard/VoxCard'
import { Spacing } from '@/styles'
import { HeartHandshake } from '@tamagui/lucide-icons'
import Button from '../../../../../components/Button'

export default function InviteCard() {
  return (
    <VoxCard bg="$orange1" borderColor="$orange2" borderWidth={1} inside>
      <VoxCard.Content pr="$large">
        <View style={Styles.container}>
          <View style={Styles.leftPart}>
            <Text.LG>Invitez vos rencontres à nous rejoindre</Text.LG>

            <Text.SM color="$textSecondary" lineHeight={20}>
              Afin de faire gagner du temps à une personne intéressée envoyez-lui, le formulaire d’adhésion par email ou pré-inscrivez là.
            </Text.SM>

            <Button theme="orange" size="xl">
              <Button.Text color="$white1" bold>
                J’envoie une invitation
              </Button.Text>
            </Button>
          </View>
          <View style={Styles.rightPart}>
            <HeartHandshake size="$7" color="$orange5" strokeWidth={1} />
          </View>
        </View>
      </VoxCard.Content>
    </VoxCard>
  )
}

const Styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: Spacing.unit,
  },
  leftPart: {
    flex: 3,
    gap: Spacing.unit,
  },
  rightPart: {
    flex: 1,
    gap: Spacing.unit,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
