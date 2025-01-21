import { ThemeName } from 'tamagui'
import { ActivistTagTypes, ActivistTagTypesSchema } from './schema'

const activistTagShape: Record<ActivistTagTypes, { theme: ThemeName }> = {
  adherent: {
    theme: 'blue',
  },
  sympathisant: {
    theme: 'orange',
  },
  elu: {
    theme: 'green',
  },
  other: {
    theme: 'gray',
  },
} as const

const getActivistTagTheme = (type: ActivistTagTypes): ThemeName => {
  const tagType = ActivistTagTypesSchema.safeParse(type)
  if (tagType.success) {
    return activistTagShape[type].theme
  }
  return 'gray'
}

export { getActivistTagTheme }
