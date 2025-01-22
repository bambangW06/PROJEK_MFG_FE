const API_URL = process.env.VUE_APP_API_URL
import axios from 'axios'

export const ACTION_GET_HISTORY_PROBLEM = 'ACTION_GET_HISTORY_PROBLEM'
export const GET_HISTORY_PROBLEM = 'GET_HISTORY_PROBLEM'
export const SET_HISTORY_PROBLEM = 'SET_HISTORY_PROBLEM'

export const ACTION_GET_PARETO_PROBLEM = 'ACTION_GET_PARETO_PROBLEM'
export const GET_PARETO_PROBLEM = 'GET_PARETO_PROBLEM'
export const SET_PARETO_PROBLEM = 'SET_PARETO_PROBLEM'

const state = {
  HISTORY_PROBLEM: [],
  PARETO_PROBLEM: [],
}

const getters = {
  GET_HISTORY_PROBLEM: (state) => state.HISTORY_PROBLEM,
  GET_PARETO_PROBLEM: (state) => state.PARETO_PROBLEM,
}

const mutations = {
  SET_HISTORY_PROBLEM(state, payload) {
    state.HISTORY_PROBLEM = payload
  },
  SET_PARETO_PROBLEM(state, payload) {
    state.PARETO_PROBLEM = payload
  },
}

const actions = {
  async ACTION_GET_HISTORY_PROBLEM({ commit }, payload) {
    try {
      // Membuat objek params untuk query
      const params = {
        selectedMonth: payload.selectedMonth,
        selectedProblem: payload.selectedProblem,
      }

      // Jika selectedProblem adalah 'nextprocess', tambahkan parameter tambahan
      if (payload.selectedProblem === 'nextprocess') {
        params.selectedLine = payload.selectedLine
        params.selectedMachine = payload.selectedMachine
        params.selectedTool = payload.selectedTool
      }
      if (payload.selectedProblem === 'inprocess') {
        params.category_id = payload.selectedCategory
      }
      // Lakukan request GET dengan parameter yang sudah disesuaikan
      const response = await axios.get(`${API_URL}/history-problem/get`, {
        params: params,
      })

      // Commit data yang diterima ke Vuex store
      commit(SET_HISTORY_PROBLEM, response.data.data)
      return response
    } catch (error) {
      console.log(error)
    }
  },
  async ACTION_GET_PARETO_PROBLEM({ commit }, payload) {
    try {
      const response = await axios.get(`${API_URL}/pareto/get`, {
        params: {
          selectedMonth: payload.selectedMonth,
          selectedProblem: payload.selectedProblem,
        },
      })
      commit(SET_PARETO_PROBLEM, response.data.data)
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
