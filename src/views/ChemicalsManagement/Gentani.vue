<template>
  <!-- Header -->
  <div class="container-fluid">
    <div class="card p-2 mb-2">
      <div class="d-flex justify-content-between align-items-center">
        <h4 class="text-center m-0">Gentani Chemical</h4>
        <div>
          <button
            ref="toggleBtn"
            class="btn btn-primary"
            @click.stop="toggleMasterGentani"
          >
            Master Gentani
          </button>
        </div>
      </div>
    </div>
  </div>
  <MasterGentani
    ref="masterGentani"
    class="mb-2"
    :showMasterGentani="showMasterGentani"
  />
  <div class="container-fluid">
    <!-- Filter -->
    <div class="card p-3 mb-3 shadow-sm">
      <div class="row d-flex flex-wrap gap-3 mb-3 align-items-end">
        <div class="col filter-group flex-grow-1">
          <label class="form-label fw-semibold mb-1">Line</label>
          <v-select
            :options="getLineNames"
            v-model="selectedLine"
            label="line_nm"
            placeholder="Pilih Line"
            class="w-100"
            :append-to-body="true"
          />
        </div>

        <div class="col filter-group flex-grow-1 mb-3">
          <label class="form-label fw-semibold mb-1">Bulan</label>
          <input
            type="month"
            v-model="selectedMonth"
            class="form-control w-100"
          />
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center my-5">
      <span>Loading data, please wait...</span>
      <!-- atau spinner -->
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <!-- Loop Chart & Table per Oil -->
    <div v-else>
      <div v-for="oil in oilList" :key="oil.oil_id" class="mb-5">
        <!-- Chart -->
        <div class="card p-3 mb-3 shadow-sm text-center">
          <div class="card mb-2">
            <h5>{{ oil.oil_nm }}</h5>
          </div>

          <!-- === GENTANI RATIO CHART === -->
          <div class="card mb-2">
            <h5>Gentani</h5>
            <apexchart
              width="100%"
              height="300"
              type="line"
              :options="getRatioOptions(oil.oil_id)"
              :series="getRatioSeries(oil.oil_id)"
            />
          </div>
          <div class="card">
            <h5>Pemakaian</h5>
            <apexchart
              type="line"
              height="350"
              :options="getChartOptions(oil.oil_id)"
              :series="getChartSeries(oil.oil_id)"
            />
          </div>
        </div>

        <!-- Table -->
        <div class="card p-3 mb-3 shadow-sm">
          <h6>Detail {{ oil.oil_nm }}</h6>
          <div class="table-wrapper">
            <table
              class="table table-bordered table-sm text-center align-middle sticky-table"
            >
              <thead>
                <tr>
                  <th class="sticky-col sticky-col-1">No</th>
                  <th class="sticky-col sticky-col-2">Chemical Type</th>
                  <th class="sticky-col sticky-col-3">Tanggal</th>
                  <th v-for="day in days" :key="day" :class="getDayClass(day)">
                    {{ day }}
                  </th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="sticky-col sticky-col-1" rowspan="2">1</td>
                  <td class="sticky-col sticky-col-2" rowspan="2">
                    {{ oil.oil_nm }}
                  </td>

                  <td class="sticky-col sticky-col-3 fw-semibold">
                    Actual Usage
                  </td>
                  <td
                    v-for="day in days"
                    :key="'daily-' + day"
                    :class="getDayClass(day)"
                  >
                    {{ dailyUsage(oil.oil_id, day) }}
                  </td>
                  <td class="fw-semibold">{{ totalDaily(oil.oil_id) }}</td>
                </tr>

                <tr class="table-secondary fw-semibold">
                  <td class="sticky-col sticky-col-3">Cumulative</td>
                  <td
                    v-for="day in days"
                    :key="'cumu-' + day"
                    :class="getDayClass(day)"
                  >
                    {{ cumulativeUsage(oil.oil_id, day) }}
                  </td>
                  <td>{{ totalCumulative(oil.oil_id) }}</td>
                </tr>
                <!-- PLAN PROD -->
                <tr class="table-info">
                  <td class="sticky-col sticky-col-1" rowspan="2"></td>
                  <td class="sticky-col sticky-col-2" rowspan="2">
                    Plan Production
                  </td>

                  <td class="sticky-col sticky-col-3 fw-semibold">Plan</td>

                  <td
                    v-for="day in days"
                    :key="'plan-' + day"
                    :class="getDayClass(day)"
                  >
                    {{ planProdDaily[day] || 0 }}
                  </td>

                  <td class="fw-semibold">
                    {{
                      Object.values(planProdDaily).reduce(
                        (a, b) => a + (Number(b) || 0),
                        0,
                      )
                    }}
                  </td>
                </tr>

                <!-- CUMULATIVE PLAN -->
                <tr class="table-primary fw-semibold">
                  <td class="sticky-col sticky-col-3">Cumulative Plan</td>

                  <td
                    v-for="day in days"
                    :key="'cumu-plan-' + day"
                    :class="getDayClass(day)"
                  >
                    {{ cumulativePlan(day) }}
                  </td>

                  <td>
                    {{ planProdCumulative[days[days.length - 1]] || 0 }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts'
import { mapGetters } from 'vuex'
import {
  ACTION_GET_SUMMARY_GENTANI,
  GET_SUMMARY_GENTANI,
} from '@/store/Chemical/Gentani.module'
import MasterGentani from '@/components/table/MasterGentani.vue'
import {
  ACTION_GET_PLAN_PROD,
  GET_PLAN_PROD,
} from '@/store/Chemical/PlanProd.module'

export default {
  name: 'Gentani',
  components: { apexchart: VueApexCharts, MasterGentani },
  data() {
    return {
      selectedMonth: null,
      selectedLine: null,
      days: [],
      precomputed: {},
      loading: false,
      showMasterGentani: false,
      planProdDaily: {},
      planProdCumulative: {},
    }
  },
  computed: {
    ...mapGetters(['getLineNames', GET_SUMMARY_GENTANI, GET_PLAN_PROD]),
    oilList() {
      const unique = []
      const map = new Map()
      this.GET_SUMMARY_GENTANI.forEach((item) => {
        if (!map.has(item.oil_id)) {
          map.set(item.oil_id, true)
          unique.push({ oil_id: item.oil_id, oil_nm: item.oil_nm })
        }
      })
      return unique
    },
  },
  watch: {
    selectedLine() {
      this.fetchData()
      this.loadPlanProduction()
    },
    selectedMonth() {
      this.generateDays()
      this.fetchData()
      this.loadPlanProduction()
    },
  },
  async mounted() {
    const today = new Date()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const year = today.getFullYear()
    this.selectedMonth = `${year}-${month}`

    await this.$store.dispatch('fetchLines')
    const defaultLine = this.getLineNames.find(
      (line) => line.line_nm === 'Cylinder Block',
    )
    if (defaultLine) this.selectedLine = defaultLine

    this.generateDays()
    await this.fetchData()
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    getRatioSeries(oil_id) {
      const oilData = this.GET_SUMMARY_GENTANI.find((d) => d.oil_id === oil_id)
      const std = Number(oilData?.gentani_val ?? 0)

      const ratio = this.days.map((day) => {
        const cumUsage = this.cumulativeUsage(oil_id, day)
        const cumProd = this.cumulativePlan(day)
        if (!cumProd) return 0
        return Number((cumUsage / cumProd).toFixed(4))
      })

      const stdLine = this.days.map(() => std)

      return [
        {
          name: 'Gentani Ratio',
          type: 'line',
          data: ratio,
          color: '#1E90FF',
          strokeWidth: 3,
        },
        {
          name: 'STD Gentani',
          type: 'line',
          data: stdLine,
          color: '#ff0000',
          strokeWidth: 3,
          marker: { size: 0 },
          dataLabels: { enabled: false },
        },
      ]
    },

    getRatioOptions(oil_id) {
      const oilData = this.GET_SUMMARY_GENTANI.find((d) => d.oil_id === oil_id)
      const std = Number(oilData?.gentani_val ?? 0)

      return {
        chart: { stacked: false, animations: { enabled: false } },
        stroke: { width: [3, 3] },
        xaxis: {
          categories: this.days.map((d) => String(d).padStart(2, '0')),
        },
        yaxis: {
          title: { text: 'Gentani Ratio' },
          axisBorder: { show: true, color: '#000' },
          labels: { formatter: (val) => Number(val).toFixed(3) },
        },
        tooltip: { shared: true, intersect: false },
        dataLabels: { enabled: true, enabledOnSeries: [0] },

        // === COPY PERSIS STYLE Standard Monthly ===
        annotations: {
          yaxis: [
            {
              y: std,
              borderColor: '#ff0000',
              label: {
                text: `STD Gentani: ${std}`,
                style: { color: '#fff', background: '#ff0000' },
                offsetX: 0,
                offsetY: 10,
              },
            },
          ],
        },
      }
    },

    async loadPlanProduction() {
      try {
        if (!this.selectedLine || !this.selectedMonth) return

        const payload = {
          line_id: this.selectedLine.line_id,
          month: this.selectedMonth,
        }

        const res = await this.$store.dispatch(ACTION_GET_PLAN_PROD, payload)

        if (res.status === 200) {
          const rows = this.GET_PLAN_PROD // ambil data backend langsung

          console.log('data', rows)

          const daily = {}

          this.days.forEach((day) => {
            const found = rows.find((r) => {
              return new Date(r.plan_dt).getDate() === day
            })

            daily[day] = found ? Number(found.plan_prod) : 0
          })

          this.planProdDaily = daily
          this.recalcCumulativePlan()
        }
      } catch (error) {
        console.error(error)
      }
    },

    cumulativePlan(day) {
      return this.planProdCumulative?.[day] || 0
    },

    // Hitung cumulative setiap kali plan daily berubah
    recalcCumulativePlan() {
      const cumulative = {}
      let total = 0

      this.days.forEach((day) => {
        total += Number(this.planProdDaily[day] || 0)
        cumulative[day] = total
      })

      this.planProdCumulative = cumulative
    },

    toggleMasterGentani() {
      this.showMasterGentani = true
    },
    handleClickOutside(event) {
      // Cek modal Bootstrap
      const modalEl = document.getElementById('modalMasterGentani')
      const isModalShown = modalEl?.classList.contains('show')
      if (isModalShown) return

      // ❗ Cegah hide kalau klik Swal (SweetAlert)
      const swalContainer = document.querySelector('.swal2-container')
      if (swalContainer && swalContainer.contains(event.target)) return

      const masterEl = this.$refs.masterGentani?.$refs.wrapper
      const buttonEl = this.$refs.toggleBtn

      const backdropEl = document.querySelector('.modal-backdrop')

      if (
        modalEl?.contains(event.target) ||
        backdropEl?.contains(event.target)
      ) {
        return
      }

      if (
        this.showMasterGentani &&
        masterEl &&
        !masterEl.contains(event.target) &&
        buttonEl &&
        !buttonEl.contains(event.target)
      ) {
        this.showMasterGentani = false
      }
    },

    async fetchData() {
      try {
        if (!this.selectedMonth || !this.selectedLine) return
        this.loading = true
        const payload = {
          month: this.selectedMonth,
          line_id: this.selectedLine.line_id,
        }
        await this.$store.dispatch(ACTION_GET_SUMMARY_GENTANI, payload)
        this.precomputeAll()
        this.loading = false
      } catch (error) {
        console.log(error)
      }
    },

    precomputeOil(oil_id) {
      const cache = {}
      const [year, month] = this.selectedMonth.split('-')
      this.days.forEach((day) => {
        const dayStr = String(day).padStart(2, '0')
        const rows = this.GET_SUMMARY_GENTANI.filter(
          (r) => r.oil_id === oil_id && r.usage_date.slice(8, 10) === dayStr,
        )
        const sum = rows.reduce((t, r) => t + Number(r.actual_usage), 0)
        cache[day] = { daily: Number(sum.toFixed(2)), cumulative: 0 }
      })
      let running = 0
      this.days.forEach((day) => {
        running += cache[day].daily
        cache[day].cumulative = Number(running.toFixed(2))
      })
      this.precomputed[oil_id] = cache
    },

    precomputeAll() {
      this.precomputed = {}
      const oils = [...new Set(this.GET_SUMMARY_GENTANI.map((r) => r.oil_id))]
      oils.forEach((id) => this.precomputeOil(id))
    },

    generateDays() {
      const [year, month] = this.selectedMonth.split('-')
      const lastDay = new Date(year, month, 0).getDate()
      this.days = Array.from({ length: lastDay }, (_, i) => i + 1)
    },

    dailyUsage(oil_id, day) {
      return this.precomputed[oil_id]?.[day]?.daily ?? 0
    },
    cumulativeUsage(oil_id, day) {
      return this.precomputed[oil_id]?.[day]?.cumulative ?? 0
    },
    totalDaily(oil_id) {
      return Number(
        this.days
          .reduce((sum, d) => sum + this.dailyUsage(oil_id, d), 0)
          .toFixed(2),
      )
    },
    totalCumulative(oil_id) {
      const last = this.days[this.days.length - 1]
      return Number(this.cumulativeUsage(oil_id, last).toFixed(2))
    },

    getDayClass(day) {
      const [year, month] = this.selectedMonth.split('-')
      const date = new Date(year, parseInt(month) - 1, day)
      if (date.getDay() === 6) return 'saturday'
      if (date.getDay() === 0) return 'sunday'
      return ''
    },

    getChartSeries(oil_id) {
      const daily = this.days.map((d) => this.dailyUsage(oil_id, d))
      const cumulative = this.days.map((d) => this.cumulativeUsage(oil_id, d))
      const oilData = this.GET_SUMMARY_GENTANI.find((d) => d.oil_id === oil_id)
      const standard = oilData
        ? Number(oilData.gentani_val) * Number(oilData.plan_prod)
        : 0
      const standardLine = this.days.map(() => standard)
      return [
        { name: 'Actual Usage', type: 'bar', data: daily },
        { name: 'Cumulative', type: 'line', data: cumulative },
        {
          name: 'Standard Monthly',
          type: 'line',
          data: standardLine,
          color: '#ff0000',
          strokeWidth: 3,
          marker: { size: 0 },
          dataLabels: { enabled: false },
        },
      ]
    },

    getChartOptions(oil_id) {
      const days = this.days
      const oilData = this.GET_SUMMARY_GENTANI.find((d) => d.oil_id === oil_id)
      const standard = (
        Number(oilData?.gentani_val ?? 0) * Number(oilData?.plan_prod ?? 0)
      ).toFixed(2)
      return {
        chart: { stacked: false, animations: { enabled: false } },
        stroke: { width: [0, 3, 3] },
        xaxis: { categories: days.map((d) => String(d).padStart(2, '0')) },
        yaxis: {
          title: { text: 'Volume' },
          axisBorder: { show: true, color: '#000' },
          labels: { formatter: (val) => parseInt(val) },
        },
        tooltip: { shared: true, intersect: false },
        dataLabels: { enabled: true, enabledOnSeries: [0, 1] },
        annotations: {
          yaxis: [
            {
              y: standard,
              borderColor: '#ff0000',
              label: {
                text: `StdMonthly: ${standard}`,
                style: { color: '#fff', background: '#ff0000' },
                offsetX: 0,
                offsetY: 10,
              },
            },
          ],
        },
      }
    },
  },
}
</script>

<style scoped>
/* ===============================
   WRAPPER
   =============================== */
.table-wrapper {
  overflow: auto;
  max-height: 400px;
  border: 1px solid #ccc;
}

/* ===============================
   BASE TABLE STYLE
   =============================== */
.sticky-table {
  border-collapse: separate;
  border-spacing: 0;
  width: max-content;
  min-width: 100%;
}

.sticky-table th,
.sticky-table td {
  border: 1px solid #000;
  padding: 4px 6px;
  text-align: center;
  vertical-align: middle;
  white-space: nowrap;
  background-clip: padding-box;
}

/* ===============================
   STICKY HEADER
   =============================== */
.sticky-table thead th {
  position: sticky;
  top: 0;
  background-color: rgb(198, 240, 240);
  z-index: 200; /* header tanggal */
}

/* Header sticky col harus di atas semuanya */
.sticky-table thead .sticky-col {
  z-index: 300 !important;
  background-color: rgb(198, 240, 240) !important;
}

/* ===============================
   STICKY COLUMN FIX
   =============================== */
.sticky-col {
  position: sticky;
  background-color: #fff !important;
  background-clip: padding-box;
  z-index: 150;

  /* Biar garis horizontal utama tidak terputus */
  border-left: 1px solid #000 !important;
  border-right: 1px solid #000 !important;
}

/* Tambahkan border atas hanya di THEAD sticky */
.sticky-table thead .sticky-col {
  border-top: 1px solid #000 !important;
}

/* Tambahkan border bawah hanya di row terakhir */
.sticky-table tbody tr:last-child .sticky-col {
  border-bottom: 1px solid #000 !important;
}

/* ===============================
   STICKY COLUMN POSITIONS
   =============================== */
.sticky-col-1 {
  left: 0;
  min-width: 50px;
  max-width: 50px;
}
.sticky-col-2 {
  left: 50px;
  min-width: 150px;
  max-width: 150px;
}
.sticky-col-3 {
  left: 200px;
  min-width: 120px;
  max-width: 120px;
}
/* kalau kamu butuh left lebih banyak (di screen lain tadi ada col-4) */
.sticky-col-4 {
  left: 320px;
  min-width: 60px;
  max-width: 60px;
}

/* ===============================
   CELL WRAPPING (khusus Chemical Type)
   =============================== */
.sticky-table th.sticky-col-2,
.sticky-table td.sticky-col-2 {
  white-space: normal !important;
  word-wrap: break-word;
  line-height: 1.2;
}

/* ===============================
   CUMULATIVE ROW
   =============================== */
.table-secondary td {
  background-color: #f3f3f3 !important;
  font-weight: 600;
}

/* ===============================
   WEEKEND COLORING
   =============================== */
.saturday {
  background-color: #ffeaea !important;
}
.sunday {
  background-color: #ffdcdc !important;
}

/* ===============================
   TABLE BORDER WRAPPER
   =============================== */
.table-bordered {
  border: 1px solid black;
}
.table-bordered th {
  background-color: rgb(198, 240, 240);
}
</style>
