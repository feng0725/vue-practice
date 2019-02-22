<template>
    <div class="al courseIndex two-page">
        <div class="btn-box">
            <Button type="primary" @click="goToAdd">新建课程</Button>
            <Button type="primary" @click="isCourseDown = true"
                    :disabled="table.selectedList.some(item=>item.courseStatus !=1) ||table.selectedList.length == 0 ">
                下架课程
            </Button>
        </div>

        <div class="search-box clearfix">
            <Form class="fr" ref="formInline" :model="search" inline>
                <FormItem prop="user" v-if="$store.getters.isAdmins">
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
                <FormItem v-if="$store.getters.isAdmins">
                    <i-input class="search" @on-search="searchTableData" v-model.trim="search.courseNameOrUserName" search
                             enter-button placeholder="输入课程名称/创建人"></i-input>
                </FormItem>
                <FormItem v-else>
                    <i-input class="search" @on-search="searchTableData" v-model.trim="search.courseNameOrUserName" search
                             enter-button placeholder="输入课程名称"></i-input>

                </FormItem>
            </Form>
        </div>

        <div class="tableList">
            <Table @on-sort-change="tableSorting" @on-selection-change="selectTable" :columns="table.columns"
                   :data="table.data"></Table>
        </div>
        <div class="clearfix page-info">
            <div class="fl">已选0项,共{{table.total}}项</div>
            <myPage class="fr page" :page="search.pageNum" @on-change="changePage" :count="count"></myPage>
            <div class="fr">每页显示行:10行</div>
        </div>
        <!--dialog-->
        <div>

            <MyDialog :title="'未审核通过'" :visible.sync="isRefuse">
                <div style="text-align: center;font-weight: bold;height: 60px;line-height: 60px;">{{refuseInfo}}</div>
                <div slot="footer">
                    <Button @click="isRefuse = false">关闭</Button>
                </div>
            </MyDialog>


            <MyDialog class-name="add-user" @ok="courseDown" :title="'下架课程'" :visible.sync="isCourseDown">
                <div style="">
                    确定要下架此商品吗?
                </div>
            </MyDialog>
            <MyDialog class-name="add-user" @ok="revokeReview" :title="'撤销审核'" :visible.sync="isCancel">
                <div style="">
                    确定要撤销审核吗?
                </div>
            </MyDialog>
        </div>

    </div>

</template>

<script>
import expandRow from './table-expand.vue';
import { storage } from '../../../../../common/js/qylh';

