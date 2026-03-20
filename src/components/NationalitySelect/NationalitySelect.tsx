import { uniqBy, upperFirst } from 'lodash'

import Select from '@/components/base/Select/SelectV3'

import { InputProps } from '../base/Input/Input'
import nationalities from './nationalities.json'

type NationalityEntry = { iso: string; nationality: string }
const nationalitiesList = nationalities as NationalityEntry[]
const isoToLabel = new Map(uniqBy(nationalitiesList, 'iso').map((n) => [n.iso.toUpperCase(), upperFirst(n.nationality)]))

/** Traduit un code ISO pays (ex: "FR") en libellé (ex: "Française"). */
export function getNationalityLabel(isoCode: string | null | undefined): string {
  if (!isoCode || !isoCode.trim()) return '—'
  const label = isoToLabel.get(isoCode.trim().toUpperCase())
  return label ?? isoCode
}

interface NationalitySelectProps {
  value?: string
  onChange: (value: string) => void
  label?: string
  id: string
  error?: string
  onBlur?: () => void
  placeholder?: string
  color: InputProps['color']
}

const countriesSource = uniqBy(nationalitiesList, 'iso').map((n) => ({
  value: n.iso,
  label: upperFirst(n.nationality),
}))

export default function NationalitySelect({ id, ...props }: Readonly<NationalitySelectProps>) {
  return <Select key={id} searchable options={countriesSource} {...props} />
}
