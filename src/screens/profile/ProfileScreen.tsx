import React, { FC, useCallback, useEffect, useState } from 'react'
import { StyleSheet, SafeAreaView, Linking } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { Colors } from '../../styles'
import { StatefulView, ViewState } from '../shared/StatefulView'
import ProfileAnonymous from './ProfileAnonymous'
import ProfileAuthenticated from './ProfileAuthenticated'
import {
  GetUserProfileInteractor,
  GetUserProfileInteractorResult,
  ProfileAnonymousResult,
  ProfileAuthenticatedResult,
} from '../../core/interactor/GetUserProfileInteractor'
import { ProfileScreenViewModelMapper } from './ProfileScreenViewModelMapper'
import { ServerTimeoutError } from '../../core/errors'
import { CloseButton } from '../shared/NavigationHeaderButton'
import { ViewStateUtils } from '../shared/ViewStateUtils'
import { ProfileModalNavigatorScreenProps } from '../../navigation/ProfileModalNavigator'

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
    if (content instanceof ProfileAnonymousResult) {
      const openZipCode = () => {
        navigation.navigate('ProfileZipCode', {
          zipCode: content.zipCode,
        })
      }
      const openTermsOfUse = () => {
        navigation.navigate('ProfileTermsOfUse')
      }
      const openDataProtection = () => {
        navigation.navigate('ProfileDataProtection')
      }

      const openLogin = () => {
        navigation.navigate('ProfileLogin')
      }
      const viewModel = ProfileScreenViewModelMapper.mapFromDepartment(
        content.department,
      )
      return (
        <ProfileAnonymous
          openTermsOfUse={openTermsOfUse}
          openDataProtection={openDataProtection}
          openLogin={openLogin}
          openZipCode={openZipCode}
          openApplicationSettings={openApplicationSettings}
          openNotificationMenu={openNotificationMenu}
          viewModel={viewModel}
        />
      )
    } else if (content instanceof ProfileAuthenticatedResult) {
      const openPersonalInformation = () => {
        navigation.navigate('PersonalInformation')
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
    } else {
      throw Error('unreachable')
    }
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
