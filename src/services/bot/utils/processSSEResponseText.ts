import { parseSSEChunk, type ParsedChunk } from './parseSSEChunk'

type Input = {
  fullText: string
  lastProcessedIndex: number
  lineBuffer: string
  isFinal: boolean
}

type Output = {
  newIndex: number
  newBuffer: string
  chunks: Exclude<ParsedChunk, null>[]
  consumedBytes: number
}

export function processSSEResponseText({ fullText, lastProcessedIndex, lineBuffer, isFinal }: Input): Output {
  let buffer = lineBuffer
  let newIndex = lastProcessedIndex
  const consumedBytes = fullText.length - lastProcessedIndex
  if (consumedBytes > 0) {
    buffer += fullText.substring(lastProcessedIndex)
    newIndex = fullText.length
  }

  const lines = buffer.split('\n')
  const endIndex = isFinal ? lines.length : Math.max(0, lines.length - 1)
  const chunks: Exclude<ParsedChunk, null>[] = []
  for (let i = 0; i < endIndex; i++) {
    const c = parseSSEChunk(lines[i])
    if (c) chunks.push(c)
  }

  const newBuffer = isFinal ? '' : (lines[lines.length - 1] ?? '')
  return { newIndex, newBuffer, chunks, consumedBytes }
}
