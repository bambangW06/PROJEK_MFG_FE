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

    <!-- Loop Chart & Table per Oil -->
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
                <td class="sticky-col sticky-col-1">1</td>
                <td class="sticky-col sticky-col-2">{{ oil.oil_nm }}</td>
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
                <td class="sticky-col sticky-col-1"></td>
                <td class="sticky-col sticky-col-2"></td>
                <td class="sticky-col sticky-col-3">Cumulative</td>
                <td
                  v-for="day in days"
                  :key="'cumu-' + day"
                  :class="getDayClass(day)"
                >
                  {{ cumulativeUsage(oil.oil_id, day) }}
                </td>
                <td class="fw-semibold">{{ totalCumulative(oil.oil_id) }}</td>
              </tr>
            </tbody>
          </table>
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
    selectedMonth(val) {
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
      if (!this.selectedMonth || !this.selectedLine) return
      const payload = {
        month: this.selectedMonth,
        line_id: this.selectedLine.line_id,
      }
      await this.$store.dispatch(ACTION_GET_GENTANI, payload)
    },

    generateDays() {
      const [year, month] = this.selectedMonth.split('-')
      const lastDay = new Date(year, month, 0).getDate()
      this.days = Array.from({ length: lastDay }, (_, i) => i + 1)
    },

    // dailyUsage(oil_id, day) {
    //   if (!this.selectedMonth) return 0

    //   const [year, month] = this.selectedMonth.split('-')
    //   const startOfDay = new Date(year, month - 1, day, 7, 0, 0) // jam 07:00
    //   const endOfDay = new Date(startOfDay)
    //   endOfDay.setDate(endOfDay.getDate() + 1) // sampai jam 07:00 besok

    //   const rows = this.GET_GENTANI.filter((r) => {
    //     if (r.oil_id !== oil_id) return false
    //     const dt = new Date(r.usage_date)
    //     return dt >= startOfDay && dt < endOfDay
    //   })

    //   return rows.reduce((sum, r) => sum + Number(r.actual_usage), 0)
    // },

    // cumulativeUsage(oil_id, day) {
    //   const days = this.days.filter((d) => d <= day)
    //   return days.reduce((sum, d) => sum + this.dailyUsage(oil_id, d), 0)
    // },

    dailyUsage(oil_id, day) {
      if (!this.selectedMonth) return 0

      const [year, month] = this.selectedMonth.split('-')
      const startOfDay = new Date(year, month - 1, day, 7, 0, 0) // jam 07:00
      const endOfDay = new Date(startOfDay)
      endOfDay.setDate(endOfDay.getDate() + 1) // sampai jam 07:00 besok

      const rows = this.GET_GENTANI.filter((r) => {
        if (r.oil_id !== oil_id) return false
        const dt = new Date(r.usage_date)
        return dt >= startOfDay && dt < endOfDay
      })

      const sum = rows.reduce((sum, r) => sum + Number(r.actual_usage), 0)
      return Number(sum.toFixed(2)) // batasi 2 digit di belakang koma
    },

    cumulativeUsage(oil_id, day) {
      const days = this.days.filter((d) => d <= day)
      const sum = days.reduce(
        (total, d) => total + this.dailyUsage(oil_id, d),
        0,
      )
      return Number(sum.toFixed(2)) // batasi 2 digit di belakang koma
    },

    totalDaily(oil_id) {
      const sum = this.days.reduce(
        (sum, d) => sum + this.dailyUsage(oil_id, d),
        0,
      )
      return Number(sum.toFixed(2))
    },

    totalCumulative(oil_id) {
      const lastDay = this.days[this.days.length - 1]
      return Number(this.cumulativeUsage(oil_id, lastDay).toFixed(2))
    },

    getDayClass(day) {
      const [year, month] = this.selectedMonth.split('-')
      const date = new Date(year, parseInt(month) - 1, day)
      if (date.getDay() === 6) return 'saturday'
      if (date.getDay() === 0) return 'sunday'
      return ''
    },

    // getChartSeries(oil_id) {
    //   const daily = this.days.map((d) => this.dailyUsage(oil_id, d))
    //   const cumulative = this.days.map((d) => this.cumulativeUsage(oil_id, d))
    //   const oilData = this.GET_GENTANI.find((d) => d.oil_id === oil_id)
    //   const standard = oilData
    //     ? Number(oilData.gentani_val) * Number(oilData.plan_prod)
    //     : 0
    //   const standardLine = this.days.map(() => standard)
    //   return [
    //     { name: 'Actual Usage', type: 'bar', data: daily },
    //     { name: 'Cumulative', type: 'line', data: cumulative },
    //     { name: 'Standard Monthly', type: 'line', data: standardLine },
    //   ]
    // },

    getChartSeries(oil_id) {
      const daily = this.days.map((d) => this.dailyUsage(oil_id, d))
      const cumulative = this.days.map((d) => this.cumulativeUsage(oil_id, d))

      const oilData = this.GET_GENTANI.find((d) => d.oil_id === oil_id)
      const standard = oilData
        ? Number(oilData.gentani_val) * Number(oilData.plan_prod)
        : 0
      const standardLine = this.days.map(() => standard) // garis penuh

      return [
        { name: 'Actual Usage', type: 'bar', data: daily },
        { name: 'Cumulative', type: 'line', data: cumulative },
        {
          name: 'Standard Monthly',
          type: 'line',
          data: standardLine,
          color: '#ff0000',
          strokeWidth: 3,
          marker: { size: 0 }, // titik tidak muncul
          dataLabels: { enabled: false }, // matikan label per titik
        },
      ]
    },

    getChartOptions(oil_id) {
      const days = this.days
      const oilData = this.GET_GENTANI.find((d) => d.oil_id === oil_id)
      const standard = oilData
        ? Number(oilData.gentani_val) * Number(oilData.plan_prod)
        : 0

      return {
        chart: { stacked: false },
        stroke: { width: [0, 3, 3] },
        xaxis: { categories: days.map((d) => String(d).padStart(2, '0')) },
        yaxis: { title: { text: 'Volume' } },
        tooltip: { shared: true, intersect: false },
        dataLabels: {
          enabled: true, // global aktif
          enabledOnSeries: [0, 1], // hanya untuk Actual Usage & Cumulative
        },
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

    // getChartOptions(oil_id) {
    //   return {
    //     chart: { stacked: false },
    //     stroke: { width: [0, 3, 3] },
    //     xaxis: { categories: this.days.map((d) => String(d).padStart(2, '0')) },
    //     yaxis: { title: { text: 'Volume' } },
    //     tooltip: { shared: true, intersect: false },
    //     dataLabels: { enabled: true },
    //   }
    // },
  },
}
</script>

<style scoped>
.table-wrapper {
  overflow-x: auto;
  max-height: 400px;
  border: 1px solid #ccc;
}
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
.sticky-table thead th {
  position: sticky;
  top: 0;
  background-color: rgb(198, 240, 240);
  z-index: 200;
}
.sticky-col {
  position: sticky;
  background-color: #fff;
  z-index: 150;
}
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
.saturday {
  background-color: #ffeaea !important;
}
.sunday {
  background-color: #ffdcdc !important;
}
</style>
