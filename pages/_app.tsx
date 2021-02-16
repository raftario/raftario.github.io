import { AppProps } from "next/app";

import { DefaultSeo } from "next-seo";
import { MDXProvider, MDXProviderComponents } from "@mdx-js/react";

import P from "components/blog/p";
import A from "components/blog/a";
import Img from "components/blog/img";
import Blockquote from "components/blog/blockquote";
import Heading from "components/blog/heading";
import Table from "components/blog/table";
import List from "components/blog/list";
import HR from "components/blog/hr";
import Code from "components/blog/code";

import "tailwindcss/tailwind.css";
import "katex/dist/katex.css";
import "../styles/fonts.css";

const components: MDXProviderComponents = {
  p: P,
  a: A,
  img: Img,
  blockquote: Blockquote,
  h1: Heading.H1,
  h2: Heading.H2,
  h3: Heading.H3,
  h4: Heading.H4,
  h5: Heading.H5,
  h6: Heading.H6,
  table: Table.Table,
  th: Table.TH,
  td: Table.TD,
  ul: List.UL,
  ol: List.OL,
  hr: HR,
  inlineCode: Code.InlineCode,
  code: Code.CodeBlock,
  pre: Code.CodeContainer,
};

const App = ({ Component, pageProps }: AppProps) => (
  <>
    <DefaultSeo
      openGraph={{
        type: "website",
        locale: "en_CA",
        url: "https://raftar.io",
        site_name: "Raphaël Thériault",
      }}
      twitter={{
        handle: "@raftario",
      }}
    />
    <MDXProvider components={components}>
      <Component {...pageProps} />
    </MDXProvider>
  </>
);
export default App;
