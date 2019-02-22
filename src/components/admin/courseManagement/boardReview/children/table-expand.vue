<style lang="stylus" scoped>
    .expand-row {
        margin-bottom: 16px;
    }

    .table-row
        height: 80px;
        padding:0 2%;
        border-right: 1px solid #000;
        h4
            background-color: #fff;
            padding:0 5px;
        .title
            text-align right;
            margin:0 15px;
            /*margin:0 3%;*/
            p
                margin-bottom:10px;
        .text
            color:#000;
            p
                margin-bottom:10px;
        &:last-child
            border-right:0;
</style>
<template>
    <div>
        <Row class="expand-row clearfix">
            <div class="table-row clearfix fl">
                <h4 class="fl">内部课程</h4>
                <div class="title fl">
                    <p>针对分组</p>
                    <p>直播页面</p>
                    <p>分类</p>
                </div>
                <div class="text fl">
                    <p>
                        美工强化小分队
                    </p>
                    <p>分享</p>
                    <p>一类名称-二类名称-三类名称</p>
                </div>
            </div>
            <div class="table-row clearfix fl">
                <h4 class="fl">公开课程</h4>
                <div class="title fl">
                    <p>上架公众号</p>
                    <p>是否收费</p>
                    <p>分类</p>
                </div>
                <div class="text fl">
                    <p>
                        自己的公众号,友看在线
                    </p>
                    <p>收费</p>
                    <p>一类名称-二类名称-三类名称</p>
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
                        网页基础布局实例测试,美工节课测试
                    </p>
                    <p>王老师,李老师,张老师</p>
                </div>
            </div>
        </Row>
    </div>
</template>
<script>
export default {
    props: {
        row: Object
    }
};
</script>
