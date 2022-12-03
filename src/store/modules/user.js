import { apiLogin, apiUserInfo, apiLogout } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    user_id: 0,
    user_name: '',
    avatar_url: '',
    mobile: '',
    user_type: '',
    menu_alias: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USER_ID: (state, user_id) => {
    state.user_id = user_id
  },
  SET_USER_NAME: (state, user_name) => {
    state.user_name = user_name
  },
  SET_AVATAR_URL: (state, avatar_url) => {
    state.avatar_url = avatar_url
  },
  SET_MOBILE: (state, mobile) => {
    state.mobile = mobile
  },
  SET_USER_TYPE: (state, user_type) => {
    state.user_type = user_type
  },
  SET_MENU_ALIAS: (state, menu_alias) => {
    state.menu_alias = menu_alias
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { auth_type, username, password } = userInfo
    return new Promise((resolve, reject) => {
      apiLogin({ auth_type: auth_type, username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      apiUserInfo().then(response => {
        const { data } = response

        if (!data) {
          return reject('验证失败，请重新登录')
        }

        const { user_id, user_name, avatar_url, mobile, user_type, menu_alias } = data

        commit('SET_USER_ID', user_id)
        commit('SET_USER_NAME', user_name)
        commit('SET_AVATAR_URL', avatar_url)
        commit('SET_MOBILE', mobile)
        commit('SET_USER_TYPE', user_type)
        commit('SET_MENU_ALIAS', menu_alias)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      apiLogout().then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
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

