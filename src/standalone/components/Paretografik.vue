<template>
  <div class="container-fluid" ref="container">
    <div class="card p-2">
      <h4>Pareto Problem Bulan {{ formattedMonth }}</h4>
      <div>
        <apexchart
          type="bar"
          height="350"
          :options="chartOptions"
          :series="series"
          @click="handleBarClick"
        ></apexchart>
      </div>

      <!-- Tabel untuk Detail Informasi -->
      <div v-if="selectedDetail.length > 0" class="mt-4">
        <h5>Detail Informasi</h5>
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>No</th>
              <th>Tool Name</th>
              <th>Machine Name</th>
              <th>Problem</th>
              <th v-if="hasOtherDetail">Detail</th>
              <th>Jumlah</th>
              <th>Tanggal Kejadian</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in selectedDetail" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.tool_nm || '-' }}</td>
              <td>{{ item.machine_nm || '-' }}</td>
              <td>{{ item.problem_nm }}</td>
              <td v-if="hasOtherDetail">
                {{
                  item.problem_nm === 'Other' ? item.other_detail || '-' : '-'
                }}
              </td>
              <td>{{ item.jumlah }}</td>
              <td>{{ item.tanggal_kejadian }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import {
  ACTION_GET_PARETO_PROBLEM,
  GET_PARETO_PROBLEM,
} from '@/store/Tool/HistoryProblem.module'
import VueApexCharts from 'vue3-apexcharts'
import { mapGetters } from 'vuex'

export default {
  name: 'Paretografik',
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      selectedDetail: [],
    }
  },
  props: {
    selectedMonth: String,
    selectedProblem: String,
  },
  computed: {
    ...mapGetters([GET_PARETO_PROBLEM]),
    formattedMonth() {
      const date = new Date(this.selectedMonth + '-01')
      return new Intl.DateTimeFormat('id-ID', {
        month: 'long',
        year: 'numeric',
      }).format(date)
    },
    series() {
      if (!this.GET_PARETO_PROBLEM) return []

      const problems = this.GET_PARETO_PROBLEM

      // Urutkan data berdasarkan jumlah secara menurun
      const sortedProblems = problems.sort((a, b) => b.jumlah - a.jumlah)

      // Data jumlah untuk bar
      const barData = sortedProblems.map((item) => Number(item.jumlah))

      return [
        {
          name: 'Jumlah',
          type: 'bar',
          data: barData,
        },
      ]
    },
    chartOptions() {
      return {
        chart: {
          type: 'bar',
        },
        title: {
          text: 'Pareto Analysis',
          align: 'center',
        },
        xaxis: {
          categories: this.GET_PARETO_PROBLEM
            ? this.GET_PARETO_PROBLEM.sort((a, b) => b.jumlah - a.jumlah).map(
                (item) => item.tool_nm,
              )
            : [],
          title: {
            text: 'Problem',
          },
        },
        yaxis: {
          title: {
            text: 'Jumlah',
          },
        },
        tooltip: {
          enabled: true,
        },
        legend: {
          position: 'top',
        },
      }
    },
    hasOtherDetail() {
      return this.selectedDetail.some((item) => item.other_detail)
    },
  },
  watch: {
    selectedMonth() {
      this.fetchParetoData()
    },
    selectedProblem() {
      this.fetchParetoData()
    },
    GET_PARETO_PROBLEM(newValue) {
      console.log('Data Pareto:', newValue)
    },
  },
  methods: {
    fetchParetoData() {
      this.$store.dispatch(ACTION_GET_PARETO_PROBLEM, {
        selectedMonth: this.selectedMonth,
        selectedProblem: this.selectedProblem,
      })
    },
    handleBarClick(event, chartContext, config) {
      const clickedIndex = config.dataPointIndex
      const clickedData = this.GET_PARETO_PROBLEM[clickedIndex]

      if (clickedData) {
        this.selectedDetail = this.GET_PARETO_PROBLEM.filter(
          (item) =>
            item.tool_nm === clickedData.tool_nm &&
            item.problem_nm === clickedData.problem_nm &&
            item.machine_nm === clickedData.machine_nm,
        )
      } else {
        this.selectedDetail = []
      }
    },
    handleClickOutside(event) {
      const container = this.$refs.container
      if (container && !container.contains(event.target)) {
        this.selectedDetail = []
      }
    },
  },
  mounted() {
    this.fetchParetoData()
    // Menambahkan event listener untuk klik di luar
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeDestroy() {
    // Pastikan untuk menghapus event listener saat komponen dihancurkan
    document.removeEventListener('click', this.handleClickOutside)
  },
}
</script>
