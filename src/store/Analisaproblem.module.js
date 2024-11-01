const API_URL = process.env.VUE_APP_API_URL
import axios from 'axios'
export const ACTION_ADD_ANALISA_PROBLEM = 'ACTION_ADD_ANALISA_PROBLEM'

export const ACTION_GET_PROBLEM_ANALISA = 'ACTION_GET_PROBLEM_ANALISA'
export const GET_PROBLEM_ANALISA = 'GET_PROBLEM_ANALISA'
export const SET_PROBLEM_ANALISA = 'SET_PROBLEM_ANALISA'

const state = {
  ANALISA: [],
}

const getters = {
  GET_PROBLEM_ANALISA(state) {
    return state.ANALISA
  },
}

const mutations = {
  SET_PROBLEM_ANALISA(state, payload) {
    state.ANALISA = payload.map((problem) => {
      if (Array.isArray(problem.foto)) {
        // Map each path in the foto array, prepending the API_URL
        problem.foto = problem.foto.map((fotoPath) => `${API_URL}${fotoPath}`)
      }
      console.log('Problem:', problem)

      return problem
    })
  },
}

const actions = {
  async ACTION_ADD_ANALISA_PROBLEM({ commit }, payload) {
    try {
      // Membuat FormData dari payload
      const formData = new FormData()
      formData.append('shift', payload.shift)
      formData.append('problem_id', payload.problem_id)
      formData.append('problem_nm', payload.problem_nm)
      formData.append('machine_id', payload.machine_id)
      formData.append('tool_id', payload.tool_id)
      formData.append('tool_nm', payload.tool_nm)
      formData.append('created_dt', payload.created_dt)
      formData.append('analisa', payload.analisa)

      // Menambahkan semua file ke FormData
      if (Array.isArray(payload.foto) && payload.foto.length > 0) {
        payload.foto.forEach((file) => {
          formData.append('foto', file) // Menambahkan file foto
        })
      }

      console.log([...formData]) // Log isi FormData

      const response = await axios.post(API_URL + '/analisa/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response
    } catch (error) {
      console.error('Error fetching tools:', error)
    }
  },
  async ACTION_GET_PROBLEM_ANALISA({ commit }, payload) {
    try {
      const response = await axios.get(`${API_URL}/analisa/get/`, {
        params: {
          shift: payload.shift,
          date: payload.date,
        },
      })
      commit('SET_PROBLEM_ANALISA', response.data.data)
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
