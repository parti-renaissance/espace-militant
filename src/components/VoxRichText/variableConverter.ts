import { RestAvailableVariable } from '@/services/publications/schema'

type TipTapNode = {
  type: string
  content?: TipTapNode[]
  text?: string
  marks?: Array<{
    type: string
    attrs?: Record<string, unknown>
  }>
  attrs?: Record<string, unknown>
}

/**
 * Removes all variable marks from content and replaces text with the code value
 * (used when variables are not enabled or not loaded)
 */
export function removeVariableMarks(json: unknown): unknown {
  if (!json || typeof json !== 'object') {
    return json
  }

  const node = json as TipTapNode

  // If it's a text node with a variable mark, extract the code and use it as text
  if (node.type === 'text' && node.marks) {
    const variableMark = node.marks.find((mark) => mark.type === 'variable')
    if (variableMark && variableMark.attrs) {
      const code = variableMark.attrs.code as string
      if (code) {
        // Replace the text with the code and remove the variable mark
        const otherMarks = node.marks.filter((mark) => mark.type !== 'variable')
        return {
          ...node,
          text: code,
          marks: otherMarks.length > 0 ? otherMarks : undefined,
        }
      }
    }
    // If no code found, just remove the variable marks
    const filteredMarks = node.marks.filter((mark) => mark.type !== 'variable')
    return {
      ...node,
      marks: filteredMarks.length > 0 ? filteredMarks : undefined,
    }
  }

  // Recursively process content
  if (node.content && Array.isArray(node.content)) {
    return {
      ...node,
      content: node.content.map((child) => removeVariableMarks(child)),
    }
  }

  return node
}

/**
 * Converts storage JSON (with variable marks) to editor JSON (with text tokens)
 */
export function convertStorageToEditor(
  json: unknown,
  availableVariables: RestAvailableVariable[]
): unknown {
  if (!json || typeof json !== 'object') {
    return json
  }

  const node = json as TipTapNode

  // If it's a text node with a variable mark, convert it to plain text token
  if (node.type === 'text' && node.marks) {
    const variableMark = node.marks.find((mark) => mark.type === 'variable')
    if (variableMark && variableMark.attrs) {
      const code = variableMark.attrs.code as string
      if (code) {
        // Replace the text with the token and remove the variable mark
        const otherMarks = node.marks.filter((mark) => mark.type !== 'variable')
        return {
          ...node,
          text: code,
          marks: otherMarks.length > 0 ? otherMarks : undefined,
        }
      }
    }
  }

  // Recursively process content
  if (node.content && Array.isArray(node.content)) {
    return {
      ...node,
      content: node.content.map((child) => convertStorageToEditor(child, availableVariables)),
    }
  }

  return node
}

/**
 * Helper function to split a text node containing variable tokens into multiple text nodes
 */
function splitTextNodeWithVariables(
  node: TipTapNode,
  availableVariables: RestAvailableVariable[]
): TipTapNode[] {
  if (!node.text) return [node]

  const text = node.text
  const variableTokenRegex = /\{\{([^}]+)\}\}/g
  const matches = Array.from(text.matchAll(variableTokenRegex))

  if (matches.length === 0) {
    return [node]
  }

  // Build a map of available variables by code
  const variablesMap = new Map<string, RestAvailableVariable>()
  availableVariables.forEach((variable) => {
    variablesMap.set(variable.code, variable)
  })

  // Process matches and build new content
  const newContent: TipTapNode[] = []
  let lastIndex = 0

  matches.forEach((match) => {
    const fullMatch = match[0] // e.g., "{{Prénom}}"
    const matchIndex = match.index ?? 0

    // Add text before the match
    if (matchIndex > lastIndex) {
      const beforeText = text.substring(lastIndex, matchIndex)
      if (beforeText) {
        newContent.push({
          type: 'text',
          text: beforeText,
          marks: node.marks,
        })
      }
    }

    // Check if this token matches an available variable
    const variable = variablesMap.get(fullMatch)
    if (variable) {
      // Create a text node with variable mark
      newContent.push({
        type: 'text',
        text: variable.label,
        marks: [
          ...(node.marks || []),
          {
            type: 'variable',
            attrs: {
              code: variable.code,
            },
          },
        ],
      })
    } else {
      // Unknown token, keep as plain text
      newContent.push({
        type: 'text',
        text: fullMatch,
        marks: node.marks,
      })
    }

    lastIndex = matchIndex + fullMatch.length
  })

  // Add remaining text after last match
  if (lastIndex < text.length) {
    const afterText = text.substring(lastIndex)
    if (afterText) {
      newContent.push({
        type: 'text',
        text: afterText,
        marks: node.marks,
      })
    }
  }

  return newContent.length > 0 ? newContent : [node]
}

/**
 * Converts editor JSON (with text tokens) to storage JSON (with variable marks)
 */
export function convertEditorToStorage(
  json: unknown,
  availableVariables: RestAvailableVariable[]
): unknown {
  if (!json || typeof json !== 'object') {
    return json
  }

  const node = json as TipTapNode

  // Recursively process content first (bottom-up approach)
  if (node.content && Array.isArray(node.content)) {
    const processedContent: TipTapNode[] = []
    
    for (const child of node.content) {
      // If it's a text node, split it if it contains variables
      if (child.type === 'text' && child.text) {
        const splitNodes = splitTextNodeWithVariables(child, availableVariables)
        processedContent.push(...splitNodes)
      } else {
        // Recursively process non-text nodes
        const processed = convertEditorToStorage(child, availableVariables) as TipTapNode
        processedContent.push(processed)
      }
    }

    return {
      ...node,
      content: processedContent,
    }
  }

  // If it's a text node at the root level (shouldn't happen in normal TipTap structure)
  if (node.type === 'text' && node.text) {
    const splitNodes = splitTextNodeWithVariables(node, availableVariables)
    return splitNodes.length === 1 ? splitNodes[0] : splitNodes
  }

  return node
}

