<template>
  <div class="navbar">
    <!-- <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" /> -->

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <!-- <search id="header-search" class="right-menu-item" /> -->

        <error-log class="errLog-container right-menu-item hover-effect" />

        <!-- <screenfull id="screenfull" class="right-menu-item hover-effect" /> -->

        <!-- <el-tooltip :content="$t('navbar.size')" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip> -->

        <!-- <lang-select class="right-menu-item hover-effect" /> -->

      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <p class="user">欢迎 <span>{{ userName }}</span> 登录</p>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <!-- <router-link to="/profile/index"> -->
          <!-- <el-dropdown-item>
              {{ $t('navbar.profile') }}
            </el-dropdown-item> -->
          <!-- </router-link> -->
          <!-- <router-link to="/">
            <el-dropdown-item>
              {{ $t('navbar.dashboard') }}
            </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/PanJiaChen/vue-element-admin/">
            <el-dropdown-item>
              {{ $t('navbar.github') }}
            </el-dropdown-item>
          </a>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a> -->
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="setPass">{{ $t('navbar.setPass') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dialog title="修改密码" :visible.sync="passShow" :close-on-click-modal="false">
        <el-form :model="passList" label-width="80px">
          <el-form-item label="现有密码">
            <el-input type="password" v-model="passList.oldPass" size="mini" placeholder="请输入原始密码" />
          </el-form-item>
          <el-form-item label="新密码">
            <el-input type="password" v-model="passList.newPass" size="mini" placeholder="请输入新密码" />
          </el-form-item>
          <el-form-item label="确认密码">
            <el-input type="password" v-model="passList.sureOass" size="mini" placeholder="请再次输入新密码" />
          </el-form-item>
        </el-form>
        <el-row style="display:flex;justify-content: flex-end;">
          <el-button size="mini" @click="passShow = false">关闭</el-button>
          <el-button size="mini" type="primary" @click="setPassFn">确定</el-button>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  setPass
} from '@/api/home/first'
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
// import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
// import Screenfull from '@/components/Screenfull'
// import SizeSelect from '@/components/SizeSelect'
// import LangSelect from '@/components/LangSelect'
// import Search from '@/components/HeaderSearch'

export default {
  components: {
    Breadcrumb,
    // Hamburger,
    ErrorLog
    // Screenfull,
    // SizeSelect,
    // LangSelect,
    // Search
  },
  data() {
    return {
      userName: localStorage.getItem('user'),
      passShow: false,
      passList: {
        oldPass: '',
        newPass: '',
        sureOass: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    setPass() {
      this.passShow = true
    },
    // 修改密码确认
    setPassFn() {
      if (this.passList.oldPass === '') {
        this.$message('请先输入原始密码')
        return false
      }
      if (this.passList.newPass === '') {
        this.$message('请先输入新密码')
        return false
      }
      if (this.passList.sureOass === '') {
        this.$message('请再次输入新密码')
        return false
      }
      if (this.passList.sureOass !== this.passList.newPass) {
        this.$message('两次密码输入不同，请重新输入')
        return false
      }
      setPass({
        userId: localStorage.getItem('userid'),
        oldPassword: this.passList.oldPass,
        userPassword: this.passList.newPass
      }).then(res => {
        if (res.res) {
          this.$message({
            type: 'success',
            message: '修改密码成功'
          })
        }
        this.passShow = false
        this.passList.oldPass = ''
        this.passList.newPass = ''
        this.$store.dispatch('user/logout')
        this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      })
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.user{
  height: 45px;
  margin-top: 0px;
  line-height: 45px;
  font-size: 16px;
  span{
    color:rgb(43, 167, 250)
  }
}
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
