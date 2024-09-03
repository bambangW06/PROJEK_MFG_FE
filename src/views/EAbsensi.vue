<template>
  <div class="container-fluid">
    <div class="card p-2 mb-2">
      <div class="d-flex justify-content-between align-items-center">
        <h4 class="text-center m-0">Absensi Member Tool & Coolant</h4>
      </div>
    </div>
    <div class="card mt-2">
      <h3 class="text-center m-0">{{ currentMonth }}</h3>

      <div ref="detailsCard" class="row mt-2">
        <!-- Grafik Red Shift Hadir -->
        <div class="col-md-6 mb-4" v-if="redShiftHadirSeries.length > 0">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Red Shift Hadir</h5>
              <ApexChart
                type="bar"
                :options="redShiftHadirOptions"
                :series="redShiftHadirSeries"
                @dataPointSelection="handleBarClick('redShiftHadir', $event)"
              />
            </div>
          </div>
        </div>
        <!-- Grafik White Shift Hadir -->
        <div class="col-md-6 mb-4" v-if="whiteShiftHadirSeries.length > 0">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">White Shift Hadir</h5>
              <ApexChart
                type="bar"
                :options="whiteShiftHadirOptions"
                :series="whiteShiftHadirSeries"
                @dataPointSelection="handleBarClick('whiteShiftHadir', $event)"
              />
            </div>
          </div>
        </div>

        <!-- Grafik Red Shift Libur -->
        <div class="col-md-6 mb-4" v-if="redShiftLiburSeries.length > 0">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Red Shift Absen</h5>
              <ApexChart
                type="bar"
                :options="redShiftLiburOptions"
                :series="redShiftLiburSeries"
                @dataPointSelection="handleBarClick('redShiftLibur', $event)"
              />
            </div>
          </div>
        </div>

        <!-- Grafik White Shift Libur -->
        <div class="col-md-6 mb-4" v-if="whiteShiftLiburSeries.length > 0">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">White Shift Absen</h5>
              <ApexChart
                type="bar"
                :options="whiteShiftLiburOptions"
                :series="whiteShiftLiburSeries"
                @dataPointSelection="handleBarClick('whiteShiftLibur', $event)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabel Detail Kehadiran -->
    <div v-if="clickedDetails.length > 0" ref="detailTable" class="card mt-4">
      <div class="card-body">
        <h5>Detail Kehadiran - {{ clickedEmployee }}</h5>
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(detail, index) in clickedDetails" :key="index">
              <td>{{ detail.date_absence }}</td>
              <td>{{ detail.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ApexChart from 'vue3-apexcharts'

export default {
  name: 'EAbsensi',
  components: {
    ApexChart,
  },
  data() {
    return {
      clickedEmployee: '',
      clickedDetails: [], // Menyimpan detail kehadiran yang diklik
      currentMonth: '',
    }
  },
  computed: {
    ...mapGetters(['Get_History_Absence']),
    redShiftHadirSeries() {
      const hadirCounts = this.countAbsensi(
        this.Get_History_Absence.redShiftHadir,
      )
      return [
        {
          name: 'Hadir',
          data: Object.values(hadirCounts),
        },
      ]
    },
    redShiftLiburSeries() {
      const liburCounts = this.countAbsensi(
        this.Get_History_Absence.redShiftLibur,
      )
      return [
        {
          name: 'Absen',
          data: Object.values(liburCounts),
        },
      ]
    },
    whiteShiftHadirSeries() {
      const hadirCounts = this.countAbsensi(
        this.Get_History_Absence.whiteShiftHadir,
      )
      return [
        {
          name: 'Hadir',
          data: Object.values(hadirCounts),
        },
      ]
    },
    whiteShiftLiburSeries() {
      const liburCounts = this.countAbsensi(
        this.Get_History_Absence.whiteShiftLibur,
      )
      return [
        {
          name: 'Absen',
          data: Object.values(liburCounts),
        },
      ]
    },
    redShiftHadirOptions() {
      return this.getChartOptions(this.Get_History_Absence.redShiftHadir)
    },
    redShiftLiburOptions() {
      return this.getChartOptions(this.Get_History_Absence.redShiftLibur)
    },
    whiteShiftHadirOptions() {
      return this.getChartOptions(this.Get_History_Absence.whiteShiftHadir)
    },
    whiteShiftLiburOptions() {
      return this.getChartOptions(this.Get_History_Absence.whiteShiftLibur)
    },
  },
  methods: {
    functionCurrentMonth() {
      const date = new Date()
      const month = date.getMonth() + 1
      const year = date.getFullYear()
      const months = [
        'Januari',
        'Februari',
        'Maret',
        'April',
        'Mei',
        'Juni',
        'Juli',
        'Agustus',
        'September',
        'Oktober',
        'November',
        'Desember',
      ]
      this.currentMonth = months[month - 1] + ' ' + year
    },
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
              // Batasi panjang label dengan menggunakan slice
              const maxLength = 10 // Panjang maksimal label
              return value.length > maxLength
                ? value.slice(0, maxLength) + '...'
                : value
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

      // Ambil data detail kehadiran berdasarkan nama karyawan
      const detailData = data.filter((item) => item.nama === employeeName)

      // Ambil nomor registrasi dari detail pertama
      const noreg = detailData.length > 0 ? detailData[0].noreg : ''

      // Urutkan detailData berdasarkan date_absence dari kecil ke besar
      this.clickedDetails = detailData
        .map((item) => ({
          date_absence: item.date_absence,
          status: item.status || (seriesIndex === 0 ? 'Hadir' : 'Libur'),
        }))
        .sort((a, b) => new Date(a.date_absence) - new Date(b.date_absence))

      this.clickedEmployee = `${employeeName} (${noreg})`
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
        this.clickedDetails.length > 0 && // Only check if details are shown
        this.$refs.detailsCard && // Make sure the ref exists
        !this.$refs.detailsCard.contains(event.target)
      ) {
        this.clickedDetails = [] // Hide the details
      }
    },
  },
  mounted() {
    this.functionCurrentMonth()
    this.$store.dispatch('Action_Get_History_Absence')
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside)
  },
}
</script>

<style scoped>
.container-fluid {
  padding: 20px;
}
.card-title {
  text-align: center;
  font-size: 1.25rem;
}
.table-bordered th {
  background-color: rgb(198, 240, 240);
  border: 1px solid black;
}
</style>
