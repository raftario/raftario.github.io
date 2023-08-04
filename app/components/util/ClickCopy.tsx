"use client"

import React from "react"

import styles from "./ClickCopy.module.scss"

function onClickCopy(e: React.MouseEvent<HTMLElement>, text?: string) {
  text ??= e.currentTarget.textContent ?? undefined
  if (!text) return

  navigator.clipboard.writeText(text).catch(console.warn)
}

interface Props {
  children: React.ReactElement<React.HTMLAttributes<HTMLElement>>
  title?: boolean
  text?: string
}
export default function ClickCopy({ children, text, title }: Props) {
  const oldOnClick = children.props.onClick
  const onClick = (e: React.MouseEvent<HTMLElement>) => {
    onClickCopy(e, text)
    oldOnClick?.(e)
  }

  const oldClassName = children.props.className ?? ""
  const className = [oldClassName, styles.clickable].join(" ")

  return React.cloneElement(children, {
    onClick,
    className,
    title: title === false ? undefined : "copy to clipboard",
  })
}
