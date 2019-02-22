<template>
    <div class="classification edit-new">
       <div class="min-height bgfff wrapper">
           <ul class="list-wrapper">
               <li>
                   <div>类别名称</div>
                   <div>课程数量</div>
                   <div>操作</div>
               <li :class="{ second: item.p.length ==2, third: item.p.length ==3 }" v-for="(item,index) in tmp" v-show="item.show">
                   <div @click="console(item,index)">
                       <div :style="{paddingLeft:item.p.length * 50-50 + 'px'}">
                           <div class="icon-box">
                               <Icon @click="toggleItem(item,index,tmp)" class="pointer"
                                     v-if="item.expand && item.childCategories.length !==0  " type="md-arrow-dropdown"/>
                               <Icon @click="toggleItem(item,index,tmp)" class="pointer"
                                     v-if="!item.expand  && item.childCategories.length !==0   " type="md-arrow-dropright"/>
                           </div>
                           <Icon v-show="item.p.length == 1"  type="ios-bookmark-outline"/>


                           <span class="name">{{item.categoryName}}</span>
                           <div class="icon-box2">
                               <Icon color="#71D5C4"  class="pointer" @click.stop="showPop({item,index},$event)" type="md-create"/>
                           </div>
                       </div>

                   </div>
                   <div>

                       <span class="name">{{item.categoryNum}}</span>
                   </div>
                   <div>
                    <Button type="text" :disabled="item.p.length ==3" @click="addChild(item,index,tmp)" class="textBlue pointer"
                          style="margin-right: 40px;">添加子分类</Button>
                       <span @click="deleteTree(item,index,tmp)" class="textError pointer">删除</span>

                   </div>
               </li>
           </ul>
           <div @click="addSort" class="textBlue addSort">
               <Icon class="icon" type="md-add"/>
               添加分类
           </div>
           <div class="ivu-poptip-popper" @click.stop.prevent="" :style="{top:poptip.top+20+'px',left:poptip.left+'px'}" v-show="poptip.visible">
               <div class="ivu-poptip-content">
                   <div class="ivu-poptip-arrow"></div> <!---->
                   <div class="ivu-poptip-inner">
                       <div class="ivu-poptip-title">
                           <div class="ivu-poptip-title-inner">修改分类名称</div>
                       </div>
                       <div class="ivu-poptip-body">
                           <div class="ivu-poptip-body-content">
                               <div class="api">
                                   <div
                                       class="ivu-input-wrapper ivu-input-wrapper-default ivu-input-type"><!----> <!---->
                                       <i class="ivu-icon ivu-icon-ios-loading ivu-load-loop ivu-input-icon ivu-input-icon-validate"></i>
                                       <Input v-model="value" placeholder=""  :maxlength="25" />
                                   </div>
                                   <p>支持中文、数字、最多25个字符</p>
                                   <div style="text-align: right;"><span
                                       class="textBlue" @click="updateName">确定</span>
                                       <span @click="poptip.visible = false">取消</span></div>
                               </div>
                           </div>
                       </div>
                   </div>
               </div>
           </div>
       </div>

        <MyDialog @ok="deleteSort" :title="'删除分类'" :visible.sync="isDelete">
            <div style="">
                确定要删除该分类?
            </div>
        </MyDialog>
        <MyDialog @ok="isDeletefail = false" :title="'删除'" :visible.sync="isDeletefail">
            <div style="">
                请先将该分类下课程移至其他分类,再删除该项分类!
            </div>
        </MyDialog>
    </div>
</template>

