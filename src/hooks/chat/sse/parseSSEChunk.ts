export type ParsedChunk = { kind: 'content'; text: string } | { kind: 'error'; message: string } | null

export function parseSSEChunk(line: string): ParsedChunk {
  const trimmed = line.trim()
  if (!trimmed.startsWith('data: ')) return null
  const data = trimmed.slice(6)
  if (data === '[DONE]' || data === '') return null
  try {
    const parsed = JSON.parse(data) as Record<string, unknown> | string
    if (typeof parsed === 'string') return { kind: 'content', text: parsed }
    if (parsed && typeof parsed === 'object' && 'error' in parsed) {
      return { kind: 'error', message: String(parsed.error ?? '') }
    }
    const val = parsed.chunk ?? parsed.message ?? parsed.content ?? ''
    const text = typeof val === 'string' ? val : String(val)
    return text ? { kind: 'content', text } : null
  } catch {
    const looksLikeIncompleteJson = /^[\s]*[{[]/.test(data) && !/[}\]]\s*$/.test(data)
    if (looksLikeIncompleteJson) return null
    return { kind: 'content', text: data }
  }
}
