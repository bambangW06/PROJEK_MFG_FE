const API_URL = process.env.VUE_APP_API_URL

import axios from 'axios'

export const ACTION_GET_MASTER_MACHINES = 'ACTION_GET_MASTER_MACHINES'
export const SET_MASTER_MACHINES = 'SET_MASTER_MACHINES'
export const GET_MASTER_MACHINES = 'GET_MASTER_MACHINES'

export const ACTION_ADD_MASTER_MACHINE = 'ACTION_ADD_MASTER_MACHINE'

export const ACTION_EDIT_MASTER_MACHINE = 'ACTION_EDIT_MASTER_MACHINE'

export const ACTION_DELETE_MASTER_MACHINE = 'ACTION_DELETE_MASTER_MACHINE'

const state = {
  MASTER_MACHINES: [],
}

const getters = {
  GET_MASTER_MACHINES(state) {
    return state.MASTER_MACHINES
  },
}

const mutations = {
  SET_MASTER_MACHINES(state, payload) {
    state.MASTER_MACHINES = payload
  },
}

const actions = {
  async ACTION_GET_MASTER_MACHINES({ commit }, payload) {
    try {
      const response = await axios.get(
        `${API_URL}/masterMachines/get?line_id=${payload}`,
      )

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
}

export default {
  state,
  getters,
  mutations,
  actions,
}
