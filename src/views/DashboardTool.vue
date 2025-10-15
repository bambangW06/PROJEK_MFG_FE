<template>
  <div class="container-fluid">
    <div class="card p-2">
      <div class="card-header">
        <h2 class="text-center">Shift : {{ currenthShift }}</h2>
      </div>
      <div class="row mt-3" style="text-align: center">
        <h3 for="">Reservasi Tool Baru</h3>
        <div class="col-3">
          <div class="row mt-2">
            <h3>Tipe Tool</h3>
            <div class="row">
              <div class="col-6">
                <label for="">Tanggal</label>
                <input
                  class="form-control"
                  type="text"
                  id="toolType"
                  v-model="reservasiDate"
                  disabled
                />
              </div>
            </div>
            <div class="col mt-2">
              <label for="drill">Drill</label>
              <input
                class="form-control"
                type="text"
                id="drill"
                v-model="drill"
                @change="submitData('reservasi')"
              />
              <label for="reamer">Reamer</label>
              <input
                class="form-control"
                type="text"
                id="reamer"
                v-model="reamer"
                @change="submitData('reservasi')"
              />
            </div>
            <div class="col mt-2">
              <label for="tap">Tap</label>
              <input
                class="form-control"
                type="text"
                id="tap"
                v-model="tap"
                @change="submitData('reservasi')"
              />
              <label for="insert">Insert</label>
              <input
                class="form-control"
                type="text"
                id="insert"
                v-model="insert"
                @change="submitData('reservasi')"
              />
            </div>
            <div class="col mt-2">
              <label for="">Endmill</label>
              <input
                class="form-control"
                type="text"
                id="endmill"
                v-model="endmill"
                @change="submitData('reservasi')"
              />
              <label for="">Brush</label>
              <input
                class="form-control"
                type="text"
                id="brush"
                v-model="brush"
                @change="submitData('reservasi')"
              />
            </div>
          </div>
          <!-- row -->
        </div>
        <div class="col-9">
          <div class="card">
            <apexchart
              type="line"
              width="100%"
              height="250"
              :options="lineChartOptions"
              :series="lineChartSeries"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="container-fluid mt-2">
    <div class="card p-2">
      <div class="card-header">
        <h2 class="text-center">Shift : {{ currenthShift }}</h2>
      </div>
      <div class="row mt-2" style="text-align: center">
        <h3 for="regDrill">Regrinding Tool</h3>
        <div class="col-3">
          <h3>Waktu</h3>
          <div class="row">
            <div class="col-6">
              <label for="">Tanggal</label>
              <input
                class="form-control"
                type="text"
                id="toolType"
                v-model="reservasiDate"
                disabled
              />
            </div>
          </div>
          <div class="row mt-2">
            <div class="col">
              <label for="regDrill">Delivery Ke-1</label>
              <input
                class="form-control"
                type="text"
                id="regDrill"
                v-model="delivery1"
                @change="submitData('regrinding')"
              />
              <label for="">Delivery Ke-3</label>
              <input
                class="form-control"
                type="text"
                id="regDrill"
                v-model="delivery3"
                @change="submitData('regrinding')"
              />
            </div>
            <div class="col">
              <label for="regReamer">Delivery Ke-2</label>
              <input
                class="form-control"
                type="text"
                id="regReamer"
                v-model="delivery2"
                @change="submitData('regrinding')"
              />
              <label for="">Delivery Ke-4</label>
              <input
                class="form-control"
                type="text"
                id="regReamer"
                v-model="delivery4"
                @change="submitData('regrinding')"
              />
            </div>
          </div>
        </div>
        <div class="col-9">
          <div class="card">
            <apexchart
              type="line"
              width="100%"
              height="250"
              :options="regLineChartOptions"
              :series="regLineChartSeries"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts'
import 'vue-multiselect/dist/vue-multiselect.css' // Impor CSS file
import moment from 'moment-timezone'
import { mapGetters } from 'vuex'

