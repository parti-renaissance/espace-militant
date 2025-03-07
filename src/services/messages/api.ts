import * as schemas from '@/services/messages/schema'
import { api } from '@/utils/api'
import { z } from 'zod'

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
    method: 'put',
    path: `/api/v3/adherent_messages/${props.messageId}/send?scope=${props.scope}`,
    requestSchema: z.void(),
    responseSchema: z.void(),
    type: 'private',
  })()

export const sendTestMessage = (props: { messageId: string; scope: string }) =>
  api({
    method: 'put',
    path: `/api/v3/adherent_messages/${props.messageId}/send-test?scope=${props.scope}`,
    requestSchema: z.void(),
    responseSchema: z.void(),
    type: 'private',
  })()
