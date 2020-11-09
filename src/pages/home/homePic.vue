<template>
  <div class="user-wrapper">
    <!-- 搜索区 -->
    <el-row class="list-wrapper" style="display:flex;">
      <div class="find">
        <span>角色名称：</span>
        <input v-model="characterName" type="text">
      </div>
      <div class="find">
        <span>所属企业：</span>
        <input v-model="companies" type="text">
      </div>
      <div class="find">
        <el-button size="mini" type="primary" @click="search">查询</el-button>
        <el-button size="mini" @click="clear">清空</el-button>
      </div>
    </el-row>
    <!-- 列表展示区 -->
    <el-row class="list-wrapper">
      <!-- 添加按钮 -->
      <el-row>
        <el-button type="primary" size="mini" style="margin-bottom:20px" @click="addShowFn">+新增</el-button>
        <el-button type="primary" size="mini" @click="edit">编辑</el-button>
        <el-button type="danger" size="mini" @click="del">删除</el-button>
      </el-row>
      <!-- 列表 -->
      <el-row>
        <el-col :span="24">
          <el-table :data="fMList" border @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column type="index" label="序号" align="center" width="80px" />
            <el-table-column prop="roleName" label="角色名称" align="center" />
            <el-table-column prop="firmname" label="所属企业" align="center" />
            <el-table-column prop="roleDescribe" label="角色描述" align="center" />
            <el-table-column fixed="right" label="操作" align="center" width="350px">
              <template slot-scope="scope" class="btns">
                <el-button type="primary" size="mini" @click="Menu(scope.row)">菜单授权</el-button>
                <el-button type="danger" size="mini" @click="userFn(scope.row)">用户授权</el-button>
              </template>
            </el-table-column>
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
      <!-- 菜单授权 -->
      <el-dialog :visible.sync="menuState">
        <el-alert
          title="警告"
          type="warning"
        >选中一个节点时，您必须手动选中其所有祖先节点；取消选中一个节点时，如果此时不需要显示它的父级节点，您必须手动取消选择其父级节点。</el-alert>
        <el-tree
          ref="tree"
          :data="data"
          show-checkbox
          node-key="id"
          :props="defaultProps"
          :load="loadNode"
          lazy
          :default-expand-all="true"
          :check-strictly="true"
          @check-change="handleCheckChange"
        />
        <el-row style="margin-top: 20px">
          <el-button size="mini" @click="closeFn">关闭</el-button>
          <el-button size="mini" type="primary" @click="setStatus">确定</el-button>
        </el-row>
      </el-dialog>
      <!-- 添加 -->
      <el-dialog :title="nima === 'add'? '新增角色' :'编辑角色'" :visible.sync="addShow" :close-on-click-modal="false">
        <el-form :model="formList" label-width="80px">
          <el-form-item label="角色名称">
            <el-input v-model="formList.name" size="mini" />
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="formList.textarea" size="mini" />
          </el-form-item>
          <el-form-item label="所属企业">
            <el-input v-model="formList.fileName" size="mini" disabled />
          </el-form-item>
        </el-form>
        <el-row style="display:flex;justify-content: flex-end;">
          <el-button size="mini" @click="addShow = false">关闭</el-button>
          <el-button size="mini" type="primary" @click="addNime">确定</el-button>
        </el-row>
      </el-dialog>
      <auth-dia v-if="authDia" :lists="rowId" @closeDialog="closeBox" />
    </el-row>
  </div>
</template>

