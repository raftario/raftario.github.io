import { AppProps } from "next/app";

import { DefaultSeo } from "next-seo";
import { MDXProvider } from "@mdx-js/react";

import { components } from "../config/mdx";

import "tailwindcss/tailwind.css";
import "katex/dist/katex.css";
import "../styles/fonts.css";

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
