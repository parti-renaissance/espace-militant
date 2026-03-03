import React, { FunctionComponent } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Colors, Spacing, Typography } from '../../../styles'
import { QuestionRateRowViewModel } from './QuestionRateRowViewModel'

import starImg from '../../../assets/images/star.png'

type Props = Readonly<{
  viewModel: QuestionRateRowViewModel
  onRateUpdate: (rate: number) => void
}>

const QuestionRateRow: FunctionComponent<Props> = ({
  viewModel,
  onRateUpdate,
}) => {
  return (
    <View>
      <Text style={styles.callout}>{viewModel.subtitle}</Text>
      <View style={styles.ratingBar}>
        {viewModel.values.map((item, index) => {
          return (
            <TouchableOpacity
              key={item}
              onPress={() => {
                onRateUpdate(viewModel.values[index as number])
              }}
            >
              <Image
                style={
                  index <= viewModel.values.indexOf(viewModel.value)
                    ? [styles.starImageStyle, styles.starImageFilled]
                    : styles.starImageStyle
                }
                source={starImg}
              />
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

const STAR_SIZE = 45

const styles = StyleSheet.create({
  callout: {
    ...Typography.lightCaption1,
    marginBottom: Spacing.margin,
  },
  ratingBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  starImageFilled: {
    tintColor: Colors.primaryColor,
  },
  starImageStyle: {
    height: STAR_SIZE,
    tintColor: Colors.secondaryButtonBackground,
    width: STAR_SIZE,
  },
})

export default QuestionRateRow
