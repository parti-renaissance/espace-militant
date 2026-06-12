import type { RestAlertsResponse } from '@/services/alerts/schema'

const LIVE_ALERT_TYPES = new Set(['live', 'live_announce'])

export function filterLiveAlerts(alerts: RestAlertsResponse) {
  return alerts.filter((alert) => LIVE_ALERT_TYPES.has(alert.type ?? ''))
}

export function filterBannerAlerts(alerts: RestAlertsResponse) {
  return alerts.filter((alert) => !LIVE_ALERT_TYPES.has(alert.type ?? ''))
}
