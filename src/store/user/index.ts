import { token } from '../../utils/token'
import { mapGetUserAuthorizeInfo } from '@/utils/map_utils'

const getDefaultState = () => {
  return {
    token: token.get(),
    name: '',
    avatar: '',
    locationInfo: { lat: '', lnt: '' },
    signInfo: { signed: false, time: '' }
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
  SET_LOCATION: (state: any, info: any) => {
    state.locationInfo.lat = info.latitude
    state.locationInfo.lnt = info.longitude
  },
  SET_SIGN: (state: any, info: any) => {
    state.signInfo.signed = info.signed
    state.signInfo.time = info.time
  },
  CLEAN_INFO: (state: any) => {
    state.name = ''
    state.token = ''
    state.avatar = ''
    state.locationInfo = { lat: '', lnt: '' }
    state.signInfo = { signed: false, time: '' }
  }
}

const actions = {
  sign({ commit, state }: any, info: any) {
    commit('SET_LOCATION', info)
  },
  cleanSignInfo({ state }: any) {
    state.signInfo = { time: '', signed: false }
  },
  getLocation({ commit, state }: any, info: any) {
    // 先清空在拉新的地址
    state.locationInfo = { lat: '', lnt: '' }

    console.log('store user actions getLocation!')
    return new Promise((resolve, reject) => {
      mapGetUserAuthorizeInfo()
        .then((res) => {
          console.log('mapGetUserAuthorizeInfo res:', res)
          commit('SET_LOCATION', res)
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  // user login
  login({ commit }: any, userInfo: any) {
    const { username, password } = userInfo
    commit('SET_TOKEN', 'temp-token')
    commit('SET_NAME', 'temp-user-name')
  },

  // get user info
  getInfo({ commit, state }: any) {},

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
