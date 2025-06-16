import React, { FunctionComponent } from 'react'
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'
import { Spacing, Typography } from '../../styles'
import i18n from '../../utils/i18n'
import { PollsHeaderViewModel } from './PollsHeaderViewModel'

type Props = Readonly<{
  style?: StyleProp<ViewStyle>
  viewModel: PollsHeaderViewModel
}>

const PollsHeader: FunctionComponent<Props> = (props) => {
  return (
    <View style={[props.style, styles.container]}>
      <Text style={styles.title}>{i18n.t('polls.title')}</Text>
      {props.viewModel.subtitle !== undefined && (
        <Text style={styles.content}>{props.viewModel.subtitle}</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.margin,
  },
  content: {
    marginBottom: Spacing.unit,
    ...Typography.body,
  },
  title: {
    ...Typography.highlightedLargeTitle,
    fontSize: 30,
    marginBottom: Spacing.mediumMargin,
  },
})

export default PollsHeader
