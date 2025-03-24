import isoToEmoji from '@/utils/isoToEmoji'
import { getCountryCodeForRegionCode, getSupportedRegionCodes } from 'awesome-phonenumber'

export const phoneCodes = getSupportedRegionCodes().map((code) => {
  return {
    value: code,
    label: `${isoToEmoji(code)} +${getCountryCodeForRegionCode(code)}`,
  }
})
