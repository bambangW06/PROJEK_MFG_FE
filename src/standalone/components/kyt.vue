<template>
  <div class="container-fluid m-2">
    <div class="card">
      <div class="row mt-3">
        <div class="col">
          <h2 class="text-center">{{ namaBulan }}</h2>
          <apexchart
            type="bar"
            :options="chartOptions"
            :series="chartSeries"
            @click="handleBarClick"
          />
        </div>
      </div>
      <div class="row mt-3" v-if="showTable">
        <div class="col">
          <table class="table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Nomor Registrasi</th>
                <th>Tanggal</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="attendance in selectedAttendance"
                :key="attendance.absen_id"
              >
                <td>{{ attendance.nama }}</td>
                <td>{{ attendance.noreg }}</td>
                <td>{{ attendance.formatted_date_absence }}</td>
                <td>{{ attendance.status }}</td>
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
import axios from 'axios'

export default {
  name: 'EAbsensi',
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      namaBulan: '',
      chartOptions: {
        xaxis: {
          categories: [],
        },
        plotOptions: {
          bar: {
            horizontal: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent'],
        },
        grid: {
          show: true,
          borderColor: '#f1f1f1',
        },
      },
      chartSeries: [],
      allAttendanceData: [],
      selectedAttendance: [],
      showTable: false,
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      try {
        const response = await axios.get(API_URL + '/histories/get')
        const responseData = response.data
        this.allAttendanceData = responseData.data
        // console.log('All attendance data:', this.allAttendanceData)

        const groupedData = this.groupByShift(this.allAttendanceData)
        this.chartOptions.xaxis.categories = Object.keys(groupedData)
        this.chartSeries = Object.entries(groupedData).flatMap(
          ([shift, shiftData]) => [
            {
              name: `Hadir (Red) - ${shift}`,
              data: this.getCountPerStatus(shiftData, 'Hadir', 'Red'),
            },
            {
              name: `Hadir (White) - ${shift}`,
              data: this.getCountPerStatus(shiftData, 'Hadir', 'White'),
            },
            {
              name: `Tidak Hadir (Red) - ${shift}`,
              data: this.getCountPerStatus(shiftData, 'Tidak Hadir', 'Red'),
            },
            {
              name: `Tidak Hadir (White) - ${shift}`,
              data: this.getCountPerStatus(shiftData, 'Tidak Hadir', 'White'),
            },
          ],
        )

        const latestAbsenceDate =
          responseData.data[responseData.data.length - 1].date_absence
        const latestAbsenceDateObj = new Date(latestAbsenceDate)
        const monthNames = [
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
        this.namaBulan = monthNames[latestAbsenceDateObj.getMonth()]
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    },
    groupByShift(data) {
      return data.reduce((acc, curr) => {
        if (!acc[curr.shift]) {
          acc[curr.shift] = {}
        }
        if (!acc[curr.shift][curr.nama]) {
          acc[curr.shift][curr.nama] = {}
        }
        if (!acc[curr.shift][curr.nama][curr.status]) {
          acc[curr.shift][curr.nama][curr.status] = 0
        }
        acc[curr.shift][curr.nama][curr.status]++
        return acc
      }, {})
    },
    getCountPerStatus(shiftData, status, color) {
      return Object.entries(shiftData).flatMap(([_, nameData]) =>
        Object.entries(nameData).map(
          ([_, statusData]) => statusData[status] || 0,
        ),
      )
    },
    handleBarClick(event, chartContext, config) {
      const shiftIndex = config.dataPointIndex
      const selectedShift = this.chartOptions.xaxis.categories[shiftIndex]
      if (selectedShift !== undefined) {
        const selectedShiftData = this.allAttendanceData.filter(
          (attendance) => attendance.shift === selectedShift,
        )
        this.selectedAttendance = selectedShiftData.flat()
        this.showTable = true
      } else {
        console.error('Selected shift: undefined')
      }
    },
  },
}
</script>
