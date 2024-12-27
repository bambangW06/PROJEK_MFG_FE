<template>
  <div class="container-fluid">
    <div class="card p-2 mb-2">
      <div class="d-flex justify-content-between align-items-center">
        <h4 class="text-center m-0">History Kuras</h4>
      </div>
    </div>
  </div>

  <div class="container-fluid">
    <div class="card p-2 mb-2">
      <div class="row">
        <div class="col">
          <div class="form-group">
            <label for="mesin"><strong>Line</strong></label>
            <v-select
              v-model="selectedLine"
              :options="GET_LINES"
              label="line_nm"
              placeholder="Pilih line..."
              @update:modelValue="onLineChange"
              :append-to-body="true"
            />
          </div>
        </div>
        <div class="col">
          <div class="form-group">
            <label for="mesin"><strong>Machine</strong></label>
            <v-select
              v-model="selectedMachine"
              :options="getMachinesNames"
              label="machine_nm"
              placeholder="Pilih mesin..."
              @update:modelValue="onMachineChange"
              :append-to-body="true"
            ></v-select>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="container-fluid">
    <div class="card p-2">
      <table class="table table-bordered table-striped">
        <thead class="table-primary text-center">
          <tr>
            <th>No</th>
            <th>Machine</th>
            <th>Tanggal</th>
            <th>Shift</th>
            <th>Reason Plan</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(history, index) in GET_HISTORY_KURAS" :key="index">
            <td class="text-center">{{ index + 1 }}</td>
            <td>{{ history.machine_nm }}</td>
            <td>{{ formatDate(history.actual_dt) }}</td>
            <td class="text-center">{{ history.shift }}</td>
            <td>{{ history.reason_plan }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import {
  ACTION_GET_HISTORY_KURAS,
  GET_HISTORY_KURAS,
} from '@/store/Coolant/HistoryKuras.module'
import { ACTION_GET_LINES, GET_LINES } from '@/store/Tool/MasterLines.module'
import { mapGetters } from 'vuex'

export default {
  name: 'HistoryKuras',
  data() {
    return {
      selectedLine: null,
      machineOptions: [],
      selectedMachine: null,
    }
  },
  computed: {
    ...mapGetters([GET_LINES, 'getMachinesNames', GET_HISTORY_KURAS]),
  },
  mounted() {
    this.$store.dispatch(ACTION_GET_LINES)
  },
  methods: {
    async onLineChange() {
      try {
        const line_id = this.selectedLine.line_id
        let response = await this.$store.dispatch('fetchMachines', line_id)
        if (response.status === 200) {
          this.machineOptions = this.getMachinesNames
        }
      } catch (error) {
        console.log(error)
      }
    },
    async onMachineChange() {
      try {
        const machine_id = this.selectedMachine.machine_id
        console.log('machine_id', machine_id)
        let response = await this.$store.dispatch(
          ACTION_GET_HISTORY_KURAS,
          machine_id,
        )
        if (response.status === 200) {
          this.$swal({
            icon: 'success',
            title: 'Success',
            text: 'Data saved successfully!',
          })
        }
      } catch (error) {
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: error,
        })
      }
    },
    formatDate(date) {
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }
      return new Date(date).toLocaleDateString('id-ID', options)
    },
  },
}
</script>

<style>
.table {
  margin-bottom: 0;
}
.table th,
.table td {
  vertical-align: middle;
}
</style>
