import ClickCopy from "@/app/components/util/ClickCopy"

import styles from "./page.module.scss"

const SPECIAL: Record<number, string> = {
  0: "NUL",
  1: "SOH",
  2: "STX",
  3: "ETX",
  4: "EOT",
  5: "ENQ",
  6: "ACK",
  7: "BEL",
  8: "BS",
  9: "HT",
  10: "LF",
  11: "VT",
  12: "FF",
  13: "CR",
  14: "SO",
  15: "SI",
  16: "DLE",
  17: "DC1",
  18: "DC2",
  19: "DC3",
  20: "DC4",
  21: "NAK",
  22: "SYN",
  23: "ETB",
  24: "CAN",
  25: "EM",
  26: "SUB",
  27: "ESC",
  28: "FS",
  29: "GS",
  30: "RS",
  31: "US",
  32: "space",
  127: "DEL",
}
const PER_CHUNK = 16

export default function Ascii() {
  const ascii = Array.from({ length: 128 }, (_, i) => i).map((code) => ({
    dec: code.toString(10),
    hex: <code>{code.toString(16).padStart(2, "0")}</code>,
    bin: <code>{code.toString(2).padStart(8, "0")}</code>,
    char: SPECIAL[code] ?? <code>{String.fromCodePoint(code)}</code>,
  }))
  const chunkCount = Math.ceil(ascii.length / PER_CHUNK)
  const chunks = Array.from({ length: chunkCount }, (_, i) => i).map((i) =>
    ascii.slice(i * PER_CHUNK, (i + 1) * PER_CHUNK),
  )

  return (
    <div className={styles.tables}>
      {chunks.map((chunk, i) => (
        <table key={i}>
          <thead>
            <tr>
              <th>dec</th>
              <th>hex</th>
              <th>bin</th>
              <th>char</th>
            </tr>
          </thead>
          <tbody>
            {chunk.map((row, i) => (
              <tr key={i} className={styles.row}>
                <td>{row.dec}</td>
                <ClickCopy>
                  <td>{row.hex}</td>
                </ClickCopy>
                <ClickCopy>
                  <td>{row.bin}</td>
                </ClickCopy>
                <td>{row.char}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ))}
    </div>
  )
}
