<template>
  <div class="login-container">
    <!-- <div class="login-pic" /> -->
    <div class="login-pic2" />
    <div class="login">
      <div class="login-inner">
        <el-form ref="loginForm" :model="loginForm" class="login-form" autocomplete="on" label-position="left">

          <div class="title-container">
            <h3 class="title">
              <!-- {{ $t('login.title') }} -->
              管理员登录
            </h3>
          </div>

          <el-form-item prop="userAccount">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input
              ref="username"
              v-model="loginForm.username"
              :placeholder="$t('login.username')"
              name="username"
              type="text"
              tabindex="1"
              autocomplete="on"
            />
          </el-form-item>

          <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
            <el-form-item prop="password">
              <span class="svg-container">
                <svg-icon icon-class="password" />
              </span>
              <el-input
                :key="passwordType"
                ref="password"
                v-model="loginForm.password"
                :type="passwordType"
                :placeholder="$t('login.password')"
                name="password"
                tabindex="2"
                autocomplete="on"
                @keyup.native="checkCapslock"
                @blur="capsTooltip = false"
              />
              <span class="show-pwd" @click="showPwd">
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
              </span>
            </el-form-item>
          </el-tooltip>
          <el-button :loading="loading" type="primary" class="login-button" @click.native.prevent="handleLogin">
            <!-- {{ $t('login.logIn') }} -->
            点击登录
          </el-button>
        </el-form>
      </div>

    </div>
  </div>
</template>

<script>
// import SIdentify from './components/identify'
import { baseUrl } from '@/utils/request'
export default {
  name: 'Login',
  // components: {
  //   SIdentify
  // },
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
      },
      seccode: '',
      loginRules: {
        username: [{ required: true, trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur' }],
        seccode: [{ required: true, trigger: 'blur' }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    const _self = this
    document.onkeydown = function(e) {
      const key = window.event.keyCode
      if (key === 13) {
        _self.handleLogin()
      }
    }
  },
  methods: {
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },
    refreshCode() {
      this.identifyCode = ''
      this.makeCode(this.identifyCodes, 4)
    },
    makeCode(o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[
          this.randomNum(0, this.identifyCodes.length)
        ]
      }
    },
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (shiftKey && (key >= 'a' && key <= 'z') || !shiftKey && (key >= 'A' && key <= 'Z')) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
      }
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      if (this.loginForm.userAccount === '') {
        this.$message('登录账号不能为空')
        return false
      }
      if (this.loginForm.password === '') {
        this.$message('登录密码不能为空')
        return false
      }
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then((res) => {
              console.log(this.redirect)
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="scss" scoped>
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container /deep/ {
  .el-form-item__content{
    display: flex;
    width: 100%;
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    // background: rgba(0, 0, 0, 0.1);
    // border-radius: 5px;
    color: #454545;
  }

  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;
$login-pic-default-height: 26%;
@keyframes login-pic-move {
  0% {
    top: $login-pic-default-height;
  }
  50% {
    top: 23%;
  }
  70% {
    top: $login-pic-default-height;
  }
  100% {
    top: $login-pic-default-height;
  }
}
.login-pic {
  position: absolute;
  top: $login-pic-default-height;
  left: 4%;
  width: 40%;
  padding-top: 47%;
  background: url(../../assets/login/float.png) no-repeat;
  background-size: 100%;
  animation: login-pic-move 2s ease-in-out 0s infinite normal;
}
.login-pic2 {
  position: absolute;
  left: 4%;
  top: 30%;
  width: 40%;
  padding-top: 47%;
  background: url(../../assets/login/pic.png) no-repeat;
  background-size: 100%;
}

.login-container {
  position: relative;
  height: 100%;
   min-height: 857px;
    width: 100%;
    overflow: hidden;
    background: url(../../assets/login/bg.png) no-repeat;
    background-size: cover;

  .login-form {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 18% 10% 0 10%;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .checkCode{
    background: #fff;
    color: #000;
    padding: 10px 15px
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      // color: $light_gray;
      color: rgba(255, 255, 255, 0.7);
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
.login {
  position: absolute;
  right: 10.4%;
  top: 14.6%;
  width: 34.8%;
  height: 100%;
  background: url(../../assets/login/login.png) no-repeat;
  background-size: 100%;
}
.login-inner {
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding-top: 113.3%;
}
.login-button {
  position: absolute;
  bottom: 3%;
  left: 29.19%;
  width: 44.61%;
  height: 9.5%;
  background: transparent;
  border: 0;
  font-size: 1.56vw;
  color: #4182ba;
  &.is-loading:before {
    background: none;
  }
}
</style>
