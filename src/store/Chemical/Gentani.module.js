const API_URL = process.env.VUE_APP_API_URL

import axios from 'axios'

export const ACTION_GET_SUMMARY_GENTANI = 'ACTION_GET_SUMMARY_GENTANI'
export const GET_SUMMARY_GENTANI = 'GET_SUMMARY_GENTANI'
export const SET_SUMMARY_GENTANI = 'SET_SUMMARY_GENTANI'

export const ACTION_GET_STD_GENTANI = 'ACTION_GET_STD_GENTANI'
export const GET_STD_GENTANI = 'GET_STD_GENTANI'
export const SET_STD_GENTANI = 'SET_STD_GENTANI'

export const ACTION_ADD_STD_GENTANI = 'ACTION_ADD_STD_GENTANI'

export const ACTION_EDIT_STD_GENTANI = 'ACTION_EDIT_STD_GENTANI'

export const ACTION_DELETE_STD_GENTANI = 'ACTION_DELETE_STD_GENTANI'

const state = {
  DATA_SUMMARY: [],
  STD_DATA: [],
}

const getters = {
  GET_SUMMARY_GENTANI(state) {
    return state.DATA_SUMMARY
  },
  GET_STD_GENTANI(state) {
    return state.STD_DATA
  },
}

const mutations = {
  SET_SUMMARY_GENTANI(state, payload) {
    state.DATA_SUMMARY = payload
  },
  SET_STD_GENTANI(state, payload) {
    state.STD_DATA = payload
  },
}

const actions = {
  async ACTION_GET_SUMMARY_GENTANI({ commit }, payload) {
    try {
      const response = await axios.get(`${API_URL}/gentani/summary`, {
        params: payload,
      })
      commit(SET_SUMMARY_GENTANI, response.data.data)
    } catch (error) {
      console.log(error)
    }
  },
  async ACTION_GET_STD_GENTANI({ commit }, payload) {
    try {
      const response = await axios.get(`${API_URL}/gentani/std`, {
        params: payload,
      })
      commit(SET_STD_GENTANI, response.data.data)
      return response
    } catch (error) {
      console.log(error)
    }
  },
  async ACTION_ADD_STD_GENTANI({ commit }, payload) {
    try {
      const response = await axios.post(`${API_URL}/gentani/add`, payload)
      return response
    } catch (error) {
      console.log(error)
    }
  },
  async ACTION_EDIT_STD_GENTANI({ commit }, payload) {
    try {
      const response = await axios.put(`${API_URL}/gentani/edit`, payload)
      return response
    } catch (error) {
      console.log(error)
    }
  },
  async ACTION_DELETE_STD_GENTANI({ commit }, payload) {
    try {
      const response = await axios.delete(
        `${API_URL}/gentani/delete/${payload}`,
      )
      console.log('response', response)

      return response
    } catch (error) {
      console.log(error)
    }
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
