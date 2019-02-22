<template>
    <div class="review2 edit-new">
        <header>
            <router-link class="icon-box" tag="div" to="/care-management/notification-review">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-left"></use>
                </svg>
            </router-link>
            <div class="title">
                审核通知
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
                        <Button v-show="btnIndex==1" class="btn-user " @click="changeType(1)"
                                :class="{active:btnIndex==1}">用户通知
                        </Button>
                        <Button v-show="btnIndex==2" class="btn-user" @click="changeType(2)"
                                :class="{active:btnIndex==2}">认证用户通知
                        </Button>
                        <Button v-show="btnIndex==3" class="btn-user" @click="changeType(3)"
                                :class="{active:btnIndex==3}">课程通知
                        </Button>
                    </div>
                    <div v-show="btnIndex==1">
                        <Form class="from" ref="userNotification" :model="userNotification"
                              :rules="userNotificationRules"
                              :label-width="180"
                              label-position="left">
                            <FormItem label="选择公众号(必选)" prop="appid">
                                <Button   :disabled="true" @click="isList=true" class="white-blue" type="primary">选择公众号
                                </Button>
                                <span>{{selectedAppList.map(item=>item.name).join(' / ')}}</span>
                            </FormItem>
                            <FormItem label="用户类型(必选)" prop="userType">
                                <Select :disabled="true" @on-change="changeUserType" v-model="userNotification.userType"
                                        style="width:200px" placeholder="企业用户">
                                    <Option v-for="item in userType" :value="item.value" :key="item.value">{{
                                        item.label}}
                                    </Option>
                                </Select>
                            </FormItem>
                            <FormItem v-if="userNotification.userType == 2" label="选择企业及分组(必选)" prop="phone">
                                <!--<Button  :disabled="selectedAppList.length == 0" class="white-blue"-->
                                        <!--@click="isGroup = true" type="primary">选择企业及分组-->
                                <!--</Button> -->
                                <Button :disabled="true" class="white-blue"
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
                            <FormItem label="认证用户类型(必选)" prop="userType">
                                <Select :disabled="true" @on-change="initAuthenticatedUser   "
                                        v-model="authenticatedUser.userType" style="width:200px" placeholder="企业内部用户">
                                    <Option v-for="item in certifiedUserType    " :value="item.value" :key="item.value">
                                        {{ item.label}}
                                    </Option>
                                </Select>
                                <div v-show="authenticatedUser.userType == 4" style="margin-top: 20px;">
                                    <Button :disabled="true" class="white-blue" @click="isCompany=true" type="primary">
                                        选择企业
                                    </Button>
                                    <span>{{selectAuthEnterpriseList.map(item=>item.name).join(',')}}</span>
                                </div>
                                <div v-show="authenticatedUser.userType == 5" style="margin-top: 20px;">
                                    <Button :disabled="true" class="white-blue" @click="isPerson=true" type="primary">
                                        选择个人
                                    </Button>
                                    <span>{{selectAuthIndividualList.map(item=>item.nickname).join(',')}}</span>
                                </div>

                            </FormItem>
                        </Form>
                    </div>
                    <div v-show="btnIndex==3">
                        <Form class="from" ref="courseNotice" :model="courseNotice" :rules="courseNoticeRules"
                              :label-width="180"
                              label-position="left">
                            <FormItem label="购买类型(必选)" prop="isBuy">
                                <RadioGroup v-model="courseNotice.isBuy">
                                    <Radio  :disabled="true" label="0">未购买课程用户</Radio>
                                    <Radio  :disabled="true" label="1">已购买课程用户</Radio>
                                </RadioGroup>
                            </FormItem>
                            <FormItem label="选择课程(必选)" prop="courseId">
                                <Button :disabled="true" class="white-blue" @click="isClass=true" type="primary">选择课程</Button>
                                <span>{{selectedClassList.map(item=>item.courseName).join(' / ')}}</span>
                            </FormItem>
                            <template v-if="courseNotice.isBuy ==0">

                                <FormItem label="选择公众号(必选)" prop="appid">
                                    <Button :disabled="true" class="white-blue" @click="isList=true" type="primary">选择公众号</Button>
                                    <span>{{selectedAppList.map(item=>item.name).join(' / ')}}</span>
                                </FormItem>
                                <FormItem label="用户类型(必选)" prop="userType">
                                    <Select :disabled="true" v-model="courseNotice.userType" style="width:200px" placeholder="企业用户">
                                        <Option v-for="item in userType" :value="item.value" :key="item.value">{{
                                            item.label}}
                                        </Option>
                                    </Select>
                                </FormItem>
                                <FormItem v-if="courseNotice.userType == 2" label="选择企业及分组(必选)" prop="phone">
                                    <Button :disabled="true" class="white-blue" @click="isGroup=true" type="primary">选择企业及分组</Button>
                                    {{enterpriseGroupStr}}
                                </FormItem>
                            </template>

                        </Form>
                    </div>
                </div>
            </div>
            <div class="btn-box fl">
                <Button v-show="$route.query.type !=3" class="btn fr" type="primary" @click="next">通过,立即发送</Button>
                <Button v-show="$route.query.type !=3" class="btn fr refuse" type="primary" @click="isRefuse=true">拒绝</Button>
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
            <div style="text-align: left" class="tree-box">
                <Tree ref="tree" @on-check-change="changeGroup" class="tree" :data="treeData" show-checkbox></Tree>
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
        <MyDialog :title="'拒绝'" width="" @ok="refuse" :visible.sync="isRefuse">
            <div class="refuse">
                <Input v-model="refuseRamark" :autosize="{minRows: 2,maxRows: 5}" type="textarea"
                       placeholder="请输入拒绝原因"/>
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
    computed: {
    },
    data() {
        let insertNotice = storage.get('insertNotice') || {};

        return {
            insertNotice: insertNotice,
            selectAppList: [],
            selectedAppList: [],
            single: null,
            cityList: [],
            model1: '',
            appList: [],
            classList: [],
            selectedClassList: [],
            isCompany: false,
            isPerson: false,
            isClass: false,
            isList: false,
            isGroup: false,
            isRefuse: false,
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
            btnIndex: insertNotice.noticeType,
            disabledGroup: [],

            value7: '',
            formValidate: {
                name: ''
            },
            ruleValidate: {
                name: {
                    required: true,
                    message: 'The name cannot be empty',
                    trigger: 'blur'
                }
            },
            authEnterpriseList: [],
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
                userType: insertNotice.userType,
                appid: ''
            },
            userNotificationRules: {
                userType: { required: true, message: '请选择用户类型' },
                appid: { required: true, message: '请选择公众号' }
            },
            authenticatedUser: {
                userType: insertNotice.userType,
                enterpriseId: null,
                userId: null
            },
            authenticatedUserRules: {
                userType: { required: true, message: '请选择用户类型' }
            },
            courseNotice: {
                userType: insertNotice.userType,
                isBuy: null,
                courseId: null,
                appid: null
            },
            courseNoticeRules: {
                isBuy: { required: true, message: '请选择用户类型' },
                courseId: { required: true, message: '请选择用户类型' },
                appid: { required: true, message: '请选择用户类型' },
                userType: { required: true, message: '请选择用户类型' }
            },
            enterpriseList: [],
            groupList: [],
            enterpriseGroupStr: '',
            selectedEnterpriseGroupList: [],
            enterpriseGroup: {},
            refuseRamark: ''
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
            this.courseNotice.isBuy = this.insertNotice.isBuy;
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
                this.setCourseList();
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
        // 更新课程
        updateCourseId() {
            this.selectedClassList = this.$tools.cloneObj(this.classList);
            let idStr = this.selectedClassList.map((item) => item.courseId).join('#');
            if (this.selectedClassList.length == this.table.data.length) {
                this.courseNotice.courseId = '-1#' + idStr;
            } else {
                this.courseNotice.courseId = '-2#' + idStr;
            }
            this.isClass = false;
        },
        // 点击课程
        changeClass(list) {
            this.classList = list;
        },
        initAuthenticatedUser() {
            this.authenticatedUser.enterpriseId = null;
            this.authenticatedUser.userId = null;
        },
        // 获取认证企业列表
        getAuthEnterpriseList() {
            this.$fetch({
                url: '/system-backend/noticeBack/selectAuthEnterpriseList'
            }).then((res) => {
                if (res.code == 200) {
                    this.authEnterpriseList = res.obj;
                    this.setAuthEnterpriseList();
                } else {
                    this.$Message.error(res.msg);
                }
            });
        },
        // 回显企业信息
        setAuthEnterpriseList() {
            if (this.btnIndex == 2) {
                let arr = this.insertNotice.enterpriseId.split('#');
                arr.shift();
                this.selectAuthEnterpriseList = this.authEnterpriseList.filter((item) => {
                    return _.find(arr, (id) => id == item.enterpriseId);
                });
            }
        },
        // 更新认证企业id
        updateAuthEnterprise() {
            this.initAuthenticatedUser();
            let idStr = this.selectAuthEnterpriseList.map((item) => item.enterpriseId).join('#');
            if (this.selectAuthEnterpriseList.length == this.authEnterpriseList.length) {
                this.authenticatedUser.enterpriseId = '-1#' + idStr;
            } else {
                this.authenticatedUser.enterpriseId = '-2#' + idStr;
            }
            this.isCompany = false;

        },
        // 获取认证个人列表
        getAuthIndividualList() {
            this.$fetch({
                url: '/system-backend/noticeBack/selectAuthIndividualList'
            }).then((res) => {
                if (res.code == 200) {
                    this.authIndividualList = res.obj;
                    this.setAuthIndividualList();
                } else {
                    this.$Message.error(res.msg);
                }
            });
        },
        // 回显个人信息
        setAuthIndividualList() {
            if (this.btnIndex == 2) {
                let arr = this.insertNotice.userId.split('#');
                arr.shift();
                this.selectAuthIndividualList = this.authIndividualList.filter((item) => {
                    return _.find(arr, (id) => id == item.userId);
                });
            }
        },
        // 更新认证个人id
        update0AuthIndividual() {
            this.initAuthenticatedUser();
            let idStr = this.selectAuthIndividualList.map((item) => item.userId).join('#');
            if (this.selectAuthIndividualList.length == this.authIndividualList.length) {
                this.authenticatedUser.userId = '-1#' + idStr;
            } else {
                this.authenticatedUser.userId = '-2#' + idStr;
            }
            this.isPerson = false;

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

        },
        // 设置回显企业和分组
        setEnterpriseAndGroupByAppidList() {
            let treeData = this.treeData[0].children;
            let enterpriseList = this.insertNotice.enterpriseId.split('#');
            enterpriseList.shift();
            let groupList = this.insertNotice.groupId.split('#');
            treeData.forEach((item) => {
                let index = _.indexOf(enterpriseList, '' + item.enterpriseId);

                if (index >= 0) {
                    let groupItem = groupList[index].split(',');
                    item.children.forEach((group, i) => {
                        if (_.find(groupItem, (id) => id == group.groupId)) {
                            group.checked = true;
                        }
                    });
                }
            });
            this.$nextTick(function() {
                this.changeGroup(this.$refs.tree.getCheckedNodes());
                this.updateEnterpriseGroup();
            });


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
                            father: enterprise.name
                        });
                    });
                    let data = {
                        title: '选择全部',
                        children: enterpriseList
                    };
                    this.treeData = [data];
                    this.setEnterpriseAndGroupByAppidList();

                } else {
                    this.$Message.error(res.msg);
                }
            });
        },
        // 更新企业id和组id
        updateEnterpriseGroup() {
            let list = this.selectedEnterpriseGroupList;
            let treeData = this.treeData[0].children;
            this.insertNotice.groupId = '';
            this.insertNotice.enterpriseId = '';
            this.enterpriseGroupStr = '';
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

        // 获取 公众号列表
        getAppByCourseIdList() {
            this.$fetch({
                url: '/system-backend/noticeBack/selectAppByCourseIdList',
                data: {
                    courseIdList: null
                }
            }).then((res) => {
                this.appList = res.obj;
                if (this.btnIndex != 2) {
                    this.setAppId();
                }
            });
        },
        // 选择公众号
        updateAppId() {
            this.selectedAppList = this.$tools.cloneObj(this.selectAppList);
            let idStr = this.selectedAppList.map((item) => item.appid).join('#');
            if (this.selectedAppList.length == this.appList.length) {
                this.courseNotice.appid = '-1#' + idStr;
            } else {
                this.courseNotice.appid = '-2#' + idStr;
            }
            this.userNotification.appid = this.courseNotice.appid;
            this.isList = false;
            this.getEnterpriseAndGroupByAppidList();
        },
        setAppId() {
            let arr = this.insertNotice.appid.split('#');
            this.selectAppList = this.appList.filter((item) => {
                return _.find(arr, (id) => {
                    return id == item.appid;
                });
            });
            this.updateAppId();
        },
        changeType(type) {
            this.btnIndex = type;
            this.selectedAppList = [];

            this.insertNotice.groupId = '';
            this.insertNotice.enterpriseId = '';
            this.enterpriseGroupStr = '';

            this.userNotification.appid = '';
            this.courseNotice.appid = '';
        },

        next() {
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
                    this.$fetch({
                        url: '/system-backend/noticeBack/checkNoticePass',
                        data: {
                            adminId: this.$store.state.userInfo.userId,
                            noticeIdList: this.$route.query.id
                        }
                    }).then((res) => {
                        if (res.code == 200) {
                            this.$Message.success(res.msg);
                            storage.remove('insertNotice');
                            this.$router.push({
                                path: '/care-management/notification-review'
                            });
                        } else {
                            this.$Message.error(res.msg);
                        }
                    });
                }
            });
        },
        refuse() {
            this.$fetch({
                url: '/system-backend/noticeBack/checkNoticeReject',
                data: {
                    adminId: this.$store.state.userInfo.userId,
                    noticeIdList: this.$route.query.id,
                    ramark: this.refuseRamark
                }
            }).then((res) => {
                if (res.code == 200) {
                    this.$Message.success(res.msg);
                    storage.remove('insertNotice');
                    this.$router.push({
                        path: '/care-management/notification-review'
                    });
                } else {
                    this.$Message.error(res.msg);
                }
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
