const API_URL = process.env.VUE_APP_API_URL

import axios from 'axios'

export const ACTION_ADD_MASTER_OIL = 'ACTION_ADD_MASTER_OIL'

export const ACTION_EDIT_MASTER_OIL = 'ACTION_EDIT_MASTER_OIL'

export const ACTION_DELETE_MASTER_OIL = 'ACTION_DELETE_MASTER_OIL'

export const ACTION_GET_MASTER_OIL = 'ACTION_GET_MASTER_OIL'
export const GET_MASTER_OIL = 'GET_MASTER_OIL'
export const SET_MASTER_OIL = 'SET_MASTER_OIL'

const state = {
  MASTER_OIL: [],
}

const getters = {
  GET_MASTER_OIL: (state) => state.MASTER_OIL,
}

const mutations = {
  SET_MASTER_OIL(state, payload) {
    state.MASTER_OIL = payload
  },
}

const actions = {
  async ACTION_ADD_MASTER_OIL({ commit }, payload) {
    try {
      const response = await axios.post(`${API_URL}/masterOli/add`, payload)
      return response
    } catch (error) {
      console.log(error)
    }
  },
  async ACTION_EDIT_MASTER_OIL({ commit }, payload) {
    try {
      const oil_id = payload.oil_id
      const response = await axios.put(
        `${API_URL}/masterOli/edit/${oil_id}`,
        payload,
      )
      return response
    } catch (error) {
      console.log(error)
    }
  },
  async ACTION_DELETE_MASTER_OIL({ commit }, payload) {
    try {
      const response = await axios.delete(
        `${API_URL}/masterOli/delete/${payload}`,
      )
      return response
    } catch (error) {
      console.log(error)
    }
  },
  async ACTION_GET_MASTER_OIL({ commit }) {
    try {
      const response = await axios.get(`${API_URL}/masterOli/get`)
      commit(SET_MASTER_OIL, response.data.data)
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
