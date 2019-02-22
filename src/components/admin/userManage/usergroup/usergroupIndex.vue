<template>
    <div class="usergroupIndex two-page">
        <div class="btn-box">
            <Button type="primary" @click="$router.push({path:'/userGroup/addUserGroup'})">创建用户组</Button>
            <Button @click="groupAddUser" type="primary"  :disabled="selectedTableList.length!=1">添加用户</Button>
        </div>

        <div class="search-box clearfix">
            <Form class="fr"  :model="search"  inline>
                <FormItem v-if="$store.getters.isAdmins" >
                    <Select   v-model="search.enterpriseId" style="width:200px" placeholder="按企业筛选">
                        <Option v-for="item in enterpriseArr" :value="item.enterpriseId" :key="item.enterpriseId">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <i-input @on-search="searchTableData" class="search" v-model.trim="search.search" search enter-button placeholder="输入用户组名称"></i-input>
                </FormItem>
            </Form>
        </div>
        <div class="tableList">
            <Table @on-sort-change="tableSorting" @on-selection-change="selectedTable" :columns="table.columns" :data="table.data"></Table>
        </div>
        <div class="clearfix page-info">
            <div class="fl">已选{{selectedTableList.length}}项,共{{table.total}}项</div>
            <myPage class="fr page" @on-change="changePage" :count="count"></myPage>
            <div class="fr">每页显示行:10行</div>
        </div>
        <!--dialog-->
        <div>
            <MyDialog :title="'删除'" @ok="deleteUserGroup" :visible.sync="isDeleteUserGroup">
                <div style="text-align: center;font-weight: bold;height: 60px;line-height: 60px;">确定要删除该用户组?</div>
            </MyDialog>
            <MyDialog width="780"  @ok="updateGroupUser" class-name="add-user" :title="'添加用户'" :visible.sync="addUser">
                <div style="text-align: left">
                    <myAddUser  @updateList="getUserList" ref="addUser" :userList.sync="userList" :userListSelected.sync="userListSelected"></myAddUser>
                </div>
            </MyDialog>
            <MyDialog width="400" class-name="add-user" :title="groupItem.title" :visible.sync="groupItem.visible">
                <div style="text-align: left;">
                    <h4>组成员({{groupItem.data.length}})</h4>
                    <Input v-model="groupItem.search" @on-search="getGrouPeopleNumber" style="margin-bottom: 10px;" search enter-button placeholder="输入用户名 / 昵称" />
                    <Table height="350" :columns="groupItem.columns" :data="groupItem.data"></Table>
                </div>
                <div slot="footer"></div>
            </MyDialog>
        </div>
    </div>

</template>

<script>
import addUser from './addUser';

