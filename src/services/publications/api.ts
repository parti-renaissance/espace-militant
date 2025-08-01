import * as schemas from '@/services/publications/schema'
import { api } from '@/utils/api'
import { z } from 'zod'

export const getMessage = (props: { messageId: string; scope: string }) =>
  api({
    method: 'get',
    path: `/api/v3/adherent_messages/${props.messageId}?scope=${props.scope}`,
    requestSchema: z.void(),
    responseSchema: schemas.RestGetMessageResponseSchema,
    type: 'private',
  })()

export const getMessageContent = (props: { messageId: string; scope: string }) =>
  api({
    method: 'get',
    path: `/api/v3/adherent_messages/${props.messageId}/content?scope=${props.scope}`,
    requestSchema: z.void(),
    responseSchema: schemas.RestGetMessageContentResponseSchema,
    type: 'private',
  })()

export const createMessage = (props: { payload: schemas.RestPostMessageRequest; scope: string }) =>
  api({
    method: 'post',
    path: '/api/v3/adherent_messages?scope=' + props.scope,
    requestSchema: schemas.RestPostMessageRequestSchema,
    responseSchema: schemas.RestPostMessageResponseSchema,
    type: 'private',
  })(props.payload)

export const updateMessage = (props: { messageId: string; payload: schemas.RestPostMessageRequest; scope: string }) =>
  api({
    method: 'put',
    path: `/api/v3/adherent_messages/${props.messageId}?scope=${props.scope}`,
    requestSchema: schemas.RestPostMessageRequestSchema,
    responseSchema: schemas.RestPostMessageResponseSchema,
    type: 'private',
  })(props.payload)

export const sendMessage = (props: { messageId: string; scope: string }) =>
  api({
    method: 'post',
    path: `/api/v3/adherent_messages/${props.messageId}/send?scope=${props.scope}`,
    requestSchema: z.void(),
    responseSchema: z.void(),
    type: 'private',
  })()

export const sendTestMessage = (props: { messageId: string; scope: string }) =>
  api({
    method: 'post',
    path: `/api/v3/adherent_messages/${props.messageId}/send-test?scope=${props.scope}`,
    requestSchema: z.void(),
    responseSchema: z.void(),
    type: 'private',
  })()

export const getMessages = (props: { scope: string; page?: number; status?: 'draft' | 'sent'; orderCreatedAt?: 'asc' | 'desc' }) =>
  api({
    method: 'get',
    path: `/api/v3/adherent_messages?scope=${props.scope}` +
      (props.page ? `&page=${props.page}` : '') +
      (props.status ? `&status=${props.status}` : '') +
      (props.orderCreatedAt ? `&order[createdAt]=${props.orderCreatedAt}` : ''),
    requestSchema: z.void(),
    responseSchema: schemas.RestMessageListResponseSchema,
    type: 'private',
  })()

export const getMessageCountRecipients = (props: { messageId: string; scope: string; partial?: boolean }) =>
  api({
    method: 'get',
    path: `/api/v3/adherent_messages/${props.messageId}/count-recipients?scope=${props.scope}` +
      (props.partial ? '&partial=true' : ''),
    requestSchema: z.void(),
    responseSchema: schemas.RestMessageCountRecipientsResponseSchema,
    type: 'private',
  })()

export const getAvailableSenders = (props: { scope: string }) =>
  api({
    method: 'get',
    path: `/api/v3/adherent_messages/available-senders?scope=${props.scope}`,
    requestSchema: z.void(),
    responseSchema: schemas.RestAvailableSendersResponseSchema,
    type: 'private',
  })()

export const getMessageFilters = (props: { messageId: string; scope: string }) =>
  api({
    method: 'get',
    path: `/api/v3/adherent_messages/${props.messageId}/filter?scope=${props.scope}`,
    requestSchema: z.void(),
    responseSchema: schemas.RestGetMessageFiltersResponseSchema,
    type: 'private',
  })()

export const putMessageFilters = (props: { messageId: string; payload: schemas.RestPutMessageFiltersRequest; scope: string }) =>
  api({
    method: 'put',
    path: `/api/v3/adherent_messages/${props.messageId}/filter?scope=${props.scope}`,
    requestSchema: schemas.RestPutMessageFiltersRequestSchema,
    responseSchema: z.literal('OK'),
    type: 'private',
  })(props.payload)