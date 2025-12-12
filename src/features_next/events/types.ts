import { RestEvent } from '@/services/events/schema'

export type EventItemProps = {
  event: Partial<RestEvent> & { uuid: string; slug: string }
  userUuid?: string
  source?: string
}
