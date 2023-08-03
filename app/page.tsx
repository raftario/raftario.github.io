import Link from "next/link"

import styles from "./page.module.scss"

export default function Index() {
  return (
    <div className={styles.root}>
      <main>
        <h1>Raphaël Thériault</h1>
        <span>this is my website</span>
        <nav className={styles.links}>
          <Link href="about">about</Link>
          <Link href="pronouns">pronouns</Link>
          <Link href="tools">tools</Link>
          <Link href="blog">blog</Link>
          <Link href="https://github.com/raftario">github</Link>
          <Link href="https://bsky.app/profile/raftar.io">bluesky</Link>
          <Link href="https://last.fm/user/raftario">last.fm</Link>
        </nav>
      </main>
    </div>
  )
}
