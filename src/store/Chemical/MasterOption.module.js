const API_URL = process.env.VUE_APP_API_URL
import axios from 'axios'

export const ACTION_ADD_OPTION_PARAMETERS = 'ACTION_ADD_OPTION_PARAMETERS'

export const ACTION_EDIT_OPTION_PARAMETERS = 'ACTION_EDIT_OPTION_PARAMETERS'

export const ACTION_DELETE_OPTION_PARAMETERS = 'ACTION_DELETE_OPTION_PARAMETERS'

const state = {
  OPTION_DATA: [],
}

const getters = {}

const mutations = {}

const actions = {
  async ACTION_ADD_OPTION_PARAMETERS({ commit }, payload) {
    try {
      const formData = new FormData()
      formData.append('opt_nm', payload.opt_nm)
      formData.append('opt_desc', payload.opt_desc)
      formData.append('foto', payload.ilustrasion)
      formData.append('created_by', payload.created_by)
      formData.append('created_dt', payload.created_dt)

      const response = await axios.post(
        `${API_URL}/masterOptions/add`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )

      return response
    } catch (error) {
      console.log(error)
    }
  },
  async ACTION_EDIT_OPTION_PARAMETERS({ commit }, payload) {
    try {
      const formData = new FormData()
      formData.append('opt_nm', payload.opt_nm)
      formData.append('opt_desc', payload.opt_desc)
      formData.append('foto', payload.ilustrasion)
      formData.append('changed_by', payload.changed_by)
      formData.append('changed_dt', payload.created_dt)

      const response = await axios.put(
        `${API_URL}/masterOptions/edit/${payload.option_id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )

      return response
    } catch (error) {
      console.log(error)
    }
  },
  async ACTION_DELETE_OPTION_PARAMETERS({ commit }, payload) {
    try {
      const response = await axios.delete(
        `${API_URL}/masterOptions/delete/${payload.option_id}`,
      )
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
