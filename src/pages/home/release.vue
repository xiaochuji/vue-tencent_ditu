<template>
  <div class="user-wrapper">
    <!-- 搜索区 -->
    <el-row class="list-wrapper">
      <div class="findList">
        <div class="find">
          <span>标题：</span>
          <input v-model="title" type="text" size="mini" style="width:65%">
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
        <el-button size="mini" style="margin-bottom:20px" type="primary" @click="add">新增</el-button>
      </el-row>
      <!-- 列表 -->
      <el-row>
        <el-col :span="24">
          <el-table :data="fMList" border>
            <el-table-column type="index" label="序号" align="center" width="80px" />
            <el-table-column prop="founder" label="创建人" align="center" />
            <el-table-column prop="foundertime" label="创建时间" align="center" />
            <el-table-column prop="title" label="标题" align="center" />
            <el-table-column fixed="right" label="操作" align="center" width="400px">
              <template slot-scope="scope">
                <el-button
                  style="padding: 9px 7px"
                  type="primary"
                  size="small"
                  @click="lookFn(scope.row)"
                >查看详情</el-button>
                <el-button
                  style="padding: 9px 7px"
                  type="warning"
                  size="small"
                  @click="findyiFn(scope.row)"
                >查看已读人员</el-button>
                <el-button
                  style="padding: 9px 7px"
                  type="success"
                  size="small"
                  @click="findUnred(scope.row)"
                >查看未读人员</el-button>
                <el-button
                  style="padding: 9px 7px"
                  type="danger"
                  size="small"
                  @click="zhuFn(scope.row)"
                >删除</el-button>
                <el-button
                  v-if="scope.row.islowershelf == 1"
                  style="padding: 9px 7px"
                  type="danger"
                  size="small"
                  @click="upFn(scope.row)"
                >上架</el-button>
                <el-button
                  v-if="scope.row.islowershelf == 0"
                  style="padding: 9px 7px"
                  type="danger"
                  size="small"
                  @click="downFn(scope.row)"
                >下架</el-button>
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
    <!-- 添加物资类型 -->
    <el-dialog :visible.sync="compaShow">
      <el-form>
        <el-form-item label="标题" :label-width="formLabelWidth" prop="loginId">
          <el-input v-model="addTitle" placeholder="请输入标题" size="mini" style="width:50%" />
        </el-form-item>
        <el-form-item label="文本内容" :label-width="formLabelWidth">
            <quill-editor
              v-model="editcontent"
              :options="editorOption"
              style="width:95%"
              @blur="onEditorBlur($event)"
              @focus="onEditorFocus($event)"
              @change="onEditorChange($event)"
            />
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="delSure">取 消</el-button>
        <el-button size="mini" type="primary" @click="addsure">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 已读人员弹框 -->
    <el-dialog :visible.sync="yiShow" title="已读人员列表">
      <el-table :data="yiList" border>
        <!-- <el-table-column type="index" label="序号" align="center" width="80px" /> -->
        <el-table-column prop="userAccount" label="姓名" align="center" />
        <!-- <el-table-column prop="foundertime" label="创建时间" align="center" />
        <el-table-column prop="title" label="标题" align="center" /> -->
      </el-table>
      <!-- 分页 -->
      <el-row class="pag">
        <el-pagination
          :current-page="readPage"
          :page-size="readSize"
          layout="total, prev, pager, next, jumper"
          :total="readTotal"
          @current-change="readChange"
        />
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="yiShow = false">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 未读人员弹框 -->
    <el-dialog :visible.sync="unread" title="未读人员列表">
      <el-table :data="unreadList" border>
        <!-- <el-table-column type="index" label="序号" align="center" width="80px" /> -->
        <el-table-column prop="userAccount" label="姓名" align="center" />
        <!-- <el-table-column prop="foundertime" label="创建时间" align="center" />
        <el-table-column prop="title" label="标题" align="center" /> -->
      </el-table>
      <!-- 分页 -->
      <el-row class="pag">
        <el-pagination
          :current-page="unreadPage"
          :page-size="unreadSize"
          layout="total, prev, pager, next, jumper"
          :total="unreadTotal"
          @current-change="unreadChange"
        />
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="unread = false">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 详情 -->
    <el-dialog :visible.sync="detailShow" title="详情">
      <div class="boxR" v-html="details" />
    </el-dialog>
  </div>
