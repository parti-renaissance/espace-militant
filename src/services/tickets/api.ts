import { api } from '@/utils/api'
import { ScanTicketResponseSchema } from './schema'
import { z } from 'zod'

export const scanTicket = (uuid: string) => {
  return api({ 
    method: 'post', 
    path: `api/v3/national_event_inscriptions/${uuid}/scan`, 
    requestSchema: z.void(), 
    responseSchema: ScanTicketResponseSchema,
    type: 'private',
    axiosConfig: { headers: { 'Content-Type': 'application/json' } },
  })()
}