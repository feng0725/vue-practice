<template>
    <div class="course-order two-page">
        <div class="btn-box">

        </div>
        <div class="search-box clearfix">
            <Form class="fr" ref="search" :model="search" inline>
                <FormItem prop="user" v-if="$store.getters.isAdmins">
                    <Select v-model="search.appid" style="width:170px" placeholder="按公众号筛选"
                            @on-change="enterpriseChangeSelect">
                        <Option v-for="item in appInfoList" :value="item.appid" :key="item.appid">{{ item.name }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem prop="password" v-if="$store.getters.isAdmins">
                    <Select v-model="search.enterprise_id" style="width:170px" placeholder="按企业筛选"
                            @on-change="getCourseList">
                        <Option v-for="(item,index) in enterpriseList" :value="item.enterpriseId" :key="index">{{
                            item.name }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Select v-model="search.course_id" style="width:170px" placeholder="按课程筛选">
                        <Option v-for="(item,index) in courseList" :value="item.courseId" :key="index">{{
                            item.courseName }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Select v-model="search.status" style="width:170px" placeholder="订单状态">
                        <Option v-for="(item,index) in statusList" :value="item.value" :key="index">{{ item.label }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <i-input style="width:260px;" class="search" @on-search="searchTableData"
                             v-model.trim="search.queryCode" search enter-button
                             placeholder="输入编号/订单号/购买人/手机号"></i-input>
                </FormItem>
            </Form>
        </div>

        <div class="tableList">
            <Table @on-sort-change="tableSorting" :columns="table.columns" :data="table.data"></Table>
        </div>
        <div class="clearfix page-info">
            <div class="fl">已选0项,共{{table.total}}项</div>
            <myPage class="fr page" @on-change="changePage" :count="count"></myPage>
            <div class="fr">每页显示行:10行</div>
        </div>
        <!--dialog-->
        <div>
            <MyDialog :title="'申请退款'" :loading.sync="refundLoading" @ok="applyRefundFn" width="475" :visible.sync="isRefund">
                <div class="refund">
                    <p>最高可退金额: <span>{{refund.maxRefundMoney}}</span> 元</p>
                    <Form ref="refund" :model="refund" :rules="ruleValidate" label-position="left" :label-width="140">
                        <FormItem label="申请退款金额(必填)" prop="applyRefundMoney">
                            <Input @on-keyup="fileterApplyRefundMoney" @on-blur="testRule"  v-model="refund.applyRefundMoney"  type="text"></Input>
                        </FormItem>
                        <FormItem label="申请退款原因(必填)" prop="refundReason">
                            <Input v-model="refund.refundReason" type="textarea" :autosize="{minRows: 3}"
                                   placeholder=""/>
                        </FormItem>
                    </Form>
                </div>
            </MyDialog>
        </div>

    </div>

</template>

<script>
import { storage } from '../../../../common/js/qylh';

let maxRefundMoney = '';
export default {
    name: 'course-order',
    data() {
        return {
            refundLoading: false,
            refund: {
                maxRefundMoney: '',
                applyRefundMoney: '',
                refundReason: ''
            },
            statusList: [
                { value: this.$tools.defaultAll, label: '全部订单状态' },
                { value: '2', label: '已完成' },
                { value: '3', label: '申请退款' },
                { value: '4', label: '退款失败' },
                { value: '5', label: '退款完成' }
            ],
            appInfoList: [],
            enterpriseList: [],
            courseList: [],
            isRefund: false,
            isQuit: false,
            isAddGroup: false,
            isAddUserType: false,
            count: 0,
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
                        title: '商品名称',
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
                        key: 'status',
                        maxWidth: 120,
                        align: 'center',
                        render: (h, params) => {
                            let status = params.row.status;
                            let text = this.statusList.filter((item) => {
                                return item.value == status;
                            })[0].label;
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
                        maxWidth: 120,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', {}, params.row.appVO.name);
                        }
                    },
                    {
                        title: '商品所属企业/个人',
                        key: 'enterpriseVO',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', {}, params.row.enterpriseVO.name);
                        }
                    },
                    {
                        title: '支付方式',
                        key: 'address',
                        maxWidth: 120,
                        align: 'center',
                        render: (h, params) => {
                            let text = params.row.payments == 1 ? '微信支付' : '免费';
                            return h('div', {}, text);
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
                        width: 180,
                        align: 'center',
                        render: (h, params) => {
                            let color = '#11ba9e';

                            if (
                                (params.row.payments == 1 && params.row.status != 5 && params.row.isReplace != '1') ||
                                (params.row.payments == 1 && params.row.status == 4 && params.row.isReplace != '1')
                            ) {
                                let disabled = false;
                                if (params.row.status == 3) {
                                    disabled = true;
                                    color = '#c5c8ce';
                                }
                                return h('div', [
                                    h(
                                        'Button',
                                        {
                                            props: {
                                                type: 'text',
                                                size: 'small',
                                                disabled: disabled
                                            },
                                            attrs: {},
                                            class: {},
                                            style: {
                                                marginRight: '5px',
                                                color: color,
                                                textAlign: 'center'
                                            },
                                            on: {
                                                click: () => {
                                                    this.isRefund = true;
                                                    this.table.selected = params.row;
                                                    this.getMaxRefundMoney(params.row);
                                                }
                                            }
                                        },
                                        '申请退款'
                                    ),
                                    h(
                                        'Button',
                                        {
                                            props: {
                                                type: 'text',
                                                size: 'small',
                                                textAlign: 'center',
                                                disabled: disabled
                                            },
                                            style: {
                                                marginRight: '5px',
                                                color: color
                                            },
                                            on: {
                                                click: () => {
                                                    storage.set('courseOrder', params.row);
                                                    this.$router.push({
                                                        path: '/order-management/course/change'
                                                    });
                                                    this.remove(params.index);
                                                }
                                            }
                                        },
                                        '订单更换'
                                    )
                                ]);
                            } else {
                                return h('div', {}, '');
                            }
                        }
                    }
                ],
                data: []
            },
            search: {
                appid: this.$tools.defaultAll,
                enterprise_id: '-1',
                course_id: '-1',
                status: this.$tools.defaultAll,
                queryCode: '',
                pageNo: 1,
                pageSize: 10,
                user_id: this.$store.state.userInfo.userId,
                sortType: '0'
            },
            ruleValidate: {
                applyRefundMoney: [
                    {
                        validator(rule, value, callback, source, options) {
                            if (value == 0) {
                                callback('退款金额不可为0');
                            } else if (!/^\d+(\.\d{1,2})?$/.test(value)) {
                                callback('请填写正确的金额');
                            } else {
                                callback();
                            }
                        },
                        trigger: 'blur'
                    },
                    {
                        required: true,
                        message: '请填写退款金额'
                    }
                    // {
                    //     message: '请填写正确的金额',
                    //     pattern: /^\d+(\.\d{1,2})?$/
                    // }
                ],
                refundReason: {
                    required: true,
                    message: '请输入退款原因',
                    trigger: 'blur'
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
            this.getAllAppInfoList();
            this.getEnterpriseList();
            this.getCourseList();
            this.getTableData();
            this.filterTableColumns('商品所属企业/个人');
        },

        searchTableData() {
            this.search.pageNo = 1;
            this.getTableData();
        },
        getTableData() {
            this.$fetch({
                url: '/system-backend/courseOrder/selectCourseOrder',
                data: this.search
            }).then((res) => {
                this.table.data = res.obj.list;
                this.table.total = res.obj.total;
                this.count = res.obj.pages;
            });
        },
        enterpriseChangeSelect() {
            this.search.enterprise_id = '-1';
            this.search.course_id = '-1';
            this.getEnterpriseList();
            this.getCourseList();
        },
        getAllAppInfoList() {
            this.$fetch({
                url: '/system-backend/courseOrder/selectAllAppInfo'
            }).then((res) => {
                this.appInfoList = res.obj;
                this.appInfoList.unshift(this.ALLSelect.appList1);
            });
        },
        getMaxRefundMoney(row) {
            this.$fetch({
                url: '/system-backend/courseOrder/selectApplyRefundMaxMoney',
                data: {
                    course_id: row.courseVO.courseId,
                    order_id: row.orderId
                }
            }).then((res) => {
                this.refund.maxRefundMoney = res.obj.maxRefundMoney;
                maxRefundMoney = res.obj.maxRefundMoney;
            });
        },
        applyRefundFn() {
            let params = this.$tools.cloneObj(this.refund);
            params.order_id = this.table.selected.orderId;
            this.$refs.refund.validate((valid) => {
                if (valid) {
                    this.$fetch({
                        url: '/system-backend/courseOrder/applyRefund',
                        data: params
                    }).then((res) => {
                        if (res.code == 200) {
                            this.$Message.success(res.msg);
                            this.isRefund = false;
                            this.getTableData();
                        } else {
                            this.$Message.error(res.msg);
                        }
                        this.$nextTick(() => {
                            this.refundLoading = false;
                        });
                    });
                }else {
                    this.$nextTick(() => {
                        this.refundLoading = false;
                    });
                }
            });
        },
        fileterApplyRefundMoney(event) {
            console.log(event.target.value);
            this.refund.applyRefundMoney = this.refund.applyRefundMoney.replace(/[^\.\d]/g, '');
        },
        testRule() {
            if (this.refund.applyRefundMoney > parseFloat(this.refund.maxRefundMoney)) {
                this.$Notice.error({
                    title: '退款金额异常',
                    desc: '退款金额不可大于最高可退金额'
                });
            }
        },
        getEnterpriseList() {
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
        getCourseList() {
            this.search.course_id = '-1';
            this.courseList = [];
            this.$fetch({
                url: '/system-backend/courseOrder/selectCourseInfo',
                data: {
                    user_id: this.$store.state.userInfo.userId,
                    appid: this.search.appid,
                    enterprise_id: this.search.enterprise_id
                }
            }).then((res) => {
                this.courseList = res.obj;
                this.courseList.unshift(this.ALLSelect.course);
            });
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
    .course-order
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
