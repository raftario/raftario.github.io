import * as fs from "node:fs/promises"
import * as path from "node:path"

import matter from "gray-matter"
import { z } from "zod"

export async function getPosts() {
  const dir = path.join(process.cwd(), "blog")
  const files = await fs.readdir(dir, { withFileTypes: true })
  return files
    .filter((file) => file.isFile() && file.name.endsWith(".md"))
    .map((file) => ({ slug: file.name.slice(0, -3) }))
}

export async function getPost(slug: string) {
  const file = path.join(process.cwd(), "blog", `${slug}.md`)
  const raw = await fs.readFile(file, "utf8")
  const { content, data } = matter(raw)

  const meta = z.object({
    title: z.string(),
    published: z.date(),
    modified: z.date().optional(),
    authors: z.array(z.string()).optional().default(["Raphaël Thériault"]),
    tags: z.array(z.string()).optional().default([]),
    toc: z.boolean().optional().default(false),
  })

  return {
    content: content.trim(),
    meta: meta.parse(data),
  }
}
