import Document, { Html, Head, Main, NextScript } from "next/document";

class D extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link
            rel="preload"
            href="/fonts/open-sans.woff2"
            as="font"
            crossOrigin=""
          />
          <link
            rel="preload"
            href="/fonts/raleway-500.woff2"
            as="font"
            crossOrigin=""
          />
        </Head>
        <body className="bg-base3 text-base00 font-body text-base leading-relaxed break-words">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
export default D;
