module.exports = {
    title: "Raphaël Thériault",
    head: [
        [
            "link",
            {
                href:
                    "https://fonts.googleapis.com/css?family=Open+Sans|Raleway:500|Source+Code+Pro&display=swap",
                rel: "stylesheet",
            },
        ],
        [
            "link",
            {
                href:
                    "https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css",
                rel: "stylesheet",
            },
        ],
        [
            "meta",
            {
                name: "theme-color",
                content: "#002b36",
            },
        ],
        [
            "meta",
            {
                property: "og:site_name",
                content: "Raphaël Thériault",
            },
        ],
    ],
    markdown: {
        anchor: {
            permalink: true,
            permalinkSpace: true,
            permalinkSymbol: "¶",
            permalinkBefore: false,
        },
    },
    plugins: {
        seo: {
            siteTitle: (_, $site) => $site.title,
            title: ($page) => $page.title,
            description: ($page) =>
                !!$page.frontmatter.description &&
                $page.frontmatter.description,
            author: ($page) =>
                (!!$page.frontmatter.author && $page.frontmatter.author) ||
                "Raphaël Thériault",
            twitterCard: () => "summary",
            type: ($page) =>
                $page.path.startsWith("/blog/") &&
                $page.path.length > "/blog/".length
                    ? "article"
                    : "website",
            url: (_, __, path) => path,
            image: () => false,
            publishedAt: ($page) =>
                !!$page.frontmatter.date && new Date($page.frontmatter.date),
        },
        mathjax: {},
    },
};
