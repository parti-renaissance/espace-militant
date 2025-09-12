import { z } from 'zod'
import { api } from '@/utils/api'
import { ScanTicketRequestSchema, type ScanTicketRequest, type ScanTicketResponse } from './schema'
import { UserTagEnum } from '@/core/entities/UserProfile'

// Simulation de données pour les tests
export const mockTickets: Record<string, ScanTicketResponse> = {
  'TICKET_001': {
    uuid: 'exemple_uuid_001',
    status: {
      code: 'valid',
      subtitle: 'Accès autorisé'
    },
    type: {
      color: '#22c55e',
      label: 'Accès A'
    },
    user: {
      public_id: 'user_001',
      avatar_url: 'https://example.com/avatar1.jpg',
      civility: 'M.',
      first_name: 'Jean',
      last_name: 'Dupont',
      tags: [
        {
          code: 'adherent_2025',
          label: 'Adhérent 2025',
          type: UserTagEnum.ADHERENT
        }
      ],
      age: 30
    },
    visit_day: 'Weekend à Arras',
    transport: 'Train',
    accommodation: 'Chambre double'
  },
  'TICKET_002': {
    uuid: 'exemple_uuid_002',
    status: {
      code: 'valid',
      subtitle: 'Accès autorisé'
    },
    type: {
      color: '#eab308',
      label: 'Accès B'
    },
    user: {
      public_id: 'user_002',
      avatar_url: 'https://example.com/avatar2.jpg',
      civility: 'Mme',
      first_name: 'Marie',
      last_name: 'Martin',
      tags: [
        {
          code: 'adherent_2025',
          label: 'Adhérent 2025',
          type: UserTagEnum.ADHERENT
        }
      ],
      age: 28
    },
    visit_day: 'Weekend à Arras',
    transport: 'Voiture',
    accommodation: 'Chambre simple'
  },
  'TICKET_003': {
    uuid: 'exemple_uuid_003',
    status: {
      code: 'invalid',
      subtitle: 'Ticket invalide'
    },
    alert: 'Ce ticket n\'est pas valide pour cet événement',
    user: {
      public_id: 'user_003',
      first_name: 'Paul',
      last_name: 'Durand',
      age: 35
    }
  },
  'TICKET_004': {
    uuid: 'exemple_uuid_004',
    status: {
      code: 'already_scanned',
      subtitle: 'Déjà scanné'
    },
    type: {
      color: '#f59e0b',
      label: 'Accès C'
    },
    alert: 'Ce ticket a déjà été scanné aujourd\'hui',
    user: {
      public_id: 'user_004',
      first_name: 'Sophie',
      last_name: 'Bernard',
      tags: [
        {
          code: 'elu_2025',
          label: 'Élu(e) 2025',
          type: UserTagEnum.ELU
        }
      ],
      age: 32
    },
    scanHistory: [
      {
        date: new Date().toISOString(),
        name: 'Sophie Bernard',
        public_id: 'user_004'
      }
    ]
  },
  'TICKET_005': {
    uuid: 'exemple_uuid_005',
    status: {
      code: 'valid',
      subtitle: 'Accès autorisé'
    },
    type: {
      color: '#eab308',
      label: 'Accès B'
    },
    user: {
      public_id: 'user_005',
      first_name: 'Marc',
      last_name: 'Dubois',
      tags: [
        {
          code: 'sympathisant_2025',
          label: 'Sympathisant 2025',
          type: UserTagEnum.SYMPATHISANT
        }
      ],
      age: 27
    },
    visit_day: 'Weekend à Arras',
    transport: 'Covoiturage',
    accommodation: 'Tente'
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
    uuid: qrCodeId,
    status: {
      code: 'unknown',
      subtitle: 'Ticket inconnu'
    },
    type: {
      color: '#6b7280',
      label: 'Ticket inconnu'
    },
    alert: 'Ce ticket n\'est pas reconnu dans notre système'
  }
}