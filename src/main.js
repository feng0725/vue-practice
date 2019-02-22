import Vue from 'vue';
import App from './App';
import store from './store';
import router from './router';
import fetch from '@/common/js/fetch.js';
import qs from 'qs';

// ueditor
import '../static/ue/ueditor.config.js';
import '../static/ue/ueditor.all.js';
import '../static/ue/lang/zh-cn/zh-cn.js';
// css
import '@/common/css/base.css';
import '@/common/css/variables.styl';
import 'animate.css';
// element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// fonts
import '@/common/fonts/symbol';

// filter
Vue.filter('toDouble', function(value) {
    return value < 10 ? '0' + value : value;
});

// iview
import iView from 'iview';
import 'iview/dist/styles/iview.css';

import MyDialog from '@/components/common/dialog';
import MyPage from '@/components/common/page';
import Editor from '@/components/common/editor';
import MySpin from '@/components/common/spin';
Vue.component('MyDialog', MyDialog);
Vue.component('MyPage', MyPage);
Vue.component('Editor', Editor);
Vue.component('MySpin', MySpin);
Vue.use(iView);
Vue.use(ElementUI);
import { tools } from '@/common/js/qylh';
import { storage } from './common/js/qylh';
Vue.prototype.$fetch = fetch;
Vue.prototype.$tools = tools;
Vue.config.productionTip = false;

/* eslint-disable no-new */
let vue = new Vue({
    el: '#app',
    store,
    router,
    render: (h) => h(App)
});
Vue.mixin({
    created() {},
    mounted() {},
    data() {
        return {
            ALLSelect: {
                common: { label: '全部', value: vue.$tools.defaultAll },
                enterprise: { enterpriseId: '-1', name: '全部企业' },
                enterprise1: { enterpriseId: vue.$tools.defaultAll, name: '全部企业' },
                course: { courseId: '-1', courseName: '全部课程' },
                course1: { courseId: vue.$tools.defaultAll, courseName: '全部课程' },
                appList: { appid: '-1', name: '全部公众号' },
                appList1: { appid: vue.$tools.defaultAll, name: '全部公众号' }
            },
            fileSize: 10240,
            fileFlag: false
        };
    },
    methods: {
        isEnterpriseCallBack(callback) {
            if (this.$store.getters.isEnterprise) {
                callback && callback(this.$store.state.userInfo.enterpriseId);
            }
        },
        removeInfo() {
            storage.clear();
            store.commit('clearStore');
            // sotrage.remove('userInfo');
            // sotrage.remove('surplus');
            // sotrage.remove('permissionVOList');
            // sotrage.remove('adminType');
            // sotrage.remove('activeName');
            // sotrage.remove('openNames');
        },
        successCallBack(res, cb, cb2) {
            if (res.code == 200) {
                cb();
            } else {
                cb2 && cb2();
                vue.$Message.error(res.msg);
            }
        },
        hello: function() {},
        filterTableColumns(arr) {
            if (this.$store.getters.isEnterprise) {
                if (typeof arr === 'string') {
                    this.table.columns = this.table.columns.filter((item) => {
                        if (item.title == arr) {
                            return false;
                        }
                        return true;
                    });
                } else if (typeof arr === 'object') {
                    this.table.columns = this.table.columns.filter((item) => {
                        if (arr.find((name) => name == item.title)) {
                            return false;
                        }
                        return true;
                    });
                }
            }
        }
    }
});
// 添加请求拦截器
let ajaxArr = [];
let ajaxTimer = null;
let axiosArr = [];
// 删除重复的请求
function removeAxios(config, source) {
    for (let i in axiosArr) {
        let url = config.url + JSON.stringify(config.data);
        if (axiosArr[i].url == url && config.id !== axiosArr[i].id) {
            source.cancel();
            axiosArr = axiosArr.filter((item) => item.id != config.id);
            break;
        }
    }
}
let id = 0;
fetch.interceptors.request.use(
    function(config) {
        // 在发送请求之前做些什么

        if (config.data) {
            for (let key in config.data) {
                if (config.data[key] == undefined) {
                    config.data[key] = null;
                } else if (config.data[key] == vue.$tools.defaultAll) {
                    config.data[key] = null;
                }
            }
        }
        config.data = vue.$tools.cloneObj(config.data);


        // 删除重复请求
        id++;
        var CancelToken = fetch.CancelToken;
        var source = CancelToken.source();
        config.cancelToken = source.token;
        config.id = id;
        axiosArr.push({ url: config.url + JSON.stringify(config.data), cb: source.cancel, item: config, id: id });
        removeAxios(config, source);

        // loadingbar 的特效

        config.data = config.data ? qs.stringify(config.data) : config.data;
        if (ajaxArr.length === 0) {
            ajaxTimer = setTimeout(() => {
                vue.$Loading.start();
            }, 500);
        }
        ajaxArr.push('ajax');
        return config;
    },
    function(error) {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);

// 添加响应拦截器
fetch.interceptors.response.use(
    function(response) {
        if (ajaxArr.length === 1) {
            clearTimeout(ajaxTimer);
            vue.$Loading.finish();
        }
        axiosArr = axiosArr.filter((item) => item.id !== response.config.id);
        ajaxArr.pop();
        // 对响应数据做点什么
        return response.data;
        // if (response.data.code == 200) {
        //     return response.data;
        // } else {
        //     vue.$Message.error(response.data.msg);
        //     return false;
        // }
    },
    function(error) {
        // 对响应错误做点什么
        vue.$Loading.error();
        return Promise.reject(error);
    }
);
router.beforeEach((to, from, next) => {
    next();
});
