<template>
    <div class="courseSummary edit-new">
        <header>
            <router-link class="icon-box" tag="div" to="/courseManagement/review">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-left"></use>
                </svg>
            </router-link>
            <div class="title">
                审核课程
            </div>
        </header>
        <div class="wrapper clearfix">
            <div class="title">
                <Steps size="small" :current="1">
                    <Step title="课程基本信息" content=""></Step>
                    <Step title="课程小节" content=""></Step>
                    <Step title="课程介绍" content=""></Step>
                    <Step title="教师介绍" content=""></Step>

                </Steps>

            </div>
            <div class="clearfix">
                <ul class="list-box">
                    <li>
                        <span>节数</span>
                        <span style="flex:2">小节名称</span>
                        <span>备注</span>
                        <span>上课时间</span>
                        <span>主讲老师</span>
                        <span>内容类型</span>
                        <span>文件数</span>
                        <span>操作</span>
                    </li>
                    <template v-for="(item,index) in sectionList">
                        <li v-if="item.show" class="class-item">
                            <span>{{index+1}}</span>
                            <span :title="item.sectionName" style="flex:2">{{item.sectionName}}</span>
                            <span :title="item.sectionRemarks">{{item.sectionRemarks}}</span>
                            <span :title="item.startTime">{{item.startTime}}</span>
                            <span :title="item.lecturerName">{{item.lecturerName}}</span>
                            <span>{{item.sectionType | filterType}}</span>
                            <span>{{item.courseSectionFile?  item.courseSectionFile.length :item.courseSectionFile }}</span>
                            <span>
                            <Icon @click="editSection(item,index)" style="margin-right:20px;" class="pointer" size="22"
                                  color="#1cbda3" type="md-create"/>
                            <Icon @click="deleteSection(index)" class="pointer" size="22" color="#d41e3c"
                                  type="md-close"/></span>
                        </li>
                        <div class="box" v-show="item.edit">
                            <Form class="from" :ref="`sectionItem${index}`" :model="sectionItem" :rules="ruleValidate"
                                  :label-width="100"
                            >
                                <FormItem label="标题(必填)" prop="sectionName">
                                    <Input style="width: 400px;" v-model="sectionItem.sectionName"
                                           placeholder=""></Input>
                                </FormItem>
                                <FormItem label="备注" prop="sectionRemarks">
                                    <Input style="width: 400px;" v-model="sectionItem.sectionRemarks"
                                           placeholder=""></Input>
                                </FormItem>
                                <FormItem label="主讲老师(必填)" prop="lecturerName">
                                    <Input style="width: 400px;" v-model="sectionItem.lecturerName"></Input>
                                </FormItem>
                                <FormItem label=" 内容类型(必选)" prop="sectionType">
                                    <Select v-model="sectionItem.sectionType" style="width:200px"
                                            @on-change="changeSectionTyep">
                                        <Option v-for="item in sectionType" :value="item.value" :key="item.value">{{
                                            item.label}}
                                        </Option>
                                    </Select>
                                </FormItem>
                                <template>

                                    <FormItem v-if="sectionItem.sectionType==0 && sectionItem.sectionType!=='' "
                                              label=" 上课日期(必选)" prop="classDate">
                                        <DatePicker @on-change="selectDate" :value="sectionItem.classDate" type="date"
                                                    placeholder="选择日期"
                                                    style="width: 200px"></DatePicker>

                                    </FormItem>
                                    <FormItem v-if="sectionItem.sectionType==0 && sectionItem.sectionType!=='' "
                                              label=" 上课时间(必选)" prop="classStartTime">
                                        <TimePicker @on-change="selectStartTime" :value="sectionItem.classStartTime"
                                                    format="HH:mm"
                                                    placeholder="选择上课时间" style="width: 200px"></TimePicker>


                                    </FormItem>
                                    <FormItem v-if="sectionItem.sectionType==0 && sectionItem.sectionType!=='' "
                                              label=" 下课时间(必选)" prop="classEndTime">
                                        <TimePicker @on-change="selectEndTime" :value="sectionItem.classEndTime"
                                                    format="HH:mm"
                                                    placeholder="选择下课时间" style="width: 200px"></TimePicker>

                                    </FormItem>
                                </template>
                                <FormItem :label="courseRequired" prop="vCode"
                                          v-if="sectionItem.sectionType!==''  && sectionItem.sectionType!== undefined">
                                    <div>
                                        <div class="upload-box">
                                            <Button :disabled="!!sectionItem.courseSectionFile[0]"
                                                    v-show="sectionItem.sectionType=='1' " class="white-blue"
                                                    @click="isVideoList = true">选择视频
                                            </Button>
                                            <Upload :show-upload-list="false"
                                                    action="/system-backend/courseBack/addResource"
                                                    :data="uploadData"
                                                    :before-upload="uploadBefore"
                                                    :on-success="uploadSuccess"
                                                    :on-progress="uploadProgress">
                                                <Button :disabled="fileDisabled()" class="white-blue">上传文件</Button>
                                            </Upload>
                                        </div>

                                        <div class="file-box" v-if="sectionItem.courseSectionFile[0]">

                                            <div>
                                                <span :title="sectionItem.courseSectionFile[0].fileName">
                                                {{sectionItem.courseSectionFile[0].fileName}}
                                                </span>
                                                <Icon size="15" class="icon-close" @click="removeCourseSectionFile(0)"
                                                      color="#f00" type="md-close-circle"/>
                                            </div>


                                        </div>
                                        <div class="file-box" v-if="sectionItem.courseSectionFile[1]">
                                            <div>
                                                 <span :title="sectionItem.courseSectionFile[1].fileName">

                                                {{sectionItem.courseSectionFile[1].fileName}}
                                                </span>
                                                <Icon size="15" class="icon-close" @click="removeCourseSectionFile(1)"
                                                      color="#f00" type="md-close-circle"/>
                                            </div>
                                        </div>
                                        <p v-show="fileFlag">上传中...</p>
                                    </div>

                                </FormItem>
                                <div class="btn">
                                    <Button class="white-blue" @click="removeSection(index)" type="primary">取消</Button>
                                    <Button @click="updateSection(`sectionItem${index}`)" type="primary">确定</Button>
                                </div>
                            </Form>
                        </div>
                    </template>
                </ul>
                <Button class="add-item" :disabled="isEdit" @click="addSection">
                    <Icon type="md-add"/>
                    添加小节
                </Button>
            </div>
            <div class="btn-box fl">
                <Button class="btn fr" type="primary" @click="next">下一步</Button>
                <Button class="btn fr" @click="$router.back()" type="primary">上一步</Button>
            </div>
        </div>
        <MyDialog class-name="add-user" :title="'删除'" :visible.sync="addUser">
            <div style="">
                确定要删除该课节?
            </div>
        </MyDialog>
        <MyDialog width="380" class-name="select-list" @ok="setVideo" :title="'选择分组'" :visible.sync="isVideoList">
            <div style="text-align: left">
                <h4>分组</h4>
                <div class="check-box">
                    <span class="no-data" v-if="videoList.length ==0">视频库无内容，请上传视频！</span>

                    <RadioGroup v-else v-model="video">
                        <Radio v-for="(item,index) in videoList" :key="index" :label="item">{{item.videoName}}</Radio>
                    </RadioGroup>
                </div>
            </div>
        </MyDialog>
        {{sectionItem.sectionType}}
    </div>

