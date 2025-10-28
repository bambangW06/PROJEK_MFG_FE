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
            <div class="col filter-group flex-grow-1">
              <label class="form-label fw-semibold mb-1">Chemical</label>
              <v-select
                :options="GET_MASTER_OIL"
                v-model="selectedChemical"
                label="oil_nm"
                placeholder="Pilih Chemical"
                class="w-100"
                :append-to-body="true"
              />
            </div>

            <!-- Line -->
            <div class="col filter-group flex-grow-1">
              <label class="form-label fw-semibold mb-1">Line</label>
              <v-select
                :options="getLineNames"
                v-model="selectedLineUsage"
                label="line_nm"
                placeholder="Pilih Line"
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
          </div>

          <!-- Table -->
          <h6 class="fw-bold">Detail Usage</h6>
          <div class="table-responsive text-center">
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Date</th>
                  <th>Machine</th>
                  <th>Chemical</th>
                  <th>Usage (L)</th>
                  <th>Remarks</th>
                  <th>PIC</th>
                </tr>
              </thead>
              <tbody v-if="GET_HISTORY_CHEMICAL.length > 0">
                <tr
                  v-for="(data, index) in paginatedUsage"
                  :key="data.usage_id"
                >
                  <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                  <td>{{ data.created_dt }}</td>
                  <td>
                    {{ data.machine_nm ? data.machine_nm : 'ALL MACHINE' }}
                  </td>
                  <td>{{ data.oil_nm }}</td>
                  <td>{{ data.oil_volume }} L</td>
                  <td>
                    {{
                      data.note_nm && data.note_nm.trim()
                        ? data.note_nm
                        : 'REGULER'
                    }}
                  </td>

                  <td>{{ data.pic }}</td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td colspan="7">No Data</td>
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
            <table class="table table-bordered">
              <thead>
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
import {
  ACTION_GET_MASTER_OIL,
  GET_MASTER_OIL,
} from '@/store/Chemical/MasterChemicals.module'

