<template>
    <div class="look-back two-page">

        <div class="search-box clearfix">
            <Form class="fr" ref="search" :model="search"  inline>
                <FormItem prop="user" v-if="$store.getters.isAdmins">
                    <Select @on-change="changeEnterprise" v-model="search.enterpriseId" style="width:190px" placeholder="按企业筛选">
                        <Option v-for="item in enterpriseList" :value="item.enterpriseId" :key="item.enterpriseId">{{  item.name }}  </Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Select
                        v-model="search.courseId"
                        clearable
                        filterable
                        remote
                        placeholder="请输入课程名称"
                        :remote-method="getCourseName"
                        style="width:250px;"
                        :loading="loading1">
                        <Option v-for="(option, index) in courseList" :value="option.courseId" :key="index">{{option.courseName}}</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Button @click="searchTableData" icon="ios-search"></Button>
                </FormItem>
            </Form>
        </div>
        <div class="tableList">
            <Table :columns="table.columns" :data="table.data"></Table>
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
export default {
    name: 'look-back',
    data() {
        return {
            courseList: [
                {
                    courseId: 0,
                    courseName: '请输入课程名称'
                }
            ],
            loading1: false,
            enterpriseList: [],
            count: 0,
            table: {
                total: 0,
                selected: {},
                data: [],
                columns: [
                    {
                        title: '编号',
                        key: 'courseId',
                        maxWidth: 120,
                        align: 'center'
                    },
                    {
                        title: '课程名称',
                        key: 'courseName',
                        align: 'center'
                    },
                    {
                        title: '所属企业/个人',
                        key: 'enterpriseName',
                        align: 'center'
                    },
                    {
                        title: '创建时间',
                        key: 'createTime',
                        align: 'center',
                        className: 'fontBlue',
                        maxWidth: 180
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 180,
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
                                        style: {
                                            marginRight: '5px',
                                            color: color,
                                            textAlign: 'center'
                                        },
                                        on: {
                                            click: () => {
                                                this.$router.push({
                                                    path: '/look-back/address/section/' + params.row.courseId
                                                });
                                            }
                                        }
                                    },
                                    '回看地址'
                                )
                            ]);
                        }
                    }
                ]
            },
            search: {
                operatorId: this.$store.state.userInfo.userId,
                enterpriseId: '-1',
                userType: this.$store.state.adminType,
                courseId: 0,
                pageNum: 1,
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
            if (this.$store.getters.isEnterprise) {
                this.search.enterpriseId = this.$store.state.userInfo.enterpriseId;
            }
            this.getEnterpriseList();
            this.getTableData();
            this.filterTableColumns('所属企业/个人');
        },
        filterTableColumns(arr) {
            if (this.$store.getters.isEnterprise || this.$store.getters.isUser) {
                if (typeof arr === 'string') {
                    this.table.columns = this.table.columns.filter((item) => {
                        return item.title !== arr;
                    });
                } else if (typeof arr === 'object') {
                    this.table.columns = this.table.columns.filter((item) => {
                        return !arr.find((name) => name == item.title);
                    });
                }
            }
        },
        searchTableData() {
            this.search.pageNum = 1;
            this.getTableData();
        },
        getTableData() {
            if (!this.search.courseId) {
                this.search.courseId = 0;
            }
            this.$fetch({
                url: '/system-backend/lookBack/coursesListInfo',
                data: this.search
            }).then((res) => {
                this.table.data = res.obj.list;
                this.table.total = res.obj.total;
                this.count = res.obj.pages;
            });
        },
        changeEnterprise() {
            this.search.courseId = 0;
            this.getCourseName();
        },
        getEnterpriseList() {
            if (!this.$store.getters.isAdmins) {
                return false;
            }
            this.$fetch({
                url: '/system-backend/lookBack/getEnterprise'
            }).then((res) => {
                this.enterpriseList = res.obj;
                this.enterpriseList.unshift(this.ALLSelect.enterprise);
            });
        },
        getCourseName(query) {
            if (query !== '') {
                let parame = {
                    operatorId: this.$store.state.userInfo.userId,
                    courseName: query,
                    userType: this.search.userType,
                    enterpriseId: this.search.enterpriseId
                };

                this.loading1 = true;
                this.$fetch({
                    url: '/system-backend/lookBack/getCourseName',
                    data: parame
                }).then((res) => {
                    this.loading1 = false;
                    this.courseList = res.obj;
                });
            }
        },
        changePage(index) {
            this.search.pageNum = index;
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

    .title-header
        display: flex;
        justify-content: space-around;
        align-items: center;
        height: 40px;
        margin-bottom: 15px;
        background-color: #f6f8fa;
        .btn
            color: rgb(17, 186, 158)

    .warring
        line-height: 16px;
        color: red;
        font-weight: bold;
        margin: 0;

</style>
<style lang="stylus">
    .look-back
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
