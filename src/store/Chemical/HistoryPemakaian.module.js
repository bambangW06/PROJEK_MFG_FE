const API_URL = process.env.VUE_APP_API_URL

import axios from 'axios'

export const ACTION_GET_HISTORY_CHEMICAL = 'ACTION_GET_HISTORY_CHEMICAL'
export const SET_HISTORY_CHEMICAL = 'SET_HISTORY_CHEMICAL'
export const GET_HISTORY_CHEMICAL = 'GET_HISTORY_CHEMICAL'

export const state = {
  HISTORY_CHEMICAL: [],
}

const getters = {
  GET_HISTORY_CHEMICAL: (state) => state.HISTORY_CHEMICAL,
}

const mutations = {
  SET_HISTORY_CHEMICAL(state, payload) {
    state.HISTORY_CHEMICAL = payload
  },
}

const actions = {
  async ACTION_GET_HISTORY_CHEMICAL({ commit }, payload) {
    try {
      const response = await axios.get(`${API_URL}/historyChemical/get`, {
        params: payload,
      })
      commit(SET_HISTORY_CHEMICAL, response.data.data)
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
