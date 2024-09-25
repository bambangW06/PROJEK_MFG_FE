const API_URL = process.env.VUE_APP_API_URL
import axios from 'axios'

export const GET_TOOLS = 'GET_TOOLS'
export const SET_TOOLS = 'SET_TOOLS'
export const ACTION_GET_TOOLS = 'ACTION_GET_TOOLS'

export const GET_CATEGORIES = 'GET_CATEGORIES'
export const SET_CATEGORIES = 'SET_CATEGORIES'
export const ACTION_GET_CATEGORIES = 'ACTION_GET_CATEGORIES'

export const GET_STD_COUNTER = 'GET_STD_COUNTER'
export const SET_STD_COUNTER = 'SET_STD_COUNTER'
export const ACTION_GET_STD_COUNTER = 'ACTION_GET_STD_COUNTER'
export const ACTION_ADD_PROBLEM = 'ACTION_ADD_PROBLEM'
export const ACTION_ADD_PROBLEM_NEXT_PROCESS = 'ACTION_ADD_PROBLEM_NEXT_PROCESS'

export const ACTION_GET_PROBLEM = 'ACTION_GET_PROBLEM'
export const SET_PROBLEM = 'SET_PROBLEM'
export const GET_PROBLEM = 'GET_PROBLEM'

export const ACTION_ADD_REPORT_REG_SET = 'ACTION_ADD_REPORT_REG_SET'

export const ACTION_GET_REPORT_REG_SET = 'ACTION_GET_REPORT_REG_SET'
export const SET_REPORT = 'SET_REPORT'
export const GET_REPORT = 'GET_REPORT'

const state = {
  TOOLS: [],
  CATEGORIES: [],
  STD_COUNTER: [],
  PROBLEM: [],
  REPORT: [],
}

const getters = {
  GET_TOOLS: (state) => state.TOOLS,
  GET_CATEGORIES: (state) => state.CATEGORIES,
  GET_STD_COUNTER: (state) => state.STD_COUNTER,
  GET_PROBLEM: (state) => state.PROBLEM,
  GET_REPORT: (state) => state.REPORT,
}

const mutations = {
  SET_TOOLS(state, payload) {
    state.TOOLS = payload
  },
  SET_CATEGORIES(state, payload) {
    state.CATEGORIES = payload
  },
  SET_STD_COUNTER(state, payload) {
    state.STD_COUNTER = payload
  },
  SET_PROBLEM(state, payload) {
    state.PROBLEM = payload
  },
  SET_REPORT(state, payload) {
    state.REPORT = payload
  },
}

const actions = {
  async ACTION_GET_TOOLS({ commit }, payload) {
    try {
      const response = await axios.get(`${API_URL}/tools/get/${payload}`)
      commit(SET_TOOLS, response.data.data)
      // console.log(response.data.data)
      return response
    } catch (error) {
      console.error('Error fetching tools:', error)
    }
  },
  async ACTION_GET_CATEGORIES({ commit }) {
    try {
      const response = await axios.get(`${API_URL}/category/get`)
      commit(SET_CATEGORIES, response.data.data)
      // console.log(response.data.data)
      return response
    } catch (error) {
      console.error('Error fetching tools:', error)
    }
  },
  async ACTION_STD_COUNTER({ commit }, payload) {
    try {
      const response = await axios.get(`${API_URL}/laporan/get/${payload}`)
      commit(SET_STD_COUNTER, response.data.data)
      // console.log(response.data.data)
      return response
    } catch (error) {
      console.error('Error fetching tools:', error)
    }
  },
  async ACTION_GET_PROBLEM({ commit }, payload) {
    try {
      const modalType = payload.modalType
      // console.log(modalType)

      const selectedJam = payload.time_range
      // console.log(selectedJam)

      const response = await axios.get(`${API_URL}/problem/get`, {
        params: {
          modalType: modalType,
          time_range: selectedJam,
        },
      })

      // console.log(response.data.data)
      commit(SET_PROBLEM, response.data.data)
    } catch (error) {
      console.error('Error fetching problem data:', error)
    }
  },
  async ACTION_ADD_PROBLEM({ commit }, payload) {
    try {
      const response = await axios.post(`${API_URL}/problem/add`, payload)
      // console.log(response.data.data)
      return response
    } catch (error) {
      console.error('Error fetching tools:', error)
    }
  },
  async ACTION_ADD_PROBLEM_NEXT_PROCESS({ commit }, payload) {
    try {
      const response = await axios.post(
        `${API_URL}/problem/nextprocess`,
        payload,
      )
      // console.log(response.data.data)
      return response
    } catch (error) {
      console.error('Error fetching tools:', error)
    }
  },
  async ACTION_ADD_REPORT_REG_SET({ commit }, payload) {
    try {
      // console.log('payload vuex', payload)

      const response = await axios.post(`${API_URL}/tools/add`, payload)

      return response
    } catch (error) {
      console.error('Error fetching tools:', error)
    }
  },
  async ACTION_GET_REPORT_REG_SET({ commit }, payload) {
    try {
      const response = await axios.get(`${API_URL}/tools/get/${payload}`)
      commit(SET_REPORT, response.data.data)
      // console.log(response.data.data)
    } catch (error) {
      console.error('Error fetching tools:', error)
    }
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
