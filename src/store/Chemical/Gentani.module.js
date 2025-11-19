const API_URL = process.env.VUE_APP_API_URL

import axios from 'axios'

export const ACTION_GET_GENTANI = 'ACTION_GET_GENTANI'
export const GET_GENTANI = 'GET_GENTANI'
export const SET_GENTANI = 'SET_GENTANI'

const state = {
  GENTANI_DATA: [],
}

const getters = {
  GET_GENTANI(state) {
    return state.GENTANI_DATA
  },
}

const mutations = {
  SET_GENTANI(state, payload) {
    state.GENTANI_DATA = payload
  },
}

const actions = {
  async ACTION_GET_GENTANI({ commit }, payload) {
    try {
      const response = await axios.get(`${API_URL}/gentani/get`, {
        params: payload,
      })
      commit(SET_GENTANI, response.data.data)
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
