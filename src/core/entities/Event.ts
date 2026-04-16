export interface ShortEvent {
  uuid: string
  name: string
  category: string
  tag: string
  userRegisteredAt?: Date
  imageUrl?: string
  mode?: EventMode
  dateStart: Date
  dateEnd: Date
  address?: EventAddress
}

export enum EventMode {
  MEETING = 'meeting',
  ONLINE = 'online',
}

export interface DetailedEvent {
  uuid: string
  name: string
  description: string
  tag: string
  userRegisteredAt?: Date
  imageUrl?: string
  mode?: EventMode
  dateStart: Date
  dateEnd: Date
  participantsCount: number
  visioUrl?: string
  address?: EventAddress
  organizer: EventOrganizer
  committee?: Committee
  timezone: string
  link: string
}

export interface EventAddress {
  address: string
  postalCode: string
  city: string
  country: string
  longitude: number
  latitude: number
}

export interface EventOrganizer {
  firstName: string
  lastName: string
}

export interface Committee {
  name: string
  url: string
}

export interface EventFilters {
  subscribedOnly?: boolean
  finishAfter?: Date
  zone?: string
  searchText?: string
  mode?: EventMode
  pinned?: boolean
}
