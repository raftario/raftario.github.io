import { type Highlight, highlight } from "@raftario/highlight"

import styles from "./Highlight.module.scss"

function Inner({ highlight }: { highlight: Highlight }) {
  return (
    <span
      className={highlight.name
        .split(".")
        .map((c) => styles[c] ?? c)
        .join(" ")}
    >
      {highlight.children.map((item, i) =>
        typeof item === "string" ? item : <Inner key={i} highlight={item} />,
      )}
    </span>
  )
}

interface Props {
  src: string
  lang: string
}
export default function Highlight({ src, lang }: Props) {
  return (
    <pre className={styles.code}>
      {highlight(src, lang).map((item, i) =>
        typeof item === "string" ? item : <Inner key={i} highlight={item} />,
      )}
    </pre>
  )
}
