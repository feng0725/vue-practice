<template>
    <div class="review1 edit-new">
        <header>
            <div class="icon-box" @click="$router.back()">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-left"></use>
                </svg>
            </div>
            <!--<router-link  to="/care-management/notification-review">-->
            <!---->
            <!--</router-link>-->
            <div class="title">
                审核通知
            </div>
        </header>
        <div class="wrapper clearfix">
            <div class="title">
                <Steps size="small" :current="0">
                    <Step title="填写通知内容" content=""></Step>
                    <Step title="发送范围" content=""></Step>
                </Steps>

            </div>
            <div class="clearfix">
                <div class="left ">
                    <Form class="from" ref="insertNotice" :model="insertNotice" :rules="insertNoticeRules"
                          :label-width="180"
                          label-position="left">
                        <FormItem label="标题(必选)" prop="title">
                            {{insertNotice.title}}
                        </FormItem>
                        <FormItem label="内容(必选)" prop="content">
                            <div class="contentaa" v-html="insertNotice.content"></div>
                            <Editor v-show="false" ref="editor" :defaultMsg="insertNotice.content"></Editor>
                        </FormItem>
                        <FormItem label="附件" prop="yunfileStr">
                            <Upload style="display: inline-block;"
                                    :show-upload-list="false"
                                    :data="uploadData"
                                    :before-upload="uploadBefore"
                                    :on-success="uploadSuccess"
                                    :on-progress="uploadProgress"
                                    accept="image/* "
                                    action="/system-backend/courseBack/addResource"
                            >
                                <Button  v-show="false" size="small" :disabled="insertNotice.yunfileStr != ''" class="white-blue">添加附件</Button>
                            </Upload>
                            <a  target="_blank" :href="insertNotice.fileUrl" class="text">{{insertNotice.yunfileStr}}</a>
                            <Icon  @click="clearYunFile" v-show="false" size="15" color="#d41e3c" type="ios-close-circle"/>
                        </FormItem>
                    </Form>
                </div>
            </div>
            <div class="btn-box fl">
                <Button class="btn fr" type="primary" @click="next">下一步</Button>
            </div>
        </div>
    </div>
</template>

<script>
import { storage } from '../../../../../common/js/qylh';
import _ from 'underscore';
export default {
    name: 'review1',
    computed: {
        value17() {
            return this.value7.replace(/\n/g, '<br>');
        }
    },
    data() {
        return {
            uploadData: {
                originalName: ''
            },
            addUser: false,
            value7: '',
            abc: null,
            insertNotice: {
                adminId: this.$store.state.userInfo.userId,
                title: '',
                content: '',
                noticeType: '',
                isBuy: '',
                userType: '',
                courseId: '',
                appid: '',
                enterpriseId: '',
                groupId: '',
                userId: '',
                yunfileIdStr: '',
                yunfileStr: '',
                fileUrl: ''
            },
            insertNoticeRules: {
                title: {
                    required: true,
                    message: '请填写标题'
                },
                content: {
                    required: true,
                    message: '请填写内容'
                }
            }
        };
    },
    created() {
        this.$fetch({
            url: '/system-backend/noticeBack/selectNotice',
            data: {
                noticeId: this.$route.query.id
            }
        }).then((res) => {
            if (res.code == 200) {
                this.insertNotice = _.extend(res.obj, res.obj.noticePushRange);
                if (res.obj.yunfileList.length > 0) {
                    this.insertNotice.yunfileStr = res.obj.yunfileList[0].originalName;
                    this.insertNotice.fileUrl = res.obj.yunfileList[0].downloadUrl;
                    this.insertNotice.yunfileIdStr = res.obj.yunfileList[0].yunfileId;
                }

                this.$refs.editor.setContent(this.insertNotice.content);
            } else {
                this.$Message.error(res.msg);
            }
        });
    },
    mounted() {},
    methods: {
        next() {
            this.insertNotice.content = this.$refs.editor.getUEContent();
            this.$refs.insertNotice.validate((valid) => {
                if (valid) {
                    this.save();
                    console.log(this.insertNotice)
                    let path = '';
                    if (this.insertNotice.createrType == 2 || this.insertNotice.createrType == 3) {
                        path = '/care-management/notification-review/enterprise2';
                    } else {
                        path = '/care-management/notification-review/admin2';
                    }
                    this.$router.push({
                        path: path,
                        query: { id: this.$route.query.id ,type:this.$route.query.type}
                    });
                }
            });
        },
        save() {
            storage.set('insertNotice', this.insertNotice);
        },
        clearYunFile() {
            this.insertNotice.yunfileIdStr = null;
            this.insertNotice.fileUrl = null;
            this.insertNotice.yunfileStr = null;
        },
        uploadSuccess(response, file, filelist) {
            this.insertNotice.yunfileIdStr = response.obj.yunfileId;
            this.insertNotice.fileUrl = response.obj.fileUrl;
            this.insertNotice.yunfileStr = response.obj.originalName;
        },
        uploadBefore(response, file, fileList) {
            this.uploadData.originalName = this.$tools.filterFileNmae(response.name);
        },
        uploadProgress(response, file, fileList) {}
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

        .from
            margin-top: 20px;
            margin-left: 10px;
            margin-right: 10px;
            .warning
                color: #d41e3c;
                font-weight: normal;
                margin-left: 15px;
                a
                    text-decoration: underline;
            .item
                background-color: #fafafa;
                padding: 5px 0;
                margin-bottom: 10px;
                h5
                    margin-bottom: 10px;

            a.file
                color: #8b8b8b
                text-decoration: underline;
            .img-box
                position: relative;
                border: 1px solid #e7e9ef;
                .icon-close
                    position: absolute;
                    top: 0;
                    right: 0;
                    transform: translate(50%, -50%);
                    cursor: pointer;

        .btn-box
            width: 100%;
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #e6e8ee;
            .btn
                width: 115px;

    .img-box
        position: relative;
        width: 95px;
        height: 35px;
        border: 1px solid #e7e9ef;
        margin-top: 18px;
        img
            width: 100%;
            height: 100%;

    .select-list
        h4
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

    .text
        text-decoration: underline
        margin-left: 0px;
    .contentaa
        img
            width:100%
</style>
<style lang="stylus">
    .review1
        .contentaa
            img
                width:100%
    .select-list.dialog
        .ivu-modal-body
            background-color: #fff
        .ivu-checkbox
            margin: 0 10px;
</style>
