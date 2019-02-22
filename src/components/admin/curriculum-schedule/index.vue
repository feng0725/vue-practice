<template>
    <div class="all-height course two-page clearfix">
        <div class="class-box fl">
            <div class="class-wrapper">
                <h4 class=" title">
                    <span>{{listMonth}}.{{listDay}}</span>
                    <span class="blue">{{classListTitle}}</span>
                </h4>
                <div class="little-title ">课程共 <span class="blue">{{total}}</span>节</div>
                <div class="tableList">
                    <Table :columns="columns1"  height="550" :data="tableData"></Table>

                </div>
                <div class="clearfix page-info2">
                    <myPage class="fr page" :page="tableIndex" @on-change="changePage" :count="count"></myPage>
                    <div class="fr">每页显示行:10行</div>
                </div>
            </div>

        </div>
        <div @selectstart.stop.prevent class="calendar fl">
            <header>
                <transition-group mode="out-in" enter-active-class="fadeIn" leave-active-class="fadeOut">
                    <img :key="index" class="animated" v-show="index+1 == month" v-for="(item,index) in 12"
                         :src="`./static/img/weather/${index+1}.webp`" alt="">
                </transition-group>

                <span class="year">{{year}}</span>
                <span class="month-zh">{{month | toDouble}}</span>
                <span class="month-en">{{monthEn}}</span>
            </header>
            <div style="position: relative;">
                <svg @click="month--" class="icon icon-prve" aria-hidden="true">
                    <use xlink:href="#icon-fanhui"></use>
                </svg>
                <svg @click="month++" class="icon icon-next" aria-hidden="true">
                    <use xlink:href="#icon-fanhui-copy"></use>
                </svg>
                <ul class="calendar-list clearfix">
                    <li class="title">Mon</li>
                    <li class="title">Tues</li>
                    <li class="title">Wed</li>
                    <li class="title">Thur</li>
                    <li class="title">Fri</li>
                    <li class="weekend title">Sat</li>
                    <li class="weekend title">Sun</li>
                    <li :key="index" @click="getClassList(item)"
                        :class="{weekend:(index+1)%7==6||(index+1)%7==0,hasClass:item.hasClass,active:item.active}"
                        v-for="(item,index) in days">{{item.val}}
                    </li>

                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import Mock from 'mockjs';
let date = new Date();
let year = date.getFullYear();
let month = date.getMonth() + 1;
let day = date.getDate();
export default {
    name: 'index',
    data() {
        return {
            total: 0,
            initFlag: true,
            listMonth: month, // 列表月
            listDay: day, // 列表年
            tableIndex: 1, // 列表索引
            classListTitle: '今日课程', // 列表课程文字
            count: 0,
            year: year,
            month: month,
            day: day,
            monthArr: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December'
            ],
            days: [], // 存储有课
            columns1: [
                {
                    title: '上课时间',
                    key: 'sectionTime',
                    align: 'center'
                },
                {
                    title: '课程名称',
                    key: 'courseName',
                    align: 'center'
                },
                {
                    title: '小节名称',
                    key: 'sectionName',
                    align: 'center'
                },
                {
                    title: '主讲教师',
                    key: 'lecturerName',
                    align: 'center'
                },
                {
                    title: '所属机构/组织',
                    key: 'enterpriseName',
                    align: 'center'
                }
            ],
            tableData: []
        };
    },
    computed: {
        monthEn() {
            return this.monthArr[this.month - 1];
        }
    },
    watch: {
        month(newVal) {
            if (newVal < 1) {
                newVal = 12;
                this.year--;
            }
            if (newVal > 12) {
                newVal = 1;
                this.year++;
            }
            this.month = newVal;
            this.getCalendarData();
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.getCalendarData();
            this.getClassData();
        },
        /**
         * 获取课程列表数据
         */
        getClassData() {
            Mock.mock(/selectTodayCourse/, {
                success: true,
                code: '200',
                msg: '查询成功',
                obj: {
                    total: 1,
                    'list|1-10': [
                        {
                            enterpriseName: 'XXXX',
                            sectionName: '非互动直播课',
                            sectionTime: `08:00~22:00`,
                            lecturerName: Mock.Random.cname(),
                            courseName: Mock.Random.date('yyyy') + '专属课程'
                        }
                    ],
                    pageNum: 1,
                    pageSize: 10,
                    size: 1,
                    startRow: 1,
                    endRow: 1,
                    pages: 1,
                    prePage: 0,
                    nextPage: 0,
                    isFirstPage: true,
                    isLastPage: true,
                    hasPreviousPage: false,
                    hasNextPage: false,
                    navigatePages: 8,
                    navigatepageNums: [1],
                    navigateFirstPage: 1,
                    navigateLastPage: 1,
                    firstPage: 1,
                    lastPage: 1
                }
            });
            this.$fetch({
                url: '/system-backend/courseBack/selectTodayCourse',
                data: {
                    userId: this.$store.state.userInfo.userId,
                    date: this.getDateStr(),
                    pageNum: this.tableIndex,
                    pageSize: 10
                }
            }).then((res) => {
                this.tableData = res.obj.list;
                this.count = res.obj.pages;
                this.total = res.obj.total;
            });
        },
        /**
         * 获取课程日志数据
         */
        getCalendarData() {
            // this.$fetch({
            //     url: '/system-backend/courseBack/getCalendar',
            //     data: {
            //         userId: this.$store.state.userInfo.userId,
            //         date: this.getDateStr()
            //     }
            // }).then((res) => {
            let obj = [1, 5, 7, 9, 10, 15, 16, 17];
            this.getCalendar(this.year, this.month, obj);
            // });
        },
        /**
         * 表格换页
         * @param index
         */
        changePage(index) {
            this.tableIndex = index;
            this.getClassData();
        },
        /**
         * 格式化日期格式
         * @returns {string}
         */
        getDateStr() {
            return `${this.year}-${this.$tools.toDouble(this.month)}-${this.day} 00:00`;
        },
        /**
         * 日历
         * @param year
         * @param month
         * @param data
         */
        getCalendar(year, month, data) {
            this.days = [];
            let lastDay = new Date(year, month, 0).getDate();
            let firstDayofWeek = new Date(year, month - 1, 1).getDay();
            firstDayofWeek = firstDayofWeek == 0 ? 7 : firstDayofWeek;
            for (let i = 0; i < firstDayofWeek - 1; i++) {
                this.days.push({ val: '', isActive: false, hasClass: false });
            }

            for (let i = 1; i <= lastDay; i++) {
                let flag = data.indexOf(i) !== -1;
                this.days.push({ val: i, active: false, hasClass: flag });
            }
            if (this.initFlag) {
                this.initActive();
                this.initFlag = false;
            }
        },
        initActive() {
            let item = this.days.find((item) => {
                return item.hasClass && item.val == day;
            });
            if (item) {
                this.changeActive(item);
            }
        },
        /**
         * 切换激活项
         * @param item
         */
        changeActive(item) {
            this.days.forEach((item) => {
                item.active = false;
            });
            item.active = true;
            this.day = item.val;
            if (this.day == day) {
                this.classListTitle = '今日课程';
            } else {
                this.classListTitle = '课程';
            }
        },
        /**
         * 获取课程列表
         * @param item
         * @returns {boolean}
         */
        getClassList(item) {
            if (!item.hasClass) return false;
            if (item.active) return false;
            this.listDay = item.val;
            this.listMonth = this.month;
            this.changeActive(item);
            this.tableIndex = 1;
            this.getClassData();
        }
    }
};
</script>

