import { z } from 'zod'
import { api } from '@/utils/api'
import { ScanTicketRequestSchema, type ScanTicketRequest, type ScanTicketResponse } from './schema'

// Simulation de données pour les tests
export const mockTickets: Record<string, ScanTicketResponse> = {
  'TICKET_001': {
    status: 'valid',
    id: 'TICKET_001',
    userName: 'Jean Dupont',
    type: 'Accès A, bracelet vert'
  },
  'TICKET_002': {
    status: 'valid',
    id: 'TICKET_002',
    userName: 'Marie Martin',
    type: 'Accès B, bracelet jaune'
  },
  'TICKET_003': {
    status: 'invalid',
    id: 'TICKET_003',
    userName: 'Paul Durand',
    type: 'Accès A, bracelet vert'
  },
  'TICKET_004': {
    status: 'already_scanned',
    id: 'TICKET_004',
    userName: 'Sophie Bernard',
    type: 'Accès A, bracelet vert',
    scannedAt: new Date().toISOString()
  },
  'TICKET_005': {
    status: 'valid',
    id: 'TICKET_005',
    userName: 'Marc Dubois',
    type: 'Accès A, bracelet jaune'
  }
}

// Simulation d'un délai réseau
const simulateNetworkDelay = (ms: number = 1000) => 
  new Promise(resolve => setTimeout(resolve, ms))

export async function scanTicket(ticket: ScanTicketRequest): Promise<ScanTicketResponse> {
  const data = ScanTicketRequestSchema.parse(ticket)
  
  // Simulation du délai réseau
  await simulateNetworkDelay(800 + Math.random() * 400) // 800-1200ms
  
  // Simulation d'erreur réseau occasionnelle
  if (Math.random() < 0.1) {
    throw new Error('Erreur de connexion réseau')
  }
  
  // Simulation de la réponse du serveur
  const { qrCodeId } = data
  
  // Cas 1: Ticket valide (Accès A, Bracelet vert)
  if (qrCodeId === 'TICKET_001') {
    return mockTickets['TICKET_001']
  }
  
  // Cas 2: Ticket valide (Accès B, Bracelet jaune)
  if (qrCodeId === 'TICKET_002') {
    return mockTickets['TICKET_002']
  }
  
  // Cas 3: Ticket invalide
  if (qrCodeId === 'TICKET_003') {
    return mockTickets['TICKET_003']
  }
  
  // Cas 4: Ticket déjà scanné aujourd'hui
  if (qrCodeId === 'TICKET_004') {
    return mockTickets['TICKET_004']
  }
  
  // Cas 5: Ticket valide (Accès A, Bracelet jaune)
  if (qrCodeId === 'TICKET_005') {
    return mockTickets['TICKET_005']
  }
  
  // Cas par défaut: Ticket inconnu
  return {
    status: 'unknown',
    id: qrCodeId,
  }
}