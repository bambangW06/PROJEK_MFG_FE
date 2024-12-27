const API_URL = process.env.VUE_APP_API_URL
import axios from 'axios'

export const ACTION_GET_MASTER_TIME_RANGE = 'ACTION_GET_MASTER_TIME_RANGE'
export const GET_MASTER_TIME_RANGE = 'GET_MASTER_TIME_RANGE'
export const SET_MASTER_TIME_RANGE = 'SET_MASTER_TIME_RANGE'

export const ACTION_ADD_MASTER_TIME_RANGE = 'ACTION_ADD_MASTER_TIME_RANGE'

export const ACTION_EDIT_MASTER_TIME_RANGE = 'ACTION_EDIT_MASTER_TIME_RANGE'

export const ACTION_DELETE_MASTER_TIME_RANGE = 'ACTION_DELETE_MASTER_TIME_RANGE'

const state = {
  DATA_TIME_RANGE: [],
}

const getters = {
  GET_MASTER_TIME_RANGE(state) {
    return state.DATA_TIME_RANGE
  },
}

const mutations = {
  SET_MASTER_TIME_RANGE(state, payload) {
    state.DATA_TIME_RANGE = payload
  },
}

const actions = {
  async ACTION_GET_MASTER_TIME_RANGE({ commit }) {
    try {
      const response = await axios.get(`${API_URL}/masterTimerange/timerange`)
      commit(SET_MASTER_TIME_RANGE, response.data.data)
      return response
    } catch (error) {
      console.error('GAGAL AMBIL DATA')
    }
  },
  async ACTION_ADD_MASTER_TIME_RANGE({ commit }, payload) {
    try {
      const response = await axios.post(
        `${API_URL}/masterTimerange/add`,
        payload,
      )
      return response
    } catch (error) {
      console.error('Error adding time range:', error)
    }
  },
  async ACTION_EDIT_MASTER_TIME_RANGE({ commit }, payload) {
    try {
      const response = await axios.put(
        `${API_URL}/masterTimerange/edit`,
        payload,
      )
      return response
    } catch (error) {
      console.error('Error adding time range:', error)
    }
  },
  async ACTION_DELETE_MASTER_TIME_RANGE({ commit }, payload) {
    try {
      const response = await axios.delete(
        `${API_URL}/masterTimerange/delete/${payload}`,
      )
      return response
    } catch (error) {
      console.error('Error adding time range:', error)
    }
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
