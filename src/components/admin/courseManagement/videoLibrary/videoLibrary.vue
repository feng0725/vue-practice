<template>
    <div class="videoLibrary two-page">
        <div class="btn-box">
            <Button type="primary" @click="goToAdd">上传视频</Button>
        </div>

        <div class="search-box clearfix">
            <Form class="fr" ref="search" :model="search" inline>
                <FormItem prop="user" v-if="$store.getters.isAdmins">
                    <Select v-model="search.enterpriseId" style="width:200px" placeholder="按企业筛选">
                        <Option v-for="item in enterpriseList" :value="item.enterpriseId" :key="item.enterpriseId">{{
                            item.name }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem prop="user">
                    <Select v-model="search.useStatus" style="width:200px" placeholder="使用状态">
                        <Option v-for="item in useStatusList" :value="item.value" :key="item.value">{{ item.label }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem prop="user">
                    <Select v-model="search.videoStatus" style="width:200px" placeholder="视频状态    ">
                        <Option v-for="item in videoStatusList" :value="item.value" :key="item.value">{{ item.label }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <i-input class="search" v-model.trim="search.videoName" @on-search="searchTableData" search enter-button
                             placeholder="输入视频名称"></i-input>
                </FormItem>
            </Form>
            <form ref="fileForm">
                <input ref="file" accept="video/*" @change="upload" type="file" style="display:none;"/>
            </form>
        </div>

        <div class="tableList">
            <Table @on-sort-change="tableSorting" :columns="table.columns" :data="table.data"></Table>
        </div>
        <div class="clearfix page-info">
            <div class="fl">已选0项,共{{table.total}}项</div>
            <myPage class="fr page" @on-change="changePage" :count="count"></myPage>
            <div class="fr">每页显示行:10行</div>
        </div>
        <!--dialog-->
        <div>

            <MyDialog :title="'删除'" @ok="deleteVideo" :visible.sync="isDelete">
                <div style="text-align: center;font-weight: bold;height: 60px;line-height: 60px;">
                    确定删除该视频?
                </div>
            </MyDialog>

        </div>

    </div>
</template>

<script>
export default {
    name: 'videoLibrary',
    data() {
        return {
            percent: 0,
            enterpriseList: [],
            useStatusList: [
                { value: this.$tools.defaultAll, label: '全部使用状态' },
                { value: '0', label: '未使用' },
                { value: '1', label: '已使用' }
            ],
            videoStatusList: [
                { value: -1, label: '全部视频状态' },
                { value: '0', label: '转码成功' },
                { value: '1', label: '转码失败' },
                { value: '2', label: '转码中' }
            ],
            signature: '',
            isUserList: false,
            addUser: false,
            isDelete: false,
            count: 0,
            table: {
                total: 0,
                selected: {},
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '编号',
                        width: 80,
                        key: 'videoId',
                        align: 'center'
                    },
                    {
                        title: '视频名称',
                        key: 'videoName',
                        align: 'center'
                    },
                    {
                        title: '大小(M)',
                        key: 'videoSize',
                        maxWidth: 120,
                        align: 'center'
                    },
                    {
                        title: '使用状态',
                        key: 'useStatus',
                        maxWidth: 120,
                        align: 'center',
                        render: (h, params) => {
                            let status = params.row.useStatus == 1 ? '已使用' : '未使用';
                            return h('div', {}, status);
                        }
                    },
                    {
                        title: '视频状态',
                        key: 'videoStatus',
                        maxWidth: 120,
                        align: 'center',
                        render: (h, params) => {
                            let text = '';
                            let visible = 'none';
                            let videoStatus = params.row.videoStatus;
                            if (videoStatus == 0) {
                                text = '转码成功';
                            } else if (videoStatus == 1) {
                                text = '转码失败';
                            } else if (videoStatus == 2) {
                                text = '转码中';
                                visible = 'block';
                            }
                            let color = params.row.isAlive ? '#11ba9e' : '#11ba9e';
                            return h('div', [h('h4', text)]);
                        }
                    },
                    {
                        title: '所属企业/个人',
                        key: 'enterpriseName',
                        align: 'center'
                    },
                    {
                        title: '操作人',
                        key: 'operatorName',
                        maxWidth: 120,
                        align: 'center'
                    },

                    {
                        title: '操作时间',
                        key: 'operatorTime',
                        maxWidth: 160,
                        sortable: 'custom',
                        align: 'center',
                        sortType: 'desc',
                        className: 'fontBlue'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h(
                                    'Button',
                                    {
                                        props: {
                                            type: 'text',
                                            size: 'small'
                                        },
                                        attrs: {
                                            // disabled: !params.row.isAlive
                                        },
                                        class: {
                                            bar: params.row.isAlive
                                        },
                                        style: {
                                            width: '50px',
                                            marginRight: '5px',
                                            color: '#11ba9e',
                                            textAlign: 'center'
                                        },
                                        on: {
                                            click: () => {
                                                window.open(params.row.videoUrl);
                                            }
                                        }
                                    },
                                    '预览'
                                ),
                                h(
                                    'Button',
                                    {
                                        props: {
                                            type: 'text',
                                            size: 'small'
                                        },
                                        attrs: {
                                            // disabled: !params.row.isAlive
                                        },
                                        class: {
                                            textError: true
                                        },
                                        style: {
                                            width: '50px',
                                            marginRight: '5px',
                                            // color: '#f00',
                                            textAlign: 'center'
                                        },
                                        on: {
                                            click: () => {
                                                this.table.selected = params.row;
                                                this.isDelete = true;
                                            }
                                        }
                                    },
                                    '删除'
                                )
                            ]);
                        }
                    }
                ],
                data: []
            },
            search: {
                userId: this.$store.state.userInfo.userId,
                enterpriseId: this.$tools.defaultAll,
                useStatus: this.$tools.defaultAll,
                videoStatus: -1,
                videoName: '',
                orderBy: '0',
                pageSize: 10,
                pageNum: 1
            }
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.getTableData();
            this.getEnterpriseList();
            this.filterTableColumns('所属企业/个人');
        },
        searchTableData() {
            this.search.pageNo = 1;
            this.getTableData();
        },
        getTableData() {
            this.$fetch({
                url: '/system-backend/videoLibraryBack/queryAllVideoList',
                data: this.search
            }).then((res) => {
                this.table.data = res.obj.list;
                this.table.total = res.obj.total;
                this.count = res.obj.pages;
            });
        },
        getEnterpriseList() {
            if (!this.$store.getters.isAdmins) {
                return false;
            }
            this.$fetch({
                url: '/system-backend/courseBack/getEnterpriseList',
                data: {
                    userId: this.$store.state.userInfo.userId
                }
            }).then((res) => {
                this.enterpriseList = res.obj;
                this.enterpriseList.unshift(this.ALLSelect.enterprise1);
            });
        },
        getSignature(cb) {
            this.$fetch({
                url: '/system-backend/Signature'
            }).then((res) => {
                cb(res.signStr);
            });
        },
        upload() {
            this.$Spin.show({
                render: (h) => {
                    return h('div', [
                        h(
                            'i-circle',
                            {
                                props: {
                                    percent: this.percent
                                },
                                style: {
                                    display: this.percent == 100 ? 'none' : 'block'
                                }
                            },
                            [
                                h(
                                    'span',
                                    {
                                        class: 'demo-spin-icon-load',
                                        style: {
                                            fontSize: '24px',
                                            color: '#000'
                                        }
                                    },
                                    `${this.percent}%`
                                )
                            ]
                        ),
                        h('div', '正在上传')
                    ]);
                }
            });
            let that = this;

            var videoFile = this.$refs.file.files[0];
            if (videoFile.size > 209715200) {
                alert('上传文件不能大于200M');
                return;
            }
            var fileSize = videoFile.size;
            var resultMsg = qcVideo.ugcUploader.start({
                videoFile: videoFile,
                getSignature: this.getSignature,
                allowAudio: 1,
                success: function(result) {
                    if (result.type == 'video') {
                        that.$Spin.hide();
                    }
                },
                error: function(result) {
                    if (result.type == 'video') {
                        that.$Spin.hide();
                        that.$Message.error(result.msg);
                    }
                },
                progress: function(result) {
                    if (result.type == 'video') {
                        that.percent = Math.floor(result.curr * 100);
                        // this.$Message.error(result.msg)
                    }
                },
                finish: function(result) {
                    that.$Spin.hide();
                    that.addVideo(result.fileId, result.videoUrl, result.videoName, fileSize);
                }
            });

            if (resultMsg) {
            }
            this.$refs.fileForm.reset();
        },
        addVideo(fileId, videoUrl, videoName, fileSize) {
            this.$fetch({
                url: '/system-backend/videoLibraryBack/insertUploadVideo',
                data: {
                    fileId: fileId,
                    videoUrl: videoUrl,
                    videoName: videoName,
                    videoSize: fileSize,
                    userId: this.$store.state.userInfo.userId
                }
            }).then((res) => {
                if (res.code == 200) {
                    this.$Message.success(res.msg);
                    this.getTableData();
                } else {
                    this.$Message.error(res.msg);
                }
            });
        },
        deleteVideo() {
            this.$fetch({
                url: '/system-backend/videoLibraryBack/deleteVideo',
                data: {
                    videoId: this.table.selected.videoId
                }
            }).then((res) => {
                if (res.code == 200) {
                    this.$Message.success(res.msg);
                    this.getTableData();
                    this.isDelete = false;
                } else {
                    this.$Message.error(res.msg);
                }
            });
        },
        goToAdd() {
            this.$refs.file.click();
        },
        changePage(index) {
            this.pageNo = index;
            this.getTableData();
        },
        tableSorting({ column, key, order }) {
            this.search.orderBy = order == 'desc' ? '0' : '1';
            this.getTableData();
        }
    }
};
</script>

<style scoped lang="stylus">

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

        li
            padding-left: 25px;
            border-bottom: 1px solid #e8eaef;
            position: relative

            .close
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                right: 15px;
                cursor: pointer;
</style>
<style lang="stylus">
    .videoLibrary
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

    .ivu-table-body
        .number
            color: #0c6bba;

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

    .user-box
        width: 340px;
        height: 380px;
        border: 1px solid #e6e8ee;
        overflow: auto;

        .ivu-checkbox-group-item
            height: 50px;
            line-height: 50px;
            padding-left: 10px;
            display: block;
            border-bottom: 1px solid #f2f2f2;

            .ivu-checkbox
                margin-right: 20px;

    .dialog.add-user
        .ivu-modal-body
            background-color: transparent;

        .ivu-input-search
            border: 1px solid #d1d2d3 !important;
            padding: 0 4px !important;
            width: 25px;
            background-color: #fff !important;

            i
                color: #117dd6;

        .ivu-input
            background-color: #fff
</style>
