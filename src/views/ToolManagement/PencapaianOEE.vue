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
        colors: ['#FF5733', '#33FF57', '#3357FF', '#FFC300'],
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
    selectedDate(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.getOEE()
        this.getProblem()
      }
    },
    selectedShift(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.getOEE()
        this.getProblem()
      }
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
        if (response.status === 200 && this.GET_OEE.length > 0) {
          const data = this.GET_OEE
          // console.log('data', data)

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
      console.log('kepanggil updateOEESeries')

      try {
        // Ambil nilai indikator atau set ke 0 jika tidak ada data
        const oeeValue = this.GET_OEE.length > 0 ? this.oee || 0 : 0
        const peValue = this.GET_OEE.length > 0 ? this.pePercentage || 0 : 0
        const availabilityValue =
          this.GET_OEE.length > 0 ? this.availabilityPercentage || 0 : 0
        const rateQualityValue =
          this.GET_OEE.length > 0 ? this.rqPercentage || 0 : 0

        // Update grafik dengan satu series yang berisi semua data
        this.oeeSeries = [
          {
            name: 'Performance Indicators',
            data: [oeeValue, availabilityValue, peValue, rateQualityValue], // Nilai untuk setiap kategori
          },
        ]

        // Update opsi grafik (hanya didefinisikan satu kali)
        this.oeeOptions = {
          ...this.oeeOptions,
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: '50%',
              endingShape: 'rounded',
              distributed: true, // Untuk memberikan warna yang berbeda pada setiap batang
            },
          },
          colors: ['#FFA500', '#33FF57', '#3357FF', '#FFC300'], // Warna batang
          fill: {
            type: 'gradient',
            gradient: {
              shade: 'light',
              type: 'vertical',
              shadeIntensity: 0.5,
              gradientToColors: ['#FF8C00', '#7CFC00', '#6495ED', '#FFD700'], // Warna gradasi untuk efek 3D
              inverseColors: false,
              opacityFrom: 0.9,
              opacityTo: 0.7,
              stops: [0, 100],
            },
          },
          chart: {
            type: 'bar',
            toolbar: { show: false },
            dropShadow: {
              enabled: true,
              top: 2,
              left: 2,
              blur: 4,
              opacity: 0.3,
            },
          },
          dataLabels: {
            enabled: true,
            formatter: (val, opts) => {
              const categoryNames = ['OEE', 'AV', 'PE', 'RQ']
              const dataIndex = opts.dataPointIndex
              const value = this.oeeSeries[0].data[dataIndex]

              // Format label untuk ditampilkan
              return `${categoryNames[dataIndex]}: ${value.toFixed(2)}%`
            },
            style: {
              colors: ['#000'],
            },
            // offsetY: -20,
            position: 'top',
          },
          xaxis: {
            categories: ['OEE', 'AV', 'PE', 'RQ'],
            axisBorder: { show: true, color: '#000' },
            axisTicks: { show: true, color: '#000' },
          },
          yaxis: {
            title: {
              text: 'Persentase (%)',
            },
            max: 100,
            tickAmount: 2, // Hanya menampilkan 0 dan 100, perlu mengatur ini untuk interval
            labels: {
              formatter: function (val) {
                // Hanya menampilkan 0%, 50%, dan 100%
                if (val === 0) return '0%'
                if (val === 50) return '50%'
                if (val === 100) return '100%'
                return '' // Mengembalikan string kosong untuk nilai lainnya
              },
            },
            axisBorder: { show: true, color: '#000' },
            axisTicks: { show: true, color: '#000' },
          },
          tooltip: {
            y: {
              formatter: function (val) {
                return typeof val === 'number' && !isNaN(val)
                  ? val.toFixed(2) + '%'
                  : 'N/A'
              },
            },
          },
          legend: {
            show: false,
          },
        }

        // Cek apakah warna diterapkan
        console.log('Opsi grafik', this.oeeOptions)
      } catch (error) {
        console.log('error update grafik', error)
      }
    },
    // updateOeeSeries() {
    //   try {
    //     const oeeValue = this.GET_OEE.length > 0 ? this.oee || 0 : 0
    //     const peValue = this.GET_OEE.length > 0 ? this.pePercentage || 0 : 0
    //     const availabilityValue =
    //       this.GET_OEE.length > 0 ? this.availabilityPercentage || 0 : 0
    //     const rateQualityValue =
    //       this.GET_OEE.length > 0 ? this.rqPercentage || 0 : 0

    //     console.log('OEE Value:', oeeValue)
    //     console.log('Availability Value:', availabilityValue)
    //     console.log('Performance Efficiency Value:', peValue)
    //     console.log('Rate Quality Value:', rateQualityValue)

    //     this.oeeSeries = [
    //       {
    //         name: 'Persentase',
    //         data: [oeeValue, availabilityValue, peValue, rateQualityValue],
    //         // Tambahkan warna di sini untuk setiap kategori
    //         color: function ({ value, seriesIndex }) {
    //           const colors = ['#FF5733', '#33FF57', '#3357FF', '#FFC300']
    //           return colors[seriesIndex] // Menggunakan index untuk mengatur warna
    //         },
    //       },
    //     ]

    //     // Tetapkan warna untuk masing-masing kategori
    //     this.oeeOptions = {
    //       ...this.oeeOptions,
    //       chart: {
    //         type: 'bar',
    //         toolbar: {
    //           show: false,
    //         },
    //       },
    //       plotOptions: {
    //         bar: {
    //           horizontal: false,
    //           columnWidth: '40%',
    //           endingShape: 'rounded',
    //           dataLabels: {
    //             position: 'top',
    //           },
    //           barPadding: 5,
    //           groupPadding: 0,
    //         },
    //       },
    //       dataLabels: {
    //         enabled: true,
    //         formatter: function (val) {
    //           return typeof val === 'number' && !isNaN(val)
    //             ? `${val.toFixed(2)}%`
    //             : 'N/A'
    //         },
    //         style: {
    //           colors: ['#000'],
    //         },
    //       },
    //       xaxis: {
    //         categories: [
    //           'OEE',
    //           'Availability',
    //           'Performance Efficiency',
    //           'Rate Quality',
    //         ],
    //       },
    //       yaxis: {
    //         title: {
    //           text: 'Persentase (%)',
    //         },
    //         labels: {
    //           formatter: function (val) {
    //             return typeof val === 'number' && !isNaN(val)
    //               ? val.toFixed(2) + '%'
    //               : 'N/A'
    //           },
    //         },
    //       },
    //       tooltip: {
    //         y: {
    //           formatter: function (val) {
    //             return typeof val === 'number' && !isNaN(val)
    //               ? val.toFixed(2) + '%'
    //               : 'N/A'
    //           },
    //         },
    //       },
    //       colors: ['#FF5733', '#33FF57', '#3357FF', '#FFC300'], // Warna berbeda untuk masing-masing kategori
    //     }

    //     // Pastikan Anda memperbarui grafik setelah mengatur opsi dan seri
    //     this.$refs.chart.updateOptions(this.oeeOptions, true) // Memperbarui opsi grafik
    //     this.$refs.chart.updateSeries(this.oeeSeries, true) // Memperbarui seri data grafik
    //   } catch (error) {
    //     console.log('error update grafik', error)
    //   }
    // },
  },
}
</script>
