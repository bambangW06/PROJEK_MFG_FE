<template>
  <div class="container-fluid p-3">
    <!-- Header -->
    <div class="card p-3 mb-3 shadow-sm">
      <h4 class="m-0 fw-bold">History Chemical Management</h4>
    </div>

    <!-- Tabs -->
    <ul class="nav nav-tabs mb-3">
      <li class="nav-item">
        <button
          class="nav-link"
          :class="{ active: activeTab === 'usage' }"
          @click="activeTab = 'usage'"
        >
          Usage History
        </button>
      </li>
      <li class="nav-item">
        <button
          class="nav-link"
          :class="{ active: activeTab === 'param' }"
          @click="activeTab = 'param'"
        >
          Parameter Check
        </button>
      </li>
    </ul>

    <div class="tab-content">
      <!-- Usage Tab -->
      <div v-if="activeTab === 'usage'">
        <!-- Filter Card -->
        <div class="card p-3 mb-3 shadow-sm">
          <div class="row d-flex flex-wrap gap-3 mb-3 align-items-end">
            <!-- Line -->
            <div class="col filter-group flex-grow-1">
              <label class="form-label fw-semibold mb-1">Line</label>
              <v-select
                :options="getLineNames"
                v-model="selectedLineUsage"
                label="line_nm"
                placeholder="Pilih Line"
                @input="onLineChange"
                class="w-100"
                :append-to-body="true"
              />
            </div>

            <!-- Machine -->
            <div class="col filter-group flex-grow-1">
              <label class="form-label fw-semibold mb-1">Machine</label>
              <v-select
                :options="machineOptionsUsage"
                v-model="selectedMachineUsage"
                label="machine_nm"
                :disabled="!selectedLineUsage"
                placeholder="Pilih Machine"
                class="w-100"
                :append-to-body="true"
              />
            </div>

            <div class="col filter-group flex-grow-1">
              <label class="form-label fw-semibold mb-1">Tanggal</label>
              <flat-pickr
                v-model="dateRange"
                class="form-control w-100"
                :config="flatpickrConfig"
              />
            </div>
          </div>
        </div>

        <!-- Card Chart + Table -->
        <div class="card p-3 shadow-sm mb-3">
          <!-- Chart -->
          <div class="mb-3">
            <apexchart
              type="bar"
              height="350"
              :options="usageChartOptions"
              :series="usageChartSeries"
            />
            <div v-if="!selectedMachineUsage" class="text-center fw-semibold">
              Total by Type:
              <span v-for="(d, i) in usageChartSeries[0]?.data || []" :key="i">
                {{ usageChartOptions.xaxis.categories[i] }}: {{ d }} L
                <span v-if="i < usageChartSeries[0].data.length - 1">|</span>
              </span>
            </div>
          </div>

          <!-- Table -->
          <h6 class="fw-bold">Detail Usage</h6>
          <div class="table-responsive text-center">
            <table class="table table-bordered table-sm">
              <thead class="table-light">
                <tr>
                  <th>No</th>
                  <th>Date</th>
                  <th>Machine</th>
                  <th>Chemical</th>
                  <th>Usage (L)</th>
                </tr>
              </thead>
              <tbody v-if="GET_HISTORY_CHEMICAL.length > 0">
                <tr
                  v-for="(data, index) in paginatedUsage"
                  :key="data.usage_id"
                >
                  <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                  <td>{{ data.created_dt }}</td>
                  <td>{{ data.machine_nm }}</td>
                  <td>{{ data.oil_nm }}</td>
                  <td>{{ data.oil_volume }} L</td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td colspan="5">No Data</td>
                </tr>
              </tbody>
            </table>
            <div class="d-flex justify-content-between align-items-center mt-2">
              <!-- Tombol Prev / Next -->
              <div>
                <button
                  class="btn btn-sm btn-primary me-2"
                  :disabled="currentPage === 1"
                  @click="currentPage--"
                >
                  Prev
                </button>
                <button
                  class="btn btn-sm btn-primary"
                  :disabled="currentPage === totalPages"
                  @click="currentPage++"
                >
                  Next
                </button>
              </div>

              <!-- Info halaman + row per page -->
              <div class="d-flex align-items-center">
                <span>Page {{ currentPage }} of {{ totalPages }}</span>

                <!-- Dropdown row per page -->
                <select
                  v-model.number="itemsPerPage"
                  class="form-select form-select-sm w-auto ms-2"
                >
                  <option :value="5">5</option>
                  <option :value="10">10</option>
                  <option :value="25">25</option>
                  <option :value="50">50</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Parameter Tab -->
      <div v-if="activeTab === 'param'">
        <!-- Filter Card -->
        <div class="card p-3 mb-3 shadow-sm">
          <div class="row d-flex flex-wrap gap-3 mb-3 align-items-end">
            <div class="col filter-group flex-grow-1">
              <label class="form-label fw-semibold mb-1">Line</label>
              <v-select
                :options="getLineNames"
                v-model="selectedLineParam"
                label="line_nm"
                placeholder="Pilih Line"
                @input="onLineChange"
                class="w-100"
                :append-to-body="true"
              />
            </div>

            <div class="col filter-group flex-grow-1">
              <label class="form-label fw-semibold mb-1">Machine</label>
              <v-select
                :options="machineOptionsParam"
                v-model="selectedMachineParam"
                label="machine_nm"
                :disabled="!selectedLineParam"
                placeholder="Pilih Machine"
                class="w-100"
                :append-to-body="true"
              />
            </div>

            <div class="col filter-group flex-grow-1">
              <label class="form-label fw-semibold mb-1">Tanggal</label>
              <flat-pickr
                v-model="dateRange"
                class="form-control w-100"
                :config="flatpickrConfig"
              />
            </div>
          </div>
        </div>

        <!-- Card Chart + Table -->
        <div class="card p-3 shadow-sm mb-3">
          <div class="mb-3">
            <apexchart
              type="line"
              height="350"
              :options="paramChartOptions"
              :series="paramChartSeries"
            />
          </div>

          <h6 class="fw-bold">Detail Parameters</h6>
          <div class="table-responsive text-center">
            <table class="table table-bordered table-sm">
              <thead class="table-light">
                <tr>
                  <th>No</th>
                  <th>Shift</th>
                  <th>Date</th>
                  <th>Machine</th>
                  <th>Visual</th>
                  <th>Aroma</th>
                  <th>Sludge</th>
                  <th>Concentration (%)</th>
                  <th>pH</th>
                  <th>Status</th>
                  <th>PIC Check</th>
                </tr>
              </thead>
              <tbody v-if="GET_HISTORY_CHEMICAL.length > 0">
                <tr v-for="(data, index) in paginatedParam" :key="index">
                  <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                  <td>{{ data.shift }}</td>
                  <td>{{ data.created_dt }}</td>
                  <td>{{ data.machine_nm }}</td>
                  <td>{{ data.visual_nm }}</td>
                  <td>{{ data.aroma_nm }}</td>
                  <td>{{ data.sludge_nm }}</td>
                  <td>{{ data.cons_val }}</td>
                  <td>{{ data.ph_val }}</td>
                  <td>{{ data.judge_sts }}</td>
                  <td>{{ data.pic_check }}</td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td colspan="11" class="text-center">No Data</td>
                </tr>
              </tbody>
            </table>
            <div class="d-flex justify-content-between align-items-center mt-2">
              <!-- Tombol Prev / Next -->
              <div>
                <button
                  class="btn btn-sm btn-primary me-2"
                  :disabled="currentPage === 1"
                  @click="currentPage--"
                >
                  Prev
                </button>
                <button
                  class="btn btn-sm btn-primary"
                  :disabled="currentPage === totalPages"
                  @click="currentPage++"
                >
                  Next
                </button>
              </div>

              <!-- Info halaman + row per page -->
              <div class="d-flex align-items-center">
                <span>Page {{ currentPage }} of {{ totalPages }}</span>

                <!-- Dropdown row per page -->
                <select
                  v-model.number="itemsPerPage"
                  class="form-select form-select-sm w-auto ms-2"
                >
                  <option :value="5">5</option>
                  <option :value="10">10</option>
                  <option :value="25">25</option>
                  <option :value="50">50</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts'
