<template>
    <div class="userAudit two-page">
        <div class="btn-box">
            <Button  class="agree" :disabled="disabled" @click="agreeListShow" type="primary">同意</Button>
            <Button class="refuse" :disabled="disabled" @click="disagreeListShow" type="error">拒绝</Button>

        </div>
        <div class="search-box clearfix">
            <Form class="fr" ref="formInline" :model="search"  inline>
                <FormItem prop="" v-if="$store.getters.isAdmins">
                    <Select v-model="search.enterpriseId" style="width:200px" placeholder="按企业筛选">
                        <Option v-for="item in enterPriseArr" :value="item.enterpriseId" :key="item.enterpriseId">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem prop="">
                    <Select v-model="search.userType" style="width:200px" placeholder="待审核用户">
                        <Option v-for="item in userTypeArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <i-input class="search" @on-search="searchTableData" v-model.trim="search.search" search enter-button placeholder="输入用户组名称"></i-input>
                </FormItem>
            </Form>
        </div>

        <div class="tableList">
            <Table @on-sort-change="tableSorting" @on-selection-change="selectTable" :columns="table.columns" :data="table.data"></Table>
        </div>
        <div class="clearfix page-info">
            <div class="fl">已选{{table.selectedData.length}}项,共{{table.total}}项</div>
            <myPage class="fr page" :page="search.pageNo" @on-change="changePage" :count="count"></myPage>
            <div class="fr">每页显示行:10行</div>
        </div>
        <!--dialog-->
        <div>
            <MyDialog  @ok="checkUser"  :title="'同意'" :visible.sync="isAgree">
                <div style="height: 70px;line-height: 70px;">
                    同意该用户加入您的企业?
                </div>
            </MyDialog>
            <MyDialog   :title="'拒绝'" :visible.sync="isReject">
                <div style="height: 85px;line-height: 85px;">
                    拒绝该用户加入您的企业?
                </div>
                <div slot="footer">
                    <Button @click="isReject =false">取消</Button>
                    <Button class="refusee" @click="checkUser" type="error">拒绝</Button>

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
            disabled: true,
            checked: {
                idList: [],
                agree: false
            },
            search: {
                pageNo: 1, //  分页起始
                pageSize: 10, //  分页条
                userType: 3,
                enterpriseId: this.$tools.defaultAll, //  筛选：企业id
                search: '', //  搜索
                orderRule: '' //  时间排序规则  默认 desc 降序  ，asc  升序
            },
            userTypeArr: [
                { value: 3, label: '全部用户状态' },
                { value: 0, label: '审核未通过' },
                { value: 1, label: '审核通过' },
                { value: 2, label: '待审核' }
            ],
            enterPriseArr: [],
            isAgree: false,
            isReject: false,
            isAddGroup: false,
            isAddUserType: false,
            count: 0,
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
                        key: 'id',
                        align: 'center'
                    },

                    {
                        title: '姓名/昵称',
                        key: 'name',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', {}, params.row.user.nickname);
                        }
                    },
                    {
                        title: '用户名',
                        align: 'center',
                        render: (h, params) => {
                            let name = params.row.user ? params.row.user.userAccount : '';
                            return h('div', {}, name);
                        }
                    },
                    {
                        title: '申请备注',
                        key: 'description',
                        align: 'center'
                    },
                    {
                        title: '更换企业',
                        align: 'center',
                        render: (h, params) => {
                            let name = params.row.enterprise ? params.row.enterprise.name : '';
                            return h('div', {}, name);
                        }
                    },
                    {
                        title: '申请时间',
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

                            return h('div', [
                                h(
                                    'span',
                                    {
                                        class: {
                                            hide: params.row.status != 0
                                        },
                                        style: {
                                            color: '#949494',
                                            textAlign: 'center'
                                        }
                                    },
                                    '审核未通过'
                                ),
                                h(
                                    'span',
                                    {
                                        class: {
                                            hide: params.row.status != 1
                                        },
                                        style: {
                                            textAlign: 'center'
                                        }
                                    },
                                    '审核通过'
                                ),
                                h(
                                    'span',
                                    {
                                        class: {
                                            fl: true,
                                            hide: params.row.status != 2,
                                            pointer: true
                                        },
                                        style: {
                                            width: '50px',
                                            color: '#11ba9e',
                                            textAlign: 'center'
                                        },
                                        on: {
                                            click: () => {
                                                this.agreeItem(params.row);
                                            }
                                        }
                                    },
                                    '同意'
                                ),
                                h(
                                    'span',
                                    {
                                        class: {
                                            fl: true,
                                            hide: params.row.status != 2,
                                            pointer: true
                                        },
                                        style: {
                                            width: '50%',
                                            color: '#d41e3c',
                                            textAlign: 'center'
                                        },
                                        on: {
                                            click: () => {
                                                this.disagreeItem(params.row);
                                            }
                                        }
                                    },
                                    '拒绝'
                                )
                            ]);
                        }
                    }
                ],
                data: [],
                selectedData: []
            }
        };
    },
    mounted() {
        this.init();
        this.hello();
    },
    methods: {
        init() {
            if (this.$store.getters.isAdmins) {
                this.getenterpriseList();
            } else {
                this.search.enterpriseId = this.$store.state.userInfo.enterpriseId;
            }
            this.getTableData();
            this.filterTableColumns('更换企业');
        },

        getTableData() {
            this.$fetch({
                url: '/system-backend/userBack/checkUserList',
                data: this.search
            }).then((res) => {
                this.table.data = res.obj.list;
                this.count = res.obj.pages;
                this.table.total = res.obj.total;
            });
        },
        selectTable(list) {
            this.table.selectedData = list;
            console.log(list)
            if (list.length == 0) {
                this.disabled = true;
            } else {
                this.disabled = list.every((item) => {
                    return item.status != 2;
                });
            }
        },
        searchTableData() {
            this.search.pageNo = 1;
            this.getTableData();
        },
        agreeItem(list) {
            this.checked.idList = [list.id];
            this.checked.agree = true;
            this.isAgree = true;
        },
        disagreeItem(list) {
            this.checked.idList = [list.id];
            this.checked.agree = false;
            this.isReject = true;
        },
        checkUser() {
            let params = this.$tools.cloneObj(this.checked);
            params.idList = params.idList.join(',');
            this.$fetch({
                url: '/system-backend/userBack/checkUser',
                data: params
            }).then((res) => {
                if (res.code == 200) {
                    this.$Message.success(res.msg);
                    this.isAgree = false;
                    this.isReject = false;
                    this.getTableData();
                } else {
                    this.$Message.error(res.msg);
                }
            });
        },

        agreeListShow() {
            if (this.table.selectedData.length != 0) {
                this.isAgree = true;
                this.checked.agree = true;
                this.checked.idList = this.table.selectedData.map((item) => item.id);
            }
        },
        disagreeListShow() {
            if (this.table.selectedData.length != 0) {
                this.isReject = true;
                this.checked.agree = false;
                this.checked.idList = this.table.selectedData.map((item) => item.id);
            }
        },
        agreeList() {},
        disagreeList() {},
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
            this.enterPriseArr = data.obj;
            this.enterPriseArr.unshift(this.ALLSelect.enterprise1);
        },
        changePage(index) {
            this.search.pageNo = index;
            this.getTableData();
        },
        tableSorting({ column, key, order }) {
            this.search.orderRule = order;
            this.getTableData();

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
    .userAudit
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
</style>
