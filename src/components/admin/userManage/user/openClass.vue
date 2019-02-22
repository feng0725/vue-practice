<template>
    <div class="openClass edit-new">
        <header>
            <div class="icon-box" @click="$router.back()">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-left"></use>
                </svg>
            </div>
            <div class="title">
                开课认证
            </div>
        </header>
        <div class="wrapper clearfix">
            <div class="left fl">
                <div class="title">
                    填写用户信息
                </div>
                <div class="from-box">
                    <Form class="from" ref="formValidate" :model="authInfo" :rules="ruleValidate" :label-width="140"
                          label-position="left">
                      <div style="margin-bottom: 15px;">
                          <span style="display: inline-block;width:140px">用户名:{{userName}}</span>
                          <span v-show="this.authTime">认证时间:{{authTime}}</span>
                      </div>
                        <FormItem label="真实姓名(必填)" prop="name">
                            <Input v-model="authInfo.name" placeholder="请输入真实姓名"></Input>
                        </FormItem>
                        <FormItem label="身份证号(必填)" prop="idCard">
                            <Row>
                                <Input v-model="authInfo.idCard" :maxlength="18" placeholder="请输入身份证号"></Input>
                            </Row>
                        </FormItem>
                        <FormItem label="身份证(必填)" prop="idCardUrl">
                            <Upload :show-upload-list="false"
                                    :data="uploadData"
                                    :before-upload="uploadBefore"
                                    :on-success="uploadSuccess"
                                    :on-progress="uploadProgress"
                                    accept="image/* "
                                    action="/system-backend/courseBack/addResource">
                                <Button type="primary">上传图片</Button>
                            </Upload>
                            <div class="img-box" v-show="authInfo.idCardUrl!=''" style="margin-top:20px;">
                                <Icon size="15"  class="icon-close" color="#f00" @click="authInfo.idCardUrl=''" type="md-close-circle" />
                                <img :src="authInfo.idCardUrl" style="width: 100%" alt="">
                            </div>
                        </FormItem>
                    </Form>
                </div>
            </div>

            <div class="btn-box fl">
                <Button class="btn fr" @click="updateAuthInfo" type="primary">完成</Button>
            </div>
        </div>
    </div>

</template>

<script>
export default {
    name: 'addAdmin',
    props: [],
    data() {
        return {
            uploadData: {
                originalName: ''
            },
            userName: '',
            authTime: '',
            authInfo: {
                adminId: this.$store.state.userInfo.userId,
                userId: this.$route.params.id,
                name: '',
                idCard: '',
                idCardUrl: ''
            },
            ruleValidate: {
                name: [
                    {
                        required: true,
                        message: '请输入真实姓名'
                    }
                ],
                idCard: [
                    {
                        required: true,
                        message: '请输入身份证号'
                    },
                    {
                        required: true,
                        pattern: /^[1-9][0-9]{16}([0-9]|x|X)$/,
                        message: '请输入正确的身份证号',
                        trigger: 'blur'
                    }
                ],
                idCardUrl: [
                    {
                        required: true,
                        validator(rule, value, callback, source, options) {
                            if (value) {
                                callback();
                            } else {
                                callback('请上传图片');
                            }
                        }
                    }
                ]
            },
            imgSrc: ''
        };
    },
    mounted() {
        this.$fetch({
            url: '/system-backend/userBack/selectUserAuthInfo',
            data: {
                userId: this.authInfo.userId
            }
        }).then((res) => {
            if (res.code == 200) {
                this.userName = res.obj.userAccount;

                if (res.obj.type == 1) {
                    this.authInfo.name = res.obj.authIndividual.name;
                    this.authInfo.idCard = res.obj.authIndividual.idCard;
                    this.authInfo.idCardUrl = res.obj.authIndividual.idCardUrl;
                    this.authTime = res.obj.authIndividual.authTime;
                }
            } else {
                this.$Message.error(res.msg);
            }
        });
    },
    methods: {
        updateAuthInfo() {
            this.$refs.formValidate.validate((valid) => {
                if (valid) {
                    this.$fetch({
                        url: '/system-backend/userBack/insertUserAuthInfo',
                        data: this.authInfo
                    }).then((res) => {
                        if (res.code == 200) {
                            this.$Message.success(res.msg);
                            this.$router.back();
                        } else {
                            this.$Message.error(res.msg);
                        }
                    });
                }
            });
        },
        uploadSuccess(response, file, filelist) {
            this.authInfo.idCardUrl = response.obj.fileUrl;
            this.$refs.formValidate.validateField('idCardUrl');
        },
        uploadBefore(response, file, fileList) {
            this.uploadData.originalName = this.$tools.filterFileNmae(response.name);
        },
        uploadProgress(response, file, fileList) {}
    }
};
</script>

<style scoped lang="stylus">
    header
        position: relative;
        margin-bottom: 12px;
        .icon-box
            position: absolute;
            left;
            0;
            top: 0;
            width 70px;
            height: 50px;
            line-height: 50px;
            background-color: #f8f8f8;
            text-align: center;
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

        .left
            width: 100%;
            margin-right: 50px;
            .title
                padding-bottom: 15px;
                border-bottom: 1px solid #e6e8ee;
            .from-box
                width: 350px;
        .from
            margin-top: 20px;
            margin-left: 10px;
            margin-right: 10px;
            .img-box
                position: relative;
                width:100px;
                border:1px solid #e7e9ef;
                img
                    display: block;
                .icon-close
                    position: absolute;
                    top:0;
                    right:0;
                    transform:translate(50%,-50%);
                    cursor:pointer;

        .btn-box
            width: 100%;
            margin-top: 15px;
            padding-top: 10px;
            border-top: 1px solid #e6e8ee;
            .btn
                width: 115px;
    .ivu-form-item
        margin-bottom:20px;
</style>
<style lang="stylus">
    .openClass
        .tree
            > ul
                padding: 5px 0;
                padding-left: 15px;
                border-bottom: 1px solid #e7e9ee;
</style>
