import type { Event } from 'expo-calendar'

export type CreateEventPayload = Omit<Partial<Event>, 'id'>

export type UseCreateEvent = () => (event: CreateEventPayload) => Promise<void>
