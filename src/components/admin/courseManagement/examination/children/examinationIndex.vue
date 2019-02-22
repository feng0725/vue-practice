<template>
    <div class="examinationIndex two-page ">
        <div class="btn-box">
            <Button type="primary" @click="addTest">新建考试</Button>
        </div>
        <div class="search-box clearfix">
            <Form class="fr" ref="formInline" :model="search"  inline>
                <FormItem v-if="$store.getters.isAdmins">
                    <Select @on-change="changeEnterprise" v-model="search.enterpriseId" style="width:200px" placeholder="按企业筛选">
                        <Option v-for="(item,index) in enterpriseList" :value="item.enterpriseId" :key="index">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Select v-model="search.courseId" style="width:200px" placeholder="按课程筛选">
                        <Option v-for="(item,index) in courseList" :value="item.courseId" :key="index">{{ item.courseName }}</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Select v-model="search.examStatus" style="width:200px" placeholder="考试状态">
                        <Option v-for="(item,index) in examStatusArr" :value="item.value" :key="index">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <i-input class="search"  @on-search="searchTableData" v-model.trim="search.examPaperName" search enter-button placeholder="输入考试名称"></i-input>
                </FormItem>
            </Form>
        </div>

        <div class="tableList">
            <Table  @on-sort-change="tableSorting" :columns="table.columns" :data="table.data"></Table>
        </div>
        <div class="clearfix page-info">
            <div class="fl">已选0项,共{{table.total}}项</div>
            <myPage class="fr page" :page="search.pageNum" @on-change="changePage" :count="count"></myPage>
            <div class="fr">每页显示行:10行</div>
        </div>
        <!--dialog-->
        <div>

            <MyDialog :title="'删除'" width="475" @ok="removeExam" :visible.sync="isDelete">
                <div style="font-weight:bold;text-align: center;font-size:16px;">确定删除该考试?删除后该考试的统计数据象无法查看!</div>
                <p style="font-weight:bold;font-size:16px;">请慎重!</p>
            </MyDialog>
            <MyDialog :title="'删除'" width="475" @ok="removeExam" :visible.sync="isDelete2">
                <div style="font-weight:bold;text-align: center;font-size:16px;">确定删除该考试?!</div>
            </MyDialog>
            <MyDialog :title="'删除'" width="475" :visible.sync="isDeletefail">
                <div style="color:#000;text-align: center;font-size:16px;">
                    该考试正在进行,不能删除!
                </div>
                <div slot="footer">
                    <Button @click="isDeletefail=false">关闭</Button>
                </div>
            </MyDialog>
        </div>
    </div>
</template>

<script>
import { storage } from '../../../../../common/js/qylh';

