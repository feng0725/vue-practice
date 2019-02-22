<template>
    <div class="review2 edit-new">
        <header>
            <router-link class="icon-box" tag="div" to="/care-management/notification/enterprise">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-left"></use>
                </svg>
            </router-link>
            <div class="title">
                {{status}}通知
            </div>
        </header>
        <div class="wrapper clearfix">
            <div class="title">
                <Steps size="small" :current="1">
                    <Step title="填写通知内容" content=""></Step>
                    <Step title="发送范围" content=""></Step>
                </Steps>

            </div>
            <div class="clearfix">
                <div class="left fl">
                    <div style="margin-top:20px;margin-bottom:30px;">
                        <Button class="btn-user " v-if="$store.getters.isEnterprise" @click="changeType(1)"
                                :class="{active:btnIndex==1}">用户通知
                        </Button>
                        <Button class="btn-user" @click="changeType(3)" :class="{active:btnIndex==3}">课程通知</Button>
                    </div>
                    <div v-show="btnIndex==1">
                        <Form class="from" ref="userNotification" :model="userNotification"
                              :rules="userNotificationRules"
                              :label-width="180"
                              label-position="left">
                            <FormItem label="用户类型(必选)" prop="userType">
                                <Select @on-change="changeUserType" v-model="userNotification.userType"
                                        style="width:200px" placeholder="企业用户">
                                    <Option v-for="item in userType" :value="item.value" :key="item.value">{{
                                        item.label}}
                                    </Option>
                                </Select>
                            </FormItem>
                            <FormItem v-if="userNotification.userType == 2" label="选择分组(必选)" prop="groupId">
                                <Button class="white-blue" @click="isGroup = true" type="primary">选择分组</Button>
                                {{groupStr}}
                            </FormItem>
                        </Form>
                    </div>
                    <div v-show="btnIndex==3">

                        <Form class="from" ref="courseNotice" :model="courseNotice" :rules="courseNoticeRules"
                              :label-width="180"
                              label-position="left">
                            <FormItem label="购买类型(必选)" prop="isBuy">
                                <RadioGroup @on-change="changeIsBuy" v-model="courseNotice.isBuy">
                                    <Radio v-if="$store.getters.isEnterprise" label="0">未购买课程用户</Radio>
                                    <Radio label="1">已购买课程用户</Radio>
                                </RadioGroup>
                            </FormItem>
                            <FormItem label="选择课程(必选)" prop="courseId">
                                <Button class="white-blue" @click="isClass=true" type="primary">选择课程</Button>
                                <span>{{selectedClassList.map(item=>item.courseName).join(' / ')}}</span>
                            </FormItem>
                            <template v-if="courseNotice.isBuy ==0">
                                <FormItem label="用户类型(必选)" prop="userType">
                                    <Select @on-change="changeUserType" v-model="courseNotice.userType"
                                            style="width:200px" placeholder="企业用户">
                                        <Option v-for="item in userType" :value="item.value" :key="item.value">{{
                                            item.label}}
                                        </Option>
                                    </Select>
                                </FormItem>
                                <FormItem v-if="courseNotice.userType == 2" label="选择分组(必选)" prop="groupId">
                                    <Button class="white-blue" @click="isGroup=true" type="primary">选择分组</Button>
                                    {{groupStr}}
                                </FormItem>
                            </template>

                        </Form>
                    </div>
                </div>
            </div>
            <div class="btn-box fl">
                <Button class="btn fr" type="primary" @click="next($event)">发送</Button>
                <Button class="btn fr" type="primary" @click="$router.back()">上一步</Button>
            </div>
        </div>

        <MyDialog width="380" class-name="select-list" @ok="updateGroup" :title="'选择分组'" :visible.sync="isGroup">
            <div style="text-align: left">
                <p>分组列表</p>
                <groupList :list="groupList" :selectList.sync="selectedGroupList"></groupList>
            </div>
        </MyDialog>
        <MyDialog width="380" class-name="select-list" @ok="updateCourseId" :title="'选择课程'" :visible.sync="isClass">
            <div style="text-align: left">
                <Input class="search-input" v-model="table.search" @on-search="getCourseList" search enter-button
                       placeholder="输入课程名称"/>
                <p style="margin-top:20px;margin-bottom:10px;">课程列表 <span class="fr">共{{table.data.length}}项,选{{classList.length}}项</span>
                </p>
                <Table height="350" @on-selection-change="changeClass" ref="selection" :columns="table.columns"
                       :data="table.data"></Table>
            </div>
        </MyDialog>

    </div>
