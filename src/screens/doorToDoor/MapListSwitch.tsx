import React from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Colors } from '../../styles'
import { DoorToDoorDisplayMode } from './DoorToDoor'

import papMapModeIcon from '../../assets/images/papMapModeIcon.png'
import papListModeIcon from '../../assets/images/papListModeIcon.png'

type Props = {
  mode: DoorToDoorDisplayMode
  onPress: (mode: DoorToDoorDisplayMode) => void
}

const MapListSwitch = ({ mode, onPress }: Props) => (
  <View style={styles.card}>
    <TouchableOpacity onPress={() => onPress('map')}>
      <View style={[styles.container, mode === 'map' && styles.selected]}>
        <Image
          style={styles.icon}
          source={papMapModeIcon}
        />
      </View>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => onPress('list')}>
      <View style={[styles.container, mode === 'list' && styles.selected]}>
        <Image
          style={styles.icon}
          source={papListModeIcon}
        />
      </View>
    </TouchableOpacity>
  </View>
)

const styles = StyleSheet.create({
  card: {
    borderColor: Colors.progressBackground,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    margin: 2,
  },
  icon: {
    height: 28,
    margin: 2,
    width: 28,
  },
  selected: {
    backgroundColor: Colors.progressBackground,
    borderRadius: 8,
  },
})

export default MapListSwitch
