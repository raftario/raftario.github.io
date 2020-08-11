<template>
    <div>
        <div class="hero">
            <div class="center">
                <h1>Raphaël Thériault</h1>
                <div>
                    <a
                        href="https://github.com/raftario"
                        target="_blank"
                        rel="noopener noreferrer"
                        ><GithubIcon size="32"
                    /></a>
                    <a href="#"><GridIcon size="32"/></a>
                    <a href="/blog"><FeatherIcon size="32"/></a>
                </div>
            </div>
            <div class="chevrons">
                <ChevronsDownIcon size="128" />
            </div>
        </div>
        <div class="container details">
            <Content />
        </div>
    </div>
</template>

<script>
import {
    ChevronsDownIcon,
    FeatherIcon,
    GithubIcon,
    GridIcon,
} from "vue-feather-icons";
export default {
    components: { ChevronsDownIcon, FeatherIcon, GithubIcon, GridIcon },
};
</script>

<style lang="stylus" scoped>
.hero {
    background-color: $base03;
    height: 100vh;

    h1 {
        text-align: center;
    }

    h1,
    h2,
    h3,
    h4,
    h6,
    p,
    a {
        color: $base1;
    }

    a {
        margin: 0 1em 0 1em;
        &:hover {
            color: $yellow;
        }
    }

    .chevrons {
        position: relative;
        bottom: 5vh;
        color: $base02;
        text-align: center;
    }
}

.details {
    min-height: 60vh;
    padding-top: 2em;
}
</style>
