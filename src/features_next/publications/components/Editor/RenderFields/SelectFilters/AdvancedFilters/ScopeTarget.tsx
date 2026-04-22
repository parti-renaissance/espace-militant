import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { XStack, YStack } from 'tamagui'
import { isEqual } from 'lodash'
import { useDebouncedCallback } from 'use-debounce'

import Checkbox from '@/components/base/Checkbox/Checkbox'
import Text from '@/components/base/Text'

import type { ScopeTargetEntry, ScopeTargetValue } from '../type'

export type TeamRole = { code: string; label: string }

export type ScopeTargetInstance = {
  name: string
  code: string
  main_role: string
  team_roles: TeamRole[]
}

interface ScopeTargetProps {
  options: ScopeTargetInstance[]
  value: ScopeTargetValue
  onChange: (value: ScopeTargetValue) => void
  debounceMs?: number
}

type TriState = 'unchecked' | 'checked' | 'indeterminate'

const triStateProps = (state: TriState) => ({
  checked: state === 'checked',
  indeterminate: state === 'indeterminate',
})

/**
 * Désérialise la valeur brute des scope_targets vers la forme groupée utilisée côté UI/PUT :
 * `{ role: instanceCode, include_role, include_team, team_roles[] }`.
 *
 * Accepte deux formes :
 * - Forme plate (GET) : `{ role: <roleCode>, scope: <instanceCode> }` (une entrée par rôle coché)
 * - Forme groupée (PUT) : `{ role: <instanceCode>, include_role, include_team, team_roles[] }`
 *
 * Dans la forme plate, `role === scope` signifie que le rôle principal est sélectionné.
 */
export const deserializeScopeTargets = (raw: unknown): ScopeTargetEntry[] => {
  if (!Array.isArray(raw)) return []
  const groups = new Map<string, ScopeTargetEntry>()

  for (const item of raw) {
    if (!item || typeof item !== 'object') continue
    const obj = item as Record<string, unknown>
    if (typeof obj.role !== 'string') continue

    if (typeof obj.scope === 'string') {
      const scope = obj.scope
      const role = obj.role
      const existing = groups.get(scope) ?? { role: scope, include_role: false, include_team: false, team_roles: [] }
      if (role === scope) {
        existing.include_role = true
      } else if (!existing.team_roles.includes(role)) {
        existing.team_roles = [...existing.team_roles, role]
      }
      groups.set(scope, existing)
      continue
    }

    const scope = obj.role
    const existing = groups.get(scope) ?? { role: scope, include_role: false, include_team: false, team_roles: [] }
    if (obj.include_role) existing.include_role = true
    if (obj.include_team) existing.include_team = true
    if (Array.isArray(obj.team_roles)) {
      const set = new Set(existing.team_roles)
      for (const c of obj.team_roles) if (typeof c === 'string') set.add(c)
      existing.team_roles = [...set]
    }
    groups.set(scope, existing)
  }

  return [...groups.values()]
}

/** Normalise une entrée : promeut team_roles complet en include_team, retourne null si rien n'est sélectionné */
const normalizeEntry = (entry: ScopeTargetEntry, instance: ScopeTargetInstance | undefined): ScopeTargetEntry | null => {
  const include_role = !!entry.include_role
  let include_team = !!entry.include_team
  let team_roles = Array.isArray(entry.team_roles) ? [...new Set(entry.team_roles)] : []

  const knownTeamCodes = instance?.team_roles?.map((r) => r.code) ?? null
  if (knownTeamCodes && knownTeamCodes.length > 0) {
    // On ne garde que les codes connus
    team_roles = team_roles.filter((c) => knownTeamCodes.includes(c))
    if (team_roles.length === knownTeamCodes.length) {
      include_team = true
      team_roles = []
    }
  }
  if (include_team) team_roles = []

  if (!include_role && !include_team && team_roles.length === 0) return null
  return { role: entry.role, include_role, include_team, team_roles }
}

