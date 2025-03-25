import { z } from 'zod'
import * as schemas from './schema'

export const parseJsonEditorContent = (x: string): { content: schemas.TipTapDocument; type: 'json' } | { content: string; type: 'string' } => {
  try {
    const json = JSON.parse(x)
    return {
      content: schemas.tipTapDocumentSchema.parse(json),
      type: 'json',
    }
  } catch (e) {
    return {
      content: x,
      type: 'string',
    }
  }
}

export function isTipMark(obj: unknown): obj is schemas.TipMark {
  return schemas.markSchema.safeParse(obj).success
}

export function isTipText(obj: unknown): obj is schemas.TipText {
  return schemas.textSchema.safeParse(obj).success
}

export function isTipParagraph(obj: unknown): obj is schemas.TipParagraph {
  return schemas.paragraphSchema.safeParse(obj).success
}

export function isTipListItem(obj: unknown): obj is schemas.TipListItem {
  return schemas.listItemSchema.safeParse(obj).success
}

export function isTipOrderedList(obj: unknown): obj is schemas.TipOrderedList {
  return schemas.orderedListSchema.safeParse(obj).success
}

export function isTipBulletList(obj: unknown): obj is schemas.TipBulletList {
  return schemas.bulletListSchema.safeParse(obj).success
}

export function isTipTapDocument(obj: unknown): obj is schemas.TipTapDocument {
  return schemas.tipTapDocumentSchema.safeParse(obj).success
}

export function isTipHardBreak(obj: unknown): obj is schemas.TipHardBreak {
  return schemas.hardBreakSchema.safeParse(obj).success
}

export function isTipNonSupported(obj: unknown): obj is schemas.TipNonSupported {
  return z
    .object({
      type: z.literal('non_supported'),
    })
    .safeParse(obj).success
}

export function isTipLinkMark(obj: unknown): obj is schemas.TipLinkMark {
  return schemas.linkMarkSchema.safeParse(obj).success
}
