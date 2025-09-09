import React, { useEffect, useRef, useCallback } from 'react'
import { Platform } from 'react-native'
import { useHits } from '@/services/hits/hook'
import { ObjectType } from '@/services/hits/schema'

interface TrackImpressionWebProps {
  children: React.ReactNode
  objectType: ObjectType | null
  objectId: string
  source?: string
  utmSource?: string
  utmCampaign?: string
  referrerCode?: string
}

const TrackImpressionWeb: React.FC<TrackImpressionWebProps> = ({
  children,
  objectType,
  objectId,
  source,
  utmSource,
  utmCampaign,
  referrerCode,
}) => {
  const { trackImpression } = useHits()
  const elementRef = useRef<HTMLDivElement>(null)
  const hasTrackedRef = useRef(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0]
      
      if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
        // L'élément est visible à 50% ou plus
        if (!hasTrackedRef.current) {
          // Démarrer le timer de 400ms
          timeoutRef.current = setTimeout(() => {
            if (!hasTrackedRef.current) {
              hasTrackedRef.current = true
              trackImpression({
                object_type: objectType,
                object_id: objectId,
                source,
                utm_source: utmSource,
                utm_campaign: utmCampaign,
                referrer_code: referrerCode,
              })
            }
          }, 400)
        }
      } else {
        // L'élément n'est plus visible à 50% ou plus
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
          timeoutRef.current = null
        }
      }
    },
    [trackImpression, objectType, objectId, source, utmSource, utmCampaign, referrerCode]
  )

  useEffect(() => {
    // Ne s'exécuter que sur web
    if (Platform.OS !== 'web' || !elementRef.current) return

    // Créer l'IntersectionObserver
    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold: 0.5, // 50% de visibilité
      rootMargin: '0px',
    })

    // Observer l'élément
    observerRef.current.observe(elementRef.current)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [handleIntersection])

  // Sur mobile, retourner directement les enfants sans wrapper
  if (Platform.OS !== 'web') {
    return <>{children}</>
  }

  return (
    <div ref={elementRef} style={{ width: '100%' }}>
      {children}
    </div>
  )
}

export default TrackImpressionWeb
