import React, { FunctionComponent } from 'react'
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'
import { Colors, Spacing, Typography } from '../../styles'
import ProgressBar from '../shared/ProgressBar'
import { PollDetailProgressBarViewModel } from './PollDetailProgressBarViewModel'

type Props = Readonly<{
  style?: StyleProp<ViewStyle>
  viewModel: PollDetailProgressBarViewModel
}>

const PollDetailProgressBar: FunctionComponent<Props> = ({
  viewModel,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>{viewModel.title}</Text>
      <ProgressBar progress={viewModel.progress} color={Colors.accent} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.unit,
    width: '100%',
    maxWidth: 520,
    marginHorizontal: 'auto',
  },
  text: {
    marginBottom: Spacing.unit,
    ...Typography.lightCaption1,
  },
})

export default PollDetailProgressBar
