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
                <Steps size="small" :current="3">
                    <Step title="课程基本信息" content=""></Step>
                    <Step title="课程小节" content=""></Step>
                    <Step title="课程介绍" content=""></Step>
                    <Step title="教师介绍" content=""></Step>
                </Steps>

            </div>
            <div class="">
                <Editor ref="edit" :defaultMsg="courseMsg.lecturerIntroduction" height="400px"></Editor>
            </div>
            <div class="btn-box fl">
                <Button class="btn fr" type="primary" @click="next">通过,立即上架</Button>
                <Button class="btn fr refuse"  type="primary" @click="isRefuse = true">拒绝</Button>
                <Button class="btn fr" @click="$router.back()" type="primary">上一步</Button>
            </div>
        </div>
        <MyDialog  class-name="" @ok="refuse" :title="'拒绝'" :visible.sync="isRefuse">
            <div style="">
                <Input v-model="refuseInfo" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入拒绝原因" />

            </div>
        </MyDialog>
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
            refuseInfo: '',
            isRefuse: false,
            courseMsg: storage.get('courseMsg')
        };
    },
    mounted() {
        if (this.courseMsg.lecturerIntroduction) {
            this.setCon();
        }
    },
    methods: {
        async next() {
            this.save();
            if (this.$route.query.id) {
                //  修改数据
                let res = await this.$fetch({
                    url: '/system-backend/courseBack/updateCourse',
                    data: {
                        courseId: this.$route.query.id,
                        sectionList: JSON.stringify(storage.get('sectionList')),
                        courseMsg: JSON.stringify(storage.get('courseMsg')),
                        appList: JSON.stringify(storage.get('appList')),
                        groupList: JSON.stringify(storage.get('groupList'))
                    }
                });
                if (res.code == 200) {
                    storage.remove('sectionList');
                    storage.remove('courseMsg');
                    storage.remove('appList');
                    storage.remove('groupList');
                    this.$Message.success(res.msg);

                    // 提交审核
                    this.$fetch({
                        url: '/system-backend/courseBack/courseApproved',
                        data: {
                            courseIds: this.$route.query.id
                        }
                    }).then((res) => {
                        if (res.code == 200) {
                            this.$Message.success(res.msg);
                            this.$router.push({
                                path: '/courseManagement/review'
                            });
                        } else {
                            this.$Message.error(res.msg);
                        }
                    });
                } else {
                    this.$Message.error(res.msg);
                }
            }
        },
        refuse() {
            if (this.$route.query.id) {
                this.$fetch({
                    url: '/system-backend/courseBack/courseCheckFail',
                    data: {
                        courseIds: this.$route.query.id,
                        reason: this.refuseInfo
                    }
                }).then((res) => {
                    if (res.code == 200) {
                        this.$Message.success(res.msg);
                        this.$router.push({
                            path: '/courseManagement/review'
                        });
                    } else {
                        this.$Message.error(res.msg);
                    }
                });
            }
        },
        save() {
            this.courseMsg.lecturerIntroduction = this.getCon();
            storage.set('courseMsg', this.courseMsg);
        },
        getCon() {
            return this.$refs.edit.getUEContent();
        },
        setCon() {
            this.$refs.edit.setContent(this.courseMsg.lecturerIntroduction);
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
