import React, { FunctionComponent } from 'react'
import { Colors } from '../../../styles'
import i18n from '../../../utils/i18n'
import EventView from '../../events/EventView'
import { EventRowViewModel } from '../../events/EventViewModel'
import { HomeEventRowContainerViewModel } from '../HomeRowViewModel'
import { HomeFeedTimelineItem } from './HomeFeedTimelineItem'

type Props = Readonly<{
  viewModel: HomeEventRowContainerViewModel
  onEventSelected: (event: EventRowViewModel) => void
}>

export const HomeFeedEventRow: FunctionComponent<Props> = ({
  viewModel,
  onEventSelected,
}) => {
  return (
    <HomeFeedTimelineItem
      title={i18n.t('home.feed.event')}
      imageSource={require('../../../assets/images/homeFeedEventIcon.png')}
      tintColor={Colors.homeFeedEventBackground}
    >
      <EventView
        viewModel={viewModel.event}
        onEventSelected={onEventSelected}
      />
    </HomeFeedTimelineItem>
  )
}
