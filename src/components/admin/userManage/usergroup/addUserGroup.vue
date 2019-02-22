<template>
    <div class="addEnterpriseUser edit-new">
        <header>
            <div class="icon-box" @click="$router.back()">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-left"></use>
                </svg>
            </div>
            <div class="title">
                {{status}}用户组
            </div>
        </header>
        <div class="wrapper clearfix">
            <div class="left fl">
                <div class="title">
                    填写用户信息
                </div>
                <div class="from-box">
                    <Form class="from" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="140"
                          label-position="left">
                        <FormItem label="企业" prop="enterpriseId" v-if="$store.getters.isAdmins">
                            <Row>
                                <Select  :disabled="$route.query.id?true:false"  placeholder="企业名称" v-model="formValidate.enterpriseId" @on-change="getUserList" style="width:200px">
                                    <Option v-for="item in enterpriseArr" :value="item.enterpriseId" :key="item.enterpriseId">{{ item.name
                                        }}
                                    </Option>
                                </Select>
                            </Row>
                        </FormItem>
                        <FormItem label="组名称(必填)" prop="groupName">
                            <Input v-model="formValidate.groupName" placeholder=""></Input>
                        </FormItem>

                        <FormItem label="备注" prop="description">
                            <Input v-model="formValidate.description" placeholder=""></Input>
                        </FormItem>
                    </Form>
                </div>
            </div>
            <div class="right fl">
                <myAddUser @updateList="getUserList" ref="addUser" :userListSelected.sync="userListSelected" :userList.sync="userList"></myAddUser>
            </div>
            <div class="btn-box fl">
                <Button class="btn fr" @click="insertGroup($event)" type="primary">完成</Button>
            </div>
        </div>
    </div>

</template>

<script>
import addUser from './addUser';

export default {
    name: 'addAdmin',
    components: {
        myAddUser: addUser
    },
    data() {
        return {
            status: '新建',
            userListSelected: [],
            enterpriseArr: [],
            userList: [],
            formValidate: {
                enterpriseId: '',
                groupName: '',
                description: ''
            },
            ruleValidate: {
                groupName: [
                    {
                        required: true,
                        message: '请填写组名称'
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
            if (this.$store.getters.isEnterprise) {
                this.formValidate.enterpriseId = this.$store.state.userInfo.enterpriseId;
            }
            this.getUserList();
            this.getEnterpriseArr();
            if (this.$route.query.id) {
                this.status = '编辑';
                this.getEditData();
            }
        },
        getEditData() {
            let that = this;

            function getUserList() {
                return that.$fetch({
                    url: '/system-backend/groupBack/selectEnterpriseUserList',
                    data: {
                        enterpriseId: that.formValidate.enterpriseId,
                        department: that.$refs.addUser.department,
                        search: that.$refs.addUser.search
                    }
                });
            }

            function getUserListSelected() {
                return that.$fetch({
                    url: '/system-backend/groupBack/selectUserListByGroupIdAndSearch',
                    data: {
                        groupId: that.$route.query.id,
                        search: ''
                    }
                });
            }
            this.$fetch({
                url: '/system-backend/groupBack/selectGroupAndEnterpriseByGroupId',
                data: {
                    groupId: this.$route.query.id
                }
            }).then((res) => {
                this.userList = res.obj.enterpriseUserList;
                this.formValidate.enterpriseId = res.obj.group.enterpriseId;
                this.formValidate.groupName = res.obj.group.name;
                this.formValidate.description = res.obj.group.description;

                this.$fetch.all([getUserList(), getUserListSelected()]).then(
                    this.$fetch.spread(function(userListRes, userListSelectedRes) {
                        that.userList = userListRes.obj.userList;
                        that.userListSelected = userListSelectedRes.obj.groupUserList;
                    })
                );
            });
        },
        async getEnterpriseArr() {
            let data = await this.$fetch({
                url: '/system-backend/userBack/selectEnterpriseList',
                data: {
                    isHave: 0
                }
            });
            if (data.code == 200) {
                this.enterpriseArr = data.obj;
            }
        },
        getUserList() {
            this.$fetch({
                url: '/system-backend/groupBack/selectEnterpriseUserList',
                data: {
                    enterpriseId: this.formValidate.enterpriseId,
                    department: this.$refs.addUser.department,
                    search: this.$refs.addUser.search
                }
            }).then((res) => {
                this.userList = res.obj.userList;
            });
        },
        insertGroup(event) {
            event.target.disabled = true;
            let url = '';
            if (this.$route.query.id) {
                url = '/system-backend/groupBack/updateGroup';
            } else {
                url = '/system-backend/groupBack/insertGroup';
            }
            this.$fetch({
                url: url,
                data: {
                    adminId: this.$store.state.userInfo.userId,
                    enterpriseId: this.formValidate.enterpriseId,
                    groupName: this.formValidate.groupName,
                    description: this.formValidate.description,
                    userIdList: this.$refs.addUser.userListSelected.map((item) => item.userId).join(','),
                    groupId: this.$route.query.id
                }
            }).then((res) => {
                event.target.disabled = true;
                if (res.code == 200) {
                    this.$Message.success(res.msg);
                    this.$router.back();
                } else {
                    this.$Message.error(res.msg);
                }
            });
        }
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
        .right
            position: relative;
            width: 700px;
            h4
             margin-bottom:5px;
            .title
                padding-bottom: 15px;
                margin-bottom: 10px;
                border-bottom: 1px solid #e6e8ee;

        .left
            width: 350px;
            margin-right: 50px;
            h4
               margin-bottom:5px;
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
            margin-top: 10px;
            padding-top: 15px;
            border-top: 1px solid #e6e8ee;
            .btn
                width: 115px;
    .user-list
        border:2px solid #e6e8ee;
        height: 350px;
        overflow: auto;
        li
            width:300px;
            height:45px;
            line-height: 45px;
            border-bottom:1px solid #e6e8ee;
            .user
                margin-right:60px;
                margin-left:30px;
            .department
                margin-right:60px;

</style>
<style lang="stylus">
    .addEnterpriseUser
        .ivu-table th
            background-color: #fff
</style>
