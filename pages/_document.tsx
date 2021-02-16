import Document, { Html, Head, Main, NextScript } from "next/document";

class D extends Document {
  render() {
    return (
      <Html>
        <Head />
        <body className="bg-base3 text-base00 font-body text-base">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
export default D;
