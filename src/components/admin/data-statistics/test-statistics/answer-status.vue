<template>
    <div class="answer-status edit-new">
        <header>
            <div  class="icon-box" @click="$router.back()" >
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-left"></use>
                </svg>
            </div>
            <div class="title">
                个人答题情况
            </div>
        </header>
        <div class="wrapper clearfix">
            <div class="table-box tableList">
                <Table :columns="table.columns" :data="table.data"></Table>

            </div>
            <div class="clearfix page-info absolute">
                <div class="fl">已选0项,共{{table.total}}项</div>
                <myPage class="fr page" :page="tableIndex" @on-change="changePage" :count="count"></myPage>
                <div class="fr">每页显示行:10行</div>
            </div>
        </div>
        <MyDialog  class-name="refuse" width="890" :title="'答题情况'" :visible.sync="isAnswer">
            <div style="">
                <ul class="list clearfix">
                    <li class="fl" v-for="(item,index) in arr">
                        <span class="number">{{index+1}}.</span>
                        <Icon size="20" color="#11ba9e" v-if="item == 0" type="md-checkmark" />
                        <Icon  size="20" color="#d41e3c"  v-if="item == 1" type="md-close" />
                    </li>
                </ul>
            </div>
            <div slot="footer">
                <Button @click="isAnswer= false">关闭</Button>
            </div>
        </MyDialog>
    </div>

</template>

<script>
export default {
    name: 'addAdmin',
    data() {
        return {
            arr: [],
            count: 0,
            tableIndex: 1,
            isAnswer: false,

            table: {
                total: 0,
                columns: [
                    {
                        title: '编号',
                        key: 'id',
                        align: 'center'
                    },
                    {
                        title: '姓名',
                        key: 'userName',
                        align: 'center'
                    },
                    {
                        title: '分数',
                        key: 'studentScore',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        // width: 100,
                        align: 'center',
                        render: (h, params) => {
                            let color = '#11ba9e';
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
                                                // this.isRefund = true;
                                                this.selectUserExamDetils(params.row);
                                                // this.show(params.index);
                                            }
                                        }
                                    },
                                    '答题情况'
                                )
                            ]);
                        }
                    }
                ],
                data: []
            }
        };
    },
    mounted() {
        for (let i = 0; i < 50; i++) {
            let flag = Math.random() > 0.5;

            this.arr.push({
                checked: flag
            });
        }

        this.getTableData();
    },
    methods: {
        getTableData() {
            this.$fetch({
                url: '/system-backend/examStatisticBack/selectExamUserList',
                data: {
                    examPaperId: this.$route.query.id,
                    pageNum: this.tableIndex,
                    pageSize: 10
                }
            }).then((res) => {
                this.table.data = res.obj.list;
                this.table.total = res.obj.total;
                this.count = res.obj.pages;
            });
        },
        changePage(index) {
            this.tableIndex = index;
            this.getTableData();
        },
        selectUserExamDetils(item) {
            this.$fetch({
                url: '/system-backend/examStatisticBack/selectUserExamDetils',
                data: {
                    examPaperId: item.examPaperId,
                    userId: item.userId
                }
            }).then((res) => {
                this.isAnswer = true;
                this.arr = res.obj;
            });
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


        .btn-box
            width: 100%;
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #e6e8ee;
            .btn
                width: 115px;
                margin-right: 30px;

    .page-info
        left:20px;
        right:20px;

    .dialog
        .list
            margin:0 16px;
            min-height: 250px;
            li
                margin-right:25px;
                .number
                    display: inline-block
                    width:20px;
                    margin-right:9px;

</style>
<style lang="stylus">
    /*.answer-status*/
</style>
