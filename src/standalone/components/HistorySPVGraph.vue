<template>
  <ApexChart
    type="bar"
    height="350"
    :options="chartOptions"
    :series="series"
  ></ApexChart>
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
  props: {
    selectedMonth: String,
  },
  computed: {
    ...mapGetters([GET_ABSENSI_SPV_FOR_GRAPH]),
  },
  mounted() {
    this.$store
      .dispatch(ACTION_GET_HISTORY_ABSEN_SPV_FOR_GRAPH, this.selectedMonth)
      .then(() => {
        console.log('data', this.GET_ABSENSI_SPV_FOR_GRAPH)
      })
  },
}
</script>
