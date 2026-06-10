export function vlog(tag: string, data?: Record<string, unknown>) {
  // eslint-disable-next-line no-console
  console.log(`[VOX-DEBUG] ${tag}`, data ?? '')
}
