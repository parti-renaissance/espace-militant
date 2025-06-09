import { mapParams, type GetEventsSearchParametersMapperProps } from '@/services/events/paramsMapper'
import * as schemas from '@/services/events/schema'
import { api } from '@/utils/api'
import { z } from 'zod'
import { eventPostFormErrorThrower, publicEventSubscriptionFormErrorThrower } from './error'

export const getEvents = (params: GetEventsSearchParametersMapperProps) =>
  api({
    method: 'get',
    path: '/api/v3/events',
    requestSchema: schemas.RestGetEventsRequestSchema,
    responseSchema: schemas.RestGetEventsResponseSchema,
    type: 'private',
  })(mapParams(params))

export const getPublicEvents = (params: GetEventsSearchParametersMapperProps) =>
  api({
    method: 'get',
    path: '/api/events',
    requestSchema: schemas.RestGetEventsRequestSchema,
    responseSchema: schemas.RestGetPublicEventsResponseSchema,
    type: 'public',
  })(mapParams(params))

export const getEventDetails = (eventId: string) =>
  api({
    method: 'get',
    path: `/api/v3/events/${eventId}`,
    requestSchema: schemas.RestGetEventDetailsRequestSchema,
    responseSchema: schemas.RestGetEventDetailsResponseSchema,
    type: 'private',
  })()

export const getPublicEventDetails = (eventId: string) =>
  api({
    method: 'get',
    path: `/api/events/${eventId}`,
    requestSchema: schemas.RestGetEventDetailsRequestSchema,
    responseSchema: schemas.RestGetPublicEventDetailsResponseSchema,
    type: 'public',
  })()

export const subscribeToEvent = (eventId: string) =>
  api<void, void>({
    method: 'post',
    path: `/api/v3/events/${eventId}/subscribe`,
    requestSchema: z.void(),
    responseSchema: z.any(),
    type: 'private',
  })()

export const unsubscribeFromEvent = (eventId: string) =>
  api<void, void>({
    method: 'delete',
    path: `/api/v3/events/${eventId}/subscribe`,
    requestSchema: z.void(),
    responseSchema: z.any(),
    type: 'private',
  })()

export const subscribePublicEvent = (eventId: string, payload: schemas.RestPostPublicEventSubsciptionRequest) =>
  api({
    method: 'post',
    path: `/api/events/${eventId}/subscribe`,
    requestSchema: schemas.RestPostPublicEventSubsciptionRequest,
    responseSchema: z.void(),
    errorThrowers: [publicEventSubscriptionFormErrorThrower],
    type: 'public',
  })(payload)

export const getEventParticipants = (props: { eventId: string; page: number;}) =>
  api({
    method: 'get',
    path: `/api/v3/events/${props.eventId}/participants`,
    requestSchema: schemas.RestEventParticipantsRequest,
    responseSchema: schemas.RestEventParticipantsResponse,
    type: 'private',
  })({ page: props.page })

export const getEventParticipantsFileEndpoint = (props: { eventId: string }) =>
  `/api/v3/events/${props.eventId}/participants.xlsx`

export const getEventCategories = api({
  method: 'get',
  path: '/api/event_categories',
  requestSchema: z.void(),
  responseSchema: schemas.RestGetEventCategoriesResponseSchema,
  type: 'private',
})

export const createEvent = (props: { payload: schemas.RestPostEventRequest; scope: string }) =>
  api({
    method: 'post',
    path: '/api/v3/events?scope=' + props.scope,
    requestSchema: schemas.RestPostEventRequestSchema,
    responseSchema: schemas.RestPostEventResponseSchema,
    errorThrowers: [eventPostFormErrorThrower],
    type: 'private',
  })(props.payload)

export const updateEvent = (props: { payload: schemas.RestPostEventRequest; eventId: string; scope: string }) =>
  api({
    method: 'put',
    path: `/api/v3/events/${props.eventId}?scope=${props.scope}`,
    requestSchema: schemas.RestPostEventRequestSchema,
    responseSchema: schemas.RestPostEventResponseSchema,
    errorThrowers: [eventPostFormErrorThrower],
    type: 'private',
  })(props.payload)

export const deleteEvent = (props: { eventId: string; scope: string }) =>
  api({
    method: 'DELETE',
    path: `/api/v3/events/${props.eventId}?scope=${props.scope}`,
    requestSchema: z.void(),
    responseSchema: z.any(),
    type: 'private',
  })()

export const cancelEvent = (props: { eventId: string; scope: string }) =>
  api({
    method: 'PUT',
    path: `/api/v3/events/${props.eventId}/cancel?scope=${props.scope}`,
    requestSchema: z.void(),
    responseSchema: z.any(),
    type: 'private',
  })()

export const uploadEventImage = (props: { eventId: string; scope: string; payload: string }) =>
  api({
    method: 'post',
    path: `/api/v3/events/${props.eventId}/image?scope=${props.scope}`,
    requestSchema: z.object({
      content: z.string(),
    }),
    responseSchema: z.any(),
    type: 'private',
  })({
    content: props.payload,
  })

export const deleteEventImage = (props: { eventId: string; scope: string }) =>
  api({
    method: 'delete',
    path: `/api/v3/events/${props.eventId}/image?scope=${props.scope}`,
    requestSchema: z.void(),
    responseSchema: z.any(),
    type: 'private',
  })()
