<template>
    <div class="buy-details edit-new">
        <header>
            <router-link class="icon-box" tag="div" to="/order-management/course-statistics">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-left"></use>
                </svg>
            </router-link>
            <div class="title">
                购买详情
            </div>
        </header>
        <div class="wrapper clearfix">
            <div class="change-item">
                <div class="title-box">
                    <div>
                        <span class="title">课程名称</span>
                        <span class="con">{{course.courseVO.courseName}}</span>
                    </div>
                    <div>
                        <span class="title">购买人数</span>
                        <span class="con">{{course.courseVO.buyNum}}</span>
                    </div>
                    <div>
                        <span class="title">净收入</span>
                        <span class="con">{{course.courseVO.netIncome}}</span>
                    </div>
                    <div>
                        <span class="title">总支付金额</span>
                        <span class="con">{{courseVO.totalPayMoney}}</span>
                    </div>
                    <div>
                        <span class="title">总退款金额</span>
                        <span class="con">{{courseVO.totalRefundMoney}}</span>
                    </div>
                </div>
                <div>
                    <Button style="width:95px;" type="primary" @click="exportTable">导出</Button>
                </div>
                <div class="table-box tableList">
                    <Table  @on-sort-change="tableSorting" :columns="table.columns" :data="table.data" ref="table"></Table>

                </div>
                <div class="clearfix page-info absolute">
                    <div class="fl">已选0项,共{{table.total}}项</div>
                    <myPage class="fr page" @on-change="changePage" :count="count"></myPage>
                    <div class="fr">每页显示行:10行</div>
                </div>
            </div>

        </div>
    </div>

</template>

<script>
import { storage } from '../../../../common/js/qylh';

export default {
    name: 'addAdmin',
    data() {
        return {
            course: storage.get('course-statistics'),
            courseVO: { totalPayMoney: '', totalRefundMoney: '' },
            table: {
                total: 0,
                columns: [
                    {
                        title: '购买人',
                        key: 'name',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', {}, params.row.userVO.nickname);
                        }
                    },
                    {
                        title: '课程名称',
                        key: 'age',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', {}, params.row.courseVO.courseName);
                        }
                    },
                    {
                        title: '所属企业',
                        key: 'address',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', {}, params.row.enterpriseVO.name);
                        }
                    },
                    {
                        title: '支付方式',
                        key: 'address',
                        align: 'center',
                        render: (h, params) => {
                            let payments = params.row.payments == 1 ? '微信支付' : '免费';
                            return h('div', {}, payments);
                        }
                    },
                    {
                        title: '订单状态',
                        key: 'address',
                        align: 'center',
                        render: (h, params) => {
                            let text = '';
                            let type = params.row.status;
                            if (type == 2) {
                                text = '已完成';
                            } else if (type == 3) {
                                text = '申请退款';
                            } else if (type == 5) {
                                text = '退款完成';
                            } else if (type == 4) {
                                text = '退款失败';
                            }
                            return h('div', {}, text);
                        }
                    },
                    {
                        title: '退款金额',
                        key: 'address',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', {}, params.row.refund.applyMoneyStr);
                        }
                    },
                    {
                        title: '下单时间',
                        key: 'address',
                        sortable: 'custom',
                        align: 'center',
                        sortType: 'desc',
                        className: 'fontBlue',
                        render: (h, params) => {
                            return h('div', {}, params.row.buyTimeStr);
                        }
                    }
                ],
                data: []
            },

            count: 0,

            formValidate: {
                name: '',
                mail: '',
                city: '',
                gender: '',
                interest: [],
                date: '',
                time: '',
                desc: ''
            },
            ruleValidate: {
                name: [
                    {
                        required: true,
                        message: 'The name cannot be empty',
                        trigger: 'blur'
                    }
                ],
                mail: [
                    {
                        required: true,
                        message: '',
                        trigger: 'blur'
                    },
                    {
                        type: 'email',
                        message: 'Incorrect email format',
                        trigger: 'blur'
                    }
                ]
            },
            search: {
                pageNo: 1,
                pageSize: 10,
                sortType: '0'
            }
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.getMoney();
            this.getTableData();
        },
        getTableData() {
            let params = this.$tools.cloneObj(this.search);
            params.course_id = this.course.courseId;
            this.$fetch({
                url: '/system-backend/courseOrder/selectCourseBuyDetailsList',
                data: params
            }).then((res) => {
                this.table.data = res.obj.list;
                this.table.total = res.obj.total;
                this.count = res.obj.pages;
            });
        },
        getMoney() {
            this.$fetch({
                url: '/system-backend/courseOrder/selectCourseBuyDetails',
                data: {
                    course_id: this.course.courseId
                }
            }).then((res) => {
                this.courseVO = res.obj.courseVO;
            });
        },
        changePage(index) {
            this.search.pageNo = index;
            this.getTableData();
        },
        exportTable() {
            this.$fetch({
                url: '/system-backend/courseOrder/exportCourseBuyDetailsList',
                data: {
                    course_id: this.course.courseId,
                    sortType: this.search.sortType
                }
            }).then((res) => {
                if (res.code == 200) {
                    window.open(res.obj.url);
                } else {
                    this.$Message.error(res.msg);
                }
            });
            // this.$refs.table.exportCsv({
            //     filename: 'Sorting and filtering data',
            //     original: false
            // });
        },
        tableSorting({ column, key, order }) {
            this.search.sortType = order == 'desc' ? '0' : '1';
            this.getTableData();
        }
    }
};
</script>

<style scoped lang="stylus">

    .wrapper
        position: relative;
        width: 1150px;
        min-height: 500px;
        padding: 20px;
        background-color: #fff;
        margin: 0 auto;
        .change-item
            padding: 0 30px 0 70px;
            .label
                position: absolute;
                width: 50px;
                left: -50px;
        .table-box
            position: relative;
            margin-top:15px;
            background-color: #f6f8fa
            .label
                position: absolute;
                width: 50px;
                left: -60px;
        .title-box
            position: relative;
            display: flex;
            margin-bottom: 15px;
            justify-content: space-around
            padding: 8px 0;
            background-color: #f6f8fa
            >div
                /*flex:1;*/
                text-align: center;
            .title
                color: #939494
                margin: 0 10px;
            .con
                color: #000;

        .btn-box
            width: 100%;
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #e6e8ee;
            .btn
                width: 115px;
                margin-right: 30px;

    .page-info
        left:70px;
        right:30px;

</style>
<style lang="stylus">
    .buy-details
        .tree
            > ul
                padding: 5px 0;
                padding-left: 15px;
                border-bottom: 1px solid #e7e9ee;
</style>
