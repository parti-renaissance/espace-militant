export function htmlToMarkdown(content: string): string {
  return content
    .replace(/<\s*ol[^>]*>([\s\S]*?)<\s*\/\s*ol\s*>/gi, (_, inner: string) => `\n${inner.replace(/<\s*li\s*>([\s\S]*?)<\s*\/\s*li\s*>/gi, '1. $1\n')}\n`)
    .replace(/<\s*ul[^>]*>([\s\S]*?)<\s*\/\s*ul\s*>/gi, (_, inner: string) => `\n${inner.replace(/<\s*li\s*>([\s\S]*?)<\s*\/\s*li\s*>/gi, '- $1\n')}\n`)
    .replace(/<\s*li\s*>([\s\S]*?)<\s*\/\s*li\s*>/gi, '- $1\n')
    .replace(/<\s*h([1-6])\s*>([\s\S]*?)<\s*\/\s*h\1\s*>/gi, (_, level, text) => {
      const hashes = '#'.repeat(parseInt(level, 10))
      return `\n\n${hashes} ${text.trim()}\n\n`
    })
    .replace(/<\s*a\s+[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\s*\/\s*a\s*>/gi, '[$2]($1)')
    .replace(/<\s*pre\s*>\s*<\s*code\s*>([\s\S]*?)<\s*\/\s*code\s*>\s*<\s*\/\s*pre\s*>/gi, '\n```\n$1\n```\n')
    .replace(/<\s*code\s*>([\s\S]*?)<\s*\/\s*code\s*>/gi, '`$1`')
    .replace(/<\s*br\s*\/?\s*>/gi, '\n')
    .replace(/<\s*\/?\s*p\s*>/gi, '\n\n')
    .replace(/<\s*(b|strong)\s*>([\s\S]*?)<\s*\/\s*\1\s*>/gi, '**$2**')
    .replace(/<\s*(i|em)\s*>([\s\S]*?)<\s*\/\s*\1\s*>/gi, '*$2*')
    .replace(/<\s*u\s*>([\s\S]*?)<\s*\/\s*u\s*>/gi, '$1')
}