export default {
    name: 'courseIndex',
    components: {},
    data() {
        return {
            isUserList: false,
            isCourseDown: false,
            isRefuse: false,
            isCancel: false,
            refuseInfo: '',
            count: 0,
            table: {
                total: 0,
                selectedItem: {},
                selectedList: [],
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '编号',
                        width: 80,
                        key: 'courseId',
                        align: 'center'
                    },
                    {
                        type: 'expand',
                        width: 60,
                        render: (h, params) => {
                            return h(expandRow, {
                                props: {
                                    row: params.row
                                }
                            });
                        }
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
                            let status = params.row.courseStatus;
                            let text = this.courseStatusList.filter((item) => {
                                return item.value == status;
                            })[0].label;
                            let color = '';
                            let pointer = '';
                            if (status == 4) {
                                color = '#f00';
                                pointer = 'pointer';
                            } else {
                                color = '';
                            }
                            return h(
                                'div',
                                {
                                    style: {
                                        color: color,
                                        cursor: pointer
                                    },
                                    on: {
                                        click: () => {
                                            if (params.row.courseStatus == 4) {
                                                color = '#f00';
                                                pointer = 'pointer';
                                                this.$fetch({
                                                    url: '/system-backend/courseBack/selectCheckFailReason',
                                                    data: {
                                                        courseId: params.row.courseId
                                                    }
                                                }).then((res) => {
                                                    this.refuseInfo = res.obj.auditOpinion;
                                                    this.isRefuse = true;
                                                });
                                            }
                                        }
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
                            let text = params.row.isHaveExam == 1 ? '是' : '否';
                            return h('div', {}, text);
                        }
                    },
                    {
                        title: '课程范围',
                        key: 'courseType',
                        maxWidth: 120,
                        align: 'center',
                        render: (h, params) => {
                            // 0 内部 1 公开 2 内部,公开
                            let text = '';
                            let type = params.row.courseType;
                            if (type == 0) {
                                text = '内部';
                            } else if (type == 1) {
                                text = '公开';
                            } else if (type == 2) {
                                text = '内部,公开';
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
                        key: 'createTimeVo',

                        maxWidth: 160,
                        sortable: 'custom',
                        align: 'center',
                        sortType: 'desc',
                        className: 'fontBlue'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 80,
                        align: 'center',
                        render: (h, params) => {
                            let type = params.row.courseStatus;
                            let text = '';
                            let color = '';
                            if (type == 3) {
                                text = '撤销';
                                color = '#f00';
                            } else {
                                text = '编辑';
                                color = '#11ba9e';
                            }
                            return h('div', [
                                h(
                                    'Button',
                                    {
                                        props: {
                                            type: 'text',
                                            size: 'small'
                                        },
                                        style: {
                                            width: '50px',
                                            marginRight: '5px',
                                            color: color,
                                            textAlign: 'center'
                                        },
                                        on: {
                                            click: () => {
                                                this.table.selectedItem = params.row;
                                                if (params.row.courseStatus == 3) {
                                                    this.isCancel = true;
                                                } else {
                                                    let path = '';
                                                    if (params.row.userType == 0) {
                                                        path = '/courseManagement/course/addCourseAdmin';
                                                    } else if (params.row.userType == 2) {
                                                        path = '/courseManagement/course/addCourse';
                                                    } else if (params.row.userType == 1) {
                                                        path = '/courseManagement/course/addCoursePersonal';
                                                    }
                                                    this.$router.push({
                                                        path: path,
                                                        query: {
                                                            id: params.row.courseId
                                                        }
                                                    });
                                                }
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
            courseStatusList: [
                { value: this.$tools.defaultAll, label: '全部课程状态' },
                { value: 0, label: '草稿' },
                { value: 1, label: '已上架' },
                { value: 2, label: '已下架' },
                { value: 3, label: '审核中' },
                { value: 4, label: '未通过审核' }
            ],
            enterpriseList: [],
            search: {
                userId: this.$store.state.userInfo.userId,
                enterpriseId: this.$tools.defaultAll,
                courseStatus: this.$tools.defaultAll,
                courseNameOrUserName: '',
                pageSize: 10,
                pageNum: 1,
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
            this.getTableData();
            this.getEnterpriseData();
            this.filterTableColumns('所属企业/个人');
        },
        searchTableData() {
            this.search.pageNum = 1;
            this.getTableData();
        },
        getTableData() {
            this.$fetch({
                url: '/system-backend/courseBack/selectCourseList',
                data: this.search
            }).then((res) => {
                this.table.data = res.obj.list;
                this.table.total = res.obj.total;
                this.count = res.obj.pages;
            });
        },
        getEnterpriseData() {
            if (!this.$store.getters.isAdmins) {
                return false;
            }
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
        // 撤销审核
        revokeReview() {
            this.$fetch({
                url: '/system-backend/courseBack/courseRevocation',
                data: {
                    courseIds: this.table.selectedItem.courseId
                }
            }).then((res) => {
                if (res.code == 200) {
                    this.isCancel = false;
                    this.getTableData();
                } else {
                    this.$Message.error(res.msg);
                }
            });
        },
        goToAdd() {
            storage.remove('sectionList');
            storage.remove('courseMsg');
            storage.remove('appList');
            storage.remove('groupList');
            if (this.$store.getters.isAdmins) {
                this.$router.push({ path: '/courseManagement/course/addCourseAdmin' });
            } else if (this.$store.getters.isEnterprise) {
                this.$router.push({ path: '/courseManagement/course/addCourse' });
            } else if (this.$store.getters.isUser) {
                this.$router.push({ path: '/courseManagement/course/addCoursePersonal' });
            }
        },
        /**
         * 下架课程
         */
        courseDown() {
            this.$fetch({
                url: '/system-backend/courseBack/courseDown',
                data: {
                    courseIds: this.table.selectedList.map((item) => item.courseId).join('|')
                }
            }).then((res) => {
                if (res.code == 200) {
                    this.$Message.success(res.msg);
                    this.isCourseDown = false;
                    this.getTableData();
                } else {
                    this.$Message.error(res.msg);
                }
            });
        },
        changePage(index) {
            this.search.pageNum = index;
            this.getTableData();
        },

        tableSorting({ column, key, order }) {
            this.search.orderBy = order == 'desc' ? '0' : '1';
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

    .courseIndex
        td.ivu-table-expanded-cell
            padding: 20px 0;

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
