import React, { useEffect, useState } from 'react'
import { Alert, Image, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import DoorToDoorRepository from '@/data/DoorToDoorRepository'
import { useDtdTunnelStore } from '@/data/store/door-to-door'
import { PrimaryButton, SecondaryButton } from '@/screens/shared/Buttons'
import LoadingOverlay from '@/screens/shared/LoadingOverlay'
import { TouchablePlatform } from '@/screens/shared/TouchablePlatform'
import { Colors, Spacing, Typography } from '@/styles'
import i18n from '@/utils/i18n'
import { router, useNavigation } from 'expo-router'

const TunnelDoorSelectionScreen = () => {
  const navigation = useNavigation()
  const { tunnel } = useDtdTunnelStore()
  const [isLoading, setIsLoading] = useState(false)

  if (!tunnel) {
    return (
      <View style={styles.container}>
        <Text>Aucune campagne porte à porte trouvée</Text>
      </View>
    )
  }

  const buildingParams = tunnel.buildingParams
  const [selectedDoor, setSelectedDoor] = useState(buildingParams.door ?? 1)
  

  useEffect(() => {
    navigation.setOptions({
      title: i18n.t('doorToDoor.tunnel.door.shortTitle', {
        count: buildingParams.floor + 1,
        buildingName: buildingParams.block,
        floorName: buildingParams.floor,
        door: selectedDoor,
      }),
    })
  }, [navigation, buildingParams, selectedDoor])

  useEffect(() => {
    setSelectedDoor(buildingParams.door)
  }, [buildingParams.door])

  const askConfirmationBeforeCloseFloor = () => {
    Alert.alert(
      i18n.t('doorToDoor.tunnel.door.close_floor_alert.title'),
      i18n.t('doorToDoor.tunnel.door.close_floor_alert.message'),
      [
        {
          text: i18n.t('doorToDoor.tunnel.door.close_floor_alert.action'),
          onPress: () => closeFloor(),
          style: 'destructive',
        },
        {
          text: i18n.t('doorToDoor.tunnel.door.close_floor_alert.cancel'),
          style: 'cancel',
        },
      ],
      { cancelable: false },
    )
  }

  const updateSelectedDoor = (newSelectedDoor: number) => {
    if (newSelectedDoor >= 1) {
      setSelectedDoor(newSelectedDoor)
    }
  }

  const closeFloor = () => {
    const building = buildingParams
    setIsLoading(true)
    DoorToDoorRepository.getInstance()
      .closeBuildingBlockFloor(tunnel.campaignId, building.id, building.block, building.floor)
      .then(() => {
        setIsLoading(false)
        navigation.getParent()?.goBack()
      })
      .catch(() => {
        setIsLoading(false)
      })
  }

  return (
    <SafeAreaView style={styles.container}>
      <LoadingOverlay visible={isLoading} />
      <View style={styles.contentContainer}>
        <View style={styles.doorImageContainer}>
          <TouchablePlatform
            style={styles.changeDoorIndicator}
            touchHighlight={Colors.touchHighlight}
            onPress={() => {
              updateSelectedDoor(selectedDoor - 1)
            }}
          >
            <Image source={require('@/assets/images/iconBack.png')} />
          </TouchablePlatform>
          <Image source={require('@/assets/images/papDoorIcon.png')} />
          <TouchablePlatform
            style={styles.changeDoorIndicator}
            touchHighlight={Colors.touchHighlight}
            onPress={() => {
              updateSelectedDoor(selectedDoor + 1)
            }}
          >
            <Image style={styles.nextDoor} source={require('@/assets/images/iconBack.png')} />
          </TouchablePlatform>
        </View>
        <Text style={styles.title}>
          {i18n.t('doorToDoor.tunnel.door.title', {
            count: buildingParams.floor + 1,
            buildingName: buildingParams.block,
            floorName: buildingParams.floor,
          })}
        </Text>
        <Text style={styles.body}>
          {i18n.t('doorToDoor.tunnel.door.rdvDoor', {
            count: selectedDoor,
            door: selectedDoor,
          })}
        </Text>
        <Text style={styles.note}>{i18n.t('doorToDoor.tunnel.door.doorFinished')}</Text>
        <Text style={styles.note}>{i18n.t('doorToDoor.tunnel.door.buildingFinished')}</Text>
      </View>
      <View style={styles.bottomContainer}>
        <PrimaryButton
          title={i18n.t('doorToDoor.tunnel.door.doorknocked')}
          onPress={() =>
            router.navigate({
              pathname: '/old/porte-a-porte/tunnel/opening',
              params: {
                campaignId: tunnel.campaignId,
                buildingParams: {
                  ...buildingParams,
                  door: selectedDoor,
                },
              },  
            })
          }
        />
        <SecondaryButton
          title={i18n.t('doorToDoor.tunnel.door.floorFinished')}
          style={styles.finished}
          onPress={askConfirmationBeforeCloseFloor}
          disabled={!tunnel.canCloseFloor}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  body: {
    ...Typography.body,
    paddingHorizontal: Spacing.extraLargeMargin,
    textAlign: 'center',
  },
  bottomContainer: {
    backgroundColor: Colors.defaultBackground,
    paddingHorizontal: Spacing.margin,
    paddingTop: Spacing.margin,
  },
  changeDoorIndicator: {
    borderRadius: 32,
    padding: Spacing.unit,
  },
  container: {
    backgroundColor: Colors.defaultBackground,
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.margin,
  },
  doorImageContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  finished: {
    marginTop: Spacing.unit,
  },
  nextDoor: {
    transform: [{ rotate: '180deg' }],
  },
  note: {
    ...Typography.footnoteLight,
    marginVertical: Spacing.margin,
    paddingHorizontal: Spacing.margin,
    textAlign: 'center',
  },
  title: {
    ...Typography.title3,
    marginBottom: Spacing.unit,
    marginTop: Spacing.largeMargin,
  },
})

export default TunnelDoorSelectionScreen