export default {
  name: 'HistoryChemical',
  components: { apexchart: VueApexCharts, Datepicker, FlatPickr },
  data() {
    return {
      selectedChemical: null,
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
      isInitialLoad: true,

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
    ...mapGetters([
      'getLineNames',
      'getMachinesNames',
      GET_HISTORY_CHEMICAL,
      GET_MASTER_OIL,
    ]),
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
        // ✅ Helper untuk format angka 2 desimal
        const formatDecimal = (num) => {
          const n = Number(num)
          if (isNaN(n)) return 0
          return parseFloat(n.toFixed(2))
        }

        if (!val || val.length === 0) {
          this.usageChartOptions = {
            ...this.usageChartOptions,
            xaxis: { categories: [] },
          }
          this.usageChartSeries = []
          this.paramChartSeries = []
          return
        }

        // Debug jika ada line_nm tertentu
        val.forEach((d) => {
          if (d.line_nm && d.line_nm.includes('MIXING REGULER')) {
            // console.log('Found MIXING REGULER record:', d)
          }
        })

        // 🟢 LOG untuk data Unknown Line
        const unknownLines = val.filter((d) => !d.line_nm)
        if (unknownLines.length) {
          console.log('⚠️ Found Unknown Line data:', unknownLines)
        }

        if (this.activeTab === 'usage') {
          let data = val || []
          if (data.length === 0) {
            this.usageChartSeries = []
            return
          }

          // Inject line info jika filter aktif tapi BE belum kirim line_id
          if (this.selectedLineUsage && data.length && !data[0].line_id) {
            data = data.map((d) => ({
              ...d,
              line_id: this.selectedLineUsage.line_id,
              line_nm: this.selectedLineUsage.line_nm,
            }))
          }

          // =======================================================
          // 1️⃣ TANPA FILTER → Pareto per Line
          // =======================================================
          if (!this.selectedLineUsage && !this.selectedMachineUsage) {
            const grouped = {}
            data.forEach((item) => {
              const line = item.line_nm || 'Unknown Line'
              const oil = item.oil_nm || 'Unknown Oil'
              const vol = parseFloat(item.oil_volume) || 0
              if (!grouped[line]) grouped[line] = {}
              grouped[line][oil] = (grouped[line][oil] || 0) + vol
            })

            const totals = Object.entries(grouped).map(([line, oils]) => ({
              line,
              total: Object.values(oils).reduce((a, b) => a + b, 0),
            }))
            const sortedLines = totals
              .sort((a, b) => b.total - a.total)
              .map((d) => d.line)

            const allOils = [...new Set(data.map((d) => d.oil_nm))]
            const series = allOils.map((oil) => ({
              name: oil,
              data: sortedLines.map((line) =>
                formatDecimal(grouped[line]?.[oil] || 0),
              ),
            }))

            this.usageChartOptions = {
              ...this.usageChartOptions,
              chart: { type: 'bar', stacked: true },
              xaxis: {
                categories: sortedLines,
                axisBorder: { show: true, color: '#333', height: 2 },
                axisTicks: { show: true, color: '#333', height: 6 },
              },
              title: {
                text: 'Pareto Total Chemical per Line',
                align: 'center',
              },
              yaxis: {
                title: { text: 'Volume (Liter)' },
                axisBorder: { show: true, color: '#333', width: 2 },
                axisTicks: { show: true, color: '#333', width: 2 },
                labels: { formatter: (val) => `${formatDecimal(val)} L` },
              },
              grid: { show: true, borderColor: '#ddd', strokeDashArray: 4 },
            }
            this.usageChartSeries = series
          }

          // =======================================================
          // 2️⃣ FILTER LINE → Pareto per Machine
          // =======================================================
          else if (this.selectedLineUsage && !this.selectedMachineUsage) {
            const grouped = {}
            data.forEach((item) => {
              const machine = item.machine_nm || 'All Machine'
              const oil = item.oil_nm || 'Unknown Oil'
              const vol = parseFloat(item.oil_volume) || 0
              if (!grouped[machine]) grouped[machine] = {}
              grouped[machine][oil] = (grouped[machine][oil] || 0) + vol
            })

            const totals = Object.entries(grouped).map(([machine, oils]) => ({
              machine,
              total: Object.values(oils).reduce((a, b) => a + b, 0),
            }))
            const sortedMachines = totals
              .sort((a, b) => b.total - a.total)
              .map((d) => d.machine)
            const allOils = [...new Set(data.map((d) => d.oil_nm))]

            const series = allOils.map((oil) => ({
              name: oil,
              data: sortedMachines.map((m) =>
                formatDecimal(grouped[m]?.[oil] || 0),
              ),
            }))

            this.usageChartOptions = {
              ...this.usageChartOptions,
              chart: { type: 'bar', stacked: true },
              xaxis: { categories: sortedMachines },
              title: {
                text: `Pareto Total Chemical per Machine (${this.selectedLineUsage.line_nm})`,
                align: 'center',
              },
              yaxis: {
                axisBorder: {
                  show: true,
                  color: '#333', // warna garis sumbu X
                  height: 2, // ketebalan
                },
                axisTicks: {
                  show: true,
                  color: '#333',
                  height: 6, // panjang garis kecil di bawah label
                },
                labels: { formatter: (val) => `${formatDecimal(val)} L` },
              },
            }
            this.usageChartSeries = series
          } else if (
            this.selectedLineUsage &&
            this.selectedMachineUsage &&
            this.selectedChemical
          ) {
            const filtered = (data || []).filter((d) => {
              const sameMachine =
                Number(d.machine_id) ===
                Number(this.selectedMachineUsage.machine_id)
              const sameLine =
                Number(d.line_id) === Number(this.selectedLineUsage.line_id)
              const sameOil =
                Number(d.oil_id) === Number(this.selectedChemical.oil_id)
              return sameMachine && sameLine && sameOil
            })

            if (!filtered.length) {
              this.usageChartSeries = []
              this.usageChartOptions = {
                ...this.usageChartOptions,
                xaxis: { categories: [] },
                title: {
                  text: `No Data for ${this.selectedChemical.oil_nm} (${this.selectedMachineUsage.machine_nm})`,
                  align: 'center',
                },
              }
              return
            }

            const totalsByDate = {}
            filtered.forEach((item) => {
              const date = item.created_dt
                ? item.created_dt.split('T')[0]
                : 'Unknown Date'
              const vol = parseFloat(item.oil_volume) || 0
              totalsByDate[date] = (totalsByDate[date] || 0) + vol
            })

            const sortedDates = Object.keys(totalsByDate).sort()

            const series = [
              {
                name: `${this.selectedChemical.oil_nm} Usage (L)`,
                data: sortedDates.map((d) => formatDecimal(totalsByDate[d])),
              },
            ]

            this.usageChartOptions = {
              ...this.usageChartOptions,
              chart: { id: `chart-${Date.now()}`, type: 'bar', stacked: false },
              xaxis: { categories: [...sortedDates] },
              title: {
                text: `Pareto ${this.selectedChemical.oil_nm} per Date (${this.selectedMachineUsage.machine_nm})`,
                align: 'center',
              },
              yaxis: {
                title: { text: 'Volume (Liter)' },
                labels: { formatter: (val) => `${formatDecimal(val)} L` },
                axisBorder: {
                  show: true,
                  color: '#333', // warna garis sumbu X
                  height: 2, // ketebalan
                },
                axisTicks: {
                  show: true,
                  color: '#333',
                  height: 6, // panjang garis kecil di bawah label
                },
              },
            }

            this.usageChartSeries = [...series]
          }

          // =======================================================
          // 4️⃣ FILTER LINE + MACHINE → Pareto per Chemical
          // =======================================================
          else if (this.selectedLineUsage && this.selectedMachineUsage) {
            const filtered = data.filter(
              (d) => d.machine_id === this.selectedMachineUsage.machine_id,
            )

            const totalsByOil = {}
            filtered.forEach((item) => {
              const oil = item.oil_nm
              const vol = parseFloat(item.oil_volume) || 0
              totalsByOil[oil] = (totalsByOil[oil] || 0) + vol
            })

            const sorted = Object.entries(totalsByOil)
              .map(([oil, total]) => ({ oil, total: formatDecimal(total) }))
              .sort((a, b) => b.total - a.total)

            this.usageChartOptions = {
              ...this.usageChartOptions,
              chart: { type: 'bar', stacked: false },
              xaxis: { categories: sorted.map((d) => d.oil) },
              title: {
                text: `Pareto Chemical Usage (${this.selectedMachineUsage.machine_nm})`,
                align: 'center',
              },
              yaxis: {
                labels: { formatter: (val) => `${formatDecimal(val)} L` },
                axisBorder: {
                  show: true,
                  color: '#333', // warna garis sumbu X
                  height: 2, // ketebalan
                },
                axisTicks: {
                  show: true,
                  color: '#333',
                  height: 6, // panjang garis kecil di bawah label
                },
              },
            }
            this.usageChartSeries = [
              { name: 'Total Usage (L)', data: sorted.map((d) => d.total) },
            ]
          }
        }

        // --- TAB PARAM ---
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
            // if (!this.selectedLineUsage) this.selectedLineUsage = defaultLine
            if (!this.selectedLineParam) this.selectedLineParam = defaultLine
          }
        }
      },
    },

    async selectedLineUsage(newVal) {
      if (!this.isInitialLoad && newVal) {
        this.selectedMachineUsage = null
        await this.onLineChange(newVal, 'usage')
        await this.fetchHistoryData()
      } else {
        // Kalau line dikosongkan → reset machine juga + fetch ulang tanpa filter
        this.selectedMachineUsage = null
        await this.fetchHistoryData()
      }
    },
    async selectedChemical(newVal) {
      if (!this.isInitialLoad && newVal) {
        await this.fetchHistoryData()
      } else {
        await this.fetchHistoryData()
      }
    },
    async selectedLineParam(newVal) {
      if (!this.isInitialLoad && newVal) {
        this.selectedMachineParam = null
        await this.onLineChange(newVal, 'param')
        await this.fetchHistoryData()
      }
    },

    activeTab(newVal, oldVal) {
      if (!this.isInitialLoad && newVal !== oldVal) {
        if (newVal === 'usage') this.selectedMachineUsage = null
        this.currentPage = 1
        this.fetchHistoryData()
      }
    },

    dateRange(newVal, oldVal) {
      if (!this.isInitialLoad && newVal !== oldVal) {
        this.fetchHistoryData()
      }
    },
    selectedMachineUsage(newVal, oldVal) {
      if (!this.isInitialLoad && newVal !== oldVal) {
        this.fetchHistoryData()
      }
    },

    selectedMachineParam(newVal, oldVal) {
      if (!this.isInitialLoad && newVal !== oldVal) {
        this.fetchHistoryData()
      }
    },
  },

  methods: {
    async fetchHistoryData() {
      // console.log('kepanggil')

      try {
        if (!this.dateRange || !this.dateRange.includes(' to ')) return
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
        if (this.activeTab === 'usage' && this.selectedChemical?.oil_id)
          payload.oil_id = this.selectedChemical.oil_id
        if (this.activeTab === 'param' && this.selectedMachineParam?.machine_id)
          payload.machine_id = this.selectedMachineParam.machine_id

        const response = await this.$store.dispatch(
          ACTION_GET_HISTORY_CHEMICAL,
          payload,
        )

        if (response.status === 200) {
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

      // console.log('STD dari backend:', {
      //   std_max_cons,
      //   std_min_cons,
      //   std_ph_max,
      //   std_ph_min,
      // })

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
        xaxis: {
          categories,
        },
        yaxis: {
          min: yMin,
          max: yMax,
          title: { text: 'Nilai Parameter' },
          axisBorder: {
            show: true,
            color: '#333', // warna garis sumbu X
            height: 2, // ketebalan
          },
          axisTicks: {
            show: true,
            color: '#333',
            height: 6, // panjang garis kecil di bawah label
          },
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
                style: { color: '#fff', background: '#FEB019' },
              },
            },
            {
              y: std_ph_max,
              borderColor: '#FF0000',
              label: {
                text: `Max pH: ${fmt(std_ph_max)}`,
                style: { color: '#fff', background: '#FF4560' },
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
    await this.$store.dispatch(ACTION_GET_MASTER_OIL)
    this.isInitialLoad = false
  },
}
</script>
<style scoped>
.table-bordered th {
  background-color: rgb(198, 240, 240) !important;
}
.table-bordered {
  border: 1px solid black !important;
}
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
