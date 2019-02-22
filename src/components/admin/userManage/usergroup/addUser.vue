<template>
    <div class="addUser ">
        <div class="right ">
            <div class="clearfix">
                <div class="fl">
                    <h4>用户列表(共{{userList.length}}条)</h4>

                    <Input @on-search="updateList" class="" v-model="search" style="" search enter-button
                           placeholder="输入用户名/昵称"/>
                    <Table @on-selection-change="getTmp" style="margin-top:10px;" width="300" height="310"
                           ref="selection" :columns="columns4" :data="userList"></Table>

                </div>
                <img  class="icon-switch" src="../img/switch.png" alt="">
                <div class="fr">
                    <h4>已选择({{userListSelected.length}}条)</h4>
                    <ul class="user-list">
                        <li v-for="(item,index) in userListSelected">
                            <span class="user">{{item.userAccount}}</span>
                            <span class="department">{{item.department}}</span>
                            <Icon @click="removeItem(item,index)" class="pointer fr" type="md-close"/>
                        </li>
                    </ul>
                </div>

            </div>

        </div>
    </div>

</template>

<script>
import _ from 'underscore';
export default {
    name: 'addAdmin',
    props: {
        departmentList: {
            type: Array,
            default: () => []
        },
        userList: {
            type: Array,
            default: () => []
        },
        userListSelected: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            department: '',
            search: '',
            columns4: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '用户名',
                    key: 'userAccount'
                },
                {
                    title: '昵称',
                    key: 'nickname'
                }
            ],
        };
    },
    mounted() {},
    watch: {
        userListSelected(newV, oldV) {
            if (newV.length > oldV.length) {
                this.updateList2(newV);
            }
        }
    },
    methods: {
        updateList() {
            this.$emit('updateList');
        },
        updateList2(userListSelected) {
            let list = this.$tools.cloneObj(this.userList);
            list.forEach((list) => {
                list._checked = false;
                userListSelected.forEach((item) => {
                    if (list.userId == item.userId) {
                        list._checked = true;
                    }
                });
            });
            this.$emit('update:userList', list);
        },
        getTmp(list) {
            this.tmp = list;
            this.switch();
        },
        switch() {
            let arr = _.uniq([].concat(this.tmp), true, _.iteratee('userId'));
            this.$emit('update:userListSelected', arr);
        },
        removeItem(item, index) {
            let userListSelected = this.$tools.cloneObj(this.userListSelected);
            userListSelected.splice(index, 1);
            let list = this.$tools.cloneObj(this.userList);
            list.forEach((list) => {
                list._checked = false;
                userListSelected.forEach((item) => {
                    if (list.userId == item.userId) {
                        list._checked = true;
                    }
                });
            });
            this.$emit('update:userListSelected', userListSelected);
            this.$emit('update:userList', list);
        }
    },
    updated() {}
};
</script>

<style scoped lang="stylus">
    header
        margin-bottom: 12px;
        .icon-box
            position: absolute;
            left;
            0;
            top: 0;
            width 70px;
            height: 50px;
            line-height: 50px;
            background-color: #f8f8f8;
            text-align: center;
            svg
                width: 22px;
                height: 18px;
                cursor: pointer;
                color: #117dd6;

        .title
            background-color: #fff;
            margin-left: 70px;
            height: 50px;
            line-height: 50px;
            text-indent: 2em;

    .right
            position: relative;
            width: 700px;
            h4
                margin-bottom: 5px;
            .title
                padding-bottom: 15px;
                margin-bottom: 10px;
                border-bottom: 1px solid #e6e8ee;
             >div
                 position: relative




    .user-list
        width: 300px;

        border: 2px solid #e6e8ee;
        height: 350px;
        overflow: auto;
        li
            height: 45px;
            line-height: 45px;
            border-bottom: 1px solid #e6e8ee;
            .user
                margin-right: 60px;
                margin-left: 30px;
            .department
                margin-right: 0px;
            .ivu-icon
                margin-right: 20px;
                margin-top: 15px;

    .icon-switch
        position: absolute;
        left: 340px;
        top: 50%;
        transform: translate(-50%, -50%)
</style>
<style lang="stylus">
    .addEnterpriseUser
        .ivu-table th
            background-color: #fff
</style>
