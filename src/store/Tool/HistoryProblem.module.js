const API_URL = process.env.VUE_APP_API_URL
import axios from 'axios'

export const ACTION_GET_HISTORY_PROBLEM = 'ACTION_GET_HISTORY_PROBLEM'
export const GET_HISTORY_PROBLEM = 'GET_HISTORY_PROBLEM'
export const SET_HISTORY_PROBLEM = 'SET_HISTORY_PROBLEM'

const state = {
  HISTORY_PROBLEM: [],
}

const getters = {
  GET_HISTORY_PROBLEM: (state) => state.HISTORY_PROBLEM,
}

const mutations = {
  SET_HISTORY_PROBLEM(state, payload) {
    state.HISTORY_PROBLEM = payload
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
}

export default {
  state,
  getters,
  mutations,
  actions,
}
