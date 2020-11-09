<template>
  <div class="user-wrapper">
    <!--    左边-->
    <div class="one-twow">
      <div style="padding: 20px;">
        <el-row :span="24">
          <el-col style="width:100%" :span="10">组织机构</el-col>
        </el-row>
      </div>
      <div>
        <el-tree
          v-if="!inResize"
          ref="tree"
          :data="treeList"
          :props="defaultProps"
          :load="loadNode"
          lazy
          node-key="id"
          :default-expand-all="true"
          :expand-on-click-node="false"
          @node-click="handleNodeClick"
          @node-mouseover="hoverFn"
        />
      </div>
    </div>
    <!-- 右边 -->
    <div class="user-right">
      <!-- 搜索区 -->
      <el-row class="list-wrapper">
        <el-row>
          <!-- <el-col class="search-input" :span="8">
            组织机构代码：
            <el-input v-model="menuNum" size="mini" style="width:50%" />
          </el-col> -->
          <el-col class="search-input" :span="8">
            组织机构名称：
            <el-input v-model="menuName" size="mini" style="width:50%" />
          </el-col>
          <el-col :span="8" class="search-input">
            组织机构类别：
            <el-select v-model="seaMType" placeholder="请选择" size="mini" style="width:50%">
              <el-option
                v-for="item in FMList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
        </el-row>
        <el-row class="sea-btns">
          <el-button size="mini" type="primary" @click="search">查询</el-button>
          <el-button size="mini" @click="clear">清空</el-button>
        </el-row>
      </el-row>
      <!-- 列表展示区 -->
      <el-row class="list-wrapper">
        <!-- 添加按钮 -->
        <el-row>
          <el-button type="primary" size="mini" @click="edit" style="margin-bottom:20px">编辑</el-button>
          <el-button type="danger" size="mini" @click="del">删除</el-button>
          <el-button size="mini" type="primary" style="margin-bottom:20px" @click="upData = true">导入</el-button>
        </el-row>
        <!-- 列表 -->
        <el-row>
          <el-col :span="24">
            <el-table :data="sMList" border @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55" />
              <el-table-column type="index" label="序号" align="center" width="70px" />
              <!-- <el-table-column prop="firmCode" label="组织机构代码" align="center" /> -->
              <el-table-column prop="firmName" label="组织机构名称" align="center" />
              <el-table-column label="组织机构类型" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.firmOrganizationType === '0'">企业</span>
                  <span v-if="scope.row.firmOrganizationType === '1'">部门</span>
                </template>
              </el-table-column>
              <el-table-column prop="firmAutoCode" label="编号" align="center" />
              <el-table-column fixed="right" label="操作" align="center" width="300px">
                <template slot-scope="scope">
                  <el-button type="primary" size="small" @click="addNext(scope.row)">+新增下级组织机构</el-button>
                  <el-button type="primary" size="small" @click="setTu(scope.row)">二维码生成</el-button>
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
      <!-- 编辑 -->
      <el-dialog
        :title="editStr === 'add' ? '新增父组织机构' : editStr === 'set' ? '编辑' : '新增下级组织机构'"
        :visible.sync="editShow"
        :close-on-click-modal="false"
      >
        <el-form :model="editform" :inline="true">
          <el-form-item label="组织机构类型" :label-width="formLabelWidth" style="width:47%">
            <el-select v-model="editform.editMType" placeholder="请选择" size="mini" style="width:92%" @change="editChangeFn">
              <el-option
                v-for="item in editFMList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="组织机构名称" :label-width="formLabelWidth" style="width:47%">
            <el-input
              v-model="editform.editName"
              placeholder="请输入菜单名称"
              size="mini"
              style="width:100%"
            />
          </el-form-item>
          <el-form-item label="主要负责人" :label-width="formLabelWidth" style="width:47%">
            <el-input
              v-model="editform.mainUser"
              placeholder="请输入菜单名称"
              size="mini"
              style="width:100%"
            />
          </el-form-item>
          <el-form-item label="联系方式" :label-width="formLabelWidth" style="width:50%">
            <el-input
              v-model="editform.userPhone"
              type="number"
              placeholder="请输入菜单名称"
              size="mini"
              style="width:100%"
            />
          </el-form-item>
          <el-form-item label="排序" :label-width="formLabelWidth" style="width:50%">
            <el-input
              v-model="editform.sorts"
              placeholder="请输入菜单名称"
              size="mini"
              style="width:100%"
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="cancleEdit">取 消</el-button>
          <el-button size="mini" type="primary" @click="editSure">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="tuShow">
        <div style="width:100%;padding-left:29%">
          <img :src="imgUrl" class="img-style">
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
  </div>
