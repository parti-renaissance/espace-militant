import React, { useCallback, useEffect, useState } from 'react'
import { StyleSheet, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
    PhoningSessionFinishedCampaignError,
    PhoningSessionNoNumberError,
} from '@/core/errors'
import PhoningCampaignRepository from '@/data/PhoningCampaignRepository'
import { Colors, Spacing, Typography } from '@/styles'
import i18n from '@/utils/i18n'
import { CloseButton } from '@/screens/shared/NavigationHeaderButton'
import { VerticalSpacer } from '@/screens/shared/Spacer'
import { StatefulView } from '@/screens/shared/StatefulView'
import { usePreventGoingBack } from '@/screens/shared/usePreventGoingBack.hook'
import { ViewState } from '@/screens/shared/ViewState'
import { ViewStateUtils } from '@/screens/shared/ViewStateUtils'
import { router, useLocalSearchParams, useNavigation } from 'expo-router'
import { useCampaignStore, useSessionStore } from '@/data/store/phoning'



const PhoningSessionLoaderScreen = () => {
    usePreventGoingBack()

    const { campaign } = useCampaignStore();
    const { device } = useLocalSearchParams<{ device: 'current' | 'external' }>()
    const { setSession } = useSessionStore();
    const navigation = useNavigation()

    // (Pierre Felgines) 2022/03/21 We need to pass optional parameters because deeplink
    // will redirect to this screen only with campaignId parameter

    const [statefulState, setStatefulState] = useState<ViewState<void>>(
        ViewState.Loading(),
    )

    const handleSession = useCallback(() => {
            switch (device) {
                case 'current':
                default:
                    router.replace({
                        pathname: '/(tabs)/actions/phoning/session/[device]/number-found',
                        params: { device }
                    })
                    break
                case 'external':
                    router.replace({
                        pathname: '/(tabs)/actions/phoning/session/[device]/number-found-other-device',
                        params: { device }
                    })
                    break
            }
        },
        [device],
    )

    const loadSession = useCallback( () => {
        setStatefulState(ViewState.Loading())
        PhoningCampaignRepository.getInstance()
            .getPhoningCampaignSession(campaign.id)
            .then((session) => {
                // session adherent is only null when creating a session for the permanent campaign it should not be the case here
                if (session.adherent) {
                    setSession(session)
                    handleSession()
                } else {
                    throw new PhoningSessionNoNumberError('')
                }
            })
            .catch((error) => {
                if (
                    error instanceof PhoningSessionNoNumberError ||
                    error instanceof PhoningSessionFinishedCampaignError
                ) {
                    router.replace({
                        pathname: '/(tabs)/actions/phoning/session/[device]/no-number-available',
                        params: { device, message: error.message }
                    })
                } else {
                    // We add a close button when there is an error to be able to leave
                    navigation.setOptions({
                        headerLeft: () => (
                            <CloseButton onPress={() =>router.push('..')} />
                        ),
                    })
                    setStatefulState(ViewStateUtils.networkError(error, loadSession))
                }
            })
    }, [campaign.id, handleSession])

    useEffect(() => { loadSession() }, [loadSession])
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>{i18n.t('phoningsession.loader.title')}</Text>
            <VerticalSpacer spacing={Spacing.margin} />
            <StatefulView state={statefulState} contentComponent={() => <></>} />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.defaultBackground,
        flex: 1,
        paddingHorizontal: Spacing.margin,
    },
    title: {
        ...Typography.title,
    },
})

export default PhoningSessionLoaderScreen
