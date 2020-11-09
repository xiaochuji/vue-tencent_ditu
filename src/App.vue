<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style>
  .app-container {
    max-width: 1200px;
  }
  .app-container .el-row {
    margin-bottom: 20px;
  }
  .app-container .el-row:last-child {
    margin-bottom: 0;
  }
  .app-container .el-form-item:last-child {
    margin-bottom: 0;
  }
  .app-container .el-input {
    width: 180px;
  }
  .wrapper {
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 10px;
    border: 1px solid #999;
  }
  .search-wrapper {
    padding: 20px;
    margin-bottom: 20px;
    background: #f7f7f7;
    border-radius: 15px;
  }
  .search-item {
    display: inline-block;
    margin-right: 30px;
    margin-bottom: 10px;
  }
</style>
