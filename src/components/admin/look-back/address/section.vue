<template>
    <div class="personal-settings edit-new">
        <header>
            <div class="icon-box" @click="$router.back()">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-left"></use>
                </svg>
            </div>
            <div class="title">
                回看地址
            </div>
        </header>
        <div class="wrapper clearfix">
            <div class="table-box tableList">
                <Table :columns="table.columns" :data="table.data"></Table>

            </div>
            <div class="clearfix page-info absolute">
                <div class="fl">已选0项,共{{table.total}}项</div>
                <myPage class="fr page" @on-change="changePage" :count="count"></myPage>
                <div class="fr">每页显示行:10行</div>
            </div>
        </div>
        <input ref="copyInput" v-show="isCopy" type="value" v-model="text">
        <MyDialog class-name="back-url" :title="'小节回看地址'" width="800" :visible.sync="isBackUrl">
            <div>
                <div class="btn-box">
                    <Button type="primary" @click="isAddUrl =true">添加地址</Button>
                    <Button type="primary" @click="copy">复制地址</Button>
                </div>

                <div class="table-box tableList ">
                    <Table :columns="table2.columns" :data="table2.data"></Table>
                </div>
            </div>

            <div slot="footer" style="height:0;padding:0;margin:0"></div>
        </MyDialog>
        <MyDialog class-name="back-url" @ok="addBackUrl" :title="'添加回看地址'" :visible.sync="isAddUrl">
            <div>
                <Input v-model="lookBackUrl" placeholder="请输入回看地址"/>

            </div>

        </MyDialog>
        <MyDialog @ok="deleteBackUrl" :title="'删除回看地址'" :visible.sync="isDelete">
            <div>
                确定删除该条地址？
            </div>

        </MyDialog>

    </div>

</template>

<script>
export default {
    name: 'addAdmin',
    data() {
        return {
            text: '',
            isCopy: false,
            isDelete: false,
            lookBackUrl: '',
            isBackUrl: false,
            isAddUrl: false,
            count: 0,
            table: {
                selected: null,
                total: 0,
                data: [],
                columns: [
                    {
                        title: '小节编号',
                        key: 'sectionId',
                        maxWidth: 120,
                        align: 'center'
                    },
                    {
                        title: '小节名称',
                        key: 'sectionName',
                        align: 'center'
                    },
                    {
                        title: '上课时间',
                        key: 'startTime',
                        align: 'center'
                    },
                    {
                        title: '下课时间',
                        key: 'endTime',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        maxWidth: 180,
                        align: 'center',
                        render: (h, params) => {
                            let color = params.row.isAlive ? '#11ba9e' : '#11ba9e';
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
                                                this.isBackUrl = true;
                                                this.table.selected = params.row;
                                                this.getBackUrlTableData(params.row.sectionId);
                                            }
                                        }
                                    },
                                    '回看地址'
                                )
                            ]);
                        }
                    }
                ]
            },
            table2: {
                selected: null,
                total: 0,
                data: [],
                columns: [
                    {
                        title: '序号',
                        key: 'num',
                        maxWidth: 120,
                        align: 'center'
                    },
                    {
                        title: '地址',
                        key: 'url',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        maxWidth: 200,
                        align: 'center',
                        render: (h, params) => {
                            let color = params.row.isAlive ? '#11ba9e' : '#11ba9e';
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
                                            width: '50px',
                                            color: color,
                                            textAlign: 'center'
                                        },
                                        on: {
                                            click: () => {
                                                window.open(params.row.url);
                                            }
                                        }
                                    },
                                    '预览'
                                ),
                                h(
                                    'Button',
                                    {
                                        props: {
                                            type: 'text',
                                            size: 'small'
                                        },
                                        style: {
                                            marginRight: '5px',
                                            width: '50px',
                                            color: color,
                                            textAlign: 'center'
                                        },
                                        on: {
                                            click: () => {
                                                this.table2.selected = params.row;
                                                this.isDelete = true;
                                            }
                                        }
                                    },
                                    '删除'
                                )
                            ]);
                        }
                    }
                ]
            },
            search: {
                courseId: this.$route.params.id,
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
        getTableData() {
            this.$fetch({
                url: '/system-backend/lookBack/sectionListInfo',
                data: this.search
            }).then((res) => {
                this.table.data = res.obj.list;
                this.table.total = res.obj.total;
                this.count = res.obj.pages;
            });
        },
        getBackUrlTableData() {
            this.$fetch({
                url: '/system-backend/lookBack/selectLookBackUrl',
                data: {
                    sectionId: this.table.selected.sectionId
                }
            }).then((res) => {
                if (res.obj) {
                    this.text = res.obj;
                    this.table2.data = res.obj.split('#').map((item, index) => {
                        return { num: index + 1, url: item };
                    });
                } else {
                    this.table2.data = [];
                }
            });
        },
        copy() {
            const input = document.createElement('textArea');
            let str = this.text.replace(/#/g, '\n');
            input.value = str;
            document.body.appendChild(input);
            input.setAttribute('opacity', 0);
            input.select();
            let flag = document.execCommand('copy');
            if (flag) {
                this.$Message.success('复制成功');
            }
            document.body.removeChild(input);
        },
        addBackUrl() {
            if (!this.lookBackUrl) {
                this.$Message.error('请填写回看地址');
                return false;
            }
            this.$fetch({
                url: '/system-backend/lookBack/updateLookBackUrl',
                data: {
                    sectionId: this.table.selected.sectionId,
                    lookBackUrl: this.lookBackUrl,
                    type: 'add'
                }
            }).then((res) => {
                this.successCallBack(res, () => {
                    this.isAddUrl = false;
                    this.getBackUrlTableData();
                    this.lookBackUrl = '';
                    this.$Message.success('添加成功');
                });
            });
        },
        deleteBackUrl() {
            let url = this.table2.data
                .filter((item) => {
                    return item.num != this.table2.selected.num;
                })
                .map((item) => item.url)
                .join('#');
            this.$fetch({
                url: '/system-backend/lookBack/updateLookBackUrl',
                data: {
                    sectionId: this.table.selected.sectionId,
                    lookBackUrl: url,
                    type: 'update'
                }
            }).then((res) => {
                this.successCallBack(res, () => {
                    this.isDelete = false;
                    this.getBackUrlTableData();
                    this.$Message.success('删除成功');
                });
            });
        },
        changePage(index) {
            this.search.pageNum = index;
            this.getTableData();
        }
    }
};
</script>

<style scoped lang="stylus">
    header
        margin-bottom: 12px;

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
        min-height:450px;
        padding: 20px;
        padding-bottom: 80px;
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
            padding: 8px 0;
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
                margin-right: 30px;

    .page-info
        left: 20px;
        right: 20px;

    .back-url
        .btn-box
            text-align: left;
            margin-bottom: 20px;
</style>
<style lang="stylus">
    .dialog.back-url
        .ivu-input
            background-color: #fff

        .ivu-modal-body
            background-color: #fff

        .ivu-btn:first-child
            border-color: #2d8cf0;

        .ivu-table-header
            border: 1px solid #ccc;
            border-left: 0;
            border-right: 0;

        .tableList
            .ivu-btn:first-child
                border: 0;
</style>
