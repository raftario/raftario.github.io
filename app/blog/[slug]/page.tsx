import Markdown from "@/app/components/markdown/Markdown"

import styles from "./page.module.scss"
import { getPost, getPosts } from "./util"

export async function generateStaticParams() {
  return await getPosts()
}

export default async function BlogPost({
  params,
}: {
  params: { slug: string }
}) {
  const { meta, content } = await getPost(params.slug)
  return (
    <main className={styles.root}>
      <h1>{meta.title}</h1>
      <Markdown toc={meta.toc}>{content}</Markdown>
    </main>
  )
}
