import "./layout.scss"

import { Montserrat } from "next/font/google"
import localFont from "next/font/local"

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
})
const iosevka = localFont({
  src: "../fonts/iosevka-regular.woff2",
  variable: "--font-iosevka",
})
const iosevkaAile = localFont({
  src: "../fonts/iosevka-aile-regular.woff2",
  variable: "--font-iosevka-aile",
})

const fonts = [
  montserrat.variable,
  iosevka.variable,
  iosevkaAile.variable,
].join(" ")

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={fonts}>
      <head />
      <body>{children}</body>
    </html>
  )
}
