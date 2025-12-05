import React, {
    useCallback,
    useEffect,
    useState,
} from 'react'
import { StyleSheet, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { PhoningSession } from '@/core/entities/PhoningSession'
import PhoningCampaignRepository from '@/data/PhoningCampaignRepository'
import { Colors, Spacing, Typography } from '@/styles'
import i18n from '@/utils/i18n'
import { AlertUtils } from '@/screens/shared/AlertUtils'
import { PrimaryButton } from '@/screens/shared/Buttons'
import LoadingOverlay from '@/screens/shared/LoadingOverlay'
import { CloseButton } from '@/screens/shared/NavigationHeaderButton'
import { FlexibleVerticalSpacer, VerticalSpacer } from '@/screens/shared/Spacer'

import { useNavigation } from '@react-navigation/native'
import {router, useLocalSearchParams } from 'expo-router'
import { useCampaignStore, useSessionStore } from '@/data/store/phoning'


const PhoningSessionLoaderPermanentCampaignScreen = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const {campaign} = useCampaignStore()
    const {setSession} = useSessionStore()
    const {device} = useLocalSearchParams<{device:string}>()
    const navigation = useNavigation()

    const handleSession = useCallback(
        (session: PhoningSession) => {
            setSession(session)
           router.replace({
            pathname: '/old/actions/phoning/session/[device]/poll/detail',
            params: {
                device
            },
           })
        },
        [device],
    )

    const loadSession = useCallback(() => {
        setIsLoading(true)
        PhoningCampaignRepository.getInstance()
            .getPhoningCampaignSession(campaign.id)
            .then(handleSession)
            .finally(() => {
                setIsLoading(false)
            })
            .catch((error) => {
                AlertUtils.showNetworkAlert(error, loadSession)
            })
    }, [campaign.id, handleSession])

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => <CloseButton onPress={() => router.push('..')} />,
        })
    }, [navigation])
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>{i18n.t('phoningcontacttutorial.title')}</Text>
            <VerticalSpacer spacing={Spacing.extraLargeMargin} />
            <Text style={styles.body}>
                {i18n.t('phoningcontacttutorial.description')}
            </Text>
            <FlexibleVerticalSpacer minSpacing={Spacing.margin} />
            <PrimaryButton
                title={i18n.t('phoningsession.call_started')}
                onPress={() => loadSession()}
            />
            <VerticalSpacer spacing={Spacing.margin} />
            <LoadingOverlay visible={isLoading} />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    body: {
        ...Typography.body,
    },
    container: {
        backgroundColor: Colors.defaultBackground,
        flex: 1,
        paddingHorizontal: Spacing.margin,
    },
    title: {
        ...Typography.title,
    },
})

export default PhoningSessionLoaderPermanentCampaignScreen
