import i18n from './i18n'

const formatPercent = (input: number): string => {
  return new Intl.NumberFormat(i18n.language, { style: 'percent' }).format(
    input,
  )
}

const formatDecimal = (input: number): string => {
  return new Intl.NumberFormat(i18n.language, { style: 'decimal' }).format(
    input,
  )
}

/**
 * Formate un pourcentage pour les statistiques avec une précision adaptative
 * @param input Le nombre à formater (peut être un pourcentage déjà calculé, ex: 12.5 pour 12.5%)
 * @param forceRound Si true, force l'arrondi à un nombre entier (pour les chiffres principaux)
 * @returns Le pourcentage formaté
 * 
 * Logique:
 * - < 10 : 2 chiffres après la virgule (ex: 5.67%)
 * - >= 10 et < 100 : 1 chiffre après la virgule (ex: 45.3%)
 * - >= 100 : pas de chiffre après la virgule (ex: 150%)
 */
const formatStatsPercent = (input: number, forceRound: boolean = false): string => {
  if (forceRound) {
    return new Intl.NumberFormat(i18n.language, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(input)
  }

  let maximumFractionDigits: number
  let minimumFractionDigits: number

  if (input < 10) {
    maximumFractionDigits = 2
    minimumFractionDigits = 0
  } else if (input < 100) {
    maximumFractionDigits = 1
    minimumFractionDigits = 0
  } else {
    maximumFractionDigits = 0
    minimumFractionDigits = 0
  }

  return new Intl.NumberFormat(i18n.language, {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(input)
}

export const NumberFormatter = {
  formatPercent,
  formatDecimal,
  formatStatsPercent,
}
