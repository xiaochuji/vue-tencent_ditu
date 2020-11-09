<template>
  <el-row class="container">
    <el-col :span="24" class="header">
      <el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'"></el-col>
      <el-col :span="9" class="logo-font">
        {{collapsed?'':sysName}}
      </el-col>
      <el-col :span="5" class="userinfo">
        <el-dropdown trigger="hover">
          <span class="el-dropdown-link userinfo-inner">欢迎{{sysUserName}} 登录</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="showqianzhang" v-if="show == true">上传电子签章</el-dropdown-item>
            <el-dropdown-item @click.native="yonghu">用户信息</el-dropdown-item>
            <el-dropdown-item @click.native="passwordmima">更改密码</el-dropdown-item>
            <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-col>
    <!-- 上传附件 -->
    <el-dialog title="上传电子签章" :visible.sync="uploadattachment">
      <el-form>
        <el-form-item label="电子签章" :label-width="formLabelWidth">
          <el-upload
            class="upload-demo"
            action="123"
            ref="upload1"
            multiple
            :http-request="submitUpload1"
            accept=".jpg, .jpeg, .png, .JPG, .JPEG"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :file-list="filelist"
            :on-preview="handleDown"
          >
            <el-button size="mini" type="primary">上传附件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="uploadattachment = false">取 消</el-button>
        <el-button type="primary" @click="uploadokbutton">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 用户信息查看 -->
    <el-dialog title="用户信息" :visible.sync="dialogFormVisible" width='25%'>
      <el-form :model="form" :data="oklist">
        <el-form-item label="登录账号：" :label-width="formLabelWidth" color='#66b1ff' label-class-name='workOrderStyle'>
          <div>{{oklist.userName}}</div>
        </el-form-item>
        <el-form-item label="用户名：" :label-width="formLabelWidth" label-class-name='workOrderStyle'>
          <div>{{namerole}}</div>
        </el-form-item>
        <el-form-item label="性别：" :label-width="formLabelWidth" label-class-name='workOrderStyle'>
          <div>{{oklist.gender}}</div>
        </el-form-item>
        <el-form-item label="部门名称：" :label-width="formLabelWidth" label-class-name='workOrderStyle'>
          <div>{{oklist.departmentName}}</div>
        </el-form-item>
        <el-form-item label="角色名称：" :label-width="formLabelWidth" label-class-name='workOrderStyle'>
          <div>{{this.namerole}}</div>
        </el-form-item>
        <el-form-item label="联系方式：" :label-width="formLabelWidth" label-class-name='workOrderStyle'>
          <div>{{oklist.telephone}}</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 更改密码 -->
    <el-dialog title="更改密码" :visible.sync="newpassword">
      <el-form :model="form">
        <el-form-item label="旧密码：" :label-width="formLabelWidth">
          <el-input v-model="oldpass"></el-input>
        </el-form-item>
        <el-form-item label="新密码：" :label-width="formLabelWidth">
          <el-input v-model="xinmima"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="savepaw">保 存</el-button>
        <el-button @click="newpassword = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-col :span="24" class="main">
      <aside :class="collapsed?'menu-collapsed':'menu-expanded'">
        <el-scrollbar class="scrollbar-wrapper">
          <!--导航菜单-->
          <el-menu
            :default-active="$route.path"
            class="el-menu-vertical-demo"
            @open="handleopen"
            @close="handleclose"
            @select="handleselect"
            unique-opened
            router
            v-show="!collapsed"
          >
            <template v-for="(item,index) in permissionRouters" v-if="!item.hidden">
              <el-submenu :index="index+''" v-if="!item.leaf">
                <template slot="title">
                  <i :class="item.iconCls" style="color:#fff"></i>
                  <span style="color:#fff">{{item.name}}</span>
                </template>
                <el-menu-item
                  style="color:#fff"
                  v-for="child in item.children"
                  :index="child.path"
                  :key="child.path"
                  v-if="!child.hidden"
                >{{child.name}}</el-menu-item>
              </el-submenu>
              <el-menu-item v-if="item.leaf&&item.children&&item.children.length&&item.children.length>0" :index="item.children[0].path">
                <i :class="item.iconCls"></i>
                <span style="color: #fff;">{{item.children[0].name}}</span>
              </el-menu-item>
              <!-- <el-submenu :index="index+''" v-if="!item.single">
                <template slot="title">
                  <i :class="item.iconCls" style="color:#fff"></i>
                  <span style="color:#fff">{{item.name}}</span>
                </template>
                <el-menu-item
                  style="color:#fff"
                  v-for="child in item.children"
                  :index="child.path"
                  :key="child.path"
                  v-if="!child.hidden"
                >{{child.name}}</el-menu-item>
              </el-submenu>
              <el-menu-item v-else :index="item.path">
                <i :class="item.iconCls"></i>
                <span style="color: #fff;">{{item.name}}</span>
              </el-menu-item> -->
            </template>
          </el-menu>
        </el-scrollbar>
      </aside>
      <section class="content-container">
        <div class="grid-content bg-purple-light">
          <el-col :span="24" class="breadcrumb-container">
            <el-breadcrumb separator="/" class="breadcrumb-inner" style="height:30px;line-height:30px">
              <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
                <span>{{ item.name }}</span></el-breadcrumb-item>
            </el-breadcrumb>
          </el-col>
          <el-col :span="24" class="content-wrapper">
            <transition name="fade" mode="out-in">
              <router-view></router-view>
            </transition>
          </el-col>
        </div>
      </section>
    </el-col>
  </el-row>
