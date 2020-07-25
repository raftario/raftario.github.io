<template>
    <div>
        <div class="header">
            <div class="container">
                <h1>
                    <a class="heading-link" href="/">{{ this.$site.title }}</a>
                    <ChevronsRightIcon size="32" />
                    {{ this.$page.title }}
                </h1>
            </div>
        </div>
        <div class="container">
            <div v-for="(p, i) in posts" :key="p.title">
                <p class="date">{{ parseDate(p.frontmatter.published) }}</p>
                <h3>
                    <a class="heading-link" :href="p.path">{{ p.title }}</a>
                </h3>
                <p>{{ p.frontmatter.description }}</p>
                <hr v-if="i < posts.length - 1" />
            </div>
        </div>
    </div>
</template>

<script>
import { ChevronsRightIcon } from "vue-feather-icons";
import moment from "moment";
export default {
    components: { ChevronsRightIcon },
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
                        Date.parse(b.frontmatter.published) -
                        Date.parse(a.frontmatter.published)
                );
        },
    },
    methods: {
        parseDate: function(date) {
            return moment(date).format("YYYY/MM/DD");
        },
    },
};
</script>
