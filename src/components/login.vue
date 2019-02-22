<template>
    <div class="login">
        <div class="bg"></div>
        <div class="center">
            <div class=" cloud">
                <img src="../assets/cloud.png" alt="">
            </div>
            <div class="login-box">
                <p>欢迎登录 友看在线管理平台</p>
                <p>使用<span style="color:#2058b9">注册手机号</span>登录</p>
                <div class="input-box">
                    <div>
                        <i-input class="iinput" v-model.trim="userInfo.userAccount" placeholder="手机号">
                            <svg slot="prefix" class="icon icon-username input-icon " aria-hidden="true">
                                <use xlink:href="#icon-username"></use>
                            </svg>
                        </i-input>

                        <i-input @on-enter="login" class="iinput" label="password" type="password" placeholder="密码"
                                 v-model.trim="userInfo.userPassword  ">
                            <svg slot="prefix" class="icon input-icon passwrod " aria-hidden="true">
                                <use xlink:href="#icon-Password"></use>
                            </svg>
                        </i-input>
                    </div>
                    <Button class="s-button" @click="login" :disabled="isLogin" type="success" long>登录</Button>

                </div>
                <footer class="footer">
                    <Checkbox v-model="userInfo.remember2">记住用户名和密码</Checkbox>
                    <a @click="showModal " class="fr forget">忘记密码</a>
                </footer>
            </div>
        </div>

        <footer class="info">
            <div class="cover"></div>
            Copyright @ 2007-2018 北京乾元利恒科技有限公司 技术支持
        </footer>
        <MyDialog :width="480" v-bind:visible.sync="model10" @ok="handleSubmit('formValidate')" :title="'重置密码'">
            <Form ref="formValidate" :model="resetPWD" :rules="ruleValidate" :label-width="140"
                  label-position="left">
                <FormItem label="手机号" prop="userAccount">
                    <Input v-model="resetPWD.userAccount" placeholder=""></Input>
                </FormItem>
                <FormItem label="验证码" prop="code">
                    <Row>
                        <Col span="15">
                            <Input v-model="resetPWD.code" placeholder=""></Input>
                        </Col>
                        <Col span="9">
                            <Button @click="getCode" :disabled="time != '获取验证码'" class="fr v-code" type="success">
                                {{time}}
                            </Button>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label="新密码(必填)" prop="userPassword">
                    <Input v-model="resetPWD.userPassword" placeholder=""></Input>
                </FormItem>
                <FormItem label="重复新密码(必填)" prop="userPassword1">
                    <Input v-model="resetPWD.userPassword1" placeholder=""></Input>
                </FormItem>
            </Form>
        </MyDialog>

    </div>
</template>

<script>
import { storage, Cookies } from '../common/js/qylh';

