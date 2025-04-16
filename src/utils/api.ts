import { authInstance, publicInstance } from '@/lib/axios'
import { createApi } from './constructApi'

export const api = createApi({ authInstance, publicInstance })
