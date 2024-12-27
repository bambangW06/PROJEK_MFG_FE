import axios from 'axios'

const API_URL = process.env.VUE_APP_API_URL

const state = {
  dataTool: [],
}

const getters = {
  getDataTool: (state) => state.dataTool,
}

const mutations = {
  setDataTool(state, payload) {
    const toolWithPreview = payload.map((dataTool) => {
      // Periksa apakah properti tool_img
      const relativePath = dataTool.tool_img
        ? dataTool.tool_img.replace(/\\/g, '/')
        : null
      const previewUrl = relativePath ? API_URL + relativePath : null
      return {
        ...dataTool,
        previewUrl: previewUrl,
      }
    })
    state.dataTool = toolWithPreview
    // console.log('setDataTool mutations', state.dataTool)
  },
}

const actions = {
  async ActionSaveDataTool({ commit, dispatch }, payload) {
    try {
      const formData = new FormData()
      formData.append('line_id', payload.line_id)
      formData.append('op_no', payload.op_no)
      formData.append('tool_no', payload.tool_no)
      formData.append('process_nm', payload.process_nm)
      formData.append('tool_nm', payload.tool_nm)
      formData.append('foto', payload.tool_img)

      // console.log('Data sent to backend:', formData)

      const response = await axios.post(
        `${API_URL}/masterTools/add`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )

      if (response.status === 201) {
        alert('Berhasil Menyimpan Data Tool')
      } else {
        alert('Gagal Menyimpan Data Tool')
      }

      await dispatch('ActionFetchDataTool')
    } catch (error) {
      console.error('Error adding tool:', error)
      // Handle error as needed
    }
  },

  async ActionFetchDataTool({ commit }) {
    try {
      const response = await axios.get(`${API_URL}/masterTools/get`)
      commit('setDataTool', response.data.data)
      // console.log('setDataTool', response.data.data)
    } catch (error) {
      console.error('Error fetching tool:', error)
      // Handle error as needed
    }
  },
  async ActionEditDataTool({ commit, dispatch }, payload) {
    try {
      const tool_id = payload.tool_id
      const formData = new FormData()
      formData.append('line_id', payload.line_id)
      formData.append('op_no', payload.op_no)
      formData.append('tool_no', payload.tool_no)
      formData.append('process_nm', payload.process_nm)
      formData.append('tool_nm', payload.tool_nm)
      formData.append('foto', payload.selectedImage)

      const response = await axios.put(
        `${API_URL}/masterTools/edit/${tool_id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )

      if (response.status === 200) {
        alert('Berhasil Mengedit Data Tool')
      } else {
        alert('Gagal Mengedit Data Tool')
      }

      commit('setDataTool', response.data.data)

      await dispatch('ActionFetchDataTool')

      // console.log('setDataTool', payload)
    } catch (error) {
      console.error('Error adding tool:', error)
    }
  },

  async ActionDeleteDataTool({ commit, dispatch }, payload) {
    try {
      const response = await axios.delete(
        `${API_URL}/masterTools/delete/${payload}`,
      )
      if (response.status === 200) {
        alert('Berhasil Menghapus Data Tool')
      } else {
        alert('Gagal Menghapus Data Tool')
      }
      // console.log(response.data.data)
      commit('setDataTool', response.data.data)

      await dispatch('ActionFetchDataTool')

      // console.log('setMeasurements', response.data.data)
    } catch (error) {
      console.error('Error fetching measurements:', error)
    }
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