export default {
    name: 'user',
    data() {
        return {
            tableSelected: {
                index: 0,
                item: {}
            },
            examStatusArr: [
                { value: '0', label: '全部考试状态' },
                { value: '1', label: '未开始' },
                { value: '2', label: '进行时' },
                { value: '3', label: '已结束' },
                { value: '-1', label: '未知' }
            ],
            courseList: [],
            enterpriseList: [],
            isDelete: false,
            isDelete2: false,
            isDeletefail: false,
            isAddGroup: false,
            isAddUserType: false,
            count: 0,
            table: {
                total: 0,
                data: [],
                columns: [
                    {
                        title: '编号',
                        width: 80,
                        key: 'examPaperId',
                        align: 'center'
                    },
                    {
                        title: '考试名称',
                        key: 'examPaperName',
                        align: 'center'
                    },
                    {
                        title: '所属课堂',
                        key: 'courseName',
                        align: 'center'
                    },
                    {
                        title: '所属企业/个人',
                        key: 'enterpriseName',
                        align: 'center'
                    },
                    {
                        title: '考试状态',
                        key: 'examStatus',
                        maxWidth: 120,
                        align: 'center',
                        render: (h, params) => {
                            let text = this.examStatusArr.find((item) => {
                                return item.value == params.row.examStatus;
                            });
                            text = text.label || '';
                            return h('div', {}, text);
                        }
                    },

                    {
                        title: '考试时间',
                        key: 'validityTime',
                        align: 'center'
                        // className: 'fontBlue'
                    },
                    {
                        title: '操作人',
                        key: 'operatorName',
                        maxWidth: 120,
                        align: 'center'
                    },
                    {
                        title: '操作时间',
                        key: 'operateTime',
                        maxWidth: 160,
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
                                            marginRight: '5px',
                                            color: '#11ba9e',
                                            textAlign: 'center'
                                        },
                                        on: {
                                            click: () => {
                                                storage.set('examDataEdit', true);

                                                this.$router.push({
                                                    path: '/courseManagement/examination/addTest',
                                                    query: {
                                                        id: params.row.examPaperId
                                                    }
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
                                            marginRight: '5px',
                                            color: '#d41e3c'
                                        },
                                        on: {
                                            click: () => {
                                                this.isRemoveExam(params.row, params.index);
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
            search: {
                userId: this.$store.state.userInfo.userId,
                pageNum: 1,
                pageSize: 10,
                enterpriseId: this.$tools.defaultAll,
                courseId:'-1',
                examStatus: '0',
                examPaperName: '',
                orderBy: 0
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
                this.search.enterpriseId = this.$store.state.enterpriseId;
            }
            this.getCourseList();
            this.getEnterpriseList();
            this.getTableData();
            this.filterTableColumns('所属企业/个人');
        },
        searchTableData() {
            this.search.pageNum = 1;
            this.getTableData();
        },
        getTableData() {
            this.$fetch({
                url: '/system-backend/examBack/selectExamList',
                data: this.search
            }).then((res) => {
                this.table.data = res.obj.list;
                this.table.total = res.obj.total;
                this.count = res.obj.pages;
            });
        },
        /**
         * 获取课程列表
         */
        getCourseList() {
            this.$fetch({
                url: '/system-backend/examBack/selectCourseListByUserId',
                data: {
                    userId: this.$store.state.userInfo.userId,
                    enterpriseId: this.search.enterpriseId
                }
            }).then((res) => {
                this.courseList = res.obj;
                this.courseList.unshift(this.ALLSelect.course);
            });
        },
        /**
         * 获取企业列表
         */
        getEnterpriseList() {
            if (!this.$store.getters.isAdmins) {
                return false;
            }
            this.$fetch({
                url: '/system-backend/courseBack/getEnterpriseList',
                data: {
                    userId: this.$store.state.userInfo.userId
                }
            }).then((res) => {
                if (res.code == 200) {
                    this.enterpriseList = res.obj;
                    this.enterpriseList.unshift(this.ALLSelect.enterprise1);
                }
            });
        },
        isRemoveExam(row, index) {
            if (row.examStatus == 1) {
                this.isDelete2 = true;
            } else if (row.examStatus == 2) {
                this.isDeletefail = true;
            } else {
                this.tableSelected.index = index;
                this.tableSelected.item = row;
                this.isDelete = true;
            }
        },
        removeExam() {
            this.$fetch({
                url: '/system-backend/examBack/deleteExam',
                data: {
                    examPaperId: this.tableSelected.item.examPaperId
                }
            }).then((res) => {
                if (res.code == 200) {
                    this.table.data.splice(this.tableSelected.index, 1);
                    this.isDelete = false;
                    this.isDelete2 = false;
                    this.$Message.success(res.msg);
                } else {
                    this.$Message.error(res.msg);
                }
            });
        },
        addTest() {
            storage.set('examDataEdit', false);
            this.$router.push({
                path: '/courseManagement/examination/addTest'
            });
        },
        changePage(index) {
            this.search.pageNum = index;
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
            this.search.orderBy = order == 'desc' ? '0' : '1';
            this.getTableData();
        },
        changeEnterprise() {
            this.search.courseId = '';
            this.getCourseList();
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
    .examinationIndex
        height:auto;
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
