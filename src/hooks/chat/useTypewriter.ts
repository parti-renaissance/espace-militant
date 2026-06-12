import { useCallback, useEffect, useRef, useState } from 'react'

const TICK_MS = 40
const MAX_STEP = 16

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
    finishRef.current = null
    setDisplay('')
  }, [])

  const tick = useCallback(
    function tick() {
      timerRef.current = null
      const full = bufferRef.current
      if (indexRef.current < full.length) {
        const remaining = full.length - indexRef.current
        const step = Math.min(MAX_STEP, Math.max(1, Math.ceil(remaining / 50)))
        const next = full.indexOf(' ', indexRef.current + step)
        indexRef.current = next === -1 ? full.length : next + 1
        setDisplay(full.slice(0, indexRef.current))
      }
      if (indexRef.current < full.length) {
        timerRef.current = setTimeout(tick, TICK_MS)
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
      if (timerRef.current === null) timerRef.current = setTimeout(tick, TICK_MS)
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
