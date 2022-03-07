import React, { FC, useCallback, useEffect, useState } from 'react'
import { StyleSheet, SafeAreaView, Linking } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { Colors } from '../../styles'
import { StatefulView } from '../shared/StatefulView'
import { ViewState } from '../shared/ViewState'
import ProfileAuthenticated from './ProfileAuthenticated'
import {
  GetUserProfileInteractor,
  GetUserProfileInteractorResult,
} from '../../core/interactor/GetUserProfileInteractor'
import { ProfileScreenViewModelMapper } from './ProfileScreenViewModelMapper'
import { ServerTimeoutError } from '../../core/errors'
import { CloseButton } from '../shared/NavigationHeaderButton'
import { ViewStateUtils } from '../shared/ViewStateUtils'
import { ProfileModalNavigatorScreenProps } from '../../navigation/profileModal/ProfileModalNavigatorScreenProps'

type ProfileScreenProps = ProfileModalNavigatorScreenProps<'Profile'>

const ProfileScreen: FC<ProfileScreenProps> = ({ navigation }) => {
  const [statefulState, setStatefulState] = useState<
    ViewState<GetUserProfileInteractorResult>
  >(ViewState.Loading())

  const ProfileDispatcher = (content: GetUserProfileInteractorResult) => {
    const openApplicationSettings = async () => {
      await Linking.openSettings()
    }
    const openNotificationMenu = () => {
      navigation.navigate('NotificationMenu')
    }
    const openPersonalInformation = () => {
      navigation.navigate('PersonalInformationModal', {
        screen: 'PersonalInformation',
      })
    }
    const openCenterOfInterest = () => {
      navigation.navigate('CenterOfInterest')
    }
    const viewModel = ProfileScreenViewModelMapper.map(
      content.profile,
      content.department,
    )
    return (
      <ProfileAuthenticated
        openPersonalInformation={openPersonalInformation}
        openCenterOfInterest={openCenterOfInterest}
        openApplicationSettings={openApplicationSettings}
        openNotificationMenu={openNotificationMenu}
        viewModel={viewModel}
      />
    )
  }

  useFocusEffect(
    useCallback(() => {
      const getProfileInteractor = new GetUserProfileInteractor()
      const remoteDataFetch = (cacheJustLoaded: boolean = false) => {
        getProfileInteractor
          .execute('remote')
          .then((result) => {
            setStatefulState(ViewState.Content(result))
          })
          .catch((error) => {
            const isNetworkError = error instanceof ServerTimeoutError
            if (isNetworkError && cacheJustLoaded) {
              return
            }
            setStatefulState(ViewStateUtils.networkError(error))
          })
      }

      setStatefulState(ViewState.Loading())
      getProfileInteractor
        .execute('cache')
        .then((cachedProfile) => {
          setStatefulState(ViewState.Content(cachedProfile))
          remoteDataFetch(true)
        })
        .catch(() => {
          remoteDataFetch()
        })
    }, []),
  )

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <CloseButton onPress={() => navigation.goBack()} />,
    })
  }, [navigation])

  return (
    <SafeAreaView style={styles.container}>
      <StatefulView
        state={statefulState}
        contentComponent={ProfileDispatcher}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.defaultBackground,
    flex: 1,
  },
})

export default ProfileScreen
