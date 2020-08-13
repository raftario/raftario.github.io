<template>
    <div>
        <div class="header">
            <div class="container">
                <p class="date">
                    <a href="/" class="date-link">{{ this.$site.title }}</a>
                    <ChevronsRightIcon size="16" />
                    <a href="/blog/" class="date-link">Blog</a>
                    <ChevronsRightIcon size="16" />
                    {{ date }}
                </p>
                <h1>{{ this.$page.title }}</h1>
                <p>
                    {{ this.$page.frontmatter.description }}
                </p>
            </div>
        </div>
        <div class="container">
            <Content />
        </div>
    </div>
</template>

<script>
import { ChevronsRightIcon } from "vue-feather-icons";
import moment from "moment";
export default {
    components: { ChevronsRightIcon },
    computed: {
        date: function () {
            return moment(this.$page.frontmatter.date).format("YYYY/MM/DD");
        },
    },
};
</script>
