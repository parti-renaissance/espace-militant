import { useMutation } from '@tanstack/react-query'
import { scanTicket } from './api'
import { ScanTicketResponse } from './schema'

export const useScanTicket = () => {
  return useMutation<ScanTicketResponse, Error, string>({
    mutationFn: scanTicket,
    onError: (error) => {
      console.error('Erreur lors du scan du ticket:', error)
    }
  })
}
