import '@tanstack/react-query'

/**
 * @see https://tanstack.com/query/latest/docs/framework/react/typescript#typing-the-error-field
 */
declare module '@tanstack/react-query' {
  interface Register {
    defaultError: AxiosError
  }
}
