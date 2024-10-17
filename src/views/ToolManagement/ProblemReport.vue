<template>
  <div class="container-fluid">
    <div class="card p-2 mb-2">
      <div class="d-flex justify-content-between align-items-center">
        <h4 class="text-center m-0">Problem Report</h4>
        <div class="d-flex align-items-center">
          <span
            ><strong> {{ today }}</strong></span
          >
        </div>
      </div>
    </div>
  </div>

  <div class="container-fluid">
    <div class="card p-2">
      <div class="d-flex justify-content-between align-items-center mb-1">
        <!-- Shift dropdown di sebelah kiri -->
        <div class="d-flex align-items-center">
          <select
            class="form-select"
            v-model="selectedShift"
            style="max-width: 150px"
          >
            <option value="Siang">Siang</option>
            <option value="Malam">Malam</option>
          </select>
        </div>

        <!-- Tanggal input di sebelah kanan -->
        <div>
          <input
            type="date"
            class="form-control"
            style="max-width: 200px"
            v-model="selectedDate"
            @change="getProblemTable()"
          />
        </div>
      </div>
      <div class="card p-2 mt-2">
        <h4 class="text-center">Problem In Proses</h4>
        <div class="table-responsive">
          <table class="table table-bordered table-problem table-hover">
            <thead>
              <tr>
                <th>No</th>
                <th>Tanggal</th>
                <th>Jam</th>
                <th>Category</th>
                <th>Problem</th>
                <th>Waktu</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(problem, index) in filteredInProcess" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ problem.created_dt }}</td>
                <td>{{ problem.time_range }}</td>
                <td>{{ problem.category_nm }}</td>
                <td>{{ problem.problem_nm }}</td>
                <td>{{ problem.waktu }}'</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="card p-2 mt-2">
        <h4 class="text-center">Problem Next Proses</h4>
        <div class="table-responsive">
          <table class="table table-bordered table-problem table-hover">
            <thead>
              <tr>
                <th>No</th>
                <th>Tanggal</th>
                <th>Jam</th>
                <th>Line</th>
                <th>Masin</th>
                <th>Tool</th>
                <th>Act Counter</th>
                <th>Std Counter</th>
                <th>Problem</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(problem, index) in filteredNextProcess" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ problem.created_dt }}</td>
                <td>{{ problem.time_range }}</td>
                <td>{{ problem.line_nm }}</td>
                <td>{{ problem.machine_nm }}</td>
                <td>{{ problem.tool_nm }}</td>
                <td>{{ problem.act_counter }}</td>
                <td>{{ problem.std_counter }}</td>
                <td>{{ problem.problem_nm }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  ACTION_GET_PROBLEM_TABLE,
  GET_PROBLEM_IN_PROCESS,
  GET_PROBLEM_NEXT_PROCESS,
} from '@/store/LaporanHarian.module'
import { mapGetters } from 'vuex'

export default {
  name: 'ProblemReport',
  data() {
    return {
      today: new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      selectedDate: '',
      selectedShift: 'Siang',
    }
  },
  computed: {
    ...mapGetters([GET_PROBLEM_IN_PROCESS, GET_PROBLEM_NEXT_PROCESS]),

    filteredInProcess() {
      return this.GET_PROBLEM_IN_PROCESS.filter((problem) => {
        const timeRange = problem.time_range // Misal: "07:30 - 08:00"
        const [startTime, endTime] = timeRange.split(' - ').map((t) => {
          const [hour, minute] = t.split(':')
          return parseInt(hour) + parseInt(minute) / 60 // Mengubah menjadi format jam desimal
        })

        if (this.selectedShift === 'Siang') {
          return startTime >= 7 && endTime <= 20 // Jam siang
        } else {
          return startTime >= 20 || startTime < 7 // Jam malam
        }
      })
    },

    filteredNextProcess() {
      return this.GET_PROBLEM_NEXT_PROCESS.filter((problem) => {
        const timeRange = problem.time_range // Misal: "07:30 - 08:00"
        const [startTime, endTime] = timeRange.split(' - ').map((t) => {
          const [hour, minute] = t.split(':')
          return parseInt(hour) + parseInt(minute) / 60 // Mengubah menjadi format jam desimal
        })

        if (this.selectedShift === 'Siang') {
          return startTime >= 7 && endTime <= 20 // Jam siang
        } else {
          return startTime >= 20 || startTime < 7 // Jam malam
        }
      })
    },
  },
  mounted() {
    this.$store.dispatch(ACTION_GET_PROBLEM_TABLE, this.selectedDate)
    this.setShiftByCurrentTime()
  },
  methods: {
    setShiftByCurrentTime() {
      const now = new Date()
      const currentHour = now.getHours()
      // console.log(currentHour)

      if (currentHour >= 7 && currentHour < 20) {
        this.selectedShift = 'Siang'
      } else {
        this.selectedShift = 'Malam'
      }
    },
    async getProblemTable() {
      try {
        console.log(this.selectedDate)

        let response = await this.$store.dispatch(
          ACTION_GET_PROBLEM_TABLE,
          this.selectedDate,
        )
        if (
          response.data.data.inProcess.length === 0 &&
          response.data.data.nextProcess.length === 0
        ) {
          this.$swal({
            icon: 'error',
            text: 'Data Tidak Ada',
          })
        }
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>
<style>
.table-problem {
  text-align: center;
  border: 1px solid black;
}
.table-problem th {
  background-color: rgb(198, 240, 240);
  border: 1px solid black;
}
</style>
