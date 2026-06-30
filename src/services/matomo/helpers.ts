import clientEnv from '@/config/clientEnv'

import type { RestMatomoCampaignParams, RestMatomoUtmParams } from './schema'

function getParam(value: string | string[] | undefined): string | undefined {
  if (typeof value === 'string' && value.length > 0) return value
  if (Array.isArray(value) && typeof value[0] === 'string' && value[0].length > 0) return value[0]
  return undefined
}

export function extractUtmFromSearchParams(params: Record<string, string | string[] | undefined>): RestMatomoUtmParams {
  return {
    utm_source: getParam(params.utm_source),
    utm_medium: getParam(params.utm_medium),
    utm_campaign: getParam(params.utm_campaign),
    utm_content: getParam(params.utm_content),
    utm_term: getParam(params.utm_term),
  }
}

export function utmToMatomoParams(utm?: RestMatomoUtmParams): RestMatomoCampaignParams {
  if (!utm) return {}

  const params: RestMatomoCampaignParams = {}
  if (utm.utm_source) params._rcs = utm.utm_source
  if (utm.utm_medium) params._rcm = utm.utm_medium
  if (utm.utm_campaign) params._rcn = utm.utm_campaign
  if (utm.utm_content) params._rcc = utm.utm_content
  if (utm.utm_term) params._rck = utm.utm_term
  return params
}

export function buildMatomoUrl(pathname: string, utm?: RestMatomoUtmParams): string {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`
  const base = `https://${clientEnv.ASSOCIATED_DOMAIN}${normalizedPath}`
  if (!utm) return base

  const params = new URLSearchParams()
  if (utm.utm_source) params.set('utm_source', utm.utm_source)
  if (utm.utm_medium) params.set('utm_medium', utm.utm_medium)
  if (utm.utm_campaign) params.set('utm_campaign', utm.utm_campaign)
  if (utm.utm_content) params.set('utm_content', utm.utm_content)
  if (utm.utm_term) params.set('utm_term', utm.utm_term)
  const qs = params.toString()
  return qs ? `${base}?${qs}` : base
}

export function hasUtmParams(utm: RestMatomoUtmParams): boolean {
  return Object.values(utm).some(Boolean)
}
