import StreamingMessage from './StreamingMessage'

type Props = {
  streamedContent: string
}

export function LoadingMessage({ streamedContent }: Props) {
  return <StreamingMessage content={streamedContent} />
}

export default LoadingMessage
