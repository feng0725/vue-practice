<template>
    <div class="class-list">
        <Input class="search" search enter-button placeholder="输入课程名称" />
        <p>课程列表 <span class="fr">共110项,已选{{disabledGroup.length}}项</span></p>
        <div class="check-box">
            <CheckboxGroup v-model="disabledGroup">
                <Checkbox label="香蕉"></Checkbox>
                <Checkbox label="苹果"></Checkbox>
                <Checkbox label="西瓜"></Checkbox>
            </CheckboxGroup>
        </div>
    </div>
</template>

<script>
export default {
    name: 'class-list',
    data() {
        return {
            disabledGroup:[],
        };
    },
    mounted() {},
    methods: {}
};
</script>

<style scoped lang="stylus">
    .class-list
        .search
                margin-bottom: 15px;
        p
            margin-bottom: 5px;
        .check-box
            height: 300px;
            border: 1px solid #E6E8EE;
        .ivu-checkbox-wrapper
            display: block
            height: 45px;
            line-height: 45px;
            border-bottom: 1px solid #E6E8EE;
        .ivu-checkbox
            margin: 0 10px;
</style>
<style lang="stylus">
    .class-list
        .ivu-checkbox
             margin: 0 10px;
        .ivu-input
            background-color: #fff
        .ivu-checkbox-wrapper
             span:last-child
                margin-left: 100px;
</style>
