import { z } from 'zod'

export const ScanTicketRequestSchema = z.object({
  qrCodeId: z.string().min(1, 'QR Code ID requis')
})

export const ScanTicketResponseSchema = z.object({
  status: z.enum(['unknown', 'invalid', 'valid', 'already_scanned']),
  id: z.string(),
  userName: z.string().optional(),
  type: z.string().optional(), // ex: "Accès A, bracelet vert"
  scannedAt: z.string().optional(),
})

export type ScanTicketRequest = z.infer<typeof ScanTicketRequestSchema>
export type ScanTicketResponse = z.infer<typeof ScanTicketResponseSchema>
export type TicketStatus = ScanTicketResponse['status']