<style scoped lang="stylus">
    .course
        padding: 50px;
        position: relative;
        height: auto;
        background-color: #fff

    .class-box
        width: 100%;
        height: 750px;
        padding-right: 540px;
        > div
            position: relative;
            height: 100%;
            margin-right: 20px;
            background-color: #f7f7f7;
            border-radius: 20px;
            padding: 20px;
            .title
                font-size: 24px;
                span:first-child
                    font-size: 32px;
                    color: #000;
            .little-title
                margin-bottom: 20px;
                margin-top: 10px;
            .blue
                color: #1c94f8

    .calendar
        position: relative;
        margin-left: -500px;
        width: 500px;
        height: 750px;
        color: #171d25;
        border-radius: 20px;
        overflow: hidden;
        background-color: #f8f8f8
        header
            position: relative
            height: 290px;
            -webkit-background-size: 100% 100%
            background-size: 100% 100%
            animation: fadeIn 5s
            img
                position: absolute;
                width: 100%;
                top: 0;
                left: 0;

        /*&.img1*/
        /*background-image: url('./img/1.png')*/
        /*&.img2*/
        /*background-image: url('./img/2.png')*/
        /*&.img3*/
        /*background-image: url('./img/3.png')*/
        /*&.img4*/
        /*background-image: url('./img/4.png')*/
        /*&.img5*/
        /*background-image: url('./img/5.png')*/
        /*&.img6*/
        /*background-image: url('./img/6.png')*/
        /*&.img7*/
        /*background-image: url('./img/7.png')*/
        /*&.img8*/
        /*background-image: url('./img/8.png')*/
        /*&.img9*/
        /*background-image: url('./img/9.png')*/
        /*&.img10*/
        /*background-image: url('./img/10.png')*/
        /*&.img11*/
        /*background-image: url('./img/11.png')*/
        /*&.img12*/
        /*background-image: url('./img/12.png')*/
        .year
            font-size: 40px;
            position: absolute
            top: 100px;
            left: 80px;
        .month-zh
            font-size: 80px;
            position: absolute;
            top: 140px;
            left: 80px;
        .month-en
            font-size: 24px;
            position: absolute;
            top: 200px;
            left: 360px;
        .weekend
            color: #d55558;
        .calendar-list
            width: 415px;
            height: 400px;
            text-align: center;
            margin: 0 auto;
            li
                float: left
                width: 48px;
                height: 45px;
                line-height: 45px;
                margin: 8px 5px;
                cursor: pointer;
                font-size: 14px;
                &.title
                    font-weight: bold;
                &.hasClass
                    background: url("./img/mr.png")
                    -webkit-background-size: 100% 100%;
                    background-size: 100% 100%;
                &.active
                    color: #fff;
                    background: url("./img/xz.png")
                    -webkit-background-size: 100% 100%;
                    background-size: 100% 100%;
        .icon-prve, .icon-next
            position: absolute;
            top: 50%
            width: 30px;
            color: #d2d2d2;
            height: 60px;
            background-color: #f0f0f0;
            cursor: pointer;
            z-index: 99;
        .icon-prve
            left: 10px;
        .icon-next
            right: 10px;

    .page-info2
        width: 100%;
        position: absolute;
        bottom: 20px;
        right: 20px;
        left:0;
        margin-top: 30px;
        .page
            margin-top: 20px;
            margin-left: 25px;
        > div
            margin-top: 18px;
            height: 30px;
            line-height: 30px;
</style>
<style lang="stylus">
    .course
        .class-wrapper
            tr
                height: 50px;

</style>