<script>
export default {
    name: 'course',
    data() {
        return {
            isDeletefail: false,
            poptip: {
                top: 200,
                left: 200,
                visible: false
            },
            visible: false,
            value: '',
            sortNameArr: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],
            isDelete: false,
            selected: {
                index: 0,
                item: {}
            },
            tmp: [],
            id: 999,

            list: []
        };
    },
    mounted() {
        document.addEventListener(
            'click',
            () => {
                if (this.poptip.visible) {
                    this.poptip.visible = false;
                }
            },
            false
        );
        let obj = [
            {
                categoryId: 13,
                parentId: 0,
                categoryName: '中文系',
                series: 1,
                categoryNum: 70,
                childCategories: [
                    {
                        categoryId: 16,
                        parentId: 13,
                        categoryName: '作文及阅读理解',
                        series: 2,
                        categoryNum: 66,
                        childCategories: [
                            { categoryId: 17, parentId: 16, categoryName: '其他', series: 3, categoryNum: 22 },
                            { categoryId: 18, parentId: 16, categoryName: '作文', series: 3, categoryNum: 10 },
                            { categoryId: 20, parentId: 16, categoryName: '阅读理解', series: 3, categoryNum: 6 }
                        ]
                    }
                ]
            },
            {
                categoryId: 14,
                parentId: 0,
                categoryName: '数学',
                series: 1,
                categoryNum: 10,
                childCategories: [
                    { categoryId: 43, parentId: 14, categoryName: '圆规率是怎样诞生的', series: 2, categoryNum: 7 },
                    { categoryId: 146, parentId: 14, categoryName: '二级分类', series: 2, categoryNum: 1 }
                ]
            },
            {
                categoryId: 36,
                parentId: 0,
                categoryName: '思想品德',
                series: 1,
                categoryNum: 33,
                childCategories: [{ categoryId: 105, parentId: 36, categoryName: '2321', series: 2, categoryNum: 2 }]
            },
            {
                categoryId: 44,
                parentId: 0,
                categoryName: '历史',
                series: 1,
                categoryNum: 3,
                childCategories: [
                    {
                        categoryId: 45,
                        parentId: 44,
                        categoryName: '中国的历史是怎样形成的',
                        series: 2,
                        categoryNum: 3,
                        childCategories: [
                            {
                                categoryId: 46,
                                parentId: 45,
                                categoryName: '中国发展的原型版图',
                                series: 3,
                                categoryNum: 3
                            }
                        ]
                    }
                ]
            },
            {
                categoryId: 47,
                parentId: 0,
                categoryName: '生物',
                series: 1,
                categoryNum: 7,
                childCategories: [
                    {
                        categoryId: 48,
                        parentId: 47,
                        categoryName: '人类进化的趋势图',
                        series: 2,
                        categoryNum: 7,
                        childCategories: [
                            {
                                categoryId: 49,
                                parentId: 48,
                                categoryName: '人类是从古猿来的吗',
                                series: 3,
                                categoryNum: 7
                            }
                        ]
                    }
                ]
            },
            {
                categoryId: 50,
                parentId: 0,
                categoryName: '英语',
                series: 1,
                categoryNum: 3,
                childCategories: [
                    {
                        categoryId: 51,
                        parentId: 50,
                        categoryName: '香蕉用英语怎么读',
                        series: 2,
                        categoryNum: 3,
                        childCategories: [
                            {
                                categoryId: 52,
                                parentId: 51,
                                categoryName: '外国人怎么起中国名？',
                                series: 3,
                                categoryNum: 3
                            }
                        ]
                    }
                ]
            },
            {
                categoryId: 53,
                parentId: 0,
                categoryName: '化学',
                series: 1,
                categoryNum: 2,
                childCategories: [
                    {
                        categoryId: 54,
                        parentId: 53,
                        categoryName: '可口可乐是如何诞生的？',
                        series: 2,
                        categoryNum: 2,
                        childCategories: [
                            {
                                categoryId: 55,
                                parentId: 54,
                                categoryName: '可口可乐是否添加了催化剂',
                                series: 3,
                                categoryNum: 0
                            },
                            { categoryId: 56, parentId: 54, categoryName: '可乐源自美国', series: 3, categoryNum: 2 }
                        ]
                    }
                ]
            },
            {
                categoryId: 65,
                parentId: 0,
                categoryName: '地理',
                series: 1,
                categoryNum: 1,
                childCategories: [
                    { categoryId: 66, parentId: 65, categoryName: '澳大利亚地图', series: 2, categoryNum: 0 },
                    { categoryId: 68, parentId: 65, categoryName: '中国地图', series: 2, categoryNum: 1 },
                    { categoryId: 71, parentId: 65, categoryName: '美国地图', series: 2, categoryNum: 0 },
                    { categoryId: 75, parentId: 65, categoryName: '厄瓜多尔地图', series: 2, categoryNum: 0 },
                    { categoryId: 76, parentId: 65, categoryName: '俄罗斯地图', series: 2, categoryNum: 0 },
                    { categoryId: 77, parentId: 65, categoryName: '加拿大地图', series: 2, categoryNum: 0 },
                    { categoryId: 81, parentId: 65, categoryName: '南非地图', series: 2, categoryNum: 0 },
                    { categoryId: 82, parentId: 65, categoryName: '意大利地图', series: 2, categoryNum: 0 },
                    { categoryId: 83, parentId: 65, categoryName: '荷兰地图', series: 2, categoryNum: 0 },
                    { categoryId: 84, parentId: 65, categoryName: '法国地图', series: 2, categoryNum: 0 },
                    { categoryId: 85, parentId: 65, categoryName: '英国地图', series: 2, categoryNum: 0 },
                    { categoryId: 87, parentId: 65, categoryName: '朝鲜地图', series: 2, categoryNum: 0 },
                    { categoryId: 88, parentId: 65, categoryName: '韩国地图', series: 2, categoryNum: 0 },
                    { categoryId: 89, parentId: 65, categoryName: '日本地图', series: 2, categoryNum: 0 },
                    { categoryId: 90, parentId: 65, categoryName: '南非地图', series: 2, categoryNum: 0 },
                    { categoryId: 91, parentId: 65, categoryName: '巴西地图', series: 2, categoryNum: 0 },
                    { categoryId: 92, parentId: 65, categoryName: '阿根廷地图', series: 2, categoryNum: 0 },
                    { categoryId: 93, parentId: 65, categoryName: '巴基斯坦地图', series: 2, categoryNum: 0 },
                    { categoryId: 94, parentId: 65, categoryName: '伊拉克地图', series: 2, categoryNum: 0 },
                    { categoryId: 95, parentId: 65, categoryName: '伊朗地图', series: 2, categoryNum: 0 },
                    { categoryId: 96, parentId: 65, categoryName: '印度地图', series: 2, categoryNum: 0 }
                ]
            }
        ];
        // this.$fetch({
        //     url: '/system-backend/categoryBack/selectCategoryListUcans',
        //     data: {
        //         userId: this.$store.state.userInfo.userId
        //     }
        // }).then((res) => {
        this.drawTable(obj);
        // });
    },
    methods: {
        /**
         *  画表格
         */
        drawTable(arr) {
            this.list = [];
            this.getTableData(arr);
            this.tmp = this.$tools.cloneObj(this.list);
        },
        /**
         * 数据格式
         * @param arr
         * @param parentId
         */
        getTableData(arr, parentId = []) {
            arr.forEach((item) => {
                if (item.p) {
                    item.p.push(item.parentId);
                } else {
                    item.p = [].concat(parentId);
                    item.p.push(item.parentId);
                }
                item.show = item.p.length == 1;
                this.list.push(item);
                if (!item.childCategories) {
                    item.childCategories = [];
                }
                if (item.childCategories && item.childCategories.length > 0) {
                    item.expand = false;
                    this.getTableData(item.childCategories, item.p);
                }
            });
        },

        /**
         * 更新名字
         */
        updateName() {
            let index = this.selected.index;

            // this.$fetch({
            //     url: '/system-backend/categoryBack/updateCategoryName',
            //     data: {
            //         categoryId: this.tmp[index].categoryId,
            //         categoryName: this.value
            //     }
            // })
            //     .then((res) => {
            //         if (res.code == 200) {
            this.tmp[index].categoryName = this.value;
            this.poptip.visible = false;
            this.value = '';
            this.$Message.success('修改成功');
            // } else {
            //     this.$Message.error(res.msg);
            // }
            // })
            // .catch((error) => {
            //     this.poptip.visible = false;
            //     this.value = '';
            // });
        },
        close() {
            this.visible = false;
        },
        /**
         * 显示修改名字模态框
         * @param selected
         * @param event
         */
        showPop(selected, event) {
            this.selected = selected;
            let top = event.currentTarget.offsetTop;
            let left = event.currentTarget.offsetLeft;
            this.poptip.left = left;
            this.poptip.top = top;
            this.poptip.visible = true;
        },
        closePoptip(item, index) {
            item.visible = false;
        },
        /**
         * 添加一级类别
         */
        addSort() {
            // this.$fetch({
            //     url: '/system-backend/categoryBack/addCategory',
            //     data: {
            //         parentId: 0,
            //         categoryName: '一级分类',
            //         series: 1
            //     }
            // }).then((res) => {
            //     if (res.code == 200) {
            this.id++;
            this.tmp.push({
                categoryId: this.id,
                p: [0],
                expand: false,
                show: true,
                categoryName: '一级分类',
                parentId: 0,
                childCategories: []
            });
            // } else {
            //     this.$Message.error(res.msg);
            // }
            // });
        },
        // 删除
        deleteTree(list, index, arr) {
            this.selected = {
                list: list,
                index: index
            };
            console.log(list);
            if (list.childCategories && list.childCategories.length > 0) {
                this.isDeletefail = true;
            } else {
                this.isDelete = true;
            }
        },
        // 删除
        deleteSort() {
            // this.$fetch({
            //     url: '/system-backend/categoryBack/deleteCategory',
            //     data: {
            //         categoryId: this.selected.list.categoryId
            //     }
            // }).then((res) => {
            //     if (res.code == 200) {
            let list = this.selected.list;
            let index = this.selected.index;
            let father = this.tmp.find((item) => {
                return item.categoryId == list.parentId;
            });
            this.tmp = this.tmp.filter((item) => {
                return item.p.indexOf(list.categoryId) == -1;
            });
            if (father) {
                father.childCategories = father.childCategories.filter((item) => {
                    return item.categoryId != list.categoryId;
                });
            }
            this.$Message.success('删除成功');
            this.tmp.splice(index, 1);
            this.isDelete = false;
            //     } else {
            //         this.$Message.error(res.msg);
            //     }
            // });
        },
        // 添加子集
        addChild(list, index, arr) {
            let name = `${this.sortNameArr[list.p.length]}级分类`;
            // this.$fetch({
            //     url: '/system-backend/categoryBack/addCategory',
            //     data: {
            //         parentId: list.categoryId,
            //         categoryName: name,
            //         series: list.p.length + 1
            //     }
            // }).then((res) => {
            //     if (res.code == 200) {
            this.id++;
            var obj = {
                categoryId: this.id,
                p: [].concat(list.p, list.categoryId),
                expand: false,
                show: true,
                categoryName: name,
                parentId: list.categoryId,
                childCategories: []
            };
            if (!list.childCategories) {
                list.childCategories = [];
            }
            list.childCategories.push(obj);
            list.expand = true;
            let length = list.childCategories.length + index;
            console.log(list.childCategories.length, index);
            this.tmp.splice(length, 0, obj);
            this.$Message.success('添加成功');
            // } else {
            //     this.$Message.error(res.msg);
            // }
            // });
        },
        changePage(index) {},
        // 展开 折叠
        toggleItem(list, index, arr) {
            // 折叠
            if (list.expand) {
                this.tmp.forEach((item, index) => {
                    //
                    // if (item.p[item.p.length - 1] == list.id) {
                    if (item.p.indexOf(list.categoryId) != -1) {
                        item.show = false;
                        this.tmp = [].concat(this.tmp);
                    }
                });
            } else {
                // 展开
                this.tmp.forEach((item, index) => {
                    //
                    // if (item.p.indexOf(list.categoryId) != -1) {
                    if (item.p[item.p.length - 1] == list.categoryId) {
                        item.show = true;
                        this.expand(item);
                        this.tmp = [].concat(this.tmp);
                    }
                });
            }
            list.expand = !list.expand;
        },
        console(item, index) {},
        expand(list) {
            if (list.expand) {
                this.tmp.forEach((item, index) => {
                    //
                    // if (item.p.indexOf(list.categoryId) != -1) {
                    if (item.p[item.p.length - 1] == list.categoryId) {
                        item.show = true;
                        this.expand(item);
                        this.tmp = [].concat(this.tmp);
                    }
                });
            }
        }
    }
};
</script>
<style scoped lang="stylus">

    .classification
        position: relative;
        padding: 20px 50px 0 50px
    .wrapper
        margin:0 auto;
        max-width:1300px;
        padding: 20px 50px 50px 50px
    .list-wrapper
        background-color: #fff
        li
            display: flex;
            justify-content: space-around;
            align-items: center;
            height: 40px;
            border-bottom: 1px solid #e6e8ee;
            line-height: 40px;
            &.second
                background-color: #fcfcfc;
            &.third
                background-color: #f9f9f9;

            > div
                text-align: left;
                width:200px;
                margin-right:40px;
                button
                    padding:0
                    &[disabled]
                        color:#c5c8ce
                &:first-child
                    padding-left:40px;
                    flex:1;
                    text-align: left;
                    .icon-box2
                        float: right;
                .icon-box
                    display: inline-block;
                    width: 20px;
                .name
                    display: inline-block;
                    text-align: left

    .addSort
        width: 90px;
        height: 30px;
        margin-top: 20px;
        line-height: 30px;
        text-align: center;
        cursor: pointer;
        background-color: #f2f2f2
        .icon
            font-size: 16px;
            margin-top: -1px;

    .api

        p
            margin-top: 6px;
        div

            span
                display: inline-block
                width: 30px;
                height: 30px;
                cursor: pointer;
                text-align: left;
                line-height: 30px;
</style>
<style lang="stylus">
    .classification
        .ivu-poptip-popper
            width: 370px;
            height: 180px;
            text-align: left;
        .ivu-poptip-arrow
            left: 20px;
            top: -8px;
            border-width: 0 7px 7px;
            border-bottom-color: hsla(0,0%,85%,.5);
        .ivu-poptip-arrow:after
            content: " ";
            top: 1px;
            margin-left: -7px;
            border-top-width: 0;
            border-bottom-width: 7px;
            border-bottom-color: #fff;
</style>
