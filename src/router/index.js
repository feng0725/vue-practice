import Vue from 'vue';
import Router from 'vue-router';

const login = () => import('@/components/login');
const index = () => import('@/components/admin/index');

// 用户
const user = () => import('@/components/admin/userManage/user');
const userIndex = () => import('@/components/admin/userManage/user/user');
const userAddAmin = () => import('@/components/admin/userManage/user/addAdmin');
const addEnterpriseUser = () => import('@/components/admin/userManage/user/addEnterpriseUser');
const addPersonalUsers = () => import('@/components/admin/userManage/user/addPersonalUsers');
const openClass = () => import('@/components/admin/userManage/user/openClass');

// 用户组
const usergroup = () => import('@/components/admin/userManage/usergroup');
const usergroupIndex = () => import('@/components/admin/userManage/usergroup/usergroupIndex');
const addUserGroup = () => import('@/components/admin/userManage/usergroup/addUserGroup');

// 用户审核
const userAudit = () => import('@/components/admin/userManage/userAudit');

// 认证配置
const AuthenticationConfiguration = () => import('@/components/admin/certification/configuration.vue');

import NotFoundComponent from '@/components/404';
Vue.use(Router);

export default new Router({
    // mode: 'history',
    routes: [
        { path: '*', component: NotFoundComponent },
        { path: '/', redirect: '/today-course' },
        {
            path: '/login',
            name: 'login',
            component: login,
            meta: {
                title: '友看培训平台'
            }
        },
        {
            path: '/',
            name: 'index',
            component: index,
            children: [
                {
                    path: '/permissions',
                    component: userAddAmin,
                    name: '添加管理员'
                },
                {
                    path: '/classification',
                    component: () =>
                        import('@/components/admin/courseManagement/classification/classification.vue')
                },
                {
                    path: 'today-course',
                    name: '今日课程',
                    component: () => import('@/components/admin/curriculum-schedule/index')
                },
                {
                    path: '',
                    name: '用户管理',
                    component: () => import('@/components/admin/userManage/userManage'),
                    children: [
                        {
                            path: 'user',
                            component: user,
                            children: [
                                {
                                    path: '',
                                    component: userIndex
                                },
                                {
                                    path: 'addAdmin',
                                    component: userAddAmin,
                                    name: '添加管理员'
                                },
                                {
                                    path: 'addEnterpriseUser',
                                    component: addEnterpriseUser,
                                    name: '添加企业'
                                },
                                {
                                    path: 'addPersonalUsers',
                                    component: addPersonalUsers,
                                    name: '添加个人用户'
                                },
                                {
                                    path: 'openClass/:id',
                                    component: openClass,
                                    name: '开课认证'
                                }
                            ]
                        },
                        {
                            path: 'usergroup',
                            component: usergroup,
                            children: [
                                {
                                    path: '',
                                    component: usergroupIndex
                                },
                                {
                                    path: 'addUserGroup',
                                    component: addUserGroup
                                }
                            ]
                        },
                        {
                            path: 'userAudit',
                            component: userAudit
                        }
                    ]
                },
                {
                    path: 'configuration',
                    name: '企业管理',
                    component: () => import('@/components/admin/certification/configuration.vue'),
                    children: [
                        {
                            path: '',
                            component: () => import('@/components/admin/certification/children/configurationIndex.vue')
                        },
                        {
                            path: 'addEnterprise',
                            component: () => import('@/components/admin/certification/children/addEnterprise')
                        },
                        {
                            path: 'addEnterprise1',
                            component: () => import('@/components/admin/certification/children/addEnterprise1')
                        },
                        {
                            path: 'openClass',
                            component: () => import('@/components/admin/certification/children/openClass')
                        }
                    ]
                },
                {
                    path: 'courseManagement',
                    name: '课程管理',
                    component: () => import('@/components/admin/courseManagement/index.vue'),
                    children: [
                        {
                            path: 'course',
                            component: () => import('@/components/admin/courseManagement/course/course.vue'),
                            children: [
                                {
                                    path: '',
                                    component: () =>
                                        import('@/components/admin/courseManagement/course/children/courseIndex.vue')
                                },
                                {
                                    path: 'addCourse',
                                    component: () =>
                                        import('@/components/admin/courseManagement/course/children/addCourse')
                                },
                                {
                                    path: 'addCourseAdmin',
                                    component: () =>
                                        import('@/components/admin/courseManagement/course/children/addCourseAdmin')
                                },
                                {
                                    path: 'addCoursePersonal',
                                    component: () =>
                                        import('@/components/admin/courseManagement/course/children/addCoursePersonal')
                                },
                                {
                                    path: 'courseSummary',
                                    component: () =>
                                        import('@/components/admin/courseManagement/course/children/courseSummary')
                                },
                                {
                                    path: 'courseIntroduction',
                                    component: () =>
                                        import('@/components/admin/courseManagement/course/children/courseIntroduction')
                                },
                                {
                                    path: 'teacherIntroduction',
                                    component: () =>
                                        import('@/components/admin/courseManagement/course/children/teacherIntroduction')
                                }
                            ]
                        },
                        {
                            path: 'review',
                            component: () => import('@/components/admin/courseManagement/boardReview/review.vue'),
                            children: [
                                {
                                    path: '',
                                    component: () =>
                                        import('@/components/admin/courseManagement/boardReview/children/reviewIndex.vue')
                                },
                                {
                                    path: 'addCourse',
                                    component: () =>
                                        import('@/components/admin/courseManagement/boardReview/children/addCourse')
                                },
                                {
                                    path: 'addCourseAdmin',
                                    component: () =>
                                        import('@/components/admin/courseManagement/boardReview/children/addCourseAdmin')
                                },
                                {
                                    path: 'addCoursePersonal',
                                    component: () =>
                                        import('@/components/admin/courseManagement/boardReview/children/addCoursePersonal')
                                },
                                {
                                    path: 'courseSummary',
                                    component: () =>
                                        import('@/components/admin/courseManagement/boardReview/children/courseSummary')
                                },
                                {
                                    path: 'courseIntroduction',
                                    component: () =>
                                        import('@/components/admin/courseManagement/boardReview/children/courseIntroduction')
                                },
                                {
                                    path: 'teacherIntroduction',
                                    component: () =>
                                        import('@/components/admin/courseManagement/boardReview/children/teacherIntroduction')
                                }
                            ]
                        },
                        {
                            path: 'videoLibrary',
                            component: () => import('@/components/admin/courseManagement/videoLibrary/videoLibrary.vue')
                        },
                        {
                            path: 'classification',
                            component: () =>
                                import('@/components/admin/courseManagement/classification/classification.vue')
                        },
                        {
                            path: 'examination',
                            component: () => import('@/components/admin/courseManagement/examination/examination.vue'),
                            children: [
                                {
                                    path: '',
                                    component: () =>
                                        import('@/components/admin/courseManagement/examination/children/examinationIndex.vue')
                                },
                                {
                                    path: 'addTest',
                                    component: () =>
                                        import('@/components/admin/courseManagement/examination/children/addTest.vue')
                                },
                                {
                                    path: 'answerSheet',
                                    component: () =>
                                        import('@/components/admin/courseManagement/examination/children/answerSheet')
                                }
                            ]
                        },
                        {
                            path: 'course-recommendation',
                            component: () =>
                                import('@/components/admin/courseManagement/course-recommendation/course-recommendation.vue')
                        }
                    ]
                },
                {
                    path: 'order-management',
                    name: '订单管理',
                    component: () => import('@/components/admin/order/index.vue'),
                    children: [
                        {
                            path: 'course',
                            name: '课程订单',

                            component: () => import('@/components/admin/order/course/index.vue'),
                            children: [
                                {
                                    path: '',
                                    component: () => import('@/components/admin/order/course/course-order.vue')
                                },
                                {
                                    path: 'change',
                                    component: () => import('@/components/admin/order/course/replace-order.vue')
                                }
                            ]
                        },
                        {
                            path: 'course-statistics',
                            name: '课程订单统计',
                            component: () => import('@/components/admin/order/course-statistics/index.vue'),
                            children: [
                                {
                                    path: '',
                                    component: () =>
                                        import('@/components/admin/order/course-statistics/course-statistics.vue')
                                },
                                {
                                    path: 'buy-details',
                                    component: () =>
                                        import('@/components/admin/order/course-statistics/buy-details.vue')
                                }
                            ]
                        },
                        {
                            path: 'class',
                            name: '课时订单',
                            component: () => import('@/components/admin/order/class/index.vue'),
                            children: [
                                {
                                    path: '',
                                    component: () => import('@/components/admin/order/class/class-order.vue')
                                },
                                {
                                    path: 'add-class',
                                    component: () => import('@/components/admin/order/class/add-class.vue')
                                }
                            ]
                        },
                        {
                            path: 'refund-review',
                            component: () => import('@/components/admin/order/refund-review/index.vue')
                        }
                    ]
                },
                {
                    path: 'data-statistics',
                    name: '数据统计',
                    component: () => import('@/components/admin/order/index.vue'),
                    children: [
                        {
                            path: 'class-statistics',
                            name: '课时统计',

                            component: () => import('@/components/admin/data-statistics/class-statistics/index.vue'),
                            children: [
                                {
                                    path: '',
                                    component: () =>
                                        import('@/components/admin/data-statistics/class-statistics/class-statistics.vue')
                                },
                                {
                                    path: 'course-details/:courseId',
                                    component: () =>
                                        import('@/components/admin/data-statistics/class-statistics/course-details.vue')
                                },
                                {
                                    path: 'section-details/:sectionId',
                                    component: () =>
                                        import('@/components/admin/data-statistics/class-statistics/section-details.vue')
                                }
                            ]
                        },
                        {
                            path: 'test-statistics',
                            name: '考试统计',
                            component: () => import('@/components/admin/data-statistics/test-statistics/index.vue'),
                            children: [
                                {
                                    path: '',
                                    component: () =>
                                        import('@/components/admin/data-statistics/test-statistics/test-statistics.vue')
                                },
                                {
                                    path: 'examination-overview/:examPaperId',
                                    component: () =>
                                        import('@/components/admin/data-statistics/test-statistics/examination-overview.vue')
                                },
                                {
                                    path: 'answer-status',
                                    component: () =>
                                        import('@/components/admin/data-statistics/test-statistics/answer-status.vue')
                                }
                            ]
                        },
                        {
                            path: 'user-class-statistics',
                            name: '用户课时统计',
                            component: () =>
                                import('@/components/admin/data-statistics/user-class-statistics/index.vue')
                        }
                    ]
                },
                {
                    path: 'look-back',
                    name: '回看管理',
                    component: () => import('@/components/admin/look-back/index.vue'),
                    children: [
                        {
                            path: 'setting',
                            name: '回看设置',
                            component: () => import('@/components/admin/look-back/setting/index.vue'),
                            children: [
                                {
                                    path: '',
                                    component: () => import('@/components/admin/look-back/setting/look-back.vue')
                                },
                                {
                                    path: 'personal-settings/:id',
                                    component: () =>
                                        import('@/components/admin/look-back/setting/personal-settings.vue')
                                },
                                {
                                    path: 'section-settings/:id',
                                    component: () => import('@/components/admin/look-back/setting/personal-section.vue')
                                }
                            ]
                        },
                        {
                            path: 'address',
                            name: '回看地址',
                            component: () => import('@/components/admin/look-back/address/index.vue'),
                            children: [
                                {
                                    path: '',
                                    component: () => import('@/components/admin/look-back/address/address.vue')
                                },
                                {
                                    path: 'section/:id',
                                    component: () => import('@/components/admin/look-back/address/section.vue')
                                }
                            ]
                        }
                    ]
                },
                {
                    path: 'care-management',
                    name: '消息管理',
                    component: () => import('@/components/admin/care-management/index.vue'),
                    children: [
                        {
                            path: 'notification',
                            name: '通知',
                            component: () => import('@/components/admin/care-management/notification/index.vue'),
                            children: [
                                {
                                    path: 'admin',
                                    component: () =>
                                        import('@/components/admin/care-management/notification/admin/index.vue')
                                },
                                {
                                    path: 'admin/notification',
                                    component: () =>
                                        import('@/components/admin/care-management/notification/admin/new-notification.vue')
                                },
                                {
                                    path: 'admin/notification2',
                                    component: () =>
                                        import('@/components/admin/care-management/notification/admin/new-notification2.vue')
                                },
                                {
                                    path: 'enterprise',
                                    component: () =>
                                        import('@/components/admin/care-management/notification/enterprise/index.vue')
                                },
                                {
                                    path: 'enterprise/notification',
                                    component: () =>
                                        import('@/components/admin/care-management/notification/enterprise/new-notification.vue')
                                },
                                {
                                    path: 'enterprise/notification2',
                                    component: () =>
                                        import('@/components/admin/care-management/notification/enterprise/new-notification2.vue')
                                }
                            ]
                        },
                        {
                            path: 'notification-review',
                            name: '通知审核',
                            component: () => import('@/components/admin/care-management/notification-review/index.vue'),
                            children: [
                                {
                                    path: '',
                                    component: () =>
                                        import('@/components/admin/care-management/notification-review/notification-review.vue')
                                },
                                {
                                    path: 'admin1',
                                    component: () =>
                                        import('@/components/admin/care-management/notification-review/admin/new-notification.vue')
                                },
                                {
                                    path: 'admin2',
                                    component: () =>
                                        import('@/components/admin/care-management/notification-review/admin/new-notification2.vue')
                                },
                                {
                                    path: 'enterprise2',
                                    component: () =>
                                        import('@/components/admin/care-management/notification-review/enterprise/new-notification2.vue')
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
});