</template>

<script>
import classList from '../../component/class-list';
import groupList from '../../component/group-list';
import _ from 'underscore';
import { storage } from '../../../../../common/js/qylh';

export default {
    name: 'review2',
    components: {
        classList: classList,
        groupList: groupList
    },
    data() {
        let insertNotice = storage.get('insertNotice') || {};

        return {
            indexArr: ['', 'userNotification', '', 'courseNotice'],
            status: '新建',
            insertNotice: insertNotice,
            classList: [],
            selectedClassList: [],
            isPerson: false,
            isClass: false,
            isList: false,
            isGroup: false,
            table: {
                search: '',
                columns: [
                    {
                        type: 'selection',
                        // width: 60,
                        align: 'center'
                    },
                    {
                        title: '课程名称',
                        key: 'courseName',
                        align: 'center'
                    },
                    {
                        title: '所属公司',
                        key: 'enterpriseName',
                        align: 'center'
                    }
                ],
                data: []
            },
            treeData: [],
            btnIndex: insertNotice.noticeType || '1',
            selectAuthEnterpriseList: [],
            selectAuthIndividualList: [],
            authIndividualList: [],
            userType: [
                { value: '1', label: '全部' },
                { value: '2', label: '企业用户' },
                { value: '3', label: '非企业用户' }
            ],
            certifiedUserType: [
                { value: '1', label: '全部' },
                { value: '4', label: '企业' },
                { value: '5', label: '个人' }
            ],
            userNotification: {
                userType: insertNotice.userType || '',
                appid: this.$store.state.userInfo.appid,
                groupId: null
            },
            userNotificationRules: {
                userType: { required: true, message: '请选择用户类型' },
                groupId: { required: true, message: '请选择分组' }
            },

            courseNotice: {
                isBuy: '1',
                courseId: null,
                appid: null,
                userType: insertNotice.userType || '',
                groupId: null
            },
            courseNoticeRules: {
                isBuy: { required: true, message: '请选择用户类型' },
                courseId: { required: true, message: '请选择课程' },
                userType: { required: true, message: '请选择用户类型' },
                groupId: { required: true, message: '请选择分组' }
            },
            enterpriseList: [],
            enterpriseGroupStr: '',
            selectedEnterpriseGroupList: [],
            enterpriseGroup: {},
            selectedGroupList: [],
            determineGroupList: [],
            groupList: [],
            groupStr: ''
        };
    },
    mounted() {
        this.init();
        if (!this.$store.getters.isEnterprise) {
            this.btnIndex = 3;
        }
    },
    methods: {
        init() {
            this.getUserTyep();
            this.getCourseList();
            this.getGroupList();
            if (this.$route.query.id) {
                this.status = '编辑';
                this.courseNotice.isBuy = this.insertNotice.isBuy;
            }
        },
        getUserTyep() {
            this.$fetch({
                url: '/system-backend/noticeBack/selectAppListByEnterpriseId',
                data: {
                    enterpriseId: this.$store.state.userInfo.enterpriseId
                }
            }).then((res) => {
                if (res.code == 200) {
                    if (res.obj.length == 0) {
                        this.userType = [{ value: '2', label: '企业用户' }];
                        this.insertNotice.enterpriseId = '-2#' + this.$store.state.userInfo.enterpriseId;
                    }
                } else {
                    this.$Message.error(res.msg);
                }
            });
        },

        // 获取企业用户组
        getGroupList() {
            this.$fetch({
                url: '/system-backend/groupBack/selectGroup',
                data: {
                    enterpriseId: this.$store.state.userInfo.enterpriseId
                }
            }).then((res) => {
                this.groupList = res.obj;
                this.groupList.push({ groupId: '-1', name: '未分组用户' });
                this.setGrouList();
            });
        },
        setGrouList() {
            if (this.$route.query.id) {
                let arr = this.insertNotice.groupId.split(',');
                arr.shift();
                this.selectedGroupList = this.groupList.filter((item) => {
                    return _.find(arr, (id) => id == item.groupId);
                });
                this.updateGroup();
            }
        },
        updateGroup() {
            this.userNotification.groupId = '';
            this.courseNotice.groupId = '';
            this.insertNotice.groupId = ''
            this.groupStr = ''
            if (this.selectedGroupList.length == 0) {
                this.isGroup = false;
                return;
            }
            this.groupStr = '';
            this.determineGroupList = this.$tools.cloneObj(this.selectedGroupList);
            let groupId = '';
            if (this.determineGroupList.length == this.groupList.length) {
                groupId += '-1,';
            } else {
                groupId += '-2,';
            }
            groupId += this.determineGroupList.map((item) => item.groupId).join(',');
            this.groupStr = this.determineGroupList.map((item) => item.name).join(' , ');
            this.isGroup = false;
            this.insertNotice.groupId = groupId;
            this.userNotification.groupId = groupId;
            this.courseNotice.groupId = groupId;

            this.$refs[this.indexArr[this.btnIndex]].validateField('groupId');
        },
        // 获取课程列表
        getCourseList() {
            let params = null;
            let url = '';
            if (this.$store.getters.isUser) {
                url = '/system-backend/noticeBack/selectCourseListByUserId';
                params = {
                    userId: this.$store.state.userInfo.userId,
                    search: this.table.search
                };
            } else {
                url = '/system-backend/noticeBack/selectCourseListByEnterpriseId';
                params = {
                    enterpriseId: this.$store.state.userInfo.enterpriseId,
                    search: this.table.search
                };
            }
            this.$fetch({
                url: url,
                data: params
            }).then((res) => {
                if (res.code == 200) {
                    this.classList = [];
                    this.table.data = res.obj;
                    if (this.$route.query.id) {
                        this.setCourseList();
                    }
                } else {
                    this.$Message.error(res.msg);
                }
            });
        },
        setCourseList() {
            if (this.btnIndex == 3) {
                this.classList = [];
                let courseArr = this.insertNotice.courseId.split('#');
                courseArr.shift();
                this.table.data = this.table.data.map((item) => {
                    if (_.find(courseArr, (id) => id == item.courseId)) {
                        item._checked = true;
                        this.classList.push(item);
                    }
                    return item;
                });
                this.updateCourseId();
            }
        },

        changeUserType(type) {
            this.initGroupInfo();
            if (type == 2) {
                this.insertNotice.enterpriseId = '-2#' + this.$store.state.userInfo.enterpriseId;
            } else {
                this.insertNotice.enterpriseId = '';
                this.insertNotice.groupId = '';
            }
        },
        changeType(type) {
            this.btnIndex = type;

            this.insertNotice.groupId = '';
            this.insertNotice.enterpriseId = '';
            this.enterpriseGroupStr = '';
            this.courseNotice.userType = '';
            this.userNotification.userType = '';
            this.userNotification.appid = '';
            this.courseNotice.appid = '';
            this.initGroupInfo();
        },
        updateCourseId() {
            this.selectedClassList = this.$tools.cloneObj(this.classList);
            if (this.selectedClassList.length == 0) {
                this.courseNotice.courseId = '';
                this.isClass = false;
                return false;
            }
            let idStr = this.selectedClassList.map((item) => item.courseId).join('#');
            if (this.selectedClassList.length == this.table.data.length) {
                this.courseNotice.courseId = '-1#' + idStr;
            } else {
                this.courseNotice.courseId = '-2#' + idStr;
            }
            this.isClass = false;
            this.$refs[this.indexArr[this.btnIndex]].validateField('courseId');
        },
        initGroupInfo() {
            this.groupStr = '';
            this.userNotification.groupId = null;
            this.courseNotice.groupId = null;
        },
        // 课程通知 切换购买类型
        changeIsBuy() {
            if (this.courseNotice.isBuy == 1) {
                this.courseNotice.userType = '';
                this.insertNotice.enterpriseId=''
                this.initGroupInfo()
            }
            this.insertNotice.groupId = '';
        },
        changeClass(list) {
            this.classList = list;
        },
        next(event) {
            let name = '';
            if (this.btnIndex == 1) {
                name = 'userNotification';
            } else if (this.btnIndex == 2) {
                name = 'authenticatedUser';
                this.insertNotice.userId = this[name].userId;
            } else {
                name = 'courseNotice';
                this.insertNotice.courseId = this[name].courseId;
            }

            this.insertNotice.noticeType = this.btnIndex;
            this.insertNotice.userType = this[name].userType;
            this.insertNotice.appid = this[name].appid;
            this.insertNotice.isBuy = this[name].isBuy;

            this.$refs[name].validate((valid) => {
                if (valid) {
                    event.target.disabled = true;
                    if (this.$route.query.id) {
                        delete this.insertNotice.yunfileList;
                        delete this.insertNotice.noticePushRange;
                        this.insertNotice.adminId = this.$store.state.userInfo.userId;
                        this.$fetch({
                            url: '/system-backend/noticeBack/insertNotice',
                            data: this.insertNotice
                        })
                            .then((res) => {
                                event.target.disabled = false;
                                if (res.code == 200) {
                                    this.$Message.success(res.msg);
                                    storage.remove('insertNotice');
                                    this.$router.push({
                                        path: '/care-management/notification/enterprise'
                                    });
                                } else {
                                    this.$Message.error(res.msg);
                                }
                            })
                            .catch((error) => {
                                event.target.disabled = false;
                            });
                    } else {
                        this.$fetch({
                            url: '/system-backend/noticeBack/insertNotice',
                            data: this.insertNotice
                        })
                            .then((res) => {
                                event.target.disabled = false;
                                if (res.code == 200) {
                                    this.$Message.success(res.msg);
                                    storage.remove('insertNotice');
                                    this.$router.push({
                                        path: '/care-management/notification/enterprise'
                                    });
                                } else {
                                    this.$Message.error(res.msg);
                                }
                            })
                            .catch((error) => {
                                event.target.disabled = false;
                            });
                    }
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
            margin-top: 20px;
            margin-left: 10px;
            margin-right: 10px;

            .warning
                color: #d41e3c;
                font-weight: normal;
                margin-left: 15px;

                a
                    text-decoration: underline;

            .item
                background-color: #fafafa;
                padding: 5px 0;
                margin-bottom: 10px;

                h5
                    margin-bottom: 10px;

            a.file
                color: #8b8b8b
                text-decoration: underline;

            .img-box
                position: relative;
                border: 1px solid #e7e9ef;

                .icon-close
                    position: absolute;
                    top: 0;
                    right: 0;
                    transform: translate(50%, -50%);
                    cursor: pointer;

        .btn-box
            width: 100%;
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #e6e8ee;

            .btn
                width: 115px;
                margin-right: 20px;

    .img-box
        position: relative;
        width: 95px;
        height: 35px;
        border: 1px solid #e7e9ef;
        margin-top: 18px;

        img
            width: 100%;
            height: 100%;

    .text
        text-decoration: underline
        margin-left: 20px;

    .btn-user
        background-color: #d1d5de
        margin-right: 20px;

        &.active
            background-color: #117dd6
            color: #fff;

    .tree-box
        height: 350px;
        max-height: 350px;
        overflow: auto;
        border: 1px solid #e6e8ee;

</style>
<style lang="stylus">
    .select-list.dialog
        .ivu-modal-body
            background-color: #fff

        .tree
            > ul
                padding: 5px 0;
                padding-left: 15px;
                border-bottom: 1px solid #e7e9ee;

    .dialog
        .search-input
            input
                background-color: #fff
</style>
