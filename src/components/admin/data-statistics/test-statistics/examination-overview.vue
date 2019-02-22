<template>
    <div class="examination-overview edit-new">
        <header>
            <div  class="icon-box" @click="$router.back()" >
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-left"></use>
                </svg>
            </div>
            <div class="title">
                考试概况
            </div>
        </header>
        <div class="wrapper ">
            <div class="header1">
                <div class="info">
                    <p>参与人数 <span>{{obj.headMap.sum}}</span></p>
                </div>
                <div>
                    <p class="t1">优秀人数</p>
                    <p class="n1"><span>{{obj.headMap.goodNum}}</span></p>
                    <p>占比<span>{{obj.headMap.goodPercent}}</span></p>
                </div>
                <div>
                    <p  class="t1">及格人数</p>
                    <p  class="n1"><span>{{obj.headMap.passNum}}</span></p>
                    <p>占比<span>{{obj.headMap.passPercent}}</span></p>
                </div>
            </div>
            <div>
                <header>题目正确率</header>
                <ul class="topic-list clearfix">
                    <li v-for="(item,index) in obj.questionPercent">
                        <span class="number">{{index+1}}.</span>
                        <span class="rate" >{{item.questionRightPercent}}</span>
                    </li>
                </ul>
            </div>
            <div>
                <header>知识点掌握情况</header>
                <div id="main"  :style="{height:charHeight}"></div>
            </div>
        </div>
    </div>

</template>

<script>
var echarts = require('echarts');

export default {
    name: 'addAdmin',
    data() {
        return {
            charHeight: '250px',
            char: null,
            obj: {
                knowPercent: [
                    {
                        knowRightPercent: '',
                        knowName: ''
                    }
                ],
                questionPercent: [
                    {
                        questionRightPercent: ''
                    },
                    {
                        questionRightPercent: ''
                    },
                    {
                        questionRightPercent: ''
                    }
                ],
                headMap: {
                    goodNum: '',
                    passNum: '',
                    sum: '',
                    passPercent: '',
                    goodPercent: ''
                }
            }
        };
    },
    mounted() {

        this.$fetch({
            url: '/system-backend/examStatisticBack/selectExamDetils',
            data: {
                examPaperId: this.$route.params.examPaperId
            }
        }).then((res) => {
            this.obj = res.obj;
            this.setCharHeight(this.obj.knowPercent);
            this.$nextTick(() => {
                this.setChar(this.obj.knowPercent);
            });
        });
    },
    methods: {
        setCharHeight(data){
            if (data.length >= 5) {
                this.charHeight = `${data.length * 30}px`;
            }
        },
        setChar(data) {
            this.char = echarts.init(document.getElementById('main'));
            let option = {
                color: ['#1592f8'],
                title: {},
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    top: 20,
                    bottom: 30,
                    containLabel: true
                },
                xAxis: {
                    name: '正确率百分比',
                    type: 'value',
                    splitLine: { show: false }
                },
                yAxis: {
                    type: 'category',
                    axisTick: { alignWithLabel: true },
                    data: data.map((item) => item.knowName)
                },
                series: [
                    {
                        name: '正确率',
                        type: 'bar',
                        barWidth: '10',
                        stack: '总量',
                        data: data.map((item) => parseFloat(item.knowRightPercent))
                    }
                ]
            };
            this.char.setOption(option);
        }
    }
};
</script>

<style scoped lang="stylus">

    #main
        width:1100px;
        margin:0 auto;
    .wrapper
        position: relative;
        width: 1150px;
        min-height: 500px;
        padding: 20px;
        background-color: #fff;
        margin: 0 auto;
        .header1
            text-align: center;
            display: flex;
            justify-content :center;
            align-items :center;
            .info
                width:auto;
                background-color: #fff
                height:auto;
                span
                    color:#71a6e1;
            p
                span
                    color:#48c3ac
            >div
                display:inline-block;
                width:140px;
                height:100px;
                margin:0 15px;
                background-color: #f6f8fa;
                text-align: center;
                &:first-child
                    margin-top:0;
                .t1
                    margin:15px 0;
                .n1
                   margin-bottom:5px;

    .topic-list
        li
            float: left
            .number
                display: inline-block;
                width:20px;
                text-align: right;
            .rate
                display: inline-block;
                background-color: #e6f1fc
                text-align: center;
                width:65px;
                height:30px;
                line-height:30px;
                margin:0 15px 25px 6px;

</style>
<style lang="stylus">
</style>
