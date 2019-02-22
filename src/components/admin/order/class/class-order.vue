<template>
    <div class="class-order two-page ">
        <router-link class="btn-box" to="/order-management/class/add-class" tag="div">
            <Button type="primary">新建订单</Button>
        </router-link>
        <div class="search-box clearfix">
            <Form class="fr" ref="search" :model="search" inline>
                <FormItem prop="user">
                    <Select v-model="search.status" style="width:190px" placeholder="订单状态">
                        <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <i-input class="search" @on-search="searchTableData" v-model.trim="search.queryCode" search enter-button placeholder="输入购买人/企业/手机号"></i-input>
                </FormItem>
            </Form>
            <p class="income">课时总量:{{total.totalPeriods}}小时,净收入:{{total.netIncome}}元</p>
        </div>

        <div class="tableList">
            <Table  @on-sort-change="tableSorting"  :columns="table.columns" :data="table.data"></Table>
        </div>
        <div class="clearfix page-info">
            <div class="fl">已选0项,共{{table.total}}项</div>
            <myPage class="fr page" @on-change="changePage" :count="count"></myPage>
            <div class="fr">每页显示行:10行</div>
        </div>
        <!--dialog-->
        <div>

            <MyDialog :title="'申请退款'" @ok="applyRefundFn" width="480" :visible.sync="isRefund">
                <div class="refund">
                    <p>最高可退课时: <span>{{refund.maxRefundPeriods}}</span> 小时</p>
                    <Form :model="refund" ref="refund" label-position="left" :label-width="140"  :rules="refundRules">
                        <FormItem style="text-align: left;" label="申请退款课时数(必填)" prop="applyRefundPeriods">
                            <Input style="width:200px;" @on-keyup="changeRefundPeriods" v-model="refund.applyRefundPeriods"></Input>
                            小时
                        </FormItem>
                        <FormItem label="金额">
                            <div class="money">{{refund.maxRefundMoney }}元</div>
                        </FormItem>
                        <FormItem style="text-align: left;" label="申请退款原因(必填)" prop="refundReason">
                            <Input style="width:200px;" v-model="refund.refundReason" type="textarea" :autosize="{minRows: 3}" placeholder=""/>
                        </FormItem>
                    </Form>
                </div>
            </MyDialog>


        </div>

    </div>

</template>

