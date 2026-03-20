import React, { FunctionComponent } from 'react'
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native'
import { Colors, Spacing, Typography } from '../../styles'
import { TouchablePlatform } from '../shared/TouchablePlatform'
import { QuestionChoiceRowViewModel } from './QuestionChoiceRowViewModel'

import checkIconImg from '../../assets/images/checkIcon.png'

type Props = Readonly<{
  style?: StyleProp<ViewStyle>
  viewModel: QuestionChoiceRowViewModel
  onPress?: () => void
}>

const QuestionChoiceRow: FunctionComponent<Props> = ({
  viewModel,
  onPress,
  style,
}) => {
  const rowStyle = viewModel.isSelected
    ? styles.rowSelected
    : styles.rowUnselected
  const imageStyle = viewModel.isSelected
    ? styles.imageSelected
    : styles.imageUnselected
  const textStyle = viewModel.isSelected
    ? styles.textSelected
    : styles.textUnselected

  return (
    <View style={[styles.row, rowStyle, style]}>
      <TouchablePlatform
        style={styles.touchContainer}
        onPress={onPress}
        touchHighlight={Colors.touchHighlight}
      >
        <View style={styles.container}>
          <View style={styles.contentContainer}>
            {viewModel.image ? (
              <Image
                style={[styles.image, imageStyle]}
                source={viewModel.image}
              />
            ) : null}
            <Text style={[styles.text, textStyle]}>{viewModel.title}</Text>
          </View>
          {viewModel.isSelected ? (
            <Image
              style={styles.icon}
              source={checkIconImg}
            />
          ) : null}
        </View>
      </TouchablePlatform>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: Spacing.mediumMargin,
    paddingVertical: 10,
  },
  contentContainer: {
    flex: 1,
  },
  icon: {
    tintColor: Colors.primaryColor,
  },
  image: {
    alignSelf: 'center',
    flex: 1,
  },
  imageSelected: {
    marginStart: 24, // width of checkIcon
  },
  imageUnselected: {
    marginStart: 0,
    tintColor: Colors.secondaryButtonText,
  },
  row: {
    backgroundColor: Colors.secondaryButtonBackground,
    borderRadius: 32,
    flex: 1,
    marginBottom: Spacing.unit,
    overflow: 'hidden',
  },
  rowSelected: {
    borderColor: Colors.primaryColor,
    borderWidth: 2,
  },
  rowUnselected: {
    backgroundColor: Colors.secondaryButtonBackground,
  },
  text: {
    ...Typography.subheadline,
    flex: 1,
    lineHeight: 24,
    minHeight: 24, // height of checkIcon
    textAlign: 'center',
  },
  textSelected: {
    paddingStart: 24, // width of checkIcon
  },
  textUnselected: {
    color: Colors.secondaryButtonText,
    paddingStart: 0,
  },
  touchContainer: {
    flex: 1,
  },
})

export default QuestionChoiceRow
