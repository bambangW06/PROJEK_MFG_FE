const API_URL = process.env.VUE_APP_API_URL
import axios from 'axios'

export const ACTION_GET_HISTORY_KURAS = 'ACTION_GET_HISTORY_KURAS'
export const SET_HISTORY_KURAS = 'SET_HISTORY_KURAS'
export const GET_HISTORY_KURAS = 'GET_HISTORY_KURAS'

const state = {
  HISTORY_KURAS: [],
}

const getters = {
  GET_HISTORY_KURAS(state) {
    return state.HISTORY_KURAS
  },
}

const mutations = {
  SET_HISTORY_KURAS(state, payload) {
    state.HISTORY_KURAS = payload
  },
}

const actions = {
  async ACTION_GET_HISTORY_KURAS({ commit }, payload) {
    try {
      const response = await axios.get(
        `${API_URL}/coolant/histories/get/${payload}`,
      )
      commit(SET_HISTORY_KURAS, response.data.data)
      return response
    } catch (error) {
      console.log(error)
    }
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
