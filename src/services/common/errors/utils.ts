import { has } from 'lodash'
import { FieldValues, Path } from 'react-hook-form'
import { genericErrorThrower } from './generic-errors'
import { ErrorThrower } from './types'

export const parseError = (error: unknown, throwers: Array<ErrorThrower> = []) => {
  ;[...throwers, genericErrorThrower].reduce((acc, thrower) => thrower(acc), error)
  throw error instanceof Error ? error : new Error('Unknown error')
}

export const isPathExist = <TF extends FieldValues, S extends string>(path: S, obj: TF): path is Path<TF> => {
  return has(obj, path)
}
