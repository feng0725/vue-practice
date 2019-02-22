<template>
    <div class="test-statistics two-page">
        <router-link class="btn-box" to="/order-management/class/add-class" tag="div">
        </router-link>
        <div class="search-box clearfix">
            <Form class="fr" ref="formInline" :model="search"  inline>
                <FormItem prop="user" v-if="$store.getters.isAdmins">
                    <Select v-model="search.enterpriseId" style="width:190px" placeholder="按企业筛选">
                        <Option v-for="item in enterpriseLis" :value="item.enterpriseId" :key="item.enterpriseId">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <i-input class="search" @on-search="searchData" v-model.trim="search.select" search enter-button placeholder="输入考试/课程名称"></i-input>
                </FormItem>
            </Form>
        </div>
        <div class="tableList">
            <Table  @on-sort-change="tableSorting" :columns="table.columns" :data="table.data"></Table>
        </div>
        <div class="clearfix page-info">
            <div class="fl">已选0项,共{{table.total}}项</div>
            <myPage class="fr page" :page="search.pageNum " @on-change="changePage" :count="count"></myPage>
            <div class="fr">每页显示行:10行</div>
        </div>
        <!--dialog-->
        <div>
        </div>
    </div>

</template>

<script>
export default {
    name: 'test-statistics',
    data() {
        return {
            tableIndex: 1,
            enterpriseLis: [],
            count: 0,
            table: {
                total: 0,
                columns: [
                    {
                        title: '编号',
                        key: 'examPaperId',
                        width: 80,
                        align: 'center'
                    },

                    {
                        title: '考试名称',
                        key: 'examPaperName',
                        align: 'center'
                    },
                    {
                        title: '所属课程',
                        key: 'courseName',
                        align: 'center'
                    },
                    {
                        title: '所属企业/个人',
                        key: 'enterpriseName',
                        align: 'center'
                    },
                    {
                        title: '优秀人数/比率',
                        key: 'address',
                        maxWidth: 120,
                        align: 'center',
                        render: (h, params) => {

                            let color = params.row.isAlive ? '#11ba9e' : '#11ba9e';
                            return h('div', [
                                h(
                                    'span',
                                    {
                                        style: {
                                            color: color,
                                            textAlign: 'center'
                                        },
                                        on: {
                                            click: () => {
                                            }
                                        }
                                    },
                                    params.row.examStatisticMap.goodNum
                                ),
                                '人,占比',
                                h(
                                    'span',
                                    {
                                        style: {
                                            color: color,
                                            textAlign: 'center'
                                        },
                                        on: {
                                            click: () => {
                                            }
                                        }
                                    },
                                    params.row.examStatisticMap.goodPercent
                                )
                            ]);
                        }
                    },
                    {
                        title: '及格人数/比率',
                        key: 'address',
                        maxWidth: 120,
                        align: 'center',
                        render: (h, params) => {

                            let color = params.row.isAlive ? '#11ba9e' : '#11ba9e';
                            return h('div', [
                                h(
                                    'span',
                                    {
                                        style: {
                                            color: color,
                                            textAlign: 'center'
                                        },
                                        on: {
                                            click: () => {
                                            }
                                        }
                                    },
                                    params.row.examStatisticMap.passNum
                                ),
                                '人,占比',
                                h(
                                    'span',
                                    {
                                        style: {
                                            color: color,
                                            textAlign: 'center'
                                        },
                                        on: {
                                            click: () => {
                                            }
                                        }
                                    },
                                    params.row.examStatisticMap.passPercent
                                )
                            ]);
                        }
                    },
                    {
                        title: '考试时间',
                        key: 'validityTime',
                        maxWidth: 180,
                        sortable: 'custom',
                        align: 'center',
                        sortType: 'desc',
                        className: 'fontBlue'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 200,
                        align: 'center',
                        render: (h, params) => {

                            let text = params.row.isAlive ? '编辑' : '已离职 ';
                            let color = params.row.isAlive ? '#11ba9e' : '#11ba9e';
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
                                            // width: '50px',
                                            marginRight: '5px',
                                            color: color,
                                            textAlign: 'center'
                                        },
                                        on: {
                                            click: () => {
                                                this.$router.push({
                                                    path:
                                                        '/data-statistics/test-statistics/examination-overview/' +
                                                        params.row.examPaperId
                                                });
                                                // this.show(params.index);
                                            }
                                        }
                                    },
                                    '考试概况'
                                ),
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
                                            // width: '50px',
                                            marginRight: '5px',
                                            color: color,
                                            textAlign: 'center'
                                        },
                                        on: {
                                            click: () => {
                                                this.$router.push({
                                                    path: '/data-statistics/test-statistics/answer-status',
                                                    query: {
                                                        id: params.row.examPaperId
                                                    }
                                                });
                                                // this.show(params.index);
                                            }
                                        }
                                    },
                                    '个人答题情况'
                                )
                            ]);
                        }
                    }
                ],
                data: []
            },
            search: {
                userId: this.$store.state.userInfo.userId,
                enterpriseId:this.$tools.defaultAll,
                select: '',
                pageNum: 1,
                oderyBy: 0,
                pageSize: 10
            }
        };
    },
    activated() {
        this.init();
    },
    mounted() {},
    methods: {
        init() {
            if (this.$store.getters.isAdmins) {
                this.getEnterpriseList();
            } else {
                this.search.enterpriseId = this.$store.state.userInfo.enterpriseId;
            }
            this.getTableData();

            this.filterTableColumns('所属企业/个人');
        },
        getEnterpriseList() {
            this.$fetch({
                url: '/system-backend/courseBack/getEnterpriseList',
                data: {
                    userId: this.$store.state.userInfo.userId
                }
            }).then((res) => {
                this.enterpriseLis = res.obj;
                this.enterpriseLis.unshift(this.ALLSelect.enterprise1);
            });
        },
        getTableData() {
            this.$fetch({
                url: '/system-backend/examStatisticBack/selectExamStatisticList',
                data: this.search
            }).then((res) => {

                this.table.data = res.obj.list;
                this.table.total = res.obj.total;
                this.count = res.obj.pages;

            });
        },
        searchData() {
            this.search.pageNum = 1;
            this.getTableData();
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
    .search-box
        position: relative;

    .search
        width: 300px;



</style>
<style lang="stylus">
    .test-statistics
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

</style>
