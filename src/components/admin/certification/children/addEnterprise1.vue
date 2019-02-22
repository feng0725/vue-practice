<template>
    <div class="addEnterprise edit-new">
        <header>
            <router-link class="icon-box" tag="div" to="/configuration">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-left"></use>
                </svg>
            </router-link>
            <div class="title">
                {{status}}企业
            </div>
        </header>
        <div class="wrapper clearfix">
            <div class="title">
                <Steps size="small" :current="0">
                    <Step title="填写企业信息" content=""></Step>
                    <Step title="开课认证" content=""></Step>
                    <Step title="独立公众号" content=""></Step>
                </Steps>

            </div>
            <div class="clearfix">
                <Form class="from" ref="form" :model="formData" :rules="ruleValidate" :label-width="180"
                      label-position="left">
                    <div class="left fl">
                        <FormItem label="企业名称(必填)" prop="name">
                            <Input v-model="formData.name" placeholder=""></Input>
                        </FormItem>
                        <FormItem label="企业联系人(必填)" prop="contact">
                            <Row>
                                <Input v-model="formData.contact" placeholder=""></Input>
                            </Row>
                        </FormItem>
                        <FormItem label="联系人手机(必填)" prop="mobile">
                            <Input v-model="formData.mobile" :maxlength="11" placeholder=""></Input>
                        </FormItem>
                        <FormItem label="省份" prop="provinceId">
                            <Select v-model="formData.provinceId"  @on-change="changeProvince" style="width:200px;" placeholder="省">
                                <Option v-for="item in provinceList" :value="item.provinceId" :key="item.provinceId">
                                    {{ item.provinceName}}
                                </Option>
                            </Select></FormItem>
                        <FormItem label="城市" prop="cityId">
                            <Select v-model="formData.cityId"  style="width:200px;" placeholder="城市">
                                <Option v-for="item in cityList" :value="item.cityId" :key="item.cityId">
                                    {{ item.cityName}}
                                </Option>
                            </Select></FormItem>
                        <FormItem label="地址" prop="address">
                            <Input v-model="formData.address"  autocomplete="off" type="textarea" :autosize="{minRows: 4, maxRows: 4}"></Input>
                        </FormItem>
                    </div>
                    <div class="right fl">
                        <FormItem label="单位类型(必填)" prop="type">
                            <Select v-model="formData.type" style="width:200px;" placeholder="国企">
                                <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}
                                </Option>
                            </Select>
                        </FormItem>
                        <FormItem label="服务人员(必填)" prop="agent">
                            <Row>
                                <Input v-model="formData.agent" :maxlength="8" placeholder=""></Input>
                            </Row>
                        </FormItem>
                        <FormItem label="座机" prop="tel">
                            <Input v-model="formData.tel" placeholder=""></Input>
                        </FormItem>
                        <FormItem label="邮箱" prop="email">
                            <Input v-model="formData.email" placeholder=""></Input>
                        </FormItem>
                        <FormItem label="传真" prop="fax">
                            <Input v-model="formData.fax" placeholder=""></Input>
                        </FormItem>

                    </div>
                </Form>

            </div>
            <div class="btn-box fl">
                <Button class="btn fr" @click="next" type="primary">下一步</Button>
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
            status: '新建',
            edit: storage.get('enterpriseEdit') == 'true',
            cityList: [],
            provinceList: [],
            typeList: [
                { value: '1', label: '事业单位' },
                { value: '2', label: '国有企业' },
                { value: '3', label: '民营企业' },
                { value: '4', label: '外资企业' },
                { value: '5', label: '其它' }
            ],
            formData: {
                user_id: this.$store.state.userInfo.userId,
                name: '',
                contact: '',
                mobile: '',
                cityId: '',
                address: '',
                type: '',
                agent: '',
                tel: '',
                email: '',
                fax: ''
            },
            ruleValidate: {
                name: [{ required: true, message: '请填写企业名称' }],
                contact: [{ required: true, message: '请填写企业联系人' }],
                mobile: [
                    { required: true, message: '请填写联系人手机' },
                    {
                        pattern: /^1\d{10}$/,
                        message: '请填写正确的手机号',
                        trigger: 'blur'
                    }
                ],
                email: {
                    type: 'email',
                    message: '您输入的email格式不正确',
                    trigger: 'blur'
                },
                type: {
                    required: true,
                    message: '请选择单位类型'
                },
                agent: {
                    required: true,
                    message: '请输入服务人员'
                }
            }
        };
    },
    mounted() {
        this.init();

        if (this.edit) {
            this.status = '编辑';
            this.$fetch({
                url: '/system-backend/enterprise/selectEnterpriseInfo',
                data: {
                    enterprise_id: this.$route.query.id
                }
            }).then((res) => {
                if (res.code == 200) {
                    this.formData = res.obj[0];
                    this.getCity(this.formData.provinceId);
                }
            });
        }
    },
    methods: {
        init() {
            this.getProvince();
        },
        /**
         * 获取省份列表
         */
        getProvince() {
            this.$fetch({
                url: '/system-backend/enterprise/selectProvince'
            }).then((res) => {
                this.provinceList = res.obj;
            });
        },
        changeProvince(id) {
            this.getCity(id);
        },
        getCity(id) {
            this.$fetch({
                url: '/system-backend/enterprise/selectCity',
                data: {
                    province_id: id
                }
            }).then((res) => {
                this.cityList = res.obj;
            });
        },

        next() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    if (this.edit) {
                        let params = this.$tools.cloneObj(this.formData);
                        params.enterprise_id = this.$route.query.id;
                        this.$fetch({
                            url: '/system-backend/enterprise/updateEnterprise',
                            data: params
                        }).then((res) => {
                            if (res.code == 200) {
                                this.$Message.success(res.msg);

                                this.$router.push({
                                    path: '/configuration/openClass',
                                    query: { id: this.$route.query.id }
                                });
                            } else {
                                this.$Message.error(res.msg);
                            }
                        });
                    } else {
                        this.$fetch({
                            url: '/system-backend/enterprise/insert',
                            data: this.formData
                        }).then((res) => {
                            if (res.code == 200) {
                                this.$Message.success(res.msg);

                                this.$router.push({
                                    path: '/configuration/openClass',
                                    query: { id: res.obj }
                                });
                            } else {
                                this.$Message.error(res.msg);
                            }
                        });
                    }
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
        .from
            margin-top: 25px;
            margin-left: 10px;
            margin-right: 10px;
        .left
            width: 380px;
            margin-right:50px;
        .right
            width: 380px;

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
