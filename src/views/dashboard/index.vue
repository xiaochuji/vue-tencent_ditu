<template>
  <div class="dashboard-container">
    <div id="main"></div>
    <div id="chartColumn"></div>
    <div id="myChart"></div>
    <div id="main">
      <ul>
        <li style="width:100%;height:30px;display: flex;justify-content: space-between;" v-for="(item,ind) in list" :key="ind">
          <span>{{item.name}}</span>
          <span>{{item.dept}}</span>
          <span>{{item.num}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import {cardCount } from '@/api/home/first'
// 引入柱状图
require('echarts/lib/chart/bar')
export default {
  name: '',
  data() {
    return {
      list: [
        {
          name: '用户',
          dept: '部门',
          num: '个数'
        },
        {
          name: '用户1',
          dept: '部门1',
          num: '个数'
        },
        {
          name: '用户2',
          dept: '部门2',
          num: '个数'
        },
        {
          name: '用户3',
          dept: '部门3',
          num: '个数'
        }
      ],
      chartColumn: null,
      charts: '',
      opinion:['执行总额','已经执行'],
      type: 'pie',
      opinionData: []
    }
  },
  methods: {
    drawLine() {
      this.chartColumn = echarts.init(document.getElementById('chartColumn'))
      this.chartColumn.setOption({
        title: { text: '折线展示' },
        tooltip: {},
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line'
        }]
      })
    },
    drawPie(id) {
      this.charts = echarts.init(document.getElementById(id))
      this.charts.setOption({
        color: ['#4dc86f', '#FF0000', '#8A2BE2'], /*饼状图的颜色*/
        tooltip: {
          trigger: 'item',
          formatter: "{b}({d}%)",/*饼状图触碰之后显示的注释文字*/
        },
        title: { text: '打卡情况展示' },
        legend: {
          left: 'center', /*标签文字排成一行*/
          y: 'bottom', /*在垂直方向上的底部*/
          data: this.opinion,
        },
        series: [
          {
            type: 'pie',   //饼状图
            center: ['50%', '40%'],    //显示位置
            name:'',
            type:'pie',
            radius:['0%','60%'],/*空心圆的占比*/
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              },
              normal: {
                borderWidth: 5,/*隔开的白色边界*/
                borderColor: '#fff',/*border*/
                // labelLine :{show:true}
              }
            },
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: true,
                position: 'inner',
                textStyle: {
                  fontWeight: 200,
                  fontSize: 20   //文字的字体大小
                },
                formatter: '{d}%',/*饼状图内显示百分比*/
                // data:['40%','60%'],
              },

              emphasis: {
                show: false,/*空心文字出现*/
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data:this.opinionData
          }
        ]
      })
    },
    drawZhu() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('myChart'))
      myChart.setOption({ // 绘制图表
        title: { text: '数据柱状展示' },
        tooltip: {},
        xAxis: {
          data: ["1部门", "2部门", "3部门", "4部门", "5部门", "6部门"]
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }]
      })
    },
    getList() {
      cardCount({
        firmId: localStorage.getItem('detid')
      }).then(res => {
        if (res.res) {
          let num = res.list.arriveNum
          let num1 = res.list. notArriveNum
          let num2 = res.list.unCard
          this.opinionData = [
            { value: num, name: '到公司上班' },
            { value: num1, name: '未到公司上班人数' },
            { value: num2, name: '未打卡人数' }
          ]
          this.drawPie('main')
        }
      })
    }
  },
  // 调用
  mounted() {
    this.drawLine()
    this.drawZhu()
    this.getList()
  }
}
// }
</script>
<style lang="scss">
@import url("../../pages/public.css");
* {
  box-sizing: border-box;
}
.welcome {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 100px;
  letter-spacing: 4px;
  margin-top: 20%;
}
li {
  list-style: none;
}
#main{
  width: 50%;
  height: 400px
}
#chartColumn{
  width: 50%;
  height: 400px
}
#myChart{
  width: 50%;
  height: 400px
}
.app-main{
  width: 100%;
  height: 100%
}
.dashboard-container{
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  height: 100%;
  overflow-y: auto
}
.lis {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
}
.dashboard-container {
  // height: calc(100vh - 84px);
  background: #e4e4e4;
  padding: 40px 50px;
  box-sizing: border-box;
}
.doxShow {
  width: 100%;
  height: 140px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
  dl {
    height: 140px;
    width: 295px;
    margin: 0;
    padding-top: 45px;
    text-align: center;
    color: #fff;
    dt {
      text-align: center;
      height: 44px;
      box-sizing: border-box;
      padding-right: 10px;
      font-size: 30px;
    }
  }
}
.see_table {
  width: 100%;
  // height: 400px;
  background: #fff;
  padding: 10px;
  margin-bottom: 35px;
  .detail_table {
    margin-top: 20px;
    margin-left: 45px;
    height: 220px;
    display: flex;
    justify-content: space-between;
  }
}
.btm_table {
  width: 100%;
  height: 300px;
  display: flex;
  .rent_control {
    width: 49%;
    background: #fff;
    padding: 15px;
  }
  .message_reminding {
    width: 50%;
    height: 100%;
    background: #fff;
    margin-left: 1%;
    padding: 15px;
  }
}
</style>
