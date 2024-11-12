import axios from 'axios'
import moment from 'moment'

const API_URL = process.env.VUE_APP_API_URL

const state = {
  planKuras: [],
  searchPlanKuras: [],
  generatePlanKuras: [],
  dataSchedules: [],
  dataHistoryKuras: [],
  hasOverdueSchedules: false, // Tambahkan state ini
}

const getters = {
  getPlanKuras: (state) => state.planKuras,
  getSearchPlanKuras: (state) => state.searchPlanKuras,
  getGeneratePlanKuras: (state) => state.generatePlanKuras,
  getDataSchedules: (state) => state.dataSchedules,
  // Gabungkan data dari planKuras dan dataSchedules
  mergedPlanKuras: (state) => {
    const mergedData = state.planKuras.map((plan) => {
      // Periksa jika state.dataSchedules terdefinisi dan merupakan sebuah array
      const correspondingSchedule = Array.isArray(state.dataSchedules)
        ? state.dataSchedules.find(
            (schedule) => schedule.schedule_id === plan.schedule_id,
          )
        : null

      return {
        ...plan,
        shift: correspondingSchedule ? correspondingSchedule.shift : plan.shift,
        reason:
          plan.reason ||
          (correspondingSchedule ? correspondingSchedule.reason_plan : ''),
        actual_dt: correspondingSchedule ? correspondingSchedule.actual_dt : '',
        status: correspondingSchedule ? correspondingSchedule.status : '',
        reason_plan: correspondingSchedule
          ? correspondingSchedule.reason_plan
          : '',
        is_saved: correspondingSchedule
          ? correspondingSchedule.is_saved
          : false,

        // Field lain sesuai kebutuhan
      }
    })

    // Mengurutkan data berdasarkan last_krs atau planingDate
    return mergedData.sort((a, b) => {
      const dateA = moment(a.plan_dt, 'DD-MM-YYYY')
      const dateB = moment(b.plan_dt, 'DD-MM-YYYY')
      return dateA - dateB // Mengurutkan secara ascending
    })
  },
  getDataHistoryKuras: (state) => state.dataHistoryKuras,
  hasOverdueSchedules: (state) => state.hasOverdueSchedules, // Getter ini
}

const mutations = {
  setPlanKuras(state, payload) {
    state.planKuras = payload
  },
  setSearchPlanKuras(state, payload) {
    state.searchPlanKuras = payload
  },
  setGeneratePlanKuras(state, payload) {
    state.generatePlanKuras = payload
  },
  setDataSchedules(state, payload) {
    state.dataSchedules = payload
  },
  updateDataSchedule(state, updatedSchedule) {
    const index = state.dataSchedules.findIndex(
      (schedule) => schedule.schedule_id === updatedSchedule.schedule_id,
    )
    if (index !== -1) {
      state.dataSchedules[index] = updatedSchedule
    } else {
      state.dataSchedules.push(updatedSchedule)
    }
  },
  setDataHistoryKuras(state, payload) {
    state.dataHistoryKuras = payload
  },
  setOverdueSchedules(state, value) {
    state.hasOverdueSchedules = value // Mutation ini
  },
}

const actions = {
  async fetchGeneratePlanKuras({ commit }) {
    try {
      const response = await axios.get(`${API_URL}/planSchedule/get`)
      commit('setGeneratePlanKuras', response.data.data)
      // console.log(response.data.data)
    } catch (error) {
      console.error('Error fetching plan kuras:', error)
    }
  },
  async fetchPlanKuras({ commit }) {
    try {
      const response = await axios.get(`${API_URL}/planMonth/get`)
      commit('setPlanKuras', response.data.data)
      // console.log('setPlanKuras', response.data.data)
    } catch (error) {
      console.error('Error fetching plan kuras:', error)
    }
  },
  async ActionSearchSchedules({ commit }, payload) {
    try {
      const response = await axios.get(`${API_URL}/planMonth/search`, {
        params: {
          machine_nm: payload,
        },
      })
      // console.log(response.data.data)
      if (response.data && response.data.data) {
        if (response.data.data.length === 0) {
          // Jika array kosong, tampilkan pesan alert
          alert('Data Tidak Ada')
        }
      }
      commit('setSearchPlanKuras', response.data.data)
    } catch (error) {
      console.error('Error fetching plan kuras:', error)
    }
  },
  async ActionEditSearchSchedule({ commit, dispatch }, payload) {
    try {
      const scheduleId = payload.schedule_id
      // console.log('scheduleId', scheduleId)
      const response = await axios.put(
        `${API_URL}/planMonth/edit/${scheduleId}`,
        payload,
      )
      if (response.status === 200) {
        alert('Berhasil Mengedit Jadwal')
      }
      commit('updateDataSchedule', response.data.data)
      // await dispatch('fetchPlanKuras')
    } catch (error) {
      console.error('Error editing schedule:', error)
      alert('Gagal Mengedit Jadwal')
    }
  },
  async ActionSaveSchedules({ dispatch }, payload) {
    try {
      const response = await axios.post(
        `${API_URL}/historySchedule/add`,
        payload,
      )
      if (response.status === 201) {
        this.$swal({
          icon: 'success',
          title: 'Berhasil Menyimpan Jadwal',
        })
      }
      await dispatch('fetchSchedules')
    } catch (error) {
      console.error('Error adding schedule:', error)
      alert('Gagal Menyimpan Jadwal')
    }
  },
  async ActionGetHistorySchedules({ commit }, payload) {
    try {
      const response = await axios.get(`${API_URL}/historySchedule/get`, {
        params: {
          machine_nm: payload,
        },
      })
      if (response.data && response.data.data) {
        if (response.data.data.length === 0) {
          // Jika array kosong, tampilkan pesan alert
          // alert('Data Tidak Ada')
        }
      }
      // console.log(response.data.data)
      commit('setDataSchedules', response.data.data)
    } catch (error) {
      console.error('Error fetching plan kuras:', error)
    }
  },
  async ActionHistoryKuras({ commit }, payload) {
    try {
      // console.log('payload module', payload)
      const response = await axios.get(`${API_URL}/historyKuras/get/${payload}`)
      if (response.data && response.data.data) {
        if (response.data.data.length === 0) {
          // Jika array kosong, tampilkan pesan alert
          // alert('Data Tidak Ada')
        }
      }
      console.log(response.data.data)
      commit('setDataHistoryKuras', response.data.data)
    } catch (error) {
      console.error('Error fetching plan kuras:', error)
    }
  },
  async checkScheduleStatus({ commit }) {
    try {
      const response = await axios.get(`${API_URL}/schedule/status`)
      const hasOverdueSchedules = response.data.hasOverdue || false // Sesuaikan dengan struktur respons API
      commit('setOverdueSchedules', hasOverdueSchedules)
    } catch (error) {
      console.error('Error checking schedule status:', error)
    }
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
