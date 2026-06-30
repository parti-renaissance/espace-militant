import { createApi } from '@/utils/constructApi'
import axios from 'axios'

import { buildMatomoUrl, resolveMatomoSiteId, utmToMatomoParams } from './helpers'
import * as schemas from './schema'

const matomoInstance = axios.create({
  baseURL: 'https://edge.parti-renaissance.fr/m.php',
})

const matomoApiConfig = {
  path: '',
  responseSchema: schemas.RestPostMatomoResponseSchema,
  method: 'post' as const,
  type: 'public' as const,
  axiosConfig: { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
}

const matomoDefaults = () => ({
  idsite: resolveMatomoSiteId(),
  rec: 1,
  apiv: 1,
  send_image: 0,
} as const)

const postMatomoEvent = createApi({ authInstance: matomoInstance, publicInstance: matomoInstance })({
  ...matomoApiConfig,
  requestSchema: schemas.createRestPostMatomoRequestSchema(schemas.RestPostMatomoEventRequestSchema),
})

const postMatomoAction = createApi({ authInstance: matomoInstance, publicInstance: matomoInstance })({
  ...matomoApiConfig,
  requestSchema: schemas.createRestPostMatomoRequestSchema(schemas.RestPostMatomoActionRequestSchema),
})

export const trackEvent = (data: {
  category: string
  action: string
  name?: string
  value?: string
  campaign?: string
  utm?: schemas.RestMatomoUtmParams
  userData?: Record<string, string>
}) => {
  const campaignParams = {
    ...utmToMatomoParams(data.utm),
    ...(data.campaign ? { _rcn: data.campaign } : {}),
    ...data.userData,
  }
  return postMatomoEvent({
    e_c: data.category,
    e_a: data.action,
    e_n: data.name,
    e_v: data.value,
    ...campaignParams,
    ...matomoDefaults(),
  })
}

export const trackAction = (data: {
  name: string
  url?: string
  utm?: schemas.RestMatomoUtmParams
  userData?: Record<string, string | undefined>
}) => {
  const campaignParams = {
    ...utmToMatomoParams(data.utm),
    ...data.userData,
  }
  return postMatomoAction({
    action_name: data.name,
    url: data.url,
    ...campaignParams,
    ...matomoDefaults(),
  })
}

export const trackScreenView = (data: { pathname: string; utm?: schemas.RestMatomoUtmParams }) => {
  const screenName = data.pathname.split('/')[1]?.trim() ?? ''
  return trackAction({
    name: `Screen / ${screenName.length > 0 ? screenName : 'home'}`,
    url: buildMatomoUrl(data.pathname, data.utm),
    utm: data.utm,
  })
}

export const trackAppStart = (data?: { utm?: schemas.RestMatomoUtmParams }) => {
  return trackAction({ name: 'App / start', utm: data?.utm })
}

export const trackFirstOpen = (data?: { utm?: schemas.RestMatomoUtmParams }) => {
  return trackEvent({ category: 'App', action: 'first_open', utm: data?.utm })
}
