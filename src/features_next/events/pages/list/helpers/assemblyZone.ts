import { assemblies } from '@/components/AssemblySelect/assemblies'

export const ALL_ZONE_DETAIL = { value: 'all', label: 'Toutes' } as const

export const getAssemblyDetailZone = (code: string) => {
  const assembly = assemblies.find((a) => a.value === code)
  return assembly ? { value: assembly.value, label: `${assembly.value} • ${assembly.label}` } : { value: code, label: code }
}
