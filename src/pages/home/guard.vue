<template>
  <div class="user-wrapper">
    <!-- 搜索区 -->
    <el-row class="list-wrapper">
      <div class="findList">
          <div class="find">
          <span>成员名称：</span>
          <input v-model="ygName" type="text">
        </div>
        <div class="find">
          <span>门卫名称：</span>
          <input v-model="mwName" type="text">
        </div>
        <div class="find">
          <span>体温(>=)：</span>
          <input v-model="temperature" type="text">
        </div>
      </div>
      <div class="findList">
        <div class="find">
            <span>时间范围：</span>
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
        <el-table :data="outList" border>
          <el-table-column prop="sBuMenName" label="单位名称" align="center" />
          <el-table-column prop="guardName" label="门卫名称" align="center" />
          <el-table-column prop="staffName" label="成员名称" align="center" />
          <el-table-column label="体温" align="center">
            <template slot-scope="scope">
            <span v-if="scope.row.temperature&&scope.row.temperature >= 37.3" style="color:red">{{scope.row.temperature}}</span>
            <span v-else>{{scope.row.temperature}}</span>
            </template>
          </el-table-column>
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
import { getGuardList } from '@/api/home/second'
export default {
  data() {
    return {
      ygName: '', // 员工名称
      mwName: '', // 门卫名称
      temperature: '', // 体温
      value1: '',
      outList: [],
      outPage: 1,
      pageSize: 8,
      totalOut: 0
    }
  },
  methods: {
    getList() {
      getGuardList({
        pageSize: this.pageSize,
        pageNumber: this.outPage,
        firmId: localStorage.getItem('id')
      })
        .then(res => {
          // console.log(res)
          this.outList = res.list
          this.totalOut = res.tel
        })
        .catch(error => {
          console.log(error)
        })
    },
    search() {
      getGuardList({
        pageSize: this.pageSize,
        pageNumber: this.outPage,
        staffName: this.ygName,
        guardName: this.mwName,
        startDate: this.value1 ? this.value1[0] : '',
        endDate: this.value1 ? this.value1[1] : '',
        temperature: this.temperature,
        firmId: localStorage.getItem('id')
      })
        .then(res => {
          this.$message({
            type: 'success',
            message: res.msg
          })
          this.outList = res.list
          this.totalOut = res.tel
        })
        .catch(error => {
          console.log(error)
        })
    },
    clear() {
      this.ygName = '' 
      this.mwName = ''
      this.temperature = ''
      this.value1 = ''
      this.getList()
    },
    handleOut(val) {
      this.outPage = val
      if (this.ygName === '' && this.mwName === '' && this.temperature === '' && this.value1 === '') {
        this.getList()
      } else {
        this.search()
      }
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
  width: 80px;
  text-align: right;
  font-size: 14px;
  color: #606266;
}
</style>