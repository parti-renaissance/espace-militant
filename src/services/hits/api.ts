import { api } from '@/utils/api'
import { HitPayloadSchema, type HitPayload } from './schema'

export async function postHit(hit: HitPayload): Promise<void> {
  const data = HitPayloadSchema.parse(hit)
  await api({
    method: 'POST',
    path: `/api/v3/hit`,
    requestSchema: HitPayloadSchema,
    responseSchema: HitPayloadSchema.optional().transform(() => undefined),
    type: 'private',
  })(data)
}


