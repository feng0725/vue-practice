<template>
    <div class="refund-review two-page">
        <div class="btn-box">

        </div>
        <div class="search-box clearfix">
            <Form class="fr" ref="formInline" :model="search" inline>
                <FormItem prop="user">
                    <Select v-model="search.appid" style="width:190px" placeholder="按公众号筛选" @on-change="getEnterpriseList">
                        <Option v-for="item in appInfoList" :value="item.appid" :key="item.appid">{{ item.name }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem prop="password">
                    <Select v-model="search.enterprise_id" style="width:190px" placeholder="按企业筛选">
                        <Option v-for="item in enterpriseList" :value="item.enterpriseId" :key="item.enterpriseId">{{
                            item.name }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Select v-model="search.status" style="width:190px" placeholder="订单状态">
                        <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <i-input class="search" @on-search="searchTaleData" v-model.trim="search.queryCode" search enter-button
                             placeholder="输入课程名称"></i-input>
                </FormItem>
            </Form>
        </div>

        <div class="tableList">
            <Table  @on-sort-change="tableSorting" :columns="table.columns" :data="table.data"></Table>
        </div>
        <div class="clearfix page-info">
            <div class="fl">已选0项,共{{table.total}}项</div>
            <myPage class="fr page" @on-change="changePage" :count="count"></myPage>
            <div class="fr">每页显示行:10行</div>
        </div>
        <!--dialog-->
        <div>
            <!--课程退款-->
            <MyDialog :title="refundStatus.title" width="475" :visible.sync="isRefund">
                <div class="refund">
                    <p>最高可退金额: <span>{{courseRefund.refundMoneyStr}}</span> 元</p>
                    <Form :model="formLeft" label-position="left" :label-width="140">
                        <FormItem label="申请退款金额(必填)">
                            <Input disabled v-model="courseRefund.applyMoneyStr"></Input>
                        </FormItem>
                        <FormItem label="申请退款原因(必填)">
                            <Input disabled v-model="courseRefund.refundReason" type="textarea" :autosize="{minRows: 3}"
                                   placeholder=""/>
                        </FormItem>
                    </Form>
                </div>
                <div slot="footer">
                        <Button  v-if="refundStatus.status == 3" type="primary" @click="courseOrderRefundExamine(0)" class="refuse">拒绝</Button>
                        <Button  v-if="refundStatus.status == 3" type="primary" @click="courseOrderRefundExamine(1)" class="green">同意</Button>
                    <Button v-if="refundStatus.status != 3" @click="isRefund=false">关闭</Button>
                </div>
            </MyDialog>
            <!--课时退款-->
            <MyDialog :title="refundStatus.title"  width="480" :visible.sync="isRefund2">
                <div class="refund">
                    <p>最高可退课时: <span>{{courseRefund.refundPeriods}}</span> 小时</p>
                    <Form :model="periodsOrderRefund" ref="refund" label-position="left" :label-width="140" >
                        <FormItem style="text-align: left;" label="申请退款课时数(必填)" prop="applyRefundPeriods">
                            <Input disabled style="width:200px;"  v-model="periodsOrderRefund.applyPeriods"></Input>
                            小时
                        </FormItem>
                        <FormItem label="金额">
                            <div class="money">{{periodsOrderRefund.applyMoneyStr}}元</div>
                        </FormItem>
                        <FormItem  style="text-align: left;" label="申请退款原因(必填)" prop="refundReason">
                            <Input disabled style="width:200px;" v-model="periodsOrderRefund.refundReason" type="textarea" :autosize="{minRows: 3}"
                                   placeholder=""/>
                        </FormItem>
                    </Form>
                </div>
                <div slot="footer">
                        <Button  v-if="refundStatus.status == 3" type="primary" @click="periodsOrderRefundExamine(0)" class="refuse">拒绝</Button>
                        <Button  v-if="refundStatus.status == 3" type="primary" @click="periodsOrderRefundExamine(1)" class="green">同意</Button>
                    <Button v-if="refundStatus.status != 3" @click="isRefund2=false">关闭</Button>
                </div>
            </MyDialog>
        </div>
    </div>

</template>

<script>
export default {
    name: 'refund-review',
    data() {
        return {
            refundStatus: {
                status: '',
                title: ''
            },
            enterpriseList: [],
            appInfoList: [],
            statusList: [
                { value: this.$tools.defaultAll, label: '全部订单状态' },
                { value: '3', label: '申请退款' },
                { value: '4', label: '退款失败' },
                { value: '5', label: '退款完成' }
            ],
            isRefund2: false,
            isRefund: false,
            count: 0,
            table: {
                total: 0,
                selected: {
                    status: ''
                },
                columns: [
                    {
                        title: '编号',
                        width: 80,
                        key: 'orderId',
                        align: 'center'
                    },
                    {
                        title: '购买人',
                        key: 'age',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', {}, params.row.userVO.nickname);
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
                        title: '订单商品名称',
                        key: 'address',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', {}, params.row.courseVO.courseName);
                        }
                    },
                    {
                        title: '金额',
                        key: 'priceStr',
                        maxWidth: 120,
                        align: 'center'
                    },
                    {
                        title: '状态',
                        key: 'address',
                        maxWidth: 120,
                        align: 'center',
                        render: (h, params) => {
                            let status = this.statusList.filter((item) => item.value == params.row.status)[0].label;
                            return h('div', {}, status);
                        }
                    },
                    {
                        title: '订单号',
                        key: 'wxOrderNumber',
                        align: 'center'
                    },
                    {
                        title: '支付方式',
                        key: 'address',
                        maxWidth: 120,
                        align: 'center',
                        render: (h, params) => {
                            let payments = params.row.payments;
                            let text = '';
                            if (payments == 1) {
                                text = '微信支付';
                            } else if (payments == 2) {
                                text = '线下支付';
                            }
                            return h('div', {}, text);
                        }
                    },
                    {
                        title: '购买渠道',
                        key: 'address',
                        maxWidth: 120,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', {}, params.row.appVO.name);
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
                        title: '下单时间',
                        key: 'buyTimeStr',
                        maxWidth: 160,
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
                            let text = params.row.status == 3 ? '审核' : '退款原因 ';
                            let color = params.row.status == 3 ? '#11ba9e' : '#117dd6';
                            return h('div', [
                                h(
                                    'Button',
                                    {
                                        props: {
                                            type: 'text',
                                            size: 'small'
                                        },
                                        class: {
                                            bar: params.row.isAlive
                                        },
                                        style: {
                                            marginRight: '5px',
                                            color: color,
                                            textAlign: 'center'
                                        },
                                        on: {
                                            click: () => {
                                                // orderType 1 课程 2 课时
                                                this.table.selected = params.row;
                                                this.refundStatus.status = params.row.status;
                                                this.refundStatus.title =
                                                    params.row.status == 3 ? '退款审核' : '退款原因';

                                                if (params.row.orderType == 1) {
                                                    this.selectRefundCourseOrderInfo();
                                                    this.isRefund = true;
                                                } else if (params.row.orderType == 2) {
                                                    this.selectRefundPeriodsOrderInfo();
                                                    this.isRefund2 = true;
                                                }

                                                // this.show(params.index);
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
            formLeft: {},
            search: {
                pageNo: 1,
                pageSize: 10,
                appid:this.$tools.defaultAll,
                enterprise_id: -1,
                status:this.$tools.defaultAll,
                queryCode: '',
                sortType: '0'
            },
            courseRefund: {
                applyMoney: '',
                applyMoneyStr: '',
                orderId: '',
                refundMoney: '',
                refundMoneyStr: '',
                refundReason: ''
            },
            periodsOrderRefund: {
                applyMoney: '',
                applyMoneyStr: '',
                applyPeriods: '',
                orderId: '',
                refundPeriods: '',
                refundReason: ''
            }
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.getTableData();
            this.getEnterpriseList();
            this.selectAllAppInfo();
        },
        searchTaleData() {
            this.search.pageNo = 1;
            this.getTableData();
        },
        getTableData() {
            this.$fetch({
                url: '/system-backend/courseOrder/selectRefundExamineList',
                data: this.search
            }).then((res) => {
                this.table.data = res.obj.list;
                this.table.total = res.obj.total;
                this.count = res.obj.pages;
            });
        },
        // 查询课程退款详情
        selectRefundCourseOrderInfo() {
            this.$fetch({
                url: '/system-backend/courseOrder/selectRefundCourseOrderInfo',
                data: {
                    order_id: this.table.selected.orderId
                }
            }).then((res) => {
                this.courseRefund = res.obj;
            });
        },
        // 查询课时退款详情
        selectRefundPeriodsOrderInfo() {
            this.$fetch({
                url: '/system-backend/periodOrder/selectRefundPeriodsOrderInfo',
                data: {
                    order_id: this.table.selected.orderId
                }
            }).then((res) => {
                this.periodsOrderRefund = res.obj;
            });
        },
        // 提交课程审核 type 0 不同意 1 同意
        courseOrderRefundExamine(type) {
            this.$fetch({
                url: '/system-backend/courseOrder/courseOrderRefundExamine',
                data: {
                    order_id: this.table.selected.orderId,
                    isAgree: type
                }
            }).then((res) => {
                if (res.code == 200) {
                    this.$Message.success(res.msg);
                    this.isRefund = false;
                    this.getTableData();
                } else {
                    this.$Message.error(res.msg);
                }
            });
        },
        // 提交课时审核 type 0 不同意 1 同意
        periodsOrderRefundExamine(type) {
            this.$fetch({
                url: '/system-backend/periodOrder/periodsOrderRefundExamine',
                data: {
                    order_id: this.table.selected.orderId,
                    isAgree: type
                }
            }).then((res) => {
                if (res.code == 200) {
                    this.$Message.success(res.msg);
                    this.isRefund2 = false;
                    this.getTableData();
                } else {
                    this.$Message.error(res.msg);
                }
            });
        },
        getEnterpriseList() {
            this.search.enterprise_id = '-1';
            this.$fetch({
                url: '/system-backend/courseOrder/selectAllEnterpriseInfo',
                data: {
                    appid: this.search.appid
                }
            }).then((res) => {
                this.enterpriseList = res.obj;
                this.enterpriseList.unshift(this.ALLSelect.enterprise);
            });
        },
        selectAllAppInfo() {
            this.$fetch({
                url: '/system-backend/courseOrder/selectAllAppInfo'
            }).then((res) => {
                this.appInfoList = res.obj;
                this.appInfoList.unshift(this.ALLSelect.appList1);
            });
        },

        changePage(index) {
            this.search.pageNo = index;
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

    .money
        width: 200px;
        height: 32px;
        line-height: 32px;
        text-align: left;
        padding-left: 10px;
        color: #d9d9d9;
        border: 1px solid #d1d5de
</style>
<style lang="stylus">
    .refund-review
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
        .ivu-input[disabled]
            color: #000;
</style>
