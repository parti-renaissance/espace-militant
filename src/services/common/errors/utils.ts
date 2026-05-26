import { has } from 'lodash'
import { FieldValues, Path } from 'react-hook-form'
import { genericErrorMapper, genericErrorThrower } from './generic-errors'
import { ErrorThrower } from './types'

export type ParseErrorOptions = {
  /** When true, generic HTTP logging is skipped (feature-level loggers handle Sentry). */
  skipGenericErrorLog?: boolean
}

export const parseError = (error: unknown, throwers: Array<ErrorThrower> = [], options?: ParseErrorOptions) => {
  const genericHandler = options?.skipGenericErrorLog ? genericErrorMapper : genericErrorThrower
  ;[...throwers, genericHandler].reduce((acc, thrower) => thrower(acc), error)
  throw error instanceof Error ? error : new Error('Unknown error')
}

export const isPathExist = <TF extends FieldValues, S extends string>(path: S, obj: TF): path is Path<TF> => {
  return has(obj, path)
}
