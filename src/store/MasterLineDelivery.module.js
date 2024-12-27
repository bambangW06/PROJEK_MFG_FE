import axios from 'axios'

const API_URL = process.env.VUE_APP_API_URL

const state = {
  dataLines: [],
}

const getters = {
  getMasterLine: (state) => state.dataLines,
}

const mutations = {
  setMasterLine(state, payload) {
    state.dataLines = payload
  },
}

const actions = {
  async ActionAddLine({ commit }, payload) {
    try {
      console.log(payload)
      const response = await axios.post(`${API_URL}/delivery/addLine`, payload)
      if (response.status === 201) {
        alert('Berhasil Menambahkan Line')
      } else {
        alert('Gagal Menambahkan Line')
      }
    } catch (error) {
      console.error('Error adding line:', error)
    }
  },
  async fetchMasterLine({ commit }) {
    try {
      const response = await axios.get(`${API_URL}/delivery/getLine`)
      commit('setMasterLine', response.data.data)
    } catch (error) {
      console.error('Error fetching lines:', error)
    }
  },
  async ActionEditMasterLine({ commit }, payload) {
    try {
      const line_id = payload.line_id
      console.log(payload)
      const response = await axios.put(
        `${API_URL}/delivery/editLine/${line_id}`,
        payload,
      )
      if (response.status === 200) {
        alert('Berhasil Mengedit Line')
        commit('setMasterLine', response.data.data)
      } else {
        alert('Gagal Mengedit Line')
      }
    } catch (error) {
      console.error('Error editing line:', error)
    }
  },
  async ActionDeleteMasterLine({ commit }, payload) {
    try {
      const response = await axios.delete(
        `${API_URL}/delivery/delete/${payload}`,
      )
      if (response.status === 201) {
        alert('Berhasil Menghapus Line')
        commit('setMasterLine', response.data.data)
      } else {
        alert('Gagal Menghapus Line')
      }
    } catch (error) {
      console.error('Error deleting line:', error)
    }
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
