<template>
    <div class="reviewIndex two-page">
        <div class="btn-box">
            <Button type="primary" @click="isAgree = true" :disabled="disabled">同意</Button>
            <Button type="primary" class="refuse" @click="isRefuse = true" :disabled="disabled">拒绝</Button>
        </div>

        <div class="search-box clearfix">
            <Form class="fr" ref="search" :model="search" inline>
                <FormItem prop="user">
                    <Select v-model="search.enterpriseId" style="width:200px" placeholder="按企业筛选">
                        <Option v-for="item in enterpriseList" :value="item.enterpriseId" :key="item.enterpriseId">{{
                            item.name }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem prop="user">
                    <Select v-model="search.courseStatus" style="width:200px" placeholder="课程状态    ">
                        <Option v-for="item in courseStatusList" :value="item.value" :key="item.value">{{ item.label
                            }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <i-input class="search" v-model.trim="search.courseNameOrUserName" @on-search="searchTableData" search
                             enter-button placeholder="输入课程名称"></i-input>
                </FormItem>
            </Form>
        </div>

        <div class="tableList">
            <Table  @on-sort-change="tableSorting"  @on-selection-change="selectTable" :columns="table.columns" :data="table.data"></Table>
        </div>
        <div class="clearfix page-info">
            <div class="fl">已选{{table.selectedList.length}}项,共{{table.total}}项</div>
            <myPage class="fr page" @on-change="changePage" :count="count"></myPage>
            <div class="fr">每页显示行:10行</div>
        </div>
        <!--dialog-->
        <div>

            <MyDialog :title="'通过'" @ok="agree" :visible.sync="isAgree">
                <div style="text-align: center;font-weight: bold;height: 60px;line-height: 60px;">通过审核,立即上架该课程!</div>
            </MyDialog>
            <MyDialog class-name="refuse" :title="'拒绝'" :visible.sync="isRefuse">
                <div style="">
                    <Input v-model="reason" type="textarea" :autosize="true" placeholder="请输入拒绝原因..."/>
                </div>
                <div slot="footer">
                    <Button class="white-blue" @click="isRefuse = false" type="primary">取消</Button>
                    <Button class="refuse" @click="refuse"  type="primary">拒绝</Button>
                </div>
            </MyDialog>
        </div>

    </div>

</template>

<script>
export default {
    name: 'reviewIndex',
    components: {},
    computed: {
        disabled() {
            let flag = true;
            if (this.table.selectedList.length == 0) {
                flag = true;
            } else {
                flag = !this.table.selectedList.every((item) => item.courseStatus == 3);
            }
            return flag;
        }
    },
    data() {
        return {
            reason: '',
            enterpriseList: [],
            courseStatusList: [
                { value: this.$tools.defaultAll, label: '全部课程状态' },
                { value: '3', label: '待审核' },
                { value: '4', label: '审核失败' }
            ],
            isAgree: false,
            isRefuse: false,
            count: 0,
            table: {
                total: 0,
                selectedList: [],
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },

                    {
                        title: '编号',
                        key: 'courseId',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '课程名称',
                        key: 'courseName',
                        align: 'center'
                    },
                    {
                        title: '状态',
                        key: 'courseStatus',
                        maxWidth: 120,
                        align: 'center',
                        render: (h, params) => {
                            let text = this.courseStatusList.filter((item) => {
                                return item.value == params.row.courseStatus;
                            })[0].label;
                            let color = params.row.courseStatus == 3 ? '#f00' : '000';
                            return h(
                                'div',
                                {
                                    style: {
                                        color: color
                                    }
                                },
                                text
                            );
                        }
                    },
                    {
                        title: '原价',
                        key: 'originalPriceVO',
                        maxWidth: 120,
                        align: 'center'
                    },
                    {
                        title: '现价',
                        key: 'presentPriceVO',
                        maxWidth: 120,
                        align: 'center'
                    },
                    {
                        title: '所属企业/个人',
                        key: 'enterpriseName',
                        align: 'center'
                    },
                    {
                        title: '是否含考试',
                        key: 'isHaveExam',
                        maxWidth: 120,
                        align: 'center',
                        render: (h, params) => {
                            let text = params.row.isHaveExam == 0 ? '否' : '是';
                            return h('div', {}, text);
                        }
                    },
                    {
                        title: '课程范围',
                        key: 'courseType',
                        maxWidth: 120,
                        align: 'center',
                        render: (h, params) => {
                            let type = params.row.courseType;
                            let text = '';
                            if (type == 0) {
                                text = '内部';
                            } else if (type == 1) {
                                text = '公开';
                            } else if (type == 2) {
                                text = '内部、公开';
                            }
                            return h('div', {}, text);
                        }
                    },
                    {
                        title: '创建人',
                        key: 'operatorName',
                        maxWidth: 120,
                        align: 'center'
                    },
                    {
                        title: '创建时间',
                        key: 'createTime',
                        maxWidth: 160,
                        sortable: 'custom',
                        align: 'center',
                        sortType: 'desc',
                        className: 'fontBlue'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 120,
                        align: 'center',
                        render: (h, params) => {
                            let disabled = params.row.courseStatus == 3 ? false : true;
                            let color = params.row.courseStatus == 3 ? '#11ba9e' : '#999';
                            return h('div', [
                                h(
                                    'Button',
                                    {
                                        props: {
                                            type: 'text',
                                            size: 'small'
                                        },
                                        attrs: {
                                            disabled: disabled
                                        },
                                        style: {
                                            width: '50px',
                                            marginRight: '5px',
                                            color: color,
                                            textAlign: 'center'
                                        },
                                        on: {
                                            click: () => {
                                                let path = '';
                                                if (params.row.userType == 0) {
                                                    path = '/courseManagement/review/addCourseAdmin';
                                                } else if (params.row.userType == 2) {
                                                    path = '/courseManagement/review/addCourse';
                                                } else if (params.row.userType == 1) {
                                                    path = '/courseManagement/review/addCoursePersonal';
                                                }
                                                this.$router.push({
                                                    path: path,
                                                    query: {
                                                        id: params.row.courseId
                                                    }
                                                });
                                            }
                                        }
                                    },
                                    '审核'
                                )
                            ]);
                        }
                    }
                ],
                data: []
            },
            search: {
                pageNum: 1,
                pageSize: 10,
                enterpriseId: this.$tools.defaultAll,
                courseStatus: this.$tools.defaultAll,
                courseNameOrUserName: '',
                userId: this.$store.state.userInfo.userId,
                orderBy: '0'
            }
        };
    },
    activated() {
        this.init();
    },
    mounted() {},
    methods: {
        init() {
            this.getEnterpriseList();
            this.getTableData();
        },
        searchTableData() {
            this.search.pageNum = 1;
            this.getTableData();
        },
        getTableData() {
            this.$fetch({
                url: '/system-backend/courseBack/selectCourseCheckList',
                data: this.search
            }).then((res) => {
                this.table.data = res.obj.list;
                this.table.total = res.obj.total;
                this.count = res.obj.pages;
            });
        },
        getEnterpriseList() {
            this.$fetch({
                url: '/system-backend/courseBack/getEnterpriseList',
                data: {
                    userId: this.$store.state.userInfo.userId
                }
            }).then((res) => {
                this.enterpriseList = res.obj;
                this.enterpriseList.unshift(this.ALLSelect.enterprise1);
            });
        },
        selectTable(list) {
            this.table.selectedList = list;
        },
        goToAdd() {
            this.$router.push({ path: '/courseManagement/course/addCourse' });
        },
        changePage(index) {
            this.search.pageNum = index;
            this.getTableData();
        },
        agree() {
            this.$fetch({
                url: '/system-backend/courseBack/courseApproved',
                data: {
                    courseIds: this.table.selectedList.map((item) => item.courseId).join('|')
                }
            }).then((res) => {
                if (res.code == 200) {
                    this.$Message.success(res.msg);
                    this.isAgree = false;
                    this.getTableData();
                } else {
                    this.$Message.error(res.msg);
                }
            });
        },
        tableSorting({ column, key, order }) {
            this.search.orderBy = order == 'desc' ? '0' : '1';
            this.getTableData();
        },
        refuse() {
            this.$fetch({
                url: '/system-backend/courseBack/courseCheckFail',
                data: {
                    courseIds: this.table.selectedList.map((item) => item.courseId).join('|'),
                    reason: this.reason
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
    .reviewIndex
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

    .refuse.dialog
        .ivu-input
            background-color: #fff

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
