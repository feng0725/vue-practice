<template>
    <div class="class-statistics two-page ">
        <router-link class="btn-box" to="/order-management/class/add-class" tag="div">
        </router-link>
        <div class="search-box clearfix">
            <Form class="fr" ref="formInline" :model="search"  inline>
                <FormItem prop="user">
                    <Select v-if="$store.getters.isAdmins" v-model="search.enterpriseId" @on-change="getSearchList" style="width:190px" placeholder="按企业筛选">
                        <Option v-for="(item,index) in enterpriseList" :value="item.enterpriseId" :key="index">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Select
                        v-model="search.courseId"
                        clearable
                        filterable
                        style="width:200px;"
                        placeholder="输入课程名称"
                        :loading="loading">
                        <Option v-for="(option, index) in queryList" :value="option.courseId" :key="index">{{option.courseName}}</Option>
                    </Select>
                    <Button  @click="searchTableData"  icon="ios-search"></Button>

                </FormItem>
            </Form>
            <p class="income" >
                课时消耗总量:{{periodConsumeSum | timeFormat2}}
                <span @click="next"  v-show="isSingleClass" class="title pointer">
                    人员消耗课时
                </span>
            </p>
        </div>
        <div class="tableList">
            <Table @on-sort-change="tableSorting" :columns="table.columns" :data="table.data"></Table>
        </div>
        <div class="clearfix page-info">
            <div class="fl">已选0项,共{{table.total}}项</div>
            <myPage class="fr page" :page="search.pageNo" @on-change="changePage" :count="count"></myPage>
            <div class="fr">每页显示行:10行</div>
        </div>
        <!--dialog-->
        <div>

        </div>
    </div>
</template>

<script>
export default {
    name: 'class-statistics',
    data() {
        return {
            isSingleClass: false,
            queryList: [],
            loading: false,
            isRefund: false,
            isQuit: false,
            isAddGroup: false,
            isAddUserType: false,
            count: 0,
            enterpriseList: [],
            periodConsumeSum: '',
            search: {
                adminId: this.$store.state.userInfo.userId,
                enterpriseId: this.$tools.defaultAll,
                courseId: '',
                orderRule: '',
                pageNo: 1,
                pageSize: 10
            },
            table: {
                total: 0,
                data: [],
                columns: [
                    {
                        title: '编号',
                        width: 80,
                        key: 'courseId',
                        align: 'center'
                    },
                    {
                        title: '小节名称',
                        key: 'sectionName',
                        align: 'center'
                    },
                    {
                        title: '所属课程',
                        key: 'courseName',
                        align: 'center'
                    },
                    {
                        title: '所属企业/个人',
                        key: 'enterpriseName',
                        align: 'center'
                    },
                    {
                        title: '消耗课时',
                        key: 'consumePeriodSum',
                        maxWidth: 120,
                        sortable: 'custom',
                        align: 'center',
                        sortType: 'desc',
                        className: 'fontBlue',
                        render: (h, params) => {
                            let text = params.row.consumePeriodSum;
                            text = this.timeFormat(text);
                            return h('div', {}, text);
                        }
                    },

                    {
                        title: '操作',
                        key: 'action',
                        width: 120,
                        align: 'center',
                        render: (h, params) => {
                            let color = '#11ba9e';
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
                                            // width: '50px',
                                            marginRight: '5px',
                                            color: color,
                                            textAlign: 'center'
                                        },
                                        on: {
                                            click: () => {
                                                this.$router.push({
                                                    path:
                                                        '/data-statistics/class-statistics/section-details/' +
                                                        params.row.sectionId,
                                                    query: {
                                                        id: params.row.courseId
                                                    }
                                                });
                                            }
                                        }
                                    },
                                    '人员消耗课时'
                                )
                            ]);
                        }
                    }
                ]
            }
        };
    },
    activated() {},
    mounted() {
        this.init();
        if (this.$store.getters.isEnterprise) {
            this.search.enterpriseId = this.$store.state.userInfo.enterpriseId;
        }
    },
    filters: {
        timeFormat2(val) {
            let hour = Math.floor(val / 60);
            let min = val % 60;
            return val < 60 ? `${min}分钟` : `${hour}小时${min}分钟`;
        }
    },
    methods: {
        init() {
            this.getEnterpriseData();
            this.getTableData();
            this.getSearchList();
            this.filterTableColumns('所属企业/个人');
        },
        getEnterpriseData() {
            if (!this.$store.getters.isAdmins) {
                return false;
            }
            this.$fetch({
                url: '/system-backend/userBack/selectEnterpriseList'
            }).then((res) => {
                this.enterpriseList = res.obj;
                this.enterpriseList.unshift(this.ALLSelect.enterprise1);
            });
        },
        getTableData() {
            this.$fetch({
                url: '/system-backend/periodStatisticsBack/selectSectionPeriodConsumeList',
                data: this.search
            }).then((res) => {
                this.table.data = res.obj.pageInfo.list;
                this.table.total = res.obj.pageInfo.total;
                this.periodConsumeSum = res.obj.periodConsumeSum;
                this.count = res.obj.pageInfo.pages;
                if (this.search.courseId) {
                    this.isSingleClass = true;
                } else {
                    this.isSingleClass = false;
                }
            });
        },
        searchTableData() {
            console.log(this.search)

            this.search.pageNo = 1;
            this.getTableData();
        },
        getSearchList() {
            let enterpriseId = '';
            if (this.$store.getters.isAdmins) {
                enterpriseId = this.search.enterpriseId;
            } else {
                enterpriseId = this.$store.state.userInfo.enterpriseId;
            }
            this.$fetch({
                url: '/system-backend/periodStatisticsBack/selectCourseList',
                data: {
                    adminId: this.$store.state.userInfo.userId,
                    enterpriseId: enterpriseId
                }
            }).then((res) => {
                this.queryList = res.obj;
                this.search.courseId = null;
            });
        },
        next() {
            this.$router.push({
                path: '/data-statistics/class-statistics/course-details/' + this.search.courseId
            });
        },
        changePage(index) {
            this.search.pageNo = index;
            this.getTableData();
        },
        timeFormat(val) {
            let hour = Math.floor(val / 60);
            let min = val % 60;
            return val < 60 ? `${min}分钟` : `${hour}小时${min}分钟`;
        },
        tableSorting({ column, key, order }) {
            this.search.orderRule = order;
            this.getTableData(0);
        }
    }
};
</script>

<style scoped lang="stylus">
    .search-box
        position: relative;
        margin-bottom:20px;

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
        .title
            position: absolute;
            right:-120px;
            cursor:pointer;
            top:50%;
            transform:translateY(-50%)
            color:#4ac4ad
    .money
        width:200px;
        height: 32px;
        line-height: 32px;
        text-align: left;
        padding-left:10px;
        color:#d9d9d9;
        border:1px solid #d1d5de
</style>
<style lang="stylus">
    .class-statistics
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
                margin-bottom: 25px;
                span
                    color: #4690da;
</style>
