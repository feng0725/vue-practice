<template>
    <div class="openClass edit-new">
        <header>
            <div class="icon-box" @click="$router.back()">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-left"></use>
                </svg>
            </div>
            <div class="title">
                开课认证
            </div>
        </header>
        <div class="wrapper clearfix">
            <div class="left fl">
                <div class="title">
                    <Steps size="small" :current="1">
                        <Step title="填写企业信息" content=""></Step>
                        <Step title="开课认证" content=""></Step>
                        <Step title="独立公众号" content=""></Step>
                    </Steps>
                </div>
                <div class="from-box">
                    <Form class="from" ref="form" :model="formData" :rules="ruleValidate" :label-width="140"
                          label-position="left">
                        <FormItem label="法人姓名(必填)" prop="legal_person_name">
                            <Input v-model="formData.legal_person_name" :maxlength="8" placeholder=""></Input>

                        </FormItem>
                        <FormItem label="法人身份证" prop="id_card">
                            <Input v-model="formData.id_card"  :maxlength="18" placeholder=""></Input>
                        </FormItem>
                        <FormItem label="统一社会信用代码" prop="license_no">
                            <Input v-model="formData.license_no" placeholder=""></Input>
                        </FormItem>
                        <FormItem label="对公账户" prop="bank_no">
                            <Input v-model="formData.bank_no" placeholder=""></Input>
                        </FormItem>
                        <FormItem label='&quot;三证合一&quot;营业执照' prop="mail">
                            <Upload :show-upload-list="false"
                                    :before-upload="uploadBefore"
                                    :on-success="uploadSuccess"
                                    :data="uploadData"
                                    :on-progress="uploadProgress"
                                    name="imgFile"
                                    accept="image/*"
                                    action="/system-backend/enterprise/addImg">
                                <Button class="white-blue" >上传图片</Button>
                            </Upload>
                        </FormItem>
                        <FormItem v-if="formData.license_url" label="" prop="mail">
                            <div class="img-box">
                                <Icon size="15" class="icon-close" @click="formData.license_url =''" color="#f00" type="md-close-circle"/>
                                <img :src="formData.license_url" alt="">
                            </div>
                        </FormItem>
                    </Form>
                </div>
            </div>

            <div class="btn-box fl">
                <Button class="btn fr" @click="next" type="primary">下一步</Button>
                <Button style="margin-right: 20px" class="btn fr cance" @click="jump" type="primary">跳过</Button>
            </div>
        </div>
    </div>

</template>

<script>
import { storage } from '../../../../common/js/qylh';

export default {
    name: 'addAdmin',
    data() {
        return {
            edit: storage.get('enterpriseEdit') == 'true',
            uploadData: {
                originalName: ''
            },
            formData: {
                enterprise_id: this.$route.query.id,
                legal_person_name: '',
                id_card: '',
                license_no: '',
                bank_no: '',
                license_url: ''
            },
            ruleValidate: {
                legal_person_name: {
                    required: true,
                    message: '请输入法人姓名'
                },
                id_card: {
                    message: '请填写正确的身份证号',
                    pattern: /^\d{17}(\d|X|x)$/,
                    trigger: 'blur'
                }
            }
        };
    },
    mounted() {
        if (this.edit) {
            this.$fetch({
                url: '/system-backend/enterprise/selectEnterpriseAuthInfo',
                data: {
                    enterprise_id: this.$route.query.id
                }
            }).then((res) => {
                if (res.code == 200) {
                    this.formData.enterprise_id = res.obj[0].enterpriseId;
                    this.formData.legal_person_name = res.obj[0].legalPersonName;
                    this.formData.id_card = res.obj[0].idCard;
                    this.formData.license_no = res.obj[0].licenseNo;
                    this.formData.bank_no = res.obj[0].bankNo;
                    this.formData.license_url = res.obj[0].licenseUrl;
                }
            });
        }
    },
    methods: {
        jump() {
            this.$router.push({
                path: '/configuration/addEnterprise',
                query: { id: this.$route.query.id }
            });
        },
        next() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    if (this.edit) {
                        this.$fetch({
                            url: '/system-backend/enterprise/updateEnterpriseAuth',
                            data: this.formData
                        }).then((res) => {
                            if (res.code == 200) {
                                this.$Message.success(res.msg);
                                this.$router.push({
                                    path: '/configuration/addEnterprise',
                                    query: { id: this.$route.query.id }
                                });
                            } else {
                                this.$Message.error(res.msg);
                            }
                        });
                    } else {
                        this.$fetch({
                            url: '/system-backend/enterprise/auth',
                            data: this.formData
                        }).then((res) => {
                            if (res.code == 200) {
                                this.$Message.success(res.msg);
                                this.$router.push({
                                    path: '/configuration/addEnterprise',
                                    query: { id: res.obj }
                                });
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
                this.formData.license_url = response.obj.url;
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

        .left
            width: 100%;
            margin-right: 50px;
            .title
                padding-bottom: 15px;
                border-bottom: 1px solid #e6e8ee;
            .from-box
                width: 350px;
        .from
            margin-top: 20px;
            margin-left: 10px;
            margin-right: 10px;
            .img-box
                position: relative;
                width: 100px;
                border: 1px solid #e7e9ef;
                img
                    width:100%;
                    display: block
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
</style>
<style lang="stylus">
    .openClass
        .tree
            > ul
                padding: 5px 0;
                padding-left: 15px;
                border-bottom: 1px solid #e7e9ee;
</style>
