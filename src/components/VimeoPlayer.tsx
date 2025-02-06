'use dom'

export default function DOMComponent(props: { url: string; dom: import('expo/dom').DOMProps }) {
  return <iframe width="100%" height="315" src={props.url} frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen></iframe>
}
