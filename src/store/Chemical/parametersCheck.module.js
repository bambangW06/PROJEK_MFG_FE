import axios from 'axios'
const API_URL = process.env.VUE_APP_API_URL

export const SET_OPTIONS_PARAMETERS = 'SET_OPTIONS_PARAMETERS'
export const GET_OPTIONS_PARAMETERS = 'GET_OPTIONS_PARAMETERS'
export const ACTION_GET_OPTIONS_PARAMETERS = 'ACTION_GET_OPTIONS_PARAMETERS'

export const SET_RANGE_OPTION = 'SET_RANGE_OPTION'
export const GET_RANGE_OPTION = 'GET_RANGE_OPTION'
export const ACTION_GET_RANGE_OPTION = 'ACTION_GET_RANGE_OPTION'

export const ACTION_POST_PARAMETERS_CHECK = 'ACTION_POST_PARAMETERS_CHECK'

export const SET_RESULT_DATA = 'SET_RESULT_DATA'
export const GET_RESULT_DATA = 'GET_RESULT_DATA'
export const ACTION_GET_RESULT_CHECK = 'ACTION_GET_RESULT_CHECK'

const state = {
  DATA_OPTIONS_PARAMETERS: [],
  RANGE_DATA: [],
  RESULT_DATA: [],
}

const getters = {
  GET_OPTIONS_PARAMETERS: (state) => state.DATA_OPTIONS_PARAMETERS,
  GET_RANGE_OPTION: (state) => state.RANGE_DATA,
  GET_RESULT_DATA: (state) => state.RESULT_DATA,
}

const mutations = {
  SET_OPTIONS_PARAMETERS(state, payload) {
    state.DATA_OPTIONS_PARAMETERS = payload.map((option) => {
      option.ilustration = API_URL + option.ilustration
      return option
    })
  },
  SET_RANGE_OPTION(state, payload) {
    state.RANGE_DATA = payload
  },
  SET_RESULT_DATA(state, payload) {
    state.RESULT_DATA = payload
  },
}

const actions = {
  async ACTION_GET_OPTIONS_PARAMETERS({ commit }) {
    try {
      const response = await axios.get(`${API_URL}/parametersOptions/get`)

      commit(SET_OPTIONS_PARAMETERS, response.data.data)
      return response
    } catch (error) {
      console.log(error)
    }
  },
  async ACTION_GET_RANGE_OPTION({ commit }) {
    try {
      const response = await axios.get(`${API_URL}/parametersOptions/range`)
      commit(SET_RANGE_OPTION, response.data.data)
      return response
    } catch (error) {
      console.log(error)
    }
  },
  async ACTION_POST_PARAMETERS_CHECK({ commit }, payload) {
    try {
      const response = await axios.post(
        `${API_URL}/parametersOptions/add`,
        payload,
      )
      return response
    } catch (error) {
      console.log(error)
    }
  },
  async ACTION_GET_RESULT_CHECK({ commit }) {
    try {
      const response = await axios.get(`${API_URL}/parametersOptions/getResult`)
      commit(SET_RESULT_DATA, response.data.data)
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
