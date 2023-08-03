export interface Highlight {
  name: string
  children: (Highlight | string)[]
}
export function highlight(src: string, lang: string): Highlight["children"]
