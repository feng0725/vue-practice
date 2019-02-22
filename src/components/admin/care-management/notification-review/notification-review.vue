<template>
    <div class="notification-review two-page">
        <div class="btn-box">
            <Button @click="isPassd=true" :disabled="table.disabled" type="primary">同意</Button>
            <Button @click="isRefuse = true" class="refuse" :disabled="table.disabled" type="primary">拒绝</Button>

        </div>
        <div class="search-box clearfix">
            <Form class="fr" ref="search" :model="search" inline>
                <FormItem prop="password">
                    <Select v-model="search.noticeType" style="width:190px" placeholder="通知类型">
                        <Option v-for="item in noticeTypeList" :value="item.value" :key="item.value">{{ item.label }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Select v-model="search.status" style="width:190px" placeholder="全部状态">
                        <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <i-input class="search" @on-search="searchTableData" v-model.trim="search.search" search enter-button placeholder="输入通知标题"></i-input>
                </FormItem>
            </Form>
        </div>


        <div class="tableList">
            <Table @on-sort-change="tableSorting" @on-selection-change="selectedTable" :columns="table.columns" :data="table.data"></Table>
        </div>
        <div class="clearfix page-info">
            <div class="fl">已选{{table.selectedList.length}}项,共{{table.total}}项</div>
            <myPage class="fr page" @on-change="changePage" :count="count"></myPage>
            <div class="fr">每页显示行:10行</div>
        </div>
        <!--dialog-->
        <div>

            <MyDialog :title="'通过'" width="" @ok="passd" :visible.sync="isPassd">
                <div class="refund">
                    通过审核,立刻发送通知!
                </div>
            </MyDialog>

            <MyDialog :title="'拒绝'" width="" @ok="refuse" :visible.sync="isRefuse">
                <div class="refuse">
                    <Input v-model="refuseRamark" :autosize="{minRows: 2,maxRows: 5}" type="textarea" placeholder="请输入拒绝原因"/>
                </div>
            </MyDialog>
        </div>
    </div>

</template>

<script>
export default {
    name: 'notification-review',
    data() {
        return {
            refuseRamark: null,
            value5: null,
            value7: null,
            isRefund: null,
            isPassd: false,
            isRefuse: false,
            isAddGroup: false,
            isAddUserType: false,
            noticeTypeList: [
                { value: this.$tools.defaultAll, label: '全部通知类型' },
                { value: '1', label: '用户通知' },
                { value: '2', label: '认证用户通知' },
                { value: '3', label: '课程通知' }
            ],
            userTypeList: [
                { value: '0', label: '超管' },
                { value: '1', label: '友看管理员' },
                { value: '2', label: '企业管理员' },
                { value: '3', label: '认证个人用户' }
            ],
            statusList: [
                { value: '4', label: '全部通知状态' },
                { value: '1', label: '待审核' },
                { value: '3', label: '审核未通过' }
            ],
            count: 0,
            table: {
                total: 0,
                selectedList: [],
                disabled: true,
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
                        key: 'noticeId',
                        align: 'center'
                    },
                    {
                        title: '通知标题',
                        key: 'title',
                        align: 'center'
                    },
                    {
                        title: '所属企业/个人',
                        key: 'enterpriseName',
                        align: 'center',
                        render: (h, params) => {
                            let text = params.row.enterpriseName || '--';

                            return h('div', {}, text);
                        }
                    },
                    {
                        title: '通知类型',
                        key: 'noticeType',
                        maxWidth: 120,
                        align: 'center',
                        render: (h, params) => {
                            let text = this.noticeTypeList.find((item) => {
                                return item.value == params.row.noticeType;
                            });

                            return h('div', {}, text.label);
                        }
                    },
                    {
                        title: '状态',
                        key: 'createTime',
                        maxWidth: 120,
                        align: 'center',
                        render: (h, params) => {
                            let text = this.statusList.find((item) => {
                                return item.value == params.row.status;
                            });
                            let color = params.row.status == 3 ? '#f00' : '';

                            return h(
                                'div',
                                {
                                    style: {
                                        color: color
                                    }
                                },
                                text.label
                            );
                        }
                    },

                    {
                        title: '操作人',
                        key: 'nickname',
                        maxWidth: 120,
                        align: 'center'
                        // render: (h, params) => {
                        //     let text = this.userTypeList.find((item) => {
                        //         return item.value == params.row.userType;
                        //     });
                        //     text = text ? text.label : '--';
                        //     return h('div', {}, text);
                        // }
                    },
                    {
                        title: '操作时间',
                        key: 'createTime',
                        maxWidth: 180,
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
                            let text = params.row.status == 3 ? '详情' : '审核 ';
                            let color = params.row.isAlive ? '#11ba9e' : '#11ba9e';
                            return h('div', [
                                h(
                                    'Button',
                                    {
                                        props: {
                                            type: 'text',
                                            size: 'small'
                                        },
                                        style: {
                                            // width: '50px',
                                            marginRight: '5px',
                                            color: color,
                                            textAlign: 'center'
                                        },
                                        on: {
                                            click: () => {
                                                this.getNoticeInfo(params.row, params.row.status);
                                            }
                                        }
                                    },
                                    text
                                )
                            ]);
                        }
                    }
                ]
            },
            search: {
                adminType: this.$store.state.adminType,
                adminId: '',
                enterpriseId: this.$tools.defaultAll,
                noticeType: this.$tools.defaultAll,
                status: '4',
                orderRule: 2,
                search: null,
                pageNo: 1,
                pageSize: 10
            }
        };
    },
    activated() {
        this.init();
    },
    mounted() {},
    methods: {
        init() {
            this.getTableData();
        },
        searchTableData() {
            this.search.pageNo = 1;
            this.getTableData();
        },
        selectedTable(list) {
            this.table.selectedList = list;
            let length = list.filter((item) => {
                return item.status == 3;
            }).length;
            this.table.disabled = length > 0 || list.length == 0;
        },
        refuse() {
            this.$fetch({
                url: '/system-backend/noticeBack/checkNoticeReject',
                data: {
                    adminId: this.$store.state.userInfo.userId,
                    noticeIdList: this.table.selectedList.map((item) => item.noticeId).join(','),
                    ramark: this.refuseRamark
                }
            }).then((res) => {
                if (res.code == 200) {
                    this.$Message.success(res.msg);
                    this.isRefuse = false;
                    this.getTableData();
                } else {
                    this.$Message.error(res.msg);
                }
            });
        },
        passd() {
            this.$fetch({
                url: '/system-backend/noticeBack/checkNoticePass',
                data: {
                    adminId: this.$store.state.userInfo.userId,
                    noticeIdList: this.table.selectedList.map((item) => item.noticeId).join(',')
                }
            }).then((res) => {
                if (res.code == 200) {
                    this.$Message.success(res.msg);
                    this.isPassd = false;
                    this.getTableData();
                } else {
                    this.$Message.error(res.msg);
                }
            });
        },
        getTableData() {
            this.$fetch({
                url: '/system-backend/noticeBack/selectNoticeList',
                data: this.search
            }).then((res) => {
                if (res.code == 200) {
                    this.table.data = res.obj.list;
                    this.table.total = res.obj.total;
                    this.count = res.obj.pages;
                }
            });
        },
        getNoticeInfo(row, type) {
            this.$router.push({
                path: '/care-management/notification-review/admin1',
                query: { id: row.noticeId, type: type }
            });
        },
        changePage(index) {
            this.search.pageNo = index;
            this.getTableData();
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
        tableSorting({ column, key, order }) {
            this.search.orderRule = order == 'desc' ? '2' : '1';
            this.getTableData();
        }
    }
};
</script>

<style scoped lang="stylus">
    .search-box

        position: relative;

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

    .income
        position: absolute;
        left: 0;
        bottom: 0;
        padding: 8px;
        font-size: 14px;
        background-color: #f6f8fa
        color: #0c6bba
</style>
<style lang="stylus">
    .notification-review
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

    //模态框
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

    .dialog
        .refuse
            .ivu-input
                background-color: #fff
        .refund
            p
                margin-bottom: 25px;
                span
                    color: #4690da;
</style>
