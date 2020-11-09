<template>
  <div class="wrapper"><!-- class="user-wrapper" -->
    <!-- 搜索区 -->
    <el-row class="list-wrapper">
      <el-row>
        <el-col class="search-input" :span="8">
          菜单名称：
          <el-input v-model="menuName" size="mini" style="width:50%" />
        </el-col>
        <el-col :span="8" class="search-input">
          菜单类型：
          <el-select v-model="seaMType" placeholder="请选择" size="mini" style="width:50%">
            <el-option v-for="item in FMList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-col>
        <el-button size="mini" type="primary" @click="search">查询</el-button>
        <el-button size="mini" @click="clear">清空</el-button>
      </el-row>
    </el-row>
    <!-- 添加按钮 -->
    <el-row>
      <el-button size="mini" type="primary" style="margin-bottom:20px" @click="dialogState = 'addFather';isAddOrEditShow = true">+新增父级菜单</el-button>
    </el-row>
    <div class="user-wrapper">
      <!--    左边-->
      <div class="one-twow">
        <div style="padding: 20px;">
          <el-row :span="24">
            <el-col style="width:100%" :span="10">菜单功能</el-col>
          </el-row>
        </div>
        <div>
          <el-tree
            v-if="!inResize"
            ref="tree"
            :data="dataList"
            :props="defaultProps"
            :load="loadNode"
            lazy
            node-key="id"
            :default-expand-all="true"
            :expand-on-click-node="false"
            @node-click="handleNodeClick"
          />
        </div>
      </div>
      <!-- 右边 -->
      <div class="user-right">
        <el-row style="margin-bottom:10px">
          <el-button type="danger" size="small" @click="del">删除</el-button>
        </el-row>
        <!-- 列表展示区 -->
        <el-row class="list-wrapper">
          <!-- 列表 -->
          <el-row>
            <el-col :span="24">
              <el-table :data="sMList" border @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" />
                <el-table-column type="index" label="序号" align="center" width="80px" />
                <el-table-column prop="menuName" label="菜单名称" align="center" width="80px" />
                <el-table-column prop="menuCode" label="菜单编号" align="center" width="80px" />
                <el-table-column label="菜单类型" align="center" width="80px">
                  <template slot-scope="scope">
                    <span v-if="scope.row.menuType === '0'">主菜单</span>
                    <span v-else-if="scope.row.menuType === '1'">子菜单</span>
                    <span v-else-if="scope.row.menuType === '2'">按钮</span>
                  </template>
                </el-table-column>
                <el-table-column prop="parentName" label="父级菜单" align="center" width="80px" />
                <el-table-column prop="power_sort" label="排序" align="center" width="80px" />
                <el-table-column prop="isshowcaidan" label="是否显示" align="center" width="80px">
                  <template slot-scope="scope">
                    <span v-if="scope.row.isshow === '0'">否</span>
                    <span v-if="scope.row.isshow === '1'">是</span>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button v-if="scope.row.menuType === '0'" type="primary" size="small" @click="addChildrenFn(scope.row)">+新增子级菜单</el-button>
                    <el-button v-if="scope.row.menuType !== '2'" type="primary" size="small" @click="addButton(scope.row)">新增按钮</el-button>
                    <el-button type="success" size="small" @click="scope.row.menuType === '2' ? editButton(scope.row) : edit(scope.row)">编辑</el-button>
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
      </div>

      <el-dialog :title="getDialogTitle" :visible.sync="isAddOrEditShow" :close-on-click-modal="false">
        <el-form :model="form" :inline="true">
          <el-form-item label="菜单编码" :label-width="formLabelWidth" style="width:43%">
            <el-input v-model="form.menuCode" placeholder="请输入菜单编码" size="mini" />
          </el-form-item>
          <el-form-item label="菜单名称" :label-width="formLabelWidth" style="width:43%">
            <el-input v-model="form.menuName" placeholder="请输入菜单名称" size="mini" />
          </el-form-item>
          <!-- <el-form-item v-if="dialogState === 'addChildren'" label="父级菜单" :label-width="formLabelWidth" style="width:43%">
            <el-input v-model="form.faFile" placeholder="请输入父级菜单" size="mini" />
          </el-form-item> -->
          <el-form-item label="菜单类型" :label-width="formLabelWidth" style="width:45%">
            <!-- <el-select v-model="form.fileType" placeholder="请选择" size="mini" style="width:90%">
              <el-option v-for="item in fileTypes" :key="item.value" :label="item.label" :value="item.value" />
            </el-select> -->
            <span v-if="dialogState === 'addFather' || dialogState === 'editFather'">父级菜单</span>
            <span v-else>子级菜单</span>
          </el-form-item>
          <el-form-item label="排序" label-width="80px" style="width:43%">
            <el-input v-model="form.power_sort" type="number" class="sorts" placeholder="请输入排序" size="mini" />
          </el-form-item>
          <el-form-item label="是否显示" :label-width="formLabelWidth" style="width:43%">
            <el-select v-model="form.isshow" placeholder="请选择" size="mini" style="width:90%">
              <el-option v-for="item in defaultFiles" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="是否默认图标" :label-width="formLabelWidth" style="width:45%;margin-left:-10px">
            <el-select v-model="form.detaultIcon" placeholder="请选择" size="mini" style="width:90%">
              <el-option v-for="item in defaultIcons" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item> -->
          <!-- <el-form-item label="菜单图标" :label-width="formLabelWidth" style="width:43%">
            <el-upload
              ref="upload"
              class="upload-demo"
              action="123"
              multiple
              :limit="1"
              accept="doc,docx,pdf,xls,xlsx,png,jpg,jpeg,gif"
              :file-list="iconList"
              :http-request="submitUpload"
              :on-remove="handleRemoveadd"
            >
              <el-button size="mini" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item> -->
          <el-form-item label="菜单路由" :label-width="formLabelWidth" style="width:50%">
            <el-input v-model="form.menuRoute" class="sorts" placeholder="请输入菜单路由" size="mini" />
          </el-form-item>
          <el-form-item label="文件路径" :label-width="formLabelWidth" style="width:43%">
            <el-input v-model="form.componentPath" class="sorts" placeholder="请输入文件路径" size="mini" />
          </el-form-item>
          <el-form-item label="菜单图标" :label-width="formLabelWidth" style="width:50%">
            <i v-if="form.fileKey" :class="form.fileKey" style="margin-right: 10px; font-size: 30px;" />
            <el-button @click="isIconSelectorShow = true">选择图标</el-button>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="cancelDialog">取 消</el-button>
          <el-button size="mini" type="primary" @click="addSure">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog :title="getDialogTitle" :visible.sync="isAddButtonShow" :close-on-click-modal="false">
        <el-form :model="buttonForm" :inline="true">
          <el-form-item label="按钮编码" :label-width="formLabelWidth" style="width:43%">
            <el-input v-model="buttonForm.menuCode" placeholder="请输入按钮编码" size="mini" />
          </el-form-item>
          <el-form-item label="按钮名称" :label-width="formLabelWidth" style="width:43%">
            <el-input v-model="buttonForm.menuName" placeholder="请输入按钮名称" size="mini" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="cancelButtonDialog">取 消</el-button>
          <el-button size="mini" type="primary" @click="addOrSaveButton">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="选择图标" :visible.sync="isIconSelectorShow">
        <table class="icon-selector">
          <tr v-for="(item, index) in iconList" :key="index">
            <td v-for="value in item" :key="value" @click="form.fileKey = value; isIconSelectorShow = false">
              <i :class="value" />
            </td>
          </tr>
        </table>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getById, getById1, delOne, fileupload, delUploadFile, prowSave, prowAdd, getMTree } from '@/api/home/second'
