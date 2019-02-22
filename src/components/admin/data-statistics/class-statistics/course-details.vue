<template>
    <div class="course-details edit-new">
        <header>
            <div class="icon-box" @click="$router.back()">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-left"></use>
                </svg>
            </div>
            <div class="title">
                课程个人消耗课时
            </div>
        </header>

        <div class="wrapper clearfix">
            <div class="table-box tableList">
                <Table :columns="table.columns" :data="table.data"></Table>

            </div>
            <div class="clearfix page-info absolute">
                <div class="fl">已选0项,共{{table.total}}项</div>
                <myPage class="fr page" :page="search.pageNo" @on-change="changePage" :count="count"></myPage>
                <div class="fr">每页显示行:10行</div>
            </div>
        </div>
    </div>

</template>

<script>
export default {
    name: 'addAdmin',
    data() {
        return {
            count: 0,
            table: {
                total: 0,
                count: 0,
                data: [],
                columns: [
                    {
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },

                    {
                        title: '编号',
                        key: 'userId',
                        align: 'center'
                    },
                    {
                        title: '姓名',
                        key: 'nickname',
                        align: 'center'
                    },
                    {
                        title: '所属课程',
                        key: 'courseName',
                        align: 'center'
                    },
                    {
                        title: '消耗课时',
                        key: 'consumePeriodSum',
                        align: 'center',
                        className: 'fontBlue',
                        render: (h, params) => {
                            let text = params.row.consumePeriodSum;
                            text = this.timeFormat(text);
                            return h('div', {}, text);
                        }
                    }
                ]
            },
            search: {
                courseId: this.$route.params.courseId,
                orderRule: '',
                pageNo: 1,
                pageSize: 10
            }
        };
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        getTableData() {
            this.$fetch({
                url: '/system-backend/periodStatisticsBack/selectCourseIndividualPeriodConsumeList',
                data: this.search
            }).then((res) => {
                this.table.data = res.obj.list;
                this.table.total = res.obj.total;
                this.count = res.obj.pageNum;
            });
        },
        changePage(index) {
            this.search.pageNo = index;
            this.getTableData();
        },
        timeFormat(val) {
            let hour = Math.floor(val / 60);
            let min = val % 60;
            return val < 60 ? `${min}分钟` : `${hour}小时${min}分钟`;
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
        .change-item
            padding: 0 30px 0 70px;
            .label
                position: absolute;
                width: 50px;
                left: -50px;
        .table-box
            position: relative;
            background-color: #f6f8fa
            .label
                position: absolute;
                width: 50px;
                left: -60px;
        .title-box
            position: relative;
            padding: 8px 0;
            margin-bottom: 28px;
            background-color: #f6f8fa
            .title
                color: #939494
                margin: 0 10px;
            .con
                color: #000;
                margin-right: 25px;

        .btn-box
            width: 100%;
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #e6e8ee;
            .btn
                width: 115px;
                margin-right: 30px;

    .page-info
        left:20px;
        right:20px;
</style>
<style lang="stylus">
    .course-details
        .tree
            > ul
                padding: 5px 0;
                padding-left: 15px;
                border-bottom: 1px solid #e7e9ee;
</style>
