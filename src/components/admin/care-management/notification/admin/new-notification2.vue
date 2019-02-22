<template>
    <div class="review2 edit-new">
        <header>
            <router-link class="icon-box" tag="div" to="/care-management/notification/admin">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-left"></use>
                </svg>
            </router-link>
            <div class="title">
                新建通知
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
                        <Button class="btn-user " @click="changeType(1)" :class="{active:btnIndex==1}">用户通知</Button>
                        <Button class="btn-user" @click="changeType(2)" :class="{active:btnIndex==2}">认证用户通知</Button>
                        <Button class="btn-user" @click="changeType(3)" :class="{active:btnIndex==3}">课程通知</Button>
                    </div>
                    <div v-show="btnIndex==1">
                        <Form class="from" ref="userNotification" :model="userNotification"
                              :rules="userNotificationRules"
                              :label-width="180"
                              label-position="left">
                            <FormItem label="选择公众号(必选)" prop="appid">
                                <Button @click="isList=true" class="white-blue" type="primary">选择公众号</Button>
                                <span>{{selectedAppList.map(item=>item.name).join(' / ')}}</span>
                            </FormItem>
                            <FormItem label="用户类型(必选)" prop="userType">
                                <Select @on-change="changeUserType" v-model="userNotification.userType"
                                        style="width:200px" placeholder="企业用户">
                                    <Option v-for="item in userType" :value="item.value" :key="item.value">{{
                                        item.label}}
                                    </Option>
                                </Select>
                            </FormItem>
                            <FormItem v-if="userNotification.userType == 2" label="选择企业及分组(必填)" prop="enterpriseGroup">
                                <Button :disabled="selectedAppList.length == 0" class="white-blue"
                                        @click="isGroup = true" type="primary">选择企业及分组
                                </Button>
                                {{enterpriseGroupStr}}
                            </FormItem>
                        </Form>
                    </div>
                    <div v-show="btnIndex==2">
                        <Form class="from" ref="authenticatedUser" :model="authenticatedUser"
                              :rules="authenticatedUserRules"
                              :label-width="180"
                              label-position="left">
                            <FormItem label="认证用户类型(必选)" prop="userType" style="margin:0;">
                                <Select @on-change="initAuthenticatedUser" v-model="authenticatedUser.userType"
                                        style="width:200px" placeholder="企业内部用户">
                                    <Option v-for="item in certifiedUserType" :value="item.value" :key="item.value">
                                        {{ item.label}}
                                    </Option>
                                </Select>
                            </FormItem>
                            <FormItem v-if="authenticatedUser.userType == 4" label="" prop="enterpriseId" style="margin:0;">
                                <div style="margin-top: 20px;">
                                    <Button class="white-blue" @click="isCompany=true" type="primary">选择企业</Button>
                                    <span>{{selectAuthEnterpriseListStr}}</span>
                                </div>
                            </FormItem>
                            <FormItem v-if="authenticatedUser.userType == 5" label="" prop="userId" style="margin:0;">
                                <div style="margin-top: 20px;">
                                    <Button class="white-blue" @click="isPerson=true" type="primary">选择个人</Button>
                                    <span>{{selectAuthIndividualListStr}}</span>
                                </div>
                            </FormItem>

                        </Form>
                    </div>
                    <div v-show="btnIndex==3">

                        <Form class="from" ref="courseNotice" :model="courseNotice" :rules="courseNoticeRules"
                              :label-width="180"
                              label-position="left">
                            <FormItem label="购买类型(必选)" prop="isBuy">
                                <RadioGroup @on-change="changeIsBuy" v-model="courseNotice.isBuy">
                                    <Radio label="0">未购买课程用户</Radio>
                                    <Radio label="1">已购买课程用户</Radio>
                                </RadioGroup>
                            </FormItem>
                            <FormItem label="选择课程(必选)" prop="courseId">
                                <Button class="white-blue" @click="isClass=true" type="primary">选择课程</Button>
                                <span>{{selectedClassList.map(item=>item.courseName).join(' / ')}}</span>
                            </FormItem>
                            <template v-if="courseNotice.isBuy ==0">

                                <FormItem label="选择公众号(必选)" prop="appid">
                                    <Button class="white-blue" @click="isList=true" type="primary">选择公众号</Button>
                                    <span>{{selectedAppList.map(item=>item.name).join(' / ')}}</span>
                                </FormItem>
                                <FormItem label="用户类型(必选)" prop="userType">
                                    <Select @on-change="changeUserType" v-model="courseNotice.userType"
                                            style="width:200px" placeholder="企业用户">
                                        <Option v-for="item in userType" :value="item.value" :key="item.value">{{
                                            item.label}}
                                        </Option>
                                    </Select>
                                </FormItem>
                                <FormItem v-if="courseNotice.userType == 2" label="选择企业及分组(必填)" prop="enterpriseGroup">
                                    <Button :disabled="selectedAppList.length == 0" class="white-blue"
                                            @click="isGroup=true" type="primary">选择企业及分组
                                    </Button>
                                    {{enterpriseGroupStr}}
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
        <MyDialog width="380" class-name="select-list" @ok="updateAppId" :title="'选择公众号'" :visible.sync="isList">
            <div style="text-align: left">
                <p>公众号列表</p>
                <groupList :list="appList" :selectList.sync="selectAppList"></groupList>

            </div>
        </MyDialog>
        <MyDialog width="380" class-name="select-list" @ok="updateEnterpriseGroup" :title="'选择企业及分组'"
                  :visible.sync="isGroup">
            <div style="text-align: left;overflow: auto;" class="tree-box">
                <Tree @on-check-change="changeGroup" class="tree" :data="treeData" show-checkbox></Tree>
            </div>
        </MyDialog>
        <MyDialog width="380" class-name="select-list" @ok="updateAuthEnterprise" :title="'选择企业'"
                  :visible.sync="isCompany">
            <div style="text-align: left">
                <p>企业列表</p>
                <groupList :list="authEnterpriseList" :selectList.sync="selectAuthEnterpriseList"></groupList>
            </div>
        </MyDialog>
        <MyDialog width="380" class-name="select-list" @ok="update0AuthIndividual" :title="'选择个人'"
                  :visible.sync="isPerson">
            <div style="text-align: left">
                <p>个人列表</p>
                <groupList :list="authIndividualList" :selectList.sync="selectAuthIndividualList"
                           :itemKey="'nickname'"></groupList>
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
    computed: {},
    data() {
        return {
            indexArr: ['', 'userNotification', 'authenticatedUser', 'courseNotice'],
            insertNotice: storage.get('insertNotice') || {},
            selectAppList: [],
            selectedAppList: [],
            appList: [],
            classList: [],
            selectedClassList: [],
            isCompany: false,
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
            btnIndex: 1,
            authEnterpriseList: [],
            selectAuthEnterpriseList: [],
            selectAuthEnterpriseListStr: '',
            selectAuthIndividualList: [],
            selectAuthIndividualListStr: '',
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
                userType: '1',
                appid: '',
                enterpriseGroup: ''
            },
            userNotificationRules: {
                userType: { required: true, message: '请选择用户类型' },
                appid: { required: true, message: '请选择公众号' },
                enterpriseGroup: { required: true, message: '请选择企业及分组' }
            },
            authenticatedUser: {
                userType: '1',
                enterpriseId: null,
                userId: null
            },
            authenticatedUserRules: {
                userType: { required: true, message: '请选择用户类型' },
                enterpriseId: { required: true, message: '请选择企业' },
                userId: { required: true, message: '请选择用户' }
            },
            courseNotice: {
                isBuy: null,
                courseId: null,
                appid: null,
                userType: '',
                enterpriseGroup: ''
            },
            courseNoticeRules: {
                isBuy: { required: true, message: '请选择购买类型' },
                courseId: { required: true, message: '请选择课程' },
                appid: { required: true, message: '请选择公众号' },
                userType: { required: true, message: '请选择用户类型' },
                enterpriseGroup: { required: true, message: '请选择企业及分组' }
            },
            enterpriseList: [],
            groupList: [],
            enterpriseGroupStr: '',
            selectedEnterpriseGroupList: [],
            enterpriseGroup: {}
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.getAppByCourseIdList();
            this.getAuthEnterpriseList();
            this.getAuthIndividualList();
            this.getCourseList();
        },

        // 获取课程列表
        getCourseList() {
            this.$fetch({
                url: '/system-backend/noticeBack/selectCourseListByEnterpriseId',
                data: {
                    enterpriseId: null,
                    search: this.table.search
                }
            }).then((res) => {
                this.classList = [];
                this.table.data = res.obj;
            });
        },
        // 更新课程ID
        updateCourseId() {
            this.selectedClassList = this.$tools.cloneObj(this.classList);
            let idStr = this.selectedClassList.map((item) => item.courseId).join('#');
            if (this.selectedClassList.length == this.table.data.length) {
                this.courseNotice.courseId = '-1#' + idStr;
            } else {
                this.courseNotice.courseId = '-2#' + idStr;
            }
            this.isClass = false;
            this.clearAppId();
            this.clearEnterpriseGroup();
            this.getAppByCourseIdList(this.selectedClassList);
            this.$refs[this.indexArr[this.btnIndex]].validateField('courseId');
        },
        // 获取认证企业列表
        getAuthEnterpriseList() {
            this.$fetch({
                url: '/system-backend/noticeBack/selectAuthEnterpriseList'
            }).then((res) => {
                if (res.code == 200) {
                    this.authEnterpriseList = res.obj;
                } else {
                    this.$Message.error(res.msg);
                }
            });
        },

        // 获取认证个人列表
        getAuthIndividualList() {
            this.$fetch({
                url: '/system-backend/noticeBack/selectAuthIndividualList'
            }).then((res) => {
                if (res.code == 200) {
                    this.authIndividualList = res.obj;
                } else {
                    this.$Message.error(res.msg);
                }
            });
        },
        initAuthenticatedUser() {
            this.selectAuthIndividualListStr = '';
            this.selectAuthEnterpriseListStr = '';
            this.authenticatedUser.enterpriseId = null;
            this.authenticatedUser.userId = null;
        },
        // 更新认证企业id
        updateAuthEnterprise() {
            this.initAuthenticatedUser();
            this.selectAuthEnterpriseListStr = this.selectAuthEnterpriseList.map((item) => item.name).join(',');
            let idStr = this.selectAuthEnterpriseList.map((item) => item.enterpriseId).join('#');
            if (this.selectAuthEnterpriseList.length == this.authEnterpriseList.length) {
                this.authenticatedUser.enterpriseId = '-1#' + idStr;
            } else {
                this.authenticatedUser.enterpriseId = '-2#' + idStr;
            }
            this.isCompany = false;
            this.$refs.authenticatedUser.validateField('enterpriseId');
        },
        // 更新认证个人id
        update0AuthIndividual() {
            this.initAuthenticatedUser();
            this.selectAuthIndividualListStr = this.selectAuthIndividualList.map((item) => item.nickname).join(',');
            let idStr = this.selectAuthIndividualList.map((item) => item.userId).join('#');
            if (this.selectAuthIndividualList.length == this.authIndividualList.length) {
                this.authenticatedUser.userId = '-1#' + idStr;
            } else {
                this.authenticatedUser.userId = '-2#' + idStr;
            }
            this.isPerson = false;
            this.$refs.authenticatedUser.validateField('userId');
        },
        getGroupList() {
            this.$fetch({
                url: '/system-backend/noticeBack/selectEnterpriseAndGroupByAppidList',
                data: {
                    appIdList: null
                }
            });
        },
        changeUserType(type) {
            this.clearEnterpriseGroup();
        },
        // 获取企业及分组
        getEnterpriseAndGroupByAppidList() {
            this.$fetch({
                url: '/system-backend/noticeBack/selectEnterpriseAndGroupByAppidList',
                data: {
                    appIdList: this.selectedAppList.map((item) => item.appid).join(',')
                }
            }).then((res) => {
                if (res.code == 200) {
                    let groupList = res.obj.groupList;
                    let enterpriseList = _.uniq(res.obj.enterpriseList, _.iteratee('enterpriseId'));
                    enterpriseList.forEach((enterprise) => {
                        enterprise.children = [];
                        enterprise.title = enterprise.name;
                        groupList.forEach((group) => {
                            if (group.enterpriseId == enterprise.enterpriseId) {
                                group.title = group.name;
                                group.father = enterprise.name;
                                enterprise.children.push(group);
                            }
                        });
                        enterprise.children.push({
                            title: '未分组用户',
                            name: '未分组用户',
                            groupId: '-1',
                            enterpriseId: enterprise.enterpriseId,
                            father: enterprise.name
                        });
                    });
                    let data = {
                        title: '选择全部',
                        children: enterpriseList
                    };
                    this.treeData = [data];
                } else {
                    this.$Message.error(res.msg);
                }
            });
        },
        // 更新企业id和组id
        updateEnterpriseGroup() {
            let list = this.selectedEnterpriseGroupList;
            let treeData = this.treeData[0].children;
            this.clearEnterpriseGroup();
            for (let key in list) {
                if (key == '未分组用户') {
                    this.enterpriseGroupStr += `${key}`;
                    this.insertNotice.groupId += '-1,-1';
                } else {
                    let flag = list[key].length == _.find(treeData, (item) => item.name == key).children.length; // 判断是否是全部
                    if (flag) {
                        this.insertNotice.groupId += '-1';
                    } else {
                        this.insertNotice.groupId += '-2';
                    }

                    this.enterpriseGroupStr += `${key}-`;
                    list[key].forEach((item) => {
                        this.insertNotice.groupId += `,${item.groupId}`;
                        this.enterpriseGroupStr += `${item.name} / `;
                    });
                    this.enterpriseGroupStr = this.enterpriseGroupStr.replace(/\/\s*$/, '');
                    this.enterpriseGroupStr += ', ';
                    this.insertNotice.groupId += '#';
                }
            }
            this.insertNotice.groupId = this.insertNotice.groupId.replace(/#\s*$/, '');
            this.enterpriseGroupStr = this.enterpriseGroupStr.replace(/,\s*$/, '');
            let enterpriseList = this.enterpriseList.filter((item) => item.enterpriseId != undefined);
            if (enterpriseList.length === treeData.length - 1) {
                this.insertNotice.enterpriseId += '-1';
            } else {
                this.insertNotice.enterpriseId += '-2';
            }
            enterpriseList.forEach((item) => {
                this.insertNotice.enterpriseId += `#${item.enterpriseId}`;
            });
            this.isGroup = false;
            this.userNotification.enterpriseGroup = true;
            this.courseNotice.enterpriseGroup = true;
            this.$refs[this.indexArr[this.btnIndex]].validateField('enterpriseGroup');
        },
        // 清空企业及分组
        clearEnterpriseGroup() {
            this.insertNotice.enterpriseId = '';
            this.enterpriseGroupStr = '';
            this.insertNotice.groupId = '';
            this.userNotification.enterpriseGroup = null;
            this.courseNotice.enterpriseGroup = null;
        },
        changeGroup(list) {
            let data = {};
            let arr = list.filter((item) => item.children == undefined);
            let enterprise = list.filter((item) => item.enterpriseId != undefined);
            enterprise = _.uniq(enterprise, _.iteratee('enterpriseId'));
            this.groupList = arr;
            this.enterpriseList = enterprise;
            arr.forEach((item) => {
                if (data[item.father]) {
                    data[item.father].push(item);
                } else {
                    data[item.father] = [];
                    data[item.father].push(item);
                }
            });
            this.selectedEnterpriseGroupList = data;
        },
        // 获取公众号ID
        getAppByCourseIdList(selectedClassList = []) {
            this.$fetch({
                url: '/system-backend/noticeBack/selectAppByCourseIdList',
                data: {
                    courseIdList: selectedClassList.map((item) => item.courseId).join(',')
                }
            }).then((res) => {
                this.appList = res.obj;
            });
        },
        // 选择公众号
        updateAppId() {
            this.courseNotice.appid = ''
            this.selectedAppList = this.$tools.cloneObj(this.selectAppList);
            if (this.selectedAppList.length != 0) {
                let idStr = this.selectedAppList.map((item) => item.appid).join('#');
                if (this.selectedAppList.length == this.appList.length) {
                    this.courseNotice.appid = '-1#' + idStr;
                } else {
                    this.courseNotice.appid = '-2#' + idStr;
                }
            }
            this.userNotification.appid = this.courseNotice.appid;
            this.isList = false;

            this.$refs[this.indexArr[this.btnIndex]].validateField('appid');
            this.clearEnterpriseGroup()
            this.getEnterpriseAndGroupByAppidList();
        },
        // 清空选择公众号
        clearAppId() {
            this.selectedAppList = [];
            this.selectAppList = [];
            this.courseNotice.appid = '';
            this.userNotification.appid = '';
        },
        changeIsBuy() {
            if (this.courseNotice.isBuy == 1) {
                this.courseNotice.userType = '';
                this.clearAppId();
                this.clearEnterpriseGroup();
            }
        },

        changeType(type) {
            this.btnIndex = type;
            this.insertNotice.courseId = '';
            this.clearEnterpriseGroup();
            this.clearAppId();
            this.getAppByCourseIdList();
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
                this.insertNotice.enterpriseId = this[name].enterpriseId;
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
                                    path: '/care-management/notification/admin'
                                });
                            } else {
                                this.$Message.error(res.msg);
                            }
                        })
                        .catch((error) => {
                            event.target.disabled = false;
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
