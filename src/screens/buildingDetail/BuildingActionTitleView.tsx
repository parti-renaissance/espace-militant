import React, { FunctionComponent } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { Colors, Spacing, Typography } from '../../styles'
import { margin } from '../../styles/spacing'
import { TouchablePlatform } from '../shared/TouchablePlatform'

import iconCircledCross from '../../assets/images/iconCircledCross.png'

export interface BuildingActionTitleViewModel {
  title: string
  subtitle: string
}

type ActionTitleProps = Readonly<{
  viewModel: BuildingActionTitleViewModel
  canRemove: boolean
  onRemoveBuildingFloor: () => void
}>

const BuildingActionTitleView: FunctionComponent<ActionTitleProps> = ({
  viewModel,
  canRemove,
  onRemoveBuildingFloor,
}) => {
  if (viewModel.subtitle.length !== 0) {
    return (
      <View style={styles.container}>
        {canRemove ? (
          <View style={styles.removeContainer}>
            <TouchablePlatform
              touchHighlight={Colors.touchHighlight}
              onPress={onRemoveBuildingFloor}
            >
              <Image
                source={iconCircledCross}
              />
            </TouchablePlatform>
          </View>
        ) : null}
        <View style={styles.actionContainer}>
          <Text style={styles.actionText}>{viewModel.title}</Text>
          <Text style={styles.actionSubtitle}>{viewModel.subtitle}</Text>
        </View>
      </View>
    )
  } else {
    return (
      <View style={styles.actionContainer}>
        <Text style={styles.actionText}>{viewModel.title}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  actionContainer: {
    flex: 1,
    flexWrap: 'nowrap',
    margin: margin,
  },
  actionSubtitle: {
    ...Typography.lightCaption1,
  },
  actionText: {
    ...Typography.callout,
  },
  container: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  removeContainer: {
    borderRadius: 32,
    marginStart: Spacing.unit,
    overflow: 'hidden',
  },
})

export default BuildingActionTitleView
