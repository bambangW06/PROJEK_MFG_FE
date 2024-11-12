<template>
  <div class="container-fluid">
    <div class="card p-2 mb-2">
      <div class="d-flex justify-content-between align-items-center">
        <h4 class="text-center m-0">History Problem</h4>
        <div class="d-flex align-items-center">
          <span
            ><strong>{{ today }}</strong></span
          >
        </div>
      </div>
    </div>
  </div>
  <div class="container-fluid">
    <div class="card p-2 mb-2">
      <h4>Filter</h4>
      <div class="d-flex align-items-center">
        <div class="me-2">
          <select
            style="max-width: 200px"
            class="form-select"
            v-model="selectedProbem"
          >
            <option value="" disable selected>Pilih Category</option>
            <option value="inprocess">In Process</option>
            <option value="nextprocess">Next Process</option>
          </select>
        </div>
        <div>
          <input
            style="max-width: 200px"
            class="form-control"
            v-model="selectedMonth"
            type="month"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HistoryProblem',
  data() {
    return {
      selectedProbem: '',
      selectedMonth: '',
    }
  },
  computed: {
    today() {
      const date = new Date()
      let currentDate = new Date(date)

      let shiftSiangStart = new Date(currentDate)
      shiftSiangStart.setHours(7, 0, 0, 0)

      if (currentDate < shiftSiangStart) {
        currentDate.setDate(currentDate.getDate() - 1)
      }

      return currentDate.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    },
  },
}
</script>
