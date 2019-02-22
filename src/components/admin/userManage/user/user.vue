<template>
    <div class="user two-page  bgfff">
        <div class="btn-box">
            <Button type="primary" @click="addUserType">创建用户</Button>
            <Button @click="isImportUser = true" v-if="adminType==0 || adminType == 1" type="primary">导入用户</Button>
            <Upload v-if="adminType==2 || adminType == 3"
                    style="display: inline-block;margin-right: 20px;"
                    :show-upload-list="false"
                    :before-upload="beforeUpload"
                    :on-success="uploadSuccess"
                    :data="uploadData"
                    accept=".xlsx"
                    name="multipartFile"
                    action="/system-backend/userBack/excelImport">
                <Button type="primary">导入用户</Button>
            </Upload>

            <Button type="primary" @click="download">下载模板</Button>
            <Button @click="selectGroup" type="primary" :disabled="!selectedTable.flag ">添加到组</Button>
            <Button v-if="$store.getters.isAdmins" @click="goOpenClass" type="primary"
                    :disabled="selectedTable.list.length !=1 ">开课认证
            </Button>
        </div>
        <div class="search-box clearfix">
            <Form class="fr" ref="formInline" :model="search" inline>
                <FormItem prop="userType">
                    <Select v-model="search.userType" style="width:200px" placeholder="用户类型">
                        <Option v-for="item in  userTypeArr" :value="item.value" :key="item.value">{{ item.label }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem prop="authType" v-if="$store.getters.isAdmins">
                    <Select v-model="search.authType" style="width:200px" placeholder="认证类型">
                        <Option v-for="item in authTypeArr" :value="item.value" :key="item.value">{{ item.label }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem prop="enterpriseId" v-if="$store.getters.isAdmins">
                    <Select v-model="search.enterpriseId" style="width:200px" placeholder="按企业筛选">
                        <Option v-for="item in enterpriseArr" :value="item.enterpriseId" :key="item.enterpriseId">{{
                            item.name }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <i-input @on-search="searchTableData" v-model.trim="search.search" class="search" search
                             enter-button
                             placeholder="输入用户名/昵称"></i-input>
                </FormItem>
            </Form>
        </div>

        <div class="tableList">
            <Table :row-class-name="rowClassName" @on-sort-change="tableSorting" class=""
                   @on-selection-change="tableSelected" :columns="table.columns"
                   :data="table.data"></Table>
        </div>
        <div class="clearfix page-info">
            <div class="fl">已选{{selectedTable.list.length}}项,共{{table.total}}项</div>
            <myPage class="fr page" :page="search.pageNo" @on-change="changePage" :count="count"></myPage>
            <div class="fr">每页显示行:10行</div>
        </div>
        <!--dialog-->
        <div>
            <MyDialog class-name="add-group" width="780" @ok="insertUserListIntoGroup" :title="'添加到组'"
                      :visible.sync="isAddGroup">
                <div class="clearfix" style="text-align: left;">
                    <div class="fl">
                        <p>用户组</p>
                        <div class=" user-box">
                            <CheckboxGroup v-model="social" @on-change="getSelectedNodes">
                                <Checkbox :label="index" v-for="(item,index) in userGroup.list" :key="index">
                                    <span>{{item.name}}</span>
                                </Checkbox>
                            </CheckboxGroup>
                        </div>
                    </div>
                    <img class="icon-switch" src="./img/switch.png" alt="">
                    <div class="fr">
                        <p>已选择</p>
                        <ul class=" user-box">
                            <li v-for="(item,index) in  userGroup.selected">
                                {{item.name}}
                                <Icon @click="deleteUserGroup(item,index)" class="close" type="md-close"/>
                            </li>
                        </ul>
                    </div>
                </div>
            </MyDialog>
            <MyDialog class-name="add-user-type" width="480" :title="'选择新建用户类型'" :visible.sync="isAddUserType">
                <div @click="isAddUserType = false" class="clearfix list" style="">
                    <router-link to="/user/addAdmin" v-if="$store.getters.isSuperAdmin" tag="div">
                        <img class="img-icon" src="./img/c.png" alt="">
                        <span>管理员</span>
                    </router-link>
                    <router-link to="/user/addEnterpriseUser" tag="div">
                        <img class="img-icon" src="./img/b.png" alt="">
                        <span>企业管理员</span>
                    </router-link>
                    <router-link to="/user/addPersonalUsers" tag="div">
                        <img class="img-icon" src="./img/a.png" alt="">
                        <span>个人用户</span>
                    </router-link>
                </div>
                <div slot="footer"></div>
            </MyDialog>
            <MyDialog :title="'离职'" @ok="leaveUser" :visible.sync="isQuit">
                <div style="text-align: center;font-weight: bold;height: 60px;line-height: 60px;">确定该用户已经离职?</div>
            </MyDialog>
            <MyDialog :title="'删除'" @ok="deleteUser" :visible.sync="isDeleteUser">
                <div style="text-align: center;font-weight: bold;height: 60px;line-height: 60px;">确定要删除该用户?</div>
            </MyDialog>
            <MyDialog :title="'导入用户'" class-name="import-user" :visible.sync="isImportUser">
                <Select v-model="uploadData.enterpriseId" style="width:200px" placeholder="选择企业">
                    <Option v-for="item in enterpriseArr" :value="item.enterpriseId" :key="item.enterpriseId">{{
                        item.name }}
                    </Option>
                </Select>
                <div slot="footer">
                    <Button @click="isImportUser=false">取消</Button>
                    <Upload style="display: inline-block;margin-right: 20px;"
                            :show-upload-list="false"
                            :before-upload="beforeUpload"
                            :data="uploadData"
                            accept=".xlsx"
                            :on-success="uploadSuccess"
                            name="multipartFile"
                            action="/system-backend/userBack/excelImport">
                        <Button :disabled="uploadData.enterpriseId == '' &&uploadData.enterpriseId!=0 " type="primary">
                            确定
                        </Button>
                    </Upload>
                </div>
            </MyDialog>

        </div>
    </div>

</template>

<script>
export default {
    name: 'user',
    data() {
        return {
            adminType: this.$store.state.adminType,
            uploadData: {
                enterpriseId: ''
            },
            index: 0,
            isDeleteUser: false,
            isImportUser: false,
            isQuit: false,
            social: [],
            isAddGroup: false,
            isAddUserType: false,
            count: 0,
            userGroup: {
                list: [],
                tmp: [],
                selected: []
            },
            selectedTable: {
                flag: false,
                list: [],
                enterprise: ''
            },
            userTypeArr: [],
            table: {
                total: 0,
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '编号',
                        width: 80,
                        key: 'userId',
                        align: 'center'
                    },
                    {
                        title: '昵称',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '用户名',
                        key: 'account',
                        align: 'center'
                    },
                    {
                        title: '所属企业',
                        key: 'enterprise',
                        align: 'center'
                    },
                    {
                        title: '开课认证',
                        key: 'address',
                        align: 'center',
                        // className: 'fontBlue',
                        render: (h, params) => {
                            let color = params.row.auth == 1 ? '#f96e1a' : '#ddd';
                            return h('svg', {
                                class: {
                                    icon: true
                                },
                                style: {
                                    color: color
                                },
                                attrs: {
                                    ariaHidden: 'true'
                                },
                                domProps: {
                                    innerHTML: ' <use xlink:href="#icon-true"></use>'
                                }
                            });
                        }
                    },
                    {
                        title: '用户类型',
                        key: 'userType',
                        align: 'center'
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
                        minWidth: 80,
                        align: 'center',
                        render: (h, params) => {
                            // 0 离职 1 已离职 2 不显示 3 删除
                            let text = '';
                            let color = '';
                            let n = params.row.leaved;
                            let display = 'inline-block';
                            if (n == 0) {
                                text = '离职';
                                color = '#d73a50';
                            } else if (n == 1) {
                                text = '已离职';
                                color = '#949494';
                            } else if (n == 2) {
                                text = '';
                                display = 'none';
                            } else if (n == 3) {
                                text = '删除';
                                color = '#d73a50';
                            }
                            return h('div', [
                                h(
                                    'Button',
                                    {
                                        props: {
                                            type: 'text',
                                            size: 'small'
                                        },
                                        attrs: {},
                                        class: {
                                            bar: params.row.isAlive
                                        },
                                        style: {
                                            width: '50px',
                                            color: '#32bfa5',
                                            textAlign: 'center'
                                        },
                                        on: {
                                            click: () => {
                                                let path = '';
                                                if (params.row.userType == '企业管理员') {
                                                    path = '/user/addEnterpriseUser';
                                                } else if (params.row.userType == '个人用户') {
                                                    path = '/user/addPersonalUsers';
                                                } else if (params.row.userType == '友看管理员') {
                                                    path = '/user/addAdmin';
                                                }
                                                this.$router.push({
                                                    path: path,
                                                    query: { id: params.row.userId }
                                                });
                                            }
                                        }
                                    },
                                    '编辑'
                                ),
                                h(
                                    'Button',
                                    {
                                        class: {},
                                        props: {
                                            type: 'text',
                                            size: 'small',
                                            textAlign: 'center'
                                        },
                                        style: {
                                            display: display,
                                            width: '50px',
                                            marginRight: '5px',
                                            color: color
                                        },
                                        on: {
                                            click: () => {
                                                this.userTypeFn(params.row, params.index);
                                            }
                                        }
                                    },
                                    text
                                )
                            ]);
                        }
                    }
                ],
                data: []
            },
            authTypeArr: [
                // 用户类型
                { label: '全部认证类型', value: this.$tools.defaultAll },
                { label: '个人', value: 1 },
                { label: '企业', value: 2 }
            ],
            enterpriseArr: [],
            search: {
                adminId: this.$store.state.userInfo.userId, // 管理员的userId
                pageNo: 1, //  分页起始
                pageSize: 10, //  分页条数
                userType: this.$tools.defaultAll, //  筛选：用户类型
                authType: this.$tools.defaultAll, //  筛选：认证类型
                enterpriseId: this.$tools.defaultAll, //  筛选：企业id
                search: '', //  搜索
                orderRule: '' //  时间排序规则  默认 desc 降序  ，asc  升序
            },
            enterpriseAdminIdArr: []
        };
    },
    activated() {
        if (this.$store.getters.isEnterprise) {
            this.selectEnterpriseAdminByEnterprseId(this.init);
        } else {
            this.init();
        }
    },
    mounted() {
        if (this.$store.getters.isSuperAdmin) {
            this.userTypeArr = [
                { label: '全部用户类型', value: this.$tools.defaultAll },
                { label: '个人用户', value: 1 },
                { label: '企业管理员', value: 2 },
                { label: '管理员', value: 3 }
            ];
        } else if (this.$store.getters.isAdmin) {
            this.userTypeArr = [
                { label: '全部用户类型', value: this.$tools.defaultAll },
                { label: '个人用户', value: 1 },
                { label: '企业管理员', value: 2 }
            ];
        } else {
            this.userTypeArr = [
                { label: '全部用户类型', value: this.$tools.defaultAll },
                { label: '在职', value: 4 },
                { label: '外部', value: 5 },
                { label: '离职', value: 6 }
            ];
        }
    },
    methods: {
        init() {
            this.getenterpriseList();
            this.getTableData();
            this.filterTableColumns();
        },
        filterTableColumns() {
            if (this.$store.getters.isEnterprise) {
                this.table.columns = this.table.columns.filter((item) => {
                    return item.title != '开课认证';
                });
            }
        },
        /**
         * 用户点击函数
         */
        userTypeFn(row, index) {
            this.index = index;
            if (row.leaved == 0) {
                this.isQuit = true;
            } else if (row.leaved == 3) {
                this.isDeleteUser = true;
            }
        },
        addUserType() {
            if (this.$store.getters.isAdmins) {
                this.isAddUserType = true;
            } else {
                this.$router.push({ path: '/user/addPersonalUsers' });
            }
        },
        /**
         *  删除用户
         */
        deleteUser(row, index) {
            this.$fetch({
                url: '/system-backend/userBack/deleteUser',
                data: {
                    adminId: this.$store.state.userInfo.userId,
                    userIdList: this.table.data[this.index].userId
                }
            }).then((res) => {
                if (res.code == 200) {
                    this.getTableData();
                    this.$Message.success(res.msg);
                    this.isDeleteUser = false;
                } else {
                    this.$Message.error(res.msg);
                }
            });
        },
        /**
         * 表格选择
         */
        tableSelected(list) {
            this.selectedTable.list = list;
            if (this.selectedTable.list.length != 0) {
                this.selectedTable.flag = this.selectedTable.list.every((item) => {
                    return (
                        item.enterpriseId == this.selectedTable.list[0].enterpriseId &&
                        item.leaved != 1 &&
                        item.leaved != 2
                    );
                });
                this.selectedTable.enterprise = this.selectedTable.list[0].enterpriseId;
            } else {
                this.selectedTable.flag = false;
            }
        },
        /**
         *  获取组列表
         */
        selectGroup() {
            this.isAddGroup = true;
            this.$fetch({
                url: '/system-backend/groupBack/selectGroup',
                data: {
                    enterpriseId: this.selectedTable.enterprise
                }
            }).then((res) => {
                this.userGroup.list = res.obj;
            });
        },
        deleteUserGroup(item, index) {
            let i = this.userGroup.selected.indexOf(item);
            this.userGroup.selected.splice(index, 1);
            this.social.splice(i, 1);
        },
        /**
         * 获取已选择的权限
         * @param res
         */
        getSelectedNodes(res) {
            this.social.sort();
            this.userGroup.selected = this.social.map((item) => {
                return this.userGroup.list[item];
            });
        },
        uploadSuccess(res, file, fileList) {
            if (res.code == 200) {
                this.$Message.success(res.msg);
                this.getTableData();
                this.isImportUser = false;
            } else {
                this.$Message.error({
                    content: res.msg,
                    duration: 10,
                    closable: true
                });
            }
        },
        beforeUpload(file) {
            if (!this.uploadData.enterpriseId) {
                this.uploadData.enterpriseId = this.$store.state.userInfo.enterpriseId;
            }
            this.uploadData.adminId = this.$store.state.userInfo.userId;
        },
        insertUserListIntoGroup() {
            this.$fetch({
                url: '/system-backend/groupBack/insertUserListIntoGroupList',
                data: {
                    adminId: this.$store.state.userInfo.userId,
                    groupIdList: this.userGroup.selected.map((item) => item.groupId).join(','),
                    userIdList: this.selectedTable.list.map((item) => item.userId).join(',')
                }
            }).then((res) => {
                if (res.code == 200) {
                    this.isAddGroup = false;
                    this.$Message.success(res.msg);
                } else {
                    this.$Message.error(res.msg);
                }
            });
        },
        /**
         *  用户离职
         */
        leaveUser() {
            this.$fetch({
                url: '/system-backend/userBack/leaveUser',
                data: {
                    adminId: this.$store.state.userInfo.userId,
                    userIdList: this.table.data[this.index].userId
                }
            }).then((res) => {
                if (res.code == 200) {
                    this.table.data[this.index].leaved = 1;
                }
                this.isQuit = false;
                this.$Message.success(res.msg);
            });
        },
        searchTableData() {
            this.search.pageNo = 1;
            this.getTableData();
        },
        /**
         *  获取表格数据
         */
        getTableData() {
            this.$fetch({
                url: '/system-backend/userBack/selectUserList',
                data: this.search
            }).then((res) => {
                this.table.data = res.obj.pageInfo.list;
                this.count = res.obj.pageInfo.pages;
                this.table.total = res.obj.pageInfo.total;
                this.selectedTable.flag = false;
                this.selectedTable.list = [];
            });
        },
        /**
         * 获取企业列表
         * @returns {Promise<void>}
         */
        async getenterpriseList() {
            if (!this.$store.getters.isAdmins) {
                return false;
            }
            let data = await this.$fetch({
                url: '/system-backend/userBack/selectEnterpriseList',
                data: {
                    isHave: 0
                }
            });
            this.enterpriseArr = data.obj;
            this.enterpriseArr.unshift(this.ALLSelect.enterprise1);
        },
        tableSorting({ column, key, order }) {
            this.search.orderRule = order;
            this.getTableData(0);
        },
        goOpenClass() {
            this.$router.push({
                path: `/user/openClass/${this.selectedTable.list[0].userId}`
            });
        },
        changePage(index) {
            this.search.pageNo = index;
            this.getTableData();
        },
        download() {
            window.open('/system-backend/userBack/downloadTemplate');
        },
        selectEnterpriseAdminByEnterprseId(cb) {
            this.$fetch({
                url: '/system-backend/userBack/selectEnterpriseAdminByEnterprseId',
                data: {
                    enterpriseId: this.$store.state.userInfo.enterpriseId
                }
            }).then((res) => {
                this.enterpriseAdminIdArr = res.obj;
                cb && cb();
            });
        },
        rowClassName(row, index) {
            if (this.enterpriseAdminIdArr.find((item) => item == row.userId)) {
                console.log(row.userId, index);
                return 'blueSize';
            }
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

    .img-icon
        vertical-align: middle;
        margin-right: 20px;
        margin-top: -10px;

    .icon-switch
        position: absolute
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%)
</style>
<style lang="stylus">
    .user
        .ivu-input-search
            border: 1px solid #d1d2d3 !important;
            padding: 0 4px !important;
            width: 25px;
            background-color: #fff !important;

            i
                color: #117dd6;
        .blueSize
            color: #117dd6;

    //模态框
    .add-group.dialog
        .ivu-modal-body
            background-color: #fff;
            padding: 0

    .import-user.dialog
        .ivu-select-selection
            border: 1px solid #999
            background-color: inherit

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
</style>
