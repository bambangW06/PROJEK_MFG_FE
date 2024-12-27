const API_URL = process.env.VUE_APP_API_URL
import axios from 'axios'

export const ACTION_GET_LINES = 'ACTION_GET_LINES'
export const GET_LINES = 'GET_LINES'
export const SET_LINES = 'SET_LINES'

export const ACTION_ADD_MASTER_LINE = 'ACTION_ADD_MASTER_LINE'

export const ACTION_EDIT_MASTER_LINE = 'ACTION_EDIT_MASTER_LINE'

export const ACTION_DELETE_MASTER_LINE = 'ACTION_DELETE_MASTER_LINE'

const state = {
  LINES: [],
}

const getters = {
  GET_LINES(state) {
    return state.LINES
  },
}

const mutations = {
  SET_LINES(state, payload) {
    state.LINES = payload
  },
}

const actions = {
  async ACTION_GET_LINES({ commit }) {
    try {
      const response = await axios.get(`${API_URL}/masterLines/get`)
      commit(SET_LINES, response.data.data)
      return response
    } catch (error) {
      console.log(error)
    }
  },
  async ACTION_ADD_MASTER_LINE({ commit }, payload) {
    try {
      const response = await axios.post(`${API_URL}/masterLines/add`, payload)
      return response
    } catch (error) {
      console.log(error)
    }
  },
  async ACTION_EDIT_MASTER_LINE({ commit }, payload) {
    try {
      const response = await axios.put(
        `${API_URL}/masterLines/edit/${payload.line_id}`,
        payload,
      )
      return response
    } catch (error) {
      console.log(error)
    }
  },
  async ACTION_DELETE_MASTER_LINE({ commit }, payload) {
    try {
      const response = await axios.delete(
        `${API_URL}/masterLines/delete/${payload}`,
      )
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
