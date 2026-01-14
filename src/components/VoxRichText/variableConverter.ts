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

// Module-level regex for variable tokens
const VARIABLE_TOKEN_REGEX = /\{\{([^}]+)\}\}/g

/**
 * Converts storage JSON (with variable marks) to editor JSON (with text tokens)
 * Storage format: text = "Prénom" + mark variable.attrs.code = "{{Prénom}}"
 * Editor format: plain text with tokens {{Prénom}} (no variable marks)
 */
export function storageToEditor(json: unknown): unknown {
  if (!json || typeof json !== 'object' || json === null) {
    return json
  }

  const node = json as TipTapNode

  // If it's a text node with a variable mark, extract the code and use it as text
  if (node.type === 'text' && node.marks) {
    const variableMark = node.marks.find((mark) => mark.type === 'variable')
    if (variableMark && variableMark.attrs) {
      const code = variableMark.attrs.code as string
      if (code) {
        // Replace the text with the code (token) and remove the variable mark
        const otherMarks = node.marks.filter((mark) => mark.type !== 'variable')
        return {
          ...node,
          text: code,
          marks: otherMarks.length > 0 ? otherMarks : undefined,
        }
      }
    }
    // If no code found, just remove the variable marks
    // If code absent but text present → keep text
    // If code absent and text empty → keep empty (coherent behavior)
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
      content: node.content.map((child) => storageToEditor(child)),
    }
  }

  return node
}

/**
 * Helper function to get variable label from token using a Map for O(1) lookup
 * Extracts label from availableVariables if token matches variable.code
 * Otherwise returns token without braces (trimmed)
 */
function getVariableLabel(
  token: string,
  variablesMap: Map<string, RestAvailableVariable>
): string {
  // token is like "{{Prénom}}", find variable where code === "{{Prénom}}"
  const variable = variablesMap.get(token)
  
  if (variable) {
    return variable.label
  }
  
  // Extract content between braces as fallback label (trimmed for robustness)
  const innerMatch = token.match(/\{\{([^}]+)\}\}/)
  return innerMatch ? innerMatch[1].trim() : token
}

/**
 * Helper function to split a text node containing variable tokens into multiple text nodes
 * Converts editor format (tokens {{...}}) to storage format (marks with labels)
 */
function splitTextNodeWithVariables(
  node: TipTapNode,
  variablesMap: Map<string, RestAvailableVariable>
): TipTapNode[] {
  if (!node.text) return [node]

  const text = node.text
  // Create a new regex instance to avoid state issues with global regex
  const regex = new RegExp(VARIABLE_TOKEN_REGEX.source, VARIABLE_TOKEN_REGEX.flags)
  const matches = Array.from(text.matchAll(regex))

  if (matches.length === 0) {
    return [node]
  }

  // Process matches and build new content
  const newContent: TipTapNode[] = []
  let lastIndex = 0

  for (const match of matches) {
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

    // Get variable label using Map (O(1) lookup)
    const label = getVariableLabel(fullMatch, variablesMap)
    
    // Create a text node with variable mark
    // Storage format: text = label, mark.variable.attrs.code = token
    // Note: we don't write attrs.value (backend handles it)
    newContent.push({
      type: 'text',
      text: label,
      marks: [
        ...(node.marks || []),
        {
          type: 'variable',
          attrs: {
            code: fullMatch,
          },
        },
      ],
    })

    lastIndex = matchIndex + fullMatch.length
  }

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
 * Editor format: plain text with tokens {{Prénom}}
 * Storage format: text = "Prénom" + mark variable.attrs.code = "{{Prénom}}"
 */
export function editorToStorage(
  json: unknown,
  availableVariables: RestAvailableVariable[]
): unknown {
  if (!json || typeof json !== 'object' || json === null) {
    return json
  }

  // Build Map once for O(1) lookups (avoids O(n²) with find() in loop)
  const variablesMap = new Map(
    availableVariables.map((v) => [v.code, v])
  )

  const node = json as TipTapNode

  // Recursively process content (single pass traversal)
  if (node.content && Array.isArray(node.content)) {
    const processedContent: TipTapNode[] = []
    
    for (const child of node.content) {
      // If it's a text node, split it if it contains variables
      if (child.type === 'text' && child.text) {
        const splitNodes = splitTextNodeWithVariables(child, variablesMap)
        processedContent.push(...splitNodes)
      } else {
        // Recursively process non-text nodes
        const processed = editorToStorage(child, availableVariables) as TipTapNode
        processedContent.push(processed)
      }
    }

    return {
      ...node,
      content: processedContent,
    }
  }

  // If it's a text node at the root level (shouldn't happen in normal TipTap structure)
  // But if it does and splits into multiple nodes, wrap in doc to avoid returning array
  if (node.type === 'text' && node.text) {
    const splitNodes = splitTextNodeWithVariables(node, variablesMap)
    if (splitNodes.length === 1) {
      return splitNodes[0]
    }
    // Multiple nodes: wrap in doc to maintain valid TipTap structure
    return {
      type: 'doc',
      content: splitNodes,
    }
  }

  return node
}
