const API_URL = process.env.VUE_APP_API_URL

import axios from 'axios'

export const ACTION_LOGIN = 'ACTION_LOGIN'
export const ACTION_LOGOUT = 'ACTION_LOGOUT'
export const SET_USER = 'SET_USER'
export const GET_USER = 'GET_USER'
export const IS_LOGGED_IN = 'IS_LOGGED_IN'
export const ACTION_CHECK_SESSION = 'ACTION_CHECK_SESSION'
export const ACTION_REGISTER = 'ACTION_REGISTER'

export const state = {
  user: JSON.parse(sessionStorage.getItem('USER_INFO')) || null,
}

const getters = {
  GET_USER: (state) => state.user,
  IS_LOGGED_IN: (state) => !!state.user,
}

const mutations = {
  SET_USER(state, payload) {
    state.user = payload
  },
}

const actions = {
  async ACTION_LOGIN({ commit }, payload) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, payload)

      const user = response.data.user

      // SIMPAN KE VUEX
      commit(SET_USER, user)

      // SIMPAN KE SESSION
      sessionStorage.setItem('USER_INFO', JSON.stringify(user))
      sessionStorage.setItem('IS_LOGGED_IN', 'true')

      return response
    } catch (error) {
      console.error(error)
      throw new Error(error.response?.data?.message || 'Login gagal.')
    }
  },

  async ACTION_LOGOUT({ commit }) {
    try {
      await axios.post(`${API_URL}/auth/logout`)
    } catch (error) {
      console.error(error)
    }

    commit(SET_USER, null)
    sessionStorage.removeItem('USER_INFO')
    sessionStorage.removeItem('IS_LOGGED_IN')
  },

  async ACTION_CHECK_SESSION({ commit }) {
    try {
      const response = await axios.get(`${API_URL}/auth/check-session`)
      commit(SET_USER, response.data.user)
      return response
    } catch {
      commit(SET_USER, null)
    }
  },
  async ACTION_REGISTER({ commit }, payload) {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, payload)
      return response
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Gagal register.')
    }
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
