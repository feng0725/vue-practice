<!--课程订单-->
<template>
    <div class="all-height">
        <keep-alive  include="course-order">
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
