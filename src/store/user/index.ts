import { token } from '../../utils/token'
import { user } from '../../utils/storage/user'

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
  SET_ID: (state: any, id: any) => {
    state.id = id
  },
  SET_AVATAR: (state: any, avatar: any) => {
    state.avatar = avatar
  },
  SET_LOCATION: (state: any, info: any) => {
    state.locationInfo.lat = info.latitude
    state.locationInfo.lnt = info.longitude
    state.locationInfo.authState = info.authState
  },
  SET_SIGN: (state: any, info: any) => {
    state.signInfo.signed = info.signed
    state.signInfo.time = info.time
  },
  CLEAN_INFO: (state: any) => {
    state.name = ''
    state.token = ''
    state.avatar = ''
    state.locationInfo = { lat: '', lnt: '', authState: false }
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

  login({ commit }: any, userInfo: any) {
    // TODO 临时测试数据
    console.log('store user login:', userInfo)
    const { username, password } = userInfo
    token.set('template-token')
    user.set(username)
    commit('SET_TOKEN', token.get() || 'template-token')
    commit('SET_NAME', username)
  },

  getInfo({ commit, state }: any) {
    commit('SET_TOKEN', token.get() || 'template-token')
    commit('SET_NAME', user.get())
  },

  logout({ commit, state }: any) {
    token.clear()
    user.clear()
    commit('CLEAN_INFO')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
