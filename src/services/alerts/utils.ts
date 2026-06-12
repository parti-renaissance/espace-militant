import type { RestAlertsResponse } from '@/services/alerts/schema'

const BANNER_EXCLUDED_ALERT_TYPES = new Set(['live', 'live_announce'])

export function filterBannerAlerts(alerts: RestAlertsResponse) {
  return alerts.filter((alert) => !BANNER_EXCLUDED_ALERT_TYPES.has(alert.type ?? ''))
}
