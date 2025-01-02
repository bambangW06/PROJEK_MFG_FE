const API_URL = process.env.VUE_APP_API_URL
import axios from 'axios'

export const ACTION_ADD_MASTER_PROBLEM = 'ACTION_ADD_MASTER_PROBLEM'

export const ACTION_GET_MASTER_PROBLEMS = 'ACTION_GET_MASTER_PROBLEMS'
export const SET_MASTER_PROBLEMS = 'SET_MASTER_PROBLEMS'
export const GET_MASTER_PROBLEMS = 'GET_MASTER_PROBLEMS'

export const ACTION_EDIT_MASTER_PROBLEM = 'ACTION_EDIT_MASTER_PROBLEM'

export const ACTION_DELETE_MASTER_PROBLEM = 'ACTION_DELETE_MASTER_PROBLEM'

const state = {
  MASTER_PROBLEMS: [],
}

const getters = {
  GET_MASTER_PROBLEMS(state) {
    return state.MASTER_PROBLEMS
  },
}

const mutations = {
  SET_MASTER_PROBLEMS(state, payload) {
    state.MASTER_PROBLEMS = payload
  },
}

const actions = {
  async ACTION_ADD_MASTER_PROBLEM({ commit }, payload) {
    try {
      const response = await axios.post(
        `${API_URL}/masterProblems/add`,
        payload,
      )
      return response
    } catch (error) {
      console.log(error)
    }
  },
  async ACTION_GET_MASTER_PROBLEMS({ commit }) {
    try {
      const response = await axios.get(`${API_URL}/masterProblems/get`)
      commit(SET_MASTER_PROBLEMS, response.data.data)
      return response
    } catch (error) {
      console.error('Error fetching tools:', error)
    }
  },
  async ACTION_EDIT_MASTER_PROBLEM({ commit }, payload) {
    try {
      const response = await axios.put(
        `${API_URL}/masterProblems/edit/${payload.problem_id}`,
        payload,
      )
      return response
    } catch (error) {
      console.log(error)
    }
  },
  async ACTION_DELETE_MASTER_PROBLEM({ commit }, payload) {
    try {
      const response = await axios.delete(
        `${API_URL}/masterProblems/delete/${payload}`,
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
