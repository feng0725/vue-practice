<template>
    <div class="look-back two-page">
        <div class="btn-box">
            <Button type="primary" @click="next">发送通知</Button>
        </div>

        <div class="search-box clearfix">
            <Form class="fr" ref="search" :model="search" :rules="ruleInline" inline>
                <FormItem v-if="$store.getters.isAdmins" prop="user">
                    <Select v-model="search.enterpriseId  " style="width:190px" placeholder="按企业筛选">
                        <Option v-for="item in enterpriseList" :value="item.enterpriseId" :key="item.enterpriseId">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem prop="user">
                    <Select v-model="search.noticeType  " style="width:190px" placeholder="通知类型">
                        <Option v-for="item in noticeTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <i-input class="search" v-model.trim="search.search" @on-search="searchTableData" search enter-button placeholder="输入通知标题	"></i-input>
                </FormItem>
            </Form>

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

           <MyDialog :title="'通知详情'" width="920" class-name="details" :visible.sync="isDetails ">
                <div class="left" >
                    <h4 class="center">{{details.title}}</h4>
                    <div>
                        <div><span style="margin-left: 255px;color:#b1b2b3">发送范围:</span>
                            {{details.pushRangeStrArr[0]}}
                        </div>
                        <div style="margin-left: 305px;">   {{details.pushRangeStrArr[1]}}</div>
                    </div>

                    <div style="max-height:300px;overflow: auto;" class="img-box" v-html="details.content"></div>
                    <div v-for="(item) in details.yunfileList">
                        <span><Icon color="#1aa195" size="20" style="transform:rotate(45deg)" type="md-attach" />附件</span>
                        <a target="_blank" :href="item.downloadUrl" class="text">{{item.originalName}}</a>
                        <span>{{item.fileSize}}K</span>
                    </div>
                </div>
                <div slot="footer">
                    <Button @click="isDetails = false;">关闭</Button>
                </div>
            </MyDialog>


        </div>
    </div>

</template>

<script>
import { storage } from '../../../../../common/js/qylh';

