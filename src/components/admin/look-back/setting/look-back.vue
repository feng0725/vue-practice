<template>
    <div class="look-back two-page">
        <div class="btn-box">
            <Button v-if="$store.getters.isAdmins" type="primary" @click="isGlobalShow">全局设置</Button>
        </div>
        <div class="search-box clearfix">
            <Form class="fr" ref="search" :model="search"  inline>
                <FormItem prop="user" v-if="$store.getters.isAdmins">
                    <Select @on-change="changeEnterprise" v-model="search.enterpriseId" style="width:190px" placeholder="按企业筛选">
                        <Option v-for="item in enterpriseList" :value="item.enterpriseId" :key="item.enterpriseId">{{  item.name }}  </Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <!--<i-input class="search" v-model.trim="abc" search enter-button placeholder="输入课程名称"></i-input>-->
                </FormItem>
                <FormItem>
                    <Select
                        v-model="search.courseId"
                        clearable
                        filterable
                        remote
                        placeholder="请输入课程名称"
                        :remote-method="getCourseName"
                        style="width:250px;"
                        :loading="loading1">
                        <Option v-for="(option, index) in courseList" :value="option.courseId" :key="index">{{option.courseName}}</Option>
                    </Select>

                </FormItem>

                <FormItem>
                    <Button @click="searchTableData" icon="ios-search"></Button>
                </FormItem>

            </Form>

        </div>
        <div v-show="!!title.courseId" class="title-header">
            <div>{{title.courseName}}</div>
            <div>{{title.enterpriseName}}</div>
            <div>{{title.time}}</div>
            <div>
                <Button @click="isCurriculumShow" type="text" class="btn">课程回看设置</Button>
                <Button @click="goPersonal" type="text" class="btn">个人回看设置</Button>
            </div>
        </div>


        <div class="tableList">
            <Table :columns="table.columns" :data="table.data"></Table>
        </div>
        <div class="clearfix page-info">
            <div class="fl">已选0项,共{{table.total}}项</div>
            <myPage class="fr page" @on-change="changePage" :count="count"></myPage>
            <div class="fr">每页显示行:10行</div>
        </div>
        <!--dialog-->
        <div>

            <MyDialog :title="'全局设置'" @ok="globalSetting" width="480" :visible.sync="isGlobal ">
                <div class="refund">
                    <Form :model="global" label-position="left" ref="globalRules" :label-width="140"
                          :rules="globalRules">
                        <FormItem style="text-align: left;" label="回看开始时间(必填)" prop="startValidity">
                            <span style="margin-right: 10px;">课程结束后</span>
                            <Input style="width:125px;" placeholder="" v-model="global.startValidity"></Input>
                            天
                        </FormItem>
                        <FormItem style="text-align: left;" label="回看结束时间" prop="validityPeriod">
                            <Input style="width:200px;" placeholder="非必填,默认无时间限制"
                                   v-model="global.validityPeriod"></Input>
                            天
                        </FormItem>
                        <FormItem style="text-align: left;" label="回看规则" prop="rule">
                            <Input style="width:200px;" v-model="global.rule"></Input>

                        </FormItem>
                        <FormItem style="text-align: left;" label="是否重置全部课程(必填)" prop="isReset">
                            <RadioGroup style="display:block;" v-model="global.isReset">
                                <Row>
                                    <Col :span="6">
                                        <Radio label="1">是</Radio>
                                    </Col>
                                    <Col :span="16">
                                        <Radio label="0">否</Radio>
                                        <p v-show="global.isReset==0&&global.isReset!==''" class="warring">选择该选项会重置所有未单独修改过的课程及小节!</p>
                                    </Col>
                                </Row>
                                <p  v-show="global.isReset==1" class="warring">选择该选项会重置所有小节(包括单独调整的小节),请慎重!</p>
                            </RadioGroup>
                        </FormItem>
                    </Form>
                </div>
            </MyDialog>
            <MyDialog :title="'警告'" @ok="globalSettingSubmit" width="480" :visible.sync="isWarring">
                <div class="refund">修改后无法恢复原来设置,请慎重操作!</div>
            </MyDialog>
            <MyDialog :title="'警告'" @ok="courseSettingSubmit" width="480" :visible.sync="isWarring2">
                <div class="refund">修改后无法恢复原来设置,请慎重操作!</div>
            </MyDialog>
            <MyDialog :title="'课程设置'" @ok="courseSetting" width="480" :visible.sync="isCurriculum ">
                <div class="refund">
                    <Form :model="course" ref="courseRules" :rules="courseRules" label-position="left"
                          :label-width="140">
                        <FormItem style="text-align: left;" label="回看开始时间(必填)" prop="startValidity">
                            <span style="margin-right: 10px;">课程结束后</span>
                            <Input style="width:125px;" placeholder="" v-model="course.startValidity"></Input>
                            天
                        </FormItem>
                        <FormItem style="text-align: left;" label="回看结束时间" prop="validityPeriod">
                            <Input style="width:200px;" placeholder="非必填,默认无时间限制"
                                   v-model="course.validityPeriod"></Input>
                            天
                        </FormItem>
                        <FormItem style="text-align: left;" label="回看规则" prop="rule">
                            <Input style="width:200px;" v-model="course.rule"></Input>

                        </FormItem>
                        <FormItem style="text-align: left;" label="是否重置全部小节" prop="isReset">
                            <RadioGroup style="display:block;" v-model="course.isReset">
                                <Row>
                                    <Col :span="6">
                                        <Radio label="1">是</Radio>
                                    </Col>
                                    <Col :span="6">
                                        <Radio label="0">否</Radio>
                                    </Col>
                                </Row>
                                <p  v-show="course.isReset==1" class="warring">选择该选项会重置所有小节(包括单独调整的小节),请慎重!</p>
                            </RadioGroup>
                        </FormItem>
                    </Form>
                </div>
            </MyDialog>
            <MyDialog :title="'回看设置'" width="480" @ok="sectionSetting" :visible.sync="isSection ">
                <div class="refund">
                    <Form :model="section" ref="section" :rules="sectionRules" label-position="left"
                          :label-width="140">
                        <FormItem style="text-align: left;" label="回看开始时间(必填)" prop="startValidity">
                            <span style="margin-right: 10px;">课程结束后</span>

                            <Input style="width:125px;" placeholder="" v-model="section.startValidity"></Input>
                            天
                        </FormItem>
                        <FormItem style="text-align: left;" label="回看结束时间" prop="validityPeriod">
                            <Input style="width:200px;" placeholder="非必填,默认无时间限制"
                                   v-model="section.validityPeriod"></Input>
                            天
                        </FormItem>

                    </Form>
                </div>
            </MyDialog>

        </div>
    </div>

