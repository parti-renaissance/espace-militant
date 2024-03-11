import { type FeedCardProps } from '@/components/Cards'
import { RestTimelineFeedItem } from '@/data/restObjects/RestTimelineFeedResponse'

const tramformFeedItemType = (type: RestTimelineFeedItem['type']): FeedCardProps['type'] => {
  switch (type) {
    case 'news':
      return 'news'
    case 'event':
      return 'event'
    case 'riposte':
    case 'phoning-campaign':
    case 'pap-campaign':
    case 'survey':
      return 'action'
  }
}

const tramformFeedItemTypeToTag = (type: RestTimelineFeedItem['type']) => {
  switch (type) {
    case 'news':
      return 'Actualité'
    case 'event':
      return 'Evénement'
    case 'riposte':
      return 'Riposte'
    case 'phoning-campaign':
      return 'Campagne de phoning'
    case 'pap-campaign':
      return 'Campagne PAP'
    case 'survey':
      return 'Enquête'
  }
}

export const tranformFeedItemToProps = (feed: RestTimelineFeedItem): FeedCardProps => {
  const type = tramformFeedItemType(feed.type)
  const author = {
    role: 'Role data missing',
    name: feed.author || 'Author not found',
    title: 'title data missing',
    pictureLink: 'https://picsum.photos/200/200',
  }
  const location = {
    city: 'NotDataCity',
    postalCode: '00000',
    street: feed.address || '404 street not found',
  }
  const tag = tramformFeedItemTypeToTag(feed.type)
  switch (type) {
    case 'news':
      return {
        type,
        onShare: () => {},
        onShow: () => {},
        payload: {
          title: feed.title,
          tag,
          image: feed.image || 'https://picsum.photos/600/244',
          description: feed.description,
          date: new Date(feed.date),
          location,
          author,
        },
      }
    case 'event':
      return {
        type,
        onSubscribe: () => {},
        onShow: () => {},
        payload: {
          title: feed.title,
          tag,
          image: feed.image || 'https://picsum.photos/600/244',
          isSubscribed: false,
          date: new Date(feed.begin_at),
          location: feed.media_type === 'online' ? undefined : location,
          isOnline: feed.media_type === 'online',
          author,
        },
      }
    case 'action':
      return {
        type,
        onSubscribe: () => {},
        onShow: () => {},
        payload: {
          tag,
          isSubscribed: false,
          date: new Date(feed.date),
          location,
          author,
          attendees: {
            pictures: ['https://picsum.photos/id/64/200/200', 'https://picsum.photos/id/66/200/200', 'https://picsum.photos/id/71/200/200'],
            count: 40,
          },
        },
      }
  }
}
