<template>
    <div class="addTest edit-new">
        <header>
            <div class="icon-box" @click="$router.back()">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-left"></use>
                </svg>
            </div>
            <div class="title">
                {{status}}考试
            </div>
        </header>
        <div class="wrapper clearfix">
            <div class="left fl">
                <div class="title">
                    <Steps size="small" :current="0">
                        <Step title="填写考试信息" content=""></Step>
                        <Step title="设置答题卡" content=""></Step>
                    </Steps>
                </div>
                <div class="from-box">
                    <Form class="from" ref="examData" :model="examData" :rules="ruleValidate" :label-width="180"
                          label-position="left">
                        <FormItem label="考试名称(必填)" prop="examPaperName">
                            <Input v-model="examData.examPaperName" style="width:200px" placeholder=""></Input>
                        </FormItem>
                        <FormItem label="备注" prop="examRemarks">
                            <Input v-model="examData.examRemarks" style="width:200px" placeholder=""></Input>
                        </FormItem>
                        <FormItem v-if="$store.getters.isAdmins" label="按认证账号筛课" prop="phone">
                            <Select
                                v-model="examData.phone"
                                filterable
                                :loading="loading1"
                                @on-change="getCourseList"
                                placeholder="输入手机号"
                                style="width:200px">
                                <Option  v-for="(option, index) in accountList" :value="option" :key="index" >{{option.userAccount}}  </Option>
                            </Select>
                        </FormItem>
                        <FormItem label="所属课程(必填)" prop="courseId">
                            <Select v-model="examData.courseId" style="width:200px" placeholder="请选择课程名称">
                                <Option v-for="item in courseList" :value="item.courseId" :key="item.courseId">{{
                                    item.courseName }}
                                </Option>
                            </Select></FormItem>
                        <FormItem label="考试日期(必填)" prop="examDate">
                            <DatePicker type="date" :value="examData.examDate2" @on-change="changeDate" placeholder=""
                                        style="width: 200px"></DatePicker>
                        </FormItem>
                        <FormItem label="开始时间(必填)" prop="startTime2">
                            <TimePicker format="HH:mm" :value="examData.startTime3" @on-change="setStartTime"
                                        placeholder="" style="width: 112px"></TimePicker>
                        </FormItem>
                        <FormItem label="结束时间(必填)" prop="endTime2">
                            <TimePicker format="HH:mm" :value="examData.endTime3" @on-change="setEndTime" placeholder=""
                                        style="width: 112px"></TimePicker>
                        </FormItem>
                        <FormItem label='上传试卷文件(必填)' prop="examPaperYunFileId">
                            <Upload :show-upload-list="false"
                                    :max-size="fileSize"
                                    :data="uploadData"
                                    :before-upload="uploadBefore"
                                    :on-success="uploadSuccess"
                                    accept=".doc,.docx,.xls,.xlsx,.pdf,.txt,.png,.jpg,.ppt,.pptx,.jpeg"
                                    :on-progress="uploadProgress"
                                    :on-exceeded-size="handleMaxSize"

                                    action="/system-backend/courseBack/addResource">
                                <Button class="white-blue">上传文件</Button>
                            </Upload>
                            <p>文件格式为doc/pdf/ppt/xls/txt/png/jpg大小不超过10M.</p>
                            <p v-show="examData.examPaperYunFileId =='' && fileFlag "> 上传中...</p>
                            <div class="file" v-show="examData.examPaperYunFileId !==''">
                                <a target="_blank" :href="file.url">{{ file.name}}</a>
                                <Icon size="15" @click="closeFile" class="icon-close pointer" color="#f00"
                                      type="md-close-circle"/>
                                <Input v-model="examData.examPaperYunFileId" style="visibility:hidden;width:200px"
                                       placeholder=""></Input>
                            </div>
                        </FormItem>
                        <FormItem label="总分(必填)" prop="totalAcore">
                            <Input v-model="examData.totalAcore" style="width:200px" placeholder=""></Input> 分
                        </FormItem>
                        <FormItem label="优秀分数线(必填)" prop="goodScore">
                            <Input v-model="examData.goodScore" style="width:200px" placeholder=""></Input> 分
                        </FormItem>
                        <FormItem label="及格分数线(必填)" prop="passingScore">
                            <Input v-model="examData.passingScore" style="width:200px" placeholder=""></Input> 分
                        </FormItem>
                    </Form>
                </div>
            </div>

            <div class="btn-box fl">
                <Button class="btn fr" @click="next" type="primary">下一步</Button>
            </div>
        </div>
    </div>

</template>

<script>
import { storage } from '../../../../../common/js/qylh';

