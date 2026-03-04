import z from 'zod'

/** Requête pour démarrer un chat ou continuer une conversation (avec thread_id) */
export const RestChatbotChatRequestSchema = z.object({
  message: z.string(),
  thread_id: z.string().uuid().optional(),
})
export type RestChatbotChatRequest = z.infer<typeof RestChatbotChatRequestSchema>

/** Élément de la liste des threads */
export const RestChatbotThreadItemSchema = z.object({
  title: z.string(),
  uuid: z.string().uuid(),
  created_at: z.string(),
  updated_at: z.string(),
})
export type RestChatbotThreadItem = z.infer<typeof RestChatbotThreadItemSchema>

/** Métadonnées de pagination pour la liste des threads */
export const RestChatbotThreadsMetadataSchema = z.object({
  total_items: z.number(),
  items_per_page: z.number(),
  count: z.number(),
  current_page: z.number(),
  last_page: z.number(),
})
export type RestChatbotThreadsMetadata = z.infer<typeof RestChatbotThreadsMetadataSchema>

/** Réponse GET /ai/threads */
export const RestChatbotThreadsResponseSchema = z.object({
  metadata: RestChatbotThreadsMetadataSchema,
  items: z.array(RestChatbotThreadItemSchema),
})
export type RestChatbotThreadsResponse = z.infer<typeof RestChatbotThreadsResponseSchema>
