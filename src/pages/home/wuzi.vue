<template>
  <div class="user-wrapper">
    <!-- 搜索区 -->
    <el-row class="list-wrapper">
      <div class="findList">
        <div class="find">
          <span>物资名称：</span>
          <el-select v-model="materialName" placeholder="全部" size="mini" style="width:auto">
            <el-option
              v-for="item in fMList"
              :key="item.value"
              :label="item.materialName"
              :value="item.materialName"
             />
          </el-select>
        </div>
        <!-- <div class="find">
          <span>计量单位：</span>
          <input v-model="materialUnit" type="text">
        </div> -->
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
        <el-button size="mini" style="margin-bottom:20px" type="primary" @click="add">添加物资类型</el-button>
        <el-button size="mini" style="margin-bottom:20px" type="primary" @click="addStorage">入库</el-button>
        <el-button size="mini" style="margin-bottom:20px" type="primary" @click="getTypeExcal">物资类型导出</el-button>
      </el-row>
      <!-- 列表 -->
      <el-row>
        <el-col :span="24">
          <el-table :data="fMList" border>
            <el-table-column type="index" label="序号" align="center" width="80px" />
            <el-table-column prop="createUser" label="创建人" align="center" />
            <el-table-column prop="time" label="创建时间" align="center" />
            <el-table-column prop="materialName" label="物资名称" align="center" />
            <el-table-column prop="materialResidue" label="剩余" align="center" />
            <el-table-column prop="materialUnit" label="计量单位" align="center" />
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
      <!-- 流动列表 -->
    <el-row class="list-wrapper">
      <div class="findList">
        <div class="find">
          <span>类型：</span>
          <el-select v-model="type" placeholder="全部" size="mini">
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
             />
          </el-select>
        </div>
        <div class="find">
          <span>代领人：</span>
          <input v-model="updateUser" type="text">
        </div>
      </div>
      <el-row class="sea-btns">
        <el-button size="mini" type="primary" @click="liuSearch">查询</el-button>
        <el-button size="mini" @click="liuClear">清空</el-button>
      </el-row>
    </el-row>
      <!-- 列表 -->
      <el-row>
        <el-button size="mini" style="margin-bottom:20px" type="primary" @click="getExcal">台账导出</el-button>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table :data="liuList" border>
            <el-table-column type="index" label="序号" align="center" width="80px" />
            <el-table-column prop="createUser" label="创建人" align="center" />
            <el-table-column prop="time" label="创建时间" align="center" />
            <el-table-column prop="helpUserName" label="代领人" align="center" />
            <el-table-column prop="ownUserName" label="实际领取人" align="center" />
            <el-table-column prop="sysMaterial.materialName" label="物资名称" align="center" />
            <el-table-column prop="sysMaterial.materialResidue" label="数量" align="center">
              <template  slot-scope="scope">
                <span v-if="scope.row.type == '0'" style="color:green">+{{scope.row.number}}</span>
                <span v-if="scope.row.type == '1'" style="color:red">-{{scope.row.number}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="sysMaterial.materialUnit" label="计量单位" align="center" />
            <el-table-column label="类型" align="center">
              <template  slot-scope="scope">
                <span v-if="scope.row.type&&scope.row.type == 0">公司购买增加库存</span>
                <span v-else>员工领取减少库存</span>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <!-- 分页 -->
      <el-row class="pag">
        <el-pagination
          :current-page="pageNumber"
          :page-size="pagesize"
          layout="total, prev, pager, next, jumper"
          :total="liutotal"
          @current-change="liuChange"
        />
      </el-row>
    </el-row>
    <!-- 添加物资类型 -->
    <el-dialog :visible.sync="compaShow">
      <el-form :inline="true" :model="form">
        <el-form-item label="物资名称" :label-width="formLabelWidth" style="width:40%" prop="loginId">
          <el-input v-model="form.materialName" placeholder="请输入物资名称" size="mini" />
        </el-form-item>
        <el-form-item label="计量单位" :label-width="formLabelWidth" style="width:40%" prop="userName">
          <el-input v-model="form.materialUnit" placeholder="请输入计量单位" size="mini" />
        </el-form-item>
        <el-form-item label="是否展示" :label-width="formLabelWidth" style="width:40%" prop="role">
          <el-select v-model="form.isDel" placeholder="全部" size="mini" style="width:92%">
            <el-option 
              v-for="item in delList" 
              :key="item.value"
              :label="item.label"
              :value="item.value"
             />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="delSure">取 消</el-button>
        <el-button size="mini" type="primary" @click="addsure">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 入库 -->
    <el-dialog :visible.sync="storage">
      <el-form :inline="true" :model="storageForm">
        <el-form-item label="物资类型" :label-width="formLabelWidth" style="width:40%" prop="loginId">
          <el-select v-model="storageForm.materialUnit" placeholder="全部" size="mini" style="width:92%">
            <el-option
              v-for="item in fMList"
              :key="item.value"
              :label="item.materialName"
              :value="item.id"
             />
          </el-select>
        </el-form-item>
        <el-form-item label="数量" :label-width="formLabelWidth" style="width:40%" prop="contact">
          <el-input v-model="storageForm.number" type="number" placeholder="请输入数量" size="mini" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="delStorage">取 消</el-button>
        <el-button size="mini" type="primary" @click="storageSure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  save,
  getAllList,
  SysMaterialRecord,
  getTwoList,
  exported
} from '@/api/home/wuzi'
import { baseUrl } from '@/utils/request'
export default {
  data() {
    return {
      materialUnit: '',
      materialName: '',
      userName: '',
      temperature: '',
      fMList: [],
      compaShow: false,
      currentPage: 1,
      pageSize: 5,
      total: 0,
      pagesize: 5,
      pageNumber: 1,
      liutotal: 0,
      liuName: '',
      liuList: [],
      updateUser: '',
      type: '',
      formLabelWidth: '100px',
      storage: false,
      delList: [
        {
          label: '是',
          value: '0'
        },
        {
          label: '否',
          value: '1'
        }
      ],
      form: {
        materialName: '', // 物资名称
        materialUnit: '', // 计量单位
        isDel: '' // 是否展示
      },
      storageForm: {
        materialUnit: '', // 物资类型
        number: '', // 数量
        type: ''
      },
      typeList: [
        {
          label: '公司购买增加库存',
          value: '0'
        },
        {
          label: '员工领取减少库存',
          value: '1'
        }
      ],
      materialUnitList: [] // 物资类型集合
    }
  },
  mounted() {
    this.getList()
    this.getLiuList()
  },
  methods: {
    // 物资类型导出
    getTypeExcal() {
      window.open(baseUrl + '/sysMaterial/export?materialName=' + this.materialName + '&firmId=' + localStorage.getItem('id'))
    },
    // 台账导出
    getExcal() {
      window.open(baseUrl + '/sysMaterialRecord/export?ownUserName=' + this.updateUser + '&spuerId=' + localStorage.getItem('id') + '&tpye=' + this.type)
    },
    // 模糊查询
    search() {
      if (this.materialName === '') {
        this.getList()
      } else {
        getAllList({
          pageSize: this.pageSize,
          pageNumber: this.currentPage,
          isDel: 0,
          materialName: this.materialName
        }).then(res => {
          let data = res.list
          data.map(item => {
            item.time = new Date(parseInt(item.createTime)).toLocaleString().replace(/:\d{1,2}$/,' ');
          })
          this.fMList = data
          this.total = res.tel
        })
      }
    },
    // 获取列表
    getList() {
      getAllList({
        pageSize: this.pageSize,
        pageNumber: this.currentPage,
        isDel: 0,
        firmId: localStorage.getItem('id')
      }).then(res => {
        let data = res.list
        data.map(item => {
          item.time = new Date(parseInt(item.createTime)).toLocaleString().replace(/:\d{1,2}$/,' ');
        })
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
      if (this.form.isDel === '') {
        this.$message('请选择是否展示')
        return false
      }
      if (this.form.materialName === '') {
        this.$message('请输入物资名称')
        return false
      }
      if (this.form.materialUnit === '') {
        this.$message('请输入计量单位')
        return false
      }
      save({
        isDel: this.form.isDel,
        materialName: this.form.materialName,
        materialUnit: this.form.materialUnit,
        firmId: localStorage.getItem('id'),
        materialResidue: 0
      }).then(res => {
        if (res.res) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        }
        this.compaShow = false
        this.form.isDel = ''
        this.form.materialName = ''
        this.form.materialUnit = ''
        this.getList()
      })
    },
    // 新增物资类型取消
    delSure() {
      this.compaShow = false
      this.form.isDel = ''
      this.form.materialName = ''
      this.form.materialUnit = ''
    },
    // 点击入库
    addStorage() {
      this.storage = true
    },
    // 新增入库确认
    storageSure() {
      if (this.storageForm.materialUnit === '') {
        this.$message('请先选择物资类型')
        return false
      }
      if (this.storageForm.number === '') {
        this.$message('请先输入操作数量')
        return false
      }
      SysMaterialRecord({
        materialId: this.storageForm.materialUnit,
        sysMaterial: {
          id: this.storageForm.materialUnit
        },
        userId: localStorage.getItem('userid'),
        type: '0',
        number: this.storageForm.number,
        createUser: localStorage.getItem('user')
      }).then(res => {
        if (res.res) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        }
        this.storage = false
        this.storageForm.materialUnit = ''
        this.storageForm.type = ''
        this.storageForm.number = ''
        this.getList()
      })
    },
    // 新增入库取消
    delStorage() {
      this.storage = false
      this.storageForm.materialName = ''
      this.storageForm.type = ''
      this.storageForm.number = ''
    },
    // 清空
    clear() {
      this.materialName = ''
      this.materialUnit = ''
      this.getList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.search()
    },
    getLiuList() {
      getTwoList({
        pageSize: this.pagesize,
        pageNumber: this.pageNumber,
        spuerId: localStorage.getItem('id')
      }).then(res => {
        let data = res.list
        data.map(item => {
          item.time = new Date(parseInt(item.createTime)).toLocaleString().replace(/:\d{1,2}$/,' ')
        })
        this.liuList = data
        this.liutotal = res.tel
      })
    },
    liuSearch() {
      if (this.type === '' && this.updateUser === '') {
        this.getLiuList()
      } else {
        getTwoList({
          pageSize: this.pagesize,
          pageNumber: this.pageNumber,
          spuerId: localStorage.getItem('id'),
          tpye: this.type,
          ownUserName: this.updateUser
        }).then(res => {
          let data = res.list
          data.map(item => {
            item.time = new Date(parseInt(item.createTime)).toLocaleString().replace(/:\d{1,2}$/,' ');
          })
          this.liuList = data
          this.liutotal = res.tel
        })
      }
    },
    liuChange(val) {
      this.pageNumber = val
      this.liuSearch()
    },
    liuClear() {
      this.type = ''
      this.updateUser = ''
      this.getLiuList()
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
  width: 25%;
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
