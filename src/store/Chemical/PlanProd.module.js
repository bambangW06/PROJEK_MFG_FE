import axios from 'axios'

const API_URL = process.env.VUE_APP_API_URL

export const ACTION_ADD_PLAN_PROD = 'ACTION_ADD_PLAN_PROD'

export const ACTION_GET_PLAN_PROD = 'ACTION_GET_PLAN_PROD'
export const SET_PLAN_PROD = 'SET_PLAN_PROD'
export const GET_PLAN_PROD = 'GET_PLAN_PROD'

const state = {
  PLAN_PROD: [],
}

const getters = {
  GET_PLAN_PROD(state) {
    return state.PLAN_PROD
  },
}

const mutations = {
  SET_PLAN_PROD(state, payload) {
    state.PLAN_PROD = payload
  },
}

const actions = {
  async ACTION_ADD_PLAN_PROD({ commit }, payload) {
    try {
      const response = await axios.post(`${API_URL}/planProd/add`, payload)
      return response
    } catch (error) {
      console.log(error)
    }
  },
  async ACTION_GET_PLAN_PROD({ commit }, payload) {
    try {
      const response = await axios.get(`${API_URL}/planProd/get`, {
        params: { month: payload.month, line_id: payload.line_id },
      })
      commit(SET_PLAN_PROD, response.data.data)
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
