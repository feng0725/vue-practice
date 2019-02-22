<template>
    <div class="add-admin edit-new ">
        <header class="">
            <!--<router-link class="icon-box" tag="div" to="/user">-->
            <!--<svg class="icon" aria-hidden="true">-->
            <!--<use xlink:href="#icon-left"></use>-->
            <!--</svg>-->
            <!--</router-link>-->
            <!--<div class="title">-->
            <!--{{status}}管理员用户-->
            <!--</div>-->
        </header>
        <div class="wrapper clearfix">
            <!--<div class="left fl">-->
            <!--<div class="title">-->
            <!--<Icon size="25" color="#117dd6" class="check-icon" type="ios-checkmark-circle-outline" />-->
            <!--填写用户信息-->
            <!--</div>-->
            <!--<Form class="from" ref="formValidate" :model="insertUcansAdmin" :rules="ruleValidate" :label-width="140"-->
            <!--label-position="left">-->
            <!--<FormItem label="用户名(必填)" prop="userAccount">-->
            <!--<Input v-model="insertUcansAdmin.userAccount" ref="userAccount" @on-blur="checkUser"    :maxlength="11" placeholder="请输入手机号"></Input>-->
            <!--</FormItem>-->
            <!--<FormItem label="姓名/昵称" prop="nickname">-->
            <!--<Row>-->
            <!--<Input v-model="insertUcansAdmin.nickname" placeholder="请输入姓名/昵称"></Input>-->
            <!--</Row>-->
            <!--</FormItem>-->
            <!--<FormItem label="密码(必填)" prop="userPassword" >-->
            <!--<Input v-model="insertUcansAdmin.userPassword" type="password" placeholder="请输入新密码"></Input>-->
            <!--</FormItem>-->
            <!--</Form>-->
            <!--</div>-->
            <div class="right ">
                <div class="title">
                    <Icon size="25" color="#117dd6" class="check-icon" type="ios-checkmark-circle-outline"/>

                    设定权限
                </div>
                <div class="clearfix tree-box">
                    <div class="fl">
                        <h4>菜单列表</h4>
                        <Tree class="tree" ref="tree" @on-check-change="getSelectedNodes" :render="renderTree"
                              children-key="permissionList" :data="treeLeft" show-checkbox multiple></Tree>
                    </div>
                    <img class="icon-switch" src="./img/switch.png" alt="">
                    <div class="fr">
                        <h4>已选择</h4>
                        <Tree class="tree" :render="renderTreeRight" children-key="permissionList"
                              :data="treeRight"></Tree>
                    </div>
                </div>


            </div>
            <div class="btn-box fl">
                <Button class="btn fr" @click="addUser" type="primary">完成</Button>
            </div>
        </div>
    </div>

</template>

<script>
import _ from 'underscore';

