import clientEnv from './clientEnv'

export const createTitle = (title: string) => `${title} • ${clientEnv.APP_NAME}`
