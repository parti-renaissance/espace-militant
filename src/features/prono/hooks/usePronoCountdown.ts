import { useEffect, useState } from 'react'

export type PronoCountdownParts = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const getRemaining = (target: number): PronoCountdownParts => {
  const total = Math.max(0, Math.floor((target - Date.now()) / 1000))
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  }
}

export const padCountdownUnit = (value: number) => String(value).padStart(2, '0')

export function usePronoCountdown(targetAt: string): PronoCountdownParts {
  const target = new Date(targetAt).getTime()
  const [remaining, setRemaining] = useState(() => getRemaining(target))

  useEffect(() => {
    const id = setInterval(() => setRemaining(getRemaining(target)), 1000)
    return () => clearInterval(id)
  }, [target])

  return remaining
}
