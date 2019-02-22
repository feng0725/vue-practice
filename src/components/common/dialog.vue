<template>
    <div>
        <Modal
            :title="title"
            v-model="myVisible"
            @on-visible-change="change"
            :width="newWidth"
            :loading="loading"
            :class-name="newClassName">
            <slot></slot>

            <div slot="footer">
                <slot name="footer">
                    <Button size="large"  @click="cancel">取消</Button>
                    <Button type="primary" size="large" :loading="loading" @click="ok">确定</Button>
                </slot>

            </div>
        </Modal>
    </div>

</template>

<script>
export default {
    name: 'mydialog',
    props: ['title', 'visible', 'width', 'center', 'className', 'loading'],
    computed: {
        newWidth() {
            return this.width || 480;
        },
        newClassName() {
            return 'dialog vertical-center-modal ' + this.className;
        },
        newLoading() {
            return this.loading;
        }
    },
    data() {
        return {
            myVisible: this.visible
        };
    },
    mounted() {},
    watch: {
        visible(val) {
            this.myVisible = val;
        }
    },
    methods: {
        close() {
            this.myVisible = false;
        },
        cancel() {
            this.close();
        },
        ok(event) {
            this.$emit('update:loading',true)
            // this.loading = true;
            this.$emit('ok', event);
            setTimeout(() => {});
        },
        change(val) {
            this.myVisible = val;
            this.$emit('update:visible', val);
        }
    }
};
</script>

<style scoped lang="stylus">
    .ivu-modal-header, .ivu-modal-footer
        border: 0;
</style>
<style lang="stylus">
    .dialog
        .ivu-modal-body
            background-color: #f2f3f5;
            color:#000;
            text-align: center;
        .ivu-modal-close
            top: 18px;
        .ivu-modal-header
            border: 0;
            padding: 0;
            margin-bottom: 20px;
        .ivu-modal-content
            padding: 25px;
        .ivu-modal-footer
            border: 0;
            text-align: center;
            margin-top:10px;

        .ivu-btn:first-child
            border: 1px solid #8b8b8b;
        .center .ivu-modal-body
            text-align: center;

    .vertical-center-modal {
        display: flex;
        align-items: center;
        justify-content: center;

        .ivu-modal {
            top: 0;
        }
    }
</style>
