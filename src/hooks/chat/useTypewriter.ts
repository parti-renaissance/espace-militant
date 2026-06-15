import { useCallback, useEffect, useRef, useState } from 'react'

const TOKEN_FADE_MS = 5
const SPACE_DELAY_MS = 10
const PUNCTUATION_DELAY_MS = 15
const SENTENCE_DELAY_MS = 3

function getNextTokenEnd(text: string, start: number): number {
  const codePoint = text.codePointAt(start)
  if (codePoint === undefined) return start
  return start + (codePoint > 0xffff ? 2 : 1)
}

function getTokenDelay(token: string): number {
  if (/^\s$/.test(token)) return SPACE_DELAY_MS
  if (/^[.!?…]$/.test(token)) return SENTENCE_DELAY_MS
  if (/^[,;:]$/.test(token)) return PUNCTUATION_DELAY_MS
  return TOKEN_FADE_MS
}

export type Typewriter = {
  display: string
  busy: boolean
  push: (text: string) => void
  finish: (onDone: (text: string) => void) => void
  stop: () => string
  reset: () => void
}

export function useTypewriter(): Typewriter {
  const [display, setDisplay] = useState('')
  const [busy, setBusy] = useState(false)
  const bufferRef = useRef('')
  const indexRef = useRef(0)
  const delayRef = useRef(TOKEN_FADE_MS)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const finishRef = useRef<((text: string) => void) | null>(null)

  const cancel = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const clearInternals = useCallback(() => {
    bufferRef.current = ''
    indexRef.current = 0
    delayRef.current = TOKEN_FADE_MS
    finishRef.current = null
    setDisplay('')
  }, [])

  const tick = useCallback(
    function tick() {
      timerRef.current = null
      const full = bufferRef.current
      if (indexRef.current < full.length) {
        const previousIndex = indexRef.current
        indexRef.current = getNextTokenEnd(full, previousIndex)
        delayRef.current = getTokenDelay(full.slice(previousIndex, indexRef.current))
        setDisplay(full.slice(0, indexRef.current))
      }
      if (indexRef.current < full.length) {
        timerRef.current = setTimeout(tick, delayRef.current)
        return
      }
      const done = finishRef.current
      if (done) {
        const content = full
        clearInternals()
        setBusy(false)
        done(content)
      }
    },
    [clearInternals],
  )

  const push = useCallback(
    (text: string) => {
      bufferRef.current += text
      if (timerRef.current === null) timerRef.current = setTimeout(tick, 0)
    },
    [tick],
  )

  const finish = useCallback(
    (onDone: (text: string) => void) => {
      if (indexRef.current >= bufferRef.current.length) {
        const content = bufferRef.current
        clearInternals()
        onDone(content)
        return
      }
      finishRef.current = onDone
      setBusy(true)
      if (timerRef.current === null) timerRef.current = setTimeout(tick, delayRef.current)
    },
    [clearInternals, tick],
  )

  const stop = useCallback(() => {
    cancel()
    const content = bufferRef.current.slice(0, indexRef.current)
    clearInternals()
    setBusy(false)
    return content
  }, [cancel, clearInternals])

  const reset = useCallback(() => {
    cancel()
    clearInternals()
    setBusy(false)
  }, [cancel, clearInternals])

  useEffect(() => cancel, [cancel])

  return { display, busy, push, finish, stop, reset }
}
