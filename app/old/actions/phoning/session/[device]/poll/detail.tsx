import React, { useEffect, useLayoutEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import {
    GetPhonePollDetailResourcesInteractor,
    PhonePollDetailResources,
} from '@/core/interactor/GetPhonePollDetailResourcesInteractor'
import PhoningCampaignRepository from '@/data/PhoningCampaignRepository'
import { AlertUtils } from '@/screens/shared/AlertUtils'
import LoadingOverlay from '@/screens/shared/LoadingOverlay'
import ModalOverlay from '@/screens/shared/ModalOverlay'
import { CloseButton } from '@/screens/shared/NavigationHeaderButton'
import { StatefulView } from '@/screens/shared/StatefulView'
import { useBackHandler } from '@/screens/shared/useBackHandler.hook'
import { usePreventGoingBack } from '@/screens/shared/usePreventGoingBack.hook'
import { ViewState } from '@/screens/shared/ViewState'
import { ViewStateUtils } from '@/screens/shared/ViewStateUtils'
import PhonePollDetailInterruptionModalContent from '@/screens/phonePollDetail/PhonePollDetailInterruptionModalContent'
import PhonePollDetailScreenLoaded from '@/screens/phonePollDetail/PhonePollDetailScreenLoaded'
import { useNavigation } from 'expo-router'
import { useCampaignStore, useSessionStore } from '@/data/store/phoning'

const PhonePollDetailScreen= () => {
    const navigation = useNavigation()
    const { campaign } = useCampaignStore()
    const { session } = useSessionStore()
    const [statefulState, setStatefulState] = useState<
        ViewState<PhonePollDetailResources>
    >(ViewState.Loading())
    const [isModalVisible, setModalVisible] = useState(false)
    const [isLoading, setLoading] = useState(false)

    usePreventGoingBack()

    const askConfirmationBeforeLeaving = () => {
        setModalVisible(true)
    }

    useLayoutEffect(() => {
        const updateNavigationHeader = () => {
            navigation.setOptions({
                headerLeft: () => (
                    <CloseButton onPress={() => askConfirmationBeforeLeaving()} />
                ),
                // (Pierre Felgines) 10/09/2021 We need this for the text to be centered
                headerRight: () => <View />,
            })
        }
        updateNavigationHeader()
    }, [navigation])

    useBackHandler(askConfirmationBeforeLeaving)

    const fetchResources = () => {
        setStatefulState(ViewState.Loading())

        new GetPhonePollDetailResourcesInteractor()
            .execute(campaign.id, session.id)
            .then((resources) => {
                navigation.setOptions({
                    title: resources.poll.name,
                })
                setStatefulState(ViewState.Content(resources))
            })
            .catch((error) => {
                console.error(error)
                setStatefulState(ViewStateUtils.networkError(error, fetchResources))
            })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(fetchResources, [
        campaign.id,
        session.id,
        navigation,
    ])

    const sendInterruptionStatusAndLeave = (statusCode: string) => {
        setLoading(true)
        PhoningCampaignRepository.getInstance()
            .updatePhoningSessionStatus(session.id, statusCode)
            .then(() => navigation.goBack())
            .catch((error) =>
                AlertUtils.showNetworkAlert(error, () =>
                    sendInterruptionStatusAndLeave(statusCode),
                ),
            )
            .finally(() => setLoading(false))
    }

    const onInterruption = (statusCode: string) => {
        setModalVisible(false)
        sendInterruptionStatusAndLeave(statusCode)
    }

    return (
        <View style={styles.container}>
            <LoadingOverlay visible={isLoading} />
            <StatefulView
                state={statefulState}
                contentComponent={(resources) => (
                    <>
                        <ModalOverlay
                            modalVisible={isModalVisible}
                            onRequestClose={() => setModalVisible(false)}
                        >
                            <PhonePollDetailInterruptionModalContent
                                callStatuses={resources.configuration.callStatus.interrupted}
                                onInterruption={onInterruption}
                            />
                        </ModalOverlay>
                        <PhonePollDetailScreenLoaded
                            poll={resources.poll}
                            satisfactionQuestions={
                                resources.configuration.satisfactionQuestions
                            }
                        />
                    </>
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})

export default PhonePollDetailScreen
