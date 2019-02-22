<template>
    <div class="course-order two-page">
        <div class="btn-box">
            <Button type="primary" @click="exportTable">导出</Button>

        </div>
        <div class="search-box clearfix">
            <Form class="fr" ref="formInline" :model="search" :rules="ruleInline" inline>
                <FormItem prop="password">
                    <Select  v-if="$store.getters.isAdmins" v-model="search.enterprise_id" style="width:190px" placeholder="按企业筛选">
                        <Option v-for="item in enterpriseList" :value="item.enterpriseId" :key="item.enterpriseId">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem >
                    <DatePicker type="daterange" @on-change="changeTime" placement="bottom-end" placeholder="选择日期" style="width: 200px"></DatePicker>
                </FormItem>
                <FormItem>
                    <i-input class="search" @on-search="searchTableData" v-model.trim="search.queryCode" search enter-button placeholder="请输入课程名称"></i-input>
                </FormItem>
            </Form>
            <p class="income">净收入:{{courseNetIncome}}</p>
        </div>


        <div class="tableList">
            <Table @on-sort-change="tableSorting" :columns="table.columns" :data="table.data"></Table>
        </div>
        <div class="clearfix page-info">
            <div class="fl">已选0项,共{{table.total}}项</div>
            <myPage class="fr page" @on-change="changePage" :count="count"></myPage>
            <div class="fr">每页显示行:10行</div>
        </div>
        <!--dialog-->
        <div>
        </div>

    </div>

</template>

<script>
import { storage } from '../../../../common/js/qylh';

export default {
    name: 'course-order',
    data() {
        return {
            courseNetIncome: '',
            enterpriseList: [],
            isRefund: false,
            isQuit: false,
            isAddGroup: false,
            isAddUserType: false,
            count: 0,
            formLeft: {},
            table: {
                total: 0,
                columns: [
                    {
                        title: '编号',
                        key: 'courseId',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '商品名称',
                        key: 'courseName',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', {}, params.row.courseVO.courseName);
                        }
                    },
                    {
                        title: '所属企业/个人',
                        key: 'address',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', {}, params.row.enterpriseVO.name);
                        }
                    },
                    {
                        title: '课程状态',
                        key: 'address',
                        maxWidth: 120,
                        align: 'center',
                        render: (h, params) => {
                            let status = params.row.courseVO.courseStatus == 1 ? '上架' : '下架';
                            return h('div', {}, status);
                        }
                    },
                    {
                        title: '上架范围',
                        key: 'upApps',
                        maxWidth: 120,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', {}, params.row.courseVO.upApps);
                        }
                    },
                    {
                        title: '上架时间',
                        key: 'address',
                        maxWidth: 160,
                        sortable: 'custom',
                        align: 'center',
                        sortType: 'desc',
                        className: 'fontBlue',
                        render: (h, params) => {
                            return h('div', {}, params.row.courseVO.createTimeStr);
                        }
                    },
                    {
                        title: '购买人数',
                        key: 'address',
                        maxWidth: 120,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', {}, params.row.courseVO.buyNum);
                        }
                    },
                    {
                        title: '净收入',
                        key: 'address',
                        maxWidth: 120,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', {}, params.row.courseVO.netIncome);
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 90,
                        align: 'center',
                        render: (h, params) => {
                            let text = params.row.isAlive ? '编辑' : '已离职 ';
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
                                            marginRight: '5px',
                                            color: color,
                                            textAlign: 'center'
                                        },
                                        on: {
                                            click: () => {
                                                storage.set('course-statistics', params.row);
                                                this.$router.push({
                                                    path: '/order-management/course-statistics/buy-details'
                                                });
                                                // this.show(params.index);
                                            }
                                        }
                                    },
                                    '购买详情'
                                )
                            ]);
                        }
                    }
                ],
                data: []
            },
            formInline: {
                user: '',
                password: ''
            },
            ruleInline: {
                user: [
                    {
                        required: true,
                        message: 'Please fill in the user name',
                        trigger: 'blur'
                    }
                ],
                password: [
                    {
                        required: true,
                        message: 'Please fill in the password.',
                        trigger: 'blur'
                    },
                    {
                        type: 'string',
                        min: 6,
                        message: 'The password length cannot be less than 6 bits',
                        trigger: 'blur'
                    }
                ]
            },
            search: {
                pageNo: 1,
                pageSize: 10,
                user_id: this.$store.state.userInfo.userId,
                enterprise_id: '-1',
                start_time: '',
                end_time: '',
                dataTime: '',
                queryCode: '',
                sortType: '0'
            }
        };
    },
    activated() {
        this.init();
    },
    mounted() {},
    methods: {
        init() {
            if (this.$store.getters.isEnterprise) {
                this.search.enterprise_id = this.$store.state.userInfo.enterpriseId;
            } else {
                this.getEnterpriseList();
            }
            this.getTableData();
            this.filterTableColumns('所属企业/个人');

        },
        searchTableData() {
            this.search.pageNo = 1;
            this.getTableData();
        },
        getTableData() {
            this.$fetch({
                url: '/system-backend/courseOrder/selectCourseStatistics',
                data: this.search
            }).then((res) => {
                this.table.data = res.obj.list;
                this.table.total = res.obj.total;
                this.count = res.obj.pages;
            });
            this.getCourseNetIncome();
        },
        getCourseNetIncome() {
            this.$fetch({
                url: '/system-backend/courseOrder/selectCourseNetIncome',
                data: this.search
            }).then((res) => {
                this.courseNetIncome = res.obj.netIncome;
            });
        },
        getEnterpriseList() {
            this.$fetch({
                url: '/system-backend/courseOrder/selectAllEnterpriseInfo',
                data: {
                    appid: ''
                }
            }).then((res) => {
                if (res.code == 200) {
                    this.enterpriseList = res.obj;
                    this.enterpriseList.unshift(this.ALLSelect.enterprise);
                } else {
                    this.$Message.error(res.msg);
                }
            });
        },
        changeTime(date) {
            this.search.start_time = date[0];
            this.search.end_time = date[1];
        },
        changePage(index) {
            this.search.pageNo = index;
            this.getTableData();
        },
        exportTable() {
            this.$fetch({
                url: '/system-backend/courseOrder/exportCourseStatistics',
                data: this.search
            }).then((res) => {
                if (res.code == 200) {
                    window.open(res.obj.url);
                } else {
                    this.$Message.error(res.msg);
                }
            });
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
            this.search.sortType = order == 'desc' ? '0' : '1';
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
        left:0;
        bottom:0;
        padding:8px;
        font-size:14px;
        background-color: #f6f8fa
        color:#0c6bba
</style>
<style lang="stylus">
    .course-order
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
        .refund
            p
                margin-bottom:25px;
                span
                    color:#4690da;
</style>
