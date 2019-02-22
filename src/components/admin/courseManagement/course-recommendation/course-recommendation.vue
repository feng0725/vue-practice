<template>
    <div class="examinationIndex two-page ">
        <div class="btn-box">
            <Button type="primary" @click="addTest" :disabled="!recommendSearch.appId">添加推荐课程</Button>
        </div>
        <div class="search-box clearfix">
            <Form class="fr" ref="formInline" :model="search"  inline>
                <FormItem>
                    <i-input class="search"  @on-search="searchTableData" v-model.trim="search.courseName" search enter-button placeholder="输入课程名称"></i-input>
                </FormItem>
            </Form>
        </div>

        <div class="tableList">
            <Table   :columns="table.columns" :data="table.data"></Table>
        </div>
        <div class="clearfix page-info">
            <div class="fl">已选0项,共{{table.total}}项</div>
            <myPage class="fr page" :page="search.pageNum" @on-change="changePage" :count="count"></myPage>
            <div class="fr">每页显示行:10行</div>
        </div>
        <!--dialog-->
        <div>
            <MyDialog :title="'移除'" @ok="removeCourse" :visible.sync="isRemove">
               <div>确定要把该课程移除课程推荐?</div>
            </MyDialog>
            <MyDialog :title="'添加推荐课程'" @ok="addRecommendCourse"  class-name="recommend" width="1000px" :visible.sync="isRecommen">
               <div class="">
                   <div class="search-box clearfix">
                       <Form class="fr" ref="formInline" :model="recommendSearch"  inline>
                           <FormItem>
                               <i-input class="search"  @on-search="searchRecommendTableData" v-model.trim="recommendSearch.courseName" search enter-button placeholder="输入课程名称"></i-input>
                           </FormItem>
                       </Form>
                   </div>
                   <div class="tableList">
                       <Table  @on-sort-change="tableSorting"  @on-selection-change="recommendTableSelected" :columns="recommendTable.columns" :data="recommendTable.data"></Table>
                   </div>
                   <div class="clearfix page-info2">
                       <div class="fl">已选{{recommendTable.selected.length}}项,共{{recommendTable.total}}项</div>
                       <myPage class="fr page" :page="recommendSearch.pageNum" @on-change="changeRecommendPage" :count="recommendTable.count"></myPage>
                       <div class="fr">每页显示行:5行</div>
                   </div>
               </div>
            </MyDialog>
        </div>
    </div>
</template>

<script>
import { storage } from '../../../../common/js/qylh';

