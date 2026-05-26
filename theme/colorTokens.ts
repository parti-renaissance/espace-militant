/** Tailwind-style scale steps (default brand = 500). */
export const COLOR_SCALE_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const

export type ColorScaleStep = (typeof COLOR_SCALE_STEPS)[number]

export type ColorScaleName = 'gray' | 'purple' | 'blue' | 'teal' | 'green' | 'yellow' | 'orange' | 'red' | 'pink'

export const COLOR_SCALE_NAMES = ['gray', 'purple', 'blue', 'teal', 'green', 'yellow', 'orange', 'red', 'pink'] as const satisfies readonly ColorScaleName[]

/** Default neutral step index for Tamagui palettes (500). */
export const PALETTE_NEUTRAL_STEP_INDEX = COLOR_SCALE_STEPS.indexOf(500)
