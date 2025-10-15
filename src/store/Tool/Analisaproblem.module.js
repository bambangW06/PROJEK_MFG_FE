const API_URL = process.env.VUE_APP_API_URL
import axios from 'axios'
export const ACTION_ADD_ANALISA_PROBLEM = 'ACTION_ADD_ANALISA_PROBLEM'

export const ACTION_GET_PROBLEM_ANALISA = 'ACTION_GET_PROBLEM_ANALISA'
export const GET_PROBLEM_ANALISA = 'GET_PROBLEM_ANALISA'
export const SET_PROBLEM_ANALISA = 'SET_PROBLEM_ANALISA'

export const ACTION_EDIT_ANALISA_PROBLEM = 'ACTION_EDIT_ANALISA_PROBLEM'

export const ACTION_DELETE_ANALISA_PROBLEM = 'ACTION_DELETE_ANALISA_PROBLEM'

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
      // console.log('Problem:', problem)

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
      formData.append('analisa', payload.analisa)
      formData.append('created_dt', payload.created_dt)

      // Menambahkan data sesuai dengan kondisi "Problem Next Proses" atau "Problem In Proses"
      if (payload.tool_id && payload.machine_id) {
        // Data untuk "Problem Next Proses"
        formData.append('tool_id', payload.tool_id)
        formData.append('tool_nm', payload.tool_nm)
        formData.append('machine_id', payload.machine_id)
        formData.append('line_nm', payload.line_nm)
      } else {
        // Data untuk "Problem In Proses"
        formData.append('category_id', payload.category_id)
        formData.append('category_nm', payload.category_nm)
        formData.append('waktu', payload.waktu)
      }
      // Menambahkan semua file ke FormData
      if (Array.isArray(payload.foto) && payload.foto.length > 0) {
        payload.foto.forEach((file) => {
          formData.append('foto', file) // Menambahkan file foto
        })
      }

      // console.log([...formData]) // Log isi FormData

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
  async ACTION_EDIT_ANALISA_PROBLEM({ commit }, payload) {
    try {
      const problem_id = payload.problem_id
      const formData = new FormData()
      formData.append('problem_nm', payload.problem_nm)
      formData.append('analisa', payload.analisa)
      // Tambahkan category_id jika ada di payload
      if (payload.category_id) {
        formData.append('category_id', payload.category_id)
      }
      // Menambahkan semua file ke FormData
      if (Array.isArray(payload.foto) && payload.foto.length > 0) {
        payload.foto.forEach((file) => {
          formData.append('foto', file) // Menambahkan file foto
        })
      }

      // console.log([...formData]) // Log isi FormData

      const response = await axios.put(
        `${API_URL}/analisa/edit/${problem_id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      return response
    } catch (error) {
      console.error('Error fetching tools:', error)
    }
  },
  async ACTION_DELETE_ANALISA_PROBLEM({ commit }, payload) {
    try {
      const response = await axios.delete(
        `${API_URL}/analisa/delete/${payload.problem_id}`,
        {
          params: {
            category_id: payload.category_id || null, // Kirimkan category_id jika ada, jika tidak kirim null
          },
        },
      )
      return response
    } catch (error) {
      console.error('Error deleting data:', error)
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
      // Modifikasi `line_nm` sesuai dengan singkatan yang diinginkan
      const modifiedData = response.data.data.map((item) => {
        if (item.line_nm === 'Cylinder Block') item.line_nm = 'C/B'
        else if (item.line_nm === 'Cylinder Head') item.line_nm = 'C/H'
        else if (item.line_nm === 'Crank Shaft') item.line_nm = 'C/S'
        else if (item.line_nm === 'Cam Shaft') item.line_nm = 'Cam'
        return item
      })
      commit('SET_PROBLEM_ANALISA', modifiedData)
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