import { iconList } from '@/utils/iconList'
export default {
  data() {
    return {
      menuName: '', // 搜索菜单类型
      seaMType: '', // 搜索菜单名称
      FMList: [
        {
          label: '主菜单',
          value: '0'
        },
        {
          label: '子菜单',
          value: '1'
        },
        {
          label: '按钮',
          value: '2'
        }
      ], // 菜单名称列表
      delSom: [],
      addShow: false, // 添加显示
      inResize: false,
      sMList: [], // 菜单列表展示
      currentPage: 1, // 当前页
      pageSize: 8, // 每页数据
      total: 0, // 总条数
      formLabelWidth: '100px',
      num: 0,
      // form: {
      //   file: '', // 添加菜单编码
      //   fileName: '', // 添加菜单名称
      //   faFile: '', // 父级菜单
      //   fileType: '', // 菜单类型
      //   sorts: '', // 排序
      //   defaultFile: '', // 默认菜单
      //   defaultIcon: '', // 默认图标
      //   fileRouter: '', // 菜单路由
      //   signedUrl: '',
      //   fileKey: '',
      //   name: ''
      // },
      // 添加菜单
      fileTypes: [
        {
          label: '主菜单',
          value: '0'
        },
        {
          label: '子菜单',
          value: '1'
        }], // 所有菜单类型
      defaultFiles: [
        {
          label: '是',
          value: '1'
        },
        {
          label: '否',
          value: '0'
        }
      ], // 所有默认菜单
      defaultIcons: [
        {
          label: '否',
          value: '0'
        },
        {
          label: '是',
          value: '1'
        }], // 所有默认图标
      editShow: false, // 编辑显示
      // iconList: [], // 上传图标列表
      fileList: {
        name: '',
        url: '',
        id: ''
      }, // 上传后的赋值列表
      editPicList: [], // 编辑上传图标列表
      editFileList: {
        fileKey: '',
        fileName: '',
        filePath: ''
      }, // 编辑赋值列表
      dataList: [],
      defaultProps: {
        children: 'children',
        label: 'menuName'
      },

      Iid: '',
      hackReset: true,
      isAddOrEditShow: false,
      isAddButtonShow: false,
      currentItem: null,
      dialogState: '',
      form: {
        menuName: '', // 菜单名
        menuCode: '', // 编码
        menuRoute: '', // 路由
        power_sort: '', // 排序
        isshow: '1', // 是否显示
        powerBelongsToMenu: '', // 所属
        fileKey: '', // 暂时用作图标名
        componentPath: '' // 文件路径
      },
      buttonForm: {
        menuName: '', // 菜单名
        menuCode: '', // 编码
        menuType: '2',
        powerBelongsToMenu: '' // 所属
      },
      faId: '',
      isIconSelectorShow: false,
      iconList
    }
  },
  computed: {
    getDialogTitle() {
      let title = ''
      switch (this.dialogState) {
        case 'addFather':
          title = '新增父级菜单'
          break
        case 'addChildren':
          title = '新增子级菜单'
          break
        case 'editFather':
          title = '编辑父级菜单'
          break
        case 'editChildren':
          title = '编辑子级菜单'
          break
        case 'editButton':
          title = '编辑按钮'
          break
        case 'addButton':
          title = '新增按钮'
          break
      }
      return title
    },
    getMenuTypeCode() {
      let type = ''
      switch (this.dialogState) {
        case 'addFather':
        case 'editFather':
          type = '0'
          break
        case 'addChildren':
        case 'editChildren':
          type = '1'
          break
      }
      return type
    },
    getIsAddOrEdit() {
      let type = ''
      switch (this.dialogState) {
        case 'addFather':
        case 'addChildren':
        case 'addButton':
          type = 'add'
          break
        case 'editFather':
        case 'editChildren':
        case 'editButton':
          type = 'edit'
          break
      }
      return type
    }
  },
  mounted() {
    this.getList()
  },
  created() {
    // 分割iconList
    const iconList = this.iconList
    const targetList = []
    const times = Math.ceil(iconList.length / 10)
    for (let i = 0; i < times; i++) {
      const start = i * 10
      targetList.push(iconList.slice(start, start + 10))
    }
    this.iconList = targetList
    console.log(this.iconList)
  },
  methods: {
    handleSelectionChange(val) {
      this.delSom = val
    },
    // 获取左侧树形
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
    // 点击新增子级菜单
    addChildrenFn(item) {
      this.isAddOrEditShow = true
      this.faId = item.id
      this.dialogState = 'addChildren'
    },
    addButton(item) {
      this.isAddButtonShow = true
      this.faId = item.id
      this.dialogState = 'addButton'
    },
    // 树形图点击事件
    handleNodeClick(data) {
      this.getListById(data.id)
    },
    // 初始化列表
    getList() {
      getById({
        pageSize: this.pageSize,
        pageNumber: this.currentPage
      })
        .then(res => {
          this.sMList = res.list
          this.total = res.tel
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 根据主菜单或二级菜单获取下级
    getListById(id) {
      getById({
        pageSize: this.pageSize,
        pageNumber: this.currentPage,
        powerBelongsToMenu: id
      })
        .then(res => {
          this.sMList = res.list
        })
    },
    // 搜索
    search() {
      if (this.menuName === '' && this.seaMType === '') {
        this.getList()
      } else {
        if (this.num === 0) {
          this.currentPage = 1
          this.num++
        }
        getById({
          pageSize: this.pageSize,
          pageNumber: this.currentPage,
          type: 1, // 代表类型为二级菜单
          menuName: this.menuName,
          menuType: this.seaMType,
          spuerId: localStorage.getItem('id')
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
      this.seaMType = ''
      this.currentPage = 1
      this.num = 0
      this.getList()
    },
    // 编辑
    edit(row) {
      this.form = {
        menuName: row.menuName, // 菜单名
        menuCode: row.menuCode, // 编码
        menuRoute: row.menuRoute, // 路由
        power_sort: row.power_sort, // 排序
        isshow: row.isshow, // 是否显示
        powerBelongsToMenu: row.powerBelongsToMenu, // 所属
        fileKey: row.fileKey, // 暂时用作图标名
        id: row.id,
        componentPath: row.componentPath
      }
      this.isAddOrEditShow = true
      this.dialogState = row.menuType === '0' ? 'editFather' : 'editChildren'
    },
    editButton(row) {
      this.isAddButtonShow = true
      this.dialogState = 'editButton'
      this.buttonForm = {
        menuName: row.menuName, // 按钮名
        menuCode: row.menuCode, // 编码
        powerBelongsToMenu: row.powerBelongsToMenu, // 所属
        menuType: '2',
        id: row.id
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
          delOne({
            id: str
          })
            .then(res => {
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
    // 添加确认
    addSure() {
      const params = Object.assign({}, this.form)
      const type = this.getMenuTypeCode
      params.menuType = type

      let promise = null
      const isAddOrEdit = this.getIsAddOrEdit

      // 如果是子菜单，并且是新增，添加父菜单
      if (type === '1' && isAddOrEdit === 'add') {
        params.powerBelongsToMenu = this.faId
      }

      if (isAddOrEdit === 'edit') {
        promise = prowSave(params)
      } else {
        promise = prowAdd(params)
      }

      promise
        .then(res => {
          if (res.res) {
            this.$message({
              type: 'success',
              message: res.msg
            })
            this.getList()
          }
          this.clearDialog()
          this.isAddOrEditShow = false
        })
    },
    addOrSaveButton() {
      const params = Object.assign({}, this.buttonForm)

      let promise = null
      const isAddOrEdit = this.getIsAddOrEdit

      // 如果是新增，添加父菜单
      if (isAddOrEdit === 'add') {
        params.powerBelongsToMenu = this.faId
      }

      if (isAddOrEdit === 'edit') {
        promise = prowSave(params)
        this.inResize = true
        this.$nextTick(t => {
          console.log(t)
          this.inResize = false
        })
      } else {
        promise = prowAdd(params)
      }

      promise
        .then(res => {
          if (res.res) {
            this.$message({
              type: 'success',
              message: res.msg
            })
            this.getList()
          }
          this.clearButtonDialog()
          this.isAddButtonShow = false
        })
    },
    clearDialog() {
      this.form = {
        menuName: '', // 菜单名
        menuCode: '', // 编码
        menuRoute: '', // 路由
        power_sort: '', // 排序
        isshow: '1', // 是否显示
        powerBelongsToMenu: '', // 所属
        fileKey: '', // 暂时用作图标名
        componentPath: ''
      }
    },
    clearButtonDialog() {
      this.buttonForm = {
        menuName: '', // 菜单名
        menuCode: '', // 编码
        powerBelongsToMenu: '', // 所属
        menuType: '2'
      }
    },
    // 取消添加
    cancelDialog() {
      this.isAddOrEditShow = false
      this.clearDialog()
      return
    },
    cancelButtonDialog() {
      this.isAddButtonShow = false
      this.clearButtonDialog()
    },
    // 编辑确认
    editSure() {
      prowSave({
        id: this.Iid,
        menuName: this.editform.fileName,
        menuCode: this.editform.file,
        menuType: this.editform.fileType,
        menuRoute: this.editform.fileRouter,
        power_sort: this.editform.sorts,
        isshow: this.editform.detaultIcon,
        powerBelongsToMenu: this.faId,
        name: this.editform.name,
        fileKey: this.editform.fileKey,
        signedUrl: this.editform.signedUrl
      })
        .then(res => {
          this.$message({
            type: 'success',
            message: res.msg
          })
          this.editShow = false
          this.editform.fileName = ''
          this.editform.file = ''
          this.editform.fileType = ''
          this.editform.fileRouter = ''
          this.editform.sorts = ''
          this.editform.detaultIcon = ''
          this.faId = ''
          this.editform.name = ''
          this.editform.fileKey = ''
          this.editform.signedUrl = ''
          // 渲染列表
          this.getList()
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 取消编辑
    cancleEdit() {
      this.editform.file = '' // 添加菜单编码
      this.editform.fileName = '' // 添加菜单名称
      this.editform.faFile = '' // 父级菜单
      this.editform.fileType = '' // 菜单类型
      this.editform.sorts = '' // 排序
      this.editform.defaultFile = '' // 默认菜单
      this.editform.defaultIcon = '' // 默认图标
      this.editform.fileRouter = '' // 菜单路由
      this.editform.name = ''
      this.editform.fileKey = ''
      this.editform.signedUrl = ''
      this.editShow = false
    },
    // 上传图标
    submitUpload() {
    // 获取上传的文件信息
      const { uploadFiles } = this.$refs.upload
      const form = new FormData()
      // 每次传文件列表的最后一项
      const item = uploadFiles[uploadFiles.length - 1]
      form.append('file', item.raw)
      fileupload(form)
        .then(res => {
          this.$message({
            type: 'success',
            message: res.msg
          })
          // //显示上传列表
          this.iconList.push({
            name: res.map.name,
            fileKey: res.map.fileKey,
            signedUrl: res.map.signedUrl
          })
          // 赋值(添加确认需要传的参)
          this.form.name = res.map.name
          this.form.signedUrl = res.map.signedUrl
          this.form.fileKey = res.map.fileKey
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 新增删除图标
    handleRemoveadd(file) {
      delUploadFile({
        fileKey: file.fileKey
      })
        .then(res => {
          this.$message({
            type: 'success',
            message: res.msg
          })
          // 删除成功后清空列表
          if (res.res) {
            this.iconList = []
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 编辑上传
    submitEUpload() {
    // 获取上传的文件信息
      const { uploadFiles } = this.$refs.editupload
      const form = new FormData()
      // 每次传文件列表的最后一项
      const item = uploadFiles[uploadFiles.length - 1]
      form.append('file', item.raw)
      fileupload(form)
        .then(res => {
          this.$message({
            type: 'success',
            message: res.msg
          })
          // 显示上传列表
          this.editPicList.push({
            name: res.map.name,
            url: res.map.signedUrl,
            id: res.map.fileKey
          })
          // 赋值(添加确认需要传的参)
          this.editFileList.fileName = res.map.name
          this.editFileList.filePath = res.map.signedUrl
          this.editFileList.fileKey = res.map.fileKey
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 编辑删除上传
    editRemove(file) {
      delUploadFile({
        fileKey: file.id
      })
        .then(res => {
          this.$message({
            type: 'success',
            message: res.msg
          })
          // 删除成功后清空列表
          if (res.res) {
            this.editPicList = []
          }
          console.log('after', this.editPicList)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>

<style scoped lang="scss">
@import url("../public.css");
/* 去掉input[type="number"]的默认箭头 */
.sorts /deep/ input[type="number"] {
  -moz-appearance: textfield;
}
.sorts /deep/ input[type="number"]::-webkit-inner-spin-button,
.sorts /deep/ input[type="number"]::-webkit-outer-spin-button{
  -webkit-appearance: none;
}
.wrapper {
  padding: 20px;
}
.user-wrapper{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: -10px;
  padding: 0;
}
.one-twow {
  width: 15%;
  border-right: 1px solid #e4e4e4;
  margin-right: 10px
}
.user-right{
  height: 100%;
  width: 85%;
  margin-top: 10px
}

.icon-selector {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  font-size: 30px;
  td {
    height: 70px;
    border: 1px solid #eee;
    cursor: pointer;
  }
}
</style>
