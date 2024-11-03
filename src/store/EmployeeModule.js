import axios from 'axios'
const API_URL = process.env.VUE_APP_API_URL
export const ACTION_GET_SUPERVISOR = 'ACTION_GET_SUPERVISOR'
export const GET_SUPERVISOR = 'GET_SUPERVISOR'
export const ACTION_GET_KARYAWAN = 'ACTION_GET_KARYAWAN'
export const SET_SUPERVISOR = 'SET_SUPERVISOR'

const state = {
  response: null,
  karyawan: [],
  SUPERVISOR: [],

  // token: null,
  // fullname: null,
}

const getters = {
  getResponse(state) {
    return state.response
  },
  getKaryawanList(state) {
    return state.karyawan
  },
  GET_SUPERVISOR(state) {
    return state.SUPERVISOR
  },
}

const mutations = {
  setResponse(state, payload) {
    state.response = payload
  },
  setKaryawanList(state, payload) {
    // Tambahkan properti previewUrl ke setiap objek karyawan di dalam daftar
    const karyawanListWithPreview = payload.map((karyawan) => {
      // Periksa apakah properti photourl ada sebelum mengaksesnya
      const relativePath = karyawan.photourl
        ? karyawan.photourl.replace(/\\/g, '/')
        : null
      const previewUrl = relativePath ? API_URL + relativePath : null
      return {
        ...karyawan,
        previewUrl: previewUrl,
      }
    })
    state.karyawan = karyawanListWithPreview
  },
  SET_SUPERVISOR(state, payload) {
    state.SUPERVISOR = payload.map((supervisor) => {
      supervisor.photourl = API_URL + supervisor.photourl
      console.log('supervisor', supervisor.photourl)

      return supervisor
    })
  },
}

const actions = {
  async ACTION_GET_SUPERVISOR({ commit }) {
    try {
      const response = await axios.get(API_URL + '/select/supervisor')
      commit(SET_SUPERVISOR, response.data.data)
    } catch (error) {
      console.log(error)
    }
  },
  async ActionTambahKaryawan({ commit, dispatch }, payload) {
    try {
      const formData = new FormData()
      // Tambahkan data ke FormData
      formData.append('nama', payload.nama)
      formData.append('noreg', payload.noreg)
      formData.append('shift', payload.shift)
      formData.append('jabatan', payload.jabatan)
      formData.append('foto', payload.selectedFile) // Tambahkan file foto ke FormData
      formData.append('default_position', payload.default_position)
      console.log([...formData])

      const result = await axios.post(API_URL + '/employees/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      commit('setResponse', result)

      // Panggil aksi fetchKaryawanList untuk memperbarui daftar karyawan
      await dispatch('fetchKaryawanList')
    } catch (error) {
      console.log(error)
      return error
    }
  },
  async fetchKaryawanList({ commit }) {
    try {
      const response = await axios.get(API_URL + '/employees/get')
      commit('setKaryawanList', response.data.data)
    } catch (error) {
      console.error('Error fetching employee list:', error)
      throw error
    }
  },
  async ActionEditKaryawan({ commit, dispatch }, payload) {
    try {
      const { employee_id, editedData } = payload // Destructure payload untuk mendapatkan data yang diperlukan

      // Buat objek FormData baru
      const formData = new FormData()
      // Tambahkan data yang akan diedit ke FormData
      formData.append('employee_id', employee_id) // Pastikan ID karyawan disertakan
      formData.append('nama', editedData.nama)
      formData.append('noreg', editedData.noreg)
      formData.append('shift', editedData.shift)
      formData.append('jabatan', editedData.jabatan)
      formData.append('foto', editedData.selectedFile) // Tambahkan file foto jika perlu diubah
      formData.append('default_position', payload.defaultPos)

      // Kirim permintaan PUT untuk mengedit karyawan
      const response = await axios.put(
        `${API_URL}/employees/edit/${employee_id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )

      // Set response dari hasil permintaan
      commit('setResponse', response.data)

      // Panggil aksi fetchKaryawanList untuk memperbarui daftar karyawan setelah pengeditan
      await dispatch('fetchKaryawanList')
    } catch (error) {
      console.error('Error editing employee:', error)
      throw error
    }
  },
  async ActionDeleteKaryawan({ commit, dispatch }, payload) {
    const { employeeId } = payload
    try {
      const response = await axios.delete(
        `${API_URL}/employees/delete/${employeeId}`,
      )
      commit('setResponse', response.data)
      await dispatch('fetchKaryawanList')
    } catch (error) {
      console.error('Error deleting employee:', error)
      throw error
    }
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
