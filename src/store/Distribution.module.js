import axios from 'axios'

const API_URL = process.env.VUE_APP_API_URL

const state = {
  dataDistribution: [
    {
      id: 1,
      distribution_nm: 'Distribution 1',
      distribution_desc: 'Distribution 1 Description',
      created_by: 'Admin',
    },
    {
      id: 2,
      distribution_nm: 'Distribution 2',
      distribution_desc: 'Distribution 2 Description',
      created_by: 'Admin 2',
    },
  ],
}

const getters = {
  getDataDistribution: (state) => state.dataDistribution,
}

const mutations = {
  setDataDistribution(state, newPayload) {
    state.dataDistribution.push(newPayload)
  },
  updateDataDistribution(state, updatedPayload) {
    const index = state.dataDistribution.findIndex(
      (distribution) => distribution.id === updatedPayload.id,
    )
    if (index !== -1) {
      state.dataDistribution.splice(index, 1, updatedPayload)
    }
  },
  removeDataDistribution(state, id) {
    state.dataDistribution = state.dataDistribution.filter(
      (distribution) => distribution.id !== id,
    )
  },
}

const actions = {
  async ActionSaveDistribution({ commit }, payload) {
    try {
      // const response = await axios.post(`${API_URL}/distributions`, payload)
      commit('setDataDistribution', payload)
    } catch (error) {
      console.log(error)
    }
  },
  async ActionEditDistribution({ commit }, payload) {
    try {
      // const response = await axios.put(`${API_URL}/distributions/${payload.id}`, payload)
      commit('updateDataDistribution', payload)
    } catch (error) {
      console.log(error)
    }
  },
  async ActionDeleteDistribution({ commit }, id) {
    try {
      // const response = await axios.delete(`${API_URL}/distributions/${id}`)
      commit('removeDataDistribution', id)
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
