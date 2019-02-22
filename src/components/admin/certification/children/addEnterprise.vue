<template>
    <div class="addEnterprise  edit-new">
        <header>
            <div class="icon-box" @click="$router.back()">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-left"></use>
                </svg>
            </div>
            <div class="title">
                独立公众号
            </div>
        </header>
        <div class="wrapper clearfix">
            <div class="title">
                <Steps size="small" :current="2">
                    <Step title="填写企业信息" content=""></Step>
                    <Step title="开课认证" content=""></Step>
                    <Step title="独立公众号" content=""></Step>
                </Steps>

            </div>
            <div class="clearfix">
                <Form class="from" ref="formData" :model="formData" :rules="ruleValidate" :label-width="160"
                      label-position="left">
                    <div class="left fl">
                        <h4>公众号配置</h4>

                        <FormItem label="公众号名称(必填)" prop="name">
                            <Input v-model="formData.name" maxlength="16" placeholder=""></Input>
                        </FormItem>
                        <FormItem label="appID(必填)" prop="appId">
                            <Input v-model="formData.appId" maxlength="32" placeholder=""></Input>
                        </FormItem>
                        <FormItem label="secretID(必填)" prop="secret_id">
                            <Input v-model="formData.secret_id"  placeholder=""></Input>
                        </FormItem>
                        <FormItem label="通知模板编号(必填)" prop="notice_template_id">
                            <Input v-model="formData.notice_template_id"  placeholder=""></Input>
                        </FormItem>
                        <FormItem label="系统消息模板编号(必填)" prop="sys_template_id">
                            <Input v-model="formData.sys_template_id" placeholder=""></Input>
                        </FormItem>
                        <FormItem label="推送通知人署名(必填)" prop="push_user_name">
                            <Input v-model="formData.push_user_name" maxlength="8" placeholder=""></Input>
                        </FormItem>
                        <FormItem label="客服电话(必填)" prop="phone">
                            <Input v-model="formData.phone" maxlength="12" placeholder=""></Input>
                        </FormItem>
                    </div>
                    <div class="right fl">
                        <h4>个性化配置</h4>
                        <FormItem label="banner图片" prop="banner_url">
                            <div>
                                <Upload :show-upload-list="false"
                                        :before-upload="uploadBefore"
                                        :on-success="uploadSuccess"
                                        :data="uploadData"
                                        :on-progress="uploadProgress"
                                        name="imgFile"
                                        accept="image/*"
                                        action="/system-backend/enterprise/addImg">
                                    <Button class="white-blue">上传图片</Button>
                                    <span>图片大小为750X280px,大小不超过500K</span>
                                </Upload>
                            </div>
                            <div class="img-box">
                                <Icon size="15" @click="formData.banner_url = ''" class="icon-close" color="#f00" type="md-close-circle"/>
                                <img :src="formData.banner_url" alt="">
                            </div>
                        </FormItem>
                        <FormItem label="用户协议(必填)" prop="agreement_url">
                            <Button @click="openAgreement" class="white-blue">图文编辑</Button>
                            <Input v-show="1===0" v-model="formData.agreement_url" placeholder=""></Input>

                        </FormItem>
                        <FormItem label="购课须知(必填)" prop="buy_notes">
                            <Button @click="openBuy_notes" class="white-blue">图文编辑</Button>
                            <Input v-show="1===0"  v-model="formData.buy_notes" placeholder=""></Input>

                        </FormItem>
                    </div>
                </Form>
            </div>
            <div class="btn-box fl">
                <Button class="btn fr" @click="next" type="primary">完成</Button>
                <Button style="margin-right: 20px" class="btn fr cance" @click="jump" type="primary">跳过并提交</Button>
            </div>
        </div>
        <MyDialog class-name="add-user" @ok="updateAgreemetn_url" :title="'用户协议'" width="750" :visible.sync="isAgreement_url">
            <div>
                <edit  v-if="isAgreement_url" :height="editHeight" :defaultMsg="formData.agreement_url" ref="agreement_url"></edit>
            </div>
        </MyDialog>
        <MyDialog class-name="add-user" @ok="updateBuy_notes" :title="'购课须知'" width="750" :visible.sync="isBuy_notes">
            <div>
                <edit v-if="isBuy_notes" :height="editHeight" :defaultMsg="formData.buy_notes" ref="buy_notes"></edit>
            </div>
        </MyDialog>
    </div>

</template>

<script>
import edit from '@/components/common/editor';
import { storage } from '../../../../common/js/qylh';

