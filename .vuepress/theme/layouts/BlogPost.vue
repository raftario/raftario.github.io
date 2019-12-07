<template>
    <div>
        <div class="header">
            <div class="container">
                <p class="date">
                    {{ date }}
                </p>
                <h1>{{ this.$page.title }}</h1>
                <p>
                    {{ this.$page.frontmatter.subtitle }}
                </p>
            </div>
        </div>
        <div class="container">
            <Content />
            <component :is="btt" v-if="btt"></component>
        </div>
    </div>
</template>

<script>
export default {
    computed: {
        date: function() {
            return new Date(this.$page.frontmatter.date).toDateString();
        },
    },
};
</script>
