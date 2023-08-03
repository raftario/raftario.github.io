import { getPost } from "./util"

export default async function Head({ params }: { params: { slug: string } }) {
  const { meta } = await getPost(params.slug)
  return (
    <>
      <title>{meta.title}</title>
      <meta charSet="utf-8" />
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <link rel="icon" href="/favicon.ico" />
    </>
  )
}
