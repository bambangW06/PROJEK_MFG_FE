import axios from 'axios'
const API_URL = process.env.VUE_APP_API_URL

export const GET_KANBAN_FROM_GEL = 'GET_KANBAN_FROM_GEL'
export const SET_KANBAN_FROM_GEL = 'SET_KANBAN_FROM_GEL'
export const ACTION_GET_KANBAN_FROM_GEL = 'ACTION_GET_KANBAN_FROM_GEL'
export const ACTION_PREPARED = 'ACTION_PREPARED'
export const SET_PREPARED_STATUS = 'SET_PREPARED_STATUS'

const state = {
  KANBAN_FROM_GEL: [],
}

const getters = {
  GET_KANBAN_FROM_GEL(state) {
    return state.KANBAN_FROM_GEL
  },
}

const mutations = {
  SET_KANBAN_FROM_GEL(state, payload) {
    state.KANBAN_FROM_GEL = payload
  },

  SET_PREPARED_STATUS(state, detailId) {
    const kanbanItem = state.KANBAN_FROM_GEL.find(
      (item) => item.detail_id === detailId,
    )
    if (kanbanItem) {
      kanbanItem.is_prepared = true
    }
  },
}

const actions = {
  async ACTION_GET_KANBAN_FROM_GEL({ commit }) {
    try {
      const response = await axios.get(`${API_URL}/kanbanFromGel/get`)
      commit('SET_KANBAN_FROM_GEL', response.data.data)
      console.log('response', response.data.data)
    } catch (error) {
      console.error('Error fetching kanban from gel:', error)
    }
  },

  async ACTION_PREPARED({ commit }, detailId) {
    try {
      await axios.put(`${API_URL}/kanbanFromGel/prepared/${detailId}`)
      commit('SET_PREPARED_STATUS', detailId)
    } catch (error) {
      console.error('Error updating prepared status:', error)
    }
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