export default {
    name: 'user',
    components: {
        myAddUser: addUser
    },
    data() {
        return {
            tableIndex: 0,
            userListSelected: [],
            departmentList: [],
            userList: [],
            groupItem: {
                visible: false,
                title: '',
                number: '',
                search: '',
                data: [],
                gropuId: '',
                columns: [
                    {
                        title: '用户名',
                        key: 'userAccount',
                        align: 'center'
                    },
                    {
                        title: '昵称',
                        key: 'nickname',
                        align: 'center'
                    }
                ]
            },
            isUserList: false,
            addUser: false,
            isDeleteUserGroup: false,
            count: 1,
            selectedTableList: [],
            table: {
                total: 0,
                data: [],
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '编号',
                        width: 80,
                        key: 'groupId',
                        align: 'center'
                    },

                    {
                        title: '用户组名称',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '备注',
                        key: 'description',
                        align: 'center'
                    },
                    {
                        title: '所属企业',
                        key: 'enterpriseName',
                        align: 'center'
                    },
                    {
                        title: '人数',
                        key: 'number',
                        align: 'center',
                        className: 'number',
                        render: (h, params) => {
                            return h('div', [
                                h(
                                    'span',
                                    {
                                        props: {
                                            type: 'text',
                                            size: 'small'
                                        },
                                        attrs: {
                                            // disabled: !params.row.isAlive
                                        },
                                        class: {
                                            textBlue: true,
                                            pointer: true
                                        },
                                        style: {
                                            textAlign: 'center'
                                        },
                                        on: {
                                            click: () => {
                                                this.showGruopPeopleNumber(params.row);
                                            }
                                        }
                                    },
                                    params.row.number
                                )
                            ]);
                        }
                    },

                    {
                        title: '创建时间',
                        key: 'createTime',
                        sortable: 'custom',
                        align: 'center',
                        sortType: 'desc',
                        className: 'fontBlue'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            let text = params.row.isAlive ? '编辑' : '编辑';
                            let color = params.row.isAlive ? '#11ba9e' : '#11ba9e';
                            return h('div', [
                                h(
                                    'Button',
                                    {
                                        props: {
                                            type: 'text',
                                            size: 'small'
                                        },
                                        attrs: {
                                            // disabled: !params.row.isAlive
                                        },
                                        class: {
                                            fl: true,
                                            bar: params.row.isAlive
                                        },
                                        style: {
                                            width: '50px',
                                            marginRight: '5px',
                                            color: color,
                                            textAlign: 'center'
                                        },
                                        on: {
                                            click: () => {
                                                this.$router.push({
                                                    path: '/userGroup/addUserGroup',
                                                    query: { id: params.row.groupId }
                                                });
                                            }
                                        }
                                    },
                                    text
                                ),
                                h(
                                    'Button',
                                    {
                                        class: {
                                            fr: true
                                        },
                                        props: {
                                            type: 'text',
                                            size: 'small',
                                            textAlign: 'center'
                                        },
                                        style: {
                                            marginRight: '5px',
                                            color: '#d41e3c'
                                        },
                                        on: {
                                            click: () => {
                                                this.tableIndex = params.index;
                                                this.isDeleteUserGroup = true;
                                            }
                                        }
                                    },
                                    '删除'
                                )
                            ]);
                        }
                    }
                ]
            },

            enterpriseArr: [],
            search: {
                pageNo: 1, //  分页起始
                pageSize: 10, //  分页条
                enterpriseId: this.$tools.defaultAll, //  筛选：企业id
                search: '', //  搜索
                orderRule: '' //  时间排序规则  默认 desc 降序  ，asc  升序
            }
        };
    },
    activated() {
        this.init();
    },
    mounted() {},
    methods: {
        init() {
            if (this.$store.getters.isAdmins) {
                this.getenterpriseList();
            } else {
                this.search.enterpriseId = this.$store.state.userInfo.enterpriseId;
            }
            this.getTableList();
            this.filterTableColumns('所属企业');
        },

        /**
         * 获取企业列表
         * @returns {Promise<void>}
         */
        async getenterpriseList() {
            let data = await this.$fetch({
                url: '/system-backend/userBack/selectEnterpriseList',
                data: {
                    isHave: 0
                }
            });
            this.enterpriseArr = data.obj;
            this.enterpriseArr.unshift(this.ALLSelect.enterprise1);
        },
        /**
         *  获取表格数据
         */
        getTableList() {
            this.$fetch({
                url: '/system-backend/groupBack/selectGroupList',
                data: this.search
            }).then((res) => {
                this.table.data = res.obj.groupVOPageInfo.list.map((item) => {
                    item.enterpriseName = item.enterprise.name;
                    return item;
                });
                this.table.total = res.obj.groupVOPageInfo.total;
                // this.count = res.
            });
        },
        searchTableData() {
            this.tableIndex = 1;
            this.getTableList();
        },
        showGruopPeopleNumber(list) {
            this.groupItem.gropuId = list.groupId;
            this.groupItem.title = list.name;
            this.groupItem.visible = true;
            this.getGrouPeopleNumber();
        },
        getGrouPeopleNumber() {
            this.$fetch({
                url: '/system-backend/groupBack/selectUserListByGroupIdAndSearch',
                data: {
                    groupId: this.groupItem.gropuId,
                    search: this.groupItem.search
                }
            }).then((res) => {
                this.groupItem.data = res.obj.groupUserList;
            });
        },
        groupAddUser() {
            this.addUser = true;
            this.getUserList();
        },
        async getUserList() {
            this.departmentList = [];
            this.userListSelected = [];
            this.userList = [];
            let that = this;
            function getUserList() {
                return that.$fetch({
                    url: '/system-backend/groupBack/selectEnterpriseUserList',
                    data: {
                        enterpriseId: that.selectedTableList[0].enterpriseId,
                        department: that.$refs.addUser.department,
                        search: that.$refs.addUser.search
                    }
                });
            }

            function getUserListSelected() {
                return that.$fetch({
                    url: '/system-backend/groupBack/selectUserListByGroupIdAndSearch',
                    data: {
                        groupId: that.selectedTableList[0].groupId,
                        search: that.$refs.addUser.search
                    }
                });
            }
            this.$fetch.all([getUserList(), getUserListSelected()]).then(
                this.$fetch.spread(function(userListRes, userListSelectedRes) {
                    console.log(userListRes, userListSelectedRes);
                    that.userList = userListRes.obj.userList;
                    that.userListSelected = userListSelectedRes.obj.groupUserList;
                })
            );
            //  this.userList = userListRes.obj.userList;
            // .then((res) => {
            //      this.userListSelected = res.obj.groupUserList;
            //  });
        },
        updateGroupUser() {
            this.$fetch({
                url: '/system-backend/groupBack/insertUserListIntoGroup',
                data: {
                    adminId: this.$store.state.userInfo.userId,
                    groupId: this.selectedTableList[0].groupId,
                    userIdList: this.$refs.addUser.userListSelected.map((item) => item.userId).join(',')
                }
            }).then((res) => {
                if (res.code == 200) {
                    this.$Message.success(res.msg);
                    this.addUser = false;
                    this.getTableList();
                } else {
                    this.$Message.error(res.msg);
                }
            });
        },
        selectedTable(list) {
            this.selectedTableList = list;
        },
        changePage(index) {
            this.search.pageNo = index;
            this.getTableList();
        },
        handleSubmit(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$Message.success('Success!');
                } else {
                    this.$Message.error('Fail!');
                }
            });
        },
        deleteUserGroup() {
            this.$fetch({
                url: '/system-backend/groupBack/deleteGroupBatch',
                data: {
                    adminId: this.$store.state.userInfo.userId,
                    groupIdList: this.table.data[this.tableIndex].groupId
                }
            }).then((res) => {
                if (res.code == 200) {
                    this.$Message.success(res.msg);
                    this.isDeleteUserGroup = false;
                    this.getTableList();
                } else {
                    this.$Message.error(res.msg);
                }
            });
        },
        tableSorting({ column, key, order }) {
            this.search.orderRule = order;
            this.getTableList(0);
        }
    }
};
</script>

