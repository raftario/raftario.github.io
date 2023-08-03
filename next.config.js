/** @type {import('next').NextConfig} */
module.exports = {
  output: "export",
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.externals.push({
      "@raftario/highlight": "commonjs @raftario/highlight",
    })
    return config
  },
}
