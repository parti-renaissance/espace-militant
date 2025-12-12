import { RefObject, useContext, useEffect, useRef, useCallback } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import { isWeb } from 'tamagui'
import { ScrollContext } from '@/components/AppStructure/Layout/LayoutContext'

type Props = {
  onEndReached?: () => void
  onEndReachedThreshold?: number
  onScroll?: (e: NativeSyntheticEvent<NativeScrollEvent>) => void
  onMomentumScrollEnd?: (e: NativeSyntheticEvent<NativeScrollEvent>) => void
  scrollEventThrottle?: number
  ref?: RefObject<HTMLDivElement> // Reste pour la compatibilité, mais pas utilisé pour assigner
}

// Fonction utilitaire pour créer l'objet NativeSyntheticEvent pour le web
const createWebScrollEvent = (scrollView: HTMLDivElement): NativeSyntheticEvent<NativeScrollEvent> => ({
  nativeEvent: {
    contentOffset: { y: scrollView.scrollTop },
    contentSize: { height: scrollView.scrollHeight, width: scrollView.scrollWidth },
    layoutMeasurement: { height: scrollView.clientHeight, width: scrollView.clientWidth },
  },
}) as NativeSyntheticEvent<NativeScrollEvent>

export const usePageLayoutScroll = (props?: Props) => {
  const { scrollActive, layoutRef } = useContext(ScrollContext)
  const propsRef = useRef(props)
  propsRef.current = props // Mise à jour de la référence aux props

  // Réf. pour le timeout du throttle et du momentum
  const throttleTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const momentumTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const handleScroll = useCallback(() => {
    const currentProps = propsRef.current
    const scrollView = layoutRef?.current
    
    // Condition de sortie rapide
    if (!isWeb || !scrollActive || !scrollView) return

    // --- Logique onEndReached ---
    if (currentProps?.onEndReached) {
      const { scrollTop, scrollHeight, clientHeight } = scrollView
      const threshold = currentProps.onEndReachedThreshold ?? 0.5
      const distanceFromEnd = scrollHeight - scrollTop - clientHeight

      if (distanceFromEnd <= clientHeight * threshold) {
        currentProps.onEndReached()
      }
    }

    // --- Logique onScroll (avec throttle) ---
    if (currentProps?.onScroll) {
      const runScrollEvent = () => {
        const nativeEvent = createWebScrollEvent(scrollView)
        currentProps.onScroll?.(nativeEvent)
      }

      if (currentProps.scrollEventThrottle) {
        if (!throttleTimeoutRef.current) {
          runScrollEvent()
          throttleTimeoutRef.current = setTimeout(() => {
            throttleTimeoutRef.current = undefined
          }, currentProps.scrollEventThrottle)
        }
      } else {
        runScrollEvent()
      }
    }

    // --- Logique onMomentumScrollEnd (Détection d'arrêt de défilement) ---
    if (currentProps?.onMomentumScrollEnd) {
      // Réinitialise le timer à chaque événement de défilement
      clearTimeout(momentumTimeoutRef.current)
      momentumTimeoutRef.current = setTimeout(() => {
        const nativeEvent = createWebScrollEvent(scrollView)
        currentProps.onMomentumScrollEnd?.(nativeEvent)
      }, 150) // Temps pour considérer la fin du défilement
    }

  }, [scrollActive, layoutRef])

  useEffect(() => {
    if (!isWeb || !scrollActive || !layoutRef?.current) return

    const scrollView = layoutRef?.current
    
    // Un seul écouteur pour gérer toutes les logiques
    scrollView.addEventListener('scroll', handleScroll)

    return () => {
      scrollView.removeEventListener('scroll', handleScroll)
      clearTimeout(throttleTimeoutRef.current)
      clearTimeout(momentumTimeoutRef.current)
    }
  }, [scrollActive, handleScroll, layoutRef])

  return { isWebPageLayoutScrollActive: scrollActive, layoutRef }
}