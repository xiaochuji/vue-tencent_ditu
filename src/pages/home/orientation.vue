<template>
  <div class="user-wrapper">
    <el-row class="list-wrapper">
      <div class="findList">
        <div class="find">
          <span>姓名：</span>
          <input v-model="userName" type="text">
        </div>
        <div class="find">
          <span>所属部门：</span>
          <el-select v-model="deparentment" placeholder="全部" size="mini">
            <el-option 
              v-for="item in deparentmentList" 
              :key="item.value"
              :label="item.firmName"
              :value="item.id"
             />
          </el-select>
        </div>
        <div class="find">
          <span>日期：</span>
            <el-date-picker
            v-model="time"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="-"
            start-placeholder="开始日期"
            style="width:65%"
            size="mini"
            end-placeholder="结束日期">
            </el-date-picker>
        </div>
      </div>
      <el-row class="sea-btns">
        <el-button size="mini" type="primary" @click="search">查询</el-button>
        <el-button size="mini" @click="clear">清空</el-button>
      </el-row>
    </el-row>
    <el-row class="list-wrapper">
      <!-- 列表 -->
      <el-row>
        <el-col :span="24">
          <el-table :data="fMList" border>
            <el-table-column type="index" label="序号" align="center" width="80px" />
            <el-table-column prop="userSysLocationCheck.userAccount" label="姓名" align="center" />
            <el-table-column prop="diliName" label="打卡地址" align="center" />
            <el-table-column prop="userSysLocationCheck.firm.firmName" label="所属部门" align="center" />
            <el-table-column prop="time" label="创建时间" align="center" />
          </el-table>
        </el-col>
      </el-row>
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
  </div>
</template>

<script>
import {
  sysLocationCheck, getAlldepart
} from '@/api/home/first'
export default {
  data() {
    return {
      fMList: [],
      outPage: 1,
      pageSize: 8,
      totalOut: 0,
      map: {},
      BMap: {},
      deparentmentList: [],
      userName: '',// 姓名
      deparentment: '', //所属部门
      time: ''   //时间
    }
  },
  mounted() {
    this.getFList()
    this.getDetList()
  },
  methods: {
    handleOut(val) {
      this.outPage = val
      this.search()
    },
    // 获取当前登录企业下的所有部门
    getDetList() {
      getAlldepart({
        spuerId: localStorage.getItem('id'),
        firmOrganizationType: 1
      }).then(res => {
        this.deparentmentList = res.list
      })
    },
    // 模糊查询
    search() {
      if (this.userName === '' && this.time === '' && this.deparentment === '') {
        this.getFList()
      } else {
        let startTime = this.time.length > 0 ? this.time[0] + ' 0:00:00' : ''
        let endTime = this.time.length > 1 ? this.time[1] + ' 23:59:59' : ''
        sysLocationCheck({
          pageSize: this.pageSize,
          pageNumber: this.outPage,
          spuerId: localStorage.getItem('id'),
          userAccount: this.userName,
          founderStartTime: startTime,
          founderEndTime: endTime,
          firmId: this.deparentment
        })
          .then(res => {
            // let BMap = this.BMap
            // 渲染列表
            let data = res.list
            data.map(item => {
              item.time = new Date(parseInt(item.createTime)).toLocaleString().replace(/:\d{1,2}$/,' ')
            })
            this.fMList = data
            // 数据总数
            this.totalOut = res.tel
          })
          .catch(error => {
            console.log(error)
          })
      }
    },
    // 清空
    clear() {
      this.userName = ''
      this.time = ''
      this.deparentment = ''
      this.getFList()
    },
    // 获取列表页数据
    getFList() {
      sysLocationCheck({
        pageSize: this.pageSize,
        pageNumber: this.outPage,
        spuerId: localStorage.getItem('id')
      })
        .then(res => {
          // let BMap = this.BMap
          // 渲染列表
          let data = res.list
          data.map(item => {
            item.time = new Date(parseInt(item.createTime)).toLocaleString().replace(/:\d{1,2}$/,' ')
          })
          this.fMList = data
          // 数据总数
          this.totalOut = res.tel
        })
        .catch(error => {
          console.log(error)
        })
    }
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
  width: 60%;
}
.find span {
  display: inline-block;
  width: 80px;
  text-align: right;
  font-size: 14px;
  color: #606266;
}
</style>
