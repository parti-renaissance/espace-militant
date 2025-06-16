import { useCallback, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { router } from 'expo-router'
import { Poll } from '../../core/entities/Poll'
import { ServerTimeoutError } from '../../core/errors'
import { GetPollsInteractor } from '../../core/interactor/GetPollsInteractor'
import { ViewState } from '../shared/ViewState'
import { ViewStateUtils } from '../shared/ViewStateUtils'
import { PollsScreenViewModel } from './PollsScreenViewModel'
import { PollsScreenViewModelMapper } from './PollsScreenViewModelMapper'

export const usePollsScreen = (): {
  statefulState: ViewState<PollsScreenViewModel>
  isRefreshing: boolean
  onPollSelected: (pollId: string) => void
  onRefresh: () => void
} => {
  const [statefulState, setStatefulState] = useState<ViewState<Array<Poll>>>(ViewState.Loading())
  const [isRefreshing, setRefreshing] = useState(true)
  const [initialFetchDone, setInitialFetchDone] = useState(false)

  const fetchData = useCallback((cacheJustLoaded: boolean = false) => {
    setRefreshing(true)
    return new GetPollsInteractor()
      .execute('remote')
      .then((polls) => {
        setStatefulState(ViewState.Content(polls))
      })
      .catch((error) => {
        const isNetworkError = error instanceof ServerTimeoutError
        if (isNetworkError && cacheJustLoaded) {
          return
        }
        setStatefulState(
          ViewStateUtils.networkError(error, () => {
            setStatefulState(ViewState.Loading())
            fetchData()
          }),
        )
      })
      .finally(() => setRefreshing(false))
  }, [])

  const firstDataFetch = useCallback(() => {
    new GetPollsInteractor()
      .execute('cache')
      .then((cachedPolls) => {
        setStatefulState(ViewState.Content(cachedPolls))
        if (!initialFetchDone) {
          fetchData(true)
          setInitialFetchDone(true)
        }
      })
      .catch(() => {
        fetchData()
      })
  }, [fetchData, initialFetchDone])

  useFocusEffect(firstDataFetch)

  const onPollSelected = (pollId: string) => {
    router.push({
      pathname: '/questionnaires/[id]',
      params: { id: pollId },
    })
  }

  return {
    statefulState: ViewState.map(statefulState, PollsScreenViewModelMapper.map),
    isRefreshing,
    onPollSelected,
    onRefresh: fetchData,
  }
}
