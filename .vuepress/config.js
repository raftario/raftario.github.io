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
};
