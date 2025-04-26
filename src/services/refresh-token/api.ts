import { Platform } from 'react-native'
import * as schema from '@/services/refresh-token/schema'
import { createApi, type Instances } from '@/utils/constructApi'

export const getRefreshToken = (x: Instances) =>
  createApi(x)({
    method: 'POST',
    path: `/oauth/v2/token?system=${Platform.OS}`,
    requestSchema: schema.RestRefreshTokenRequestSchema,
    responseSchema: schema.RestRefreshTokenResponseSchema,
    type: 'public',
  })
