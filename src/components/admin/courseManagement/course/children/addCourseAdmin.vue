<template>
    <div class="addCourseAdmin edit-new">
        <header>
            <router-link class="icon-box" tag="div" to="/courseManagement/course">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-left"></use>
                </svg>
            </router-link>
            <div class="title">
                {{status}}课程
            </div>
        </header>
        <div class="wrapper clearfix">
            <div class="title">
                <Steps size="small" :current="0">
                    <Step title="课程基本信息" content=""></Step>
                    <Step title="课程小节" content=""></Step>
                    <Step title="课程介绍" content=""></Step>
                    <Step title="教师介绍" content=""></Step>

                </Steps>

            </div>
            <div class="clearfix">
                <div class="left fl">
                    <Form class="from" ref="courseMsg" :model="courseMsg" :rules="ruleValidate" :label-width="180"
                          label-position="left">
                        <FormItem label="课程名称(必填)" prop="courseName">
                            <Input style="width: 400px;" v-model="courseMsg.courseName" placeholder=""></Input>
                        </FormItem>
                        <FormItem label="课程封面(必填)" prop="frontCover">
                            <div>
                                <Upload :show-upload-list="false" action="/system-backend/courseBack/addResource"
                                        :data="uploadData"
                                        :before-upload="uploadBefore"
                                        :on-success="uploadSuccess"
                                        :on-progress="uploadProgress"
                                        accept="image/* "
                                >
                                    <Button :disabled="courseMsg.frontCover != ''" class="white-blue">上传图片</Button>
                                </Upload>
                                <span v-show="fileFlag">上传中...</span>
                            </div>
                            <div v-show="courseMsg.frontCover!=''" class="img-box">
                                <Icon @click="courseMsg.frontCover=''" size="15" class="icon-close" color="#f00"
                                      type="md-close-circle"/>
                                <img :src="courseMsg.frontCover" alt="">
                            </div>
                        </FormItem>
                        <FormItem label=" 上课账号(必填)" prop="lecturerId">
                            <Select  style="width: 400px;" v-model="courseMsg.lecturerId"
                                    filterable>
                                <Option v-for="item in enterpriseUserList" :value="item.userId" :key="item.userId"
                                        placeholder="输入用户名查找,模糊查询">{{ item.userAccount }}
                                </Option>
                            </Select>
                        </FormItem>
                        <FormItem label="选择公众号(必选)" prop="appSelectList">
                            <Button type="primary" @click="isSelectAppList = true" class="white-blue">选择公众号</Button>
                            <span>{{showAppList.join(',')}}</span>
                        </FormItem>
                        <FormItem label="是否收费(必选)" prop="isFreeOut">
                            <RadioGroup  v-model="courseMsg.isFreeOut">
                                <Radio label="0">收费</Radio>
                                <Radio label="1">免费</Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem v-if="courseMsg.isFreeOut=='1'" label="是否分享直播页(必选)" prop="isShareOut">
                            <RadioGroup v-model="courseMsg.isShareOut">
                                <Radio label="1">分享</Radio>
                                <Radio label="0">不分享</Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem v-if="courseMsg.isFreeOut=='0'" label="原价" prop="originalPriceVO">
                            <Input style="width:200px" v-model="courseMsg.originalPriceVO" placeholder=""></Input>
                        </FormItem>
                        <FormItem v-if="courseMsg.isFreeOut=='0'" label="现价(必填)" prop="presentPriceVO">
                            <Input style="width:200px" v-model="courseMsg.presentPriceVO" placeholder=""></Input>
                        </FormItem>

                        <FormItem label="分类(必填)" prop="categoryId">
                            <Select :disabled="categoryList1.length ==0" @on-change="changeCategory1"
                                    v-model="category1" style="width:200px">
                                <Option v-for="item in categoryList1" :value="item.categoryId" :key="item.categoryId">{{
                                    item.categoryName }}
                                </Option>
                            </Select>

                            <Select :disabled="categoryList2.length ==0" @on-change="changeCategory2"
                                    v-model="category2" style="width:200px">
                                <Option v-for="item in categoryList2" :value="item.categoryId" :key="item.categoryId">{{
                                    item.categoryName }}
                                </Option>
                            </Select>
                            <Select :disabled="categoryList3.length ==0" @on-change="changeCategory3"
                                    v-model="category3" style="width:200px">
                                <Option v-for="item in categoryList3" :value="item.categoryId" :key="item.categoryId">{{
                                    item.categoryName }}
                                </Option>
                            </Select>
                            <span class="warning">*如果没有该分类，请拨打客服 <a href="javascrtip:;">400-090-7869</a>进行处理！</span>
                        </FormItem>

                        <FormItem label="课程时长(必填)" prop="courseDuration">
                            <TimePicker type="time" v-model="courseMsg.courseDuration" placeholder="请选择课程时长"
                                        style="width: 200px"></TimePicker>

                        </FormItem>
                        <FormItem label="是否互动(必填)" prop="isInteract">
                            <Select v-model="courseMsg.isInteract" style="width:200px">
                                <Option v-for="item in isInteractList" :value="item.value" :key="item.value">{{
                                    item.label
                                    }}
                                </Option>
                            </Select>
                        </FormItem>
                        <FormItem v-if="courseMsg.isInteract == '1'" label="是否举手(必选)" prop="isHandUp">
                            <RadioGroup v-model="courseMsg.isHandUp">
                                <Radio label="1">是</Radio>
                                <Radio label="0">否</Radio>
                            </RadioGroup>
                        </FormItem>
                    </Form>
                </div>
            </div>
            <div class="btn-box fl">
                <Button class="btn fr" type="primary" @click="next">下一步</Button>
                <Button v-if="courseMsg.draftStatus" class="btn fr white-blue" @click="saveDraft"
                        style="margin-right: 20px" type="primary">保存草稿
                </Button>
            </div>
        </div>
        <MyDialog width="380" class-name="select-list" @ok="setAppList" :title="'选择公众号'"
                  :visible.sync="isSelectAppList">
            <div style="text-align: left">
                <h4>分组</h4>
                <div class="check-box">
                    <CheckboxGroup v-model="courseMsg.appSelectList">
                        <Checkbox v-for="item in appList" :key="item.appid" :label="item.appid">{{item.name}}
                        </Checkbox>
                    </CheckboxGroup>
                </div>
            </div>
        </MyDialog>
    </div>
