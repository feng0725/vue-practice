<template>
    <div class="courseSummary edit-new">
        <header>
            <router-link class="icon-box" tag="div" to="/courseManagement/review">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-left"></use>
                </svg>
            </router-link>
            <div class="title">
                审核课程
            </div>
        </header>
        <div class="wrapper clearfix">
            <div class="title">
                <Steps size="small" :current="2">
                    <Step title="课程基本信息" content=""></Step>
                    <Step title="课程小节" content=""></Step>
                    <Step title="课程介绍" content=""></Step>
                    <Step title="教师介绍" content=""></Step>
                </Steps>

            </div>
            <div class="">
                <Editor ref="edit" :defaultMsg="courseMsg.courseIntroduction" height="400px"></Editor>
            </div>
            <div class="btn-box fl">
                <Button class="btn fr" type="primary" @click="next">下一步</Button>
                <Button class="btn fr" @click="$router.back()" type="primary">上一步</Button>
            </div>
        </div>
    </div>

</template>

<script>
import { storage } from '../../../../../common/js/qylh';

export default {
    name: 'addCourse',
    computed: {
    },
    data() {
        return {
            courseMsg: storage.get('courseMsg')
        };
    },
    mounted() {
    },
    methods: {
        next() {
            this.save()
            this.$router.push({
                path: '/courseManagement/review/teacherIntroduction',
                query: {
                    id: this.$route.query.id
                }
            });
        },
        save() {
            this.courseMsg.courseIntroduction = this.getCon();
            storage.set('courseMsg', this.courseMsg);
        },
        getCon() {
            return this.$refs.edit.getUEContent()
        },
        setCon() {
            this.$refs.edit.setContent(this.courseMsg.courseIntroduction);
        }
    }
};
</script>

<style scoped lang="stylus">
    header
        margin-bottom: 12px;
        position: relative;
        .icon-box
            position: absolute;
            left: 0;
            top: 0;
            width 70px;
            height: 50px;
            line-height: 50px;
            background-color: #f8f8f8;
            text-align: center;
            cursor: pointer;
            svg
                width: 22px;
                height: 18px;
                cursor: pointer;
                color: #117dd6;

        .title
            background-color: #fff;
            margin-left: 70px;
            height: 50px;
            line-height: 50px;
            text-indent: 2em;

    .wrapper
        position: relative;
        width: 1150px;
        min-height: 500px;
        padding: 20px;
        background-color: #fff;
        margin: 0 auto;
        h4
            margin: 15px 0;
            margin-left: 8px;
        .title
            padding-bottom: 15px;
            border-bottom: 1px solid #e6e8ee;

        .btn-box
            width: 100%;
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #e6e8ee;
            .btn
                width: 115px;
                margin-right:20px;



</style>
<style lang="stylus">

</style>
