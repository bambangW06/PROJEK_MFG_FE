<template>
  <div class="container-fluid">
    <!-- Header -->
    <div class="card p-3 mb-3 shadow-sm">
      <h4 class="m-0 fw-bold">Dummy test</h4>
    </div>

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
        <div class="card p-3 mb-3 shadow-sm">
          <h5>{{ oil.oil_nm }}</h5>
          <apexchart
            type="line"
            height="350"
            :options="getChartOptions(oil.oil_id)"
            :series="getChartSeries(oil.oil_id)"
          />
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
  ACTION_GET_GENTANI,
  GET_GENTANI,
} from '@/store/Chemical/Gentani.module'

export default {
  name: 'Gentani',
  components: { apexchart: VueApexCharts },
  data() {
    return {
      selectedMonth: null,
      selectedLine: null,
      days: [],
      precomputed: {},
      loading: false, // <-- FLAG LOADING
    }
  },
  computed: {
    ...mapGetters(['getLineNames', GET_GENTANI]),
    oilList() {
      const unique = []
      const map = new Map()
      this.GET_GENTANI.forEach((item) => {
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
    },
    selectedMonth() {
      this.generateDays()
      this.fetchData()
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
  },
  methods: {
    async fetchData() {
      try {
        if (!this.selectedMonth || !this.selectedLine) return
        this.loading = true
        const payload = {
          month: this.selectedMonth,
          line_id: this.selectedLine.line_id,
        }
        await this.$store.dispatch(ACTION_GET_GENTANI, payload)
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
        const rows = this.GET_GENTANI.filter(
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
      const oils = [...new Set(this.GET_GENTANI.map((r) => r.oil_id))]
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
      const oilData = this.GET_GENTANI.find((d) => d.oil_id === oil_id)
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
      const oilData = this.GET_GENTANI.find((d) => d.oil_id === oil_id)
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
