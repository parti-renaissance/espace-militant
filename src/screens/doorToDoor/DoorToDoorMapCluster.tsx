import React, { memo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Marker } from 'react-native-maps'
import { Colors, Typography } from '../../styles'
import CardView from '../shared/CardView'
import { ClusterTypeViewModel } from './DoorToDoor'

export const DoorToDoorMapCluster = memo((cluster: ClusterTypeViewModel) => (
  <Marker
    coordinate={{
      longitude: cluster.geometry.coordinates[0],
      latitude: cluster.geometry.coordinates[1],
    }}
    onPress={cluster.onPress}
  >
    <CardView backgroundColor={Colors.defaultBackground}>
      <View style={styles.cluster}>
        <Text style={styles.count}>{cluster.properties.point_count}</Text>
      </View>
    </CardView>
  </Marker>
))

const styles = StyleSheet.create({
  cluster: {
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  count: {
    ...Typography.title,
    textAlign: 'center',
  },
})