<script>
export default {
    name: 'class-order',
    data() {
        return {
            total: {
                netIncome: '',
                totalPeriods: ''
            },
            statusList: [
                { value: this.$tools.defaultAll, label: '全部订单状态' },
                { value: '2', label: '已完成' },
                { value: '3', label: '申请退款' },
                { value: '4', label: '退款失败' },
                { value: '5', label: '退款完成' }
            ],
            isRefund: false,
            isQuit: false,
            isAddGroup: false,
            isAddUserType: false,
            count: 0,
            formLeft: {},
            table: {
                total: 0,
                selected: {},
                columns: [
                    {
                        title: '编号',
                        width: 80,
                        key: 'orderId',
                        align: 'center'
                    },
                    {
                        title: '购买人/企业 ',
                        key: 'age',
                        align: 'center',
                        render: (h, params) => {
                            let text = '';
                            if (params.row.buyUserType == '1') {
                                text = params.row.enterpriseVO.name;
                            } else if (params.row.buyUserType == '2') {
                                text = params.row.userVO.nickname;
                            }
                            return h('div', {}, text);
                        }
                    },
                    {
                        title: '手机号',
                        key: 'address',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', {}, params.row.userVO.userAccount);
                        }
                    },
                    {
                        title: '课时数(小时)',
                        key: 'periods',
                        align: 'center'
                    },
                    {
                        title: '金额',
                        key: 'priceStr',
                        align: 'center'
                    },
                    {
                        title: '状态',
                        key: 'address',
                        align: 'center',
                        render: (h, params) => {
                            let type = params.row.status;
                            let text = this.statusList.filter((item) => item.value == type)[0].label;
                            return h('div', {}, text);
                        }
                    },
                    {
                        title: '订单号',
                        key: 'wxOrderNumber',
                        align: 'center'
                    },
                    {
                        title: '购买渠道',
                        key: 'address',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', {}, params.row.appVO.name);
                        }
                    },
                    {
                        title: '支付方式',
                        key: 'address',
                        align: 'center',
                        render: (h, params) => {
                            let type = params.row.payments;
                            let text = type == 1 ? '微信支付' : '线下支付';
                            return h('div', {}, text);
                        }
                    },
                    {
                        title: '下单时间',
                        key: 'buyTimeStr',
                        sortable: 'custom',
                        align: 'center',
                        sortType: 'desc',
                        className: 'fontBlue'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 100,
                        align: 'center',
                        render: (h, params) => {
                            let status = params.row.status;
                            let text = '';
                            let color = '';
                            if (status == 3) {
                                text = '退款中';
                                color = '#999';
                            } else if (status == 2 || status == 4) {
                                color = '#11ba9e';
                                if (params.row.appVO.name == '线下') {
                                    text = '编辑';
                                } else {
                                    text = '申请退款';
                                }
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
                                            marginRight: '5px',
                                            color: color,
                                            textAlign: 'center'
                                        },
                                        on: {
                                            click: () => {
                                                if (text == '编辑') {
                                                    this.$router.push({
                                                        path: '/order-management/class/add-class',
                                                        query: {
                                                            id: params.row.orderId
                                                        }
                                                    });
                                                } else if (text == '申请退款') {
                                                    this.table.selected = params.row;
                                                    this.selectApplyRefundMaxPeriods(params.row);
                                                    this.isRefund = true;
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
            search: {
                pageNo: 1,
                pageSize: 10,
                user_id: this.$store.state.userInfo.userId,
                status: this.$tools.defaultAll,
                queryCode: '',
                sortType: '0'
            },
            refund: {
                maxRefundMoney: '',
                averagePeriodsPrice: 1,
                order_id: '',
                maxRefundPeriods: '',
                applyRefundPeriods: '',
                refundReason: ''
            },
            refundRules: {
                applyRefundPeriods: [
                    {
                        required: true,
                        message: '请填写退款课时数'
                    },
                    {
                        validator(rule, value, callback, source, options) {
                            if (value == 0) {
                                callback('退款课时数不可为0');
                            } else {
                                callback();
                            }
                        },
                        trigger: 'blur'
                    }
                ],
                refundReason: {
                    required: true,
                    message: '请填写退款原因'
                }
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
        getMoney() {
            this.$fetch({
                url: '/system-backend/periodOrder/selectTotalPeriodsAndNetIncome',
                data: this.search
            }).then((res) => {
                this.total = res.obj;
            });
        },
        searchTableData() {
            this.search.pageNo = 1;
            this.getTableData();
        },
        getTableData() {
            this.$fetch({
                url: '/system-backend/periodOrder/selectPeriodOrder',
                data: this.search
            }).then((res) => {
                this.table.data = res.obj.list;
                this.table.total = res.obj.total;
                this.count = res.obj.pages;
                this.getMoney();
            });
        },
        selectApplyRefundMaxPeriods(row) {
            this.$fetch({
                url: '/system-backend/periodOrder/selectApplyRefundMaxPeriods',
                data: {
                    user_id: row.userId,
                    order_id: row.orderId
                }
            }).then((res) => {
                if (res.code == 200) {
                    this.refund.averagePeriodsPrice = res.obj.averagePeriodsPrice;
                    this.refund.maxRefundPeriods = res.obj.maxRefundPeriods;
                } else {
                    this.$Message.error(res.msg);
                }
            });
        },
        applyRefundFn() {
            let params = this.$tools.cloneObj(this.refund);
            params.order_id = this.table.selected.orderId;
            this.$refs.refund.validate((valid) => {
                if (valid) {
                    this.$fetch({
                        url: '/system-backend/periodOrder/applyRefund',
                        data: params
                    }).then((res) => {
                        if (res.code == 200) {
                            this.$Message.success(res.msg);
                            this.isRefund = false;
                            this.getTableData();
                        } else {
                            this.$Message.error(res.msg);
                        }
                    });
                }
            });
        },
        changeRefundPeriods(event) {
            let refund = this.refund;
            refund.applyRefundPeriods =
                event.srcElement.value > refund.maxRefundPeriods ? refund.maxRefundPeriods : event.srcElement.value;

            refund.maxRefundMoney = refund.applyRefundPeriods * refund.averagePeriodsPrice;
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
        left: 0;
        bottom: 0;
        padding: 8px;
        font-size: 14px;
        background-color: #f6f8fa
        color: #0c6bba
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
    .class-order
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
