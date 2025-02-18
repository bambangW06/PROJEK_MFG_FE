<template>
  <div class="row align-items-center p-3">
    <div class="col text-center">
      <h2 class="font-weight-bold mb-0">Non Shift Member</h2>
    </div>
  </div>
  <div class="card card-spv" :class="statusClass">
    <div class="row mb-2">
      <div class="col-auto align-self-center pr-0">
        <button class="border-round" disabled>
          <img class="img-rd" :src="employee.photourl" alt="Foto NonShift" />
        </button>
      </div>
      <div class="col">
        <form>
          <div class="row align-items-center">
            <label
              for="name"
              class="col-auto col-form-label mb-0"
              style="width: 85px"
              >Nama</label
            >
            <div class="col pl-0">
              <input
                type="text"
                class="form-control bg"
                id="name"
                v-model="employee.nama"
              />
            </div>
          </div>
        </form>
        <form>
          <div class="row align-items-center">
            <label
              for="noreg"
              class="col-auto col-form-label mb-0"
              style="width: 85px"
              >Noreg</label
            >
            <div class="col pl-0">
              <input
                type="text"
                class="form-control bg"
                id="noreg"
                v-model="employee.noreg"
              />
            </div>
          </div>
        </form>
        <form>
          <div class="row align-items-center">
            <label
              for="jabatan"
              class="col-auto col-form-label mb-0"
              style="width: 85px"
              >Jabatan</label
            >
            <div class="col pl-0">
              <input
                type="text"
                class="form-control bg"
                id="jabatan"
                v-model="employee.jabatan"
              />
            </div>
          </div>
        </form>
        <div class="row align-items-center">
          <label
            for="status"
            class="col-auto col-form-label mb-0"
            style="width: 85px"
            >Status</label
          >
          <div class="col pl-0">
            <select
              class="form-control bg"
              id="status"
              v-model="employee.status"
              @change="updateStatus"
            >
              <option value="" disabled selected></option>
              <option value="Hadir">Hadir</option>
              <option value="Cuti">Cuti</option>
              <option value="Sakit">Sakit</option>
              <option value="Opname">Opname</option>
              <option value="Others">Others</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ACTION_POST_ABSEN_NONSHIFT } from '@/store/Employee/AbsensiModule'
import {
  ACTION_GET_NONSHIFT,
  GET_NONSHIFT,
} from '@/store/Employee/EmployeeModule'
import { mapGetters } from 'vuex'

export default {
  name: 'AbsensiNonShift',
  computed: {
    ...mapGetters(['getHistoryAbsence', GET_NONSHIFT]),
    employee() {
      console.log('GET_NONSHIFT', this.GET_NONSHIFT)

      return Array.isArray(this.GET_NONSHIFT) && this.GET_NONSHIFT.length > 0
        ? this.GET_NONSHIFT[0]
        : {}
    },
    statusClass() {
      return {
        'red-border': this.employee.status !== 'Hadir',
        'green-border': this.employee.status === 'Hadir',
        'not-border': this.employee.status === '',
      }
    },
  },
  watch: {
    getHistoryAbsence: {
      handler(newHistory) {
        if (!newHistory || !Array.isArray(newHistory)) return

        const latestStatus = newHistory.find(
          (h) => h.employee_id === this.employee.employee_id,
        )

        if (latestStatus) {
          this.employee.status = latestStatus.status
        }
      },
      deep: true,
    },
  },

  mounted() {
    this.$store.dispatch(ACTION_GET_NONSHIFT).then(() => {
      console.log('data', this.GET_NONSHIFT)

      this.$store.dispatch('fetchHistoryAbsence')
    })
  },
  methods: {
    async updateStatus() {
      console.log('kepanggil')

      try {
        const payload = {
          employee_id: this.employee.employee_id,
          nama: this.employee.nama,
          noreg: this.employee.noreg,
          jabatan: this.employee.jabatan,
          status: this.employee.status,
        }

        let response = await this.$store.dispatch(
          ACTION_POST_ABSEN_NONSHIFT,
          payload,
        )
        if (response === 201) {
          this.$store.dispatch('fetchHistoryAbsence')
        }
      } catch (error) {
        console.log(error)
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: 'Failed to save data.',
        })
      }
    },
  },
}
</script>
<style>
.card-spv {
  width: 48%;
}
</style>
