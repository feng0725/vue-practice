<template>
    <div class="review1  edit-new">
        <header>
            <div class="icon-box" @click="$router.back()">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-left"></use>
                </svg>
            </div>
            <div class="title">
                {{status}}通知
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
                          :label-width="100"
                          label-position="left">
                        <FormItem label="标题(必填)" prop="title">
                            <Input style="" v-model="insertNotice.title" placeholder=""></Input>
                        </FormItem>
                        <FormItem label="内容(必填)" prop="content">
                            <Editor ref="editor" height="400px" :defaultMsg="insertNotice.content"></Editor>
                        </FormItem>
                        <FormItem label="附件" prop="yunfileStr">
                            <Upload style="display: inline-block;"
                                    :show-upload-list="false"
                                    :data="uploadData"
                                    :before-upload="uploadBefore"
                                    :on-success="uploadSuccess"
                                    :on-error="uploadSuccess"
                                    :on-progress="uploadProgress"
                                    :on-exceeded-size="handleMaxSize"
                                    accept=".doc,.docx,.pdf,.excel,.xlsx,.xls "
                                    action="/system-backend/courseBack/addResource"
                            >
                                <Button size="small" :disabled="fileFlag || !!insertNotice.yunfileStr"
                                        class="white-blue">添加附件
                                </Button>
                            </Upload>
                            <span v-show="fileFlag &&!insertNotice.yunfileStr ">上传中...</span>

                            <a target="_blank" :href="insertNotice.fileUrl" class="text">{{insertNotice.yunfileStr}}</a>
                            <Icon class="pointer" @click="clearYunFile" v-show="insertNotice.yunfileStr" size="15"
                                  color="#d41e3c" type="ios-close-circle"/>
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
            status: '新建',
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
                enterpriseId: '', // `-2#${this.$store.state.userInfo.enterpriseId}`,
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
        if (this.$route.query.id) {
            this.status = '编辑';
            this.$fetch({
                url: '/system-backend/noticeBack/selectNotice',
                data: {
                    noticeId: this.$route.query.id
                }
            }).then((res) => {
                if (res.code == 200) {
                    this.insertNotice = _.extend(res.obj, res.obj.noticePushRange);
                    this.$refs.editor.setContent(this.insertNotice.content);
                    if (res.obj.yunfileList.length > 0) {
                        this.insertNotice.yunfileStr = res.obj.yunfileList[0].originalName;
                        this.insertNotice.fileUrl = res.obj.yunfileList[0].downloadUrl;
                        this.insertNotice.yunfileIdStr = res.obj.yunfileList[0].yunfileId;
                    }
                }
            });
        }
    },
    mounted() {
        let insertNotice = storage.get('insertNotice');
        if (insertNotice) {
            this.insertNotice = insertNotice;
        }
    },
    methods: {
        next() {
            if (this.fileFlag) {
                this.$Message.error('文件上传中，请上传完成后再操作！');
                return;
            }
            this.insertNotice.content = this.$refs.editor.getUEContent();
            this.$refs.insertNotice.validate((valid) => {
                if (valid) {
                    this.save();
                    this.$router.push({
                        path: '/care-management/notification/enterprise/notification2',
                        query: { id: this.$route.query.id }
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
            this.fileFlag = false;
            this.successCallBack(response, () => {
                this.insertNotice.yunfileIdStr = response.obj.yunfileId;
                this.insertNotice.fileUrl = response.obj.fileUrl;
                this.insertNotice.yunfileStr = response.obj.originalName;
            });
            this.$Spin.hide();
        },
        uploadBefore(response, file, fileList) {
            this.uploadData.originalName = this.$tools.filterFileNmae(response.name);
            this.$Spin.show({
                render: (h) => {
                    return h('MySpin', {
                        props: {
                            content: '上传中'
                        }
                    });
                }
            });
        },
        uploadProgress(response, file, fileList) {
            this.fileFlag = true;
        },
        handleMaxSize(file) {
            this.$Notice.warning({
                title: '超过文件大小限制',
                desc: '文件  ' + file.name + ' 太大，不超过10M.'
            });
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
        margin-left: 20px;
</style>
<style lang="stylus">
    .select-list.dialog
        .ivu-modal-body
            background-color: #fff

        .ivu-checkbox
            margin: 0 10px;
</style>
