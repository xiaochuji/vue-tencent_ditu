<template>
  <div class="user-wrapper">
    <!-- 搜索区 -->
    <el-row class="list-wrapper">
      <div class="findList">
        <div class="find">
          <span>日期：</span>
          <el-date-picker
          v-model="loginName"
          type="date"
          value-format="yyyy-MM-dd"
          style="width:65%"
          size="mini"
          placeholder="选择日期">
          </el-date-picker>
        </div>
        <div class="find">
          <span>姓名：</span>
          <input v-model="userName" type="text">
        </div>
        <div class="find">
          <span>体温(>=)：</span>
          <input v-model="temperature" type="text">
        </div>
      </div>
      <div class="findList">
        <div class="find">
          <span>所属部门：</span>
          <input v-model="organ" type="text">
        </div>
      </div>
      <el-row class="sea-btns">
        <el-button size="mini" type="primary" @click="search">查询</el-button>
        <el-button size="mini" @click="clear">清空</el-button>
      </el-row>
    </el-row>
    <!-- 列表展示区 -->
    <el-row class="list-wrapper">
      <!-- 添加按钮 -->
      <el-row>
        <el-button size="mini" style="margin-bottom:20px" type="primary" @click="getListExcal">导出</el-button>
      </el-row>
      <!-- 列表 -->
      <el-row>
        <el-col :span="24">
          <el-table :data="fMList" border>
            <el-table-column type="index" label="序号" align="center" width="80px" />
            <el-table-column prop="basicInfo.memberName" label="姓名" align="center" />
            <el-table-column prop="basicInfo.deptName" label="所属部门" align="center" />
            <el-table-column prop="day_now" label="日期" align="center" />
            <el-table-column label="出门体温" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.temperature_detection&&scope.row.temperature_detection >= 37.3" style="color:red">{{scope.row.temperature_detection}}</span>
                <span v-else>{{scope.row.temperature_detection}}</span>
              </template>
            </el-table-column>
            <el-table-column label="上午体温" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.temperature_up&&scope.row.temperature_up >= 37.3" style="color:red">{{scope.row.temperature_up}}</span>
                <span v-else>{{scope.row.temperature_up}}</span>
              </template>
            </el-table-column>
            <el-table-column label="下午体温" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.temperature_down&&scope.row.temperature_down >= 37.3" style="color:red">{{scope.row.temperature_down}}</span>
                <span v-else>{{scope.row.temperature_down}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="isLeaveTianJIn" label="办公方式" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.work_type == 0">居家办公</span>
                <span v-else>到岗办公</span>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="isBackTianJIn" label="是否自动隔离" align="center" /> -->
          </el-table>
        </el-col>
      </el-row>
      <!-- 分页 -->
      <el-row class="pag">
        <el-pagination
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="total"
          @current-change="handleCurrentChange"
        />
      </el-row>
    </el-row>

    <!-- 选择所属部门 -->
    <el-dialog :visible.sync="deparentmentShow">
      <el-tree :data="deparentmentList" :props="defaultProps" @current-change="deparentmentClick" />
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="deparentmentShow = false">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="compaShow">
      <el-tree :data="data" :props="defaultProps" @current-change="compaClick" />
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="compaShow = false">确 定</el-button>
      </div>
    </el-dialog>
    <div style="margin-top:30px">
      <div style="margin-bottom:30px">未录入健康信息人员列表</div>
      <!-- 搜索项 -->
      <el-row class="list-wrapper">
        <div class="findList">
          <div class="find">
            <span>日期：</span>
            <el-date-picker
            v-model="NDate"
            type="date"
            value-format="yyyy-MM-dd"
            style="width:65%"
            size="mini"
            placeholder="选择日期">
            </el-date-picker>
          </div>
          <div class="find">
            <span>部门:</span>
            <input v-model="department" type="text">
          </div>
          <div class="find">
            <span>检测时段：</span>
            <el-select v-model="NTime" placeholder="全部" size="mini">
              <el-option v-for="item in timeList" :key="item.value" :value="item.value" :label="item.label" />
            </el-select>
          </div>
        </div>
        <el-row class="sea-btns">
          <el-button size="mini" type="primary" @click="searchFn">查询</el-button>
          <el-button size="mini" @click="clearFn">清空</el-button>
        </el-row>
      </el-row>
      <!-- 列表 -->
      <el-row class="list-wrapper">
      <!-- 列表 -->
      <el-row>
        <el-col :span="24">
          <el-table :data="NList" border>
            <el-table-column type="index" label="序号" align="center" width="80px" />
            <el-table-column prop="userAccount" label="姓名" align="center" />
            <el-table-column prop="firm.firmName" label="所属部门" align="center" />
            <el-table-column prop="dayDate" label="日期" align="center" />
            <el-table-column prop="userPhone" label="联系电话" align="center" />
          </el-table>
        </el-col>
      </el-row>
      <!-- 分页 -->
      <el-row class="pag">
        <el-pagination
          :current-page="NPage"
          :page-size="NSize"
          layout="total, prev, pager, next, jumper"
          :total="NTotal"
          @current-change="handleCurrentFn"
        />
      </el-row>
    </el-row>
    </div>
  </div>
</template>

<script>
import {
  getAlldepart,
  getUserList,
  isgetAllExcelRecord
} from '@/api/home/first'
import {
  getNList
} from '@/api/home/second'
import { baseUrl } from '@/utils/request'
export default {
  data() {
    return {
      NDate: '', // 日期
      department: '', // 部门
      NTime: '', // 检测时段
      NList: [], // 未录入列表
      NPage: 1,
      NSize: 8,
      NTotal: 0,
      timeList: [
        {
          label: '出门',
          value: '0'
        },
        {
          label: '上午',
          value: '1'
        },
        {
          label: '下午',
          value: '2'
        }
      ], // 状态列表
      sore: false,
      soreTrue: false,
      addShow: false, // 添加显示
      companiesShow: false,
      deparentmentShow: false,
      compaShow: false,
      deShow: false,
      formLabelWidth: '80px',
      fMList: [], // 菜单列表
      currentPage: 1, // 当前页
      pageSize: 8, // 每页数据
      total: 0, // 总条数
      options: [],
      addStr: '',
      role: '', // 所属角色
      loginName: '', // 日期
      userName: '', // 用户名
      temperature: '', // 体温
      data: [],
      deparentmentList: [],
      defaultProps: {
        children: 'children',
        label: 'firmName'
      },
      userId: localStorage.getItem('id'),
      id: '',
      types: [],
      deObj: {},
      setId: '',
      arr: [],
      deId: '',
      qiyeId: '',
      qiyId: '',
      num: 0,
      organ: '' // 组织机构名称
    }
  },
  mounted() {
    this.getFList()
    this.getAlldepartFn()
    this.getNList()
  },
  methods: {
    // 获取未录入列表
    getNList() {
      getNList({
        pageSize: this.NSize,
        pageNumber: this.NPage,
        firmId: localStorage.getItem('detid')
        // entryDate  departmentName state
      })
        .then(res => {
          this.NList = res.list
          this.NTotal = res.tel
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 跳页
    handleCurrentFn(val) {
      this.NPage = val
      if (this.NDate === '' && this.NTime === '' && this.department === '') {
        this.getNList()
      } else {
        this.searchFn()
      }
      
    },
    // 搜索
    searchFn() {
      getNList({
        pageSize: this.NSize,
        pageNumber: this.NPage,
        firmId: localStorage.getItem('detid'),
        entryDate: this.NDate,
        departmentName: this.department,
        state: this.NTime
      })
        .then(res => {
          this.$message({
              type: 'success',
              message: res.msg
          })
          this.NList = res.list
          this.NTotal = res.tel
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 清空
    clearFn() {
      this.NDate = ''
      this.department = ''
      this.NTime = ''
      this.getNList()
    },
    // 导出
    getListExcal() {
      let entryDate = this.loginName.length > 0 ? this.loginName : ''
      isgetAllExcelRecord({
        firmId: localStorage.getItem('detid'),
        entryDate: entryDate
      })
        .then(res => {
          if (res.list == false) {
            this.$message('请先添加数据')
          } else {
            // http://10.10.10.18:8889'/appuserFirm/getAllExcelRecord?firmId=1&entryDate=
            window.open(baseUrl + '/appuserFirm/getAllExcelRecord?firmId=' + localStorage.getItem('detid') + '&entryDate=' + entryDate)
          }
        })
    },
    getdept() {
      if (this.deparentment === '') {
        this.$message('请先选择所属企业及所属部门')
      }
    },
    // 获取一级菜单列表
    getFList() {
      getUserList({
        pageSize: this.pageSize,
        pageNumber: this.currentPage,
        firmId: localStorage.getItem('detid')
      })
        .then(res => {
          // 渲染列表
          this.fMList = res.list.data
          // 数据总数
          this.total = res.list.total
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 搜索
    search() {
      if (
        this.loginName === '' &&
        this.userName === '' &&
        this.companies === '' &&
        this.deparentment === '' &&
        this.temperature === '' && 
        this.organ === ''
      ) {
        this.getFList()
      } else {
        if (this.num === 0) {
          this.currentPage = 1
          this.num++
        }
        let entryDate = this.loginName.length > 0 ? this.loginName : ''
        getUserList({
          pageSize: this.pageSize,
          pageNumber: this.currentPage,
          entryDate: entryDate,
          memberName: this.userName,
          departmentName: this.organ,
          firmId: localStorage.getItem('detid'),
          temperature: this.temperature
        })
          .then(res => {
            this.$message({
              type: 'success',
              message: res.msg
            })
            // 渲染列表
            this.fMList = res.list.data
            // 数据总数
            this.total = res.list.total
          })
          .catch(error => {
            console.log(error)
          })
      }
    },
    // 点击选择部门
    deparentmentShowFn() {
      if (this.qiyId === '') {
        this.$message('请先选择所属企业')
        return false
      }
      if (this.form.companies === '') {
        this.$message('请先选择所属企业')
        return false
      }
      this.deparentmentShow = true
      getAlldepart({
        spuerId: this.qiyId
        // firmOrganizationType: 1
      }).then(res => {
        this.deparentmentList = res.list
      })
    },
    // 清空
    clear() {
      this.role = '' // 所属角色
      this.loginName = '' // 登录名
      this.userName = '' // 用户名
      this.gender = '' // 性别
      this.contact = '' // 联系方式
      this.companies = '' // 所属企业
      this.deparentment = '' // 所属部门
      this.userMode = '' // 用户状态
      this.duty = '' // 职务
      this.currentPage = 1
      this.num = 0
      this.temperature = ''
      this.organ = ''
      // 重新渲染
      this.getFList()
    },
    // 获取所有企业
    getAlldepartFn() {
      getAlldepart({
        spuerId: this.userId,
        firmOrganizationType: 0
      }).then(res => {
        this.data = res.list
      })
    },
    deShowFn() {
      if (this.companies === '') {
        this.$message('请先选择所属企业')
        return false
      }
      this.deShow = true
      getAlldepart({
        spuerId: this.qiyId
        // firmOrganizationType: 1
      }).then(res => {
        this.deparentmentList = res.list
      })
    },
    handleNodeClick(data) {
      this.form.companies = data.firmName
      this.qiyId = data.id
    },

    deparentmentClick(data) {
      this.form.deparentment = data.firmName
      this.deObj = data
      this.deId = data.id
    },
    compaClick(data) {
      this.qiyId = data.id
      this.companies = data.firmName
    },
    deClick(data) {
      this.deId = data.id
      this.deparentment = data.firmName
    },
    // 跳转到当前页
    handleCurrentChange(val) {
      this.currentPage = val
      // 获取列表
      this.search()
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
