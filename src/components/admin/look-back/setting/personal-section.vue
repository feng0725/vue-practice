<template>
    <div class="personal-settings edit-new">
        <header>
            <div  class="icon-box" @click="$router.back()" >
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-left"></use>
                </svg>
            </div>
            <div class="title">
                个人回看设置
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
        <MyDialog :title="'回看设置'" width="480" @ok="individualCourseSetting" :visible.sync="isGlobal ">
            <div class="refund">
                <Form :model="course" ref="courseRules" :rules="courseRules" label-position="left" :label-width="140">
                    <FormItem style="text-align: left;" label="回看开始时间(必填)" prop="startValidity">
                        <span style="margin-right: 10px;">课程结束后</span>
                        <Input style="width:125px;" placeholder="" v-model="course.startValidity"></Input>
                        天
                    </FormItem>
                    <FormItem style="text-align: left;" label="回看结束时间" prop="validityPeriod">
                        <Input style="width:200px;"  placeholder="非必填,默认无时间限制" v-model="course.validityPeriod"></Input>
                        天
                    </FormItem>

                </Form>
            </div>
        </MyDialog>

    </div>

</template>

<script>
export default {
    name: 'addAdmin',
    data() {
        return {
            isGlobal: false,
            count: 0,
            table: {
                total:0,
                data: [],
                columns: [
                    {
                        title: '手机号',
                        key: 'account',
                        align: 'center'
                    },
                    {
                        title: '姓名',
                        key: 'nickname',
                        align: 'center'
                    },
                    {
                        title: '回看时间',
                        key: 'time',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        render: (h, params) => {

                            let color = params.row.isAlive
                                ? '#11ba9e'
                                : '#11ba9e';
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
                                                this.$refs.courseRules.resetFields()
                                                this.table.selected =
                                                    params.row;
                                                this.isGlobal = true;
                                                this.$fetch({
                                                    url: '/system-backend/lookBack/settingInfo',
                                                    data: {
                                                        courseId: this.search.courseId,
                                                        sectionId: this.search.sectionId,
                                                        userId: params.row.userId,
                                                        type: 4
                                                    }
                                                }).then((res) => {
                                                    this.course.startValidity = res.obj.startValidity;
                                                    this.course.validityPeriod =
                                                        res.obj.validPeriod == '-1' ? '' : res.obj.validPeriod;
                                                });
                                            }
                                        }
                                    },
                                    '回看时间设置'
                                )
                            ]);
                        }
                    }
                ]
            },
            search: {
                courseId: this.$route.params.id,
                sectionId: this.$route.query.section,
                pageNum: 1,
                pageSize: 10
            },
            course: {
                userId: '',
                sectionId: this.$route.query.section,
                startValidity: '',
                validityPeriod: ''
            },
            courseRules: {
                startValidity: { required: true, message: '请输入回看开始时间' }
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
                url: '/system-backend/lookBack/individualSectionListInfo',
                data: this.search
            }).then((res) => {
                this.table.data = res.obj.list;
                this.table.total = res.obj.total;
                this.count = res.obj.pages;
            });
        },
        individualCourseSetting() {
            this.$refs.courseRules.validate((valid) => {

                if (valid) {

                    let params = this.$tools.cloneObj(this.course);
                    if (params.validityPeriod == ''  || params.validityPeriod==null) {
                        params.validityPeriod = -1;
                    }
                    console.log(this.course)
                    params.userId = this.table.selected.userId;
                    this.$fetch({
                        url: '/system-backend/lookBack/individualSectionSetting',
                        data: params
                    }).then((res) => {

                        if (res.code == 200) {
                            this.$Message.success(res.msg);
                            this.isGlobal = false;
                            this.$refs.courseRules.resetFields()
                            this.getTableData()
                        } else {
                            this.$Message.error(res.msg);
                        }
                    });
                }
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
            left;
            0;
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
        left:20px;
        right:20px;
</style>
<style lang="stylus">
    .personal-settings
        .tree
            > ul
                padding: 5px 0;
                padding-left: 15px;
                border-bottom: 1px solid #e7e9ee;
</style>
