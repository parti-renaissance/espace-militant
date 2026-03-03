import { create } from 'zustand'
import { BuildingSelectedParams, DoorToDoorAddress } from '@/core/entities/DoorToDoor'

type DoorToDoorStore = {
  address: DoorToDoorAddress | null
  setAddress: (campaign: DoorToDoorAddress) => void
}

export const useDoorToDoorStore = create<DoorToDoorStore>((set) => ({
  address: null,
  setAddress: (x: DoorToDoorAddress) => set({ address: x }),
}))

interface Tunnel {
  campaignId: string
  buildingParams: BuildingSelectedParams
  canCloseFloor: boolean
}

type DoorToDoorTunnelStore = {
  tunnel: Tunnel | null
  setTunnel: (tunnel: Tunnel) => void
}

export const useDtdTunnelStore = create<DoorToDoorTunnelStore>((set) => ({
  tunnel: null,
  setTunnel: (x: Tunnel) => set({ tunnel: x }),
}))
