<template>
    <div class="all-height">
        <keep-alive  include="courseIndex">
            <router-view/>
        </keep-alive>
    </div>
</template>

<script>
export default {
    name: 'course',
    data() {
        return {};
    },
    mounted() {},
    methods: {}
};
</script>

<style scoped>
</style>
