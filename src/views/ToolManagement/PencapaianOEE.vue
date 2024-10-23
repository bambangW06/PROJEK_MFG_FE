<template>
  <div class="container-fluid">
    <div class="card p-2 mb-2">
      <div class="d-flex justify-content-between align-items-center">
        <h4 class="text-center m-0">Pencapaian OEE</h4>
        <div class="d-flex align-items-center">
          <span
            ><strong>{{ today }}</strong></span
          >
        </div>
      </div>
    </div>
  </div>
  <div class="container-fluid">
    <div class="card p-2 mb-2">
      <h4>Grafik Pencapaian Regrinding</h4>
      <div class="d-flex justify-content-between align-items-center mb-1">
        <div class="d-flex align-items-center">
          <select
            class="form-select"
            v-model="selectedShift"
            style="max-width: 150px"
          >
            <option value="Siang">Siang</option>
            <option value="Malam">Malam</option>
          </select>
        </div>

        <div>
          <input
            type="date"
            class="form-control"
            style="max-width: 200px"
            v-model="selectedDate"
          />
        </div>
      </div>
      <Apexchart
        type="bar"
        width="100%"
        height="250"
        :options="oeeOptions"
        :series="oeeSeries"
      />
    </div>
  </div>
</template>

<script>
import {
  ACTION_GET_OEE,
  ACTION_GET_PROBLEM_TABLE,
  GET_OEE,
  GET_PROBLEM_IN_PROCESS,
} from '@/store/LaporanHarian.module'
import { mapGetters } from 'vuex'
import Apexchart from 'vue3-apexcharts'

export default {
  name: 'PencapaianOEE',
  components: {
    Apexchart,
  },
  data() {
    return {
      selectedShift: 'Siang',
      selectedDate: '',
      actMp: '',
      jamKerja: '',
      oee: '',
      shift: '',
      oeeSeries: [
        {
          name: 'OEE Result',
          data: [], // Inisialisasi data kosong
        },
      ],
      oeeOptions: {
        chart: {
          type: 'bar',
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '50%',
            endingShape: 'rounded',
          },
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return 'OEE :' + val.toFixed(2) + '%'
          },
          style: {
            colors: ['#000'],
          },
        },
        xaxis: {
          categories: [],
        },
        yaxis: {
          title: {
            text: 'OEE (%)',
          },
          labels: {
            formatter: function (val) {
              return val.toFixed(2) + '%'
            },
          },
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val.toFixed(2) + '%'
            },
          },
        },
      },
    }
  },
  computed: {
    ...mapGetters([GET_PROBLEM_IN_PROCESS, GET_OEE]),
    today() {
      const date = new Date()
      let currentDate = new Date(date)

      let shiftSiangStart = new Date(currentDate)
      shiftSiangStart.setHours(7, 0, 0, 0)

      if (currentDate < shiftSiangStart) {
        currentDate.setDate(currentDate.getDate() - 1)
      }

      return currentDate.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    },
  },
  watch: {
    selectedDate() {
      this.getOEE()
      this.getProblem()
    },
    selectedShift() {
      this.getOEE() // Ambil data OEE setiap kali selectedShift berubah
      this.getProblem()
    },
  },

  mounted() {
    this.setShiftByCurrentTime()
    this.getProblem()
    this.getOEE()
  },
  methods: {
    setShiftByCurrentTime() {
      const now = new Date()
      const currentHour = now.getHours()

      if (currentHour >= 7 && currentHour < 20) {
        this.selectedShift = 'Siang'
      } else {
        this.selectedShift = 'Malam'
      }
    },
    async getProblem() {
      try {
        let response = await this.$store.dispatch(
          ACTION_GET_PROBLEM_TABLE,
          this.selectedDate,
        )
        if (response.status === 200) {
          let data = this.GET_PROBLEM_IN_PROCESS
          if (data) {
            console.log('Received Problem Data:', data)

            // Filter data berdasarkan selectedShift
            if (this.selectedShift === 'Siang') {
              // Filter untuk shift 'Siang', dengan time_range antara jam 7:00 hingga 20:00
              data = data.filter((item) => {
                const time = parseInt(item.time_range.split(':')[0], 10) // Ambil jam dari time_range
                return time >= 7 && time < 20 // Sesuaikan batas waktu shift siang
              })
            } else if (this.selectedShift === 'Malam') {
              // Misalkan filter untuk shift 'Malam', sesuaikan batas waktunya
              data = data.filter((item) => {
                const time = parseInt(item.time_range.split(':')[0], 10)
                return time >= 20 || time < 7 // Sesuaikan batas waktu shift malam
              })
            }

            console.log('Filtered Problem Data:', data)
          }
        }
      } catch (error) {
        console.log('error', error)
      }
    },

    async getOEE() {
      try {
        const payload = {
          date: this.selectedDate,
          shift: this.selectedShift,
        }
        let response = await this.$store.dispatch(ACTION_GET_OEE, payload)
        if (response.status === 200) {
          const data = this.GET_OEE
          if (data) {
            // console.log('Received OEE Data:', data)

            // Update OEE
            this.actMp = data[0].act_mp
            this.jamKerja = data[0].jam_kerja
            this.oee = parseFloat(data[0].oee_rslt) // Pastikan nilai OEE valid
            this.shift = data[0].shift

            // console.log('OEE Value:', this.oee) // Tambahkan log ini
            // console.log('Shift Value:', this.shift) // Tambahkan log ini;

            // Update OEE Series
            this.updateOeeSeries() // Panggil untuk memperbarui grafik
          }
        }
      } catch (error) {
        console.log('error', error)
      }
    },

    updateOeeSeries() {
      // Pastikan nilai `oee` dan `shift` diperbarui dengan benar
      const oeeValue = this.oee || 0 // Pastikan nilai default 0 jika `oee` tidak valid
      const shiftLabel = this.shift || 'Unknown Shift'

      // Mutakhirkan data dan kategori tanpa menggunakan Proxy
      this.oeeSeries = [{ name: 'OEE Result', data: [oeeValue] }]
      this.oeeOptions = {
        ...this.oeeOptions,
        xaxis: {
          ...this.oeeOptions.xaxis,
          categories: [shiftLabel],
        },
      }

      // console.log('Updated OEE Series:', this.oeeSeries)
      // console.log('Updated OEE Options:', this.oeeOptions)
    },
  },
}
</script>