import { mapGetters } from 'vuex'
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import FlatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import {
  ACTION_GET_HISTORY_CHEMICAL,
  GET_HISTORY_CHEMICAL,
} from '@/store/Chemical/HistoryPemakaian.module'

export default {
  name: 'HistoryChemical',
  components: { apexchart: VueApexCharts, Datepicker, FlatPickr },
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 10,
      activeTab: 'usage',
      dateRange: [],
      flatpickrConfig: {
        mode: 'range',
        dateFormat: 'Y-m-d',
        allowInput: true,
      },
      machineOptionsUsage: [],
      machineOptionsParam: [],
      selectedLineUsage: null,
      selectedMachineUsage: null,
      selectedMonthUsage: null,

      selectedLineParam: null,
      selectedMachineParam: null,
      selectedMonthParam: null,

      usageData: [],
      paramData: [],

      // Chart Usage
      usageChartOptions: { chart: { id: 'usage' }, xaxis: { categories: [] } },
      usageChartSeries: [{ name: 'Usage (L)', data: [] }],

      // Chart Param
      paramChartOptions: {
        chart: {
          id: 'param',
          type: 'line',
          zoom: { enabled: false },
          toolbar: { show: true },
        },
        stroke: { curve: 'smooth', width: 3 },
        markers: {
          size: 5, // ukuran titik
          shape: 'circle', // circle, square, diamond, triangle
          colors: ['#FF4560', '#008FFB'], // bisa beda warna tiap series
          strokeColors: '#fff', // warna border titik
          strokeWidth: 2,
        },
        xaxis: { categories: [], title: { text: 'Tanggal Check' } },
        yaxis: { title: { text: 'Nilai Parameter' } },
        tooltip: {
          shared: true,
          intersect: false,
          custom: ({ series, seriesIndex, dataPointIndex, w }) => {
            const point =
              w.globals.initialSeries[seriesIndex].data[dataPointIndex]
            if (!point) return ''
            return `
              <div class="p-2">
                <strong>${point.created_dt}</strong><br/>
                pH: ${point.ph_val}<br/>
                Cons: ${point.cons_val}<br/>
                Shift: ${point.shift}<br/>
                PIC: ${point.pic_check}
              </div>
            `
          },
        },
        legend: { position: 'top' },
      },
      paramChartSeries: [],
    }
  },

  computed: {
    ...mapGetters(['getLineNames', 'getMachinesNames', 'GET_HISTORY_CHEMICAL']),
    paginatedUsage() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.GET_HISTORY_CHEMICAL.slice(start, end)
    },

    paginatedParam() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.GET_HISTORY_CHEMICAL.slice(start, end)
    },

    totalPages() {
      return (
        Math.ceil(this.GET_HISTORY_CHEMICAL.length / this.itemsPerPage) || 1
      )
    },
  },

  watch: {
    // ⬇️ Grafik Usage
    GET_HISTORY_CHEMICAL: {
      immediate: true,
      handler(val) {
        if (!val || val.length === 0) {
          this.usageChartOptions = {
            ...this.usageChartOptions,
            xaxis: { categories: [] },
          }
          this.usageChartSeries = []
          this.paramChartSeries = []
          return
        }

        // --- Kondisi untuk TAB USAGE ---
        if (this.activeTab === 'usage') {
          if (!this.selectedMachineUsage) {
            // Total per oil_nm
            const totalsByOil = {}
            val.forEach((item) => {
              const oil = item.oil_nm
              const vol = parseFloat(item.oil_volume) || 0
              totalsByOil[oil] = (totalsByOil[oil] || 0) + vol
            })

            const sorted = Object.entries(totalsByOil)
              .map(([oil_nm, total]) => ({ oil_nm, total }))
              .sort((a, b) => b.total - a.total)

            this.usageChartOptions = {
              ...this.usageChartOptions,
              xaxis: { categories: sorted.map((d) => d.oil_nm) },
              title: { text: 'Total Usage per Chemical Type', align: 'center' },
            }

            this.usageChartSeries = [
              { name: 'Total Usage (L)', data: sorted.map((d) => d.total) },
            ]
          } else {
            // per tanggal per oil_nm
            const grouped = {}
            val.forEach((item) => {
              const date = item.created_dt.split(' ')[0]
              const oil = item.oil_nm
              const vol = parseFloat(item.oil_volume) || 0
              if (!grouped[oil]) grouped[oil] = {}
              grouped[oil][date] = (grouped[oil][date] || 0) + vol
            })

            const allDates = [
              ...new Set(val.map((d) => d.created_dt.split(' ')[0])),
            ].sort()
            const series = Object.keys(grouped).map((oil) => ({
              name: oil,
              data: allDates.map((dt) => grouped[oil][dt] || 0),
            }))

            this.usageChartOptions = {
              ...this.usageChartOptions,
              xaxis: { categories: allDates },
              title: {
                text: `Daily Usage per Chemical (${this.selectedMachineUsage.machine_nm})`,
                align: 'center',
              },
            }

            this.usageChartSeries = series
          }
        }

        // --- Kondisi untuk TAB PARAM ---
        if (this.activeTab === 'param') {
          this.setParameterChart(val)
        }
      },
    },

    getLineNames: {
      immediate: true,
      handler(newVal) {
        if (newVal && newVal.length > 0) {
          const defaultLine = newVal.find((l) => l.line_nm === 'Cylinder Head')
          if (defaultLine) {
            if (!this.selectedLineUsage) this.selectedLineUsage = defaultLine
            if (!this.selectedLineParam) this.selectedLineParam = defaultLine
          }
        }
      },
    },

    async selectedLineUsage(newVal) {
      if (newVal) {
        this.selectedMachineUsage = null
        await this.onLineChange(newVal, 'usage')
        await this.fetchHistoryData()
      }
    },

    async selectedLineParam(newVal) {
      if (newVal) {
        this.selectedMachineParam = null
        await this.onLineChange(newVal, 'param')
        await this.fetchHistoryData()
      }
    },

    activeTab(newVal, oldVal) {
      if (newVal !== oldVal) {
        if (newVal === 'usage') this.selectedMachineUsage = null
        this.currentPage = 1
        this.fetchHistoryData()
      }
    },

    dateRange(oldVal, newVal) {
      if (oldVal !== newVal) this.fetchHistoryData()
    },
    selectedMachineUsage(newVal) {
      if (newVal) this.fetchHistoryData()
    },
    selectedMachineParam(newVal) {
      if (newVal) this.fetchHistoryData()
    },
  },

  methods: {
    async fetchHistoryData() {
      try {
        if (!this.dateRange?.length) return
        let [start, end] = this.dateRange.split(' to ')
        let payload = {
          start,
          end,
          line_id:
            this.activeTab === 'usage'
              ? this.selectedLineUsage?.line_id
              : this.selectedLineParam?.line_id,
          table: this.activeTab,
        }

        if (this.activeTab === 'usage' && this.selectedMachineUsage?.machine_id)
          payload.machine_id = this.selectedMachineUsage.machine_id
        if (this.activeTab === 'param' && this.selectedMachineParam?.machine_id)
          payload.machine_id = this.selectedMachineParam.machine_id

        const response = await this.$store.dispatch(
          ACTION_GET_HISTORY_CHEMICAL,
          payload,
        )

        if (response.status === 200) {
          console.log('response', response)

          if (this.activeTab === 'param') {
            const { data, std_data } = response.data
            // console.log('response:', response.data) // ✅ untuk verifikasi

            // Simpan data utama seperti biasa (ke Vuex)
            // this.GET_HISTORY_CHEMICAL sudah di-handle oleh Vuex mutation

            // Kalau tab sekarang PARAMETER, set grafik dengan standar
            if (this.activeTab === 'param') {
              this.setParameterChart(data, std_data)
            }
          }
        }
      } catch (error) {
        console.error(error)
      }
    },

    setParameterChart(data, std = {}) {
      if (!data?.length) {
        this.paramChartSeries = []
        this.paramChartOptions.xaxis.categories = []
        return
      }

      const sorted = [...data].sort(
        (a, b) => new Date(a.created_dt) - new Date(b.created_dt),
      )

      const categories = sorted.map((d) =>
        new Date(d.created_dt).toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'short',
        }),
      )

      // Series actual value
      const phSeries = sorted.map((d) => ({
        x: d.created_dt,
        y: d.ph_val,
        ...d,
      }))
      const consSeries = sorted.map((d) => ({
        x: d.created_dt,
        y: d.cons_val,
        ...d,
      }))

      // 🔥 Ambil nilai standar
      const std_max_cons = parseFloat(
        std.std_max_cons ?? sorted[0]?.std_max_cons ?? 6,
      )
      const std_min_cons = parseFloat(
        std.std_min_cons ?? sorted[0]?.std_min_cons ?? 3,
      )
      const std_ph_max = parseFloat(
        std.std_ph_max ?? sorted[0]?.std_ph_max ?? 9,
      )
      const std_ph_min = parseFloat(
        std.std_ph_min ?? sorted[0]?.std_ph_min ?? 7,
      )

      console.log('STD dari backend:', {
        std_max_cons,
        std_min_cons,
        std_ph_max,
        std_ph_min,
      })

      // Hitung yaxis min/max
      const yMin = Math.min(
        std_min_cons,
        std_ph_min,
        ...phSeries.map((p) => p.y),
        ...consSeries.map((c) => c.y),
      )
      const yMax = Math.max(
        std_max_cons,
        std_ph_max,
        ...phSeries.map((p) => p.y),
        ...consSeries.map((c) => c.y),
      )

      // 💬 bikin helper biar rapi
      const fmt = (val) => `${val}${val > 10 ? '' : '%'}` // misal <10 pakai %, opsional

      // Set chart options dengan annotation
      this.paramChartOptions = {
        ...this.paramChartOptions,
        xaxis: { categories },
        yaxis: {
          min: yMin,
          max: yMax,
          title: { text: 'Nilai Parameter' },
        },
        title: {
          text: `Trend Parameter (${
            this.selectedMachineParam?.machine_nm || ''
          })`,
          align: 'center',
        },
        annotations: {
          yaxis: [
            {
              y: std_max_cons,
              borderColor: '#FF0000',
              label: {
                text: `Max Cons: ${fmt(std_max_cons)}`,
                style: { color: '#fff', background: '#FF4560' },
              },
            },
            {
              y: std_min_cons,
              borderColor: '#FEB019',
              label: {
                text: `Min Cons: ${fmt(std_min_cons)}`,
                style: { color: '#fff', background: '#00E396' },
              },
            },
            {
              y: std_ph_max,
              borderColor: '#FF0000',
              label: {
                text: `Max pH: ${fmt(std_ph_max)}`,
                style: { color: '#fff', background: '#775DD0' },
              },
            },
            {
              y: std_ph_min,
              borderColor: '#FEB019',
              label: {
                text: `Min pH: ${fmt(std_ph_min)}`,
                style: { color: '#fff', background: '#FEB019' },
              },
            },
          ],
        },
      }

      // Set series
      this.paramChartSeries = [
        { name: 'pH', data: phSeries },
        { name: 'Concentration', data: consSeries },
      ]
    },

    async onLineChange(line, type) {
      try {
        const response = await this.$store.dispatch(
          'fetchMachines',
          line.line_id,
        )
        if (response.status === 200) {
          if (type === 'usage') {
            this.machineOptionsUsage = this.getMachinesNames
          } else if (type === 'param') {
            this.machineOptionsParam = this.getMachinesNames
            if (
              this.machineOptionsParam.length > 0 &&
              !this.selectedMachineParam
            )
              this.selectedMachineParam = this.machineOptionsParam[0]
          }
        }
      } catch (err) {
        console.error(err)
      }
    },
  },

  async mounted() {
    const today = new Date()
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    const formatDate = (d) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
        d.getDate(),
      ).padStart(2, '0')}`

    this.dateRange = [formatDate(firstDay), formatDate(lastDay)]
    await this.$store.dispatch('fetchLines')

    if (this.selectedLineUsage)
      await this.onLineChange(this.selectedLineUsage, 'usage')
    if (this.selectedLineParam) {
      await this.onLineChange(this.selectedLineParam, 'param')
      if (this.machineOptionsParam.length > 0 && !this.selectedMachineParam)
        this.selectedMachineParam = this.machineOptionsParam[0]
    }

    await this.fetchHistoryData()
  },
}
</script>
<style scoped>
/* Samakan tinggi dan padding biar flatpickr & v-select sejajar */
.vs__dropdown-toggle,
.form-control {
  height: 40px !important;
  min-height: 40px !important;
  padding: 6px 10px !important;
  font-size: 14px;
  box-sizing: border-box;
}

/* Biar dropdown ga ketutup */
.card,
.row,
.filter-group {
  overflow: visible !important;
  position: relative;
}

.flatpickr-input,
.flatpickr-wrapper .form-control {
  margin-bottom: 11px !important; /* naikin dikit biar sejajar */
  vertical-align: middle !important;
}
</style>
