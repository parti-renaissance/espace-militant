import * as schemas from '@/services/timeline-feed/schema'
import type * as Types from '@/services/timeline-feed/schema'
import { mapPublicTimelineFeedResponse } from '@/services/timeline-feed/mapPublicTimelineFeed'
import { api } from '@/utils/api'

export const getTimelineFeed = api<Types.RestTimelineFeedRequest, Types.RestTimelineFeedResponse>({
  method: 'GET',
  path: 'api/v3/je-mengage/timeline_feeds',
  requestSchema: schemas.RestTimelineFeedRequestSchema,
  responseSchema: schemas.RestTimelineFeedResponseSchema,
  type: 'private',
})

const getPublicTimelineFeedRaw = api<Types.RestTimelineFeedRequest, Types.RestPublicTimelineFeedResponse>({
  method: 'GET',
  path: 'api/timeline-feeds',
  requestSchema: schemas.RestTimelineFeedRequestSchema,
  responseSchema: schemas.RestPublicTimelineFeedResponseSchema,
  type: 'public',
})

export const getPublicTimelineFeed = async (request: Types.RestTimelineFeedRequest): Promise<Types.RestTimelineFeedResponse> => {
  const response = await getPublicTimelineFeedRaw(request)
  return mapPublicTimelineFeedResponse(response)
}