</template>

<script>
import api from "@/api/api";
import axios from "axios";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      uploadattachment: false,
      submitUpload3: "",
      sysName: "中国机房设施工程公司OA系统",
      collapsed: false,
      sysUserName: "",
      formLabelWidth: "120px",
      sysUserAvatar: "",
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      dialogFormVisible: false, //用户信息查看
      newpassword: false, //修改密码弹框
      oklist: [], //初始化用户信息集合
      xinmima: "", //新密码
      oldpass: "", //旧密码
      namerole: "", //角色名称
      mima: "",
      show: false,
      filelist:[]//电子签章展示
    };
  },
  computed: {
    ...mapGetters({
      permissionRouters: "permissionRouters"
    })
  },
  methods: {
    // 删除上传的附件
    beforeRemove(file, fileList) {
      // console.log(file);
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    //删除上传的文件
    handleRemove(file, fileList) {
      // console.log(file, fileList);
      api.delSign({ billId: file.id })
      .then(res => {
        // console.log(res);
        this.$message({
          type: "success",
          message: res.data.msg
        });
      });
    },
    //下载电子签章
    handleDown(file){
      // console.log(file)
      window.open(api.BASE_URL + "/download/downFile?filePath=" + file.url);
    },
    // 上传确定按钮
    uploadokbutton() { 
      // 清空上传文件列表
      // this.$refs.upload1.clearFiles();
      this.uploadattachment = false;
    },
    submitUpload1() {
      // 获取上传的文件信息
      let { uploadFiles } = this.$refs.upload1;
      let form = new FormData();
      // console.log(uploadFiles);
      let item = uploadFiles[uploadFiles.length - 1];
      form.append("file", item.raw);
      form.append("userId", this.oklist.id);
      // uploadFiles.forEach(item => {
      //   console.log("122", item, this.oklist.id);
      //   form.append("file", item.raw);
      //   form.append("userId", this.oklist.id);
      // });
      //调取接口上传form参数
      api.shangchuan(form).then(res => {
        // console.log(res);
        this.$message({
          type: "success",
          message: res.data.msg
        });
      });
    },
    // 上传电子签章
    showqianzhang() {
      this.uploadattachment = true;
      this.filelist=[]
      this.getSign()
    },
    // 获取上传的签章
    getSign(){
      api.getSign()
      .then(res=>{
        for(var i=0;i<res.data.list.length;i++){
          this.filelist.push({
            name: res.data.list[i].fileName,
            url: res.data.list[i].filePath,
            id: res.data.list[i].id
          })
        }
      })
    },
    
    // 更改密码
    passwordmima() {
      this.newpassword = true;
      // this.selectuaername();
    },
    selectuaername() {
      // console.log(this.oklist.id);
      const userId = {
        userId: this.oklist.id
      };
      api.searchgetUser(userId).then(res => {
        // console.log("查询", res.data.list.password);
        this.mima = res.data.list.password;
      });
    },
    savepaw() {
      if (this.oldpass == "" || this.oldpass == null) {
        this.$message({
          type: "info",
          message: "请填写原密码！!"
        });
      } else if (this.xinmima == "" || this.xinmima == null) {
        this.$message({
          type: "info",
          message: "请填写新密码！!"
        });
      } else {
        api
          .userxiugai({
            oldPas: this.oldpass,
            newPas: this.xinmima,
            userName: this.oklist.userName
          })
          .then(res => {
            // console.log("返回结果", res);
            if (res.data.res == true) {
              this.newpassword = false;
              this.$message({
                type: "success",
                message: "更改密码成功!"
              });
              this.oldpass = "";
              this.xinmima = "";
            } else {
              this.$message({
                type: "info",
                message: "更改密码失败!"
              });
            }
          });
      }
    },
    // 查看用户信息
    yonghu() {
      this.dialogFormVisible = true;
    },
    // 获取session
    getInfo() {
      this.userInfo = JSON.parse(sessionStorage.getItem("user"));
      this.oklist = this.userInfo.list;
      console.log(this.oklist)
      this.namerole = this.oklist.name;
      for (var i = 0; i < this.oklist.role.permissions.length; i++) {
        // console.log(this.oklist.role.permissions[i].permissionName);
        if (this.oklist.role.permissions[i].permissionName == "总经理审核") {
          this.show = true;
        }
      }
    },
    onSubmit() {
      // console.log("submit!");
    },
    handleopen() {
      //console.log('handleopen');
    },
    handleclose() {
      //console.log('handleclose');
    },
    handleselect: function(a, b) {},
    //退出登录
    logout: function() {
      var _this = this;
      this.$confirm("确认退出吗?", "提示", {
        //type: 'warning'
      })
        .then(() => {
          sessionStorage.removeItem("user");
          localStorage.removeItem("login_user_message");
          _this.$router.push("/login");
          location.reload();
        })
        .catch(() => {});
    },
    //折叠导航栏
    collapse: function() {
      this.collapsed = !this.collapsed;
    },
    showMenu(i, status) {
      this.$refs.menuCollapsed.getElementsByClassName(
        "submenu-hook-" + i
      )[0].style.display = status ? "block" : "none";
    }
  },
  created() {
    // 当页面重新刷新时，重新加载缓存中的token数据传入到ajax通信请求头中
    if (!axios.defaults.headers.common["Authorization"]) {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = token;
    }
  },
  mounted() {
    this.getInfo();
    var user = sessionStorage.getItem("user");
    if (user) {
      user = JSON.parse(user);
      this.sysUserName = user.list.name || "";
      this.sysUserAvatar = user.avatar || "";
    }
  }
};
</script>
<style lang="scss">
.scrollbar-wrapper {
  overflow-x: hidden !important;
  height: 100%;
  .el-scrollbar__view {
    height: 100%;
  }
}
.el-submenu__title:hover {
  // background: rgb(48, 65, 86);
  background: none;
}
.el-menu-item.is-active{
  // color: rgb(64, 158, 255) !important;
  // color: #333 !important;
}
.el-submenu.is-active .el-submenu__title span{
  // color: #999 !important;
}
</style>
<style scoped lang="scss">
@import "~scss_vars";
.el-icon-arrow-down:before {
  color: red;
}
.container {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
  .header {
    position: relative;
    height: 60px;
    line-height: 60px;
    background: #ffffff;
    border-bottom: 1px solid #f5f5f5;
    color: $color-primary;
    .logo-font {
      position: absolute;
      width: 100%;
      top: 0;
      left: 0;
      // margin-left: -20px;
      text-align: center;
      // color: #4c6eff;
      color: rgb(48, 65, 86);
      font-family: "楷体";
      font-weight: bold;
      font-size: 32px;
      // font-weight:bold;
      letter-spacing: 5px;
      // font-display:
      // height:100px;
      // line-height:100px;
    }
    .userinfo {
      text-align: right;
      padding-right: 40px;
      float: right;
      .userinfo-inner {
        cursor: pointer;
        // color: #4c6eff;
        color: rgb(48, 65, 86);
        font-size: 16px;
        font-weight: bold;
        // img {
        //   width: 40px;
        //   height: 40px;
        //   border-radius: 20px;
        //   margin: 10px 0px 10px 10px;
        //   float: right;
        // }
      }
    }
    .logo {
      //width:230px;
      // height: 160px;
      height: 60px;
      font-size: 22px;
      padding-left: 20px;
      padding-right: 20px;
      border-color: #f0f0f0;
      border-right-width: 1px;
      border-right-style: solid;
      background: url("../assets/OA_logo1.png") no-repeat center 5px;
      // background-size: 90%;
      background-size: 80%;
      background-color: #ffffff;
      img {
        width: 40px;
        float: left;
        margin: 10px 10px 10px 18px;
      }
      .txt {
        color: #fff;
      }
    }
    .logo-width {
      width: 230px;
    }
    .logo-collapse-width {
      width: 60px;
    }
    .tools {
      padding: 0px 23px;
      width: 14px;
      height: 60px;
      line-height: 60px;
      cursor: pointer;
    }
  }
  .main {
    display: flex;
    // background: #324057;
    position: absolute;
    top: 60px;
    bottom: 0px;
    overflow: hidden;
    aside {
      flex: 0 0 230px;
      width: 230px;
      // position: absolute;
      // top: 0px;
      // bottom: 0px;
      .el-menu {
        height: 100%;
        background: linear-gradient(#4c6eff, #9e92ff);
        // background: rgb(48, 65, 86);
        // color:#fff;
        .el-icon-menu {
          color: #fff;
        }
        .el-menu-item {
          background: #4c6eff;
          // background: rgb(48, 65, 86);
        }
      }
      .collapsed {
        width: 60px;
        .item {
          position: relative;
        }
        .submenu {
          position: absolute;
          top: 0px;
          left: 60px;
          z-index: 99999;
          height: auto;
          display: none;
        }
      }
    }
    .menu-collapsed {
      flex: 0 0 60px;
      width: 60px;
    }
    .menu-expanded {
      flex: 0 0 230px;
      width: 230px;
      // padding-top: 100px;
    }
    .content-container {
      background: #f7f7f7;
      flex: 1;
      // position: absolute;
      // right: 0px;
      // top: 0px;
      // bottom: 0px;
      // left: 230px;
      overflow-y: scroll;
      padding: 20px;
      .breadcrumb-container {
        //margin-bottom: 15px;
        overflow: hidden;
        // padding-bottom: 20px;
        // box-shadow: 0 1px 4px rgba(0,21,41,.08);
        // box-shadow: 0px 20px 20px -20px #5E5E5E;
        // box-shadow:0px 5px 2px -5px rgba(0, 0, 0, 0.1); 
        // border-bottom: 1px solid #000;
        
        .title {
          width: 200px;
          float: left;
          color: #475669;
        }
        .breadcrumb-inner {
          float: left;
        }
      }
      .content-wrapper {
        // background-color: #fff;
        box-sizing: border-box;
      }
    }
  }
}
.workOrderStyle .el-form-item__label{
  color: #66b1ff!important
}
</style>