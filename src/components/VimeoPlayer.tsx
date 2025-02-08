'use dom'

export default function VimeoPlayer(props: { url: string; height: number; dom?: import('expo/dom').DOMProps }) {
  return (
    <iframe
      style={{
        overflow: 'hidden',
      }}
      width="100%"
      height={props.height}
      src={props.url}
      frameBorder="0"
      referrerPolicy="strict-origin-when-cross-origin"
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
      scrolling="no"
    ></iframe>
  )
}