const normalizeValue = (value: ScopeTargetValue | unknown, options: ScopeTargetInstance[]): ScopeTargetValue => {
  const optionsByCode = new Map(options.map((o) => [o.code, o]))
  const grouped = deserializeScopeTargets(value)
  const result: ScopeTargetEntry[] = []
  for (const entry of grouped) {
    const normalized = normalizeEntry(entry, optionsByCode.get(entry.role))
    if (normalized) result.push(normalized)
  }
  return result
}

const emptyEntry = (code: string): ScopeTargetEntry => ({
  role: code,
  include_role: false,
  include_team: false,
  team_roles: [],
})

export default function ScopeTarget({ options, value, onChange, debounceMs = 500 }: ScopeTargetProps) {
  const [localValue, setLocalValue] = useState<ScopeTargetValue>(() => normalizeValue(value, options))
  const lastEmittedRef = useRef<ScopeTargetValue>(localValue)
  const [prevValue, setPrevValue] = useState<ScopeTargetProps['value']>(value)
  const [prevOptions, setPrevOptions] = useState<ScopeTargetInstance[]>(options)

  if (value !== prevValue || options !== prevOptions) {
    setPrevValue(value)
    setPrevOptions(options)
    const incoming = normalizeValue(value, options)
    if (!isEqual(incoming, lastEmittedRef.current)) {
      lastEmittedRef.current = incoming
      setLocalValue(incoming)
    }
  }

  const debouncedEmit = useDebouncedCallback((next: ScopeTargetValue) => {
    lastEmittedRef.current = next
    onChange(next)
  }, debounceMs)

  const commit = useCallback(
    (next: ScopeTargetValue) => {
      setLocalValue(next)
      debouncedEmit(next)
    },
    [debouncedEmit],
  )

  useEffect(() => () => debouncedEmit.flush(), [debouncedEmit])

  const entryByScope = useMemo(() => {
    const map: Record<string, ScopeTargetEntry> = {}
    for (const entry of localValue) map[entry.role] = entry
    return map
  }, [localValue])

  const writeEntry = useCallback(
    (instance: ScopeTargetInstance, mutator: (entry: ScopeTargetEntry) => ScopeTargetEntry) => {
      const current = entryByScope[instance.code] ?? emptyEntry(instance.code)
      const mutated = mutator(current)
      const normalized = normalizeEntry(mutated, instance)
      const others = localValue.filter((e) => e.role !== instance.code)
      commit(normalized ? [...others, normalized] : others)
    },
    [commit, entryByScope, localValue],
  )

  const handleInstanceToggle = useCallback(
    (instance: ScopeTargetInstance) => {
      const current = entryByScope[instance.code]
      const hasAny = !!current && (current.include_role || current.include_team || current.team_roles.length > 0)
      if (hasAny) {
        writeEntry(instance, () => emptyEntry(instance.code))
      } else {
        writeEntry(instance, () => ({
          role: instance.code,
          include_role: true,
          include_team: true,
          team_roles: [],
        }))
      }
    },
    [entryByScope, writeEntry],
  )

  const handleMainRoleToggle = useCallback(
    (instance: ScopeTargetInstance) => {
      writeEntry(instance, (current) => ({ ...current, include_role: !current.include_role }))
    },
    [writeEntry],
  )

  const handleTeamRoleToggle = useCallback(
    (instance: ScopeTargetInstance, roleCode: string) => {
      writeEntry(instance, (current) => {
        // Si include_team est actif, on déplie : garder toutes les team_roles sauf celle qu'on retire
        if (current.include_team) {
          const allCodes = instance.team_roles.map((r) => r.code)
          const next = allCodes.filter((c) => c !== roleCode)
          return { ...current, include_team: false, team_roles: next }
        }
        const set = new Set(current.team_roles)
        if (set.has(roleCode)) set.delete(roleCode)
        else set.add(roleCode)
        return { ...current, team_roles: [...set] }
      })
    },
    [writeEntry],
  )

  const selectAllState: TriState = useMemo(() => {
    if (options.length === 0) return 'unchecked'
    let fullyCount = 0
    let anyCount = 0
    for (const instance of options) {
      const entry = entryByScope[instance.code]
      if (!entry) continue
      const hasTeamRoles = instance.team_roles?.length > 0
      const isWhole = !!entry.include_role && (entry.include_team || !hasTeamRoles)
      const anySelected = entry.include_role || entry.include_team || entry.team_roles.length > 0
      if (isWhole) fullyCount += 1
      if (anySelected) anyCount += 1
    }
    if (fullyCount === options.length) return 'checked'
    if (anyCount > 0) return 'indeterminate'
    return 'unchecked'
  }, [entryByScope, options])

  const handleSelectAllToggle = useCallback(() => {
    if (selectAllState === 'checked') {
      commit([])
    } else {
      const next: ScopeTargetValue = options.map((instance) => ({
        role: instance.code,
        include_role: true,
        include_team: true,
        team_roles: [],
      }))
      commit(next)
    }
  }, [commit, options, selectAllState])

  if (!Array.isArray(options) || options.length === 0) return null

  return (
    <YStack>
      <XStack alignItems="center">
        <Checkbox color="blue" {...triStateProps(selectAllState)} onPress={handleSelectAllToggle} />
        <XStack flex={1} alignItems="center" cursor="pointer" onPress={handleSelectAllToggle} paddingVertical="$xsmall" paddingLeft="$xsmall">
          <Text.MD semibold flex={1}>
            Tout sélectionner
          </Text.MD>
        </XStack>
      </XStack>
      {options.map((instance) => {
        const entry = entryByScope[instance.code]
        const mainChecked = !!entry?.include_role
        const teamAll = !!entry?.include_team
        const teamCodes = new Set(entry?.team_roles ?? [])
        const hasTeamRoles = Array.isArray(instance.team_roles) && instance.team_roles.length > 0
        const allRolesSelected = mainChecked && (hasTeamRoles ? teamAll : true)
        const anySelected = mainChecked || teamAll || teamCodes.size > 0
        const triState: TriState = allRolesSelected ? 'checked' : anySelected ? 'indeterminate' : 'unchecked'

        return (
          <YStack key={instance.code} py="$xsmall">
            <XStack alignItems="center">
              <Checkbox color="blue" {...triStateProps(triState)} onPress={() => handleInstanceToggle(instance)} />
              <XStack
                flex={1}
                alignItems="center"
                cursor="pointer"
                onPress={() => handleInstanceToggle(instance)}
                paddingVertical="$xsmall"
                paddingLeft="$xsmall"
              >
                <YStack flex={1}>
                  <Text.MD semibold>{instance.name}</Text.MD>
                </YStack>
              </XStack>
            </XStack>
            <YStack paddingLeft={26} paddingRight="$small">
              <XStack alignItems="center">
                <Checkbox color="blue" checked={mainChecked} onPress={() => handleMainRoleToggle(instance)} />
                <XStack
                  flex={1}
                  alignItems="center"
                  paddingVertical="$xsmall"
                  paddingLeft="$xsmall"
                  cursor="pointer"
                  onPress={() => handleMainRoleToggle(instance)}
                >
                  <Text.SM flex={1}>{instance.main_role}</Text.SM>
                </XStack>
              </XStack>
              {hasTeamRoles
                ? instance.team_roles.map((role) => {
                    const checked = teamAll || teamCodes.has(role.code)
                    return (
                      <XStack key={role.code} alignItems="center">
                        <Checkbox color="blue" checked={checked} onPress={() => handleTeamRoleToggle(instance, role.code)} />
                        <XStack
                          flex={1}
                          alignItems="center"
                          paddingVertical="$xsmall"
                          paddingLeft="$xsmall"
                          cursor="pointer"
                          onPress={() => handleTeamRoleToggle(instance, role.code)}
                        >
                          <Text.SM flex={1}>{role.label}</Text.SM>
                        </XStack>
                      </XStack>
                    )
                  })
                : null}
            </YStack>
          </YStack>
        )
      })}
    </YStack>
  )
}
