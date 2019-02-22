<template>
    <div class="menu">
        <Layout>
            <Header class="header clearfix">
                <article class="fl">
                    <!--<img src="../../assets/logo.png" alt="" style="vertical-align: middle">-->
                    <!--<span class="corporate-name">{{$store.state.enterpriseName}}</span>-->
                    <span class="corporate-name">XXXXXXX</span>
                </article>
                <article class="fr clearfix">
                    <!--<span>剩余课时:</span>-->
                    <!--<span>{{$store.state.surplus | minuts2Hour}} </span>-->
                    <!--<Button class="btn" @click="isBuyClassHour=true">购买课时</Button>-->
                    <div class="user-info">
                        <Dropdown @on-click="handlePerson">
                            <a style="color:#fff" href="javascript:void(0)">
                                <svg class="icon" aria-hidden="true">
                                    <use xlink:href="#icon-username"></use>
                                </svg>
                                {{$store.state.userInfo.nickname}}
                                <Icon type="ios-arrow-down"></Icon>
                            </a>
                            <DropdownMenu slot="list">
                                <DropdownItem name="isChangePWD">修改密码</DropdownItem>
                                <DropdownItem name="isLogout">退出</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>

                    </div>
                </article>
            </Header>
            <Layout>
                <Sider width="200">
                    <Menu height="100%" ref="menu" theme="dark" @on-open-change="changeMenu" @on-select="selectMenu"
                          :open-names="openNames"
                          :active-name="activeName" width="auto" accordion class="sider">
                        <MenuItem name="0" v-if="showMenu(1)" to="/today-course">
                            <img class="menu-icon" src="./img/menu/a.png" alt="">
                            <span>课程安排</span>
                        </MenuItem>
                        <Submenu name="1" v-if="showMenu(2)">
                            <template slot="title">
                                <img class="menu-icon" src="./img/menu/b.png" alt="">
                                <span>用户管理</span>
                            </template>
                            <MenuItem name="1-1" v-if="showMenu(21)" to="/permissions">设置权限</MenuItem>
                            <MenuItem name="1-2" v-if="showMenu(22)" to="/classification">分类管理</MenuItem>
                            <MenuItem name="1-3" v-if="showMenu(23)" to="/userAudit">用户审核</MenuItem>
                        </Submenu>
                        <MenuItem name="2" v-if="showMenu(3)" to="/configuration">
                            <img class="menu-icon" src="./img/menu/c.png" alt="">
                            <span>企业管理</span>
                        </MenuItem>
                        <Submenu name="3" v-if="showMenu(4)">
                            <template slot="title">
                                <img class="menu-icon" src="./img/menu/d.png" alt="">
                                <span>课程管理</span>
                            </template>
                            <MenuItem name="3-1" v-if="showMenu(41)" to="/courseManagement/course">课程</MenuItem>
                            <MenuItem name="3-2" v-if="showMenu(42)" to="/courseManagement/review">上架审核</MenuItem>
                            <MenuItem name="3-3" v-if="showMenu(43)" to="/courseManagement/videoLibrary">视频库
                            </MenuItem>
                            <MenuItem name="3-4" v-if="showMenu(44)" to="/courseManagement/classification">分类管理
                            </MenuItem>
                            <MenuItem name="3-5" v-if="showMenu(45)" to="/courseManagement/examination">考试管理
                            </MenuItem>
                            <MenuItem name="3-6" v-if="showMenu(46)" to="/courseManagement/course-recommendation">
                                推荐管理
                            </MenuItem>
                        </Submenu>
                        <Submenu name="4" v-if="showMenu(5)">
                            <template slot="title">
                                <img class="menu-icon" src="./img/menu/e.png" alt="">
                                <span>订单管理</span>
                            </template>
                            <MenuItem name="4-1" v-if="showMenu(51)" to="/order-management/course">课程订单</MenuItem>
                            <MenuItem name="4-2" v-if="showMenu(52)" to="/order-management/course-statistics">
                                课程订单统计
                            </MenuItem>
                            <MenuItem name="4-3" v-if="showMenu(53)" to="/order-management/class">课时订单</MenuItem>
                            <MenuItem name="4-4" v-if="showMenu(54)" to="/order-management/refund-review">退款审核
                            </MenuItem>
                        </Submenu>
                        <Submenu name="5" v-if="showMenu(6)">
                            <template slot="title">
                                <img class="menu-icon" src="./img/menu/f.png" alt="">
                                <span>数据统计</span>
                            </template>
                            <MenuItem name="5-1" v-if="showMenu(61)" to="/data-statistics/class-statistics">
                                课程消耗课时统计
                            </MenuItem>
                            <MenuItem name="5-3" v-if="showMenu(63)" to="/data-statistics/user-class-statistics">
                                认证用户课时统计
                            </MenuItem>
                            <MenuItem name="5-2" v-if="showMenu(62)" to="/data-statistics/test-statistics">考试统计
                            </MenuItem>
                        </Submenu>
                        <Submenu name="6" v-if="showMenu(7)" to="/look-back">
                            <template slot="title">
                                <img class="menu-icon" src="./img/menu/g.png" alt="">
                                <span>回看管理</span>
                            </template>
                            <MenuItem name="6-1" to="/look-back/setting">回看设置</MenuItem>
                            <MenuItem name="6-2" to="/look-back/address">回看地址</MenuItem>
                        </Submenu>
                        <Submenu name="7" v-if="showMenu(8)">
                            <template slot="title">
                                <img class="menu-icon" src="./img/menu/h.png" alt="">
                                <span>消息管理</span>
                            </template>
                            <MenuItem name="7-1" v-if="showMenu(81)" :to="notification">通知</MenuItem>
                            <MenuItem name="7-2" v-if="showMenu(82)" to="/care-management/notification-review">
                                通知审核
                            </MenuItem>
                        </Submenu>
                    </Menu>
                </Sider>
                <Content class="all-height  bgfff">
                    <transition
                        mode="out-in"
                        :duration="{ enter: 700, leave: 700 }"
                        enter-active-class="animated fadeInLeft"
                        leave-active-class="animated fadeOutRight">
                        <router-view/>
                    </transition>
                </Content>
            </Layout>
            <!--<Footer>Footer</Footer>-->
        </Layout>
        <!--dialog-->
        <div>
            <!--退出登录-->
            <MyDialog :title="'退出'" @ok="logOut" :visible.sync="isLogout">
                <div style="text-align: center;font-weight: bold;height: 60px;line-height: 60px;">确定退出该账号?</div>
            </MyDialog>
            <MyDialog :title="'购买课时'" center :visible.sync="isBuyClassHour">
                <div class="buy-class clearfix">
                    <span>请联系客服</span>
                    <span style="font-size:20px;color:#117dd6">400-090-7869</span>
                    <span>购买课时!</span>
                </div>
                <template slot="footer">
                    <Button style="border:0" size="large" type="primary" @click="isBuyClassHour = false">知道了</Button>
                </template>
            </MyDialog>
            <MyDialog :title="'修改密码'" :visible.sync="isChangePWD" @ok="changePassword">
                <Form class="dialog" ref="changePWD" :model="changePWD" :rules="ruleValidate" :label-width="140"
                      label-position="left">
                    <FormItem label="原密码(必填)" prop="oldPassword">
                        <Input v-model="changePWD.userPassword" type="password" placeholder=""></Input>
                    </FormItem>
                    <FormItem label="新密码(必填)" prop="newPassWord">
                        <Input v-model="changePWD.userPassword1" type="password" placeholder=""></Input>
                    </FormItem>
                    <FormItem label="重复新密码(必填)" prop="newPassword2">
                        <Input v-model="changePWD.userPassword2" type="password" placeholder=""></Input>
                    </FormItem>
                </Form>
            </MyDialog>
        </div>

    </div>
