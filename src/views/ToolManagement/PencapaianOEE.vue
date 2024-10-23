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
      pePercentage: 0,
      availabilityPercentage: 0,
      oeeSeries: [
        {
          name: 'OEE',
          data: [], // Inisialisasi data kosong untuk OEE
        },
        {
          name: 'PE',
          data: [], // Inisialisasi data kosong untuk PE
        },
        {
          name: 'AV', // Tambahkan Availability di sini
          data: [],
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
            columnWidth: '40%', // Coba nilai lebih rendah untuk memberi ruang
            endingShape: 'rounded',
            dataLabels: {
              position: 'top',
            },
            barPadding: 5, // Tambahkan padding antar bar
            groupPadding: 15, // Jarak antar grup bar
          },
        },
        dataLabels: {
          enabled: true,
          formatter: function (val, opts) {
            if (val === undefined || val === null) return 'N/A' // Check if val is undefined or null

            // If value exists, format it to two decimal places
            if (opts.seriesIndex === 0) {
              return `OEE: ${val.toFixed(2)}%`
            } else if (opts.seriesIndex === 1) {
              return `PE: ${val.toFixed(2)}%`
            } else if (opts.seriesIndex === 2) {
              return `AV: ${val.toFixed(2)}%`
            }
            return `${val.toFixed(2)}%`
          },

          style: {
            colors: ['#000'],
          },
        },
        xaxis: {
          categories: [],
          labels: {
            show: true,
            trim: false, // Mencegah pemangkasan label
            style: {
              fontSize: '12px',
            },
          },
        },
        yaxis: {
          title: {
            text: 'Persentase (%)',
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
      this.getOEE()
      this.getProblem()
    },
  },

  mounted() {
    this.setShiftByCurrentTime()
    this.getOEE()
    this.getProblem()
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
            // Filter sesuai shift
            if (this.selectedShift === 'Siang') {
              data = data.filter((item) => {
                const time = parseInt(item.time_range.split(':')[0], 10)
                return time >= 7 && time < 20
              })
            } else if (this.selectedShift === 'Malam') {
              data = data.filter((item) => {
                const time = parseInt(item.time_range.split(':')[0], 10)
                return time >= 20 || time < 7
              })
            }

            // Dapatkan waktu dari kategori "Availability"
            const availabilityProblem = data.find(
              (item) => item.category_nm === 'Avaibility', // Pastikan ejaan benar
            )
            const availabilityTime = availabilityProblem
              ? parseInt(availabilityProblem.waktu, 10)
              : 0

            // Hitung persentase Availability dengan jumlah mesin
            const jumlahMesin = 2 // Ganti sesuai jumlah mesin yang sebenarnya
            const totalJamKerjaInMinutesForAvailability =
              parseFloat(this.jamKerja) * 60 * jumlahMesin

            this.availabilityPercentage =
              ((totalJamKerjaInMinutesForAvailability - availabilityTime) /
                totalJamKerjaInMinutesForAvailability) *
              100

            // Tambahkan log untuk hasil persentase Availability
            console.log('Availability Percentage:', this.availabilityPercentage)

            // Dapatkan waktu dari kategori "Performance Efficiency"
            const rqProblem = data.find(
              (item) => item.category_nm === 'Rate of Quality',
            )
            const rqTime = rqProblem ? parseInt(rqProblem.waktu, 10) : 0

            // Hitung persentase PE (tanpa jumlah mesin)
            const totalJamKerjaInMinutesForRQ = parseFloat(this.jamKerja) * 60

            this.rqPercentage =
              ((totalJamKerjaInMinutesForRQ - rqTime) /
                totalJamKerjaInMinutesForRQ) *
              100

            // Tambahkan log untuk hasil persentase PE
            console.log('Performance Efficiency Percentage:', this.rqPercentage)

            // Dapatkan waktu dari kategori "Performance Efficiency"
            const peProblem = data.find(
              (item) => item.category_nm === 'Performance Efficiency',
            )
            const peTime = peProblem ? parseInt(peProblem.waktu, 10) : 0

            // Hitung persentase PE (tanpa jumlah mesin)
            const totalJamKerjaInMinutesForPE = parseFloat(this.jamKerja) * 60
            const maxPerformance = this.actMp * totalJamKerjaInMinutesForPE
            this.pePercentage =
              ((maxPerformance - peTime) / maxPerformance) * 100

            this.updateOeeSeries()
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
            this.actMp = parseFloat(data[0].act_mp)
            this.jamKerja = parseFloat(data[0].jam_kerja)
            this.oee = parseFloat(data[0].oee_rslt)
            this.shift = data[0].shift

            // Update data grafik
            this.updateOeeSeries()
          }
        }
      } catch (error) {
        console.log('error', error)
      }
    },

    updateOeeSeries() {
      const oeeValue = this.oee || 0
      const peValue = this.pePercentage || 0
      const availabilityValue = this.availabilityPercentage || 0
      const rateQualityValue = this.rqPercentage || 0 // Tambahkan RQ

      // Update grafik dengan satu series yang berisi semua data
      this.oeeSeries = [
        {
          name: 'Performance Indicators',
          data: [oeeValue, peValue, availabilityValue, rateQualityValue], // Nilai untuk setiap kategori
        },
      ]

      // Update opsi grafik
      this.oeeOptions = {
        ...this.oeeOptions,
        chart: {
          type: 'bar', // Gunakan bar chart
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            horizontal: false, // Atur orientasi bar (vertikal)
            columnWidth: '40%', // Coba nilai lebih rendah untuk memberi ruang
            endingShape: 'rounded',
            dataLabels: {
              position: 'top', // Letakkan label di atas bar
            },
            barPadding: 5, // Tambahkan padding antar bar
            groupPadding: 15, // Jarak antar grup bar
          },
        },
        dataLabels: {
          enabled: true,
          formatter: function (val, opts) {
            if (val === undefined || val === null) return 'N/A' // Cek jika val tidak terdefinisi atau null

            // Ambil kategori berdasarkan indeks yang sama
            const categoryIndex = opts.dataPointIndex // Dapatkan indeks dari dataPoint yang sedang ditampilkan

            // Format label dengan nama kategori
            const categoryLabels = ['OEE', 'PE', 'AV', 'RQ'] // Daftar kategori
            return `${categoryLabels[categoryIndex]}: ${val.toFixed(2)}%` // Ambil label berdasarkan kategori
          },
          style: {
            colors: ['#000'], // Warna teks label
          },
        },
        xaxis: {
          categories: ['OEE', 'PE', 'AV', 'RQ'], // Tambahkan kategori RQ
          labels: {
            show: true,
            style: {
              fontSize: '12px',
            },
          },
        },
        yaxis: {
          title: {
            text: 'Persentase (%)',
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
        colors: ['#FF5733', '#33FF57', '#3357FF', '#FFC300'], // Warna untuk masing-masing kategori
      }
    },
  },
}
</script>
