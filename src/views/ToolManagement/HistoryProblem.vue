<template>
  <div class="container-fluid">
    <div class="card p-2 mb-2">
      <div class="d-flex justify-content-between align-items-center">
        <h4 class="text-center m-0">History Problem</h4>
        <div class="d-flex align-items-center">
          <span
            ><strong>{{ today }}</strong></span
          >
        </div>
      </div>
    </div>
  </div>

  <div class="container-fluid treeselect-wrapper">
    <div class="card p-2 mb-2">
      <h4>Filter</h4>
      <div class="d-flex flex-column">
        <!-- Baris pertama: Problem dan Month -->
        <div class="d-flex mb-3">
          <div class="me-2" style="width: 200px">
            <label>Problem</label>
            <select
              class="form-select"
              v-model="selectedProblem"
              style="width: 100%"
            >
              <option value="inprocess">In Process</option>
              <option value="nextprocess">Next Process</option>
            </select>
          </div>
          <!-- Input Category hanya muncul jika selectedProblem = 'inprocess' -->
          <div
            v-if="selectedProblem === 'inprocess'"
            class="me-2"
            style="width: 200px"
          >
            <label>Category</label>
            <select v-model="selectedCategory" class="form-select">
              <option
                v-for="category in GET_CATEGORIES"
                :key="category.category_id"
                :value="category"
              >
                {{ category.category_nm }}
              </option>
            </select>
          </div>

          <div style="width: 200px">
            <label>Month</label>
            <input
              class="form-control"
              v-model="selectedMonth"
              type="month"
              style="width: 100%"
            />
          </div>
        </div>

        <!-- Baris kedua: Line, Machine, dan Tool, tampilkan hanya jika selectedProblem = 'nextprocess' -->
        <div v-if="selectedProblem === 'nextprocess'" class="d-flex mb-2">
          <div class="me-2" style="width: 200px">
            <label>Line</label>
            <select
              class="form-select sz-hst"
              v-model="selectedLine"
              @change="onLineChange"
              style="width: 100%"
            >
              <option
                v-for="line in getLineNames"
                :key="line.line_id"
                :value="line"
              >
                {{ line.line_nm }}
              </option>
            </select>
          </div>
          <div class="me-2" style="width: 200px">
            <label>Machine</label>
            <Treeselect
              :key="selectedLine ? selectedLine.line_id : ''"
              v-model="selectedMachine"
              :options="machineOptions"
              placeholder="Select Machine"
              :clearable="true"
              :searchable="true"
              style="width: 100%"
            />
          </div>
          <div style="width: 200px">
            <label>Tool</label>
            <Treeselect
              :key="selectedLine ? selectedLine.line_id : ''"
              v-model="selectedTool"
              :options="toolOptions"
              placeholder="Select Tool"
              :clearable="true"
              :searchable="true"
              style="width: 100%"
            />
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="container-fluid">
    <div class="card p-4 mt-2" ref="tableContainer">
      <div v-if="chartSeries.length > 0" class="card-body">
        <apexchart
          type="bar"
          height="350"
          :options="chartOptions"
          :series="chartSeries"
        ></apexchart>
      </div>
    </div>
  </div>
  <div v-if="isTableVisible" class="container-fluid mt-2">
    <div
      v-if="selectedDayProblems.length > 0"
      ref="detailTable"
      class="card p-2"
    >
      <h4>Detail Problem Tanggal {{ formatSelectedDay(selectedDay) }}</h4>
      <table class="table table-striped table-bordered">
        <thead>
          <tr>
            <th>No</th>
            <th>Tanggal</th>
            <!-- Menampilkan Category hanya jika selectedProblem adalah 'inprocess' -->
            <th v-if="selectedProblem === 'inprocess'">Category</th>
            <th v-if="selectedProblem !== 'inprocess'">Nama Line</th>
            <th v-if="selectedProblem !== 'inprocess'">Nama Mesin</th>
            <th v-if="selectedProblem !== 'inprocess'">Nama Tool</th>
            <th>Waktu</th>
            <th>Problem</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(problem, index) in selectedDayProblems" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ problem.created_dt }}</td>
            <!-- Menampilkan Category hanya jika selectedProblem adalah 'inprocess' -->
            <td v-if="selectedProblem === 'inprocess'">
              {{ problem.category_nm }}
            </td>
            <td v-if="selectedProblem !== 'inprocess'">
              {{ problem.line_nm }}
            </td>
            <td v-if="selectedProblem !== 'inprocess'">
              {{ problem.machine_nm }}
            </td>
            <td v-if="selectedProblem !== 'inprocess'">
              {{ problem.tool_nm }}
            </td>
            <td>{{ problem.time_range }}</td>
            <td>{{ problem.problem_nm }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import {
  ACTION_GET_HISTORY_PROBLEM,
  GET_HISTORY_PROBLEM,
} from '@/store/HistoryProblem.module'
import { mapGetters } from 'vuex'
import VueApexCharts from 'vue3-apexcharts'
import moment from 'moment-timezone'
import {
  ACTION_GET_CATEGORIES,
  ACTION_GET_TOOLS,
  GET_CATEGORIES,
  GET_TOOLS,
} from '@/store/LaporanHarian.module'
import Treeselect from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'

export default {
  name: 'HistoryProblem',
  components: {
    apexchart: VueApexCharts,
    Treeselect,
  },
  data() {
    return {
      selectedDayProblems: [], // Data masalah yang dipilih
      isTableVisible: false, // Flag untuk kontrol visibilitas tabel
      selectedDay: '', // Hari yang dipilih untuk data masalah
      isFirstClick: false, // Flag untuk mendeteksi klik pertama
      isInsideChart: false,
      selectedProblem: 'nextprocess',
      selectedMonth: '',
      chartSeries: [],
      selectedDay: null,
      chartOptions: {
        chart: {
          id: 'bar-chart',
          events: {
            dataPointSelection: (event, chartContext, config) => {
              this.handleBarClick(
                config.seriesIndex, // Series index
                config.dataPointIndex, // Data point index
                event, // The event itself
              )
            },
          },
        },
        xaxis: {
          categories: [],
          title: {
            text: 'Date',
          },
        },
        yaxis: {
          title: {
            text: 'Problem Count',
          },
        },
        title: {
          text: `Problem Bulan : ${this.selectedMonth}`,
          align: 'center',
        },
      },
      selectedLine: null,
      selectedMachine: null,
      machineOptions: [],
      selectedTool: null,
      toolOptions: [],
      selectedCategory: null,
    }
  },
  computed: {
    ...mapGetters([
      GET_HISTORY_PROBLEM,
      'getLineNames',
      'getMachinesNames',
      GET_TOOLS,
      GET_CATEGORIES,
    ]),
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
    GET_HISTORY_PROBLEM: {
      handler() {
        this.prepareChartData()
      },
      immediate: true,
    },
    selectedMonth() {
      this.getProblem()
    },
    selectedProblem() {
      this.getProblem()
    },
    selectedCategory() {
      this.getProblem()
    },
    selectedLine() {
      this.selectedMachine = null
      this.selectedTool = null
      this.getProblem()
    },
    selectedMachine() {
      this.getProblem()
    },
    selectedTool() {
      this.getProblem()
    },
  },
  mounted() {
    this.getProblem()
    this.$store.dispatch('fetchLines')
    this.$store.dispatch(ACTION_GET_CATEGORIES)
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    async onLineChange() {
      console.log('kepanggil')

      try {
        const selectedLine = this.selectedLine.line_id
        // console.log(selectedLine)
        const line_nm = this.selectedLine.line_nm
        await this.$store.dispatch('fetchMachines', selectedLine)

        this.machineOptions = this.getMachinesNames.map((machine) => ({
          id: machine.machine_id,
          label: machine.machine_nm,
        }))

        await this.$store.dispatch(ACTION_GET_TOOLS, line_nm)
        this.toolOptions = this.GET_TOOLS.map((tool) => ({
          id: tool.tool_id,
          label: tool.tool_nm,
        }))
      } catch (error) {
        console.log(error)
      }
    },
    formatSelectedDay(day) {
      // Pastikan day adalah angka dan lebih besar dari 0
      if (!day || day < 1 || day > 31) return '' // Menghindari nilai yang tidak valid

      // Format tanggal dengan menambahkan 0 di depan jika diperlukan
      const formattedDay = day.toString().padStart(2, '0')

      // Misalnya, jika bulan adalah November dan tahun adalah 2024
      const month = '11' // November
      const year = '24' // Tahun 2024

      return `${formattedDay}-${month}-${year}` // Format: 01-11-24
    },
    async getProblem() {
      try {
        const payload = {
          selectedProblem: this.selectedProblem,
          selectedMonth: this.selectedMonth,
        }

        // Log payload to check its contents
        console.log('Payload before dispatch:', payload)

        // Tambahkan kondisi jika selectedProblem adalah 'nextprocess'
        if (this.selectedProblem === 'nextprocess') {
          // Check if selectedLine is not null or undefined
          if (this.selectedLine && this.selectedLine.line_id) {
            payload.selectedLine = this.selectedLine.line_id
          } else {
            console.error('selectedLine is null or undefined')
          }

          // Check if selectedMachine is not null or undefined
          if (this.selectedMachine) {
            payload.selectedMachine = this.selectedMachine
          } else {
            console.error('selectedMachine is null or undefined')
          }

          // Check if selectedTool is not null or undefined
          if (this.selectedTool) {
            payload.selectedTool = this.selectedTool
          } else {
            console.error('selectedTool is null or undefined')
          }
        }
        // Tambahkan kondisi jika selectedProblem adalah 'inprocess' untuk menambahkan selectedCategory
        if (this.selectedProblem === 'inprocess' && this.selectedCategory) {
          payload.selectedCategory = this.selectedCategory.category_id
        }
        // Log the updated payload after conditions
        console.log('Updated Payload after conditions:', payload)

        let response = await this.$store.dispatch(
          ACTION_GET_HISTORY_PROBLEM,
          payload,
        )

        if (response.status === 200 && this.GET_HISTORY_PROBLEM.length > 0) {
          console.log('GET_HISTORY_PROBLEM', this.GET_HISTORY_PROBLEM)
        }
      } catch (error) {
        console.log('Error in getProblem:', error)
        this.$swal({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        })
      }
    },

    prepareChartData() {
      if (!this.selectedMonth) {
        this.selectedMonth = moment().tz('Asia/Jakarta').format('YYYY-MM')
      }

      const daysInMonth = new Date(
        this.selectedMonth.split('-')[0],
        this.selectedMonth.split('-')[1],
        0,
      ).getDate()

      // Initialize a count object with days of the month as keys
      const problemCountByDay = Array.from({ length: daysInMonth }, (_, i) => ({
        day: i + 1,
        count: 0,
      }))

      // Count problems per day based on created_dt
      this.GET_HISTORY_PROBLEM.forEach((problem) => {
        const date = new Date(problem.created_dt)
        const day = date.getDate()

        if (day <= daysInMonth) {
          problemCountByDay[day - 1].count++
        }
      })

      this.chartOptions = {
        chart: {
          type: 'bar',
          events: {
            dataPointSelection: (event, chartContext, config) => {
              const { seriesIndex, dataPointIndex } = config
              this.handleBarClick(seriesIndex, dataPointIndex, event)
            },
            animations: {
              enabled: true,
              easing: 'easeinout',
              speed: 800,
            },
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '80%',
            endingShape: 'rounded',
            colors: {
              ranges: [
                { from: 1, to: Infinity, color: '#ff6347' }, // Merah untuk hari dengan masalah
                { from: 0, to: 0, color: '#0056b3' }, // Biru untuk hari tanpa masalah
              ],
            },
            dataLabels: {
              position: 'top', // Posisikan data labels di atas bar
            },
            tooltip: {
              position: 'top',
            },
          },
        },
        xaxis: {
          categories: problemCountByDay.map((data) => data.day.toString()),
          axisBorder: { show: true, color: '#000' },
          axisTicks: { show: true, color: '#000', height: 6 },
          labels: {
            style: {
              colors: '#333',
              fontSize: '14px',
              fontFamily: 'Arial, sans-serif',
            },
          },
        },
        yaxis: {
          title: {
            text: 'Problem Count',
            style: {
              color: '#333',
              fontSize: '16px',
              fontFamily: 'Arial, sans-serif',
            },
          },
          axisBorder: { show: true, color: '#000' },
          axisTicks: { show: true, color: '#000', height: 6 },
        },
        tooltip: {
          theme: 'dark',
          y: {
            formatter: (val) => `Jumlah Masalah: ${val}`,
          },
          x: {
            formatter: (value) => {
              const date = moment(
                `${this.selectedMonth}-${value}`,
                'YYYY-MM-DD',
              )
              return date.format('DD-MM-YYYY')
            },
          },
          offsetX: 100,
        },

        title: {
          text: `Problem Bulan ${moment(this.selectedMonth).format(
            'MMMM YYYY',
          )}`,
          align: 'center',
          style: {
            fontSize: '24px',
            fontWeight: 'bold',
            fontFamily: 'Arial, sans-serif',
            color: '#333',
          },
        },
        dataLabels: {
          enabled: true,
          offsetY: -17,
          style: {
            fontSize: '14px',
            fontWeight: 'bold',
            colors: ['#000'], // Default warna hitam
          },
        },
      }

      this.chartSeries = [
        {
          name: 'Problems',
          data: problemCountByDay.map((data) => data.count),
        },
      ]
    },
    handleBarClick(seriesIndex, dataPointIndex) {
      // Validasi dataPointIndex
      if (
        dataPointIndex !== undefined &&
        dataPointIndex >= 0 &&
        dataPointIndex < this.chartOptions.xaxis.categories.length
      ) {
        const selectedDay = this.chartOptions.xaxis.categories[dataPointIndex]
        this.selectedDay = selectedDay

        console.log('Clicked on Day: ', selectedDay)

        if (
          !this.selectedDayProblems.length ||
          !this.selectedDayProblems.some(
            (problem) =>
              new Date(problem.created_dt).getDate().toString() ===
              this.selectedDay,
          )
        ) {
          this.selectedDayProblems = this.GET_HISTORY_PROBLEM.filter(
            (problem) => {
              const createdDate = new Date(problem.created_dt)
              return createdDate.getDate().toString() === this.selectedDay
            },
          )
        }

        this.isTableVisible = this.selectedDayProblems.length > 0

        // Pastikan scroll tabel terjadi setelah perubahan state
        this.$nextTick(() => {
          if (this.isTableVisible && this.$refs.detailTable) {
            console.log('Scrolling to table')
            this.$refs.detailTable.scrollIntoView({ behavior: 'smooth' })
          }
        })

        // Flag untuk menandakan bahwa klik berasal dari chart
        this.isInsideChart = true

        if (!this.isFirstClick) {
          this.isFirstClick = true
          console.log('First click triggered')
        }
      }
    },

    handleClickOutside(event) {
      // Pastikan hanya menangani klik di luar jika sudah ada masalah yang dipilih
      if (this.selectedDayProblems.length > 0 && !this.isInsideChart) {
        const tableContainer = this.$refs.tableContainer
        if (tableContainer && !tableContainer.contains(event.target)) {
          console.log('Clicked outside. Resetting problems and hiding table.')
          // Reset data dan sembunyikan tabel
          this.selectedDayProblems = []
          this.isTableVisible = false
          this.isFirstClick = false
        }
      }

      // Reset flag isInsideChart setelah klik selesai
      this.isInsideChart = false
    },
  },
}
</script>

<style>
.table-bordered th {
  background-color: rgb(198, 240, 240);
  border: 1px solid black;
}
.table-bordered td {
  border: 1px solid black;
}
/* Atur posisi relatif pada Treeselect atau elemen yang menampungnya */
.treeselect-wrapper {
  position: relative;
  z-index: 1; /* Pastikan dropdown tetap muncul di atas elemen lainnya */
}
</style>
