<template>
    <div class="addPersonalUsers edit-new">
        <header>
            <router-link class="icon-box" tag="div" to="/user">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-left"></use>
                </svg>
            </router-link>
            <div class="title">
               {{edit}}个人用户
            </div>
        </header>
        <div class="wrapper clearfix">
            <Form class="from" ref="formValidate" :model="insertIndividualUser" :rules="ruleValidate" :label-width="140"
                  label-position="left">
                <div class="left fl">
                    <div class="title">
                        <Icon size="25" color="#117dd6" class="check-icon" type="ios-checkmark-circle-outline"/>
                        填写用户信息
                    </div>

                    <div class="from-box">

                        <FormItem label="用户名(必填)" prop="userAccount">
                            <Input v-model="insertIndividualUser.userAccount" @on-blur="checkUser"  :maxlength="11"  placeholder="手机号"></Input>
                        </FormItem>
                        <FormItem label="姓名/昵称" prop="nickname">
                            <Input v-model="insertIndividualUser.nickname" placeholder=""></Input>
                        </FormItem>

                    </div>
                </div>
                <div class="right fr" v-if="$store.getters.isAdmins">
                    <div class="title">
                        <Icon size="25" color="#117dd6" class="check-icon" type="ios-checkmark-circle-outline"/>

                        填写相关企业信息
                    </div>
                    <div class="from-box">

                        <FormItem label="企业"  prop="enterPriseId">
                            <Select v-model="insertIndividualUser.enterPriseId" @on-change="checkUser" style="width:200px" placeholder="企业名称">
                                <Option v-for="item in enterpriseList" :value="item.enterpriseId" :key="item.enterpriseId">
                                    {{ item.name}}
                                </Option>
                            </Select>

                        </FormItem>


                    </div>
                </div>
            </Form>
            <div class="btn-box fl">
                <Button class="btn fr" @click="addUser" type="primary">完成</Button>
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
            insertIndividualUser: {
                adminId: this.$store.state.userInfo.userId,
                userAccount: '',
                nickname: '',
                enterPriseId: '',
                department: ''
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
                nickname: [
                    {
                        required: true,
                        message: '请输入昵称',
                        trigger: 'blur'
                    }
                ],

                enterPriseId: {
                    required: true,
                    message: '请选择企业'
                    // trigger: 'change'
                },
                department: [
                    {
                        required: true,
                        message: '请输入部门',
                        trigger: 'blur'
                    }
                ]
            },
            enterpriseList: []
        };
    },
    activated() {},
    mounted() {
        this.init();
        this.isEnterpriseCallBack((id) => {
            this.insertIndividualUser.enterPriseId = id;
        });
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
                    this.insertIndividualUser.userAccount = res.obj.user.userAccount;
                    this.insertIndividualUser.nickname = res.obj.user.nickname;
                    this.insertIndividualUser.enterPriseId = res.obj.user.enterpriseId;
                    this.insertIndividualUser.department = res.obj.user.department;
                });
            }
        },
        /**
         * 获取企业列表
         */
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
                    let url = '';
                    let params = this.$tools.cloneObj(this.insertIndividualUser);
                    if (this.$route.query.id) {
                        url = '/system-backend/userBack/updateIndividualUser';
                        params.userId = this.$route.query.id;
                    } else {
                        url = '/system-backend/userBack/insertIndividualUser';
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
            let flag = this.insertIndividualUser.userAccount && this.insertIndividualUser.enterPriseId;
            this.$refs.formValidate.validateField('userAccount', (err) => {
                if (err == '' && flag) {
                    this.$fetch({
                        url: '/system-backend/userBack/selectUserByAccount',
                        data: {
                            type: 3,
                            userAccount: this.insertIndividualUser.userAccount,
                            enterpriseId: this.insertIndividualUser.enterPriseId
                        }
                    }).then((res) => {
                        if (res.code == 200) {
                            if (res.obj.type == 1) {
                                this.$Message.error(res.msg);
                            } else if (res.obj.type == 3) {
                                this.insertIndividualUser.userPassword = res.obj.password;
                                this.insertIndividualUser.nickname = res.obj.nickname;
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
        position: relative;
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
        .right
            position: relative;
            width: 520px;
            .title
                padding-bottom: 15px;
                margin-bottom:20px;
                border-bottom: 1px solid #e6e8ee;
        .left
            width: 520px;
            margin-right: 50px;
            .title
                padding-bottom: 15px;
                border-bottom: 1px solid #e6e8ee;
                margin-bottom:20px;
        .from-box
            width: 360px;
            .ivu-radio-wrapper
                margin-right: 30px;
        .from
            margin-top: 25px;
            margin-left: 10px;
            margin-right: 10px;
        .tree-box
            h4
                margin-top: 20px;
                margin-bottom: 5px;
        .tree
            width: 310px;
            height: 330px;
            overflow: auto;
            border: 1px solid #e9ebf0;

        .btn-box
            width: 100%;
            margin-top: 190px;
            padding-top: 15px;
            border-top: 1px solid #e6e8ee;
            .btn
                width: 115px;
</style>
<style lang="stylus">
    .addPersonalUsers
        .tree
            > ul
                padding: 5px 0;
                padding-left: 15px;
                border-bottom: 1px solid #e7e9ee;
</style>
