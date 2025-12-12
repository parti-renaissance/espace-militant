export type RichTextContent = {
  html: string
  pure: string
  json: string
}

export type EditorRef = {
  getData: () => Promise<{
    html: string
    pure: string
    json: object
  }>
  focus?: () => void
}

