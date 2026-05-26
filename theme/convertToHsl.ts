import fs from 'fs'
import path from 'path'
import convert from 'color-convert'

import { COLOR_SCALE_NAMES } from './colorTokens'
import { black, blue, gray, green, orange, pink, purple, red, teal, white, yellow } from './colors.hex'

interface ColorMap {
  [key: string]: string
}

const scaleColors = { gray, purple, blue, teal, green, yellow, orange, red, pink }

function convertColorsToHSL(colors: ColorMap): ColorMap {
  const hslColors: ColorMap = {}
  for (const key in colors) {
    const hex = colors[key].replace('#', '')
    const hsl = convert.hex.hsl(hex)
    hslColors[key] = `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`
  }
  return hslColors
}

const hslExports = COLOR_SCALE_NAMES.map((name) => {
  const hsl = convertColorsToHSL(scaleColors[name])
  return `export const ${name} = ${JSON.stringify(hsl, null, 4)}`
}).join('\n\n')

const hslWhite = convertColorsToHSL(white)
const hslBlack = convertColorsToHSL(black)

const hslColors = `${hslExports}

export const white = ${JSON.stringify(hslWhite, null, 4)}

export const black = ${JSON.stringify(hslBlack, null, 4)}
`

const outPath = path.join(__dirname, 'colors.hsl.ts')
fs.writeFileSync(outPath, hslColors)
// eslint-disable-next-line no-console
console.log(`Wrote ${outPath}`)