export default {
    name: 'addAdmin',
    components: {
        edit: edit
    },
    computed: {
        value17() {
            return this.value7.replace(/\n/g, '<br>');
        }
    },
    data() {
        return {
            edit: storage.get('enterpriseEdit') == 'true',
            uploadData: {
                originalName: ''
            },
            isBuy_notes: false,
            isAgreement_url: false,
            editor: false,
            value7: '',
            formData: {
                enterprise_id: this.$route.query.id,
                name: '',
                appId: '',
                secret_id: '',
                notice_template_id: '',
                sys_template_id: '',
                push_user_name: '',
                phone: '',
                banner_url: '',
                agreement_url: '',
                buy_notes: '',
                user_id: this.$store.state.userInfo.userId
            },
            editHeight: '',
            ruleValidate: {
                name: [
                    {
                        required: true,
                        message: '请输入公众号名称'
                    }
                ],
                appId: [
                    {
                        required: true,
                        message: '请输入appID'
                    }
                ],
                secret_id: [
                    {
                        required: true,
                        message: '请输入secretID'
                    }
                ],
                notice_template_id: [
                    {
                        required: true,
                        message: '请输入通知模板编号'
                    }
                ],
                sys_template_id: [
                    {
                        required: true,
                        message: '请输入系统消息模板编号'
                    }
                ],
                push_user_name: [
                    {
                        required: true,
                        message: '请输入推送通知人署名'
                    }
                ],
                phone: [
                    {
                        required: true,
                        message: '请输入客服电话'
                    }
                ],
                agreement_url: [
                    {
                        required: true,
                        message: '请输入用户协议'
                    }
                ],
                buy_notes: [
                    {
                        required: true,
                        message: '请输入购课须知'
                    }
                ]
            }
        };
    },
    created() {
        if (document.documentElement.clientHeight < 1000) {
            this.editHeight = '250px';
        } else {
            this.editHeight = '400px';
        }
    },
    mounted() {
        if (this.edit) {
            this.$fetch({
                url: '/system-backend/enterprise/selectAppInfo',
                data: { enterprise_id: this.$route.query.id }
            }).then((res) => {
                if (res.code == 200) {
                    let data = res.obj[0];
                    this.formData.name = data.name;
                    this.formData.appId = data.appid;
                    this.formData.secret_id = data.secretId;
                    this.formData.notice_template_id = data.noticeTemplateId;
                    this.formData.sys_template_id = data.sysTemplateId;
                    this.formData.push_user_name = data.pushUserName;
                    this.formData.phone = data.phone;
                    this.formData.banner_url = data.bannerUrl;
                    this.formData.agreement_url = data.agreementUrl;
                    this.formData.buy_notes = data.buyNotes;
                }
            });
        }
    },
    methods: {
        jump() {
            this.$router.push({
                path: '/configuration'
            });
        },
        openAgreement() {
            this.isAgreement_url = true;

            this.$nextTick(function() {
                this.$refs.agreement_url.setContent(this.formData.agreement_url);
            });
        },
        updateAgreemetn_url() {
            this.formData.agreement_url = this.$refs.agreement_url.getUEContent();

            this.$nextTick(function() {
                this.isAgreement_url = false;
            });
        },
        openBuy_notes() {
            this.isBuy_notes = true;
            this.$refs.buy_notes.setContent(this.formData.buy_notes);
        },
        updateBuy_notes() {
            this.formData.buy_notes = this.$refs.buy_notes.getUEContent();
            this.$nextTick(function() {
                this.isBuy_notes = false;
            });
        },
        next() {
            this.$refs.formData.validate((vailid) => {
                if (vailid) {
                    if (this.edit) {
                        this.$fetch({
                            url: '/system-backend/enterprise/updateEnterpriseApp',
                            data: this.formData
                        }).then((res) => {
                            if (res.code == 200) {
                                storage.remove('enterpriseEdit');
                                this.$router.push({ path: '/configuration' });
                                this.$Message.success(res.msg);
                            } else {
                                this.$Message.error(res.msg);
                            }
                        });
                    } else {
                        this.$fetch({
                            url: '/system-backend/enterprise/app',
                            data: this.formData
                        }).then((res) => {
                            if (res.code == 200) {
                                storage.remove('enterpriseEdit');
                                this.$router.push({ path: '/configuration' });
                                this.$Message.success(res.msg);
                            } else {
                                this.$Message.error(res.msg);
                            }
                        });
                    }
                }
            });
        },
        uploadSuccess(response, file, filelist) {
            if (response.obj.res > 0) {
                this.formData.banner_url = response.obj.url;
            }
        },
        uploadBefore(response, file, fileList) {
            this.uploadData.originalName = this.$tools.filterFileNmae(response.name);
        },
        uploadProgress(response, file, fileList) {}
    }
};
</script>

<style scoped lang="stylus">

    .wrapper
        position: relative;
        width: 1150px;
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
        .left
            width: 390px;
            margin-right: 50px;
        .right
            width: 500px;
        .btn-box
            width: 100%;
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #e6e8ee;
            .btn
                width: 115px;

    .img-box
        position: relative;
        width: 95px;
        height: 35px;
        border: 1px solid #e7e9ef;
        margin-top: 18px;
        img
            width: 100%;
            height: 100%;
</style>
<style lang="stylus">

</style>