export default {
    name: 'user',
    data() {
        return {
            tableSelected: {
                index: 0,
                item: {}
            },
            examStatusArr: [
                { value: 0, label: '全部' },
                { value: 1, label: '未开始' },
                { value: 2, label: '进行时' },
                { value: 3, label: '已结束' },
                { value: -1, label: '未知' }
            ],
            courseList: [],
            enterpriseList: [],
            isRemove: false,
            isRecommen: false,
            count: 0,
            table: {
                total: 0,
                selected: {},
                index: 0,
                data: [],
                columns: [
                    {
                        title: '编号',
                        key: 'courseId',

                        align: 'center'
                    },

                    {
                        title: '课程名称',
                        key: 'courseName',
                        align: 'center'
                    },
                    {
                        title: '原价',
                        maxWidth: 120,
                        key: 'originalPriceVO',
                        align: 'center'
                    },
                    {
                        title: '现价',
                        maxWidth: 120,
                        key: 'presentPriceVO',
                        align: 'center'
                    },
                    {
                        title: '所属企业/个人',
                        key: 'enterpriseName',
                        align: 'center'
                    },
                    {
                        title: '是否含考试',
                        key: 'examStatus',
                        maxWidth: 120,
                        align: 'center',
                        render: (h, params) => {
                            let text = params.row.isHaveExam == 1 ? '是' : '否';
                            return h('div', [h('span', {}, text)]);
                        }
                    },

                    {
                        title: '课程范围',
                        key: 'validityTime',
                        maxWidth: 120,
                        align: 'center',
                        render: (h, params) => {
                            let text = params.row.courseType == 1 ? '公开' : '内部,公开';
                            return h('div', [h('span', {}, text)]);
                        }
                    },
                    {
                        title: '创建人',
                        maxWidth: 120,
                        key: 'operatorName',
                        align: 'center'
                    },
                    {
                        title: '创建时间',
                        key: 'courseTime',
                        maxWidth: 160,
                        align: 'center'
                    },

                    {
                        title: '操作',
                        key: 'action',
                        width: 230,
                        align: 'center',
                        render: (h, params) => {
                            let flag = params.row.isSetTop == 1;
                            let setTopText = flag ? '取消置顶' : '置顶';
                            let display = flag ? 'none' : '';
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
                                            color: '#11ba9e',
                                            textAlign: 'center'
                                        },
                                        on: {
                                            click: () => {
                                                this.setTop(params.row, params.index);
                                            }
                                        }
                                    },
                                    setTopText
                                ),
                                h(
                                    'Button',
                                    {
                                        props: {
                                            type: 'text',
                                            size: 'small',
                                            textAlign: 'center'
                                        },
                                        style: {
                                            display: display,
                                            marginRight: '5px',
                                            color: '#11ba9e'
                                        },
                                        on: {
                                            click: () => {
                                                this.updateCourseRecommend(params.row, params.index, 0, -1);
                                            }
                                        }
                                    },
                                    '上移'
                                ),
                                h(
                                    'Button',
                                    {
                                        props: {
                                            type: 'text',
                                            size: 'small',
                                            textAlign: 'center'
                                        },
                                        style: {
                                            display: display,
                                            marginRight: '5px',
                                            color: '#11ba9e'
                                        },
                                        on: {
                                            click: () => {
                                                this.updateCourseRecommend(params.row, params.index, 1, 1);
                                            }
                                        }
                                    },
                                    '下移'
                                ),
                                h(
                                    'Button',
                                    {
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
                                                this.isRemove = true;
                                                this.table.index = params.index;
                                                this.table.selected = params.row;
                                            }
                                        }
                                    },
                                    '移除'
                                )
                            ]);
                        }
                    }
                ]
            },
            recommendTable: {
                total: 0,
                selected: [],
                count: 0,
                data: [],
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        type: 'index',
                        width: 60,
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
                        title: '现价',
                        key: 'presentPriceVO',
                        align: 'center'
                    },

                    {
                        title: '课程范围',
                        key: 'validityTime',
                        align: 'center',
                        render: (h, params) => {
                            let text = params.row.courseType == 1 ? '公开' : '内部,公开';
                            return h('div', [h('span', {}, text)]);
                        }
                    },
                    {
                        title: '创建人',
                        key: 'operatorName',
                        align: 'center'
                    },
                    {
                        title: '创建时间',
                        key: 'courseTime',
                        sortable: 'custom',
                        align: 'center',
                        sortType: 'desc',
                        className: 'fontBlue'
                    }
                ]
            },
            recommendSearch: {
                appId: '',
                courseName: '',
                orderBy: 0,
                pageNum: 1,
                pageSize: 5
            },
            search: {
                userId: this.$store.state.userInfo.userId,
                courseName: '',
                pageNum: 1,
                pageSize: 10
            }
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.getTableData();
        },
        searchTableData() {
            this.search.pageNum = 1;
            this.getTableData();
        },

        getTableData() {
            this.$fetch({
                url: '/system-backend/courseRecommendBack/selectCourseRecommendList',
                data: this.search
            }).then((res) => {

                this.table.data = res.obj.pageInfo.list;
                this.table.total = res.obj.pageInfo.total;
                this.count = res.obj.pageInfo.pages;
                this.recommendSearch.appId = res.obj.appId;
            });
        },
        changePage(index) {
            this.search.pageNum = index;
            this.getTableData();
        },
        searchRecommendTableData() {
            this.recommendSearch.pageNum = 1;
            this.getRecommendTableData();
        },
        getRecommendTableData() {
            this.$fetch({
                url: '/system-backend/courseRecommendBack/selectCourseNoRecommendList',
                data: this.recommendSearch
            }).then((res) => {
                if (res.code == 200) {
                    this.recommendTable.data = res.obj.list;
                    this.recommendTable.total = res.obj.total;
                    this.recommendTable.count = res.obj.pages;
                } else {
                    this.$Message.error(res.msg);
                }
            });
        },
        setTop(row, index) {
            // isSetTop 1 已经置顶  0 未置顶
            let url = '';
            if (row.isSetTop == 1) {
                url = '/system-backend/courseRecommendBack/updateCancelSetTop';
            } else {
                url = '/system-backend/courseRecommendBack/updateSetTop';
            }
            this.$fetch({
                url: url,
                data: {
                    recommendId: row.recommendId
                }
            }).then((res) => {
                if (res.code == 200) {
                    this.$Message.success(res.msg);
                    this.getTableData();
                } else {
                    this.$Message.error(res.msg);
                }
            });
        },
        updateCourseRecommend(row, index, type, number) {
            let item = this.table.data[index + number];
            let recommendId2 = item ? item.recommendId : '';
            // type 0 上移 1 下移
            this.$fetch({
                url: '/system-backend/courseRecommendBack/updateCourseRecommend',
                data: {
                    recommendId1: row.recommendId,
                    recommendId2: recommendId2,
                    type: type,
                    pageNum: this.search.pageNum,
                    pageSize: this.search.pageSize,
                    appId: this.recommendSearch.appId,
                    courseName: this.search.courseName,
                    orderBy: 0
                }
            }).then((res) => {
                if (res.code == 200) {
                    this.getTableData();
                    this.$Message.success(res.msg);
                } else {
                    this.$Message.error(res.msg);
                }
            });
        },
        addTest() {
            this.isRecommen = true;
            this.getRecommendTableData();
        },
        recommendTableSelected(list) {
            this.recommendTable.selected = list;
        },
        addRecommendCourse() {
            this.$fetch({
                url: '/system-backend/courseRecommendBack/insertCourseRecommend',
                data: {
                    courseAppSetIds: this.recommendTable.selected
                        .map((item) => {
                            return item.courseAppSetId;
                        })
                        .join('|')
                }
            }).then((res) => {
                if (res.code == 200) {
                    this.isRecommen = false;
                    this.$Message.success(res.msg);
                    this.getTableData();
                } else {
                    this.$Message.error(res.msg);
                }
            });
        },
        removeCourse() {
            this.$fetch({
                url: '/system-backend/courseRecommendBack/deleteRecommend',
                data: {
                    recommendId: this.table.selected.recommendId
                }
            }).then((res) => {
                if (res.code == 200) {
                    this.getTableData();
                    this.isRemove = false;
                    this.$Message.success(res.msg);
                } else {
                    this.$Message.error(res.msg);
                }
            });
        },
        changeRecommendPage(index) {
            this.recommendSearch.pageNum = index;
            this.getRecommendTableData();
        },
        tableSorting({ column, key, order }) {
            this.recommendSearch.orderBy = order == 'desc' ? '0' : '1';
            this.getRecommendTableData();
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
    .recommend.dialog
        button
            width:auto !important;
    .examinationIndex,.recommend.dialog
        height:auto;
        button
            width:auto;
        .ivu-input
            background-color: #fff
        .ivu-modal-body
            background-color: #fff
        .ivu-input-search
            border: 1px solid #d1d2d3 !important;
            padding: 0 4px !important;
            width: 25px;
            background-color: #fff !important;
            i
                color: #117dd6;
        .page-info2
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
