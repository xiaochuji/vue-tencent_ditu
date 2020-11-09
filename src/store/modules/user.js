import { login } from '@/api/user'
import { getToken, setToken, setId, removeToken, setName, setUser, setDetName, setDetid, setRoute, userId } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, yanzhengma } = userInfo
    return new Promise((resolve, reject) => {
      login({ userName: username.trim(), password: password, yanzhengma: yanzhengma }).then(response => {
        const data = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        setId(data.user.qiyId)
        setName(data.user.qiyename)
        setDetName(data.user.firm.firmName)
        setDetid(data.user.firm.id)
        setUser(data.user.userName)
        userId(data.user.id)

        // 保存route
        let roles = data.user.roles.map(v => v.powers)
        roles = [].concat.apply([], roles)
        setRoute(roles)

        resolve()
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      // getInfo('admin-token').then(response => {
      const data = {
        roles: 'admin',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        introduction: 'I am a super administrator',
        name: 'Super Admin'
      }

      if (!data) {
        reject('Verification failed, please Login again.')
      }

      const { roles, name, avatar, introduction } = data

      // roles must be a non-empty array
      if (!roles || roles.length <= 0) {
        reject('getInfo: roles must be a non-null array!')
      }

      commit('SET_ROLES', roles)
      commit('SET_NAME', name)
      commit('SET_AVATAR', avatar)
      commit('SET_INTRODUCTION', introduction)
      resolve(data)
    }).catch(error => {
      console.log(error)
    })
    // })
  },

  // user logout
  logout({ commit, state }) {
    console.log(state.token)
    return new Promise((resolve, reject) => {

      // 退出登录不调接口
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resetRouter()
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
