<template>
    <div>
        <div class="header">
            <div class="container">
                <h1>{{ this.$page.title }}</h1>
            </div>
        </div>
        <div class="container">
            <div v-for="(p, i) in posts" :key="p.frontmatter.date">
                <p class="date">{{ parseDate(p.frontmatter.date) }}</p>
                <h3>
                    <a class="heading-link" :href="p.path">{{ p.title }}</a>
                </h3>
                <p>{{ p.frontmatter.subtitle }}</p>
                <hr v-if="i < posts.length - 1" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    computed: {
        posts: function() {
            return this.$site.pages
                .filter(
                    (p) =>
                        p.path.startsWith("/blog/") &&
                        p.path.length > "/blog/".length
                )
                .sort(
                    (a, b) =>
                        Date.parse(b.frontmatter.date) -
                        Date.parse(a.frontmatter.date)
                );
        },
    },
    methods: {
        parseDate: function(date) {
            return new Date(date).toDateString();
        },
    },
};
</script>
