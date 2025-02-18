export interface RestTimelineFeedAddress {
  address: string
  postal_code: string
  city_name: string
  country: string
}

export interface RestTimelineFeedItem {
  objectID: string
  type: 'news' | 'event' | 'phoning-campaign' | 'pap-campaign' | 'survey' | 'riposte' | 'action'
  title: string
  description: string
  author: {
    first_name: string
    last_name: string
    role: string
    instance: string
    zone: string
  } | null
  date: string
  begin_at: string | null
  finish_at: string | null
  image: string | null
  address: string | null
  category: string | null
  media_type: string | null
  cta_link: string | null
  cta_label: string | null
  url: string | null
  user_registered_at: string | null
  time_zone: string | null
  mode: 'meeting' | 'online' | null
  post_address?: RestTimelineFeedAddress
}

export interface RestTimelineFeedResponse {
  hits: Array<RestTimelineFeedItem>
  page: number
  nbHits: number
  nbPages: number
  hitsPerPage: number
  params: string
}
