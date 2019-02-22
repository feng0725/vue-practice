<template>
    <div class="addEnterpriseUser edit-new">
        <header>
            <router-link class="icon-box" tag="div" to="/user">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-left"></use>
                </svg>
            </router-link>
            <div class="title">
                {{edit}}企业管理员
            </div>
        </header>
        <div class="wrapper clearfix">
            <div class="left fl">
                <div class="title">
                    <Icon size="25" color="#117dd6" class="check-icon" type="ios-checkmark-circle-outline" />

                    填写用户信息
                </div>
                <div class="from-box">
                    <Form class="from" ref="formValidate" :model="insertEnterpriseAdmin" :rules="ruleValidate" :label-width="140"
                          label-position="left">
                        <FormItem label="用户名(必填)" prop="userAccount">
                            <Input style="width:200px" @on-blur="checkUser" v-model="insertEnterpriseAdmin.userAccount"  :maxlength="11" placeholder="请输入手机号"></Input>
                        </FormItem>
                        <FormItem label="企业(必选)" prop="enterPriseId">
                                <Select :disabled="!!$route.query.id" v-model="insertEnterpriseAdmin.enterPriseId" @on-change="checkUser" style="width:200px">
                                    <Option v-for="item in enterpriseList" :value="item.enterpriseId" :key="item.enterpriseId">{{ item.name}}
                                    </Option>
                                </Select>
                        </FormItem>
                        <FormItem label="密码(必填)" prop="userPassword">
                            <Input style="width:200px" v-model="insertEnterpriseAdmin.userPassword" type="password" placeholder="请输入新密码"></Input>
                        </FormItem>
                    </Form>
                </div>
            </div>
            <div class="btn-box fl">
                <Button class="btn fl" @click="addUser" type="primary">完成</Button>
            </div>
        </div>
    </div>

</template>

<script>
export default {
    name: 'addAdmin',
    data() {
        return {
            edit: '新建',
            enterpriseList: [],
            insertEnterpriseAdmin: {
                adminId: this.$store.state.userInfo.userId,
                userAccount: '',
                enterPriseId: '',
                userPassword: '',
                permissionIdList: []
            },

            ruleValidate: {
                userAccount: [
                    {
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur'
                    },
                    {
                        pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
                        message: '手机号格式不正确',
                        trigger: 'blur'
                    }
                ],
                enterPrise: [
                    {
                        required: true,
                        message: '请选择企业',
                        trigger: 'change'
                    }
                ],
                userPassword: [
                    {
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur'
                    }
                ]
            }
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.selectEnterpriseList();
            if (this.$route.query.id) {
                this.edit = '修改';
                this.$fetch({
                    url: '/system-backend/userBack/editUser',
                    data: {
                        adminId: this.$store.state.userInfo.userId,
                        userId: this.$route.query.id
                    }
                }).then((res) => {

                    this.insertEnterpriseAdmin.userAccount =
                        res.obj.user.userAccount;
                    this.insertEnterpriseAdmin.enterPriseId =
                        res.obj.user.enterpriseId;
                    this.insertEnterpriseAdmin.userPassword =
                        res.obj.user.userPassword;
                });
            }
        },
        selectEnterpriseList() {
            this.$fetch({
                url: '/system-backend/userBack/selectOtherEnterpriseList'
            }).then((res) => {
                if (res.code == 200) {
                    this.enterpriseList = res.obj;
                }
            });
        },
        addUser() {
            this.$refs.formValidate.validate((valid) => {
                if (valid) {
                    let params = this.$tools.cloneObj(
                        this.insertEnterpriseAdmin
                    );
                    let url = '';
                    if (this.$route.query.id) {
                        params.userId = this.$route.query.id;
                        url = '/system-backend/userBack/updateEnterpriseAdmin';
                    } else {
                        url = '/system-backend/userBack/insertEnterpriseAdmin';
                    }
                    this.$fetch({
                        url: url,
                        data: params
                    }).then((res) => {
                        if (res.code == 200) {
                            this.$message.success(res.msg);
                            this.$router.push({ path: '/user' });
                        } else {
                            this.$Message.error(res.msg);
                        }
                    });
                }
            });
        },
        /**
         * 检查用户是否被注册
         */
        checkUser() {
            if (this.$route.query.id) return false;
            let flag =
                this.insertEnterpriseAdmin.userAccount &&
                this.insertEnterpriseAdmin.enterPriseId;
            this.$refs.formValidate.validateField('userAccount', (err) => {
                if (err == '' && flag) {
                    this.$fetch({
                        url: '/system-backend/userBack/selectUserByAccount',
                        data: {
                            type: 2,
                            userAccount: this.insertEnterpriseAdmin.userAccount,
                            enterpriseId: this.insertEnterpriseAdmin
                                .enterPriseId
                        }
                    }).then((res) => {
                        if (res.code == 200) {
                            if (res.obj.type == 1) {
                                this.$Message.error(res.msg);
                            } else if (res.obj.type == 3) {
                                this.insertEnterpriseAdmin.userPassword =
                                    res.obj.password;
                                this.insertEnterpriseAdmin.nickname =
                                    res.obj.nickname;
                                this.$Message.success(res.msg);
                            } else {
                                this.$Message.success(res.msg);
                            }
                        } else {
                            this.$Message.error(res.msg);
                        }
                    });
                }
            });
        }
    }
};
</script>

<style scoped lang="stylus">
    header
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
            cursor:pointer;
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
                width: 370px;
        .from
            margin-top: 25px;
            margin-left: 10px;
            margin-right: 10px;
        .btn-box
            width: 100%;
            margin-top: 190px;
            padding-top: 15px;
            border-top: 1px solid #e6e8ee;
            .btn
                width: 115px;
</style>
<style lang="stylus">

</style>
