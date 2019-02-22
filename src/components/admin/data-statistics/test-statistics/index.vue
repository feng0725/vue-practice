<template>
    <div class="all-height">
        <keep-alive include="test-statistics">
            <router-view/>
        </keep-alive>
    </div>
</template>

<script>
export default {
    name: 'index',
    data() {
        return {};
    },
    mounted() {},
    methods: {}
};
</script>

<style scoped>
</style>
