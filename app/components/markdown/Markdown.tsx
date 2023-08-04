import Link from "next/link"
import ReactMarkdown from "react-markdown"
import { type HeadingProps } from "react-markdown/lib/ast-to-react"
import { type PluggableList } from "react-markdown/lib/react-markdown"
import rehypeSlug from "rehype-slug"
import remarkGfm from "remark-gfm"
import remarkToc from "remark-toc"

import ClickCopy from "../util/ClickCopy"
import Highlight from "./Highlight"
import styles from "./Markdown.module.scss"

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6
function Heading({
  level,
  id,
  children,
  ...props
}: HeadingProps & { level: HeadingLevel }) {
  const Tag = `h${level}` as const
  const href = `#${id ?? ""}` as const
  return (
    <Tag id={id} {...props}>
      <a href={href}>{children}</a>
    </Tag>
  )
}

interface Props {
  children: string
  toc?: boolean
}
export default function Markdown({ children, toc }: Props) {
  const plugins: PluggableList = [remarkGfm]
  if (toc) {
    plugins.push(remarkToc)
  }

  return (
    <ReactMarkdown
      className={styles.md}
      remarkPlugins={plugins}
      rehypePlugins={[rehypeSlug]}
      components={{
        a: ({ href, children, ...props }) =>
          href && !href.startsWith("#") ? (
            <Link {...props} href={href}>
              {children}
            </Link>
          ) : (
            <a {...props} href={href}>
              {children}
            </a>
          ),
        code: ({ inline, className, children, ...props }) => {
          const lang = /language-(\w+)/.exec(className ?? "")?.[1] ?? null
          const src = Array.isArray(children) ? children.join("") : children

          return !inline && lang ? (
            <>
              <Highlight src={src} lang={lang} />
              <ClickCopy text={src} title={false}>
                <span className={styles.copy}>copy</span>
              </ClickCopy>
            </>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          )
        },
        h1: (props) => <Heading {...props} level={1} />,
        h2: (props) => <Heading {...props} level={2} />,
        h3: (props) => <Heading {...props} level={3} />,
        h4: (props) => <Heading {...props} level={4} />,
        h5: (props) => <Heading {...props} level={5} />,
        h6: (props) => <Heading {...props} level={6} />,
      }}
    >
      {children}
    </ReactMarkdown>
  )
}
