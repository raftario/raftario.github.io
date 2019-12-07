<template>
    <div>
        <div class="header">
            <div class="container">
                <p class="date">
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
export default {
    computed: {
        date: function() {
            let date = new Date(
                this.$page.frontmatter.published
            ).toDateString();
            if (this.$page.frontmatter.modified) {
                date += ` | Updated ${new Date(
                    this.$page.frontmatter.modified
                ).toDateString()}`;
            }
            return date;
        },
    },
};
</script>