export default {
  name: 'DashboardTool',
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    const currentMonth = moment().locale('id').format('MMMM YYYY')
    const currentDate = moment().format('DD-MM-YYYY')
    return {
      currenthShift: '',

      drill: null,
      reamer: null,
      tap: null,
      insert: null,
      endmill: null,
      brush: null,
      regDrill: null,
      regReamer: null,
      regTap: null,
      delivery1: null,
      delivery2: null,
      delivery3: null,
      delivery4: null,
      datesInMonth: moment().daysInMonth(),
      reservasiDate: moment().format('DD-MM-YYYY'),
      lineChartOptions: {
        chart: {
          type: 'line',
          height: 350,
          toolbar: {
            show: false,
          },
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800,
            animateGradually: {
              enabled: true,
              delay: 150,
            },
            dynamicAnimation: {
              enabled: true,
              speed: 350,
            },
          },
        },
        title: {
          text: `Reservasi Bulan : ${currentMonth}`,
          align: 'center',
          style: {
            fontSize: '15px',
            fontWeight: 'bold',
            color: '#263238',
          },
        },
        markers: {
          size: 5,
          colors: ['#FF5733', '#33FF57', '#3357FF', '#FF33A1'],
          strokeColors: '#fff',
          strokeWidth: 2,
          shape: 'circle',
          hover: {
            sizeOffset: 3,
          },
        },
        dataLabels: {
          enabled: true, // Aktifkan data labels
          formatter: function (val) {
            return val // Format nilai yang akan ditampilkan
          },
        },
        xaxis: {
          categories: [], // Dates from 1 to 31
          title: {
            text: 'Tanggal',
          },
          axisBorder: {
            show: true,
            color: '#78909C',
            height: 1,
            width: '100%',
            offsetX: 0,
            offsetY: 0,
          },
          axisTicks: {
            show: true,
            borderType: 'solid',
            color: '#78909C',
            height: 6,
            offsetX: 0,
            offsetY: 0,
          },
        },
        yaxis: {
          title: {
            text: 'Total Reservasi',
          },
          axisBorder: {
            show: true,
            color: '#78909C',
          },
          axisTicks: {
            show: true,
            borderType: 'solid',
            color: '#78909C',
            width: 6,
            offsetX: 0,
            offsetY: 0,
          },
        },
        grid: {
          show: true,
          borderColor: '#f1f1f1',
        },
        colors: ['#FF5733', '#33FF57', '#3357FF', '#FF33A1'],
        tooltip: {
          enabled: true,
          theme: 'dark',
        },
        legend: {
          show: true,
          position: 'top',
          horizontalAlign: 'right',
          labels: {
            useSeriesColors: true,
          },
        },
      },
      lineChartSeries: [
        { name: 'Shift Red', data: [] }, // Series untuk Shift Red
        { name: 'Shift White', data: [] }, // Series untuk Shift White
      ],
      regLineChartOptions: {
        chart: {
          type: 'line',
          height: 350,
          toolbar: {
            show: false,
          },
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800,
            animateGradually: {
              enabled: true,
              delay: 150,
            },
            dynamicAnimation: {
              enabled: true,
              speed: 350,
            },
          },
        },
        title: {
          text: `Regrinding Tanggal : ${currentDate}`,
          align: 'center',
          style: {
            fontSize: '15px',
            fontWeight: 'bold',
            color: '#263238',
          },
        },
        markers: {
          size: 5,
          colors: ['#FF5733', '#33FF57', '#3357FF', '#FF33A1'],
          strokeColors: '#fff',
          strokeWidth: 2,
          shape: 'circle',
          hover: {
            sizeOffset: 3,
          },
        },
        dataLabels: {
          enabled: true, // Aktifkan data labels
          formatter: function (val) {
            return val // Format nilai yang akan ditampilkan
          },
        },
        xaxis: {
          categories: [], // Dates from 1 to 31
          title: {
            text: 'Tanggal',
          },
          axisBorder: {
            show: true,
            color: '#78909C',
            height: 1,
            width: '100%',
            offsetX: 0,
            offsetY: 0,
          },
          axisTicks: {
            show: true,
            borderType: 'solid',
            color: '#78909C',
            height: 6,
            offsetX: 0,
            offsetY: 0,
          },
        },
        yaxis: {
          title: {
            text: 'Total Regrinding',
          },
          axisBorder: {
            show: true,
            color: '#78909C',
          },
          axisTicks: {
            show: true,
            borderType: 'solid',
            color: '#78909C',
            width: 6,
            offsetX: 0,
            offsetY: 0,
          },
        },
        grid: {
          show: true,
          borderColor: '#f1f1f1',
        },
        colors: ['#FF5733', '#33FF57', '#3357FF', '#FF33A1'],
        tooltip: {
          enabled: true,
          theme: 'dark',
        },
        legend: {
          show: true,
          position: 'top',
          horizontalAlign: 'right',
          labels: {
            useSeriesColors: true,
          },
        },
      },
      regLineChartSeries: [
        { name: 'Shift Red', data: [] }, // Initialize correctly
        { name: 'Shift White', data: [] }, // Initialize correctly
      ],
    }
  },
  computed: {
    ...mapGetters([
      'getReservasi',
      'getGrafikReservasi',
      'getRegrinding',
      'getGrafikRegrinding',
      'getCurrentShift',
    ]),
  },
  watch: {
    getCurrentShift(newShift, oldShift) {
      if (newShift !== oldShift) {
        this.currenthShift = newShift
        this.resetForm() // Reset form untuk shift baru
        this.$store.dispatch('ActionGetReservasi', newShift)
        this.$store.dispatch('ActionGetRegrinding', newShift)
      }
    },

    getReservasi: {
      handler(newVal) {
        if (newVal) {
          const today = moment().format('YYYY-MM-DD')
          const shift = this.getCurrentShift
          // console.log('shift', shift)
          const reservasiDate = moment(newVal.reservasi_dt).format('YYYY-MM-DD')
          // console.log('reservasiDate', reservasiDate)

          if (reservasiDate === today && shift === newVal.shift) {
            this.drill = newVal.drill || ''
            this.reamer = newVal.reamer || ''
            this.tap = newVal.tap || ''
            this.insert = newVal.insert || ''
            this.endmill = newVal.endmill || ''
            this.brush = newVal.brush || ''
          }
          // console.log('newVal', newVal)
        }
      },
      immediate: true,
      deep: true,
    },

    getRegrinding: {
      handler(newVal) {
        if (newVal) {
          const today = moment().format('YYYY-MM-DD')
          const shift = this.getCurrentShift
          const regDate = moment(newVal.reg_dt).format('YYYY-MM-DD')

          // console.log('regDate', regDate)

          if (regDate === today && shift === newVal.shift) {
            this.delivery1 = newVal.delivery1 || ''
            this.delivery2 = newVal.delivery2 || ''
            this.delivery3 = newVal.delivery3 || ''
            this.delivery4 = newVal.delivery4 || ''
          }
        }
      },
      immediate: true,
      deep: true,
    },
    getGrafikReservasi: {
      handler(newVal) {
        this.updateLineChartSeries()
        if (newVal) {
        }
      },
      immediate: true,
      deep: true,
    },
    getGrafikRegrinding: {
      handler(newVal) {
        this.updateRegLineChartSeries()
        if (newVal) {
        }
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {
    this.updateChartOptions()
    this.$store.dispatch('ambilShift').then(() => {
      this.getShift()
      this.$store
        .dispatch('ActionGetReservasi', this.getCurrentShift)
        .then(() => {
          this.$store.dispatch('ActionGetGrafikReservasi')
        })
      this.$store
        .dispatch('ActionGetRegrinding', this.getCurrentShift)
        .then(() => {
          this.$store.dispatch('ActionGetGrafikRegrinding')
        })
    })
  },
  methods: {
    updateChartOptions() {
      // Perbarui kategori x-axis dengan tanggal
      this.lineChartOptions.xaxis.categories = this.getDatesInMonth()
      this.regLineChartOptions.xaxis.categories = [
        'Delivery 1',
        'Delivery 2',
        'Delivery 3',
        'Delivery 4',
      ]
    },
    // Method to generate dates for current month
    getDatesInMonth() {
      const startDate = moment().startOf('month')
      const endDate = moment().endOf('month')
      const dates = []
      while (startDate.isBefore(endDate) || startDate.isSame(endDate)) {
        dates.push(startDate.format('DD')) // Push dates in 'DD' format
        startDate.add(1, 'days')
      }
      // console.log('dates', dates)
      return dates
    },
    getShift() {
      this.currenthShift = this.getCurrentShift
      // console.log('currenthShift', this.currenthShift)
    },
    async submitData(type) {
      try {
        if (this.currenthShift === null) {
          return alert('Pilih Shift Terlebih Dahulu')
        }
        const reservasiDate = moment().format('YYYY-MM-DD')
        let payload = {}
        let endpoint = ''
        const currenthShift = this.currenthShift
        if (type === 'reservasi') {
          payload = {
            drill: this.drill,
            reamer: this.reamer,
            tap: this.tap,
            insert: this.insert,
            endmill: this.endmill,
            brush: this.brush,
            reservasiDate,
            shift: currenthShift,
          }
          endpoint = 'reservasi/add'
        } else if (type === 'regrinding') {
          payload = {
            delivery1: this.delivery1,
            delivery2: this.delivery2,
            delivery3: this.delivery3,
            delivery4: this.delivery4,
            reservasiDate,
            shift: this.currenthShift,
          }
          endpoint = 'regrinding/add'
        }
        // console.log('payload vue', payload)
        // console.log('endpoint', endpoint)
        // Use axios or fetch to send data to backend
        await this.$store
          .dispatch('ActionSubmitData', { endpoint, payload })
          .then(() => {
            this.$store.dispatch('ActionGetReservasi', currenthShift)
            this.$store.dispatch('ActionGetGrafikReservasi')
            this.$store.dispatch('ActionGetRegrinding', currenthShift)
            this.$store.dispatch('ActionGetGrafikRegrinding')
          })
      } catch (error) {
        console.error('Error submitting data:', error)
      }
    },
    resetForm() {
      // Reset semua input form ketika shift berubah
      this.drill = null
      this.reamer = null
      this.tap = null
      this.insert = null
      this.endmill = null
      this.brush = null
      this.delivery1 = null
      this.delivery2 = null
      this.delivery3 = null
      this.delivery4 = null
    },
    updateLineChartSeries() {
      const data = this.getGrafikReservasi
      // console.log('data', data)

      // Initialize objects to hold the sums for each shift and date
      let shiftRedData = {}
      let shiftWhiteData = {}

      // Iterate over the data to sum values based on shift and date
      data.forEach((item) => {
        const date = moment(item.reservasi_dt).format('DD') // Extract date in 'DD' format
        const shift = item.shift

        if (shift === 'Red') {
          if (!shiftRedData[date]) {
            shiftRedData[date] = {
              drill: 0,
              reamer: 0,
              tap: 0,
              insert: 0,
              endmill: 0,
              brush: 0,
            }
          }
          shiftRedData[date].drill += item.drill || 0
          shiftRedData[date].reamer += item.reamer || 0
          shiftRedData[date].tap += item.tap || 0
          shiftRedData[date].insert += item.insert || 0
          shiftRedData[date].endmill += item.endmill || 0
          shiftRedData[date].brush += item.brush || 0
        } else if (shift === 'White') {
          if (!shiftWhiteData[date]) {
            shiftWhiteData[date] = {
              drill: 0,
              reamer: 0,
              tap: 0,
              insert: 0,
              endmill: 0,
              brush: 0,
            }
          }
          shiftWhiteData[date].drill += item.drill || 0
          shiftWhiteData[date].reamer += item.reamer || 0
          shiftWhiteData[date].tap += item.tap || 0
          shiftWhiteData[date].insert += item.insert || 0
          shiftWhiteData[date].endmill += item.endmill || 0
          shiftWhiteData[date].brush += item.brush || 0
        }
      })

      // Convert the summed data into series format for ApexCharts
      const dates = this.getDatesInMonth() // Get all dates in the current month

      // Initialize arrays to hold series data
      let shiftRedSeries = []
      let shiftWhiteSeries = []

      // Map dates to the corresponding data sums
      dates.forEach((date) => {
        const redData = shiftRedData[date] || {
          drill: 0,
          reamer: 0,
          tap: 0,
          insert: 0,
          endmill: 0,
          brush: 0,
        }
        const whiteData = shiftWhiteData[date] || {
          drill: 0,
          reamer: 0,
          tap: 0,
          insert: 0,
          endmill: 0,
          brush: 0,
        }

        shiftRedSeries.push(
          redData.drill +
            redData.reamer +
            redData.tap +
            redData.insert +
            redData.endmill +
            redData.brush,
        )
        shiftWhiteSeries.push(
          whiteData.drill +
            whiteData.reamer +
            whiteData.tap +
            whiteData.insert +
            whiteData.endmill +
            whiteData.brush,
        )
      })

      // Update the series for the chart
      this.lineChartSeries = [
        { name: 'Shift Red', data: shiftRedSeries },
        { name: 'Shift White', data: shiftWhiteSeries },
      ]
    },
    updateRegLineChartSeries() {
      const data = this.getGrafikRegrinding
      // console.log('data', data)

      // Initialize arrays to hold series data
      let shiftRedSeries = [0, 0, 0, 0] // [Delivery 1, Delivery 2, Delivery 3, Delivery 4]
      let shiftWhiteSeries = [0, 0, 0, 0] // [Delivery 1, Delivery 2, Delivery 3, Delivery 4]

      // Iterate over the data to sum values based on shift and delivery
      data.forEach((item) => {
        const shift = item.shift

        if (shift === 'Red') {
          shiftRedSeries[0] += item.delivery1 || 0
          shiftRedSeries[1] += item.delivery2 || 0
          shiftRedSeries[2] += item.delivery3 || 0
          shiftRedSeries[3] += item.delivery4 || 0
        } else if (shift === 'White') {
          shiftWhiteSeries[0] += item.delivery1 || 0
          shiftWhiteSeries[1] += item.delivery2 || 0
          shiftWhiteSeries[2] += item.delivery3 || 0
          shiftWhiteSeries[3] += item.delivery4 || 0
        }
      })

      // Update the series for the chart
      this.regLineChartSeries = [
        { name: 'Shift Red', data: shiftRedSeries },
        { name: 'Shift White', data: shiftWhiteSeries },
      ]

      // console.log('regLineChartSeries', this.regLineChartSeries)
    },
  },
}
</script>

<style>
.form-control {
  margin-bottom: 2px;
}
</style>