</template>

<script>
import { Cookies } from '../../common/js/qylh';

export default {
    name: 'index',
    filters: {
        minuts2Hour(val) {
            let hour = parseInt(val / 60);
            let min = val % 60;
            return `${hour}小时${min}分`;
        }
    },
    beforeRouteEnter(to, from, next) {
        next((vm) => {
            // if (vm.$store.state.userInfo.userId === '') {
            //     vm.$router.push({ path: '/login' });
            // }

            // 通过 `vm` 访问组件实例
        });
        // 在渲染该组件的对应路由被 confirm 前调用
        // 不！能！获取组件实例 `this`
        // 因为当守卫执行前，组件实例还没被创建
    },
    data() {
        return {
            isLogout: false,
            isChangePWD: false,
            isBuyClassHour: false,
            ruleValidate: {
                userPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
                userPassword1: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
                userPassword2: [
                    {
                        required: true,
                        message: '请重复输入新密码',
                        trigger: 'blur'
                    }
                ]
            },
            changePWD: {
                userId: this.$store.state.userInfo.userId,
                userPassword: '',
                userPassword1: '',
                userPassword2: ''
            },
            menuList: [],
            menuUrlList: []
        };
    },
    computed: {
        notification() {
            if (this.$store.getters.isAdmins) {
                return '/care-management/notification/admin';
            } else {
                return '/care-management/notification/enterprise';
            }
        },
        activeName() {
            return this.$store.state.activeName;
        },
        openNames() {
            return this.$store.state.openNames;
        }
    },
    beforeCreate() {},
    mounted() {
        if (this.$store.state.userInfo.userId === '') {
            // this.$router.push({ path: '/login' });
        } else {
            this.getMenuList(this.$store.state.permissionVOList);
            // this.getMenuUrlList(res.obj.user.permissionVOList);
        }
        console.log(this.openNames, this.activeName);
        this.$nextTick(() => {
            this.$refs.menu.updateOpened();
            this.$refs.menu.updateActiveName();
            this.getClassHours();
        });
    },

    watch: {},
    methods: {
        getClassHours() {
            let params = {
                userType: this.$store.getters.isEnterprise ? '2' : '1',
                id: this.$store.state.userInfo.enterpriseId
            };
            if (this.$store.getters.isUser) {
                params.id = this.$store.state.userInfo.userId;
            }
            this.$fetch({
                url: '/system-backend/periodStatisticsBack/periodStatistics',
                data: params
            }).then((res) => {
                if (res.code == 200) {
                    this.$store.commit('updateSurplus', res.obj.surplus);
                }
                console.log(res);
            });
        },
        showMenu(id) {
            return !!this.menuList.find((item) => item === id);
        },

        getMenuUrlList(list) {
            list.forEach((item) => {
                if (item.url) {
                    this.menuUrlList.push(item.url);
                }
                if (item.permissionList && item.permissionList.length > 0) {
                    this.getMenuUrlList(item.permissionList);
                }
            });
        },
        getMenuList(list) {
            list.forEach((item) => {
                this.menuList.push(item.permissionId);
                if (item.permissionList && item.permissionList.length > 0) {
                    this.getMenuList(item.permissionList);
                }
            });
        },
        changePassword() {
            this.$refs.changePWD.validate((valid) => {
                if (valid) {
                    if (this.changePWD.newPassWord !== this.changePWD.newPassword2) {
                        this.$Message.error({
                            content: '两次密码不匹配,请重新输入!'
                        });
                        return false;
                    }
                    this.$fetch({
                        url: '/system-backend/userBack/updatePassword',
                        data: this.changePWD
                    }).then((res) => {
                        if (res.code == 200) {
                            this.$Message.success({
                                content: res.msg
                            });
                            this.isChangePWD = false;
                        } else {
                            this.$Message.error(res.msg);
                        }
                    });
                }
            });
        },
        logOut() {
            this.$fetch({
                url: '/system-backend/userBack/logout'
            }).then((res) => {
                if (res.code == 200) {
                    this.removeInfo();
                    this.$router.push({ path: '/login' });
                    this.$Message.success(res.msg);
                } else {
                    this.$Message.error(res.msg);
                }
            });
        },
        selectMenu(item) {
            this.$store.commit('setActiveName', item);
            this.$store.commit('setOpenName', [item.substring(0, 1)]);
        },
        changeMenu(item) {
            // this.$store.commit('setOpenName', item);
        },
        handlePerson(name) {
            this[name] = true;
        },
        handleOpen(key, keyPath) {},
        handleClose(key, keyPath) {}
    }
};
</script>