</template>

<script>
import { getFirmList, deleteFirm, saveOneFirm, getTree, getTreeLower, upData } from '@/api/home/second'
import { baseUrl } from '@/utils/request'
export default {
  data() {
    return {
      typeState: '',
      show: false,
      inResize: false,
      upData: false,
      menuName: '', // 组织机构名称
      menuNum: '', // 组织机构代码
      seaMType: '', // 组织机构类别
      FMList: [
        {
          label: '企业',
          value: 0
        },
        {
          label: '部门',
          value: 1
        }
      ], // 组织机构类别数组
      sMList: [], // 列表展示
      currentPage: 1, // 当前页
      pageSize: 8, // 每页数据
      total: 0, // 总条数
      formLabelWidth: '100px',
      editShow: false, // 编辑显示
      editStr: '',
      num: 0,
      editform: {
        faEdit: '', // 父组织机构
        editJs: '', // 组织机构代码
        editName: '', // 组织机构名称
        editMType: '', // 组织机构类型
        mainUser: '', // 主要负责人
        userPhone: '', // 联系方式
        isUnfold: '', // 是否展开
        sorts: '', // 排序
        nature: '', // 组织机构性质
        structure: '', // 组织机构简称
        iconID: '', // 证件号
        address: '', // 地址
        // permissions: '', // 菜单权限
        menuTime: '', // 祖册时间
        menuType: '', // 注册类型
        business: '', // 经营范围
        industry: '' // 所处行业
      }, // 编辑菜单
      delSom: [],
      editFMList: [], // 一级菜单列表
      isUnfoldList: [
        {
          label: '是',
          value: 1
        },
        {
          label: '否',
          value: 0
        }
      ], // 是否展开
      editMType: '', // 一级菜单
      treeList: [],
      defaultProps: {
        label: 'firmName',
        value: 'id',
        children: 'children'
      },
      tuShow: false,
      imgUrl: ''
    }
  },
  mounted() {
    this.getList()
    // this.getFList()
  },
  methods: {
    // 点击上传交易凭证
    submitUpload() {
      const { uploadFiles } = this.$refs.upload
      const form = new FormData()
      // 每次传文件列表的最后一项
      const item = uploadFiles[uploadFiles.length - 1]
      console.log(item)
      form.append('file', item.raw)
      upData(form)
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
    // 二维码生成
    setTu() {
      this.tuShow = true
      this.imgUrl = baseUrl + '/registration/getVRcode?firmId=' + localStorage.getItem('id')
    },
    handleSelectionChange(val) {
      this.delSom = val
    },
    hoverFn() {
      console.log(11)
    },
    editChangeFn() {
      if (this.editform.editMType === 0) {
        this.show = true
      } else {
        this.show = false
      }
    },
    // 点击新增下级
    addNext(item) {
      this.editFMList = [
        {
          label: '企业',
          value: '0'
        },
        {
          label: '部门',
          value: '1'
        }
      ]
      this.editform.faEdit = item.firmAutoCode
      this.editShow = true
      this.editStr = 'asd'
      // this.editform.faEdit = '' // 父组织机构
      this.editform.editJs = '' // 组织机构代码
      this.editform.editName = '' // 组织机构名称
      this.editform.editMType = '' // 组织机构类型
      this.editform.mainUser = '' // 主要负责人
      this.editform.userPhone = '' // 联系方式
      this.editform.isUnfold = '' // 是否展开
      this.editform.sorts = '' // 排序
      this.editform.nature = '' // 组织机构性质
      this.editform.structure = '' // 组织机构简称
      this.editform.iconID = '' // 证件号
      this.editform.address = '' // 地址
      // this.editform.permissions = '' // 菜单权限
      this.editform.menuTime = '' // 祖册时间
      this.editform.menuType = '' // 注册类型
      this.editform.business = '' // 经营范围
      this.editform.industry = '' // 所处行业
      // this.editform.editMType = '1'
      // this.editFMList = [
      // ]
    },
    // 点击树形
    handleNodeClick(data) {
      getFirmList({
        pageSize: this.pageSize,
        pageNumber: this.currentPage,
        spuerId: data.id
      })
        .then(res => {
          this.sMList = res.list
          this.total = res.tel
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 初始化列表
    getList() {
      getFirmList({
        pageSize: this.pageSize,
        pageNumber: this.currentPage,
        spuerId: localStorage.getItem('detid')
      })
        .then(res => {
          console.log(res)
          this.sMList = res.list
          this.total = res.tel
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 获取左侧树形图
    loadNode(node, resolve) {
      // 判断是否有根节点，没有则查询根节点,否则查询下级节点
      if (node.level === 0) {
        getTree({
          qiId: localStorage.getItem('detid')
        })
          .then(res => {
            return resolve(res.list)
          })
          .catch(error => {
            console.log(error)
          })
      } else {
        getTreeLower({
          spuerId: node.data.id
        })
          .then(res => {
            return resolve(res.list)
          })
          .catch(error => {
            console.log(error)
          })
      }
    },
    // 搜索
    search() {
      if (this.menuName === '' && this.menuNum === '' && this.seaMType === '') {
        this.getList()
        return false
      } else {
        if (this.num === 0) {
          this.currentPage = 1
          this.num++
        }
        getFirmList({
          pageSize: this.pageSize,
          pageNumber: this.currentPage,
          firmName: this.menuName,
          firmCode: this.menuNum,
          firmOrganizationType: this.seaMType + '',
          spuerId: localStorage.getItem('detid')
        })
          .then(res => {
            this.$message({
              type: 'success',
              message: res.msg
            })
            this.sMList = res.list
            this.total = res.tel
          })
          .catch(error => {
            console.log(error)
          })
      }
    },
    // 清空
    clear() {
      this.menuName = ''
      this.menuNum = ''
      this.seaMType = ''
      this.currentPage = 1
      this.num = 0
      this.getList()
    },
    // 编辑
    edit() {
      if (this.delSom.length > 1) {
        this.$message('每次只能编辑一条')
        return false
      }
      const row = this.delSom[0]
      this.editShow = true
      this.editStr = 'set'
      // 反填信息
      this.editform.editMType = row.firmOrganizationType
      this.editform.editJs = row.firmCode
      this.editform.editName = row.firmName
      this.editform.mainUser = row.firmLegalRepresentative
      this.editform.userPhone = row.firmPhone
      this.editform.isUnfold = row.firmOpen ? row.firmOpen * 1 : ''
      this.editform.sorts = row.sort
      this.editform.nature = row.firmNature
      this.editform.structure = row.firmNameForShort
      this.editform.iconID = row.firmCertificateNumber
      this.editform.address = row.firmAddress
      this.editform.menuTime = row.foundertime
      this.editform.menuType = row.firmRegtype
      this.editform.business = row.firmBusinessScope
      this.editform.industry = row.firmIndustry
      // 传参赋值
      this.menuId = row.id // 当前菜单id
      this.code = row.supercode // 当前菜单code
      this.state = row.state // 当前菜单state
      this.superiorcode = row.firmAutoCode
      this.typeState = row.type
      // 传参赋值
      // 每次都置空，防止多条数据push
      this.editPicList = []
      if (row.fileKey === '' || row.fileKey == null) {
        return false
      } else {
        this.editPicList.push({
          name: row.imangeName,
          url: row.path,
          id: row.fileKey
        })
      }
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
          deleteFirm({
            id: str
          })
            .then(res => {
              console.log(res)
              this.$message({
                type: 'success',
                message: res.msg
              })
              // 渲染列表
              this.getList()
              this.inResize = true
              this.$nextTick(t => {
                console.log(t)
                this.inResize = false
              })
            })
            .catch(error => {
              console.log(error)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消删除'
          })
        })
    },
    // 跳转到指定页
    handleCurrentChange(val) {
      this.currentPage = val
      this.search()
    },
    // 编辑确认
    editSure() {
      // 进行非空验证
      if (this.editform.editName === '') {
        this.$message('请填写组织机构名称')
        return false
      }
      if (this.editform.editMType === '') {
        this.$message('请填写组织机构类型')
        return false
      }
      if (this.editform.mainUser === '') {
        this.$message('请填写主要负责人')
        return false
      }
      if (this.editform.userPhone === '') {
        this.$message('请填写联系方式')
        return false
      }
      if (this.editform.sorts === '') {
        this.$message('请填写排序')
        return false
      }
      // 若类型为add，添加副组织机构，set编辑，asd添加子组织机构
      if (this.editStr === 'asd') {
        console.log(this.editform.faEdit)
        saveOneFirm({
          supercode: this.editform.faEdit,
          firmOrganizationType: this.editform.editMType,
          firmCode: this.editform.editJs,
          firmName: this.editform.editName,
          firmLegalRepresentative: this.editform.mainUser,
          firmPhone: this.editform.userPhone,
          firmOpen: '1',
          sort: this.editform.sorts,
          firmNature: this.editform.nature,
          firmNameForShort: this.editform.structure,
          firmCertificateNumber: this.editform.iconID,
          firmAddress: this.editform.address,
          foundertime: this.editform.menuTime,
          firmRegtype: this.editform.menuType,
          firmBusinessScope: this.editform.business,
          firmIndustry: this.editform.industry,
          type: 1
        })
          .then(res => {
            if (res.res) {
              this.$message({
                type: 'success',
                message: '保存成功'
              })
              this.getList()
              this.inResize = true
              this.$nextTick(t => {
                console.log(t)
                this.inResize = false
              })
            }
          })
      } else if (this.editStr === 'set') {
        saveOneFirm({
          supercode: this.code,
          firmOrganizationType: this.editform.editMType,
          firmCode: this.editform.editJs,
          firmName: this.editform.editName,
          firmLegalRepresentative: this.editform.mainUser,
          firmPhone: this.editform.userPhone,
          firmOpen: '1',
          sort: this.editform.sorts,
          firmNature: this.editform.nature,
          firmNameForShort: this.editform.structure,
          firmCertificateNumber: this.editform.iconID,
          firmAddress: this.editform.address,
          foundertime: this.editform.menuTime,
          firmRegtype: this.editform.menuType,
          firmBusinessScope: this.editform.business,
          firmIndustry: this.editform.industry,
          type: this.typeState,
          id: this.menuId,
          firmAutoCode: this.superiorcode
        })
          .then(res => {
            console.log(res)
            this.inResize = true
            this.getList()
            this.$nextTick(t => {
              console.log(t)
              this.inResize = false
            })
          })
      }
      this.getList()
      this.editform.faEdit = ''
      this.editform.editMType = ''
      this.editform.editJs = ''
      this.editform.editName = ''
      this.editform.mainUser = ''
      this.editform.userPhone = ''
      this.editform.isUnfold = ''
      this.editform.sorts = ''
      this.editform.nature = ''
      this.editform.structure = ''
      this.editform.iconID = ''
      this.editform.address = ''
      this.editform.menuTime = ''
      this.editform.menuType = ''
      this.editform.business = ''
      this.editform.industry = ''
      this.editShow = false
    },
    // 取消编辑
    cancleEdit() {
      this.editform.faEdit = '' // 父组织机构
      this.editform.editJs = '' // 组织机构代码
      this.editform.editName = '' // 组织机构名称
      this.editform.editMType = '' // 组织机构类型
      this.editform.mainUser = '' // 主要负责人
      this.editform.userPhone = '' // 联系方式
      this.editform.isUnfold = '' // 是否展开
      this.editform.sorts = '' // 排序
      this.editform.nature = '' // 组织机构性质
      this.editform.structure = '' // 组织机构简称
      this.editform.iconID = '' // 证件号
      this.editform.address = '' // 地址
      // this.editform.permissions = '' // 菜单权限
      this.editform.menuTime = '' // 祖册时间
      this.editform.menuType = '' // 注册类型
      this.editform.business = '' // 经营范围
      this.editform.industry = '' // 所处行业
      this.editShow = false
    }
  }
}
</script>

<style scoped>
@import url("../public.css");
/* 去掉input[type="number"]的默认箭头 */
.sorts /deep/ input[type="number"] {
  -moz-appearance: textfield;
}
.sorts /deep/ input[type="number"]::-webkit-inner-spin-button,
.sorts /deep/ input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
}
.app-main {
  width: 100%;
  height: 100%;
}
.user-wrapper {
  display: flex;
  justify-content: space-between;
}
.one-twow {
  width: 15%;
  border-right: 1px solid #e4e4e4;
  margin-right: 10px;
}
.user-right {
  height: 100%;
  flex: 1;
}
.img-style {
    width: 300px;
    height: 100%;
}
</style>
