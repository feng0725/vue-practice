<style lang="stylus" scoped>
    .expand-row
        margin-bottom: 16px;
        display: flex;
        justify-content:space-around

    .table-row
        flex: 1;
        min-height: 80px;
        padding: 0 2%;
        display: flex;
        justify-content:center;
        border-right: 1px solid #000;
        h4
            min-width:60px;
            background-color: #fff;
            height:20px;
            padding: 0 5px;
        .title
            min-width:50px;
            text-align right;
            margin: 0 15px;
            /*margin:0 3%;*/
            p
                margin-bottom: 10px;
        .text
            color: #000;
            p
                margin-bottom: 10px;
        &:last-child

            flex: 1;
            border-right: 0;
</style>
<template>
    <div>
        <Row class="expand-row clearfix">
            <div v-show="row.courseType ==0 || row.courseType==2" class="table-row clearfix fl">
                <h4 class="fl">内部课程</h4>
                <div class="title fl">
                    <p>针对分组</p>
                    <p>直播页面</p>
                    <p>分类</p>
                </div>
                <div class="text fl">
                    <p>
                        {{row.inCourseMsg.gruoupNames | notNull}}&nbsp;
                    </p>
                    <p>{{row.isShareIn | share}} &nbsp;</p>
                    <p> {{row.inCourseMsg.categoryName  | notNull}}&nbsp;</p>
                </div>
            </div>
            <div v-show="row.courseType ==1 || row.courseType==2"   class="table-row clearfix fl">
                <h4 class="fl">公开课程</h4>
                <div class="title fl">
                    <p>上架公众号</p>
                    <p>是否收费</p>
                    <p>分类</p>
                </div>
                <div class="text fl">
                    <p>
                        {{row.outCourseMsg.appName  | notNull}}&nbsp;
                    </p>
                    <p> {{row.outCourseMsg.isFreeOut | free}}&nbsp;</p>
                    <p>{{row.outCourseMsg.categoryName  | notNull}}&nbsp;</p>
                </div>
            </div>
            <div class="table-row clearfix fl">
                <!--<h4 class="fl">内部课程</h4>-->
                <div class="title fl">
                    <p>考试</p>
                    <p>主讲教师</p>
                </div>
                <div class="text fl">
                    <p>
                        {{row.examMsg.examPaperName  | notNull}}&nbsp;
                    </p>
                    <p> {{row.examMsg.lecturerName  | notNull}}&nbsp;</p>
                </div>
            </div>
        </Row>
    </div>
</template>
<script>
export default {
    props: {
        row: Object
    },
    data() {
        return {
        };
    },
    mounted() {
    },
    filters: {
        notNull(val) {
            return val == '' ? '无' : val;
        },
        share(val) {
            return val == 0 ? '不分享' : '分享';
        },
        free(val) {
            return val == 0 ? '收费' : '免费';
        }
    }
};
</script>
