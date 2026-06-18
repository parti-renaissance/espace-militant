const TAB_HEIGHT = 56
const PILL_PADDING = 4
const BOTTOM_PADDING = 24
const GRADIENT_TOP_PADDING = 8

const pillHeight = TAB_HEIGHT + PILL_PADDING * 2

/** Static fallback for list padding — runtime height is measured via onLayout. */
export const TABBAR_LAYER_HEIGHT = pillHeight + BOTTOM_PADDING + GRADIENT_TOP_PADDING

export const layout = {
  tabHeight: TAB_HEIGHT,
  pillPadding: PILL_PADDING,
  pillHeight,
  bottomPadding: BOTTOM_PADDING,
  gradientTopPadding: GRADIENT_TOP_PADDING,
  tabOverlap: 8,
} as const

export function estimateTabBarLayerHeight(bottomInset: number, hasFloatingContent: boolean) {
  return pillHeight + Math.max(BOTTOM_PADDING, bottomInset) + (hasFloatingContent ? 0 : GRADIENT_TOP_PADDING)
}