export default {
    name: 'addAdmin',
    data() {
        return {
            isPassed: false,
            status: '新建',
            errInfo: '',
            treeLeft: [],
            treeRight: [],
            insertUcansAdmin: {
                adminId: this.$store.state.userInfo.userId,
                userAccount: '',
                nickname: '',
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
                nickname: [
                    {
                        required: true,
                        message: '请输入昵称',
                        trigger: 'blur'
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
        if (this.$route.query.id) {
            this.status = '编辑';
            this.$fetch({
                url: '/system-backend/userBack/editUser',
                data: {
                    adminId: this.$store.state.userInfo.userId,
                    userId: this.$route.query.id
                }
            }).then((res) => {
                this.insertUcansAdmin.userAccount = res.obj.user.userAccount;
                this.insertUcansAdmin.nickname = res.obj.user.nickname;
                this.insertUcansAdmin.userPassword = res.obj.user.userPassword;
                this.treeRight = res.obj.permissionList;
                this.treeLeft = res.obj.allPermissionList;
                this.setLeftTreeChecked();
            });
        }
    },
    methods: {
        init() {
            this.selectAllPermission();
        },
        addUser() {
            this.$refs.formValidate.validate((valid) => {
                if (!this.$route.query.id) {
                    if (!this.isPassed) {
                        this.$Message.error(this.errInfo);
                        return false;
                    }
                }
                if (valid) {
                    this.insertUcansAdmin.permissionIdList = this.getTreeId();

                    let params = this.$tools.cloneObj(this.insertUcansAdmin);
                    let url = '';
                    if (this.$route.query.id) {
                        url = '/system-backend/userBack/updateUcansAdmin';
                        params.userId = this.$route.query.id;
                    } else {
                        url = '/system-backend/userBack/insertUcansAdmin';
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
        // 设置编辑后的选择回显
        setLeftTreeChecked() {
            let rightArr = [];
            let treeLeft = this.$tools.cloneObj(this.treeLeft);
            // 变成一维数组
            this.treeRight.forEach((item) => {
                rightArr.push(item);
                if (item.permissionList && item.permissionList.length > 0) {
                    rightArr.push(...item.permissionList);
                }
            });
            // 循环判断是否存在
            treeLeft.forEach((father) => {
                if (rightArr.find((item) => item.pid == father.pid)) {
                    if (father.permissionList.length > 0) {
                        father.permissionList.forEach((item) => {
                            if (rightArr.find((p) => p.pid == item.pid)) {
                                item.checked = true;
                            }
                        });
                    } else {
                        father.checked = true;
                    }
                }
            });
            this.treeLeft = this.$tools.cloneObj(treeLeft);
        },
        getTreeId() {
            let arrData = [];
            let data = this.treeRight;
            getFor(data);

            function getFor(arr) {
                arr.forEach((item) => {
                    arrData.push(item.permissionId);
                    if (item.permissionList && item.permissionList.length > 0) {
                        getFor(item.permissionList);
                    }
                });
            }

            return arrData.join(',');
        },
        /**
         * 获取权限列表
         */
        selectAllPermission() {
            let obj = [
                { permissionId: 1, name: '课程安排', pid: 0, permissionList: [] },
                {
                    permissionId: 2,
                    name: '用户管理',
                    pid: 0,
                    permissionList: [
                        { permissionId: 21, name: '用户', pid: 2 },
                        {
                            permissionId: 22,
                            name: '用户组',
                            pid: 2
                        },
                        { permissionId: 23, name: '用户审核', pid: 2 }
                    ]
                },
                { permissionId: 3, name: '企业管理', pid: 0, permissionList: [] },
                {
                    permissionId: 4,
                    name: '课程管理',
                    pid: 0,
                    permissionList: [
                        { permissionId: 41, name: '课程', pid: 4 },
                        {
                            permissionId: 42,
                            name: '上架审核',
                            pid: 4
                        },
                        { permissionId: 43, name: '视频库', pid: 4 },
                        {
                            permissionId: 44,
                            name: '分类管理',
                            pid: 4
                        },
                        { permissionId: 45, name: '考试管理', pid: 4 },
                        { permissionId: 46, name: '推荐管理', pid: 4 }
                    ]
                },
                {
                    permissionId: 5,
                    name: '订单管理',
                    pid: 0,
                    permissionList: [
                        { permissionId: 51, name: '课程订单', pid: 5 },
                        {
                            permissionId: 52,
                            name: '课程订单统计',
                            pid: 5
                        },
                        { permissionId: 53, name: '课时订单', pid: 5 },
                        { permissionId: 54, name: '退款审核', pid: 5 }
                    ]
                },
                {
                    permissionId: 6,
                    name: '数据统计',
                    pid: 0,
                    permissionList: [
                        { permissionId: 61, name: '课程消耗课时统计', pid: 6 },
                        {
                            permissionId: 62,
                            name: '考试统计',
                            pid: 6
                        },
                        { permissionId: 63, name: '认证用户课时统计', pid: 6 }
                    ]
                },
                {
                    permissionId: 7,
                    name: '回看管理',
                    pid: 0,
                    permissionList: [
                        { permissionId: 71, name: '回看设置', pid: 7 },
                        {
                            permissionId: 72,
                            name: '回看地址',
                            pid: 7
                        }
                    ]
                },
                {
                    permissionId: 8,
                    name: '消息管理',
                    pid: 0,
                    permissionList: [
                        { permissionId: 81, name: '通知', pid: 8 },
                        {
                            permissionId: 82,
                            name: '通知审核',
                            pid: 8
                        }
                    ]
                }
            ];
            // this.$fetch({
            //     url: '/system-backend/userBack/selectAllPermission'
            // }).then((res) => {
            //     if (res.code == 200) {
            this.treeLeft = obj;
            // } else {
            //     this.$message.success(res.msg);
            // }
            // });
        },
        /**
         * 获取已选择的权限
         * @param res
         */
        getSelectedNodes(res) {
            let a = this.$refs.tree.getCheckedAndIndeterminateNodes();
            let data = this.$tools.cloneObj(a);

            data.forEach((item) => {
                if (item.permissionList && !item.checked) {
                    item.permissionList = data.filter((list, index, arr) => list.pid == item.permissionId);
                }
            });
            data = data.filter((item) => item.pid == 0);

            this.treeRight = this.$tools.cloneObj(data);
        },
        /**
         * 渲染左边树形图
         * @param h
         * @param root
         * @param node
         * @param data
         * @returns {*}
         */
        renderTree(h, { root, node, data }) {
            return h('span', {}, [h('span', data.name)]);
        },
        /**
         * 渲染右边树形图
         * @param h
         * @param root
         * @param node
         * @param data
         * @returns {*}
         */
        renderTreeRight(h, { root, node, data }) {
            return h(
                'div',
                {
                    style: {
                        display: 'inline-block',
                        width: '90%'
                    }
                },
                [
                    h('span', [h('span', data.name)]),

                    h('Icon', {
                        class: {
                            fr: true,
                            pointer: true
                        },
                        attrs: {
                            type: 'md-close'
                        },
                        on: {
                            click: () => {
                                this.remove(root, node, data);
                            }
                        }
                    })
                ]
            );
        },
        remove(root, node, data) {
            let index = this.treeRight.indexOf(data);
            let treeData = this.$tools.cloneObj(this.treeLeft);
            let itemData = _.find(treeData, (item) => item.permissionId == data.permissionId);
            if (itemData) {
                itemData.checked = false;
                if (itemData.permissionList.length > 0) {
                    itemData.permissionList = itemData.permissionList.map((item) => {
                        item.checked = false;
                        return item;
                    });
                }
                this.treeLeft = treeData;
                this.treeRight.splice(index, 1);
            } else {
                const parentKey = root.find((el) => el === node).parent;
                const parent = root.find((el) => el.nodeKey === parentKey).node;
                let index = parent.permissionList.indexOf(data);
                parent.permissionList.splice(index, 1);

                let itemFater = _.find(treeData, (item) => item.permissionId == data.pid);
                itemFater.checked = false;
                itemFater.permissionList = itemFater.permissionList.map((item) => {
                    if (item.permissionId == data.permissionId) {
                        item.checked = false;
                    }

                    return item;
                });

                if (parent.permissionList.length == 0) {
                    itemFater.indeterminate = false;
                    let index = this.treeRight.indexOf(parent);
                    this.treeRight.splice(index, 1);
                }
                this.treeLeft = this.$tools.cloneObj(treeData);
            }
        },
        /**
         * 检查用户是否被注册
         */
        checkUser() {
            this.$refs.formValidate.validateField('userAccount', (err) => {
                if (err == '') {
                    this.$fetch({
                        url: '/system-backend/userBack/selectUserByAccount',
                        data: {
                            type: 1,
                            userAccount: this.insertUcansAdmin.userAccount,
                            enterpriseId: 0
                        }
                    }).then((res) => {
                        if (res.code == 200) {
                            if (res.obj.type == 1) {
                                this.$Message.error(res.msg);
                                this.errInfo = res.msg;
                                this.isPassed = false;
                            } else if (res.obj.type == 3) {
                                this.isPassed = true;
                                this.errInfo = res.msg;
                                this.insertUcansAdmin.userPassword = res.obj.password;
                                this.insertUcansAdmin.nickname = res.obj.nickname;
                                this.$Message.success(res.msg);
                            } else {
                                this.isPassed = true;
                                this.$Message.success(res.msg);
                            }
                        } else {
                            this.isPassed = false;
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

    .wrapper
        position: relative;
        width: 1150px;
        min-height: 500px;
        padding: 20px;
        background-color: #fff;
        margin: 0 auto;

        .right
            margin: 0 auto;
            position: relative;
            width: 650px;

            .title
                padding-bottom: 10px;
                border-bottom: 1px solid #e6e8ee;

        .left
            width: 370px;
            margin-right: 50px;

            .title
                padding-bottom: 10px;
                border-bottom: 1px solid #e6e8ee;

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
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #e6e8ee;

            .btn
                width: 115px;

        .icon-switch
            position: absolute
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%)
</style>
<style lang="stylus">
    .add-admin
        .tree
            > ul
                padding: 5px 0;
                padding-left: 15px;
                border-bottom: 1px solid #e7e9ee;
</style>
