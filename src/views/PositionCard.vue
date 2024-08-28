<template>
  <div
    @mouseover="showPopover(position.key)"
    @mouseout="hidePopover(position.key)"
    :style="{
      position: 'absolute',
      top: position.top,
      left: position.left,
      width: '10%',
    }"
  >
    <div
      :class="{ 'not-default': !isDefaultEmployee, vacant: isVacantPosition }"
      class="card card-select"
    >
      <div class="card-body" style="padding: 2px">
        <h6 style="margin-bottom: 0%; text-align: center">
          {{ position.label }}
        </h6>
        <button v-if="selectedEmployee" class="rounded-button mt-0">
          <img class="img-pfl" :src="selectedEmployee.photourl" alt="" />
        </button>
        <select
          :value="selectedEmployee ? selectedEmployee.employee_id : ''"
          @change="handleChange"
        >
          <option
            v-for="employee in employees"
            :key="employee.employee_id"
            :value="employee.employee_id"
          >
            {{ employee.nama }}
          </option>
        </select>
        <!-- Tanda badge bulat merah untuk karyawan bukan default -->
        <span v-if="isBadgeVisible" class="badge">!</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    position: Object,
    selectedEmployee: Object,
    employees: Array,
  },
  computed: {
    // Check if the selected employee's position matches the actual or default position
    isDefaultEmployee() {
      if (!this.selectedEmployee) return false

      const preferredPosition = this.selectedEmployee.actual_position
        ? this.selectedEmployee.actual_position
        : this.selectedEmployee.default_position

      return preferredPosition === this.position.key
    },
    // Tentukan apakah badge harus ditampilkan atau tidak berdasarkan actual position
    isBadgeVisible() {
      // console.log('Selected Employee on position:', this.position.key, this.selectedEmployee)
      return (
        this.selectedEmployee &&
        this.selectedEmployee.status === 'Hadir' &&
        !this.isDefaultEmployee
      )
    },

    // Periksa apakah posisi ini kosong (tidak ada default employee)
    isVacantPosition() {
      return !this.selectedEmployee
    },
  },
  mounted() {
    console.log('PositionCard mounted with:', {
      position: this.position,
      selectedEmployee: this.selectedEmployee,
    })
  },
  methods: {
    handleChange(event) {
      const selectedId = event.target.value
      const selectedEmployee = this.employees.find(
        (employee) => employee.employee_id == selectedId,
      )
      console.log('Selected Employee:', selectedEmployee)
      this.$emit('update:selected-employee', selectedEmployee)
    },
    showPopover(positionKey) {
      this.$emit('show-popover', positionKey)
    },
    hidePopover(positionKey) {
      this.$emit('hide-popover', positionKey)
    },
  },
}
</script>

<style scoped>
.img-pfl {
  width: 100%;
  height: 100%;
  border: none;
  object-fit: cover;
}

select {
  width: 100%;
  padding: none;
  box-sizing: border-box;
  font-size: 7px;
}

.rounded-button {
  width: 100%;
  box-sizing: border-box;
  border: none;
  background-color: none;
  border-radius: 5px;
}

.card-select {
  width: 55%;
}
/* Gaya untuk badge bulat merah */
.badge {
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 3px 6px;
  position: absolute;
  top: 5px;
  right: 5px;
}
/* Gaya untuk posisi yang kosong */
.vacant {
  border: 2px solid red;
}
</style>
