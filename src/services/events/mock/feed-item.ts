import { addDays } from 'date-fns'

export const organizer = {
  uuid: 'b6dcaaad-7d5f-4084-98d4-72fdbce57a8d',
  first_name: 'Victor',
  last_name: 'Fortest',
  image_url: 'https://staging-utilisateur.parti-renaissance.fr/assets/images/profile/2b332ff46df16603e15449a9a2da0dcf.webp',
  scope: 'president_departmental_assembly',
  role: 'Pr\u00e9sident',
  instance: 'Assembl\u00e9e d\u00e9partementale',
  zone: 'Hauts-de-Seine',
}

const category = {
  event_group_category: {
    name: '\u00c9v\u00e9nement interne',
    slug: 'evenement-interne',
    description: null,
  },
  name: 'Atelier de r\u00e9flexion',
  slug: 'atelier-de-reflexion',
  description: 'Le Lorem Ipsum est simplement du faux texte employ\u00e9 dans la composition et la mise en page avant impression.',
}

const post_address = {
  address: '37 Route du Cap',
  postal_code: '83230',
  city: '83230-83019',
  city_name: 'Bormes-les-Mimosas',
  country: 'FR',
  latitude: 43.103416,
  longitude: 6.361484,
}

export const payload = {
  uuid: '39081809-33c0-48f7-98c8-0a408d3dd707',
  name: "Test d'\u00e9v\u00e9nement",
  slug: '2030-08-09-test-devenement',
  time_zone: 'Europe/Paris',
  begin_at: '2030-08-09T10:59:52+02:00',
  finish_at: '2030-08-09T11:59:52+02:00',
  participants_count: 3,
  status: 'SCHEDULED',
  capacity: null,
  category,
  post_address,
  visibility: 'public',
  live_url: '',
  created_at: '2024-08-09T11:00:59+02:00',
  visio_url: null,
  mode: 'meeting',
  local_begin_at: '2030-08-09T10:59:52+02:00',
  local_finish_at: '2030-08-09T11:59:52+02:00',
  organizer: organizer,
  image_url: null,
  editable: false,
  user_registered_at: null,
  object_state: 'full',
}

export const cancelledEvent = {
  status: 'CANCELLED',
} as const

export const finishedEvent = {
  begin_at: '2024-10-25T13:14:09+02:00',
  finish_at: '2024-10-25T14:14:09+02:00',
} as const

export const capacityFullEvent = {
  begin_at: addDays(new Date(), 10).toISOString(),
  capacity: 10,
  participants_count: 10,
  object_state: 'full',
} as const

export const registerEvent = {
  user_registered_at: addDays(new Date(), -1).toISOString(),
  object_state: 'full',
} as const

export const unRegisterEvent = {
  user_registered_at: null,
  object_state: 'full',
} as const

export const editableEvent = {
  object_state: 'full',
  editable: true,
} as const
