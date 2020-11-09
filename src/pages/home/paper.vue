<template>
  <div class="user-wrapper">
    <!--    左边-->
    <div class="one-twow">
      <el-row class="list-wrapper">
        <el-row>
          <el-col class="search-input" :span="8">
            字典标识：
            <el-input v-model="menunum" size="mini" style="width:50%" />
          </el-col>
          <el-col class="search-input" :span="8">
            字典名称：
            <el-input v-model="menuName" size="mini" style="width:50%" />
          </el-col>
          <el-button size="mini" type="primary" @click="search">查询</el-button>
          <el-button size="mini" @click="clear">清空</el-button>
        </el-row>
      </el-row>
      <!-- 列表展示区 -->
      <el-row class="list-wrapper">
        <!-- 添加按钮 -->
        <el-row>
          <el-button size="mini" type="primary" style="margin-bottom:20px" @click="addPaperFn">+新增</el-button>
        </el-row>
        <!-- 列表 -->
        <el-row>
          <el-col :span="24">
            <el-table :data="sMList" border @row-click="setSelectFn">
              <el-table-column type="index" label="序号" align="center" width="50px" />
              <el-table-column prop="dictionaryTag" label="字典标识" align="center" width="80px" />
              <el-table-column prop="dictionaryName" label="字典名称" align="center" />
              <el-table-column prop="dictionaryType" label="字典类型" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.dictionaryType === '0'">系统</span>
                  <span v-if="scope.row.dictionaryType === '1'">企业</span>
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作" align="center" width="150px">
                <template slot-scope="scope">
                  <el-button type="primary" size="small" @click="setPaperFn(scope.row)">编辑</el-button>
                  <el-button type="danger" size="small" @click="del(scope.row)">删除</el-button>
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
      <el-dialog :title="setOrGet === 'add'?'添加' : '编辑'" :visible.sync="addPaper" :close-on-click-modal="false">
        <el-form :model="paperObj">
          <el-form-item label="字典标识" :label-width="formLabelWidth">
            <el-input v-model="paperObj.dictionaryTag" placeholder="请输入菜单名称" size="mini" style="width:50%" />
          </el-form-item>
          <el-form-item label="字典名称" :label-width="formLabelWidth">
            <el-input v-model="paperObj.paperName" placeholder="请输入菜单名称" size="mini" style="width:50%" />
          </el-form-item>
          <el-form-item label="字典类型" :label-width="formLabelWidth">
            <el-select v-model="paperObj.paperType" placeholder="请选择" size="mini" style="width:50%" @change="chooseAdd">
              <el-option
                v-for="item in paperList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="cancleAdd">取 消</el-button>
          <el-button size="mini" type="primary" @click="addpaper">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 右边 -->
    <div class="user-right">
      <!-- 搜索区 -->
      <el-row class="list-wrapper">
        <el-row>
          <el-col class="search-input" :span="8">
            字典对照码：
            <el-input v-model="menuCount" size="mini" style="width:50%" />
          </el-col>
          <el-col class="search-input" :span="8">
            字典对照值：
            <el-input v-model="menuic" size="mini" style="width:50%" />
          </el-col>
          <el-button style="margin-left:15px" size="mini" type="primary" @click="searchFn">查询</el-button>
          <el-button size="mini" @click="clearFn">清空</el-button>
        </el-row>
      </el-row>
      <!-- 列表展示区 -->
      <el-row class="list-wrapper">
        <el-row>
          <el-button size="mini" type="primary" style="margin-bottom:20px" @click="addDictionaries">+新增</el-button>
          <el-button size="mini" type="danger" style="margin-bottom:20px" @click="delSome">批量删除</el-button>
        </el-row>
        <!-- 列表 -->
        <el-row>
          <el-col :span="24">
            <el-table :data="rightList" border @selection-change="handleSelectionChange">
              <el-table-column type="index" label="序号" align="center" width="50px" />
              <el-table-column type="selection" width="55" />
              <el-table-column prop="dictionaryCode" label="对照码" align="center" />
              <el-table-column prop="dictionaryValue" label="对照值" align="center" />
              <el-table-column prop="dictionarySort" label="排序号" align="center" />
              <el-table-column fixed="right" label="当前状态" align="center" width="80px">
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.state1"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    @change="setState(scope.row)"
                  />
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作" align="center" width="150px">
                <template slot-scope="scope">
                  <el-button type="primary" size="small" @click="setDictionaries(scope.row)">编辑</el-button>
                  <el-button type="danger" size="small" @click="del(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <!-- 分页 -->
        <el-row class="pag">
          <el-pagination
            :current-page="currentPageRight"
            :page-size="pageSizeRight"
            layout="total, prev, pager, next, jumper"
            :total="righttotal"
            @current-change="handleCurrentChangeRight"
          />
        </el-row>
      </el-row>
      <!-- 添加  -->
      <el-dialog title="新增字典对照值" :visible.sync="addShow" :close-on-click-modal="false">
        <el-form :model="formlist" :inline="true">
          <el-form-item label="字典标识" :label-width="formLabelWidth" style="width:43%">
            <el-input v-model="formlist.file" placeholder="请输入字典标识" size="mini" />
          </el-form-item>
          <el-form-item label="字典名称" :label-width="formLabelWidth" style="width:43%">
            <el-input v-model="formlist.fileName" placeholder="请输入字典名称" size="mini" />
          </el-form-item>
          <el-form-item label="字典对照码" :label-width="formLabelWidth" style="width:43%">
            <el-input v-model="formlist.faFile" placeholder="请输入字典对照码" size="mini" />
          </el-form-item>
          <el-form-item label="字典对照值" :label-width="formLabelWidth" style="width:43%">
            <el-input v-model="formlist.num" placeholder="请输入字典对照值" size="mini" />
          </el-form-item>
          <el-form-item label="排序号" :label-width="formLabelWidth" style="width:43%">
            <el-input v-model="formlist.sorts" type="number" placeholder="请输入排序" size="mini" />
          </el-form-item>
          <el-form-item label="是否可选择" :label-width="formLabelWidth" style="width:44%">
            <el-select v-model="formlist.defaultfile" placeholder="请选择" size="mini" style="width:90%" @change="chooseAdd">
              <el-option v-for="item in checkList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="cancleAdd">取 消</el-button>
          <el-button size="mini" type="primary" @click="addSure">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getAllleft, delSList, delUploadFile, addFirst, saveDictionaryTwo, updateDictionaryState, delSome } from '@/api/home/second'