export default {
    name: 'login',

    data() {
        return {
            isLogin: false,
            userInfo: {
                userAccount: '',
                userPassword: '',
                remember: false,
                remember2: ''
            },
            input1: '',
            model10: false,
            single: '',
            value: '',
            code: '',
            time: '获取验证码',
            resetPWD: {
                userAccount: '',
                code: '',
                userPassword: '',
                userPassword1: ''
            },
            ruleValidate: {
                userAccount: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
                code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
                userPassword: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
                userPassword1: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
            }
        };
    },
    mounted() {
        let name = Cookies.getItem('localName');
        let pwd = Cookies.getItem('localPassword');
        if (name) {
            this.userInfo.remember2 = true;
            this.userInfo.userAccount = name;
            this.userInfo.userPassword = pwd;
        }
    },
    methods: {
        getCode() {
            let that = this;

            this.$fetch({
                url: '/system-backend/user/getVerification',
                data: {
                    userAccount: this.resetPWD.userAccount
                }
            }).then((res) => {
                if (res.code == 200) {
                    this.code = res.obj;
                    this.time = 60;
                    timeOut();
                } else {
                    this.$Message.error(res.msg);
                }
            });

            function timeOut() {
                let timer = setInterval(function() {
                    that.time--;

                    if (that.time < 0) {
                        clearInterval(timer);
                        that.time = '获取验证码';
                    }
                }, 1000);
            }
        },
        login() {
            if (this.isLogin) return false;
            this.userInfo.remember = this.userInfo.remember2 ? 1 : 0;
            this.isLogin = true;
            this.$fetch({
                method: 'post',
                url: '/system-backend/userBack/login',
                data: this.userInfo
            })
                .then((res) => {
                    if (res.code == 200) {
                        // 没有cookies 时保存
                        if (this.userInfo.remember2) {
                            let time = 60 * 60 * 24; // 一天有多少秒
                            time = time * 3;
                            Cookies.setItem('localName', this.userInfo.userAccount, time);
                            Cookies.setItem('localPassword', this.userInfo.userPassword, time);
                        } else {
                            Cookies.removeItem('localName');
                            Cookies.removeItem('localPassword');
                        }

                        this.removeInfo();
                        this.$store.commit('updateUserInfo', res.obj);
                        this.getAdminType();
                        storage.set('date', new Date().toLocaleDateString());

                        this.$Message.success(res.msg);
                    } else {
                        this.isLogin = false;
                        this.$Message.error(res.msg);
                    }
                })
                .catch((error) => {
                    this.isLogin = false;
                });
        },
        // 是个人认证用户显示自己名字 否则显示企业名字
        getEnterpriseName() {
            if (this.$store.getters.isUser) {
                this.$store.commit('updateEnterpriseName', this.$store.state.userInfo.nickname);
            } else {
                this.$fetch({
                    url: '/system-backend/courseBack/selectEnterpriseName',
                    data: {
                        enterpriseId: this.$store.state.userInfo.enterpriseId
                    }
                }).then((res) => {
                    if (res.code == 200) {
                        this.$store.commit('updateEnterpriseName', res.obj);
                    }
                });
            }
        },
        async getAdminType() {
            this.$Spin.show();
            let res = await this.$fetch({
                url: '/system-backend/userBack/index',
                data: {
                    userId: this.$store.state.userInfo.userId
                }
            });

            this.$store.commit('updatePermissionVOList', res.obj.user.permissionVOList);
            this.$store.commit('updateSurplus', res.obj.surplus);
            this.$store.commit('updateAdminType', res.obj.adminType);
            this.$Spin.hide();
            this.getEnterpriseName();
            this.$router.push({ path: '/today-course' });
        },
        showModal() {
            this.model10 = true;
            this.$refs.formValidate.resetFields();
        },
        handleSubmit(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    if (this.resetPWD.userPassword !== this.resetPWD.userPassword1) {
                        this.$Message.error('两次密码不一致,请修改后提交');
                        return false;
                    }
                    this.$fetch({
                        url: '/system-backend/userBack/resetPassword',
                        data: this.resetPWD
                    }).then((res) => {
                        if (res.code == 200) {
                            this.$Message.success(res.msg);
                            this.model10 = false;
                        } else {
                            this.$Message.error(res.msg);
                        }
                    });
                } else {
                    this.model10 = true;
                }
            });
        },
        handleReset(name) {
            this.$refs[name].resetFields();
        }
    }
};
</script>

<style scoped lang="stylus">
    .bg
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: url('../assets/bg.jpg');
        background-size: 100% 100%;

    .cloud
        width:500px;
        position: absolute;
        top: 18%;
        right: 50%;
        margin-right:34px;
        background-color: transparent;
        img
            width:100%;

    .login-box
        position: absolute;
        top: 18%;
        left: 50%;
        margin-left:34px;
        width: 400px;
        height: 400px;
        border-radius: 10px;
        overflow: hidden;
        background-color: #fff;
        > p
            text-align: center;
            &:first-child
                font-weight: bold;
                margin: 40px 0 40px;
                font-size: 20px;
            &:nth-child(2)
                margin-bottom: 20px;
                font-size: 15px;
            /*font-size:20px;*/
            a
                color: #2058b9;
        > div
            margin: 0 51px 0 54px;
        .forget
            color: #7e8284;
            text-decoration: underline;
        .input-box
            > div
                position: relative
                /*margin-bottom: 20px;*/
                &:nth-child(2)
                    margin-bottom: 25px;
            > button
                width: 100%;
            .iinput
                margin-bottom: 20px;
            .s-button
                background-color: $buttonColor;
                height: 50px;
                font-size:16px;
                margin-top: 5px;

        .input-icon
            font-size: 24px;
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            z-index: 9;

        /*&.icon-username*/
        /*font-size: 22px;*/
        .footer
            position: absolute;
            text-align:left;

            bottom: 0;
            width: 100%;
            height: 55px;
            padding: 0 51px 0 54px;
            line-height: 55px;
            background-color: #eef7fe;

    footer.info
        width: 100%;
        height: 72px;
        position: fixed;
        bottom: 0;
        border-top: 2px solid #2d354b;
        line-height: 72px;
        text-align: center;
        font-size: 14px;
        color: #fff;
        .cover
            position: absolute;
            z-index: -1;
            width 100%;
            height: 72px;
            background-color: #1c212d;
            opacity: 0.53;

    .vertical-center-modal {
        display: flex;
        align-items: center;
        justify-content: center;

        .ivu-modal {
            top: 0;
        }
    }

    .v-code
        background-color: $buttonColor
        span
            margin-left: -3px;
</style>
<style lang="stylus">
    .login
        .ivu-input-with-prefix
            padding-left: 55px;
        .ivu-input
            height: 40px;

    .dialog
        .ivu-form-item
            .ivu-input
                background-color: #f2f3f5;
        .v-code
            background-color: $buttonColor
            span
                margin-left: -5px;
</style>
