import { MyRenderer } from './EventForm/DescriptionInput'

const EventMDXRenderer = ({ children }: { children: string }) => {
  return <MyRenderer value={children} matchContent />
}

export default EventMDXRenderer
