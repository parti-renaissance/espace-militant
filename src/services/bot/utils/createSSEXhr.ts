export function createSSEXhr(url: string, token: string | undefined): XMLHttpRequest {
  const xhr = new XMLHttpRequest()
  xhr.open('POST', url, true)
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.setRequestHeader('Accept', 'text/event-stream')
  if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`)
  return xhr
}