</template>

<script>
import { storage } from '../../../../../common/js/qylh';

export default {
    name: 'addCourseAdmin',
    computed: {},
    data() {
        return {
            enterpriseId: this.$store.state.userInfo.enterpriseId,
            operatorId: this.$store.state.userInfo.userId,
            status: '新建',
            courseId: this.$route.query.id,
            uploadData: {
                originalName: ''
            },
            isInteractList: [{ value: '0', label: '否' }, { value: '1', label: '是' }],
            isIn: false,
            isOut: false,
            showAppList: [],
            appList: [],
            groupList: [],
            categoryList1: [],
            categoryList2: [],
            categoryList3: [],
            category1: '',
            category2: '',
            category3: '',
            isSelectAppList: false,
            addUser: false,
            courseSharing: [], // 课程范围
            isShare: '', // 是否分享
            isFree: '', // 是否免费
            enterpriseUserList: [],
            ruleValidate: {
                courseName: { required: true, message: '请输入课程名称' },
                frontCover: { required: true, message: '请上传课程封面', trigger: 'blur' },
                lecturerId: { required: true, message: '请填写上课账号' },
                courseType: {
                    required: true,
                    message: '请选择课程范围'
                },
                isShareIn: { required: true, message: '请选择是否分享' },
                appSelectList: {
                    required: true,
                    message: '请选择公众号'
                },
                isShareOut: { required: true, message: '请选择是否分享' },
                isFreeOut: { required: true, message: '请选择是否收费' },
                categoryId: { required: true, message: '请选择分类', trigger: 'blur' },
                isInteract: { required: true, message: '请选择是否互动' },
                isHandUp: { required: true, message: '请选择是否举手' },
                courseDuration: { required: true, message: '请选择课程时长' },
                presentPriceVO: [
                    { required: true, message: '请输入现价' },
                    {
                        validator(rule, value, callback) {
                            if (value == 0) {
                                callback(['现价不能为0']);
                            } else {
                                callback();
                            }
                        }
                    }
                ],
                originalPriceVO: [
                    { required: true, message: '请输入原价' },
                    {
                        validator(rule, value, callback) {
                            if (value == 0) {
                                callback(['原价不能为0']);
                            } else {
                                callback();
                            }
                        }
                    }
                ]
            },
            disabledGroup: [],

            courseMsg: {
                appSelectList: [],
                frontCover: '', // 封面图地址
                courseName: '', // 课程名字
                lecturerId: '', // 教师ID
                courseType: '1', // 课程范围 （0-内部课 1-公开课 2-内公开课）

                categoryId: '', // 分类信息
                courseStatus: '3', // 课程状态（0-草稿  1-上架  2-下架  3-待审核   4-审核失败 ）
                draftStatus: true, // 草稿状态（0-草稿  1-上架  2-下架  3-待审核   4-审核失败 ）
                courseDuration: '', //课程时长
                operatorId: this.$store.state.userInfo.userId, // 登录人的userId
                originalPriceVO: '0', // 原价
                presentPriceVO: '0', // 现价
                isFreeOut: '1', // 公开免费
                isFreeIn: '1', // 内部免费
                isShareIn: '1', // 内部分享
                isShareOut: '0', // 公开分享
                courseIntroduction: '', // 课程介绍
                lecturerIntroduction: ' ', // 教师介绍
                isHandUp: '0', // 是否举手
                isInteract: '0' // 是否互动
            }
        };
    },
    watch: {
        isFree(val) {},
        isShare(val) {
            if (this.courseMsg.courseType == 0) {
                this.courseMsg.isShareIn = 1;
                this.courseMsg.isShareOut = 0;
            } else if (this.courseMsg.courseType == 1) {
                this.courseMsg.isShareIn = 0;
                this.courseMsg.isShareOut = 1;
            } else if (this.courseMsg.courseType == 2) {
                this.courseMsg.isShareIn = 1;
                this.courseMsg.isShareOut = 1;
            }
        },
        courseSharing(val) {
            this.isOut = false;
            this.isIn = false;

            if (val.length == 1) {
                this.courseMsg.courseType = val[0];
                if (val[0] == 0) {
                    this.isIn = true;
                } else {
                    this.isOut = true;
                }
            } else if (val.length == 2) {
                this.courseMsg.courseType = '2';
                this.isOut = true;
                this.isIn = true;
            }
        }
    },
    mounted() {
        this.init();
    },

    methods: {
        init() {
            this.getCategoryList();

            this.edit();
            if (!this.$route.query.id && !storage.get('courseMsg')) {
                this.getEnterpriseUserList();
                this.getGroupList();
                this.getAppList();
            }
        },
        async edit() {
            let res = null;
            if (this.courseId) {
                storage.remove('appList');
                storage.remove('courseMsg');
                storage.remove('groupList');
                storage.remove('sectionList');
                this.status = '编辑';

                res = await this.$fetch({
                    url: '/system-backend/courseBack/selectCourseDetail',
                    data: {
                        courseId: this.courseId
                    }
                });
            } else if (storage.get('courseMsg')) {
                res = {
                    obj: {
                        courseMsg: storage.get('courseMsg'),
                        appidList: storage.get('appList'),
                        sectionList: storage.get('sectionList'),
                        groupList: storage.get('groupList')
                    }
                };
            } else {
                return false;
            }
            this.courseMsg = res.obj.courseMsg;
            this.courseMsg.draftStatus = this.courseMsg.courseStatus != '1';
            this.courseMsg.courseStatus = '3';
            if (this.courseMsg.courseType == 2) {
                this.courseSharing.push('0', '1');
            } else if (this.courseMsg.courseType == 1) {
                this.courseSharing.push(this.courseMsg.courseType);
            }
            storage.set('sectionList', res.obj.sectionList);

            this.operatorId = this.courseMsg.operatorId;
            this.enterpriseId = this.courseMsg.enterpriseId ? this.courseMsg.enterpriseId : this.enterpriseId;
            this.getEnterpriseUserList();
            this.getGroupList();

            // 设置公众号
            this.courseMsg.appSelectList = res.obj.appidList.map((item) => item.appid);
            this.getAppList(this.setAppList);

            // 获取 分类
            this.$fetch({
                url: '/system-backend/courseBack/getCategoryList',
                data: {
                    categoryId: this.courseMsg.categoryId,
                    userId: this.$store.state.userInfo.userId
                }
            }).then((res) => {
                if (res.obj.list0) {
                    this.categoryList1 = res.obj.list0 || [];
                    this.categoryList2 = res.obj.list1 || [];
                    this.categoryList3 = res.obj.list2 || [];
                    let arr = this.courseMsg.categoryId.split('|').filter((item) => item);
                    this.category1 = Number(arr[0]) || '';
                    this.category2 = Number(arr[1]) || '';
                    this.category3 = Number(arr[2]) || '';
                }
            });
        },
        /**
         *  获取分类列表
         */
        getCategoryList() {
            this.$fetch({
                url: '/system-backend/courseBack/getCategoryListAddCourse',
                data: {
                    categoryId: '0'
                }
            }).then((res) => {
                if (res.code == 200) {
                    this.categoryList1 = res.obj;
                } else {
                    this.$Message.error(res.msg);
                }
            });
        },
        getEnterpriseUserList() {
            this.$fetch({
                url: '/system-backend/courseBack/selectEnterpriseAccount',
                data: {
                    enterpriseId: this.enterpriseId,
                    operatorId: this.operatorId
                }
            }).then((res) => {
                if (res.code == 200) {
                    this.enterpriseUserList = res.obj;
                }
            });
        },
        getAppList(cb) {
            this.$fetch({
                url: '/system-backend/courseBack/getAppList',
                data: {
                    userId: this.operatorId
                }
            }).then((res) => {
                if (res.code == 200) {
                    this.appList = res.obj;
                    cb && cb();
                }
            });
        },
        /**
         * 获取组列表
         */
        getGroupList() {
            this.$fetch({
                url: '/system-backend/courseBack/getGroupList',
                data: {
                    enterpriseId: this.enterpriseId
                }
            }).then((res) => {
                if (res.code == 200) {
                    this.groupList = res.obj;
                } else {
                    this.$Message.error(res.msg);
                }
            });
        },
        changeCategory3() {
            this.changeCategoryId();
        },
        /**
         * 切换分类
         */
        changeCategory1(id) {
            if (!id) return false;
            this.$fetch({
                url: '/system-backend/courseBack/getCategoryListAddCourse',
                data: {
                    categoryId: id
                }
            }).then((res) => {
                this.category2 = '';
                this.category3 = '';
                this.categoryList2 = [];
                this.categoryList3 = [];
                if (res.code == 200) {
                    this.categoryList2 = res.obj;
                    this.changeCategoryId();
                } else {
                    this.$Message.error(res.msg);
                }
                this.$refs.courseMsg.validateField('categoryId');
            });
        },
        changeCategory2(id) {
            if (!id) return false;
            this.$fetch({
                url: '/system-backend/courseBack/getCategoryListAddCourse',
                data: {
                    categoryId: id
                }
            }).then((res) => {
                this.category3 = '';
                this.categoryList3 = [];
                if (res.code == 200) {
                    this.changeCategoryId();
                    this.categoryList3 = res.obj;
                } else {
                    this.$Message.error(res.msg);
                }
            });
        },
        /**
         * 切换分类
         */
        changeCategoryId() {
            this.courseMsg.categoryId = `|${this.category1}|${this.category2}|${this.category3}|`;
        },
        setAppList() {
            this.showAppList = this.courseMsg.appSelectList.map((item) => {
                if (this.appList.length === 0) {
                    return '';
                }
                return this.appList.filter((list) => {
                    return list.appid == item;
                })[0].name;
            });
            this.isSelectAppList = false;
            let that = this;
            setTimeout(() => {
                that.$refs.courseMsg.validateField('appSelectList');
            }, 100);
        },
        uploadSuccess(response, file, filelist) {
            this.fileFlag = false;
            this.courseMsg.frontCover = response.obj.fileUrl;
            this.$refs.courseMsg.validateField('frontCover');
        },
        uploadBefore(response, file, fileList) {
            this.uploadData.originalName = this.$tools.filterFileNmae(response.name);
        },
        uploadProgress(response, file, fileList) {
            this.fileFlag = true;
        },
        validateCategory() {
            if (this.categoryList2.length > 0 && !this.category2) {
                return false;
            } else if (this.categoryList3.length > 0 && !this.category3) {
                return false;
            } else {
                return true;
            }
        },
        next: function() {
            this.$refs.courseMsg.validate((valid) => {
                if (valid) {
                    if (!this.validateCategory()) {
                        this.$Message.error('请完善分类');
                        return false;
                    }
                    if (this.courseMsg.isFreeOut == 1) {
                        this.courseMsg.originalPriceVO = 0;
                        this.courseMsg.presentPriceVO = 0;
                    }
                    this.save();
                    if (this.courseId) {
                        this.$router.push({
                            path: '/courseManagement/course/courseSummary',
                            query: {
                                id: this.$route.query.id
                            }
                        });
                    } else {
                        this.$router.push({
                            path: '/courseManagement/course/courseSummary'
                        });
                    }
                }
            });
        },
        save() {
            let courseMsg = this.$tools.cloneObj(this.courseMsg);
            let sectionList = storage.get('sectionList') || [];
            delete courseMsg.appSelectList;
            storage.set('courseMsg', courseMsg);
            storage.set('sectionList', sectionList);
            storage.set(
                'groupList',
                this.disabledGroup.map((item) => {
                    return { groupId: item };
                })
            );

            storage.set(
                'appList',
                this.courseMsg.appSelectList.map((item) => {
                    return { appid: item };
                })
            );
        },
        // 保存草稿
        saveDraft() {
            this.courseMsg.courseStatus = '0';
            this.save();
            if (this.$route.query.id) {
                this.$fetch({
                    url: '/system-backend/courseBack/updateCourse',
                    data: {
                        courseId: this.$route.query.id,
                        sectionList: JSON.stringify(storage.get('sectionList')) || [],
                        courseMsg: JSON.stringify(storage.get('courseMsg')) || {},
                        appList: JSON.stringify(storage.get('appList')) || [],
                        groupList: JSON.stringify(storage.get('groupList')) || []
                    }
                }).then((res) => {
                    if (res.code == 200) {
                        storage.remove('sectionList');
                        storage.remove('courseMsg');
                        storage.remove('appList');
                        storage.remove('groupList');
                        this.$Message.success(res.msg);
                        this.$router.push({
                            path: '/courseManagement/course'
                        });
                    }
                });
            } else {
                this.$fetch({
                    url: '/system-backend/courseBack/insertCourse',
                    data: {
                        sectionList: JSON.stringify(storage.get('sectionList')) || [],
                        courseMsg: JSON.stringify(storage.get('courseMsg')) || {},
                        appList: JSON.stringify(storage.get('appList')) || [],
                        groupList: JSON.stringify(storage.get('groupList')) || []
                    }
                }).then((res) => {
                    if (res.code == 200) {
                        storage.remove('sectionList');
                        storage.remove('courseMsg');
                        storage.remove('appList');
                        storage.remove('groupList');
                        this.$Message.success(res.msg);
                        this.$router.push({
                            path: '/courseManagement/course'
                        });
                    }
                });
            }
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

    .img-box
        position: relative;
        width: 300px;
        /*height: 150px;*/
        border: 1px solid #e7e9ef;
        margin-top: 18px;

        img
            display: block;
            width: 100%;

    /*height: 100%;*/

    .select-list
        h4
            margin-bottom: 5px;

        .check-box
            height: 300px;
            overflow: auto;
            border: 1px solid #E6E8EE;

        .ivu-checkbox-wrapper
            display: block
            height: 45px;
            line-height: 45px;
            border-bottom: 1px solid #E6E8EE;

        .ivu-checkbox
            margin: 0 10px;

</style>
<style lang="stylus">
    .select-list.dialog
        .ivu-modal-body
            background-color: #fff

        .ivu-checkbox
            margin: 0 10px;
</style>
