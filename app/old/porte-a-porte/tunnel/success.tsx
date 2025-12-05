import React, { useEffect, useLayoutEffect, useState } from 'react'
import { FlatList, Image, ListRenderItemInfo, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { DoorToDoorCampaignRanking, DoorToDoorCampaignRankingItem } from '@/core/entities/DoorToDoorCampaignRanking'
import DoorToDoorRepository from '@/data/DoorToDoorRepository'
import { useDtdTunnelStore } from '@/data/store/door-to-door'
import { RankingRowViewModel, Tab } from '@/screens/doorToDoor/rankings/Ranking'
import { RankingHeaderView } from '@/screens/doorToDoor/rankings/RankingHeaderView'
import { RankingRowView } from '@/screens/doorToDoor/rankings/RankingRowView'
import { RankingTabsView } from '@/screens/doorToDoor/rankings/RankingTabsView'
import { RankingViewModelMapper } from '@/screens/doorToDoor/rankings/RankingViewModelMapper'
import { PrimaryButton, SecondaryButton } from '@/screens/shared/Buttons'
import { CloseButton } from '@/screens/shared/NavigationHeaderButton'
import { Colors, Spacing, Typography } from '@/styles'
import { DateProvider } from '@/utils/DateProvider'
import i18n from '@/utils/i18n'
import { router, useLocalSearchParams, useNavigation } from 'expo-router'

const TunnelDoorSuccessScreen = () => {
  const [tab, setTab] = useState(Tab.INDIVIDUAL)
  const [ranking, setRanking] = useState<DoorToDoorCampaignRanking>()
  const [userStats, setUserStats] = useState<DoorToDoorCampaignRankingItem>()
  const navigation = useNavigation()
  const { tunnel, setTunnel } = useDtdTunnelStore()
  const params = useLocalSearchParams<{
    visitStartDateISOString: string
    interlocutorStatus: string
  }>()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <CloseButton onPress={() => navigation.getParent()?.goBack()} />,
    })
  }, [navigation])

  useEffect(() => {
    DoorToDoorRepository.getInstance()
      .getDoorToDoorCampaignRanking(tunnel.campaignId, 'remote')
      .then((result) => {
        setUserStats(result.individual.find((item) => item.current))
        setRanking(result)
      })
  }, [tunnel.campaignId, setRanking])

  const renderItem = ({ item }: ListRenderItemInfo<RankingRowViewModel>) => <RankingRowView viewModel={item} />

  const renderHeader = () => {
    return (
      <>
        <Image style={styles.image} source={require('@/assets/images/papSuccess.png')} />
        <Text style={styles.title}>{i18n.t('doorToDoor.tunnel.success.newDoor')}</Text>
        <Text style={styles.note}>
          {i18n.t('doorToDoor.tunnel.success.recap', {
            doorsCount: userStats?.visitedDoors ?? 0,
            pollsCount: userStats?.surveys ?? 0,
          })}
        </Text>

        <PrimaryButton
          onPress={() => {
            router.replace({
              pathname: '/old/porte-a-porte/tunnel/poll',
              params: {
                interlocutorStatus: params.interlocutorStatus,
                visitStartDateISOString: DateProvider.now().toISOString(),
              },
            })
          }}
          title="Interroger une autre personne dans le même foyer"
          style={styles.button}
          textStyle={styles.buttonTextStyle}
        />

        {ranking ? (
          <>
            <Text style={styles.title}>{i18n.t('doorToDoor.tunnel.success.ranking')}</Text>
            <RankingTabsView tab={tab} onPress={setTab} />
            <RankingHeaderView tab={tab} />
          </>
        ) : null}
      </>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList ListHeaderComponent={renderHeader} data={RankingViewModelMapper.map(ranking, tab)} renderItem={renderItem} keyExtractor={(item) => item.rank} />
      <View style={styles.bottomContainer}>
        {tunnel.buildingParams.type !== 'house' ? (
          <PrimaryButton
            title={i18n.t('doorToDoor.tunnel.success.knockNewDoor')}
            style={styles.newDoor}
            onPress={() => {
              const nextDoor = tunnel.buildingParams.door + 1
              setTunnel({
                ...tunnel,
                buildingParams: {
                  ...tunnel.buildingParams,
                  door: nextDoor,
                },
              })
              router.push('/old/porte-a-porte/tunnel/selection')
            }}
          />
        ) : null}
        <SecondaryButton title={i18n.t('doorToDoor.tunnel.success.stop')} onPress={() => navigation.getParent()?.goBack()} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  bottomContainer: {
    backgroundColor: Colors.defaultBackground,
    paddingHorizontal: Spacing.margin,
    paddingTop: Spacing.margin,
  },
  button: {
    marginBottom: Spacing.margin,
    marginHorizontal: Spacing.margin,
  },
  buttonTextStyle: {
    textAlign: 'center',
  },
  container: {
    backgroundColor: Colors.defaultBackground,
    flex: 1,
  },
  image: {
    marginVertical: Spacing.largeMargin,
  },
  newDoor: {
    marginBottom: Spacing.unit,
  },
  note: {
    ...Typography.footnoteLight,
    margin: Spacing.margin,
  },
  title: {
    ...Typography.title2,
    marginLeft: Spacing.margin,
  },
})

export default TunnelDoorSuccessScreen