<style scoped lang="stylus">
    .menu, .sider, .ivu-layout
        height: 100%;

    .ivu-layout-has-sider
        height: calc(100% - 68px);

    .sider
        overflow: auto

    .header
        height: 68px;
        padding: 0 0 0 20px;
        background-color: #151b26;
        color: #fff;

        .corporate-name
            vertical-align: middle;
            font-size: 16px;
            margin-left: 12px;

        .btn
            width: 80px;
            color: $edit;
            border: 1px solid $edit;
            border-radius: 10px;
            background-color: transparent;
            margin-left: 24px;

        .user-info
            width: 150px;
            text-align: center;
            display: inline-block;

            .handle
                width: 130px;
                position: absolute;
                z-index: 999;
                top: 68px;
                right: 18px;
                background-color: #0c121c;

                p
                    height: 35px;
                    cursor: pointer;
                    line-height: 35px;

                    &:hover
                        color: red;

    .buy-class
        /*text-align: center;*/
        color: #000;
        line-height: 2em;

    .ivu-menu-item > i
        margin-right: 8px;

    .menu-icon
        vertical-align: bottom;
        margin-right: 10px;

    .ivu-menu-submenu .ivu-menu-item
        padding-top: 5px;
        padding-bottom: 5px;
        text-indent: 2em;

    .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active, .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active:hover
        color: #1592f8;
        background-color: #0c121c !important;
</style>
<style lang="stylus">
    .menu
        .ivu-menu-dark
            background-color: #272b33;

        .ivu-menu-dark.ivu-menu-vertical .ivu-menu-opened, .ivu-menu-dark.ivu-menu-vertical .ivu-menu-opened .ivu-menu-submenu-title
            background-color: #0c121c;

        .ivu-menu-dark.ivu-menu-vertical .ivu-menu-item, .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title
            color: #fff

        .ivu-layout-sider
            padding-top: 28px;
            background-color: #272b33;

        .user-info
            .ivu-select-dropdown
                color: #fff;
                background-color: #0c121c;
                margin: 0;

                .ivu-dropdown-item
                    color: #fff;

                .ivu-dropdown-item:hover
                    background: rgba(255, 255, 255, .1)
</style>
