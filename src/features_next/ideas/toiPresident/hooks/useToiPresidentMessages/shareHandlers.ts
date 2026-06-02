import { TOI_PRESIDENT_SHARE_MESSAGE } from '../../config'
import { stripBase64Prefix } from '../../utils'

import { DEFAULT_IMAGE_MIME, SHARE_FILE_NAME } from './constants'
import type { Handler, Msg } from './types'

export const shareProfile: Handler<Msg<'SHARE_PROFILE'>> = (message, ctx) => {
  const text = message.payload.text ?? TOI_PRESIDENT_SHARE_MESSAGE
  const shareUrl = ctx.shareUrl && !text.includes(ctx.shareUrl) ? ctx.shareUrl : undefined
  void ctx.shareAsync({
    url: shareUrl,
    message: text,
    file: {
      base64: stripBase64Prefix(message.payload.base64),
      mimeType: message.payload.mimeType,
      fileName: SHARE_FILE_NAME,
    },
  })
}

export const shareGeneric: Handler<Msg<'share'>> = (message, ctx) => {
  void ctx.shareAsync({
    url: message.url ?? ctx.shareUrl,
    message: message.text,
    file: message.base64
      ? {
          base64: stripBase64Prefix(message.base64),
          mimeType: message.mimeType ?? DEFAULT_IMAGE_MIME,
          fileName: message.fileName ?? SHARE_FILE_NAME,
        }
      : undefined,
  })
}
