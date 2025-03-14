import Select from '@/components/base/Select/SelectV3'
import { uniqBy, upperFirst } from 'lodash'
import { InputProps } from '../base/Input/Input'
import nationalities from './nationalities.json'

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

const countriesSource = uniqBy(nationalities, 'iso').map((n) => ({
  value: n.iso,
  label: upperFirst(n.nationality),
}))

export default function NationalitySelect({ id, ...props }: Readonly<NationalitySelectProps>) {
  return <Select key={id} searchable options={countriesSource} {...props} />
}
