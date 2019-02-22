<template>
    <div class="userGroup">
        <keep-alive include="user">
            <router-view/>
        </keep-alive>
    </div>

</template>

<script>
export default {
    name: 'user',
    data() {
        return {};
    },
    mounted() {},
    methods: {}
};
</script>

<style scoped lang="stylus">
    .userGroup
        height: 100%;
        background: #f2f2f2;
</style>
