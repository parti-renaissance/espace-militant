import { TipTapRenderer } from '@/components/TipTapRenderer'

const EventMDXRenderer = ({ children }: { children: string }) => {
  return <TipTapRenderer content={children} />
}

export default EventMDXRenderer
