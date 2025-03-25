const API_URL = process.env.VUE_APP_API_URL

import axios from 'axios'

export const ACTION_GET_MASTER_MACHINES = 'ACTION_GET_MASTER_MACHINES'
export const SET_MASTER_MACHINES = 'SET_MASTER_MACHINES'
export const GET_MASTER_MACHINES = 'GET_MASTER_MACHINES'

export const ACTION_ADD_MASTER_MACHINE = 'ACTION_ADD_MASTER_MACHINE'

export const ACTION_EDIT_MASTER_MACHINE = 'ACTION_EDIT_MASTER_MACHINE'

export const ACTION_DELETE_MASTER_MACHINE = 'ACTION_DELETE_MASTER_MACHINE'

export const ACTION_GET_CELL_NM = 'ACTION_GET_CELL_NM'
export const GET_CELL_NM = 'GET_CELL_NM'
export const SET_CELL_NM = 'SET_CELL_NM'

export const ACTION_GET_LAST_INDEX_POS = 'ACTION_GET_LAST_INDEX_POS'
export const GET_LAST_INDEX_POS = 'GET_LAST_INDEX_POS'
export const SET_LAST_INDEX_POS = 'SET_LAST_INDEX_POS'

const state = {
  MASTER_MACHINES: [],
  CELL_NM: [],
  LAST_INDEX_POS: [],
}

const getters = {
  GET_MASTER_MACHINES(state) {
    return state.MASTER_MACHINES
  },
  GET_CELL_NM(state) {
    return state.CELL_NM
  },
  GET_LAST_INDEX_POS(state) {
    return state.LAST_INDEX_POS
  },
}

const mutations = {
  SET_MASTER_MACHINES(state, payload) {
    state.MASTER_MACHINES = payload
  },
  SET_CELL_NM(state, payload) {
    state.CELL_NM = payload
  },
  SET_LAST_INDEX_POS(state, payload) {
    state.LAST_INDEX_POS = payload
  },
}

const actions = {
  async ACTION_GET_MASTER_MACHINES({ commit }, payload = {}) {
    try {
      const response = await axios.get(`${API_URL}/masterMachines/get`, {
        params: {
          line_id: payload.line_id || null,
        },
      })

      commit(SET_MASTER_MACHINES, response.data.data) // Commit data
      // console.log('response', response.data.data)

      return response
    } catch (error) {
      console.log(error) // Tangani error
    }
  },
  async ACTION_ADD_MASTER_MACHINE({ commit }, payload) {
    try {
      const response = await axios.post(
        `${API_URL}/masterMachines/add`,
        payload,
      )
      return response
    } catch (error) {
      console.log(error)
    }
  },
  async ACTION_EDIT_MASTER_MACHINE({ commit }, payload) {
    try {
      const response = await axios.put(
        `${API_URL}/masterMachines/edit/${payload.machine_id}`,
        payload,
      )
      return response
    } catch (error) {
      console.log(error)
    }
  },
  async ACTION_DELETE_MASTER_MACHINE({ commit }, payload) {
    try {
      const response = await axios.delete(
        `${API_URL}/masterMachines/delete/${payload}`,
      )
      return response
    } catch (error) {
      console.log(error)
    }
  },
  async ACTION_GET_CELL_NM({ commit }, payload) {
    try {
      const response = await axios.get(
        `${API_URL}/masterMachines/cell/${payload.root_line_id}`,
      )
      commit(SET_CELL_NM, response.data.data)
      return response
    } catch (error) {
      console.log(error)
    }
  },
  async ACTION_GET_LAST_INDEX_POS({ commit }, payload) {
    try {
      const response = await axios.get(
        `${API_URL}/masterMachines/lastIndexPos`,
        {
          params: {
            line_id: payload.line_id,
            root_line_id: payload.root_line_id,
            cell_nm: payload.cell_nm,
          },
        },
      )
      commit(SET_LAST_INDEX_POS, response.data.data)
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
