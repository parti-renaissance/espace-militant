import { useCallback, useEffect, useState } from 'react'
import { ViewState } from '../shared/StatefulView'
import { ViewStateUtils } from '../shared/ViewStateUtils'
import { HomeViewModel } from './HomeViewModel'
import { HomeViewModelMapper } from './HomeViewModelMapper'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { Analytics } from '../../utils/Analytics'
import { SaveQuickPollAsAnsweredInteractor } from '../../core/interactor/SaveQuickPollAsAnsweredInteractor'
import { EventRowViewModel } from '../events/EventViewModel'
import { HomeNavigatorScreenProps } from '../../navigation/HomeNavigator'
import { GetTimelineFeedInteractor } from '../../core/interactor/GetTimelineFeedInteractor'
import { TimelineFeedItem } from '../../core/entities/TimelineFeedItem'
import { useFetchHomeResources } from './useFetchHomeResources.hook'
import { PaginatedResult } from '../../core/entities/PaginatedResult'

export const useHomeScreen = (): {
  statefulState: ViewState<HomeViewModel>
  isRefreshing: boolean
  isLoadingMore: boolean
  onRefresh: () => void
  onRegionMorePressed: () => void
  onQuickPollAnswerSelected: (pollId: string, answerId: string) => void
  onEventSelected: (event: EventRowViewModel) => void
  onRetaliationSelected: (id: string) => void
  onRetaliateSelected: (id: string) => void
  onFeedNewsSelected: (newsId: string) => void
  onFeedPhoningCampaignSelected: (campaignId: string) => void
  onFeedDoorToDoorCampaignSelected: (campaignId: string) => void
  onFeedPollSelected: (pollId: string) => void
  onLoadMore: () => void
} => {
  const navigation = useNavigation<
    HomeNavigatorScreenProps<'Home'>['navigation']
  >()
  const [feedStatefulState, setFeedStatefulState] = useState<
    ViewState<PaginatedResult<Array<TimelineFeedItem>>>
  >(ViewState.Loading())
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const {
    statefulState,
    isRefreshing,
    fetchHomeResources,
    updateQuickPoll,
  } = useFetchHomeResources()

  useFocusEffect(useCallback(fetchHomeResources, []))

  useEffect(() => {
    const fetchTimelineFeed = () => {
      new GetTimelineFeedInteractor()
        .execute(0)
        .then((response) => {
          setFeedStatefulState(ViewState.Content(response))
        })
        .catch((error) => {
          setFeedStatefulState(
            ViewStateUtils.networkError(error, fetchTimelineFeed),
          )
        })
    }
    fetchTimelineFeed()
  }, [])

  const onLoadMore = useCallback(() => {
    const currentResult = ViewState.unwrap(feedStatefulState)
    if (currentResult === undefined || isLoadingMore) {
      return
    }

    const paginationInfo = currentResult.paginationInfo
    if (paginationInfo.currentPage === paginationInfo.lastPage) {
      // last page reached : nothing to paginate
      return
    }

    setIsLoadingMore(true)
    new GetTimelineFeedInteractor()
      .execute(paginationInfo.currentPage + 1)
      .then((response) => {
        const newContent = PaginatedResult.merge(currentResult, response)
        setFeedStatefulState(ViewState.Content(newContent))
      })
      .catch(() => {
        // no-op: next page can be reloaded by reaching the end of the list again
      })
      .finally(() => setIsLoadingMore(false))
  }, [feedStatefulState, isLoadingMore])

  const onRefresh = () => {
    fetchHomeResources()
  }

  const onFeedNewsSelected = (newsId: string) => {
    // TODO: (Pierre Felgines) 2022/02/28 Update analytics
    Analytics.logHomeNewsOpen()
    navigation.navigate('NewsDetailModal', {
      screen: 'NewsDetail',
      params: { newsId },
    })
  }

  const onRegionMorePressed = async () => {
    const zipCode = ViewState.unwrap(statefulState)?.zipCode
    if (zipCode === undefined) {
      return
    }
    await Analytics.logHomeRegionMore()
    navigation.navigate('Region', { zipCode })
  }

  const onQuickPollAnswerSelected = async (
    pollId: string,
    answerId: string,
  ) => {
    const interactor = new SaveQuickPollAsAnsweredInteractor()
    const updatedPoll = await interactor.execute({
      quickPollId: pollId,
      answerId: answerId,
    })
    updateQuickPoll(updatedPoll)
  }

  const onEventSelected = async (event: EventRowViewModel) => {
    await Analytics.logHomeEventOpen(event.title, event.category)
    navigation.navigate('EventDetails', { eventId: event.id })
  }

  const findItemWithId = (id: string): TimelineFeedItem | undefined => {
    const items = ViewState.unwrap(feedStatefulState)?.result ?? []
    return items.find((item) => item.uuid === id)
  }

  const onRetaliationSelected = (id: string) => {
    navigation.navigate('RetaliationDetail', {
      retaliationId: id,
    })
  }

  const onRetaliateSelected = (id: string) => {
    // TODO: (Pierre Felgines) 2022/02/28 Find retaliation from feed
    console.log(id)
    // const retaliation = currentResources?.retaliations.find(
    //   (item) => item.id === id,
    // )
    // if (retaliation !== null && retaliation !== undefined) {
    //   RetaliationService.retaliate(retaliation)
    // }
  }

  const onFeedPhoningCampaignSelected = (campaignId: string) => {
    const item = findItemWithId(campaignId)
    if (item === undefined) {
      return
    }
    navigation.navigate('PhoningSessionModal', {
      screen: 'PhoningSessionLoader',
      params: {
        campaignId: item.uuid,
        campaignTitle: item.title,
        device: 'current',
      },
    })
  }

  const onFeedDoorToDoorCampaignSelected = () => {
    navigation.navigate('DoorToDoor')
  }

  const onFeedPollSelected = (pollId: string) => {
    navigation.navigate('PollDetailModal', {
      screen: 'PollDetail',
      params: { pollId },
    })
  }

  return {
    statefulState: ViewState.map(statefulState, (currentResources) => {
      return HomeViewModelMapper.map(
        currentResources.headerInfos,
        currentResources.profile,
        currentResources.region,
        currentResources.quickPoll,
        currentResources.nextEvent,
        ViewState.unwrap(feedStatefulState)?.result ?? [],
      )
    }),
    isRefreshing,
    isLoadingMore,
    onRefresh,
    onRegionMorePressed,
    onQuickPollAnswerSelected,
    onEventSelected,
    onRetaliationSelected,
    onRetaliateSelected,
    onFeedNewsSelected,
    onFeedPhoningCampaignSelected,
    onFeedDoorToDoorCampaignSelected,
    onFeedPollSelected,
    onLoadMore,
  }
}
