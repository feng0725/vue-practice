<template>
    <div class="configurationIndex two-page">
        <div class="btn-box">
            <Button type="primary" @click="goToAdd">新建企业</Button>
        </div>

        <div class="search-box clearfix">
            <Form class="fr" ref="formInline" :model="search"  inline>

                <FormItem>
                    <i-input class="search"  @on-search="searchTableData" v-model.trim="search.queryCode" search enter-button placeholder="输入企业名称"></i-input>
                </FormItem>
            </Form>
        </div>

        <div class="tableList">
            <Table  @on-sort-change="tableSorting" :columns="table.columns" :data="table.data"></Table>
        </div>
        <div class="clearfix page-info">
            <div class="fl">已选0项,共{{table.total}}项</div>
            <myPage class="fr page" :page="search.pageNo" @on-change="changePage" :count="count"></myPage>
            <div class="fr">每页显示行:10行</div>
        </div>
        <!--dialog-->
        <div>

            <MyDialog :title="'删除'" @ok="deleteEnterprise" :visible.sync="isDelete">
                <div style="text-align: center;font-weight: bold;height: 60px;line-height: 60px;">确定要删除该企业?</div>
            </MyDialog>
        </div>

    </div>

</template>

<script>
import { storage } from '../../../../common/js/qylh';

export default {
    name: 'index',
    components: {},
    data() {
        return {
            isDelete: false,
            count: 0,
            table: {
                total: 0,
                selected: {},
                columns: [
                    {
                        title: '编号',
                        width: 80,
                        key: 'enterpriseId',
                        align: 'center'
                    },

                    {
                        title: '企业名称',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '单位类型',
                        key: 'age',
                        align: 'center',
                        render: (h, params) => {
                            let text = '';
                            let t = params.row.type;

                            switch (t) {
                                case '1':
                                    text = '事业单位';
                                    break;
                                case '2':
                                    text = '国有企业';
                                    break;
                                case '3':
                                    text = '民营企业';
                                    break;
                                case '4':
                                    text = '外资企业';
                                    break;
                                case '5':
                                    text = '其它';
                                    break;
                            }

                            return h('div', {}, text);
                        }
                    },
                    {
                        title: '开课认证',
                        key: 'address',
                        className: 'fontBlue',
                        align: 'center',
                        render: (h, params) => {
                            let color = params.row.authEnterpriseVO.legalPersonName != '' ? '#f96e1a' : '#ddd';
                            return h('svg', {
                                class: {
                                    icon: true
                                },
                                style: {
                                    color: color
                                },
                                attrs: {
                                    ariaHidden: 'true'
                                },
                                domProps: {
                                    innerHTML: ' <use xlink:href="#icon-true"></use>'
                                }
                            });
                        }
                    },
                    {
                        title: '独立公众号',
                        key: 'address',
                        align: 'center',
                        className: 'fontBlue',
                        render: (h, params) => {
                            let color = params.row.appVO.appid != '' ? '#f96e1a' : '#ddd';
                            return h('svg', {
                                class: {
                                    icon: true
                                },
                                style: {
                                    color: color
                                },
                                attrs: {
                                    ariaHidden: 'true'
                                },
                                domProps: {
                                    innerHTML: ' <use xlink:href="#icon-true"></use>'
                                }
                            });
                        }
                    },

                    {
                        title: '创建时间',
                        key: 'createTimeStr',
                        sortable: 'custom',
                        align: 'center',
                        sortType: 'desc',
                        className: 'fontBlue'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            let text = params.row.isAlive ? '编辑' : '编辑';
                            let color = params.row.isAlive ? '#11ba9e' : '#11ba9e';
                            return h('div', [
                                h(
                                    'Button',
                                    {
                                        props: {
                                            type: 'text',
                                            size: 'small'
                                        },
                                        attrs: {
                                            // disabled: !params.row.isAlive
                                        },
                                        class: {
                                            fl: true,
                                            bar: params.row.isAlive
                                        },
                                        style: {
                                            width: '50px',
                                            marginRight: '5px',
                                            color: color,
                                            textAlign: 'center'
                                        },
                                        on: {
                                            click: () => {
                                                storage.set('enterpriseEdit', true);
                                                this.$router.push({
                                                    path: '/configuration/addEnterprise1',
                                                    query: {
                                                        id: params.row.enterpriseId
                                                    }
                                                });
                                            }
                                        }
                                    },
                                    text
                                ),
                                h(
                                    'Button',
                                    {
                                        class: {
                                            fr: true
                                        },
                                        props: {
                                            type: 'text',
                                            size: 'small',
                                            textAlign: 'center'
                                        },
                                        style: {
                                            marginRight: '5px',
                                            color: '#d41e3c'
                                        },
                                        on: {
                                            click: () => {
                                                this.table.selected = params.row;
                                                this.isDelete = true;
                                            }
                                        }
                                    },
                                    '删除'
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
                queryCode: '',
                sortType: '0'
            }
        };
    },

    activated() {
        this.getTableData();
    },
    mounted() {},
    methods: {
        searchTableData() {
            this.search.pageNo = 1;
            this.getTableData();
        },
        getTableData() {
            this.$fetch({
                url: '/system-backend/enterprise/select',
                data: this.search
            }).then((res) => {
                this.table.data = res.obj.list;
                this.table.total = res.obj.total;
                this.count = res.obj.pages;
            });
        },
        goToAdd() {
            storage.set('enterpriseEdit', false);
            this.$router.push({ path: '/configuration/addEnterprise1' });
        },
        changePage(index) {
            this.search.pageNo = index;
            this.getTableData();
        },
        deleteEnterprise() {
            this.$fetch({
                url: '/system-backend/enterprise/delEnterprise',
                data: {
                    enterprise_id: this.table.selected.enterpriseId
                }
            }).then((res) => {
                if (res.obj == -1) {
                    this.$Message.error(res.msg);
                } else if (res.obj == 0) {
                    this.$Message.error(res.msg);
                } else if (res.obj > 0) {
                    this.$Message.success(res.msg);
                    this.isDelete = false;
                    this.getTableData();
                }
            });
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
    .configurationIndex
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

    .ivu-table-body
        .number
            color: #0c6bba;

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

    .user-box
        width: 340px;
        height: 380px;
        border: 1px solid #e6e8ee;
        overflow: auto;
        .ivu-checkbox-group-item
            height: 50px;
            line-height: 50px;
            padding-left: 10px;
            display: block;
            border-bottom: 1px solid #f2f2f2;
            .ivu-checkbox
                margin-right: 20px;

    .dialog.add-user
        .ivu-modal-body
            background-color: transparent;

        .ivu-input-search
            border: 1px solid #d1d2d3 !important;
            padding: 0 4px !important;
            width: 25px;
            background-color: #fff !important;
            i
                color: #117dd6;
        .ivu-input
            background-color: #fff
</style>
