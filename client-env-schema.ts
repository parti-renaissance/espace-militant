import { z } from 'zod'

const envClientSchema = z.object({
  API_BASE_URL: z.string().url(),
  ADMIN_URL: z.string(),
  ASSOCIATED_DOMAIN: z.string(),
  ENVIRONMENT: z.enum(['staging', 'production']),
  FB_API_KEY: z.string(),
  FB_APP_ID: z.string(),
  FB_MEASUREMENT_ID: z.string(),
  FB_PROJECT_ID: z.string(),
  FB_SENDER_ID: z.string(),
  OAUTH_BASE_URL: z.string().url(),
  OAUTH_CLIENT_ID: z.string(),
  SENTRY_DSN: z.string().url(),
  MAP_BOX_ACCESS_TOKEN: z.string(),
  APP_NAME: z.string(),
  CAMPAIGN_DOMAIN: z.string(),
  TOI_PRESIDENT_EMBED_URL: z.string().url().optional(),
  TOI_PRESIDENT_SHARE_URL: z.string().url().optional(),
})

export type ClientEnv = z.infer<typeof envClientSchema>

export default envClientSchema
