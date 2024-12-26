import axios from 'axios'
const API_URL = process.env.VUE_APP_API_URL

const state = {
  lineNames: [],
  machinesNames: [],
  schedules: [],
}

const getters = {
  getLineNames(state) {
    return state.lineNames
  },
  getMachinesNames(state) {
    return state.machinesNames
  },
  getSchedules(state) {
    return state.schedules
  },
}

const mutations = {
  setLineNames(state, payload) {
    state.lineNames = payload
  },
  setMachinesNames(state, payload) {
    state.machinesNames = payload
  },
  setSchedules(state, payload) {
    state.schedules = payload
  },
}

const actions = {
  async fetchLines({ commit }) {
    try {
      const response = await axios.get(`${API_URL}/lines/get`)
      // console.log(response.data.data)
      commit('setLineNames', response.data.data)
      return response
    } catch (error) {
      console.error('Error fetching lines:', error)
    }
  },
  async fetchMachines({ commit }, lineId) {
    try {
      const response = await axios.get(
        `${process.env.VUE_APP_API_URL}/machines/get?line_id=${lineId}`,
      )
      if (response.data && response.data.data) {
        this.machinesNames = response.data.data.map((machine) => ({
          machine_id: machine.machine_id,
          machine_nm: machine.machine_nm,
        }))
      }
      commit('setMachinesNames', response.data.data)
      return response
    } catch (error) {
      console.error('Error fetching machines:', error)
    }
  },
  async addSchedule({ dispatch }, payload) {
    try {
      const response = await axios.post(`${API_URL}/schedules/add`, payload)
      if (response.status === 201) {
        alert('Berhasil Menambahkan Jadwal')
      }
      await dispatch('fetchSchedules')
      // console.log(response.data.data
    } catch (error) {
      console.error('Error adding schedule:', error)
      alert('Gagal Menambahkan Jadwal')
    }
  },
  async fetchSchedules({ commit }, payload) {
    try {
      // console.log('payload module', payload)
      const response = await axios.get(`${API_URL}/schedules/get`, {
        params: {
          machine_nm: payload,
        },
      })
      if (response.data && response.data.data) {
        if (response.data.data.length === 0) {
          // Jika array kosong, tampilkan pesan alert
          alert('Data Tidak Ada')
        }
      }
      // console.log(response.data.data)
      commit('setSchedules', response.data.data)
    } catch (error) {
      console.error('Error fetching schedules:', error)
    }
  },
  async actionEditSchedule({ commit, dispatch }, payload) {
    try {
      const scheduleId = payload.schedule_id
      console.log('scheduleId', scheduleId)
      const response = await axios.put(
        `${API_URL}/schedules/edit/${scheduleId}`,
        payload,
      )
      if (response.status === 200) {
        alert('Berhasil Mengedit Jadwal')
        await dispatch('fetchSchedules')
      }
      // commit('setSchedules', response.data.data)
    } catch (error) {
      console.error('Error editing schedule:', error)
      alert('Gagal Mengedit Jadwal')
    }
  },
  async actionDeleteSchedule({ commit, dispatch }, payload) {
    try {
      const schedule_id = payload.scheduleId

      const response = await axios.delete(
        `${API_URL}/schedules/delete/${schedule_id}`,
      )
      if (response.status === 201) {
        alert('Berhasil Menghapus Jadwal')
      }
      commit('setSchedules', response.data.data)
      await dispatch('fetchSchedules')
    } catch (error) {
      console.error('Error deleting schedule:', error)
      alert('Gagal Menghapus Jadwal')
    }
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
