<template>
    <div class="page clearfix">
        <Button :disabled="model==1" @click="firstPage" size="small"> 第一页</Button>
        <Button @click="prive" size="small">上一页</Button>
        <Select  v-model="model" @on-change="changePage" style="width:80px" size="small">
            <Option :value="item.value" :label="item.showInfo" v-for="(item,index) in itemList" :key="item.value">
                <span>{{item.label}}</span>
            </Option>
        </Select>
        <Button  @click="next" size="small">下一页</Button>
        <Button :disabled="model==PageCount" @click="lastPage" size="small">最后一页</Button>
    </div>

</template>

<script>
export default {
    name: 'page',
    props: ['count', 'page'],
    computed: {
        PageCount() {
            return this.count || 0;
        }
    },
    watch: {
        PageCount() {
            this.setCout();
        },
        page() {
            this.model = this.page;
        }
    },
    data() {
        return {
            falg: true,
            itemList: [],
            datas: [],
            model: this.page || 1
        };
    },
    mounted() {
        this.setCout();
    },
    methods: {
        firstPage() {
            this.model = 1;
            this.$emit('on-change', this.model);
        },
        lastPage() {
            this.model = this.PageCount;
            this.$emit('on-change', this.model);
        },
        changePage(page) {
            if (page && this.flag) {
                this.$emit('on-change', page);
            }
        },
        setCout() {
            this.flag = false;
            this.datas = [];
            this.itemList = [];
            this.model = null;
            for (let i = 0; i < this.PageCount; i++) {
                let index = i + 1;
                this.datas.push({
                    label: index,
                    value: index,
                    showInfo: `${index}/${this.PageCount}`
                });
            }
            //
            if (this.PageCount == 0) {
                this.datas.push({
                    label: 1,
                    value: 1,
                    showInfo: `1/0`
                });
            }
            this.itemList = this.$tools.cloneObj(this.datas);
            setTimeout(() => {
                this.model = 1;
            }, 100);
            this.flag = true
        },
        prive() {
            this.flag = true;
            this.model--;
            this.model = this.model <= 0 ? 1 : this.model;
            this.$emit('on-change', this.model);
        },
        next() {
            this.flag = true;
            this.model++;
            this.model =
                this.model > this.PageCount ? this.PageCount : this.model;
            this.$emit('on-change', this.model);
        }
    }
};
</script>

<style scoped lang="stylus">
    .page
        > div
            width: 30px;
            height: 25px;
            float: left;
            border: 1px solid #d1d2d3;
            cursor: pointer;
        button
            float: left;
            border-radius: 0;
        .ivu-btn-small
            padding-top: 2px;
</style>
<style lang="stylus">
    .page
        .ivu-select-selection
            border: 0;
        .ivu-select-small.ivu-select-single .ivu-select-selection
            height: 23px;
</style>