</template>

<script>
export default {
    name: 'look-back',
    data() {
        return {
            title: {
                courseName: '',
                enterpriseName: '',
                time: ''
            },
            courseList: [
                {
                    courseId: 0,
                    courseName: '请输入课程名称'
                }
            ],
            loading1: false,
            enterpriseList: [],
            isGlobal: false,
            isWarring: false,
            isWarring2: false,
            disabledGroup: '',
            isCurriculum: false,
            isSection: false,
            isAddUserType: false,
            count: 0,
            table: {
                total: 0,
                selected: {},
                data: [],
                columns: [
                    {
                        title: '小节名称',
                        key: 'sectionName',
                        align: 'center'
                    },
                    {
                        title: '所属课程',
                        key: 'courseName',
                        align: 'center'
                    },
                    {
                        title: '所属企业/个人',
                        key: 'enterpriseName',
                        align: 'center'
                    },
                    {
                        title: '回看时间',
                        key: 'time',
                        align: 'center',
                        maxWidth: 180
                    },

                    {
                        title: '操作',
                        key: 'action',
                        width: 250,
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
                                            marginRight: '5px',
                                            color: color,
                                            textAlign: 'center'
                                        },
                                        on: {
                                            click: () => {
                                                this.$refs.section.resetFields();
                                                this.table.selected = params.row;
                                                this.isSection = true;
                                                let param = {
                                                    courseId: params.row.courseId,
                                                    sectionId: params.row.sectionId,
                                                    userId: this.$store.state.userInfo.userId,
                                                    type: '3'
                                                };
                                                this.getSettingInfo(param, (res) => {
                                                    this.section.startValidity = res.obj.startValidity;
                                                    this.section.validityPeriod =
                                                        res.obj.validPeriod == '-1' ? '' : res.obj.validPeriod;
                                                    this.section.rule = res.obj.rule;
                                                });
                                            }
                                        }
                                    },
                                    '小节回看设置'
                                ),
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
                                                this.$router.push({
                                                    path: '/look-back/setting/section-settings/' + params.row.courseId,
                                                    query: {
                                                        section: params.row.sectionId
                                                    }
                                                });
                                            }
                                        }
                                    },
                                    '个人回看设置'
                                )
                            ]);
                        }
                    }
                ]
            },
            search: {
                operatorId: this.$store.state.userInfo.userId,
                enterpriseId: '-1',
                userType: this.$store.state.adminType,
                courseId: 0,
                pageNum: 1,
                pageSize: 10
            },
            global: {
                startValidity: '',
                validityPeriod: '',
                rule: '',
                isReset: ''
            },
            globalRules: {
                startValidity: { required: true, message: '请输入回看开始时间' },
                isReset: { required: true, message: '请选择是否重置全部课程' }
            },
            course: {
                startValidity: '',
                validityPeriod: '',
                rule: '',
                isReset: ''
            },
            courseRules: {
                startValidity: { required: true, message: '请输入回看开始时间' },
                isReset: { required: true, message: '请选择是否重置全部小节' }
            },
            section: {
                sectionId: '',
                startValidity: '',
                validityPeriod: ''
            },
            sectionRules: {
                startValidity: { required: true, message: '请输入回看开始时间' }
            }
        };
    },
    activated() {
        this.init();
    },
    mounted() {},
    methods: {
        init() {
            if (this.$store.getters.isEnterprise) {
                this.search.enterpriseId = this.$store.state.userInfo.enterpriseId;
            }
            this.getEnterpriseList();
            this.getTableData();
            this.filterTableColumns('所属企业/个人');
        },
        filterTableColumns(arr) {
            if (this.$store.getters.isEnterprise || this.$store.getters.isUser) {
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
        },
        searchTableData() {
            this.search.pageNum = 1;
            this.getTableData();
        },
        getTableData() {
            if (!this.search.courseId) {
                this.search.courseId = 0;
            }
            this.$fetch({
                url: '/system-backend/lookBack/courseListInfo',
                data: this.search
            }).then((res) => {
                this.table.data = res.sectionList.list;
                this.table.total = res.sectionList.total;
                this.title.courseName = res.courseName;
                this.title.enterpriseName = res.enterpriseName;
                this.title.time = res.time;
                this.title.courseId = res.courseId;
                this.count = res.sectionList.pages;
            });
        },
        changeEnterprise() {
            this.search.courseId = 0;
            this.getCourseName();
        },
        globalSetting() {
            this.$refs.globalRules.validate((valid) => {
                if (valid) {
                    this.isWarring = true;
                }
            });
        },
        globalSettingSubmit() {
            let params = this.$tools.cloneObj(this.global);
            params.validityPeriod = params.validityPeriod == '' ? -1 : params.validityPeriod;
            this.$fetch({
                url: '/system-backend/lookBack/setting',
                data: params
            }).then((res) => {
                if (res.code == 200) {
                    this.$Message.success(res.msg);
                    this.$refs.globalRules.resetFields();
                    this.isGlobal = false;
                    this.isWarring = false;
                    this.getTableData();
                } else {
                    this.$Message.error(res.msg);
                }
            });
        },
        courseSetting() {
            this.$refs.courseRules.validate((valid) => {
                if (valid) {
                    this.isWarring2 = true;
                }
            });
        },
        courseSettingSubmit() {
            let params = this.$tools.cloneObj(this.course);
            params.validityPeriod = params.validityPeriod == '' ? -1 : params.validityPeriod;
            params.courseId = this.title.courseId;
            this.$fetch({
                url: '/system-backend/lookBack/courseSetting',
                data: params
            }).then((res) => {
                if (res.code == 200) {
                    this.$Message.success(res.msg);
                    this.isCurriculum = false;
                    this.isWarring2 = false;
                    this.$refs.courseRules.resetFields();
                    this.getTableData();
                } else {
                    this.$Message.error(res.msg);
                }
            });
        },
        sectionSetting() {
            this.$refs.section.validate((valid) => {
                if (valid) {
                    let params = this.$tools.cloneObj(this.section);
                    if (params.validityPeriod == '' || params.validityPeriod == null) {
                        params.validityPeriod = '-1';
                    }
                    params.sectionId = this.table.selected.sectionId;
                    this.$fetch({
                        url: '/system-backend/lookBack/sectionSetting',
                        data: params
                    }).then((res) => {
                        if (res.code == 200) {
                            this.$Message.success(res.msg);
                            this.isSection = false;
                            this.$refs.section.resetFields();
                            this.getTableData();
                        } else {
                            this.$Message.error(res.msg);
                        }
                    });
                }
            });
        },
        getEnterpriseList() {
            if (!this.$store.getters.isAdmins) {
                return false;
            }
            this.$fetch({
                url: '/system-backend/lookBack/getEnterprise'
            }).then((res) => {
                this.enterpriseList = res.obj;
                this.enterpriseList.unshift(this.ALLSelect.enterprise);
            });
        },
        getCourseName(query) {
            if (query !== '') {
                let parame = {
                    operatorId: this.$store.state.userInfo.userId,
                    courseName: query,
                    userType: this.search.userType,
                    enterpriseId: this.search.enterpriseId
                };

                this.loading1 = true;
                this.$fetch({
                    url: '/system-backend/lookBack/getCourseName',
                    data: parame
                }).then((res) => {
                    this.loading1 = false;
                    this.courseList = res.obj;
                });
            } else {
                this.options1 = [];
            }
        },
        goPersonal() {
            this.$router.push({
                path: '/look-back/setting/personal-settings/' + this.title.courseId
            });
        },
        changePage(index) {
            this.search.pageNum = index;
            this.getTableData();
        },
        isGlobalShow() {
            this.isGlobal = true;
            let params = {
                courseId: 0,
                sectionId: '-1',
                userId: this.$store.state.userInfo.userId,
                type: 0
            };
            this.getSettingInfo(params, (res) => {
                this.global.startValidity = res.obj.startValidity;
                this.global.validityPeriod = res.obj.validPeriod == '-1' ? '' : res.obj.validPeriod;
                this.global.rule = res.obj.rule;
                console.log(this.global, res);
            });
        },
        isCurriculumShow() {
            this.isCurriculum = true;
            let params = {
                courseId: this.search.courseId,
                sectionId: '-1',
                userId: this.$store.state.userInfo.userId,
                type: 1
            };
            this.getSettingInfo(params, (res) => {
                this.course.startValidity = res.obj.startValidity;
                this.course.validityPeriod = res.obj.validPeriod == '-1' ? '' : res.obj.validPeriod;
                this.course.rule = res.obj.rule;
            });
        },
        getSettingInfo(params, cb) {
            this.$fetch({
                url: '/system-backend/lookBack/settingInfo',
                data: params
            }).then((res) => {
                cb && cb(res);
            });
        }
    }
};
</script>

<style scoped lang="stylus">
    .search-box
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

    .warring
        line-height: 16px;
        color: red;
        font-weight: bold;
        margin: 0;

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

    .dialog
        .refund
            p
                margin-bottom: 25px;
                span
                    color: #4690da;
</style>
