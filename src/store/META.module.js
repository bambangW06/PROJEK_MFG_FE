import axios from 'axios'
const API_URL = process.env.VUE_APP_API_URL

export const GET_META = 'GET_META'
export const GET_META_OPTS = 'GET_META_OPTS'
export const SET_META = 'SET_META'
export const ACTION_META = 'ACTION_META'

const state = {
  META_DATA: {
    totalData: 0,
    currentPage: 1,
    itemsPerPage: 10,
    totalPages: 1,
  },
}

const getters = {
  GET_META(state) {
    return state.META_DATA
  },
}

const mutations = {
  SET_META(state, payload) {
    state.META_DATA = payload
  },
}

const actions = {
  async ACTION_META({ commit }, metaData) {
    try {
      commit(SET_META, metaData)
    } catch (error) {
      console.error(error)
      return error
    }
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
