import clientEnv from '@/config/clientEnv'
import { createApi } from '@/utils/constructApi'
import axios, { CreateAxiosDefaults } from 'axios'
import { z } from 'zod'
import { MatomoDefaultRequestSchema, MatomoDefaultResponseSchema, MatomoEventRequestSchema } from './schema'

const baseConfig: CreateAxiosDefaults = {
  baseURL: 'https://matomo.parti-renaissance.fr/matomo.php',
}

export const instance = axios.create(baseConfig)

export const api = createApi({ instance, instanceWithoutInterceptors: instance })

export const matomoApi =
  <Request extends z.ZodRawShape>(requestSchema: z.ZodObject<Request>) =>
  (payload: z.infer<z.ZodObject<Request>> & { userId?: string }) =>
    api({
      path: '',
      useParams: true,
      requestSchema: MatomoDefaultRequestSchema(requestSchema),
      responseSchema: MatomoDefaultResponseSchema,
      method: 'POST',
    })({ ...payload, idsite: '6', rec: 1, apiv: 1, send_image: 0 })

export const trackEvent = (data: { category: string; action: string; name?: string; value?: string; campaign?: string; userData?: Record<string, string> }) =>
  matomoApi(MatomoEventRequestSchema)({
    e_c: data.category,
    e_a: data.action,
    e_n: data.name,
    e_v: data.value,
    _rcn: data.campaign,
    ...data.userData,
  })

export const trackAction = (data: { name: string; url?: string; userData?: Record<string, string | undefined> }) =>
  matomoApi(z.object({ action_name: z.string(), url: z.string().url().optional() }))({ action_name: data.name, url: data.url, ...data.userData })

export const trackScreenView = (data: { pathname: string; userData?: Record<string, string> }) => {
  const screenName = data.pathname.split('/')[1]?.trim() ?? ''
  return trackAction({
    name: `Screen / ${screenName.length > 0 ? screenName : 'home'}`,
    url: `https://${clientEnv.ASSOCIATED_DOMAIN}` + data.pathname,
    userData: data.userData,
  })
}

export const trackAppStart = (data?: { userData?: Record<string, string> }) => {
  return trackAction({ name: 'App / start', ...data?.userData })
}
