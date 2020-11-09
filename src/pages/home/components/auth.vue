<template>
  <div>
    <el-dialog title="用户授权" :visible.sync="menuState" :before-close="handleClose">
      <div class="contentBox">
        <!-- 左侧 -->
        <div style="width:50%">
          <!-- 查询 -->
          <el-row class="list-wrapper">
            <div class="find" style="width:100%">
              <span>登陆账号：</span>
              <input v-model="characterName" type="text">
            </div>
            <div style="margin-top: 10px;display: flex;justify-content: flex-end;">
              <el-button style="margin-left:130px" size="mini" type="warning" @click="search">查询</el-button>
              <el-button style="margin-left:15px" size="mini" @click="leftClear">清空</el-button>
            </div>
          </el-row>
          <!-- 展示 -->
          <el-row>
            <el-row>
              <el-button size="mini" type="primary" style="margin-bottom:20px;margin-left:80%" @click="addShow">授权</el-button>
            </el-row>
            <el-table
              ref="multipleTable"
              :data="tableData"
              tooltip-effect="dark"
              style="width: 100%"
              border
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55" />
              <el-table-column type="index" label="序号" align="center" width="50px" />
              <el-table-column prop="userAccount" label="登录账号" width="120" />
              <el-table-column prop="userName" label="用户名" show-overflow-tooltip />
            </el-table>
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
        </div>
        <!-- 右侧 -->
        <div style="width:49%;">
          <!-- 查询 -->
          <el-row class="list-wrapper">
            <div class="find">
              <span>登陆账号：</span>
              <input v-model="RightcharacterName" type="text">
            </div>
            <div style="margin-top: 10px;display: flex;justify-content: flex-end;">
              <el-button style="margin-left:130px" size="mini" type="warning" @click="Rightsearch">查询</el-button>
              <el-button style="margin-left:15px" size="mini" @click="rightClear">清空</el-button>
            </div>
          </el-row>
          <!-- 展示 -->
          <el-row>
            <el-row>
              <el-button size="mini" type="success" style="margin-bottom:20px;margin-left:80%" @click="delShow">移除</el-button>
            </el-row>
            <el-table
              ref="multipleTable"
              :data="list"
              tooltip-effect="dark"
              style="width: 100%"
              border
              @selection-change="RighthandleSelectionChange"
            >
              <el-table-column type="selection" width="55" />
              <el-table-column type="index" label="序号" align="center" width="50px" />
              <el-table-column prop="userAccount" label="登录账号" width="120" />
              <el-table-column prop="userName" label="用户名" show-overflow-tooltip />
            </el-table>
          </el-row>
          <!-- 分页 -->
          <el-row class="pag">
            <el-pagination
              :current-page="currentPage"
              :page-size="pageSize"
              layout="total, prev, pager, next, jumper"
              :total="righttotal"
              @current-change="RighthandleCurrentChange"
            />
          </el-row>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getList, getById, authorize, deleteuser } from '@/api/home/first'
export default {
  props: {
    lists: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      characterName: '', // 左侧登陆账号
      RightcharacterName: '', // 右侧
      menuState: true,
      currentPage: 1, // 左侧当前页
      pageSize: 8, // 左侧每页数据
      total: 0, // 左侧总条数
      righttotal: 0, // 右侧总条数
      tableData: [],
      list: [],
      sid: localStorage.getItem('id'),
      leftList: [],
      rightList: [],
      roleids: '',
      lid: localStorage.getItem('id')
    }
  },
  mounted() {
    this.getRightList()
  },
  created() {
    this.sid = this.lists
  },
  methods: {
    // 点击关闭
    handleClose() {
      this.$emit('closeDialog', false)
    },
    // 获取左侧列表信息
    findAllUserFn() {
      let rolesid = ''
      for (var i = 0; i < this.list.length; i++) {
        rolesid += "'" + this.list[i].id + "'" + ','
      }
      this.roleids = rolesid.substr(0, rolesid.length - 1)
      console.log(this.roleids)
      getById({
        pageSize: this.pageSize,
        pageNumber: this.currentPage,
        spuerId: localStorage.getItem('id'),
        roleids: this.roleids
      })
        .then(res => {
          this.tableData = res.list
          this.total = res.tel
        })
    },
    // 左侧查询
    search() {
      console.log(this.lid)
      getList({
        pageSize: this.pageSize,
        pageNumber: this.currentPage,
        spuerId: this.lid,
        userAccount: this.characterName
      })
        .then(res => {
          if (res.res) {
            this.$message({
              type: 'success',
              message: res.msg
            })
          }
          this.tableData = res.list
          this.total = res.tel
        })
    },
    // 左侧清空
    leftClear() {
      this.characterName = ''
      this.findAllUserFn()
    },
    // 获取右侧的所有数据
    getRightList() {
      getById({
        pageSize: this.pageSize,
        pageNumber: this.currentPage,
        spuerId: this.sid
      })
        .then(res => {
          this.list = res.list
          this.righttotal = res.tel
          this.findAllUserFn()
          this.getleftList()
        })
    },
    // 整理左侧
    getleftList() {
      let rolesid = ''
      for (var i = 0; i < this.list.length; i++) {
        rolesid += "'" + this.list[i].id + "'" + ','
      }
      this.roleids = rolesid.substr(0, rolesid.length - 1)
      getById({
        pageSize: this.pageSize,
        pageNumber: this.currentPage,
        roleids: this.roleids,
        roleId: this.sid
      })
        .then(res => {
          this.tableData = res.list
          this.total = res.tel
        })
    },
    // 右侧查询
    Rightsearch() {
      getById({
        pageSize: this.pageSize,
        pageNumber: this.currentPage,
        spuerId: this.sid,
        name: this.RightcharacterName
      })
        .then(res => {
          this.list = res.list
          this.righttotal = res.tel
        })
    },
    // 右侧清空
    rightClear() {
      this.RightcharacterName = ''
      this.getRightList()
    },
    // 左侧授权
    addShow() {
      authorize({
        id: this.sid,
        users: this.leftList
      })
        .then(res => {
          if (res.res) {
            this.$message({
              type: 'success',
              message: '授权成功'
            })
            this.leftList = []
            // this.getleftList()
            this.getRightList()
          } else {
            this.$message('授权失败')
          }
        })
    },
    // 右侧移除
    delShow() {
      deleteuser({
        id: this.sid,
        users: this.rightList
      })
        .then(res => {
          if (res.res) {
            this.$message({
              type: 'success',
              message: '移除成功'
            })
            this.getRightList()
            this.rightList = []
          }
        })
    },
    // 左侧跳转到当前页
    handleCurrentChange(val) {
      this.currentPage = val
    },
    // 右侧跳转
    RighthandleCurrentChange(val) {
      this.currentPage = val
    },
    // 左侧选择
    handleSelectionChange(val) {
      this.leftList = val
    },
    // 右侧选择
    RighthandleSelectionChange(val) {
      this.rightList = val
    }
  }
}
</script>
<style scoped>
.contentBox {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
}
.list-wrapper{
    background: none
}
</style>
