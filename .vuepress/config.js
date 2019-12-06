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
    ],
    markdown: {
        anchor: {
            permalink: false,
        },
    },
    chainMarkdown(config) {
        const { PLUGINS } = require("@vuepress/markdown");
        const originalLinkPlugin = require("@vuepress/markdown/lib/link.js");

        config.plugins.delete(PLUGINS.CONVERT_ROUTER_LINK);

        const linkPlugin = function(md) {
            const result = originalLinkPlugin.apply(this, arguments);
            const close = md.renderer.rules.link_close;
            md.renderer.rules.link_close = function() {
                return close
                    .apply(this, arguments)
                    .replace("<OutboundLink/>", "");
            };
            return result;
        };

        config.plugin(PLUGINS.CONVERT_ROUTER_LINK).use(linkPlugin, [
            {
                target: "_blank",
                rel: "noopener noreferrer",
            },
        ]);
    },
};