export default {
  data() {
    return {
      sort: '',
      menuCount: '',
      menuic: '',
      menuName: '', // 搜索菜单名称
      menunum: '',
      seaMType: '', // 搜索所属一级菜单
      FMList: [], // 搜索一级菜单列表
      addShow: false, // 添加显示
      sMList: [], // 二级菜单列表展示
      rightList: [],
      currentPage: 1, // 当前页
      pageSize: 8, // 每页数据
      total: 0, // 总条数
      righttotal: 0,
      pageSizeRight: 8,
      currentPageRight: 1,
      formLabelWidth: '100px',
      addFMList: [], // 添加一级菜单列表
      addMType: '', // 添加所属一级菜单
      editShow: false, // 编辑显示
      editFMList: [], // 编辑一级菜单列表
      editMType: '', // 编辑菜单所属一级菜单
      menuId: '', // 当前菜单id
      code: '', // 当前菜单code
      state: '', // 当前菜单state
      superiorcode: '',
      iconList: [], // 上传图标列表
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
      addPaper: false,
      paperList: [{
        label: '系统',
        value: '0'
      },
      {
        label: '业务',
        value: '1'
      }], // 字典类型
      paperObj: {
        dictionaryTag: '', // 字典标识
        paperName: '', // 字典名称
        paperType: '' // 字典类型
      },
      setOrGet: '',
      checkList: [
        {
          label: '是',
          value: '1'
        },
        {
          label: '否',
          value: '0'
        }
      ], // 是否可选择
      formlist: {
        file: '', // 字典标识
        fileName: '', // 字典名称
        faFile: '', // 字典对照码
        sorts: '', // 排序号
        num: '', // 对照值
        defaultfile: ''
      },
      addFilestatus: '',
      someid: '',
      editId: '',
      erjiId: '',
      erjiState: '',
      obj: {},
      num: 0,
      numRight: 0
    }
  },
  mounted() {
    this.getList()
    // this.getFList()
  },
  methods: {
    // 点击一级字典，渲染二级字典
    setSelectFn(item) {
      item ? localStorage.setItem('spuerId', item.id) : ''
      const id = item ? item.id : localStorage.getItem('spuerId')
      this.obj = item || JSON.parse(localStorage.getItem('obj'))
      getAllleft({
        pageSize: this.pageSizeRight,
        pageNumber: this.currentPageRight,
        spuerId: id
      })
        .then(res => {
          this.rightList = res.list
          for (var i = 0; i < this.rightList.length; i++) {
            if (this.rightList[i].state === '1') {
              this.rightList[i].state1 = true
            } else {
              this.rightList[i].state1 = false
            }
          }
          const data = res.tel
          for (var j = 0; j < data.length; j++) {
            if (data[j].state === '1') {
              data[j].state1 = false
            } else {
              data[j].state1 = true
            }
          }
          this.righttotal = data
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 新增对照
    addDictionaries() {
      this.addShow = true
      this.addFilestatus = 'add'
      if (this.obj && this.obj !== {}) {
        this.formlist.file = this.obj.dictionaryTag
        this.formlist.fileName = this.obj.dictionaryName
      }
    },
    handleSelectionChange(val) {
      let str = ''
      for (var i = 0; i < val.length; i++) {
        str += val[i].id + ','
      }
      this.someid = str.substr(0, str.length - 1)
    },
    // 编辑对照值
    setDictionaries(item) {
      this.erjiState = item.state
      this.addShow = true
      this.addFilestatus = 'set'
      this.erjiId = item.id
      this.formlist.file = item.dictionaryTag // 字典标识
      this.formlist.fileName = item.dictionaryName // 字典名称
      this.formlist.faFile = item.dictionaryCode // 字典对照码
      this.formlist.sorts = item.dictionarySort // 排序号
      this.formlist.num = item.dictionaryValue // 对照值
      this.formlist.defaultfile = item.optional
    },
    // 新增字典
    addPaperFn() {
      this.addPaper = true
      this.setOrGet = 'add'
    },
    setPaperFn(item) {
      this.editId = item.id
      this.paperObj.dictionaryTag = item.dictionaryTag
      this.paperObj.paperName = item.dictionaryName
      this.paperObj.paperType = item.dictionaryType
      this.addPaper = true
      this.setOrGet = 'set'
    },
    // 初始化列表
    getList() {
      getAllleft({
        pageSize: this.pageSize,
        pageNumber: this.currentPage,
        spuerId: 0
      })
        .then(res => {
          this.sMList = res.list
          this.total = res.tel
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 搜索选中一级菜单
    choose(e) {
      this.seaMType = e
    },
    // 添加选中一级菜单
    chooseAdd(e) {
      this.addMType = e
    },
    // 编辑选中一级菜单
    chooseEdit(e) {
      this.editMType = e
    },
    // 搜索
    search() {
      if (this.num === 0) {
        this.currentPage = 1
        this.num++
      }
      getAllleft({
        pageSize: this.pageSize,
        pageNumber: this.currentPage,
        dictionaryName: this.menuName,
        dictionaryTag: this.menunum,
        spuerId: 0
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
    },
    // 搜索二级字典
    searchFn() {
      if (this.numRight === 0) {
        this.currentPage = 1
        this.numRight++
      }
      const spuerId = localStorage.getItem('spuerId')
      getAllleft({
        pageSize: this.pageSizeRight,
        pageNumber: this.currentPageRight,
        dictionaryCode: this.menuCount,
        dictionaryValue: this.menuic,
        spuerId: spuerId
      })
        .then(res => {
          this.$message({
            type: 'success',
            message: res.msg
          })
          this.rightList = res.list
          for (var i = 0; i < this.rightList.length; i++) {
            if (this.rightList[i].state === '1') {
              this.rightList[i].state1 = true
            } else {
              this.rightList[i].state1 = false
            }
          }
          const data = res.tel
          for (var j = 0; j < data.length; j++) {
            if (data[j].state === '1') {
              data[j].state1 = false
            } else {
              data[j].state1 = true
            }
          }
          this.righttotal = data
          this.total = res.tel
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 修改字典状态
    setState(item) {
      updateDictionaryState({
        dictionaryId: item.id
      })
        .then(res => {
          if (res.res) {
            this.$message({
              type: 'success',
              message: '状态修改成功'
            })
            this.setSelectFn()
          }
        })
    },
    // 左侧查询清空
    clear() {
      this.menuName = ''
      this.menunum = ''
      this.currentPage = 1
      this.getList()
      this.num = 0
    },
    // 右侧查询清空
    clearFn() {
      this.menuCount = ''
      this.menuic = ''
      this.currentPageRight = 1
      this.searchFn()
      this.numRight = 0
    },
    // 新增字典对照值
    edit(row) {
      this.addShow = true
      this.addFilestatus = 'newAdd'
    },
    // 删除
    del(row) {
      this.$confirm('确定删除？', '提示', {
        type: 'warning'
      })
        .then(() => {
          delSList({
            dictionaryId: row.id
          })
            .then(res => {
              this.$message({
                type: 'success',
                message: res.msg
              })
              // 渲染列表
              this.getList()
              this.setSelectFn()
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
      console.log(val)
      this.currentPage = val
      this.getList()
    },
    handleCurrentChangeRight(val) {
      this.currentPageRight = val
      this.setSelectFn()
    },
    // 添加字典确认
    addpaper() {
      // 判断是否为空
      if (this.paperObj.dictionaryTag === '') {
        this.$message('字典标识不能为空')
        return false
      }
      if (this.paperObj.paperName === '') {
        this.$message('字典名称不能为空')
        return false
      }
      if (this.paperObj.paperType === '') {
        this.$message('字典类型不能为空')
        return false
      }
      // 如果类型是add则添加字典，否则编辑字典
      if (this.setOrGet === 'add') {
        addFirst({
          dictionaryTag: this.paperObj.dictionaryTag, // 标识
          dictionaryName: this.paperObj.paperName, // 字典名称
          dictionaryType: this.paperObj.paperType // 字典类型
        }).then(res => {
          if (res.res) {
            this.$message({
              type: 'success',
              message: res.msg
            })
            this.getList()
            this.paperObj.dictionaryTag = ''
            this.paperObj.paperName = ''
            this.paperObj.paperType = ''
            this.addPaper = false
          }
        })
      } else {
        addFirst({
          id: this.editId,
          dictionaryTag: this.paperObj.dictionaryTag, // 标识
          dictionaryName: this.paperObj.paperName, // 字典名称
          dictionaryType: this.paperObj.paperType // 字典类型
        }).then(res => {
          if (res.res) {
            this.$message({
              type: 'success',
              message: '编辑字典成功'
            })
            this.paperObj.dictionaryTag = ''
            this.paperObj.paperName = ''
            this.paperObj.paperType = ''
            this.addPaper = false
          }
        })
      }
    },
    // 添加确认二级字典
    addSure() {
      localStorage.setItem('obj', JSON.stringify(this.obj))
      if (this.formlist.file === '') {
        this.$message('请输入字典标识')
        return false
      }
      if (this.formlist.fileName === '') {
        this.$message('请输入字典名称')
        return false
      }
      if (this.formlist.faFile === '') {
        this.$message('请输入字典对照码')
        return false
      }
      if (this.formlist.sorts === '') {
        this.$message('请输入字典排序号')
      }
      if (this.formlist.defaultfile === '') {
        this.$message('请选择是否可以进行选择')
        return false
      }
      // 如果是添加走add，否则编辑
      const spuerId = localStorage.getItem('spuerId')
      if (this.addFilestatus === 'add') {
        saveDictionaryTwo({
          spuerId: spuerId,
          dictionaryTag: this.formlist.file,
          dictionaryName: this.formlist.fileName,
          optional: this.formlist.defaultfile,
          dictionarySort: this.formlist.sorts,
          dictionaryCode: this.formlist.faFile,
          dictionaryValue: this.formlist.num
        }).then(res => {
          if (res.res) {
            this.$message({
              type: 'success',
              message: res.msg
            })
            this.setSelectFn()
            this.addShow = false
            this.formlist.file = ''
            this.formlist.fileName = ''
            this.formlist.defaultfile = ''
            this.formlist.sorts = ''
            this.formlist.faFile = ''
            this.formlist.num = ''
          } else {
            this.$message('保存二级字典失败')
          }
        })
        this.setSelectFn()
      } else if (this.addFilestatus === 'set') {
        saveDictionaryTwo({
          spuerId: spuerId,
          id: this.erjiId,
          state: this.erjiState,
          dictionaryTag: this.formlist.file,
          dictionaryName: this.formlist.fileName,
          optional: this.formlist.defaultfile,
          dictionarySort: this.formlist.sorts,
          dictionaryCode: this.formlist.faFile,
          dictionaryValue: this.formlist.num
        }).then(res => {
          if (res.res) {
            this.$message({
              type: 'success',
              message: res.msg
            })
            this.setSelectFn()
            this.addShow = false
            this.formlist.file = ''
            this.formlist.fileName = ''
            this.formlist.defaultfile = ''
            this.formlist.sorts = ''
            this.formlist.faFile = ''
            this.formlist.num = ''
          } else {
            this.$message('保存二级字典失败')
          }
        })
      }
    },
    // 批量删除二级字典
    delSome() {
      delSome({
        dictionaryId: this.someid
      })
        .then(res => {
          if (res.res) {
            this.$message({
              type: 'success',
              message: '批量删除成功'
            })
            this.searchFn()
          }
        })
    },
    // 取消添加
    cancleAdd() {
      delUploadFile({
        fileKey: this.fileList.id
      })
        .then(res => {
          this.addShow = false
          this.$message({
            type: 'info',
            message: '取消编辑'
          })
          this.addPaper = false
          // 清空上传的列表
          this.iconList = []
        })
        .catch(error => {
          console.log(error)
        })
      // }
    },
    // 取消编辑
    cancleEdit() {
      if (this.editPicList.length === 0) {
        this.$message({
          type: 'info',
          message: '请上传图片'
        })
      } else {
        // 如果上传文件之后取消添加，调接口删除已经上传的文件
        delUploadFile({
          fileKey: this.editFileList.fileKey
        })
          .then(res => {
            this.editShow = false
            this.$message({
              type: 'info',
              message: '取消编辑'
            })
            // 清空上传的列表
            this.editPicList = []
          })
          .catch(error => {
            console.log(error)
          })
      }
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
.sorts /deep/ input[type="number"]::-webkit-outer-spin-button{
  -webkit-appearance: none;
}
.app-main{
  width: 100%;
  height: 100%;
}
.user-wrapper{
  display: flex;
  justify-content: space-between;
}
.one-twow {
  width: 45%;
  margin-right: 10px;
}
.user-right{
  width: 55%;
  height: 100%;
  flex: 1;
}
.list-wrapper{
  background: none;
  padding: 20px 10px
}
</style>
