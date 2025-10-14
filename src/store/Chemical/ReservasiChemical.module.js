import axios from 'axios'
const API_URL = process.env.VUE_APP_API_URL

export const ACTION_ADD_RESERVASI = 'ACTION_ADD_RESERVASI'

export const ACTION_GET_RESERVASI = 'ACTION_GET_RESERVASI'
export const SET_RESERVASI = 'SET_RESERVASI'
export const GET_RESERVASI = 'GET_RESERVASI'

export const ACTION_UPDATE_NOTE_RESERVASI = 'ACTION_UPDATE_NOTE_RESERVASI'

const state = {
  RESERVASI_DATA: [],
}

const getters = {
  GET_RESERVASI(state) {
    return state.RESERVASI_DATA
  },
}

const mutations = {
  SET_RESERVASI(state, payload) {
    state.RESERVASI_DATA = payload
  },
}

const actions = {
  async ACTION_ADD_RESERVASI({ commit }, payload) {
    try {
      const response = await axios.post(
        `${API_URL}/reservasiChemical/add`,
        payload,
      )
      return response
    } catch (error) {
      console.log(error)
    }
  },
  async ACTION_GET_RESERVASI({ commit }, payload) {
    try {
      const response = await axios.get(`${API_URL}/reservasiChemical/get`, {
        params: { month: payload },
      })
      commit(SET_RESERVASI, response.data.data)
      return response
    } catch (error) {
      console.log(error)
    }
  },
  async ACTION_UPDATE_NOTE_RESERVASI({ commit }, payload) {
    try {
      const response = await axios.post(
        `${API_URL}/reservasiChemical/add-note`,
        payload,
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