export default {
    name: 'addAdmin',
    data() {
        let edit = storage.get('examDataEdit') == 'true';
        return {
            loading1: false,
            accountList: [],
            status: '新建',
            edit: edit,
            uploadData: {
                originalName: ''
            },
            file: {
                url: '',
                name: ''
            },
            courseList: [],
            examData: {
                userId: this.$store.state.userInfo.userId,
                examPaperName: '',
                examRemarks: '',
                courseId: '',
                examDate: '',
                examDate2: '',
                startTime: '',
                startTime2: '',
                startTime3: '',
                endTime: '',
                endTime2: '',
                endTime3: '',
                examPaperYunFileId: '',
                totalAcore: '',
                goodScore: '',
                passingScore: ''
                // monomialChoiceNum: 10,
                // multitermChoiceNum: 10,
                // judgeNum: 10,
                // monomialChoiceScore: 2,
                // multitermChoiceScore: 4,
                // judgeScore: 2,
                // questions:
                //     '[{"rightAnswer":"A","questionType":"1","knowledge":"1|2"},{"rightAnswer":"0","questionType":"2","knowledge":"1"},{"rightAnswer":"C|D","questionType":"3","knowledge":"2"}]'
            },
            ruleValidate: {
                examPaperName: {
                    required: true,
                    message: '请输入考试名称'
                },
                examDate: {
                    required: true,
                    message: '请选择日期'
                },
                startTime2: {
                    required: true,
                    message: '请选择开始时间'
                },
                endTime2: {
                    required: true,
                    message: '请选择结束时间'
                },
                courseId: {
                    required: true,
                    message: '请选择课程'
                },
                examPaperYunFileId: {
                    required: true,
                    validator(rule, value, callback) {
                        if (value === '') {
                            callback(['请上传试卷']);
                        } else {
                            callback();
                        }
                    }
                },
                totalAcore: {
                    required: true,
                    message: '请输入总分数'
                },
                goodScore: {
                    required: true,
                    message: '请输入优秀分数线'
                },
                passingScore: {
                    required: true,
                    message: '请输入及格分数线'
                }
            },
            imgSrc: ''
        };
    },
    beforeMount() {
        if (!this.$store.getters.isAdmins) {
            this.examData.phone = this.$store.state.userInfo.userAccount;
            this.getCourseList();
        } else {
            this.$fetch({
                url: '/system-backend/examBack/selectAdminAndAuthList'
            }).then((res) => {
                this.accountList = res.obj;
            });
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.initData();
        },
        initData() {
            if (this.edit) {
                this.status = '编辑';
                this.$fetch({
                    url: '/system-backend/examBack/selectExamMsg',
                    data: {
                        examPaperId: this.$route.query.id
                    }
                }).then((res) => {
                    if (res.code == 200) {
                        storage.set('examData', res.obj);
                        this.examData = res.obj;
                        this.file.name = this.examData.originalName;
                        this.file.url = this.examData.fileUrl;
                        this.examData.examDate2 = new Date(this.examData.startTimeVo);
                        this.examData.examDate = this.examData.startTimeVo.substring(0, 10);
                        this.examData.startTime3 = new Date(this.examData.startTimeVo);
                        this.examData.startTime2 = this.examData.startTimeVo.substring(11);
                        this.examData.endTime3 = new Date(this.examData.endTimeVo);
                        this.examData.endTime2 = this.examData.endTimeVo.substring(11);
                        this.courseList.push({
                            courseId: this.examData.courseId,
                            courseName: this.examData.courseName
                        });
                    } else {
                        this.$Message.error(res.msg);
                    }
                });
            }
        },
        changeDate(date, type) {
            this.examData.examDate = date;
        },
        setStartTime(date) {
            this.examData.startTime2 = date;
        },
        setEndTime(date) {
            this.examData.endTime2 = date;
        },
        getCourseList(item) {
            if (!this.examData.phone) {
                return false;
            }
            let enterpriseId = this.$store.state.userInfo.enterpriseId;
            let userId2 = null;
            if (!!item) {
                enterpriseId = item.enterpriseId;
                userId2 = item.userId
            }
            this.$fetch({
                url: '/system-backend/examBack/selectCourseListByAccount',
                data: {
                    enterpriseId: enterpriseId,
                    userId: this.$store.state.userInfo.userId,
                    userId2: userId2
                }
            }).then((res) => {
                if (res.code == 200) {
                    this.examData.courseId = '';
                    this.courseList = res.obj;
                } else {
                    this.$Message.error(res.msg);
                }
            });
        },
        next() {
            this.$refs.examData.validate((valid) => {
                if (valid) {
                    storage.set('examData', this.examData);
                    this.$router.push({
                        path: '/courseManagement/examination/answerSheet'
                    });
                }
            });
        },
        uploadSuccess(response, file, filelist) {
            this.fileFlag = file;
            if (response.code == 200) {
                this.$Message.success(response.msg);
                this.imgSrc = response.srcElement;
                this.examData.examPaperYunFileId = response.obj.yunfileId;
                this.file.name = response.obj.originalName;
                this.file.url = response.obj.fileUrl;
            } else {
                this.$Message.error(response.msg);
            }
        },
        uploadBefore(response, file, fileList) {
            this.uploadData.originalName =this.$tools.filterFileNmae(response.name)
        },
        uploadProgress(response, file, fileList) {
            this.fileFlag = true;
        },
        handleMaxSize(file) {
            this.$Notice.warning({
                title: '超过文件大小限制',
                desc: '文件  ' + file.name + ' 太大，不超过10M.'
            });
        },
        closeFile() {
            this.examData.examPaperYunFileId = '';
            this.fileFlag = false;
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

        .left
            width: 100%;
            margin-right: 50px;

            .title
                padding-bottom: 15px;
                border-bottom: 1px solid #e6e8ee;

            .from-box
                width: 500px;

        .from
            margin-top: 20px;
            margin-left: 10px;
            margin-right: 10px;

            .ivu-input-wrapper
                width: 250px;

            .img-box
                position: relative;
                width: 100px;
                height: 135px;
                border: 1px solid #e7e9ef;

                .icon-close
                    position: absolute;
                    top: 0;
                    right: 0;
                    transform: translate(50%, -50%);
                    cursor: pointer;

        .btn-box
            width: 100%;
            margin-top: 15px;
            padding-top: 10px;
            border-top: 1px solid #e6e8ee;

            .btn
                width: 115px;

    .ivu-form-item
        margin-bottom: 20px;

    .file
        a
            text-underline: none;
            border-bottom: 1px solid #000;
</style>
<style lang="stylus">
    .addTest
        .tree
            > ul
                padding: 5px 0;
                padding-left: 15px;
                border-bottom: 1px solid #e7e9ee;
</style>
