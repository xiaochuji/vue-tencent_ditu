<template>
  <div class="user-wrapper">
    <el-row class="list-wrapper">
      <div class="findList">
        <div class="find">
          <span>日期：</span>
            <el-date-picker
            v-model="value1"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="-"
            start-placeholder="开始日期"
            style="width:65%"
            size="mini"
            end-placeholder="结束日期">
            </el-date-picker>
        </div>
        <div class="find">
          <span>组织机构名称：</span>
          <input v-model="organ" type="text" size="mini" style="width:65%">
        </div>
        <div class="find">
          <span>姓名：</span>
          <input v-model="userName" type="text" size="mini" style="width:65%">
        </div>
      </div>
      <div class="findList">
        <div class="find">
          <span>上下班时间：</span>
            <el-time-picker
            is-range
            v-model="value2"
            value-format="HH:mm:ss"
            range-separator="-"
            start-placeholder="上班时间"
            style="width:65%"
            size="mini"
            end-placeholder="下班时间">
            </el-time-picker>
        </div>
      </div>
      <el-row class="sea-btns">
        <el-button size="mini" type="primary" @click="search">查询</el-button>
        <el-button size="mini" @click="clear">清空</el-button>
      </el-row>
    </el-row>
    <!-- 列表展示区 -->
    <el-row class="list-wrapper">
      <!-- 列表 -->
      <el-row>
        <el-table :data="dakaList" border>
          <el-table-column prop="firmName" label="部门名称" align="center" />
          <el-table-column prop="appUserName" label="姓名" align="center" />
          <el-table-column prop="foundertime" label="打卡日期" align="center" />
          <el-table-column prop="cardUpTime" label="上班时间" align="center" />
          <el-table-column prop="isUpRange" label="是否范围内打卡(上班)" align="center" />
          <el-table-column prop="cardDownTime" label="下班时间" align="center" />
          <el-table-column prop="isDownRange" label="是否范围内打卡(下班)" align="center" />
        </el-table>
        <!-- 分页 -->
        <el-row class="pag">
          <el-pagination
            :current-page="outPage"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="totalOut"
            @current-change="handleOut"
          />
        </el-row>
      </el-row>
    </el-row>
  </div>
</template>

<script>
import { getPunkList } from '@/api/home/second'
export default {
  data() {
    return {
        dakaList: [],
        outPage: 1,
        pageSize: 8,
        totalOut: 0,
        value1: '',
        value2: '',// 上下班时间
        userName: '', // 姓名
        organ: '' // 组织机构名称
    }
  },
  methods: {
    // 获取列表
    getList() {
      getPunkList({
        pageSize: this.pageSize,
        pageNumber: this.outPage,
        firmId: localStorage.getItem('detid')
      })
        .then(res => {
          if (res.res) {
            res.list.map(item => {
              if (item.isUpRange && item.isUpRange === '1') {
                item.isUpRange = '是'
              } else {
                item.isUpRange = '否'
              }
              if (item.isDownRange && item.isDownRange === '1') {
                item.isDownRange = '是'
              } else {
                item.isDownRange = '否'
              }
            })
            this.dakaList = res.list
            this.totalOut = res.tel
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 模糊查询
    search() {
      getPunkList({
        pageSize: this.pageSize,
        pageNumber: this.outPage,
        firmId: localStorage.getItem('detid'),
        founderStartTime: this.value1 ? this.value1[0] : '',
        founderEndTime: this.value1 ? this.value1[1] : '',
        memberName: this.userName,
        firmName: this.organ,
        startTime: this.value2 ? this.value2[0] : '',
        endTime: this.value2 ? this.value2[1] : '',
      })
        .then(res => {
          this.$message({
            type: 'success',
            message: res.msg
          })
          if (res.res) {
            res.list.map(item => {
              if (item.isUpRange && item.isUpRange === '1') {
                item.isUpRange = '是'
              } else {
                item.isUpRange = '否'
              }
              if (item.isDownRange && item.isDownRange === '1') {
                item.isDownRange = '是'
              } else {
                item.isDownRange = '否'
              }
            })
            this.dakaList = res.list
            this.totalOut = res.tel
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 清空
    clear() {
      this.value1 = ''
      this.organ = ''
      this.userName= ''
      this.value2 = ''
      this.getList()
    },
    // 跳页
    handleOut(val) {
      this.outPage = val
      if (this.value1 !== '') {
        this.search()
      } else {
        this.getList()
      }
    },
    // handler ({BMap, map}) {
    //   var point = new BMap.Point(109.49926175379778, 36.60449676862417)
    //   map.centerAndZoom(point, 13)
    //   var marker = new BMap.Marker(point) // 创建标注
    //   map.addOverlay(marker) // 将标注添加到地图中
    //   var circle = new BMap.Circle(point, 6, { strokeColor: 'Red', strokeWeight: 6, strokeOpacity: 1, Color: 'Red', fillColor: '#f03' })
    //   map.addOverlay(circle)
    // },
    // getClickInfo (e) {
    //   console.log(e.point.lng)
    //   console.log(e.point.lat)
    //   this.center.lng = e.point.lng
    //   this.center.lat = e.point.lat
    // }
  },
  mounted() {
    this.getList()
  }
}
</script>

<style scoped>
@import url("../public.css");
/* 去掉input[type="number"]的默认箭头 */
.sort /deep/ input[type="number"] {
  -moz-appearance: textfield;
}
.sort /deep/ input[type="number"]::-webkit-inner-spin-button,
.sort /deep/ input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
}
.findList {
  width: 100%;
  display: flex;
  /* justify-content: space-between; */
}
.el-select{
  width: 60%;
}
.find {
  width: 33%;
  margin-top: 10px;
}
.find input {
  border: 1px solid #dcdfe6;
  height: 28px;
  border-radius: 4px;
  width: 55%;
}
.find span {
  display: inline-block;
  width: 100px;
  text-align: right;
  font-size: 14px;
  color: #606266;
}
</style>
