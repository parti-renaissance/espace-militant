import { formatISO } from 'date-fns'

import type { RestActionFull, RestPostActionRequest } from './schema'

export type ActionFormValues = {
  type: RestPostActionRequest['type']
  date: Date
  description: string
  post_address: RestPostActionRequest['post_address']
  send_invitation_email?: boolean
}

export const mapActionFormToPostRequest = (form: ActionFormValues): RestPostActionRequest => ({
  type: form.type,
  date: formatISO(form.date),
  description: form.description ?? '',
  post_address: {
    address: form.post_address.address,
    postal_code: form.post_address.postal_code,
    city_name: form.post_address.city_name,
    country: form.post_address.country,
  },
  send_invitation_email: form.send_invitation_email,
})

export const mapRestActionFullToFormDefaults = (action: RestActionFull): ActionFormValues => ({
  type: action.type,
  date: action.date,
  description: action.description ?? '',
  post_address: {
    address: action.post_address.address,
    postal_code: action.post_address.postal_code,
    city_name: action.post_address.city_name,
    country: action.post_address.country,
  },
})
