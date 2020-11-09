<template>
  <div class="user-wrapper">
    <!-- 搜索区 -->
     <el-row class="list-wrapper">
        <div class="findList">
          <div class="find">
            <span>企业或部门：</span>
            <input v-model="department" type="text">
          </div>
          <div class="find sort">
            <span>联系电话：</span>
            <input v-model="phone" type="number">
          </div>
          <div class="find sort">
            <span>体温(>=)：</span>
            <input type="number" v-model="temperature">
          </div>
        </div>
        <div class="findList">
          <div class="find">
          <span>日期：</span>
          <el-date-picker
          v-model="date"
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
          <el-button size="mini" type="primary" @click="searchFn">查询</el-button>
          <el-button size="mini" @click="clearFn">清空</el-button>
        </el-row>
      </el-row>
    <!-- 列表展示区 -->
    <el-row class="list-wrapper">
      <!-- 列表 -->
      <el-row>
        <el-table :data="outList" border>
          <el-table-column prop="jurisdictionUnitName" label="企业或部门" align="center" />
          <el-table-column prop="visitor" label="来访人姓名" align="center" />
          <!-- <el-table-column prop="cardNumber" label="来访人身份证号码" align="center" /> -->
          <el-table-column prop="phone" label="联系方式" align="center" />
          <el-table-column prop="animalHeat" label="体温" align="center" />
          <!-- <el-table-column prop="type" label="出入" align="center" /> -->
          <el-table-column prop="foundertime" label="出入时间" align="center" />
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
import { getOutList } from '@/api/home/second'
export default {
  data() {
    return {
        outList: [],
        outPage: 1,
        pageSize: 8,
        totalOut: 0,
        department: '', // 部门
        phone: '', // 联系电话
        temperature: '', // 体温
        date: '' // 日期
    }
  },
  methods: {
    // 搜索
    searchFn() {
      getOutList({
        pageSize: this.pageSize,
        pageNumber: this.outPage,
        firmId: localStorage.getItem('detid'),
        departmentName: this.department,
        phone: this.phone,
        temperature: this.temperature,
        founderStartTime: this.date? this.date[0]:'',
        founderEndTime: this.date? this.date[1]:''
      })
        .then(res => {
          if (res.res) {
            this.$message({
              type: 'success',
              message: res.msg
            })
            this.outList = res.list
            this.totalOut = restel
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 清空
    clearFn() {
      this.department = ''
      this.phone = ''
      this.temperature = ''
      this.date = ''
      this.getList()
    },
    getList() {
      getOutList({
        pageSize: this.pageSize,
        pageNumber: this.outPage,
        firmId: localStorage.getItem('detid')
      })
        .then(res => {
          if (res.res) {
            this.outList = res.list
            this.totalOut = res.tel
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    handleOut(val) {
      this.outPage = val
      this.searchFn()
      // if (this.department !== '' && this.phone !== '' && this.temperature !== '' && this.date !== '') {
      //   this.searchFn()
      // } else {
      //   this.getList()
      // }
    }
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
  width: 65%;
}
.find span {
  display: inline-block;
  width: 100px;
  text-align: right;
  font-size: 14px;
  color: #606266;
}
</style>
