import React, { FunctionComponent } from 'react'
import { Image, StyleSheet, View, ViewStyle } from 'react-native'
import { Colors } from '../../styles'
import { margin } from '../../styles/spacing'
import { TouchablePlatform } from '../shared/TouchablePlatform'
import BuildingActionTitleView from './BuildingActionTitleView'

import arrowImg from '../../assets/images/arrow.png'
import checkIconImg from '../../assets/images/checkIcon.png'

export interface BuildingLayoutFloorCellViewModel {
  id: string
  floorNumber: number
  buildingBlock: string
  title: string
  subtitle: string
  isCompleted: boolean
  removable: boolean
}

type Props = Readonly<{
  viewModel: BuildingLayoutFloorCellViewModel
  style: ViewStyle
  canRemove: boolean
  onSelect: (buildingBlock: string, floor: number) => void
  onRemoveBuildingFloor: (floor: number) => void
}>

type ActionProps = Readonly<{
  viewModel: { title: string; subtitle: string }
  disabled?: boolean
  completed?: boolean
  style?: ViewStyle
  onPress: () => void | undefined
}>

export const BuildingLayoutActionType: FunctionComponent<ActionProps> = ({ viewModel, onPress, disabled, completed }) => {
  function icon(): JSX.Element {
    return completed ? (
      <View style={styles.buttonInvertedColors}>
        <Image style={styles.iconInvertedColors} source={checkIconImg} />
      </View>
    ) : (
      <TouchablePlatform style={styles.button} onPress={onPress} touchHighlight={Colors.touchHighlight}>
        <Image style={styles.icon} source={arrowImg} />
      </TouchablePlatform>
    )
  }

  return (
    <View
      style={[
        styles.layoutContainer,
        { backgroundColor: Colors.secondaryButtonBackground, opacity: disabled ? 0.5 : 1, pointerEvents: disabled ? 'none' : undefined },
      ]}
    >
      <BuildingActionTitleView viewModel={viewModel} canRemove={false} onRemoveBuildingFloor={() => {}} />
      {icon()}
    </View>
  )
}

const BuildingLayoutFloorCell: FunctionComponent<Props> = ({ viewModel, style, canRemove, onSelect, onRemoveBuildingFloor }) => {
  function icon(): JSX.Element {
    if (!viewModel.isCompleted) {
      return (
        <TouchablePlatform
          style={styles.button}
          onPress={() => {
            onSelect(viewModel.buildingBlock, viewModel.floorNumber)
          }}
          touchHighlight={Colors.touchHighlight}
        >
          <Image style={styles.icon} source={arrowImg} />
        </TouchablePlatform>
      )
    } else {
      return (
        <View style={styles.buttonInvertedColors}>
          <Image style={styles.iconInvertedColors} source={checkIconImg} />
        </View>
      )
    }
  }

  return (
    <View style={[styles.layoutContainer, style]}>
      <BuildingActionTitleView
        viewModel={{ title: viewModel.title, subtitle: viewModel.subtitle }}
        canRemove={canRemove}
        onRemoveBuildingFloor={() => {
          onRemoveBuildingFloor(viewModel.floorNumber)
        }}
      />
      {icon()}
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: Colors.primaryColor,
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    margin: margin,
    width: 32,
  },
  buttonInvertedColors: {
    alignItems: 'center',
    backgroundColor: Colors.defaultBackground,
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    margin: margin,
    width: 32,
  },
  icon: {
    tintColor: Colors.defaultBackground,
  },
  iconInvertedColors: {
    tintColor: Colors.primaryColor,
  },
  layoutContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 8,
  },
})

export default BuildingLayoutFloorCell
