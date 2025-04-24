/**
 * Used to check if webkit based (for Safari and Edge)
 */
export default function isWebKit() {
  return navigator.userAgent.includes('AppleWebKit')
}
