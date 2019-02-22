<template>
    <div id="app">
        <transition
            mode="out-in"
            enter-active-class="animated fadeIn"
            leave-active-class="animated fadeOut">
            <router-view/>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'App',
    watch: {
        $route(e) {
            document.title = this.$route.meta.title || '友看培训平台';
        }
    }
};
</script>

<style lang="stylus">
    #app
        height: 100%;
</style>
