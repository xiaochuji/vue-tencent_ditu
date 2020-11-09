<template>
  <div class="user-wrapper">
    <el-row class="list-wrapper">
      <el-row :span="24">
        <el-col :span="8" class="search-input">
          操作人：
          <el-input v-model="search.userName" size="mini" style="width:50%" />
        </el-col>
      </el-row>
      <!-- <div class="findList">
        <div class="find">
          <span>操作人：</span> -->
      <!-- <input v-model="search.userName" type="text"> -->
      <!-- <el-input v-model="search.userName"></el-input>
        </div>
      </div> -->
      <el-row class="sea-btns">
        <el-button size="mini" type="primary" @click="getList(true)">查询</el-button>
        <el-button size="mini" @click="clear">清空</el-button>
      </el-row>
    </el-row>

    <!-- 列表 -->
    <el-row>
      <el-col :span="24">
        <el-table :data="list" border>
          <el-table-column type="index" label="序号" align="center" width="80px" />
          <el-table-column prop="firmname" label="企业名称" align="center" />
          <el-table-column prop="username" label="操作人" align="center" />
          <el-table-column prop="foundertime" label="操作时间" align="center" />
          <el-table-column prop="message" label="操作内容" align="center" />
        </el-table>
      </el-col>
    </el-row>
    <!-- 分页 -->
    <el-row class="pag">
      <el-pagination
        :current-page.sync="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total"
        @current-change="handleCurrentChange"
      />
    </el-row>

  </div>
</template>
<script>
import { getLogList } from '@/api/log'
export default {
  data() {
    return {
      currentPage: 1,
      pageSize: 8,
      total: 0,
      list: [],
      search: {
        userName: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList(isSearch) {
      let params = {
        pageSize: this.pageSize,
        pageNumber: this.currentPage
      }
      if (isSearch) {
        params = Object.assign(params, this.search)
      }
      getLogList(params)
        .then(res => {
          if (res.res) {
            this.list = res.list
            this.total = res.total
          }
        })
    },
    clear() {
      this.search.userName = ''
    },
    handleCurrentChange(v) {
      this.getList()
    }
  }
}
</script>
<style scoped>
@import url("./public.css");
</style>
