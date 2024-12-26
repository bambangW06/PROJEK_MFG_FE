const API_URL = process.env.VUE_APP_API_URL
import axios from 'axios'

export const ACTION_GET_MASTER_LINES = 'ACTION_GET_MASTER_LINES'
export const GET_MASTER_LINES = 'GET_MASTER_LINES'
export const SET_MASTER_LINES = 'SET_MASTER_LINES'

export const ACTION_GET_MACHINES_OP_NO = 'ACTION_GET_MACHINES_OP_NO'
export const GET_DATA_MACHINES = 'GET_DATA_MACHINES'
export const SET_DATA_MACHINES_OP_NO = 'SET_DATA_MACHINES_OP_NO'

export const ACTION_ADD_MASTER_TOOLS = 'ACTION_ADD_MASTER_TOOLS'

export const ACTION_GET_MASTER_TOOLS = 'ACTION_GET_MASTER_TOOLS'
export const GET_MASTER_TOOLS = 'GET_MASTER_TOOLS'
export const SET_MASTER_TOOLS = 'SET_MASTER_TOOLS'

export const ACTION_EDIT_MASTER_TOOLS = 'ACTION_EDIT_MASTER_TOOLS'

export const ACTION_DELETE_MASTER_TOOLS = 'ACTION_DELETE_MASTER_TOOLS'

const state = {
  DATA_LINES: [],
  DATA_MACHINES: [],
  DATA_TOOLS: [],
}

const getters = {
  GET_MASTER_LINES(state) {
    return state.DATA_LINES
  },
  GET_DATA_MACHINES(state) {
    return state.DATA_MACHINES
  },
  GET_MASTER_TOOLS(state) {
    return state.DATA_TOOLS
  },
}

const mutations = {
  SET_MASTER_LINES(state, payload) {
    state.DATA_LINES = payload
  },
  SET_DATA_MACHINES_OP_NO(state, payload) {
    state.DATA_MACHINES = payload
  },
  SET_MASTER_TOOLS(state, payload) {
    state.DATA_TOOLS = payload
  },
}

const actions = {
  async ACTION_GET_MASTER_LINES({ commit }) {
    try {
      const response = await axios.get(`${API_URL}/masterMachineOpNo/lines/get`)
      commit(SET_MASTER_LINES, response.data.data)
      return response
    } catch (error) {
      console.log(error)
    }
  },
  async ACTION_GET_MACHINES_OP_NO({ commit }, payload) {
    try {
      const response = await axios.get(
        `${API_URL}/masterMachineOpNo/get/${payload}`,
      )
      commit(SET_DATA_MACHINES_OP_NO, response.data.data)
      return response
    } catch (error) {
      console.log(error)
    }
  },
  async ACTION_ADD_MASTER_TOOLS({ commit }, payload) {
    try {
      const response = await axios.post(
        `${API_URL}/masterToolsList/add`,
        payload,
      )
      return response
    } catch (error) {
      console.log(error)
    }
  },
  async ACTION_GET_MASTER_TOOLS({ commit }) {
    try {
      const response = await axios.get(`${API_URL}/masterToolsList/get`)
      commit(SET_MASTER_TOOLS, response.data.data)
      return response
    } catch (error) {
      console.log(error)
    }
  },
  async ACTION_EDIT_MASTER_TOOLS({ commit }, payload) {
    try {
      const response = await axios.put(
        `${API_URL}/masterToolsList/edit/${payload.tool_id}`,
        payload,
      )
      return response
    } catch (error) {
      console.log(error)
    }
  },
  async ACTION_DELETE_MASTER_TOOLS({ commit }, payload) {
    try {
      const response = await axios.delete(
        `${API_URL}/masterToolsList/delete/${payload}`,
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
