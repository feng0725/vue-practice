<template>
    <div class="answerSheet edit-new">
        <header>
            <router-link class="icon-box" tag="div" to="/courseManagement/examination">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-left"></use>
                </svg>
            </router-link>
            <div class="title">
                {{status}}考试
            </div>
        </header>
        <div class="wrapper clearfix">
            <div class="left fl">
                <div class="title">
                    <Steps size="small" :current="1">
                        <Step title="填写考试信息" content=""></Step>
                        <Step title="设置答题卡" content=""></Step>
                    </Steps>
                </div>
                <div class="content-wrapper">
                    <div class="btn-title">
                        <Button :disabled="monomialChoice.disabled" @click="monomialChoice.disabled=true"
                                class="btn white-blue">单选题
                        </Button>
                        <Button :disabled="multitermChoice.disabled" @click="multitermChoice.disabled=true"
                                class="btn white-blue">多选题
                        </Button>
                        <Button :disabled="judge.disabled" @click="judge.disabled=true" class="btn white-blue">判断题
                        </Button>
                    </div>
                    <div>
                        <div v-show="monomialChoice.disabled">
                            <div class="topic">
                                <span> 单选题(必填)</span>
                                <Input @on-blur="setTopicList(monomialChoice)" v-model="monomialChoice.questionsNumbe" placeholder="输入题目数"  style=""/>
                                <span>道</span>
                                <span>,</span>
                                <span>每题</span>
                                <Input v-model="monomialChoice.score" placeholder="输入分值" style=""/>
                                <span>分</span>
                                <Icon size="15"   @click="isDeleteTopic('monomialChoice')"  class="icon-close pointer" color="#f00" type="md-close-circle"/>
                            </div>
                            <div  v-show="monomialChoice.list!=0" class="topic-list">
                                <p>
                                    <span>单选题正确答案、知识点</span>
                                    <span>默认四个选项A/B/C/D，知识点非必填</span>
                                </p>
                                <ul class="clearfix">
                                    <li class="" v-for="(item,index) in monomialChoice.list">
                                        <div>
                                            <span class="number">{{index+1}}.</span>
                                            <Select v-model="item.rightAnswer" style="width:150px">
                                                <Option v-for="option in monomialChoice.rightAnswerList" :value="option"
                                                        :key="option">{{ option }}
                                                </Option>
                                            </Select></div>
                                        <div>
                                            <Select
                                                style="width: 150px"
                                                placeholder="输入知识点"
                                                v-model="item.knowledge"
                                                filterable
                                                clearable
                                                remote
                                                @on-query-change="remoteMethod1"
                                                :loading="loading">
                                                <Option v-for="(option, index) in searchKnowList" :value="option.knowId" :key="index">{{option.knowName}}</Option>
                                            </Select>
                                            <Icon @click="adkKnowLedge(item.knowledgeList,item.knowledge,searchKnowList)" class="pointer" size="18" color="#3ac5ae" type="md-add"/>
                                        </div>
                                        <div>
                                            <Tag v-for="(tag,tagIndex) in item.knowledgeList"   :key="tag.knowId" @on-close="removeKnowLedge(item.knowledgeList,tagIndex)" closable>{{tag.knowName}}</Tag>
                                        </div>

                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div v-show="multitermChoice.disabled">
                            <div class="topic">
                                <span> 多选题(必填)</span>
                                <Input @on-blur="setTopicList(multitermChoice)" v-model="multitermChoice.questionsNumbe" placeholder="输入题目数" style=""/>
                                <span>道</span>
                                <span>,</span>
                                <span>每题</span>
                                <Input v-model="multitermChoice.score" placeholder="输入分值" style=""/>
                                <span>分</span>
                                <Icon size="15" @click="isDeleteTopic('multitermChoice')"  class="icon-close pointer" color="#f00" type="md-close-circle"/>
                            </div>
                            <div  v-show="multitermChoice.list!=0" class="topic-list">
                                <p>
                                    <span>多选题正确答案、知识点</span>
                                    <span>默认五个选项A/B/C/D/E，知识点非必填</span>
                                </p>
                                <ul class="clearfix">
                                    <li class="" v-for="(item,index) in multitermChoice.list">
                                        <div>
                                            <span class="number">{{index+1}}.</span>
                                            <Select  v-model="item.rightAnswer" multiple style="width:150px">
                                                <Option v-for="option in multitermChoice.rightAnswerList" :value="option"
                                                        :key="option">{{ option }}
                                                </Option>
                                            </Select>
                                        </div>
                                        <div>
                                            <Select
                                                style="width: 150px"
                                                placeholder="输入知识点"
                                                v-model="item.knowledge"
                                                filterable
                                                clearable
                                                remote
                                                @on-query-change="remoteMethod1"
                                                :loading="loading">
                                                <Option v-for="(option, index) in searchKnowList"  :value="option.knowId"  :key="index">{{option.knowName}}</Option>
                                            </Select>                                            <Icon @click="adkKnowLedge(item.knowledgeList,item.knowledge,searchKnowList)" class="pointer" size="18" color="#3ac5ae" type="md-add"/>
                                        </div>
                                        <div>
                                            <Tag v-for="(tag,tagIndex) in item.knowledgeList"  :key="tag.knowId" @on-close="removeKnowLedge(item.knowledgeList,tagIndex)" closable>{{tag.knowName}}</Tag>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div v-show="judge.disabled">
                            <div class="topic">
                                <span> 判断题(必填)</span>
                                <Input @on-blur="setTopicList(judge)" v-model="judge.questionsNumbe" placeholder="输入题目数" style=""/>
                                <span>道</span>
                                <span>,</span>
                                <span>每题</span>
                                <Input v-model="judge.score" placeholder="输入分值" style=""/>
                                <span>分</span>
                                <Icon size="15"   @click="isDeleteTopic('judge')" class="icon-close pointer" color="#f00" type="md-close-circle"/>
                            </div>
                            <div  v-show="judge.list!=0"  class="topic-list">
                                <p>
                                    <span>判断题正确答案、知识点</span>
                                    <span>选出该判断题"正确"还是"错误"</span>
                                </p>
                                <ul class="clearfix">
                                    <li class="" v-for="(item,index) in judge.list">
                                        <div>
                                            <span class="number">{{index +1}}.</span>
                                            <Select v-model="item.rightAnswer" style="width:150px">
                                                <Option v-for="option in judge.rightAnswerList" :value="option.value" :key="option.value">
                                                    {{
                                                    option.label }}
                                                </Option>
                                            </Select>
                                        </div>
                                        <div>
                                            <Select
                                                style="width: 150px"
                                                placeholder="输入知识点"
                                                v-model="item.knowledge"
                                                filterable
                                                clearable
                                                remote
                                                @on-query-change="remoteMethod1"
                                                :loading="loading">
                                                <Option v-for="(option, index) in searchKnowList"  :value="option.knowId"  :key="index">{{option.knowName}}</Option>
                                            </Select>                                            <Icon @click="adkKnowLedge(item.knowledgeList,item.knowledge,searchKnowList)" class="pointer" size="18" color="#3ac5ae" type="md-add"/>
                                        </div>
                                        <div>
                                            <Tag v-for="(tag,tagIndex) in item.knowledgeList" :key="tag.knowId" @on-close="removeKnowLedge(item.knowledgeList,tagIndex)" closable>{{tag.knowName}}</Tag>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>

            </div>

            <div class="btn-box fl">
                <Button class="btn fr"  @click="updateExam" type="primary">完成</Button>
            </div>
        </div>
        <MyDialog :title="'删除'" @ok="deleteTopicSubmit" width="475" :visible.sync="isDelete">
            <div style="color:#000;text-align: center;font-size:16px;">
                确定删除该题型?
            </div>

        </MyDialog>

    </div>

