import axios from 'axios'
const API_URL = process.env.VUE_APP_API_URL
import moment from 'moment-timezone'

const state = {
  posisi: {},
  redShiftEmployees: [],
  whiteShiftEmployees: [],
  actualPosition: [],
}

const getters = {
  getEmployeePosition(state) {
    return state.posisi
  },
  getPositionRedShift(state) {
    return state.redShiftEmployees
  },
  getPositionWhiteShift(state) {
    return state.whiteShiftEmployees
  },
  getActualPosition(state) {
    return state.actualPosition
  },
}

const mutations = {
  setEmployeePosition(state, payload) {
    state.posisi = payload
  },
  setPositionRedShift(state, payload) {
    const redShiftList = payload.map((redShiftEmployees) => {
      // Periksa apakah properti photourl ada sebelum mengaksesnya
      const relativePath = redShiftEmployees.photourl
        ? redShiftEmployees.photourl.replace(/\\/g, '/')
        : null
      const previewUrl = relativePath ? API_URL + relativePath : null
      return {
        ...redShiftEmployees,
        previewUrl: previewUrl,
      }
    })
    state.redShiftEmployees = redShiftList
  },
  setPositionWhiteShift(state, payload) {
    const whiteShiftList = payload.map((whiteShiftEmployees) => {
      const relativePath = whiteShiftEmployees.photourl
        ? whiteShiftEmployees.photourl.replace(/\\/g, '/')
        : null
      const previewUrl = relativePath ? API_URL + relativePath : null
      return {
        ...whiteShiftEmployees,
        previewUrl: previewUrl,
      }
    })
    state.whiteShiftEmployees = whiteShiftList
  },
  setActualPosition(state, payload) {
    state.actualPosition = payload
    // console.log('setActualPosition mutations', state.actualPosition)
  },
}

const actions = {
  async updatePositionEmployee({ commit }, payload) {
    try {
      // console.log('Action updatePositionEmployee payload:', payload)
      const employeData = payload
      // console.log('ini payload di module', payload)
      const response = await axios.post(API_URL + '/position/add', employeData)
      if (response.status === 201) {
        console.log('Posisi karyawan berhasil dikirim')
      }
    } catch (error) {
      console.error(
        'Terjadi kesalahan saat memperbarui posisi karyawan:',
        error.message,
      )
      alert('Gagal memperbarui posisi karyawan')
      // Tambahkan logika lain untuk menangani kesalahan jika diperlukan
    }
  },

  async fetchEmployeeForSelect({ commit }) {
    try {
      const response = await axios.get(`${API_URL}/position/get`)
      const data = response.data

      if (data.message === 'Success to Get Data') {
        const employees = data.data.map((employee) => ({
          ...employee,
          photourl: `${API_URL}${employee.profile}`,
        }))

        // 🔹 Ambil jam saat ini (WIB)
        const currentHour = moment().tz('Asia/Jakarta').hour() // hanya ambil jam (0-23)

        // 🔹 Filter karyawan berdasarkan shift
        let redShiftEmployees = employees.filter(
          (employee) => employee.shift === 'Red',
        )

        let whiteShiftEmployees = employees.filter(
          (employee) => employee.shift === 'White',
        )

        // 🔹 Masukkan karyawan Non Shift ke kedua shift jika jamnya antara 07:00 - 20:00
        if (currentHour >= 7 && currentHour < 20) {
          const nonShiftEmployees = employees.filter(
            (employee) =>
              employee.shift === 'Non Shift' &&
              employee.jabatan === 'Team Member',
          )

          // Tambahkan ke kedua shift
          redShiftEmployees = [...redShiftEmployees, ...nonShiftEmployees]
          whiteShiftEmployees = [...whiteShiftEmployees, ...nonShiftEmployees]
        }
        console.log('redShiftEmployees', redShiftEmployees)
        console.log('whiteShiftEmployees', whiteShiftEmployees)

        // 🔹 Commit hasilnya ke Vuex
        commit('setPositionRedShift', redShiftEmployees)
        commit('setPositionWhiteShift', whiteShiftEmployees)
      } else {
        commit('setPositionRedShift', [])
        commit('setPositionWhiteShift', [])
      }
    } catch (error) {
      console.error('Error fetching employee data:', error)
      commit('setPositionRedShift', [])
      commit('setPositionWhiteShift', [])
    }
  },

  async fetchActualPosition({ commit }) {
    try {
      const response = await axios.get(`${API_URL}/position/position`)
      const data = response.data

      if (data.message === 'Success to Get Data') {
        const employees = data.data
        const employeesWithPhotoUrl = employees.map((employee) => {
          const relativePath = employee.photo
            ? employee.photo.replace(/\\/g, '/')
            : null
          const photourl = relativePath ? `${API_URL}${relativePath}` : null
          // console.log('Employee Photo URL:', photourl) // Tambahkan log ini
          return {
            ...employee,
            photourl: photourl,
          }
        })
        commit('setActualPosition', employeesWithPhotoUrl)
        // console.log('actualPosition di vuex', employeesWithPhotoUrl)
      } else {
        commit('setActualPosition', [])
      }
    } catch (error) {
      console.error('Error fetching employee data:', error)
      commit('setActualPosition', [])
    }
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
