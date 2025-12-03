import { useState, useMemo, useCallback } from 'react'
import type { LayoutChangeEvent } from 'react-native'

// Valeurs par défaut (peuvent être surchargées via les props)
const DEFAULT_ITEM_HEIGHT = 44 // 40px hauteur + 4px gap
const DEFAULT_CADRE_MARGIN = 32 // Margin top du bouton CADRE
const MIN_VISIBLE_ITEMS = 3 // Nombre minimum d'items toujours visibles

interface UseVisibleNavItemsOptions<T> {
  items: readonly T[]
  hasCadreButton?: boolean
  isVisible?: boolean
  itemHeight?: number
}

export const useVisibleNavItems = <T,>({
  items,
  hasCadreButton = false,
  isVisible = true,
  itemHeight = DEFAULT_ITEM_HEIGHT,
}: UseVisibleNavItemsOptions<T>) => {
  const [containerHeight, setContainerHeight] = useState<number>(0)

  // Fonction magique qui marche sur Web et Mobile
  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { height } = event.nativeEvent.layout
      // On arrondit pour éviter les flottants bizarres sur certains écrans
      setContainerHeight(Math.floor(height))
    },
    []
  )

  const visibleItemsCount = useMemo(() => {
    // Si le conteneur n'est pas encore mesuré ou invisible, on renvoie tout ou rien
    // (ici tout, pour laisser le layout se faire)
    if (!isVisible || containerHeight === 0) return items.length

    const totalItems = items.length

    // 1. Calcul de l'espace disponible "net" (sans le bouton cadre)
    let availableHeight = containerHeight
    if (hasCadreButton) {
      availableHeight -= DEFAULT_CADRE_MARGIN + itemHeight
    }

    // 2. Combien d'items tiennent physiquement ?
    const maxPossibleItems = Math.floor(availableHeight / itemHeight)

    // 3. Si tout tient, on retourne le total
    if (maxPossibleItems >= totalItems) {
      return totalItems
    }

    // 4. Sinon, on doit réserver la place pour le bouton "Plus" (qui fait la taille d'un item)
    // Donc l'espace utile est réduit de la hauteur d'un item
    const slotsAvailableWithPlusBtn = maxPossibleItems - 1

    // 5. On applique les limites de sécurité (minimum 3 items ou le max dispo)
    // Math.max(0, ...) évite les résultats négatifs si le conteneur est minuscule
    return Math.max(MIN_VISIBLE_ITEMS, Math.max(0, slotsAvailableWithPlusBtn))
  }, [containerHeight, items.length, hasCadreButton, isVisible, itemHeight])

  // Découpage des listes
  const visibleItems = useMemo(
    () => items.slice(0, visibleItemsCount),
    [items, visibleItemsCount]
  )
  const hiddenItems = useMemo(
    () => items.slice(visibleItemsCount),
    [items, visibleItemsCount]
  )

  return {
    visibleItems,
    hiddenItems,
    onLayout, // On renvoie la fonction à attacher à la View
    containerHeight, // Utile pour le debug
  }
}

