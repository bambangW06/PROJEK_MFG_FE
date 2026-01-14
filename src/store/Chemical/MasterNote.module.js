const API_URL = process.env.VUE_APP_API_URL
import axios from 'axios'

export const ACTION_GET_MASTER_NOTE = 'ACTION_GET_MASTER_NOTE'
export const GET_MASTER_NOTE = 'GET_MASTER_NOTE'
export const SET_MASTER_NOTE = 'SET_MASTER_NOTE'

export const ACTION_ADD_MASTER_NOTE = 'ACTION_ADD_MASTER_NOTE'

export const ACTION_EDIT_MASTER_NOTE = 'ACTION_EDIT_MASTER_NOTE'

export const ACTION_DELETE_MASTER_NOTE = 'ACTION_DELETE_MASTER_NOTE'

const state = {
  MASTER_NOTE: [],
}

const getters = {
  GET_MASTER_NOTE(state) {
    return state.MASTER_NOTE
  },
}

const mutations = {
  SET_MASTER_NOTE(state, payload) {
    state.MASTER_NOTE = payload
  },
}

const actions = {
  async ACTION_GET_MASTER_NOTE({ commit }, payload) {
    try {
      const response = await axios.get(`${API_URL}/masterNote/get`, {
        params: {
          notesUsed: payload ? payload : null,
        },
      })
      commit(SET_MASTER_NOTE, response.data.data)
      return response
    } catch (error) {
      console.log(error)
    }
  },
  async ACTION_ADD_MASTER_NOTE({ commit }, payload) {
    try {
      const response = await axios.post(`${API_URL}/masterNote/add`, payload)
      return response
    } catch (error) {
      console.log(error)
    }
  },

  async ACTION_EDIT_MASTER_NOTE({ commit }, payload) {
    try {
      const response = await axios.put(
        `${API_URL}/masterNote/edit/${payload.note_id}`,
        payload,
      )
      return response
    } catch (error) {
      console.log(error)
    }
  },

  async ACTION_DELETE_MASTER_NOTE({ commit }, payload) {
    try {
      const response = await axios.delete(
        `${API_URL}/masterNote/delete/${payload}`,
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