</template>
<script>
import { quillEditor } from 'vue-quill-editor' // 调用编辑器
import {
  addItem,
  findAll,
  findyi,
  findUnreadFn,
  writeOff,
  upDown
} from '@/api/home/announcement'
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      editorOption: {},
      editcontent: '', // 文本框内容
      title: '',
      addTitle: '', // 添加标题
      fMList: [],
      compaShow: false,
      yiShow: false,
      unread: false,
      currentPage: 1,
      pageSize: 5,
      total: 0,
      readPage: 1,
      readSize: 5,
      readTotal: 0,
      unreadPage: 1,
      unreadSize: 5,
      unreadTotal: 0,
      yiList: [],
      unreadList: [],
      formLabelWidth: '100px',
      details: '',
      detailShow: false,
      journalism_Id: '',
      readId: ''
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 上架
    upFn(row) {
      this.$confirm('确定上架？', '提示', {
        type: 'warning'
      })
        .then(() => {
          upDown({
            id: row.id,
            islowershelf: 0
          })
            .then(res => {
              if(res.res) {
                this.$message({
                  type: 'success',
                  message: res.msg
                })
                this.getList()
              }
            })
            .catch(error => {
              console.log(error)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消上架'
          })
        })
    },
    // 下架
    downFn(row) {
      this.$confirm('确定下架？', '提示', {
        type: 'warning'
      })
        .then(() => {
          upDown({
            id: row.id,
            islowershelf: 1
          })
            .then(res => {
              if(res.res) {
                this.$message({
                  type: 'success',
                  message: res.msg
                })
                this.getList()
              }
            })
            .catch(error => {
              console.log(error)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消下架'
          })
        })
    },
    // 查看详情
    lookFn(row) {
      this.detailShow = true
      this.details = row.news
    },
    // 模糊查询
    search() {
      if (this.title === '') {
        this.getList()
      } else {
        findAll({
          pageSize: this.pageSize,
          pageNumber: this.currentPage,
          spuerId: localStorage.getItem('id'),
          tel: this.title
        }).then(res => {
          let data = res.list
          this.fMList = data
          this.total = res.tel
        })
      }
    },
    // 获取列表
    getList() {
      findAll({
        pageSize: this.pageSize,
        pageNumber: this.currentPage,
        spuerId: localStorage.getItem('id')
      }).then(res => {
        let data = res.list
        this.fMList = data
        this.total = res.tel
      })
    },
    // 新增物资类型
    add() {
      this.compaShow = true
    },
    // 新增物资类型确认
    addsure() {
      if (this.addTitle === '') {
        this.$message('请输入标题')
        return false
      }
      if (this.editcontent === '') {
        this.$message('请输入内容')
        return false
      }
      addItem({
        title: this.addTitle,
        news: this.editcontent,
        isdisplay: 0,
        firmnews: {
          id: localStorage.getItem('id')
        },
        islowershelf: 0
      }).then(res => {
        if (res.res) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        }
        this.compaShow = false
        this.addTitle = ''
        this.editcontent = ''
        this.getList()
      })
    },
    // 新增取消
    delSure() {
      this.compaShow = false
      this.addTitle = ''
      this.editcontent = ''
    },
    // 清空
    clear() {
      this.title = ''
      this.getList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.search()
    },
    onEditorBlur(e) {
      console.log(11, e)
    },
    onEditorFocus(e) {
      console.log(22, e)
    },
    onEditorChange(e) {
      console.log(33, e)
    },
    readChange(val) {
      this.readPage = val
      this.getReadList()
    },
    // 获取已读人员列表
    findyiFn(e) {
      this.readPage = 1
      this.yiShow = true
      this.readId = e.id
      this.getReadList()
    },
    getReadList() {
      findyi({
        journalism_Id: this.readId,
        firmId: localStorage.getItem('id'),
        pageSize: this.readSize,
        pageNumber: this.readPage
      }).then(res => {
        if (res.res) {
          this.yiList = res.list
          this.readTotal = res.tel
        }
      })
    },
    unreadChange(val) {
      this.unreadPage = val
      this.getListOne()
    },
    // 获取未读人员列表
    findUnred(e) {
      this.unreadPage = 1
      this.unread = true
      this.journalism_Id = e.id
      this.getListOne()
    },
    getListOne() {
      findUnreadFn({
        journalism_Id: this.journalism_Id,
        firmId: localStorage.getItem('id'),
        pageSize: this.unreadSize,
        pageNumber: this.unreadPage
      }).then(res => {
        if (res.res) {
          this.unreadList = res.list
          this.unreadTotal = res.tel
        }
      })
    },
    // 注销
    zhuFn(e) {
      console.log(e)
      this.$confirm('确定注销？', '提示', {
        type: 'warning'
      })
        .then(() => {
          writeOff({
            id: e.id // 当前数据id
          }).then(res => {
            this.$message({
              type: 'success',
              message: res.msg
            })
            // 渲染列表
            this.getList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消注销'
          })
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
  width: 55%;
}
.find span {
  display: inline-block;
  width: 50px;
  text-align: right;
  font-size: 14px;
  color: #606266;
}
</style>
