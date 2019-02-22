<template>
    <div class="class-list">
        <div class="check-box">
            <div v-if="list.length >0" style="padding-bottom:6px;">
                <Checkbox
                    :indeterminate="indeterminate"
                    :value="checkAll"
                    @click.prevent.native="handleCheckAll">全选
                </Checkbox>
            </div>
            <CheckboxGroup @on-change="changeSelect" v-model="newSelectList">
                <Checkbox v-for="(item,index) in list" :key="index" :label="item">{{item[itemKey]}}</Checkbox>
            </CheckboxGroup>
        </div>
    </div>
</template>

<script>
export default {
    name: 'class-list',
    props: {
        list: Array,
        selectList: Array,
        itemKey: {
            type: String,
            default: 'name'
        }
    },
    computed: {
        newSelectList: {
            // getter
            get() {
                return this.selectList;
            },
            // setter
            set(newValue) {
                return newValue;
            }
        }
    },
    data() {
        return {
            indeterminate: false,
            checkAll: false
        };
    },
    watch: {
        selectList(val) {
            if (val.length == 0) {
                this.checkAll = false;
            }
        }
    },
    mounted() {},
    methods: {
        handleCheckAll() {
            let list = [];
            if (this.indeterminate) {
                this.checkAll = false;
            } else {
                this.checkAll = !this.checkAll;
            }
            this.indeterminate = false;
            if (this.checkAll) {
                list = this.list.map((item) => item);
            } else {
                list = [];
            }
            this.$nextTick(() => {
                this.$emit('update:selectList', list);
            });
        },
        changeSelect(list) {
            if (list.length === this.list.length) {
                this.indeterminate = false;
                this.checkAll = true;
            } else if (list.length > 0) {
                this.indeterminate = true;
                this.checkAll = false;
            } else {
                this.indeterminate = false;
                this.checkAll = false;
            }
            this.$nextTick(() => {
                this.$emit('update:selectList', list);
            });
        }
    }
};
</script>

<style scoped lang="stylus">
    .class-list
        .search
            margin-bottom: 15px;

        p
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
    .class-list
        .ivu-checkbox
            margin: 0 10px;

        .ivu-input
            background-color: #fff

        .ivu-checkbox-wrapper
            span:last-child
                margin-left: 10px;
</style>