export default {
    name: 'look-back',
    data() {
        return {
            isDetails: false,
            isGlobal: false,
            isCurriculum: false,
            isSection: false,
            isAddUserType: false,
            enterpriseList: [],
            noticeTypeList: [
                { value: this.$tools.defaultAll, label: '全部通知类型' },
                { value: '1', label: '用户通知' },
                { value: '2', label: '认证用户通知' },
                { value: '3', label: '课程通知' }
            ],
            userTypeList: [
                { value: '0', label: '超管' },
                { value: '1', label: '友看管理员' },
                { value: '2', label: '企业管理员' },
                { value: '3', label: '认证个人用户' }
            ],
            count: 0,
            table: {
                total: 0,
                data: [],
                columns: [
                    {
                        title: '编号',
                        key: 'noticeId',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '通知标题',
                        key: 'title',
                        align: 'center'
                    },
                    {
                        title: '通知类型',
                        key: 'noticeType',
                        maxWidth: 120,
                        align: 'center',
                        render: (h, params) => {
                            let text = this.noticeTypeList.find((item) => {
                                return item.value == params.row.noticeType;
                            });

                            return h('div', {}, text.label);
                        }
                    },
                    {
                        title: '所属企业/个人',
                        key: 'enterpriseName',
                        align: 'center'
                    },
                    {
                        title: '已读/发送人数',
                        key: 'address',
                        maxWidth: 120,
                        align: 'center',
                        render: (h, params) => {
                            let color = params.row.isAlive ? '#4ac4ad' : '#4ac4ad';
                            return h('div', [
                                h(
                                    'span',
                                    {
                                        style: {
                                            marginRight: '5px',
                                            color: color,
                                            textAlign: 'center'
                                        },
                                        on: {
                                            click: () => {}
                                        }
                                    },
                                    params.row.readSum || 0
                                ),
                                '/',
                                params.row.sum || 0
                            ]);
                        }
                    },
                    {
                        title: '操作人',
                        key: 'nickname',
                        maxWidth: 120,
                        align: 'center'
                        // render: (h, params) => {
                        //     let text = this.userTypeList.find((item) => {
                        //         return item.value == params.row.userType;
                        //     });
                        //
                        //     return h('div', {}, text.label);
                        // }
                    },
                    {
                        title: '发送时间',
                        key: 'checkTime',
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
                                        style: {
                                            // width: '50px',
                                            marginRight: '5px',
                                            color: color,
                                            textAlign: 'center'
                                        },
                                        on: {
                                            click: () => {
                                                this.getNoticeInfo(params.row);
                                            }
                                        }
                                    },
                                    '详情'
                                )
                            ]);
                        }
                    }
                ]
            },
            formLeft: {},
            ruleInline: {
                user: {
                    required: true,
                    message: 'Please fill in the user name',
                    trigger: 'blur'
                }
            },
            search: {
                adminType:this.$store.state.adminType,
                adminId: this.$store.state.userInfo.userId,
                enterpriseId: this.$tools.defaultAll,
                noticeType: this.$tools.defaultAll,
                status: 2,
                search: null,
                orderRule: 4,
                pageNo: 1,
                pageSize: 10
            },
            details: {
                noticeId: 1,
                pushRangeStrArr: [],
                title: '测试1',
                contentId: 1,
                content: '我的家在东北松花江上那里有漫山遍野大豆高粱',
                pushRangeStr: '公众号：测试号2、测试号1/n三星-一组/二组/未分组用户,四星-四组/五组',
                yunfileIdStr: '0#23#24',
                yunfileList: [
                    {
                        yunfileId: 0,
                        downloadUrl: '1111_20180903170015611.pdf',
                        yunfileName: '_20180903170015611.pdf',
                        fileSize: 1,
                        createTime: '2018-09-18 11:23:39',
                        originalName: '1111.pdf'
                    },
                    {
                        yunfileId: 24,
                        downloadUrl: 'http://uimage-10000013.image.myqcloud.com/2fe25ec7-656e-4326-a713-35b6caf8b87d',
                        yunfileName: 'switch_20180918112429364.png',
                        fileSize: 0,
                        createTime: '2018-09-18 11:24:32',
                        originalName: 'switch.png'
                    }
                ]
            }
        };
    },
    activated() {
        this.init();
    },
    mounted() {},
    methods: {
        init() {
            this.getEnterpriseList();
            this.getTableData();
        },
        searchTableData() {
            this.search.pageNo = 1;
            this.getTableData();
        },
        getTableData() {
            this.$fetch({
                url: '/system-backend/noticeBack/selectNoticeList',
                data: this.search
            }).then((res) => {
                if (res.code == 200) {
                    this.table.data = res.obj.list;
                    this.table.total = res.obj.total;
                    this.count = res.obj.pages;
                }
            });
        },
        getEnterpriseList() {
            this.$fetch({
                url: '/system-backend/userBack/selectEnterpriseList',
            }).then((res) => {
                if (res.code == 200) {
                    this.enterpriseList = res.obj;
                    this.enterpriseList.unshift(this.ALLSelect.enterprise1);
                }
            });
        },
        next() {
            storage.remove('insertNotice');
            this.$router.push({
                path: '/care-management/notification/admin/notification'
            });
        },
        getNoticeInfo(row) {
            this.$fetch({
                url: '/system-backend/noticeBack/selectNoticeInfo',
                data: {
                    noticeId: row.noticeId
                }
            }).then((res) => {
                this.isDetails = true;
                this.details = res.obj;
                this.details.pushRangeStrArr = this.details.pushRangeStr.split('/n');
            });
        },
        goPersonal() {
            this.$router.push({ path: '/look-back/personal-settings' });
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
            this.search.orderRule = order == 'desc' ? '4' : '3';
            this.getTableData();
        }
    }
};
</script>

<style scoped lang="stylus">
    .search-box
        /*margin-bottom:15px;*/
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

    .title-header
        display: flex;
        justify-content: space-around;
        align-items: center;
        height: 40px;
        margin-bottom: 15px;
        background-color: #f6f8fa;
        .btn
            color: rgb(17, 186, 158)


</style>
<style lang="stylus">
    .look-back
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

    .dialog.details
        .ivu-modal-body
            background-color: #fff
        .left
            > div, h4
                margin: 5px 0;
                padding:5px 25px;
                background-color: #f2f3f5
            .text
                text-decoration: underline;
                margin:0 20px;
</style>
