import { z } from 'zod'

import * as schemas from '@/services/video/schema'
import { api } from '@/utils/api'

export const getVideo = (uuid: string) =>
  api({
    method: 'get',
    path: `/api/videos/${uuid}`,
    requestSchema: z.void(),
    responseSchema: schemas.RestGetVideoResponseSchema,
    type: 'public',
  })()
