const remarkMath = require("remark-math");
const rehypeKatex = require("rehype-katex");

const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
});

module.exports = {
  reactStrictMode: true,
  ...withMDX({
    pageExtensions: ["ts", "tsx", "md", "mdx"],
  }),
};
