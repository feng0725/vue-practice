<template>
    <div class="user-class-statistics two-page ">
        <router-link class="btn-box" to="/order-management/class/add-class" tag="div">
        </router-link>
        <div class="search-box clearfix">
            <Form class="fr" ref="formInline" :model="search"  inline>
                <FormItem prop="user">
                    <Select v-if="$store.getters.isAdmins" v-model="search.userType"  style="width:190px" placeholder="按用户类型筛选">
                        <Option v-for="(item,index) in userTypeArr" :value="item.value" :key="index">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <i-input class="search" @on-search="searchTableData" v-model.trim="search.search" search enter-button placeholder="输入认证企业、用户名称"></i-input>
                </FormItem>
            </Form>
            <p class="income" >
                课时消耗总量:{{periodConsumeSum | timeFormat2}}
            </p>
        </div>
        <div class="tableList">
            <Table @on-sort-change="tableSorting" :columns="table.columns" :data="table.data"></Table>
        </div>
        <div class="clearfix page-info">
            <div class="fl">已选0项,共{{table.total}}项</div>
            <myPage class="fr page" :page="search.pageNo" @on-change="changePage" :count="count"></myPage>
            <div class="fr">每页显示行:10行</div>
        </div>
        <!--dialog-->
        <div>

        </div>
    </div>
</template>

<script>
export default {
    name: 'user-class-statistics',
    data() {
        return {
            count: 0,
            periodConsumeSum: '',
            userTypeArr: [
                { value: '1', label: '个人' },
                { value: '2', label: '企业' },
                { value: '3', label: '全部用户类型' }
            ],
            search: {
                userType: '3',
                search: '',
                pageNo: 1,
                pageSize: 10
            },
            table: {
                total: 0,
                data: [],
                columns: [
                    {
                        title: '编号',
                        width: 80,
                        key: 'id',
                        align: 'center'
                    },
                    {
                        title: '企业/个人名称',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '认证类型',
                        key: 'type',
                        align: 'center',
                        render: (h, params) => {
                            let text= this.userTypeArr.find(item=>{
                               return item.value ==  params.row.type
                            }).label
                            return h('div', {}, text);
                        }
                    },
                    {
                        title: '剩余课时',
                        key: 'surplusPeriod',
                        align: 'center',
                        className: 'fontGreen',
                        render: (h, params) => {
                            let text = params.row.surplusPeriod;
                            text = this.timeFormat(text);
                            return h('div', {}, text);
                        }
                    },
                    {
                        title: '申请退款中的课时',
                        key: 'refundPeriod',
                        align: 'center',
                        className: 'fontGray ',
                        render: (h, params) => {
                            let text = params.row.refundPeriod;
                            text = this.timeFormat(text);
                            return h('div', {}, text);
                        }
                    },
                    {
                        title: '消耗课时',
                        key: 'consumePeriod',
                        maxWidth: 120,
                        align: 'center',
                        render: (h, params) => {
                            let text = params.row.consumePeriod;
                            text = this.timeFormat(text);
                            return h('div', {}, text);
                        }
                    },
                    {
                        title: '总课时',
                        key: 'sumPeriod',
                        maxWidth: 120,
                        align: 'center',
                        render: (h, params) => {
                            let text = params.row.sumPeriod;
                            text = this.timeFormat(text);
                            return h('div', {}, text);
                        }
                    },
                    {
                        title: '过期课时',
                        key: 'expiredPeriod',
                        align: 'center',
                        className: 'fontRed',
                        render: (h, params) => {
                            let text = params.row.expiredPeriod;
                            text = this.timeFormat(text);
                            return h('div', {}, text);
                        }
                    },
                ]
            }
        };
    },
    activated() {},
    mounted() {
        this.init();
    },
    filters: {
        timeFormat2(val) {
            let hour = Math.floor(val / 60);
            let min = val % 60;
            return val < 60 ? `${min}分钟` : `${hour}小时${min}分钟`;
        }
    },
    methods: {
        init() {
            this.getTableData();
        },
        getTableData() {
            this.$fetch({
                url: '/system-backend/periodStatisticsBack/authUserPeriodStatistics',
                data: this.search
            }).then((res) => {
                this.successCallBack(res,() => {
                    this.table.data = res.obj.pageInfo.list;
                    this.table.total = res.obj.pageInfo.total;
                    this.periodConsumeSum = res.obj.periodConsumeSum;
                    this.count = res.obj.pageInfo.pages;
                });
            });
        },
        searchTableData() {
            this.search.pageNo = 1;
            this.getTableData();
        },
        changePage(index) {
            this.search.pageNo = index;
            this.getTableData();
        },
        timeFormat(val) {
            if(isNaN(val)){
                val = 0
            }
            let hour = Math.floor(val / 60);
            let min = val % 60;
            return val < 60 ? `${min}分钟` : `${hour}小时${min}分钟`;
        },
        tableSorting({ column, key, order }) {
            this.search.orderRule = order;
            this.getTableData(0);
        }
    }
};
</script>

<style scoped lang="stylus">
    .search-box
        position: relative;
        margin-bottom:20px;

    .search
        width: 300px;
    .income
        position: absolute;
        left: 0;
        bottom: 0;
        padding: 8px;
        font-size: 14px;
        background-color: #f6f8fa
        color: #0c6bba
        .title
            position: absolute;
            right:-120px;
            cursor:pointer;
            top:50%;
            transform:translateY(-50%)
            color:#4ac4ad

</style>
<style lang="stylus">
</style>
