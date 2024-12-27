import axios from 'axios'

const API_URL = process.env.VUE_APP_API_URL

const state = {
  reservasi: [],
  grafikReservasi: [],
  regrinding: [],
  grafikRegrinding: [],
}

const getters = {
  getReservasi(state) {
    return state.reservasi[0] || {}
  },
  getGrafikReservasi(state) {
    return state.reservasi
  },
  getRegrinding(state) {
    return state.regrinding[0] || {}
  },
  getGrafikRegrinding(state) {
    return state.regrinding
  },
}

const mutations = {
  setReservasi(state, payload) {
    state.reservasi = payload
    // console.log('setReservasi mutations', state.reservasi)
  },
  setGrafikReservasi(state, payload) {
    state.reservasi = payload
    // console.log('setGrafikReservasi mutations', state.reservasi)
  },
  setRegrinding(state, payload) {
    state.regrinding = payload
  },
  setGrafikRegrinding(state, payload) {
    state.regrinding = payload
  },
}

const actions = {
  async ActionSubmitData(_, { endpoint, payload }) {
    // console.log('payload', payload)
    try {
      const response = await axios.post(`${API_URL}/${endpoint}`, payload)
      if (response.status === 201) {
        if (endpoint === 'reservasi/add') {
          alert('Berhasil Menambahkan Reservasi')
        } else if (endpoint === 'regrinding/add') {
          alert('Berhasil Menambahkan Regrinding')
        }
      }
    } catch (error) {
      console.error('Error adding reservasi:', error)
    }
  },
  async ActionGetReservasi({ commit }, payload) {
    // console.log('payload', payload)
    try {
      const response = await axios.get(`${API_URL}/reservasi/get`, {
        params: { shift: payload },
      })
      // console.log(response.data.data)
      commit('setReservasi', response.data.data)
      // console.log('setReservasi', response.data.data)
    } catch (error) {
      console.error('Error fetching reservasi:', error)
    }
  },
  async ActionGetGrafikReservasi({ commit }) {
    try {
      const response = await axios.get(`${API_URL}/grafikreservasi/get`)
      commit('setGrafikReservasi', response.data.data)
      // console.log('setGrafikReservasi', response.data.data)
    } catch (error) {
      console.error('Error fetching reservasi:', error)
    }
  },
  async ActionGetRegrinding({ commit }, payload) {
    console.log('payload', payload)
    try {
      const response = await axios.get(`${API_URL}/regrinding/get`, {
        params: {
          shift: payload,
        },
      })
      // console.log(response.data.data)
      commit('setRegrinding', response.data.data)
      // console.log('setRegrinding', response.data.data)
    } catch (error) {
      console.error('Error fetching regrinding:', error)
    }
  },
  async ActionGetGrafikRegrinding({ commit }) {
    try {
      const response = await axios.get(`${API_URL}/grafikregrinding/get`)
      // console.log(response.data.data)
      commit('setGrafikRegrinding', response.data.data)
    } catch (error) {
      console.error('Error fetching regrinding:', error)
    }
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
