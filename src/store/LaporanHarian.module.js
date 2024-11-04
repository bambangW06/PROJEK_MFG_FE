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
export const ACTION_STD_COUNTER = 'ACTION_STD_COUNTER'

export const ACTION_ADD_PROBLEM = 'ACTION_ADD_PROBLEM'
export const ACTION_ADD_PROBLEM_NEXT_PROCESS = 'ACTION_ADD_PROBLEM_NEXT_PROCESS'

export const ACTION_GET_PROBLEM_MODAL = 'ACTION_GET_PROBLEM_MODAL'
export const SET_PROBLEM_MODAL = 'SET_PROBLEM_MODAL'
export const GET_PROBLEM_MODAL = 'GET_PROBLEM_MODAL'

export const ACTION_DELETE_PROBLEM = 'ACTION_DELETE_PROBLEM'

export const ACTION_ADD_REPORT_REG_SET = 'ACTION_ADD_REPORT_REG_SET'

export const ACTION_GET_REPORT_REG_SET = 'ACTION_GET_REPORT_REG_SET'
export const SET_REPORT = 'SET_REPORT'
export const GET_REPORT = 'GET_REPORT'

export const ACTION_GET_PROBLEM_TABLE = 'ACTION_GET_PROBLEM_TABLE'
export const SET_PROBLEM_IN_PROSES = 'SET_PROBLEM_IN_PROSES'
export const SET_PROBLEM_NEXT_PROCESS = 'SET_PROBLEM_NEXT_PROCESS'
export const GET_PROBLEM_IN_PROCESS = 'GET_PROBLEM_IN_PROCESS'
export const GET_PROBLEM_NEXT_PROCESS = 'GET_PROBLEM_NEXT_PROCESS'

export const ACTION_ADD_OEE = 'ACTION_ADD_OEE'
export const ACTION_GET_OEE = 'ACTION_GET_OEE'
export const SET_OEE = 'SET_OEE'
export const GET_OEE = 'GET_OEE'

export const ACTION_GET_ABSENSI = 'ACTION_GET_ABSENSI'
export const SET_ABSENSI = 'SET_ABSENSI'
export const GET_ABSENSI = 'GET_ABSENSI'

export const ACTION_GET_TIME_RANGES = 'ACTION_GET_TIME_RANGES'
export const SET_TIME_RANGES = 'SET_TIME_RANGES'
export const GET_TIME_RANGES = 'GET_TIME_RANGES'

const state = {
  TOOLS: [],
  CATEGORIES: [],
  STD_COUNTER: [],
  PROBLEM_MODAL: [],
  REPORT: [],
  PROBLEM_IN_PROCESS: [],
  PROBLEM_NEXT_PROCESS: [],
  OEE: [],
  ABSENSI: [],
  TIME_RANGES: [],
}

const getters = {
  GET_TOOLS: (state) => state.TOOLS,
  GET_CATEGORIES: (state) => state.CATEGORIES,
  GET_STD_COUNTER: (state) => state.STD_COUNTER,
  GET_PROBLEM_MODAL: (state) => state.PROBLEM_MODAL,
  GET_REPORT: (state) => state.REPORT,
  GET_PROBLEM_IN_PROCESS: (state) => state.PROBLEM_IN_PROCESS,
  GET_PROBLEM_NEXT_PROCESS: (state) => state.PROBLEM_NEXT_PROCESS,
  GET_OEE: (state) => state.OEE,
  GET_ABSENSI: (state) => state.ABSENSI,

  GET_TIME_RANGES: (state) => state.TIME_RANGES,
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
  SET_PROBLEM_MODAL(state, payload) {
    state.PROBLEM_MODAL = payload
  },
  SET_REPORT(state, payload) {
    state.REPORT = payload
  },
  SET_PROBLEM_IN_PROSES(state, payload) {
    state.PROBLEM_IN_PROCESS = payload
  },
  SET_PROBLEM_NEXT_PROCESS(state, payload) {
    state.PROBLEM_NEXT_PROCESS = payload
  },
  SET_OEE(state, payload) {
    state.OEE = payload
  },
  SET_ABSENSI(state, payload) {
    state.ABSENSI = payload
  },

  SET_TIME_RANGES(state, payload) {
    state.TIME_RANGES = payload
  },
}

const actions = {
  async ACTION_GET_TIME_RANGES({ commit }, payload) {
    try {
      const response = await axios.get(
        `${API_URL}/laporan/timeranges/${payload}`,
      )
      console.log(response.data.data)
      commit(SET_TIME_RANGES, response.data.data)
      return response
    } catch (error) {
      console.error('Error fetching timerange:', error)
    }
  },
  async ACTION_GET_ABSENSI({ commit }, payload) {
    try {
      const response = await axios.get(`${API_URL}/oee/absensi`, {
        params: {
          date: payload.date,
          shift: payload.shift,
        },
      })
      commit(SET_ABSENSI, response.data.data)
      // console.log(response.data.data)
      return response
    } catch (error) {
      console.error('Error fetching tools:', error)
    }
  },
  async ACTION_GET_OEE({ commit }, payload) {
    try {
      const response = await axios.get(`${API_URL}/oee/get`, {
        params: {
          date: payload.date,
          shift: payload.shift,
        },
      })
      commit(SET_OEE, response.data.data)
      // console.log(response.data.data)
      return response
    } catch (error) {
      console.error('Error fetching tools:', error)
    }
  },
  async ACTION_ADD_OEE({ commit }, payload) {
    try {
      const response = await axios.post(`${API_URL}/oee/add`, payload)
      return response
    } catch (error) {
      console.error('Error fetching tools:', error)
    }
  },
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
      return response
    } catch (error) {
      console.error('Error fetching tools:', error)
    }
  },
  async ACTION_GET_PROBLEM_MODAL({ commit }, payload) {
    try {
      const modalType = payload.modalType
      // console.log(modalType)

      const selectedJam = payload.time_range
      // console.log(selectedJam)

      const selectedDate = payload.selectedDate

      const response = await axios.get(`${API_URL}/problem/get`, {
        params: {
          modalType: modalType,
          time_range: selectedJam,
          selectedDate: selectedDate,
        },
      })

      // console.log(response.data.data)
      commit(SET_PROBLEM_MODAL, response.data.data)
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
  async ACTION_DELETE_PROBLEM({ commit }, payload) {
    try {
      const response = await axios.delete(`${API_URL}/problem/delete`, {
        params: {
          modalType: payload.modalType,
          problem_id: payload.id,
        },
      })
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
      const response = await axios.get(`${API_URL}/tools/get`, {
        params: {
          selectedDate: payload.selectedDate,
          shift: payload.shift,
        },
      })
      // console.log(response.data.data)

      commit(SET_REPORT, response.data.data)
      return response
    } catch (error) {
      console.error('Error fetching tools:', error)
    }
  },
  async ACTION_GET_PROBLEM_TABLE({ commit }, payload) {
    try {
      const response = await axios.get(`${API_URL}/problem/table`, {
        params: {
          selectedDate: payload,
        },
      })
      // console.log(response.data.data)

      commit(SET_PROBLEM_IN_PROSES, response.data.data.inProcess)
      // console.log('SET_PROBLEM_IN_PROSES', response.data.data.inProcess)

      commit(SET_PROBLEM_NEXT_PROCESS, response.data.data.nextProcess)
      // console.log('SET_PROBLEM_NEXT_PROCESS', response.data.data.nextProcess)

      return response
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
