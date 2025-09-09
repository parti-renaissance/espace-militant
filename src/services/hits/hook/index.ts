import * as React from 'react'
import { AppState } from 'react-native'
import NetInfo from '@react-native-community/netinfo'
import { AsyncStorage } from '@/hooks/useStorageState'
import { postHit } from '@/services/hits/api'
import { HitPayload, HitPayloadSchema, ObjectType } from '@/services/hits/schema'
import { formatLocalISO, getAppSystem, getAppVersionTag, getUserAgentSafe, generateUuid } from './helpers'
import { Mutex } from 'async-mutex'

const INACTIVITY_MS = 30 * 60 * 1000
const MAX_BUFFER = 50
const THROTTLE_OPEN_MS = 30 * 1000
const THROTTLE_CLICK_MS = 30 * 1000

const mutex = new Mutex()

type TrackParams = { 
  object_type?: ObjectType | null; 
  object_id?: string; 
  source?: string;
  utm_source?: string;
  utm_campaign?: string;
  referrer_code?: string;
  target_url?: string;
  button_name?: string;
}
type SessionBlob = { uuid: string; lastActiveAt: number }

const SESSION_KEY = 'hits.session'
const PENDING_KEY = 'hits.pending'
const LAST_SENT_KEY = 'hits.lastSent'

async function readSession(): Promise<SessionBlob | null> {
  const raw = await AsyncStorage.getItem(SESSION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as SessionBlob
  } catch {
    return null
  }
}

async function writeSession(s: SessionBlob) {
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(s))
}

async function readPending(): Promise<HitPayload[]> {
  const raw = await AsyncStorage.getItem(PENDING_KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as HitPayload[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

async function writePending(pending: HitPayload[]) {
  await AsyncStorage.setItem(PENDING_KEY, JSON.stringify(pending))
}

type LastSentMap = Record<string, number>
async function readLastSent(): Promise<LastSentMap> {
  const raw = await AsyncStorage.getItem(LAST_SENT_KEY)
  if (!raw) return {}
  try {
    const parsed = JSON.parse(raw) as LastSentMap
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

async function writeLastSent(map: LastSentMap) {
  await AsyncStorage.setItem(LAST_SENT_KEY, JSON.stringify(map))
}

export function useHits() {
  const isFlushingRef = React.useRef(false)
  const didInitRef = React.useRef(false)

  const buildBase = React.useCallback((sessionUuid: string) => {
    return {
      activity_session_uuid: sessionUuid,
      app_date: formatLocalISO(new Date()),
      app_version: getAppVersionTag(),
      app_system: getAppSystem(),
      user_agent: getUserAgentSafe(),
    }
  }, [])

  async function rotateIfNeededAndGetSessionLocked(now: number): Promise<{ session: SessionBlob; rotated: boolean }> {
    const current = await readSession()
    if (current && now - current.lastActiveAt < INACTIVITY_MS) {
      const updated = { ...current, lastActiveAt: now }
      await writeSession(updated)
      return { session: updated, rotated: false }
    }
    const next = { uuid: generateUuid(), lastActiveAt: now }
    await writeSession(next)
    await writeLastSent({})
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('[hits] new session', { uuid: next.uuid })
    }
    return { session: next, rotated: true }
  }

  async function enqueueStrictLocked(hit: HitPayload) {
    const data = HitPayloadSchema.parse(hit)
    const pending = await readPending()
    const next = [data, ...pending].slice(0, MAX_BUFFER)
    await writePending(next)
  }

  const trySend = React.useCallback(async () => {
    if (isFlushingRef.current) return
    isFlushingRef.current = true
    try {
      const state = await NetInfo.fetch()
      if (!state.isConnected) return
      await mutex.runExclusive(async () => {
        let pending = await readPending()
        while (pending.length > 0) {
          const [head, ...tail] = pending
          try {
            await postHit(head)
            pending = tail
            await writePending(pending)
          } catch {
            break
          }
        }
      })
    } finally {
      isFlushingRef.current = false
    }
  }, [])

  const trackActivitySession = React.useCallback(async () => {
    console.log('trackActivitySession')
    const now = Date.now()
    const { session, rotated } = await mutex.runExclusive(() => rotateIfNeededAndGetSessionLocked(now))
    if (rotated) {
      const hit = HitPayloadSchema.parse({ event_type: 'activity_session', ...buildBase(session.uuid) })
      await mutex.runExclusive(async () => {
        await enqueueStrictLocked(hit)
      })
    }
    await trySend()
  }, [buildBase, trySend])

  const track = React.useCallback(
    async (event_type: 'impression' | 'open' | 'click', params: TrackParams) => {
      const now = Date.now()
      const { session, rotated } = await mutex.runExclusive(() => rotateIfNeededAndGetSessionLocked(now))

      // Throttle open per (object_type, object_id)
      if (event_type === 'open' && params.object_type && params.object_id) {
        const key = `open:${params.object_type}:${params.object_id}`
        const shouldSkip = await mutex.runExclusive(async () => {
          const map = await readLastSent()
          const last = map[key] || 0
          if (now - last < THROTTLE_OPEN_MS) {
            return true
          }
          map[key] = now
          await writeLastSent(map)
          return false
        })
        if (shouldSkip) return
      }

      // Throttle click per (object_type, identifier)
      if (event_type === 'click' && params.object_type) {
        const identifier = params.object_id || params.target_url || params.button_name || 'unknown'
        const key = `click:${params.object_type}:${identifier}`
        
        const shouldSkip = await mutex.runExclusive(async () => {
          const map = await readLastSent()
          const last = map[key] || 0
          if (now - last < THROTTLE_CLICK_MS) {
            return true
          }
          map[key] = now
          await writeLastSent(map)
          return false
        })
        if (shouldSkip) return
      }
      // Throttle impression per (object_type, object_id)
      if (event_type === 'impression' && params.object_type && params.object_id) {
        const key = `impression:${params.object_type}:${params.object_id}`
        
        const shouldSkip = await mutex.runExclusive(async () => {
          const map = await readLastSent()
          if (map[key]) {
            return true
          }
          map[key] = now
          await writeLastSent(map)
          return false
        })
        if (shouldSkip) return
      }
      if (rotated) {
        const sessionHit = HitPayloadSchema.parse({ event_type: 'activity_session', ...buildBase(session.uuid) })
        try {
          await postHit(sessionHit)
        } catch {
          await mutex.runExclusive(async () => {
            await enqueueStrictLocked(sessionHit)
          })
        }
      }
      const hit = HitPayloadSchema.parse({ event_type, ...buildBase(session.uuid), ...params })
      try {
        await postHit(hit)
      } catch {
        await mutex.runExclusive(async () => {
          await enqueueStrictLocked(hit)
        })
      }
      await trySend()
    },
    [buildBase, trySend],
  )

  const trackImpression = React.useCallback((p: TrackParams) => track('impression', p), [track])
  const trackOpen = React.useCallback((p: TrackParams) => track('open', p), [track])
  const trackClick = React.useCallback((p: TrackParams) => track('click', p), [track])

  const flush = React.useCallback(async () => {
    await trySend()
  }, [trySend])

  // Opportunistic flush + initial session event
  React.useEffect(() => {
    if (didInitRef.current) return
    didInitRef.current = true
    const sub = AppState.addEventListener('change', (s) => {
      if (s === 'active') void trySend()
    })
    const net = NetInfo.addEventListener((st) => {
      if (st.isConnected) void trySend()
    })
    return () => {
      sub.remove()
      net()
    }
  }, [trySend, trackActivitySession])

  return { trackActivitySession, trackImpression, trackOpen, trackClick, flush }
}


