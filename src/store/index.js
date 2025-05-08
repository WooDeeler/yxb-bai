import { createStore } from 'vuex'

const store = createStore({
  state: {
    token: localStorage.getItem('token') || '',
    userInfo: JSON.parse(localStorage.getItem('userInfo') || '{}')
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
      localStorage.setItem('token', token)
    },
    SET_USER_INFO(state, userInfo) {
      state.userInfo = userInfo
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
    },
    CLEAR_USER(state) {
      state.token = ''
      state.userInfo = {}
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
    }
  },
  actions: {
    // 登录
    // login({ commit }, userInfo) {
    //   return new Promise((resolve, reject) => {
    //     const token = 'mock-token'
    //     const user = {
    //       username: userInfo.username,
    //       avatar: 'https://avatars.githubusercontent.com/u/1?v=4'
    //     }
    //     commit('SET_TOKEN', token)
    //     commit('SET_USER_INFO', user)
    //     resolve()
    //   })
    // },
    // 登出
    logout({ commit }) {
      commit('CLEAR_USER')
    }
  },
  getters: {
    token: state => state.token,
    userInfo: state => state.userInfo
  }
})

export default store