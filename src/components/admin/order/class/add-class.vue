<template>
    <div class="add-class edit-new">
        <header>
            <router-link class="icon-box" tag="div" to="/order-management/class">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-left"></use>
                </svg>
            </router-link>
            <div class="title">
                {{title}}课时订单
            </div>
        </header>
        <div class="wrapper clearfix">
            <div class="title">
                <Steps size="small" :current="1">
                    <Step title="填写订单信息" content=""></Step>

                </Steps>
            </div>
            <div class="clearfix">
                <div class="left fl">
                    <Form class="from" ref="formValidate" :model="search" :rules="ruleValidate" :label-width="180"
                          label-position="left">
                        <FormItem label="购买人(必填)" prop="phone">
                            <Select v-model="userType" style="width:200px">
                                <Option v-for="item in userTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>                        </FormItem>
                        <FormItem :label="`${userType}(必填)`" prop="user_account">
                            <Input style="width: 200px;" v-model="search.user_account" placeholder=""></Input>
                        </FormItem>
                        <FormItem label=" 课时数(必填)" prop="periods">
                            <Input style="width: 200px;" v-model="search.periods" placeholder=""></Input> 小时
                        </FormItem>
                        <FormItem label="金额(必填)" prop="price">
                            <Input style="width: 200px;" v-model="search.price" placeholder=""></Input> 元
                        </FormItem>
                        <FormItem label="课时有效期截止日期" prop="mail">
                            <DatePicker type="date" :value="search.time" @on-change="changeTime" placeholder="选择日期" style="width: 200px"></DatePicker>
                        </FormItem>
                    </Form>
                </div>
            </div>
            <div class="btn-box fl">
                <Button class="btn fr" type="primary" @click="next">提交</Button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'add-class',
    computed: {
    },
    data() {
        return {
            title: '新建',
            orderId: this.$route.query.id,
            userTypeList: [{ value: '个人用户账户', label: '个人' }, { value: '企业管理员账号', label: '企业' }],
            userType: '个人用户账户',
            addUser: false,
            ruleValidate: {
                user_id: [
                    {
                        required: true,
                        message: '请输入用户账号'
                    }
                ],
                periods: [
                    {
                        required: true,
                        message: '请输入课时数'
                    }
                ],
                price: [
                    {
                        required: true,
                        message: '请输入金额'
                    }
                ]
            },
            search: {
                buy_type: '',
                user_account: '',
                periods: '',
                price: '',
                expiry_time: '',
                time: ''
            }
        };
    },
    mounted() {
        if (this.orderId) {
            this.title = '编辑';
            this.$fetch({
                url: '/system-backend/periodOrder/selectPeriodsOrderInfo',
                data: {
                    order_id: this.orderId
                }
            }).then((res) => {
                if (res.obj.buyUserType == '1') {
                    this.userType = '企业管理员账号';
                } else if (res.obj.buyUserType == '2') {
                    this.userType = '个人用户账户';
                }
                this.search.order_id = this.orderId
                this.search.user_id = res.obj.userId;
                this.search.user_account = res.obj.userVO.userAccount;
                this.search.periods = res.obj.periods;
                this.search.price = res.obj.priceStr;
                if (res.obj.hasOwnProperty('expiryTime')) {
                    this.search.expiry_time = res.obj.expiryTime;
                    this.search.time = new Date(res.obj.expiryTime);
                }
            });
        }
    },
    methods: {
        changeTime(date) {
            this.search.expiry_time = date + ' 00:00:00';
        },
        next() {
            this.$refs.formValidate.validate((valid) => {
                if (valid) {
                    let url = '';
                    if (this.orderId) {
                        url = '/system-backend/periodOrder/updatePeriodsOrder';
                    } else {
                        url = '/system-backend/periodOrder/addPeriodsOrder';
                    }
                    let params = this.$tools.cloneObj(this.search);
                    params.buy_type = this.userType == '个人用户账户' ? 1 : 2;
                    this.$fetch({
                        url: url,
                        data: params
                    }).then((res) => {
                        if (res.code == 200) {
                            this.$Message.success(res.msg);
                            this.$router.back();
                        } else {
                            this.$Message.error(res.msg);
                        }
                    });
                }
            });
        }
    }
};
</script>

<style scoped lang="stylus">
    header
        margin-bottom: 12px;
        position: relative;
        .icon-box
            position: absolute;
            left: 0;
            top: 0;
            width 70px;
            height: 50px;
            line-height: 50px;
            background-color: #f8f8f8;
            text-align: center;
            cursor: pointer;
            svg
                width: 22px;
                height: 18px;
                cursor: pointer;
                color: #117dd6;

        .title
            background-color: #fff;
            margin-left: 70px;
            height: 50px;
            line-height: 50px;
            text-indent: 2em;

    .wrapper
        position: relative;
        width: 1150px;
        min-height: 500px;
        padding: 20px;
        background-color: #fff;
        margin: 0 auto;
        h4
            margin: 15px 0;
            margin-left: 8px;
        .title
            padding-bottom: 15px;
            border-bottom: 1px solid #e6e8ee;

        .from
            /*width:400px;*/
            margin-top: 20px;
            margin-left: 10px;
            margin-right: 10px;

        .btn-box
            width: 100%;
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #e6e8ee;
            .btn
                width: 115px;


</style>
<style lang="stylus">
    .select-list.dialog
        .ivu-modal-body
            background-color: #fff
        .ivu-checkbox
            margin: 0 10px;
</style>
