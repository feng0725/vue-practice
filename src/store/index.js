import Vue from 'vue';
import Vuex from 'vuex';
import { storage } from '../common/js/qylh';
Vue.use(Vuex);
let date = new Date().toLocaleDateString();
if (storage.get('date') != date) {
    storage.clear();
}

let userInfo = {
    userId: 0,
    userAccount: '13800000000',
    nickname: '超级管理员',
    avatar: 'http://uimage-10000013.image.myqcloud.com/7c2c9a85-ad54-48e7-9789-17593ec89e0f',
    enterpriseId: 0,
    department: '超管',
    isAuth: '0',
    isAdmin: '1'
};
let adminType = '0';
let surplus = 0;
let enterpriseName = '';
let permissionVOList = [
    { permissionId: 1, name: '课程安排', url: '', pid: 0, permissionList: [] },
    {
        permissionId: 2,
        name: '用户管理',
        url: '',
        pid: 0,
        permissionList: [
            { permissionId: 21, name: '用户', url: '/user', pid: 2 },
            { permissionId: 22, name: '用户组', url: '/userGroup', pid: 2 },
            { permissionId: 23, name: '用户审核', url: '/userAudit', pid: 2 }
        ]
    },
    { permissionId: 3, name: '企业管理', url: '/configuration', pid: 0, permissionList: [] },
    {
        permissionId: 4,
        name: '课程管理',
        url: '',
        pid: 0,
        permissionList: [
            { permissionId: 41, name: '课程', url: '/courseManagement/course', pid: 4 },
            { permissionId: 42, name: '上架审核', url: '/courseManagement/review', pid: 4 },
            { permissionId: 43, name: '视频库', url: '/courseManagement/videoLibrary', pid: 4 },
            { permissionId: 44, name: '分类管理', url: '/courseManagement/classification', pid: 4 },
            { permissionId: 45, name: '考试管理', url: '/courseManagement/examination', pid: 4 },
            { permissionId: 46, name: '推荐管理', url: '/courseManagement/course-recommendation', pid: 4 }
        ]
    },
    {
        permissionId: 5,
        name: '订单管理',
        url: '',
        pid: 0,
        permissionList: [
            { permissionId: 51, name: '课程订单', url: '/order-management/course', pid: 5 },
            { permissionId: 52, name: '课程订单统计', url: '/order-management/course-statistics ', pid: 5 },
            { permissionId: 53, name: '课时订单', url: '/order-management/class ', pid: 5 },
            { permissionId: 54, name: '退款审核', url: '/order-management/refund-review', pid: 5 }
        ]
    },
    {
        permissionId: 6,
        name: '数据统计',
        url: '',
        pid: 0,
        permissionList: [
            { permissionId: 61, name: '课程消耗课时统计', url: '/data-statistics/class-statistics', pid: 6 },
            { permissionId: 62, name: '考试统计', url: '/data-statistics/test-statistics', pid: 6 },
            { permissionId: 63, name: '认证用户课时统计', url: '/data-statistics/user-class-statistics', pid: 6 }
        ]
    },
    {
        permissionId: 7,
        name: '回看管理',
        url: '',
        pid: 0,
        permissionList: [
            { permissionId: 71, name: '回看设置', url: '/look-back/setting', pid: 7 },
            { permissionId: 72, name: '回看地址', url: '/look-back/address', pid: 7 }
        ]
    },
    {
        permissionId: 8,
        name: '消息管理',
        url: '',
        pid: 0,
        permissionList: [
            { permissionId: 81, name: '通知', url: '/care-management/notification', pid: 8 },
            { permissionId: 82, name: '通知审核', url: '/care-management/notification-review', pid: 8 }
        ]
    }
];
let state = {
    userInfo: storage.get('userInfo') || userInfo,
    adminType: storage.get('adminType') || adminType,
    surplus: storage.get('surplus') || surplus,
    enterpriseName: storage.get('enterpriseName') || enterpriseName,
    permissionVOList: storage.get('permissionVOList') || permissionVOList,
    activeName: storage.get('activeName') || '1-1',
    openNames: storage.get('openNames') || ['1']
};

export default new Vuex.Store({
    state: state,
    getters: {
        isSuperAdmin: (state) => {
            return state.adminType === '0';
        },
        isAdmin: (state) => {
            return state.adminType === '1';
        },
        isAdmins: (state) => {
            return state.adminType === '0' || state.adminType === '1';
        },
        isEnterprise: (state) => {
            return state.adminType === '2';
        },
        isUser: (state) => {
            return state.adminType === '3';
        }
    },
    mutations: {
        clearStore(state) {
            // state = {
            //     userInfo: userInfo,
            //     adminType: adminType,
            //     surplus: surplus,
            //     enterpriseName: enterpriseName,
            //     permissionVOList: permissionVOList,
            //     activeName: storage.get('activeName') || '1-1',
            //     openNames: storage.get('openNames') || ['1']
            // };
            state.userInfo = userInfo;
            state.adminType = adminType;
            state.surplus = surplus;
            state.enterpriseName = enterpriseName;
            state.permissionVOList = permissionVOList;
            state.activeName = '';
            state.openNames = [];
        },
        updateUserInfo(state, newVal) {
            state.userInfo = newVal;
            storage.set('userInfo', newVal);
        },
        updateEnterpriseName(state, newVal) {
            state.enterpriseName = newVal;
            storage.set('enterpriseName', newVal);
        },
        updateSurplus(state, newVal) {
            state.surplus = newVal;
            storage.set('surplus', newVal);
        },
        updatePermissionVOList(state, newVal) {
            state.permissionVOList = newVal;
            storage.set('permissionVOList', newVal);
        },
        updateAdminType(state, newVal) {
            state.adminType = '' + newVal;
            storage.set('adminType', newVal);
        },
        setActiveName(state, newVal) {
            storage.set('activeName', newVal);
            state.activeName = newVal;
        },
        setOpenName(state, newVal) {
            storage.set('openNames', newVal);
            state.openNames = newVal;
        }
    }
});
