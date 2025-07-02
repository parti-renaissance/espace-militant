import * as schemas from '@/services/messages/schema'
import { api } from '@/utils/api'
import { z } from 'zod'

export const getMessage = (props: { messageId: string; scope: string }) =>
  api({
    method: 'get',
    path: `/api/v3/adherent_messages/${props.messageId}?scope=${props.scope}`,
    requestSchema: z.void(),
    responseSchema: schemas.RestPostMessageResponseSchema,
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

export const getMessages = (props: { scope: string; page?: number; perPage?: number; status?: 'draft' | 'sent' }) =>
  api({
    method: 'get',
    path: `/api/v3/adherent_messages?scope=${props.scope}` +
      (props.page ? `&page=${props.page}` : '') +
      (props.perPage ? `&per_page=${props.perPage}` : '') +
      (props.status ? `&status=${props.status}` : ''),
    requestSchema: z.void(),
    responseSchema: schemas.RestMessageListResponseSchema,
    type: 'private',
  })()
