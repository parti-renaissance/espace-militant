import { useMutation } from '@tanstack/react-query'
import { scanTicket } from './api'
import { ScanTicketRequest, ScanTicketResponse } from './schema'

export const useScanTicket = () => {
  return useMutation<ScanTicketResponse, Error, ScanTicketRequest>({
    mutationFn: scanTicket,
    onError: (error) => {
      console.error('Erreur lors du scan du ticket:', error)
    }
  })
}
