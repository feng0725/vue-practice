<template>
    <div class="courseSummary edit-new">
        <header>
            <router-link class="icon-box" tag="div" to="/courseManagement/course">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-left"></use>
                </svg>
            </router-link>
            <div class="title">
                {{status}}课程
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
                <Button v-if="courseMsg.draftStatus"  class="btn fr white-blue" @click="saveDraft" type="primary">保存草稿</Button>
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
            status: '新建',
            courseMsg: storage.get('courseMsg')
        };
    },
    mounted() {
        if (this.$route.query.id) {
            this.status = '编辑';
        }
        if (!this.courseMsg) {
            this.$router.push({
                path: '/courseManagement/course'
            });
        }
    },
    methods: {
        next() {
            this.save();
            this.$router.push({
                path: '/courseManagement/course/teacherIntroduction',
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
            return this.$refs.edit.getUEContent();
        },
        setCon() {
            this.$refs.edit.setContent(this.courseMsg.courseIntroduction);
        },
        saveDraft() {
            this.courseMsg.courseStatus = '0';
            this.save();
            if (this.$route.query.id) {
                this.$fetch({
                    url: '/system-backend/courseBack/updateCourse',
                    data: {
                        courseId: this.$route.query.id,
                        sectionList: JSON.stringify(storage.get('sectionList')) || [],
                        courseMsg: JSON.stringify(storage.get('courseMsg')) || {},
                        appList: JSON.stringify(storage.get('appList')) || [],
                        groupList: JSON.stringify(storage.get('groupList')) || []
                    }
                }).then((res) => {
                    if (res.code == 200) {
                        storage.remove('sectionList');
                        storage.remove('courseMsg');
                        storage.remove('appList');
                        storage.remove('groupList');
                        this.$Message.success(res.msg);
                        this.$router.push({
                            path: '/courseManagement/course'
                        });
                    }
                });
            } else {
                this.$fetch({
                    url: '/system-backend/courseBack/insertCourse',
                    data: {
                        sectionList: JSON.stringify(storage.get('sectionList')) || [],
                        courseMsg: JSON.stringify(storage.get('courseMsg')) || {},
                        appList: JSON.stringify(storage.get('appList')) || [],
                        groupList: JSON.stringify(storage.get('groupList')) || []
                    }
                }).then((res) => {
                    if (res.code == 200) {
                        storage.remove('sectionList');
                        storage.remove('courseMsg');
                        storage.remove('appList');
                        storage.remove('groupList');
                        this.$Message.success(res.msg);
                        this.$router.push({
                            path: '/courseManagement/course'
                        });
                    }
                });
            }
        }
    }
};
</script>

<style scoped lang="stylus">

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
