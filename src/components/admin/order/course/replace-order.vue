<template>
    <div class="add-admin edit-new">
        <header>
            <router-link class="icon-box" tag="div" to="/order-management/course/">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-left"></use>
                </svg>
            </router-link>
            <div class="title">
                更换订单
            </div>
        </header>
        <div class="wrapper clearfix">
            <div class="change-item">
                <div class="title-box">
                    <div class="label">原订单</div>
                    <span class="title">购买人</span>
                    <span class="con">{{originalOrder.userVO.nickname}}</span>
                    <span class="title">手机号</span>
                    <span class="con">{{originalOrder.userVO.userAccount}}</span>
                    <span class="title">商品名称</span>
                    <span class="con">{{originalOrder.courseVO.courseName}}</span>
                    <span class="title">订单编号</span>
                    <span class="con">{{originalOrder.wxOrderNumber}}</span>
                    <span class="title">下单时间</span>
                    <span class="con">{{originalOrder.buyTimeStr}}</span>
                </div>
                <div class="table-box tableList">
                    <div class="label">更换商品</div>
                    <Table  @on-sort-change="tableSorting"  @on-selection-change="selectedTable" :columns="table.columns" :data="table.data"></Table>

                </div>
                <div class="clearfix page-info">
                    <div class="fl">已选{{table.selectedList.length}}项,共{{table.total}}项</div>
                    <myPage class="fr page" @on-change="changePage" :count="count"></myPage>
                    <div class="fr">每页显示行:10行</div>
                </div>
            </div>

            <div class="btn-box fl">
                <Button class="btn fr" @click="orderReplace" :disabled="table.selectedList.length !=1" type="primary">提交</Button>
                <Button class="btn fr white-blue" @click="$router.back()" type="primary">取消</Button>
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
            originalOrder: storage.get('courseOrder'),
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
                        align: 'center'
                    },
                    {
                        title: '课程名称',
                        key: 'courseName',
                        align: 'center'
                    },
                    {
                        title: '金额',
                        key: 'presentPriceStr',
                        align: 'center'
                    },
                    {
                        title: '创建时间',
                        key: 'createTimeStr',
                        sortable: 'custom',
                        align: 'center',
                        sortType: 'desc',
                        className: 'fontBlue'
                    }
                ],
                data: []
            },
            count: 0,
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
            this.getTableData();
        },
        getTableData() {
            let params = this.$tools.cloneObj(this.search);
            params.appid = this.originalOrder.appVO.appid;
            params.enterprise_id = this.originalOrder.courseVO.enterpriseId;
            params.operator_id = this.originalOrder.courseVO.operatorId;
            params.price = this.originalOrder.priceStr;
            params.course_id = this.originalOrder.courseId;
            params.user_id = this.originalOrder.userId;

            this.$fetch({
                url: '/system-backend/courseOrder/replaceList',
                data: params
            }).then((res) => {
                this.successCallBack(res, () => {
                    this.table.data = res.obj.list;
                    this.table.total = res.obj.total;
                    this.count = res.obj.pages;
                });
            });
        },
        orderReplace() {
            this.$fetch({
                url: '/system-backend/courseOrder/orderReplace',
                data: {
                    user_id: this.$store.state.userInfo.userId,
                    old_order_price: this.originalOrder.priceStr,
                    old_order_id: this.originalOrder.orderId, // '',
                    old_course_id: this.originalOrder.courseVO.courseId, // '',
                    new_course_id: this.table.selectedList[0].courseId,
                    new_course_price: this.table.selectedList[0].presentPriceStr
                }
            }).then((res) => {
                if (res.code == 200) {
                    this.$Message.success(res.msg);
                    this.$router.back();
                } else {
                    this.$Message.error(res.msg);
                }
            });
        },
        changePage(index) {
            this.search.pageNo = index;
            this.getTableData();
        },
        selectedTable(list) {
            this.table.selectedList = list;
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
            background-color: #f6f8fa
            .label
                position: absolute;
                width: 50px;
                left: -60px;
        .title-box
            position: relative;
            padding:8px 0;
            margin-bottom: 28px;
            background-color: #f6f8fa
            .title
                color: #939494
                margin: 0 10px;
            .con
                color: #000;
                margin-right: 25px;

        .btn-box
            width: 100%;
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #e6e8ee;
            .btn
                width: 115px;
                margin-right:30px;

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
</style>
<style lang="stylus">
    .add-admin
        .tree
            > ul
                padding: 5px 0;
                padding-left: 15px;
                border-bottom: 1px solid #e7e9ee;
</style>
