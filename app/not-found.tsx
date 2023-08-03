import Image from "next/image"

import notFound from "./not-found.gif"
import styles from "./not-found.module.scss"

export default function NotFound() {
  return (
    <div className={styles.root}>
      <Image src={notFound} alt="404 not found" />
    </div>
  )
}
