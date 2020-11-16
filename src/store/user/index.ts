import { token } from '../../utils/token'

const getDefaultState = () => {
  return {
    token: token.get(),
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state: any) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state: any, token: any) => {
    state.token = token
  },
  SET_NAME: (state: any, name: any) => {
    state.name = name
  },
  SET_AVATAR: (state: any, avatar: any) => {
    state.avatar = avatar
  },
  CLEAN_INFO: (state: any) => {
    state.name = ''
    state.token = ''
    state.avatar = ''
  }
}

const actions = {
  // user login
  login({ commit }: any, userInfo: any) {
    const { username, password } = userInfo
    commit('SET_TOKEN', 'temp-token')
    commit('SET_NAME', 'temp-user-name')
    // return new Promise((resolve, reject) => {
    //   login({ username: username.trim(), password: password })
    //     .then((response) => {
    //       const { data } = response
    //       commit('SET_TOKEN', data.token)
    //       setToken(data.token)
    //       resolve()
    //     })
    //     .catch((error) => {
    //       reject(error)
    //     })
    // })
  },

  // get user info
  getInfo({ commit, state }: any) {
    // return new Promise((resolve, reject) => {
    //   getInfo(state.token)
    //     .then((response) => {
    //       const { data } = response
    //       if (!data) {
    //         return reject('Verification failed, please Login again.')
    //       }
    //       const { name, avatar } = data
    //       commit('SET_NAME', name)
    //       commit('SET_AVATAR', avatar)
    //       resolve(data)
    //     })
    //     .catch((error) => {
    //       reject(error)
    //     })
    // })
  },

  // user logout
  logout({ commit, state }: any) {
    token.clear()
    commit('CELAN_INFO')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