<style scoped lang="stylus">
    .search
        width: 300px;

    .user-box
        width: 340px;
        height: 380px;
        border: 1px solid #e6e8ee;
        overflow: auto;

        .ivu-checkbox-group-item, li
            height: 50px;
            line-height: 50px;
            padding-left: 10px;
            display: block;
            input
                margin-right: 20px;
        li
            padding-left: 25px;
            border-bottom: 1px solid #e8eaef;
            position: relative
            .close
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                right: 15px;
                cursor: pointer;
</style>
<style lang="stylus">
    .usergroupIndex
        .ivu-input-search
            border: 1px solid #d1d2d3 !important;
            padding: 0 4px !important;
            width: 25px;
            background-color: #fff !important;
            i
                color: #117dd6;
        .page-info
            border-top: 1px solid #d1d5de;
            margin-top: 30px;
            .page
                margin-top: 20px;
                margin-left: 25px;
            > div
                margin-top: 18px;
                height: 30px;
                line-height: 30px;

    .ivu-table-body
        .number
            color: #0c6bba;

    .add-group.dialog
        .ivu-modal-body
            background-color: #fff;
            padding: 0

    .add-user-type.dialog
        .ivu-modal-body
            background-color: transparent;
        .list
            div
                height: 90px;
                line-height 90px;
                background-color: #f0f4f7;
                margin-bottom: 10px;
                cursor: pointer;
                color: #000;
                &:hover
                    background-color: #dceaf5

    .user-box
        width: 340px;
        height: 380px;
        border: 1px solid #e6e8ee;
        overflow: auto;
        .ivu-checkbox-group-item
            height: 50px;
            line-height: 50px;
            padding-left: 10px;
            display: block;
            border-bottom: 1px solid #f2f2f2;
            .ivu-checkbox
                margin-right: 20px;

    .dialog.add-user
        .ivu-modal-body
            background-color: transparent;

        .ivu-input-search
            border: 1px solid #d1d2d3 !important;
            padding: 0 4px !important;
            width: 25px;
            background-color: #fff !important;
            i
                color: #117dd6;
         .ivu-input
             background-color: #fff
</style>
