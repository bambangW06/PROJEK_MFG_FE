<template>
  <div class="row align-items-center p-3">
    <div class="col text-center">
      <h2 class="font-weight-bold mb-0">Supervisor</h2>
    </div>
  </div>
  <div class="card card-spv" :class="statusClass">
    <div class="row mb-2">
      <div class="col-auto align-self-center pr-0">
        <button class="border-round" disabled>
          <img
            class="img-rd"
            :src="supervisor.photourl"
            alt="Foto Supervisor"
          />
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
                v-model="supervisor.nama"
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
                v-model="supervisor.noreg"
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
                v-model="supervisor.jabatan"
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
              v-model="supervisor.status"
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
import { ACTION_UPDATE_STATUS_SPV } from '@/store/Employee/AbsensiModule'
import {
  ACTION_GET_SUPERVISOR,
  GET_SUPERVISOR,
} from '@/store/Employee/EmployeeModule'
import { mapGetters } from 'vuex'

export default {
  name: 'AbsensiSupervisor',
  computed: {
    ...mapGetters([GET_SUPERVISOR, 'getHistoryAbsence']),
    supervisor() {
      return Array.isArray(this.GET_SUPERVISOR) &&
        this.GET_SUPERVISOR.length > 0
        ? this.GET_SUPERVISOR[0]
        : {}
    },
    statusClass() {
      return {
        'red-border': this.supervisor.status !== 'Hadir',
        'green-border': this.supervisor.status === 'Hadir',
        'not-border': this.supervisor.status === '',
      }
    },
  },
  watch: {
    getHistoryAbsence: {
      handler(newHistory) {
        if (!newHistory || !Array.isArray(newHistory)) return

        const latestStatus = newHistory.find(
          (h) => h.employee_id === this.supervisor.employee_id,
        )

        if (latestStatus) {
          this.supervisor.status = latestStatus.status
        }
      },
      deep: true,
    },
  },

  mounted() {
    this.$store.dispatch(ACTION_GET_SUPERVISOR).then(() => {
      this.$store.dispatch('fetchHistoryAbsence')
    })
  },
  methods: {
    async updateStatus() {
      console.log('kepanggil')

      try {
        const payload = {
          employee_id: this.supervisor.employee_id,
          nama: this.supervisor.nama,
          noreg: this.supervisor.noreg,
          jabatan: this.supervisor.jabatan,
          status: this.supervisor.status,
        }
        let response = await this.$store.dispatch(
          ACTION_UPDATE_STATUS_SPV,
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