</template>

<script>
import { storage } from '../../../../../common/js/qylh';

export default {
    name: 'addCourse',
    computed: {},
    filters: {
        filterType(val) {
            return val == 1 ? '非直播' : '直播';
        }
    },
    data() {
        return {
            courseRequired: '选择文件',
            status: '新建',
            fileIndex: null,
            uploadData: {
                originalName: ''
            },
            video: {},
            courseMsg: storage.get('courseMsg'),
            videoList: [],
            isEdit: false,
            isVideoList: false,
            sectionType: [{ value: '0', label: '直播' }, { value: '1', label: '非直播' }],
            sectionIndex: 0,
            sectionItem: {
                courseSectionFile: [],
                classDate: '',
                classStartTime: '',
                classEndTime: '',
                endTime: '', // 结束时间
                sectionName: '', // 小节名字
                sectionRemarks: '', // 小节备注
                sectionType: '', // 小节类型
                startTime: '', // 开始时间
                lecturerName: '' // 主讲教师名
            },
            sectionList: [],
            addUser: false,
            ruleValidate: {
                sectionName: { required: true, message: '请输入标题' },
                lecturerName: { required: true, message: '请输入上课老师' },
                sectionType: { required: true, message: '请选择课程类型' },
                classDate: { required: true, message: '请选择上课日期' },
                classStartTime: { required: true, message: '请选择上课时间' },
                classEndTime: { required: true, message: '请选择下课时间' }
            }
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.getVideoList();
            let obj = storage.get('sectionList');
            if (obj) {
                this.status = '编辑';
                this.sectionList = obj.map((item) => {
                    item.show = true;
                    item.eidt = false;
                    if (item.startTime) {
                        item.classDate = item.startTime.substring(0, 10);
                        item.classStartTime = item.startTime.substring(10);
                        item.classEndTime = item.endTime.substring(10);
                    }

                    return item;
                });
            }
            if (this.sectionList.length == 0) {
                this.addSection();
            }
        },
        fileDisabled() {
            let lenth = this.sectionItem.courseSectionFile.length;
            if (this.sectionItem.sectionType === '0') {
                return lenth == 2;
            } else {
                return !!this.sectionItem.courseSectionFile[1];
            }
        },
        getVideoList() {
            this.$fetch({
                url: '/system-backend/courseBack/selectVideoList',
                data: {
                    userId: this.$store.state.userInfo.userId
                }
            }).then((res) => {
                this.videoList = res.obj;
            });
        },
        removeSection(index) {
            this.isEdit = false;
            this.sectionList[index].edit = false;
        },
        editSection(item, index) {
            this.sectionList.forEach((item) => (item.edit = false));
            item.edit = true;
            this.isEdit = true;
            this.sectionItem = this.$tools.cloneObj(item);
            this.sectionIndex = index;
        },
        deleteSection(index) {
            this.sectionList.splice(index, 1);
            if (this.sectionList.length) {
            }
            this.$nextTick(() => {
                if (this.sectionList.length == 0) {
                    this.sectionList.push({
                        edit: true
                    });
                }
            });
        },
        updateSection(name) {
            this.$refs[name][0].validate((valid) => {
                if (valid) {
                    if (this.sectionItem.sectionType == 1 && this.sectionItem.courseSectionFile.length == 0) {
                        this.$Message.error('请上传文件');
                        return false;
                    }

                    this.isEdit = false;
                    let index = this.sectionIndex;
                    this.sectionItem.edit = false;
                    this.sectionItem.show = true;
                    this.sectionItem.startTime = `${this.sectionItem.classDate} ${
                        this.sectionItem.classStartTime
                    }`.replace(/^\s+$/, '');
                    this.sectionItem.endTime = `${this.sectionItem.classDate} ${this.sectionItem.classEndTime}`.replace(
                        /^\s+$/,
                        ''
                    );
                    this.sectionItem.courseSectionFile = this.sectionItem.courseSectionFile.filter((itme) => itme);
                    let params = this.$tools.cloneObj(this.sectionItem);
                    if (params.sectionType == 1) {
                        delete params.startTime;
                        delete params.endTime;
                    }
                    this.sectionList.splice(index, 1, params);
                }
            });
        },
        initSectionItem() {
            this.sectionItem = {
                courseSectionFile: [],
                classDate: '',
                classStartTime: '',
                classEndTime: '',
                endTime: '', // 结束时间
                sectionName: '', // 小节名字
                sectionRemarks: '', // 小节备注
                sectionType: '', // 小节类型
                startTime: '', // 开始时间
                lecturerName: '' // 主讲教师名
            };
        },
        addSection() {
            this.isEdit = true;
            if (this.sectionList.length == 0 || !this.sectionList[this.sectionList.length - 1].edit) {
                this.sectionList.push({
                    edit: true,
                    show: false
                });
                this.initSectionItem();
            }
            this.sectionIndex = this.sectionList.length - 1;
        },
        /**
         * 删除上传
         * @param index
         */
        removeCourseSectionFile(index) {
            this.fileIndex = index;
            this.$set(this.sectionItem.courseSectionFile, index, '');
            // this.sectionItem.courseSectionFile.splice(index, 1);
        },
        uploadSuccess(response, file, filelist) {
            this.fileFlag = false;
            if (response.code == 200) {
                if (this.sectionItem.sectionType == 0) {
                    if (this.sectionItem.courseSectionFile.length < 2) {
                        this.sectionItem.courseSectionFile.push(response.obj);
                    }
                } else if (this.sectionItem.sectionType == 1) {
                    let arr = this.sectionItem.courseSectionFile;
                    arr[1] = response.obj;
                    this.$set(this.sectionItem.courseSectionFile, 1, response.obj);
                }
            }
        },
        uploadBefore(response, file, fileList) {
            this.uploadData.originalName = this.$tools.filterFileNmae(response.name);
        },
        uploadProgress(response, file, fileList) {
            this.fileFlag = true;
        },
        changeSectionTyep(val) {
            this.sectionItem.courseSectionFile = [];
            if (val == 1) {
                this.courseRequired = '选择文件(必填)';
            } else {
                this.courseRequired = '选择文件';
            }
        },
        setVideo() {
            let obj = {
                fileName: this.video.videoName,
                fileUrl: this.video.videoUrl,
                yunfileId: this.video.fileId,
                originalName: this.video.videoName
            };
            let arr = this.sectionItem.courseSectionFile;
            arr[0] = obj;
            arr = this.$tools.cloneObj(arr);

            this.isVideoList = false;
        },
        selectDate(date) {
            this.sectionItem.classDate = date || '';
        },
        selectStartTime(date) {
            this.sectionItem.classStartTime = date || '';
        },
        selectEndTime(date) {
            this.sectionItem.classEndTime = date || '';
        },
        setData() {
            let sectionList = this.sectionList.map((item) => {
                if (item.startTime == '') {
                    delete item.startTime;
                }
                if (item.endTime == '') {
                    delete item.endTime;
                }
                return item;
            });
            let data = sectionList[sectionList.length - 1];
            if (Object.keys(data).length == 2) {
                sectionList.pop();
            }
            return sectionList;
        },
        save(data) {
            storage.set('sectionList', data);
        },
        // 保存草稿
        saveDraft() {
            this.courseMsg.courseStatus = '0';
            let data = this.setData();
            this.save(data);
            if (this.$route.query.id) {
                this.$fetch({
                    url: '/system-backend/courseBack/updateCourse',
                    data: {
                        courseId: this.$route.query.id,
                        sectionList: JSON.stringify(storage.get('sectionList')) || [],
                        courseMsg: JSON.stringify(this.courseMsg),
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
                        courseMsg: JSON.stringify(this.courseMsg),
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
        },
        next() {
            let data = this.setData();
            if (data.length == 0) {
                this.$Message.error('请填写小节信息');
                return false;
            }
            this.save(data);

            this.$router.push({
                path: '/courseManagement/review/courseIntroduction',
                query: {
                    id: this.$route.query.id
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

        .btn-box
            width: 100%;
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #e6e8ee;

            .btn
                width: 115px;
                margin-right: 20px;

        .list-box
            margin: 20px 20px;

            li
                display: flex;
                height: 35px;
                line-height: 35px;
                flex-wrap: nowrap
                justify-content: space-around
                border-bottom: 1px solid #e6e8ee;

                span
                    text-align: center;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    flex: 1;

        .box
            padding: 15px 0;
            background-color: #fafafa;

        .from
            width: 480px;
            margin: 0 auto;

            .ivu-form-item
                margin-bottom: 15px;

            .upload-box
                margin-bottom: 10px;

            .file-box
                display: block;
                position: relative;
                height: 20px;

                text-decoration: underline;

                div
                    display: inline-block;
                    position: relative;
                span
                    display: inline-block;
                    max-width: 300px;
                    line-height: 20px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;

                .icon-close
                    position: absolute;
                    right: -20px;
                    top: 3px;
                    z-index: 999;
                    cursor: pointer;
                    margin-left: 10px;

            .btn
                button
                    margin-right 25px;
                    width: 78px;

                    &:first-child
                        margin-left: 120px;

        .ivu-upload
            display: inline-block

        .add-item
            width: 90px;
            text-align: center;
            margin-left: 20px;
            cursor: pointer;
            color: #117dd6

            &[disabled]
                color: #c5c8ce

            .ivu-icon

                margin-top: -2px;

    .select-list
        h4
            margin-bottom: 5px;

        .check-box
            height: 300px;
            overflow: auto;
            border: 1px solid #E6E8EE;
            .no-data
                color:red;
                font-size:14px;
                position: absolute;
                left:50%;
                top:50%;
                transform:translate(-50% ,-50%);
        .ivu-radio-group
            display: block

        .ivu-radio-wrapper
            display: block
            height: 45px;
            line-height: 45px;
            border-bottom: 1px solid #E6E8EE;

        .ivu-radio
            margin: 0 10px;
</style>
<style lang="stylus">
    .select-list
        h4
            margin-bottom: 5px;

        .check-box
            height: 300px;
            overflow: auto;
            border: 1px solid #E6E8EE;

        .ivu-radio-group
            display: block

        .ivu-radio-wrapper
            display: block
            height: 45px;
            line-height: 45px;
            border-bottom: 1px solid #E6E8EE;

        .ivu-radio
            margin: 0 10px;
</style>
