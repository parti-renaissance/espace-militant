export const HTTP_STATUS_OK_MIN = 200
export const HTTP_STATUS_OK_MAX = 300
export const HTTP_STATUS_NO_RESPONSE = 0

export function isHttpSuccess(status: number): boolean {
  return status >= HTTP_STATUS_OK_MIN && status < HTTP_STATUS_OK_MAX
}

export function hasHttpResponse(status: number): boolean {
  return status !== HTTP_STATUS_NO_RESPONSE
}