<script>
import { findRole, deleteRole, saveRole, update } from '@/api/home/first'
import { getById1, getMTree } from '@/api/home/second'
import AuthDia from './components/auth'
export default {
  components: {
    AuthDia
  },
  data() {
    return {
      formList: {
        name: '',
        textarea: '',
        fileName: localStorage.getItem('name')
      },
      delSom: [],
      data: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'menuName',
        value: 'id'
      },
      menuName: '', // 搜索菜单名称
      fMList: [], // 菜单列表
      currentPage: 1, // 当前页
      pageSize: 8, // 每页数据
      total: 0, // 总条数
      form: {
        fMName: '',
        fMorder: ''
      }, // 添加一级菜单
      editform: {
        fMName: '',
        fMorder: ''
      }, // 编辑一级菜单
      code: '', // 当前菜单code
      state: '', // 当前菜单state
      characterName: '', // 角色名称
      companies: '', // 所属企业
      menuState: false,
      authDia: false,
      nima: '',
      addShow: false, // 新增
      rowId: '',
      setId: '',
      menusId: '', // 菜单id
      menuList: [],
      fileNames: '',
      textarea: '',
      isIconSelectorShow: true,
      num: 0,
      powers: []
    }
  },
  mounted() {
    this.getFList()
    // this.gettreeList()
  },
  methods: {
    handleSelectionChange(val) {
      this.delSom = val
    },
    // 获取菜单树形
    gettreeList() {
      getMTree({
        pageSize: 100000,
        pageNumber: 1
      })
        .then(res => {
          console.log(res)
          this.data = res.list
        })
    },
    loadNode(node, resolve) {
      // 判断是否有根节点，没有则查询根节点,否则查询下级节点
      if (node.level === 0) {
        getMTree()
          .then(res => {
            return resolve(res.list)
          })
          .catch(error => {
            console.log(error)
          })
      } else {
        getById1({
          pageSize: 10000,
          pageNumber: 1,
          powerBelongsToMenu: node.data.id
        })
          .then(res => {
            return resolve(res.list)
          })
          .catch(error => {
            console.log(error)
          })
      }
    },
    handleCheckChange(item, isChecked, t) {
      if (isChecked) {
        this.menuList.push(item)
      } else {
        this.menuList.forEach((v, index) => {
          if (v.id === item.id) {
            this.menuList.splice(index, 1)
          }
        })
      }
    },
    closeBox(data) {
      this.authDia = data
    },
    // 新增
    addShowFn() {
      this.formList.name = ''
      this.formList.textarea = ''
      this.addShow = true
      this.nima = 'add'
    },
    // 新增确定
    addNime() {
      // 对数据进行非空处理
      if (this.formList.name === '') {
        this.$message('请输入角色名称')
        return false
      }
      if (this.formList.textarea === '') {
        this.$message('请输入角色描述')
        return false
      }
      if (this.formList.fileName === '') {
        this.$message('请输入所属企业')
        return false
      }
      // 如果类型是add，调用添加接口，否则调用编辑接口
      if (this.nima === 'add') {
        saveRole({
          roleName: this.formList.name,
          roleDescribe: this.formList.textarea,
          firmId: localStorage.getItem('id')
        })
          .then(res => {
            if (res.res) {
              this.$message({
                type: 'success',
                message: res.msg
              })
            }
            this.getFList()
            this.addShow = false
          })
      } else {
        saveRole({
          id: this.setId,
          roleName: this.formList.name,
          roleDescribe: this.formList.textarea,
          firmId: localStorage.getItem('id'),
          powers: this.powers
        })
          .then(res => {
            if (res.res) {
              this.$message({
                type: 'success',
                message: res.msg
              })
            }
            this.getFList()
            this.addShow = false
          })
      }
    },
    // 用户授权
    userFn(row) {
      this.rowId = row.id
      this.authDia = true
    },
    // 菜单授权
    Menu(item) {
      this.menusId = item.id
      this.fileNames = item.roleName
      this.textarea = item.roleDescribe
      this.menuState = true

      // 第一次打开菜单授权弹出框前，也就是ref为tree的元素被创建前，this.$refs.tree不会被创建。
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedKeys(item.powers.map(v => v.id))
      } else {
        this.$nextTick(() => this.$refs.tree.setCheckedKeys(item.powers.map(v => v.id)))
      }
    },
    // 菜单授权关闭
    closeFn() {
      this.menuState = false
    },
    // 菜单授权确定
    setStatus() {
      // const arr = []
      const menuList = this.$refs.tree.getCheckedNodes(false, true)
      console.log(menuList)

      // for (var i = 0; i < this.data.length; i++) {
      //   for (var j = 0; j < menuList.length; j++) {
      //     if (this.data[i].id === menuList[j].id) {
      //       arr.push(this.data[i])
      //     }
      //   }
      // }
      update({
        id: this.menusId,
        powers: menuList,
        roleName: this.fileNames,
        roleDescribe: this.textarea,
        firmId: localStorage.getItem('id')
      })
        .then(res => {
          if (res.res) {
            this.$message({
              type: 'success',
              message: '更新成功'
            })
            this.getFList()
          }
        })
      this.menuState = false
    },
    // 获取初始化列表
    getFList() {
      findRole({
        pageSize: this.pageSize,
        pageNumber: this.currentPage,
        firmId: localStorage.getItem('id')
      })
        .then(res => {
        // 渲染列表
          this.fMList = res.list
          // 数据总数
          this.total = res.tel
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 搜索
    search() {
      if (this.num === 0) {
        this.currentPage = 1
        this.num++
      }
      const coumt = this.currentPage
      findRole({
        pageSize: this.pageSize,
        pageNumber: coumt,
        roleName: this.characterName, // 菜单名称
        firmname: this.companies
      })
        .then(res => {
          this.$message({
            type: 'success',
            message: res.msg
          })
          // 渲染列表
          this.fMList = res.list
          // 数据总数
          this.total = res.tel
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 清空
    clear() {
      this.companies = '' // 清空所属企业
      this.characterName = '' // 清空角色名称
      // 重新渲染
      this.getFList()
      this.num = 0
      this.currentPage = 1
    },
    // 编辑
    edit() {
      if (this.delSom.length > 1) {
        this.$message('每次只能编辑一条')
        return false
      }
      const row = this.delSom[0]
      this.powers = this.delSom[0].powers
      this.addShow = true
      this.nima = 'set'
      this.setId = row.id
      this.formList.name = row.roleName
      this.formList.textarea = row.roleDescribe
    },
    // 删除
    del() {
      let str = ''
      for (var i = 0; i < this.delSom.length; i++) {
        str += this.delSom[i].id + ','
      }
      this.$confirm('确定删除？', '提示', {
        type: 'warning'
      })
        .then(() => {
          deleteRole({
            roleId: str // 当前数据id
          })
            .then(res => {
              this.$message({
                type: 'success',
                message: res.msg
              })
              // 渲染列表
              this.getFList()
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消删除'
          })
        })
    },
    // 跳转到当前页
    handleCurrentChange(val) {
      this.currentPage = val
      // 获取列表
      this.getFList()
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
.sort /deep/ input[type="number"]::-webkit-outer-spin-button{
  -webkit-appearance: none;
}
.user-wrapper{
  background: none
}
.find{
  width: 33.3%;
}
.find input{
    border: 1px solid #DCDFE6;
    height: 28px;
    border-radius: 4px;
}
.find span{
  display: inline-block;
  width: 80px;
  text-align: right;
  font-size: 14px;
  color: #606266
}
</style>
