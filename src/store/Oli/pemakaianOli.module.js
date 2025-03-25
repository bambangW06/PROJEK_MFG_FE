const API_URL = process.env.VUE_APP_API_URL

import axios from 'axios'

export const ACTION_ADD_PEMAKAIAN_OLI = 'ACTION_ADD_PEMAKAIAN_OLI'

export const ACTION_GET_DATA_LINES = 'ACTION_GET_DATA_LINES'
export const GET_DATA_LINES = 'GET_DATA_LINES'
export const SET_DATA_LINES = 'SET_DATA_LINES'

export const ACTION_GET_MACHINES = 'ACTION_GET_MACHINES'
export const GET_DATA_MACHINES_ALL = 'GET_DATA_MACHINES_ALL'
export const SET_DATA_MACHINES = 'SET_DATA_MACHINES'

export const ACTION_GET_OILS_USAGE = 'ACTION_GET_OILS_USAGE'
export const GET_OILS_USAGE = 'GET_OILS_USAGE'
export const SET_OILS_USAGE = 'SET_OILS_USAGE'

const state = {
  DATA_LINE: [],
  DATA_MACHINES: [],
  OILS_USAGE_DATA: [],
}

const getters = {
  GET_DATA_MACHINES_ALL(state) {
    return state.DATA_MACHINES
  },
  GET_OILS_USAGE(state) {
    return state.OILS_USAGE_DATA
  },
}

const mutations = {
  SET_DATA_MACHINES(state, payload) {
    state.DATA_MACHINES = payload
  },
  SET_OILS_USAGE(state, payload) {
    state.OILS_USAGE_DATA = payload
  },
}

const actions = {
  async ACTION_ADD_PEMAKAIAN_OLI({ commit }, payload) {
    try {
      const response = await axios.post(`${API_URL}/pemakaianOli/add`, payload)
      return response
    } catch (error) {
      console.log(error)
    }
  },
  async ACTION_GET_MACHINES({ commit }) {
    try {
      const response = await axios.get(`${API_URL}/pemakaianOli/machines`)
      let machines = response.data.data

      // Proses pengelompokan
      let groupedMachines = machines.reduce((acc, machine) => {
        const { root_line_id, cell_nm } = machine

        // Jika root_line_id belum ada, buat array kosong
        if (!acc[root_line_id]) {
          acc[root_line_id] = {}
        }

        // Jika cell_nm belum ada dalam root_line_id, buat array kosong
        if (!acc[root_line_id][cell_nm]) {
          acc[root_line_id][cell_nm] = []
        }

        // Tambahkan mesin ke dalam grup
        acc[root_line_id][cell_nm].push(machine)
        return acc
      }, {})

      commit(SET_DATA_MACHINES, groupedMachines)
      // console.log('response get machines', groupedMachines)

      return response
    } catch (error) {
      console.log(error)
    }
  },
  async ACTION_GET_OILS_USAGE({ commit }) {
    try {
      const response = await axios.get(`${API_URL}/pemakaianOli/oils-usage`)
      commit(SET_OILS_USAGE, response.data.data)
      console.log('response', response.data.data)

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
