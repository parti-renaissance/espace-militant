import fs from 'fs'
import convert from 'color-convert'
import { blue, gray, green, orange, purple, yellow } from './colors.hex'

interface ColorMap {
  [key: string]: string
}

function convertColorsToHSL(colors: ColorMap): ColorMap {
  const hslColors: ColorMap = {}
  for (const key in colors) {
    const hex = colors[key].substring(1) // remove #
    const hsl = convert.hex.hsl(hex)
    hslColors[key] = `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`
  }
  return hslColors
}

const hslYellow = convertColorsToHSL(yellow)
const hslPurple = convertColorsToHSL(purple)
const hslOrange = convertColorsToHSL(orange)
const hslGreen = convertColorsToHSL(green)
const hslGray = convertColorsToHSL(gray)
const hslBlue = convertColorsToHSL(blue)

const hslColors = ` export const yellow = ${JSON.stringify(hslYellow, null, 4)};
export const purple = ${JSON.stringify(hslPurple, null, 4)};
export const orange = ${JSON.stringify(hslOrange, null, 4)};
export const green = ${JSON.stringify(hslGreen, null, 4)};
export const gray = ${JSON.stringify(hslGray, null, 4)};
export const blue = ${JSON.stringify(hslBlue, null, 4)}`

fs.writeFile('colors.hsl.ts', hslColors, (err) => {
  if (err) throw err
  // eslint-disable-next-line no-console
  console.log('The file has been saved!')
})
