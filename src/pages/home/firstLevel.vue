<template>
  <div class="user-wrapper">
    <!-- 搜索区 -->
    <el-row class="list-wrapper">
      <div class="findList">
        <div class="find">
          <span>用户名：</span>
          <input v-model="loginName" type="text">
        </div>
        <div class="find">
          <span>登录名：</span>
          <input v-model="userName" type="text">
        </div>
        <div class="find">
          <span>联系方式：</span>
          <input v-model="contact" type="number" oninput="if(value.length>11)value=value.slice(0,10)">
        </div>
        <div class="find">
          <span>所属企业：</span>
          <input v-model="companies" type="text" @focus="compaShow = true">
        </div>
        <div class="find">
          <span>所属部门：</span>
          <input v-model="deparentment" type="text" @focus="deShowFn">
        </div>
      </div>
      <div class="findList">
        <div class="find" style="width:20%">
          <span>用户状态：</span>
          <el-select v-model="userMode" placeholder="全部" size="mini">
            <el-option v-for="item in userModes" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
        </div>
        <div class="find" style="width:20%">
          <span>职务：</span>
          <input v-model="duty" type="text">
        </div>
        <div class="find" style="width:20%">
          <span>所属角色：</span>
          <el-select v-model="role" placeholder="全部" size="mini" @focus="getdept">
            <el-option v-for="item in roles" :key="item.id" :label="item.roleName" :value="item.id" />
          </el-select>
        </div>
        <div class="find" />
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
        <el-button size="mini" style="margin-bottom:20px" type="primary" @click="addUser">+新增</el-button>
        <el-button type="primary" size="mini" @click="edit">编辑</el-button>
        <el-button type="danger" size="mini" @click="del">删除</el-button>
        <el-button type="primary" size="mini" @click="upData = true">导入</el-button>
      </el-row>
      <!-- 列表 -->
      <el-row>
        <el-col :span="24">
          <el-table :data="fMList" border @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column type="index" label="序号" align="center" width="80px" />
            <el-table-column prop="userAccount" label="用户名" align="center" />
            <el-table-column prop="userName" label="登录账号" align="center" />
            <el-table-column prop="userPhone" label="联系方式" align="center" />
            <el-table-column prop="qiyename" label="所属企业" align="center" />
            <el-table-column prop="firm.firmName" label="所属部门" align="center" />
            <el-table-column prop="userDuty" label="职务" align="center" />
            <el-table-column label="是否关联小程序" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.openId && scope.row.openId !== ''">是</span>
                <span v-else>否</span>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="绑定状态" align="center" width="100px">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.state1"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="setState(scope)"
                />
              </template>
            </el-table-column>
            <el-table-column label="所属角色" align="center">
              <template slot-scope="scope">
                <span v-for="(item,index) in scope.row.roles" :key="item.id">{{ item.roleName }} <span v-if="index < scope.row.roles.length - 1">,</span></span>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" align="center" width="200px">
              <template slot-scope="scope">
                <el-button
                  style="padding: 9px 7px"
                  type="warning"
                  size="small"
                  @click="resetPassFn(scope.row)"
                >重置密码</el-button>
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
    </el-row>
    <!-- 添加  -->
    <el-dialog :title="addStr === 'add' ? '新增用户' : '编辑用户'" :visible.sync="addShow" :close-on-click-modal="false">
      <el-form :inline="true" :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth" style="width:40%" prop="loginId">
          <el-input v-model="form.loginId" placeholder="请输入用户名" size="mini" />
        </el-form-item>
        <el-form-item label="所属企业" :label-width="formLabelWidth" style="width:56%" prop="companies">
          <el-input
            v-model="form.companies"
            class="sort"
            placeholder="请选择所属企业"
            size="mini"
            style="width:100%;position:relative"
            :disabled="true"
          />
          <i class="el-icon-search" style="position: absolute;top: 50%;right: 4px;margin-top: -7px;" @click="companiesShow = true" />
        </el-form-item>
        <el-form-item label="登录账号" :label-width="formLabelWidth" style="width:40%" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入登录账号" size="mini" :disabled="closeFn" />
        </el-form-item>

        <el-form-item
          label="所属部门"
          :label-width="formLabelWidth"
          style="width:40%"
          prop="deparentment"
        >
          <el-input
            v-model="form.deparentment"
            class="sort"
            placeholder="请选择所属部门"
            size="mini"
            style="width:100%;position:relative"
            :disabled="true"
          />
          <i class="el-icon-search" style="position: absolute;top: 50%;right: 4px;margin-top: -7px;" @click="deparentmentShowFn" />
        </el-form-item>

        <el-form-item label="职务" :label-width="formLabelWidth" style="width:40%" prop="duty">
          <el-input v-model="form.duty" class="sort" placeholder="请输入职务" size="mini" />
        </el-form-item>
        <el-form-item label="联系方式" :label-width="formLabelWidth" style="width:40%" prop="contact">
          <el-input v-model="form.contact" type="number" @blur="getVal" placeholder="请输入联系方式" size="mini" />
        </el-form-item>

        <el-form-item label="所属角色" :label-width="formLabelWidth" style="width:40%" prop="role">
          <el-input
            v-model="form.role"
            class="sort"
            placeholder="请输入所属角色"
            size="mini"
            @focus="roleFn"
          />
        </el-form-item>

        <el-form-item label="是否负责人" :label-width="formLabelWidth" style="width:40%" prop="role">
          <el-select v-model="form.leader" placeholder="全部" size="mini" style="width:92%">
            <el-option 
              v-for="item in leaderList" 
              :key="item.value"
              :label="item.label"
              :value="item.value"
             />
          </el-select>
        </el-form-item>
        <el-form-item label="工号" :label-width="formLabelWidth" style="width:40%" prop="duty">
          <el-input v-model="form.jobNum" class="sort" placeholder="请输入工号 " size="mini" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="addShow = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="addSure">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="companiesShow" :close-on-click-modal="false">
      <el-tree :data="data" :props="defaultProps" @current-change="handleNodeClick" />
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="companiesShow = false">确 定</el-button>
      </div>
    </el-dialog>

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

    <el-dialog :visible.sync="deShow">
      <el-tree :data="deparentmentList" :props="defaultProps" @current-change="deClick" />
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="deClickFn">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 选择所属角色 -->
    <el-dialog :visible.sync="checkShow">
      <el-checkbox-group
        v-model="checkList"
        style="display:flex;flex-wrap:wrap"
        @change="handleCheckedCitiesChange"
      >
        <el-checkbox
          v-for="city in types"
          :key="city.id"
          :label="city.id"
          style="margin-left:20px"
        >{{ city.roleName }}</el-checkbox>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="cnm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 文件上传 -->
    <el-dialog :visible.sync="upData">
      <el-upload
        ref="upload"
        class="upload-demo"
        action="123"
        accept=".xls"
        :limit="1"
        :http-request="submitUpload"
      >
        <el-button size="mini" type="primary">点击上传</el-button>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import {
  addFirst,
  setuserState,
  getList,
  delList,
  getAlldepart,
  resetPass,
  findRole,
  upDataFn
} from '@/api/home/first'
export default {
  data() {
    return {
      upData: false,
      leaderList: [
        {
          label: '是',
          value: '0'
        },
        {
          label: '否',
          value: '1'
        }
      ],
      sore: false,
      soreTrue: false,
      addShow: false, // 添加显示
      companiesShow: false,
      deparentmentShow: false,
      compaShow: false,
      deShow: false,
      checkShow: false,
      closeFn: false,
      passShow: false,
      formLabelWidth: '100px',
      fMList: [], // 菜单列表
      currentPage: 1, // 当前页
      pageSize: 8, // 每页数据
      total: 0, // 总条数
      options: [],
      form: {
        leader: '',
        loginId: '', // 登陆账号
        companies: '', // 所属企业
        userName: '', // 用户名
        deparentment: '', // 所属部门
        gender: '', // 性别
        duty: '', // 职务
        contact: '', // 联系方式
        jobNum: '', // 工号
        role: '' // 所属角色
      }, // 新增用户
      addStr: '',
      role: '', // 所属角色
      loginName: '', // 登录名
      userName: '', // 用户名
      gender: '', // 性别
      contact: '', // 联系方式
      companies: '', // 所属企业
      deparentment: '', // 所属部门
      userMode: '', // 用户状态
      duty: '', // 职务
      delSom: [],
      genders: [
        {
          label: '男',
          value: '001'
        },
        {
          label: '女',
          value: '002'
        }
      ], // 性别列表
      userModes: [
        {
          label: '启用',
          value: '1'
        },
        {
          label: '禁用',
          value: '0'
        }
      ], // 状态列表
      roles: [], // 角色列表
      data: [],
      deparentmentList: [],
      defaultProps: {
        children: 'children',
        label: 'firmName'
      },
      userId: localStorage.getItem('id'),
      id: '',
      checkList: [],
      types: [],
      deObj: {},
      setId: '',
      arr: [],
      deId: '',
      qiyeId: '',
      qiyId: '',
      state2: '',
      num: 0,
      roleArr: [],
      openId: ''
    }
  },
  mounted() {
    this.getFList()
    this.getAlldepartFn()
  },
  methods: {
    // 点击上传交易凭证
    submitUpload() {
      const { uploadFiles } = this.$refs.upload
      const form = new FormData()
      // 每次传文件列表的最后一项
      const item = uploadFiles[uploadFiles.length - 1]
      form.append('file', item.raw)
      upDataFn(form)
        .then(res => {
          this.$message({
            type: 'success',
            message: res.msg
          })
          this.upData = false
        })
        .catch(error => {
          console.log(error)
        })
    },
    handleSelectionChange(val) {
      this.delSom = val
    },
    getdept() {
      if (this.deparentment === '') {
        this.$message('请先选择所属企业及所属部门')
      }
    },
    getVal() {
      if (!(/^1[3456789]\d{9}$/.test(this.form.contact))) { 
        this.$message('手机号有误，请重新填写')
      }
    },
    // 修改用户状态
    setState(item) {
      console.log(item.row)
      setuserState({
        userId: item.row.id
      }).then(res => {
        if (res.res) {
          this.$message({
            type: 'success',
            message: '修改状态成功'
          })
          this.getFList()
        } else {
          this.$message(res.msg)
        }
      })
    },
    // 点击新增
    addUser() {
      this.addShow = true
      this.addStr = 'add'
    },
    // 获取一级菜单列表
    getFList() {
      getList({
        pageSize: this.pageSize,
        pageNumber: this.currentPage,
        spuerId: localStorage.getItem('detid')
      })
        .then(res => {
          // 渲染列表
          let data = res.list
          data.map(item => {
            if (item.openId && item.openId !== '') {
              item.state1 = true
            } else {
              item.state1 = false
            }
          })
          this.fMList = data
          // 数据总数
          this.total = res.tel
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 搜索
    search() {
      if (
        this.role === '' &&
        this.loginName === '' &&
        this.userName === '' &&
        this.gender === '' &&
        this.contact === '' &&
        this.companies === '' &&
        this.deparentment === '' &&
        this.userMode === '' &&
        this.duty === ''
      ) {
        this.getFList()
      } else {
        if (this.num === 0) {
          this.currentPage = 1
          this.num++
        }
        getList({
          pageSize: this.pageSize,
          pageNumber: this.currentPage,
          userAccount: this.loginName,
          userName: this.userName,
          userSex: this.gender,
          userPhone: this.contact,
          userBelongFirm: this.companies,
          roleid: this.role,
          userDuty: this.duty,
          state: this.userMode,
          spuerId: this.qiyId ? this.qiyId : localStorage.getItem('id'),
          firmId: this.deId
        })
          .then(res => {
            this.$message({
              type: 'success',
              message: res.msg
            })
            // 渲染列表
            let data = res.list
            data.map(item => {
              if (item.openId && item.openId !== '') {
                item.state1 = true
              } else {
                item.state1 = false
              }
            })
            this.fMList = data
            // 数据总数
            this.total = res.tel
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
    deClickFn() {
      this.deShow = false
      findRole({
        pageSize: 1000,
        pageNumber: 1,
        firmId: this.deId
      })
        .then(res => {
          console.log(res)
          this.roles = res.list
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
        console.log(res)
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
    // 获取所有角色
    roleFn() {
      this.checkShow = true
      findRole({
        pageSize: 1000,
        pageNumber: 1
      }).then(res => {
        console.log(res)
        if (res.res) {
          this.types = res.list
          this.$message({
            type: 'success',
            message: '查询成功'
          })
        } else {
          this.$message('查询失败')
        }
      })
    },
    // 多选
    handleCheckedCitiesChange(value) {
      this.checkList = value
    },
    cnm() {
      this.checkShow = false
      let showText = ''
      const checkedArr = []
      for (var i = 0; i < this.checkList.length; i++) {
        for (var j = 0; j < this.types.length; j++) {
          if (this.types[j].id === this.checkList[i]) {
            showText += this.types[j].roleName + ','
            checkedArr.push(this.types[j])
          }
        }
      }
      this.arr = checkedArr
      this.form.role = showText.slice(0, -1)
    },
    // 编辑
    edit() {
      if (this.delSom.length > 1) {
        this.$message('每次只能编辑一条')
        return false
      }
      if (this.delSom[0].id === localStorage.getItem('userid')) {
        this.$message({
          type: 'info',
          message: '正在登录的用户，不允许编辑'
        })
        return false
      }
      this.closeFn = true
      this.setId = this.delSom[0].id
      this.qiyId = this.delSom[0].qiyId
      this.addShow = true
      this.addStr = 'set'
      this.form.loginId = this.delSom[0].userAccount
      this.form.jobNum = this.delSom[0].jobNumber
      this.form.companies = this.delSom[0].qiyename
      this.form.userName = this.delSom[0].userName
      this.form.deparentment = this.delSom[0].firm.firmName
      this.form.gender = this.delSom[0].userSex
      this.form.duty = this.delSom[0].userDuty
      this.form.contact = this.delSom[0].userPhone
      this.form.leader = this.delSom[0].leader
      this.state2 = this.delSom[0].state
      this.arr = this.delSom[0].roles
      if (this.delSom[0].openId) {
        this.openId = this.delSom[0].openId
      }
      let roleName = ''
      const checkList = []
      this.delSom[0].roles.forEach(v => {
        roleName += v.roleName + ','
        checkList.push(v.id)
      })
      this.form.role = roleName.slice(0, -1)
      this.checkList = checkList
      this.deObj = this.delSom[0].firm
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
          delList({
            userId: str // 当前数据id
          }).then(res => {
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
    // 重置密码
    resetPassFn(item) {
      this.$confirm('确定初始化密码？', '提示', {
        type: 'warning'
      })
        .then(() => {
          resetPass({
            userId: item.id, // 当前数据id
            userPassword: '123456'
          }).then(res => {
            if (res.res) {
              this.$message({
                type: 'success',
                message: res.msg
              })
            } else {
              this.$message('重置密码失败')
            }
            // 渲染列表
            this.getFList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消初始化'
          })
        })
    },
    // 跳转到当前页
    handleCurrentChange(val) {
      this.currentPage = val
      // 获取列表
      this.search()
    },
    // 添加确认
    addSure() {
      console.log(this.form.leader)
      if (this.form.leader === '') {
        this.$message('请选择是否负责人')
        return false
      }
      // 对表单数据进行非空验证
      if (this.form.loginId === '' || this.form.loginId === null) {
        this.$message('请输入登陆账号')
        return false
      }
      if (this.form.contact === '' || this.form.contact === null) {
        this.$message('请输入手机号')
        return false
      }
      if (!(/^1[3456789]\d{9}$/.test(this.form.contact))) { 
        this.$message('手机号有误，请重新填写')
        return false
      }
      if (this.form.companies === '' || this.form.companies === null) {
        this.$message('请输入所属企业')
        return false
      }
      if (this.form.userName === '' || this.form.userName === null) {
        this.$message('请输入用户名')
        return false
      }
      if (this.form.deparentment === '' || this.form.deparentment === null) {
        this.$message('请输入所属部门')
        return false
      }
      if (this.form.duty === '' || this.form.duty === null) {
        this.$message('请输入职务')
        return false
      }
      if (this.form.jobNum === '' || this.form.jobNum === null) {
        this.$message('请输入工号')
        return false
      }
      // 若果类型为add，则走添加接口，否则走编辑接口
      if (this.addStr === 'add') {
        addFirst({
          leader: this.form.leader,
          userAccount: this.form.loginId,
          userName: this.form.userName,
          userSex: this.form.gender,
          userPhone: this.form.contact,
          qiyId: this.qiyId,
          userDuty: this.form.duty,
          roles: this.arr,
          firm: this.deObj,
          jobNumber: this.form.jobNum
        }).then(res => {
          if (res.res) {
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.getFList()
          } else {
            this.$message('保存失败')
            this.getFList()
          }
        })
      } else {
        addFirst({
          leader: this.form.leader,
          id: this.setId,
          userAccount: this.form.loginId,
          userName: this.form.userName,
          userSex: this.form.gender,
          userPhone: this.form.contact,
          qiyId: this.qiyId,
          userDuty: this.form.duty,
          roles: this.arr,
          firm: this.deObj,
          state: this.state2,
          openId: this.openId,
          jobNumber: this.form.jobNum
        }).then(res => {
          if (res.res) {
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.getFList()
          } else {
            this.$message('保存失败')
            this.getFList()
          }
        })
      }
      this.getFList()
      this.addShow = false
      this.form.loginId = ''
      this.form.userName = ''
      this.form.gender = ''
      this.form.deparentment = ''
      this.form.companies = ''
      this.form.contact = ''
      this.form.leader = ''
      this.qiyId = ''
      this.form.duty = ''
      this.form.jobNum = ''
      this.form.role = ''
      this.deObj = {}
      this.arr = []
      this.closeFn = false
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
  width: 20%;
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
