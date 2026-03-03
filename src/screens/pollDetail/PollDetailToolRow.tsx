import React, { FunctionComponent } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { Colors, Spacing, Typography } from '../../styles'
import { TouchablePlatform } from '../shared/TouchablePlatform'

import disclosureIndicator from '../../assets/images/disclosureIndicator.png'

type Props = Readonly<{
  title: string
  onPress?: () => void
}>

const PollDetailToolRow: FunctionComponent<Props> = ({ title, onPress }) => {
  return (
    <TouchablePlatform touchHighlight={Colors.touchHighlight} onPress={onPress}>
      <View style={styles.container}>
        <Text style={styles.text}>{title}</Text>
        <Image
          style={styles.image}
          source={disclosureIndicator}
        />
      </View>
    </TouchablePlatform>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingEnd: Spacing.unit,
    paddingStart: Spacing.margin,
    paddingVertical: Spacing.rowVerticalMargin,
  },
  image: {
    marginStart: Spacing.unit,
  },
  text: {
    ...Typography.subheadline,
    flexShrink: 1,
  },
})

export default PollDetailToolRow
