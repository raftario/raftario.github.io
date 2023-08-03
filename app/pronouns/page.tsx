"use client"

import Image from "next/image"
import { type RefObject } from "react"

import { useDvdScreensaver } from "../screensaver"
import styles from "./page.module.scss"
import pronouns from "./pronouns.gif"

export default function About() {
  const screensaver = useDvdScreensaver({ speed: 1 })

  return (
    <div
      className={styles.root}
      ref={screensaver.containerRef as RefObject<HTMLDivElement>}
    >
      <div ref={screensaver.elementRef as RefObject<HTMLDivElement>}>
        <Image src={pronouns} alt="i use he/they/any pronouns" />
      </div>
    </div>
  )
}
