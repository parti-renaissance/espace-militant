import React, { useCallback, useMemo } from 'react'
import { useFormikContext } from 'formik'
import { get } from 'lodash'

type FormikControllerProps<Values extends object, Name extends keyof Values> = {
  children: (args: ArgsFormikField<Values, Name>) => React.ReactNode
  name: Name
}

type ArgsFormikField<Values extends object, Name extends keyof Values> = {
  inputProps: {
    id: string
    value: Values[Name]
    error: string | undefined
    onChange: (x: string) => void
    onBlur: () => void
  }
  touched: boolean
  setFieldValue: (name: keyof Values, shouldValidate?: boolean) => (x: Values[keyof Values]) => void
}

const FormikController = <Values extends object, Name extends keyof Values>({ children, name }: FormikControllerProps<Values, Name>): React.ReactNode => {
  const formik = useFormikContext<Values>()
  const onChange = useCallback((x: string) => formik.handleChange(name)(x as string), [formik, name])
  const onBlur = useCallback(() => {
    formik.setFieldTouched(name as string, true)
    return formik.handleBlur(name)
  }, [formik, name])
  const value = get(formik.values, name)
  const error = formik.touched[name] ? (formik.errors[name] as string) : undefined
  const touched = formik.touched[name]
  const inputProps = useMemo(() => ({ value, error, onChange, onBlur, id: name }), [value, error, onChange, onBlur, name])
  const setFieldValue = useCallback(
    (name: keyof Values, shouldValidate?: boolean) => (x: Values[keyof Values]) => formik.setFieldValue(name as string, x, shouldValidate),
    [formik],
  )
  const args = useMemo(() => ({ inputProps, touched, setFieldValue }), [inputProps, touched, setFieldValue]) as ArgsFormikField<Values, Name>

  return children(args)
}

export default FormikController