</template>

<script>
import { storage } from '../../../../../common/js/qylh';
export default {
    name: 'answerSheet',
    data() {
        let edit = storage.get('examDataEdit') == 'true';

        return {
            loading: false,
            status: '新建',
            edit: edit,
            updateFlag: true,
            searchKnowList: [],
            deleteTopicType: '',
            monomialChoice: {
                questionsNumbe: 0,
                score: 0,
                disabled: false,
                list: [],
                searchKnowList: [],
                loading: false,
                rightAnswerList: ['A', 'B', 'C', 'D']
            },
            multitermChoice: {
                questionsNumbe: 0,
                score: 0,
                disabled: false,
                list: [],
                rightAnswerList: ['A', 'B', 'C', 'D', 'E']
            },
            judge: {
                questionsNumbe: 0,
                score: 0,
                disabled: false,
                list: [],
                rightAnswerList: [{ value: '1', label: '正确' }, { value: '0', label: '错误' }]
            },
            isDelete: false,
            cityList: [{ value: '1', label: '正确' }, { value: '0', label: '错误' }],
            imgSrc: '',
            examData: storage.get('examData')
        };
    },
    computed: {},
    mounted() {
        this.getInitData();
    },
    methods: {
        /**
         * 获取数据初始化
         */
        getInitData() {
            if (this.edit) {
                this.status = '编辑';
                this.examData = storage.get('examData');
                this.monomialChoice.list = this.examData.questionMap.monomialList;
                this.multitermChoice.list = this.examData.questionMap.multitermList;
                this.judge.list = this.examData.questionMap.judgeList;
                this.monomialChoice.questionsNumbe = this.examData.monomialChoiceNum;
                this.multitermChoice.questionsNumbe = this.examData.multitermChoiceNum;
                this.judge.questionsNumbe = this.examData.judgeNum;
                this.monomialChoice.score = this.examData.monomialChoiceScore;
                this.multitermChoice.score = this.examData.multitermChoiceScore;
                this.judge.score = this.examData.judgeScore;
                this.setData(this.monomialChoice);
                this.setData(this.multitermChoice);
                this.setData(this.judge);
            }
        },
        setData(obj) {
            if (obj.list.length > 0) {
                obj.disabled = true;
                obj.list = this.$tools.cloneObj(
                    obj.list.map((item) => {
                        item.rightAnswer = item.rightAnswer.split('|');
                        item.knowledgeList = item.konwList || [];
                        return item;
                    })
                );
            }
        },
        remoteMethod1(query) {
            // this.loading = true;
            this.$fetch({
                url: '/system-backend/examBack/selectKnowList',
                data: { knowName: query }
            }).then((res) => {
                // this.loading = false;
                this.searchKnowList = res.obj;
            });
        },
        /**
         * 更新数据
         */
        updateExam() {
            this.setExamData();
            let url = '';

            let judgeNum = this.examData.judgeNum;
            let monomialChoiceNum = this.examData.monomialChoiceNum;
            let multitermChoiceNum = this.examData.multitermChoiceNum;
            if (judgeNum == 0 && monomialChoiceNum == 0 && multitermChoiceNum == 0) {
                this.$Message.error('请添加问题');

                return false;
            }
            if (!this.updateFlag) {
                this.$Message.error('选择填写完正确答案');
                return false;
            }
            if (this.edit) {
                delete this.examData.questionMap;
                this.examData.userId = this.$store.state.userInfo.userId;
                // 编辑
                url = '/system-backend/examBack/updateExam';
            } else {
                // 添加
                url = '/system-backend/examBack/insertExam';
            }
            this.$fetch({
                url: url,
                data: this.examData
            }).then((res) => {
                if (res.code == 200) {
                    this.$Message.success(res.msg);
                    storage.remove('examData');
                    this.$router.push({
                        path: '/courseManagement/examination'
                    });
                } else {
                    this.$Message.error(res.msg);
                }
            });
        },
        setExamData() {
            this.updateFlag = true;
            function isArr(obj) {
                let arr = [];
                if (obj.length > 0) {
                    arr = obj.map((item) => item.knowId);
                } else {
                    return '';
                }
                return arr.join('|');
            }
            function isArr2(obj) {
                return obj.length > 0 ? obj.join('|') : '';
            }
            let monomialChoiceList = this.monomialChoice.list.map((item) => {
                if (!item.rightAnswer) {
                    this.updateFlag = false;
                }
                return {
                    rightAnswer: item.rightAnswer,
                    questionType: 1,
                    knowledge: isArr(item.knowledgeList)
                };
            });
            let multitermChoiceList = this.multitermChoice.list.map((item) => {
                if (!item.rightAnswer) {
                    this.updateFlag = false;
                }
                item.rightAnswer.sort();
                return {
                    rightAnswer: isArr2(item.rightAnswer),
                    questionType: 2,
                    knowledge: isArr(item.knowledgeList)
                };
            });
            let judgeList = this.judge.list.map((item) => {
                if (!item.rightAnswer) {
                    this.updateFlag = false;
                }
                return {
                    rightAnswer: item.rightAnswer,
                    questionType: '3',
                    knowledge: isArr(item.knowledgeList)
                };
            });
            this.examData.monomialChoiceNum = this.monomialChoice.questionsNumbe || 0;
            this.examData.multitermChoiceNum = this.multitermChoice.questionsNumbe || 0;
            this.examData.judgeNum = this.judge.questionsNumbe || 0;
            this.examData.monomialChoiceScore = this.monomialChoice.score || 0;
            this.examData.multitermChoiceScore = this.multitermChoice.score || 0;
            this.examData.judgeScore = this.judge.score || 0;
            // if (this.examData.startTimeVo) {
            //     this.examData.startTime = this.examData.startTimeVo + ':0';
            // } else {
            this.examData.startTime = `${this.examData.examDate} ${this.examData.startTime2}:0`;
            // }
            // if (this.examData.endTimeVo) {
            //     this.examData.endTime = this.examData.endTimeVo + ':0';
            // } else {
            this.examData.endTime = `${this.examData.examDate} ${this.examData.endTime2}:0`;
            // }

            this.examData.questions = JSON.stringify([].concat(monomialChoiceList, multitermChoiceList, judgeList));
            // delete this.examData.startTime;
            // delete this.examData.endTime;
        },
        next() {
            this.$router.push({
                path: '/courseManagement/examination/addTest'
            });
        },
        isDeleteTopic(text) {
            this.deleteTopicType = text;
            this.isDelete = true;
        },
        deleteTopicSubmit() {
            this[this.deleteTopicType].disabled = false;
            this[this.deleteTopicType].questionsNumbe = 0;
            this[this.deleteTopicType].score = 0;
            this[this.deleteTopicType].list = [];
            this.isDelete = false;
        },
        setTopicList(item) {
            item.list = [];
            let number = item.questionsNumbe;
            for (let i = 0; i < number; i++) {
                item.list.push({
                    rightAnswer: '',
                    knowledgeList: []
                });
            }
        },
        adkKnowLedge(list, knowId, searchKnowList) {
            console.log(list);
            if (knowId) {
                if (!list) {
                    list = [];
                }
                let knowItem = searchKnowList.find((item) => {
                    return item.knowId == knowId;
                });
                list.push(knowItem);
            }
        },
        removeKnowLedge(list, tagIndex) {
            list.splice(tagIndex, 1);
        },
        uploadSuccess(response, file, filelist) {
            this.imgSrc = response.srcElement;
        },
        uploadBefore(response, file, fileList) {},
        uploadProgress(response, file, fileList) {}
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
        .content-wrapper
            padding: 0 15px;

        .left
            width: 100%;
            margin-right: 50px;
            .title
                padding-bottom: 15px;
                border-bottom: 1px solid #e6e8ee;
            .from-box
                padding: 20px;
                width: 500px;
        .btn-title
            margin: 20px 0;
            .btn
                width: 68px;
                margin-right: 25px;
        .topic
            margin-bottom: 20px;
            span
                margin-right: 25px;
            .ivu-input-wrapper
                width: 100px;
                margin-right: 10px;

        .btn-box
            width: 100%;
            margin-top: 15px;
            padding-top: 10px;
            border-top: 1px solid #e6e8ee;
            .btn
                width: 115px;

    .ivu-form-item
        margin-bottom: 20px;

    .topic-list
        background-color: #fafafa
        padding-top: 5px;
        margin: 20px 0;
        > p
            margin: 5px 0;
            span
                color: #d73950
            span:first-child
                color: #3187d9
                margin-right: 25px;

        > ul
            padding: 0 15px;
            > li
                display: inline-block;
                vertical-align: top;
                margin-right: 5px;
                margin-bottom: 25px;
                .number
                    display: inline-block;
                    width: 25px;
                    text-align: center;
                > div
                    width: 200px;
                > div:first-child
                    margin-bottom: 10px;
</style>
<style lang="stylus">
    .answerSheet
        .topic
            .ivu-input-wrapper
                width: 1230px;
</style>
