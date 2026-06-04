import type { ColorScaleName, ColorScaleStep } from './colorTokens'

/**
 * ─── Alias Radix ($blue5) → échelle Tailwind ($blue500) ─────────────────────
 *
 * Désactiver (test avant suppression) :
 *   1. Passer LEGACY_COLOR_ALIASES_ENABLED à false
 *   2. npx tsx theme/convertToHsl.ts
 *
 * Supprimer définitivement :
 *   1. Supprimer ce fichier (legacyColorAliases.ts)
 *   2. Dans colors.hex.ts, remplacer l’import par la ligne ci-dessous
 *   3. npx tsx theme/convertToHsl.ts
 *
 *   const defineColorScale = <T extends Record<string, string>>(_: string, scale: T): T => scale
 */
export const LEGACY_COLOR_ALIASES_ENABLED = true

/**
 * Correspondance sémantique Radix (1–9) → nouvelle échelle 50–950.
 *
 * Ce n’est pas un décalage linéaire (1→50, 2→100…) : la nouvelle palette est plus claire,
 * et sous l’ancien système le step 9 était une couleur « pop » / accent, pas un noir.
 *
 * | Legacy | Rôle historique              | → Nouveau step |
 * |--------|------------------------------|----------------|
 * | 1–4    | Fonds & bordures clairs      | 100–400        |
 * | 5      | Primaire / liens ($blue5)    | 600            |
 * | 6–8    | Texte & surfaces foncées     | 700–900        |
 * | 9      | Accent pop ($blue9)          | 500            |
 *
 * Après modification : `npx tsx theme/convertToHsl.ts`
 */
export const LEGACY_STEP_TO_SCALE: Record<number, ColorScaleStep> = {
  1: 100,
  2: 200,
  3: 300,
  4: 400,
  5: 600,
  6: 700,
  7: 800,
  8: 900,
  9: 500,
}

/** Steps 10–12 (Tamagui / erreurs type $red10) */
export const LEGACY_EXTRA_ALIASES: Record<number, ColorScaleStep> = {
  10: 600,
  11: 700,
  12: 800,
}

export function legacyAliasTargetName(name: ColorScaleName, legacySuffix: string | number): string | undefined {
  const step = LEGACY_STEP_TO_SCALE[Number(legacySuffix)] ?? LEGACY_EXTRA_ALIASES[Number(legacySuffix)]
  return step !== undefined ? `${name}${step}` : undefined
}

function buildLegacyAliases<N extends ColorScaleName>(name: N, scale: Record<string, string>): Record<string, string> {
  const aliases: Record<string, string> = {}
  const resolve = (step: ColorScaleStep) => scale[`${name}${step}`]

  for (const [legacy, scaleStep] of Object.entries(LEGACY_STEP_TO_SCALE)) {
    aliases[`${name}${legacy}`] = resolve(scaleStep)
  }
  for (const [legacy, scaleStep] of Object.entries(LEGACY_EXTRA_ALIASES)) {
    aliases[`${name}${legacy}`] = resolve(scaleStep)
  }

  return aliases
}

/** Enveloppe les échelles de colors.hex.ts — sans effet si LEGACY_COLOR_ALIASES_ENABLED est false. */
export function defineColorScale<N extends ColorScaleName, T extends Record<string, string>>(name: N, scale: T): T & Record<string, string> {
  if (!LEGACY_COLOR_ALIASES_ENABLED) {
    return scale
  }
  return { ...scale, ...buildLegacyAliases(name, scale) }
}
