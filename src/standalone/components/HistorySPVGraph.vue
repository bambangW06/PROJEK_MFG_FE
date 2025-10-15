<template>
  <div ref="detailsCard" class="row mt-2">
    <!-- Grafik Red Shift Hadir -->
    <div class="col-md-6 mb-4">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Section Head Hadir</h5>
          <ApexChart
            type="bar"
            :options="SPVHadirOption"
            :series="SPVHadirSeries"
            @dataPointSelection="handleBarClick('hadir', $event)"
          />
        </div>
      </div>
    </div>

    <div class="col-md-6 mb-4">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Section Head Absen</h5>
          <ApexChart
            type="bar"
            :options="SPVAbsenOption"
            :series="SPVAbsenSeries"
            @dataPointSelection="handleBarClick('selainHadir', $event)"
          />
        </div>
      </div>
    </div>
  </div>

  <div v-if="clickedDetailsSPV.length > 0" ref="detailTable" class="card mt-4">
    <div class="card-body">
      <h5>Detail Kehadiran - {{ clickedSPV }}</h5>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Tanggal</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(detail, index) in clickedDetailsSPV" :key="index">
            <td>{{ detail.date_absence }}</td>
            <td>{{ detail.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import {
  ACTION_GET_HISTORY_ABSEN_SPV_FOR_GRAPH,
  GET_ABSENSI_SPV_FOR_GRAPH,
} from '@/store/Employee/AbsensiModule'
import ApexChart from 'vue3-apexcharts'
import moment from 'moment-timezone'
import { mapGetters } from 'vuex'

export default {
  name: 'HistorySPVGraph',
  components: {
    ApexChart,
  },
  data() {
    return {
      clickedDetailsSPV: [],
      clickedSPV: '',
    }
  },
  props: {
    selectedMonth: String,
  },
  computed: {
    ...mapGetters([GET_ABSENSI_SPV_FOR_GRAPH]),
    SPVHadirSeries() {
      const hadirCounts = this.countAbsensi(
        this.GET_ABSENSI_SPV_FOR_GRAPH.hadir,
      )
      return [
        {
          name: 'Hadir',
          data: Object.values(hadirCounts),
        },
      ]
    },
    SPVHadirOption() {
      return this.getChartOptions(this.GET_ABSENSI_SPV_FOR_GRAPH.hadir)
    },
    SPVAbsenSeries() {
      const selainHadirCounts = this.countAbsensi(
        this.GET_ABSENSI_SPV_FOR_GRAPH.selainHadir,
      )
      return [
        {
          name: 'Absen',
          data: Object.values(selainHadirCounts),
        },
      ]
    },
    SPVAbsenOption() {
      return this.getChartOptions(this.GET_ABSENSI_SPV_FOR_GRAPH.selainHadir)
    },
  },
  mounted() {
    this.$store.dispatch(
      ACTION_GET_HISTORY_ABSEN_SPV_FOR_GRAPH,
      this.selectedMonth,
    )

    document.addEventListener('click', this.handleClickOutside)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    countAbsensi(data) {
      const counts = {}
      data?.forEach((item) => {
        if (counts[item.nama]) {
          counts[item.nama]++
        } else {
          counts[item.nama] = 1
        }
      })
      return counts
    },
    getChartOptions(data) {
      return {
        chart: {
          id: 'bar-chart',
          events: {
            dataPointSelection: (event, chartContext, config) => {
              this.handleBarClick(
                config.seriesIndex,
                config.dataPointIndex,
                data,
              )
            },
          },
        },
        xaxis: {
          categories: Object.keys(this.countAbsensi(data)),
          title: {
            text: 'Jumlah',
          },
          axisBorder: {
            show: true,
            color: '#000',
          },
          axisTicks: {
            show: true, // Menampilkan garis tick
            color: '#000', // Warna garis tick
            height: 6, // Panjang garis tick
          },
        },
        yaxis: {
          title: {
            // text: 'Nama Karyawan',
            enabled: false,
          },
          labels: {
            formatter: (value) => {
              const maxLength = 10
              // Pastikan value adalah string sebelum melakukan operasi slice
              if (typeof value === 'string') {
                return value.length > maxLength
                  ? value.slice(0, maxLength) + '...'
                  : value
              }
              // Kembalikan value apa adanya jika bukan string
              return value
            },
          },
          axisTicks: {
            show: true, // Menampilkan garis tick
            color: '#000', // Warna garis tick
            height: 6, // Panjang garis tick
          },
        },

        plotOptions: {
          bar: {
            horizontal: true,
          },
        },
      }
    },
    handleBarClick(seriesIndex, dataPointIndex, data) {
      const categories = Object.keys(this.countAbsensi(data))
      const employeeName = categories[dataPointIndex]
      // console.log('employeeName', employeeName)

      // Ambil data detail kehadiran berdasarkan nama karyawan
      const detailData = data.filter((item) => item.nama === employeeName)

      // Ambil nomor registrasi dari detail pertama
      const noreg = detailData.length > 0 ? detailData[0].noreg : ''

      // Urutkan detailData berdasarkan date_absence dari kecil ke besar
      this.clickedDetailsSPV = detailData
        .map((item) => ({
          date_absence: item.date_absence,
          status: item.status || (seriesIndex === 0 ? 'Hadir' : 'Libur'),
        }))
        .sort((a, b) => new Date(a.date_absence) - new Date(b.date_absence))

      this.clickedSPV = `${employeeName} (${noreg})`
      // Fokus layar ke tabel detail setelah mengklik bar chart
      this.$nextTick(() => {
        if (this.$refs.detailTable) {
          this.$refs.detailTable.scrollIntoView({ behavior: 'smooth' })
        }
      })
    },
    handleClickOutside(event) {
      // Check if the click was outside the card
      if (
        this.clickedDetailsSPV.length > 0 && // Only check if details are shown
        this.$refs.detailsCard && // Make sure the ref exists
        !this.$refs.detailsCard.contains(event.target)
      ) {
        this.clickedDetailsSPV = [] // Hide the details
      }
    },
  },
}
</script>
<style>
.card-title {
  text-align: center;
  font-size: 1.25rem;
}
.table-bordered th {
  background-color: rgb(198, 240, 240);
  border: 1px solid black;
}
.table-bordered td {
  border: 1px solid black;
}
</style>
