<template>
  <div class="modal" tabindex="-1" id="modalScheduleKuras">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Tambah Schedule</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <!-- Modal Header -->
        <div class="modal-body">
          <label>Line</label>
          <div class="input-group">
            <select
              class="form-select"
              v-model="selectedLine"
              @change="onLineChange('selectedLine')"
            >
              <option
                v-for="line in getLineNames"
                :key="line.line_id"
                :value="line"
              >
                {{ line.line_nm }}
              </option>
            </select>
          </div>
          <label>Mesin</label>
          <div class="input-group">
            <Multiselect
              class="sz-dw"
              v-model="selectedMachines"
              :options="getMachinesNames"
              :multiple="true"
              :disabled="!selectedLine"
              track-by="machine_id"
              label="machine_nm"
              placeholder="Pilih mesin..."
              :taggable="true"
            >
            </Multiselect>
          </div>
          <label class="form-label" for="selectedDate">Tanggal Kuras</label>
          <div class="input-group">
            <input
              class="form-control"
              type="text"
              ref="datePicker"
              v-model="selectedDate"
              placeholder="Pilih tanggal..."
            />
            <div class="input-group-append">
              <button
                class="btn btn-outline-secondary sz-up"
                type="button"
                @click="showDatePicker('datePicker')"
              >
                <span class="fa fa-calendar"></span>
              </button>
            </div>
          </div>
          <label for="">Periodik</label>
          <input
            v-model="selectedPeriodic"
            class="form-control"
            type="text"
            placeholder=""
          />
          <label for="">Waktu</label>
          <select v-model="selectedTime" class="form-control">
            <option disable selected></option>
            <option>Day</option>
            <option>Month</option>
            <option>Year</option>
          </select>
          <label>Shift</label>
          <select v-model="selectedShift" class="form-control">
            <option disable selected></option>
            <option>Red</option>
            <option>White</option>
          </select>
        </div>
        <!-- Modal Body -->

        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="addSchedule"
            data-bs-dismiss="modal"
          >
            Save
          </button>
        </div>
        <!-- Modal Footer -->
      </div>
    </div>
    <!--modal dialog-->
  </div>
  <!-- Modal Edit Schedule Kuras -->
  <div class="modal" tabindex="-1" id="modalEditScheduleKuras">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Edit Schedule</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <!-- Modal Header -->
        <div class="modal-body">
          <label>Line</label>
          <div class="input-group">
            <input
              class="form-select"
              v-model="editedSchedule.line_nm"
              disabled
            />
          </div>
          <label>Mesin</label>
          <input
            class="form-control"
            v-model="editedSchedule.machine_nm"
            disabled
          />
          <label for="">Periodik</label>
          <input
            v-model="editedSchedule.period_val"
            class="form-control"
            type="text"
            placeholder=""
          />
          <label for="">Waktu</label>
          <select v-model="editedSchedule.period_nm" class="form-control">
            <option value="" disabled selected>Pilih Waktu</option>
            <option>Day</option>
            <option>Month</option>
            <option>Year</option>
          </select>
          <label>Shift</label>
          <select v-model="editedSchedule.shift" class="form-control">
            <option value="" disabled selected>Pilih Shift</option>
            <option>Red</option>
            <option>White</option>
          </select>
        </div>
        <!-- Modal Body -->

        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="updateSchedule"
            data-bs-dismiss="modal"
          >
            Save
          </button>
        </div>
        <!-- Modal Footer -->
      </div>
    </div>
    <!-- Modal dialog -->
  </div>
  <!-- Modal Edit Schedule Kuras -->
  <!-- Modal Konfirmasi Delete -->
  <div class="modal" tabindex="-1" role="dialog" id="deleteConfirmationModal">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Konfirmasi Hapus Data Kuras</h5>
          <button
            type="button"
            class="close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          Apakah Anda yakin ingin menghapus data ini?
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Batal
          </button>
          <button
            type="button"
            class="btn btn-danger"
            @click="confirmDeleteSchedule"
            data-bs-dismiss="modal"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="container-fluid">
    <div class="card mt-3 p-2 text-center">
      <div class="row justify-content-center p-3 z-ind">
        <div class="card col-6">
          <div class="row">
            <div class="col">
              <h5 class="text-start">Line</h5>
              <div class="input-group mb-2">
                <select
                  class="form-select sz-hst"
                  v-model="selectedHistoryLine"
                  @change="onLineChange('selectedHistoryLine')"
                >
                  <option
                    v-for="line in getLineNames"
                    :key="line.line_id"
                    :value="line"
                  >
                    {{ line.line_nm }}
                  </option>
                </select>
              </div>
            </div>
            <div class="col">
              <h5 class="text-start">Mesin</h5>
              <div class="input-group" style="display: flex">
                <div style="flex: 1">
                  <Multiselect
                    class="sz-dw search-placeholder"
                    v-model="selectedMachineHistory"
                    :options="getMachinesNames"
                    :multiple="true"
                    :disabled="!selectedHistoryLine"
                    track-by="machine_id"
                    label="machine_nm"
                    placeholder="Pilih mesin..."
                    :taggable="true"
                    @select="onMachineChange"
                  >
                  </Multiselect>
                </div>
              </div>
            </div>
          </div>
          <!--row-->
        </div>
        <!--card-->
        <div class="col d-flex justify-content-end align-items-center">
          <button
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#modalScheduleKuras"
          >
            <i class="fas fa-plus"></i> Tambah Master Schedule
          </button>
        </div>
      </div>
      <div class="mt-3">
        <h3>Master Schedule</h3>
      </div>
      <nav aria-label="Page navigation" class="mt-2">
        <ul class="pagination justify-content-center mb-0">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="goToPage(currentPage - 1)">
              <span aria-hidden="true">&laquo;</span>
              <span class="sr-only">Previous</span>
            </button>
          </li>
          <li
            class="page-item"
            v-for="page in totalPages"
            :key="page"
            :class="{ active: currentPage === page }"
          >
            <button class="page-link" @click="goToPage(page)">
              {{ page }}
            </button>
          </li>
          <li
            class="page-item"
            :class="{ disabled: currentPage === totalPages }"
          >
            <button class="page-link" @click="goToPage(currentPage + 1)">
              <span aria-hidden="true">&raquo;</span>
              <span class="sr-only">Next</span>
            </button>
          </li>
        </ul>
      </nav>
      <div class="table-responsive">
        <table class="table custom-table tb-emp table-bordered mt-1">
          <thead>
            <tr>
              <th>No</th>
              <th>Line</th>
              <th>Mesin</th>
              <th>Shift</th>
              <th>Tanggal Kuras</th>
              <th>Periodik</th>
              <th>Waktu</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(schedules, index) in paginatedData"
              :key="schedules.schedule_id"
            >
              <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
              <td>{{ schedules.line_nm }}</td>
              <td>{{ schedules.machine_nm }}</td>
              <td>{{ schedules.shift }}</td>
              <td>{{ schedules.last_krs }}</td>
              <td>{{ schedules.period_val }}</td>
              <td>{{ schedules.period_nm }}</td>
              <td class="vAm">
                <button
                  type="button"
                  class="btn btn-sm"
                  data-bs-toggle="modal"
                  data-bs-target="#modalEditScheduleKuras"
                  @click="editSchedule(schedules, index)"
                >
                  <i class="fas fa-edit text-primary"></i>
                </button>
                <button
                  type="button"
                  class="btn btn-sm"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteConfirmationModal"
                  @click="deleteSchedule(schedules.schedule_id)"
                >
                  <i class="fas fa-trash-alt text-danger"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.css'
import UnderDevelopment from '@/standalone/components/underDevelopment.vue'
import flatpickr from 'flatpickr'
import 'flatpickr/dist/flatpickr.css'
import moment from 'moment-timezone'

export default {
  name: 'ScheduleKuras',
  components: {
    Multiselect,
    UnderDevelopment,
  },
  data() {
    return {
      selectedLine: null,
      selectedMachines: [],
      selectedDate: '',
      selectedShift: null,
      datepickerInstances: null,
      selectedPeriodic: '',
      selectedTime: null,
      selectedHistoryLine: null,
      selectedMachineHistory: [],
      selectedDataIndex: -1,
      editedSchedule: {
        line_id: null,
        line_nm: null,
        machine_id: null,
        machine_nm: null,
        period_val: '',
        period_nm: null,
        shift: null,
      },
      scheduleToDelete: null, // Tambahkan ini
      pageSize: 15, // Items per page
      currentPage: 1, // Current page
      searchResult: [],
    }
  },
  computed: {
    ...mapGetters(['getLineNames', 'getMachinesNames', 'getSchedules']),
    totalPages() {
      const data =
        this.searchResult.length > 0 ? this.searchResult : this.getSchedules
      return Math.ceil(data.length / this.pageSize)
    },
    paginatedData() {
      const data =
        this.searchResult.length > 0 ? this.searchResult : this.getSchedules
      const startIndex = (this.currentPage - 1) * this.pageSize
      const endIndex = this.currentPage * this.pageSize
      return data.slice(startIndex, endIndex)
    },
  },
  methods: {
    ...mapActions([
      'fetchLines',
      'fetchMachines',
      'fetchSchedules',
      'addSchedule',
    ]),
    goToPage(page) {
      if (page < 1 || page > this.totalPages) return
      this.currentPage = page
    },
    onLineChange(inputType) {
      if (inputType === 'selectedLine' && this.selectedLine) {
        this.$store.dispatch('fetchMachines', this.selectedLine.line_id)
      } else if (
        inputType === 'selectedHistoryLine' &&
        this.selectedHistoryLine
      ) {
        this.$store.dispatch('fetchMachines', this.selectedHistoryLine.line_id)
      }
    },
    showDatePicker(refName) {
      const datePickerInput = this.$refs[refName]

      if (!datePickerInput) {
        return
      }

      if (!this.datepickerInstances) {
        this.datepickerInstances = flatpickr(datePickerInput, {
          dateFormat: 'Y-m-d',
          onChange: (selectedDates) => {
            if (selectedDates.length > 0) {
              const selectedDate = moment(selectedDates[0]).format('YYYY-MM-DD')
              if (refName === 'datePicker') {
                this.selectedDate = selectedDate
              } else if (refName === 'editDatePicker') {
                this.editedSchedule.planingDate = selectedDate
              }
            }
          },
        })
      } else {
        this.datepickerInstances.setDate(new Date())
      }

      this.datepickerInstances.open()
    },
    addSchedule() {
      try {
        if (
          !this.selectedLine ||
          !this.selectedMachines.length ||
          !this.selectedDate ||
          !this.selectedShift
        ) {
          return alert('Isi semuanya kakak!')
        }

        const lineId = this.selectedLine.line_id
        const lineNm = this.selectedLine.line_nm

        const machines = this.selectedMachines.map((machine) => ({
          machine_id: machine.machine_id,
          machine_nm: machine.machine_nm,
        }))

        const planingDate = this.selectedDate
        const shift = this.selectedShift
        const payload = {
          line_id: lineId,
          line_nm: lineNm,
          machines: machines,
          last_krs: planingDate,
          shift: shift,
          periodVal: this.selectedPeriodic,
          periodNm: this.selectedTime,
        }
        this.$store.dispatch('addSchedule', payload)
        this.selectedLine = null
        this.selectedMachines = []
        this.selectedDate = ''
        this.selectedShift = null
        this.selectedPeriodic = ''
        this.selectedTime = null
        this.$store.dispatch('fetchGeneratePlanKuras')
      } catch (error) {
        console.error('Error:', error.message)
      }
    },
    async updateSchedule() {
      try {
        if (this.selectedDataIndex === -1) {
          console.log('Please select an item to edit.')
          return
        }

        const scheduleId = this.getSchedules[this.selectedDataIndex].schedule_id
        const lineNm = this.editedSchedule.line_nm
        const linId = this.editedSchedule.line_id
        const machineId = this.editedSchedule.machine_id
        const machines = this.editedSchedule.machine_nm

        const shift = this.editedSchedule.shift

        const editDataKuras = {
          schedule_id: scheduleId,
          line_nm: lineNm,
          line_id: linId,
          machines: machines,
          machine_id: machineId,
          shift: shift,
          periodVal: this.editedSchedule.period_val,
          periodNm: this.editedSchedule.period_nm,
        }
        // console.log('editedDataKuras', editDataKuras)
        await this.$store
          .dispatch('actionEditSchedule', editDataKuras)
          .then(() => {
            this.$store.dispatch('fetchGeneratePlanKuras')
          })

        this.editedSchedule = {
          line_nm: null,
          machine_nm: null,
          period_val: '',
          period_nm: null,
          shift: null,
        }
        // this.$store.dispatch('fetchGeneratePlanKuras')
      } catch (error) {
        console.error('Error:', error.message)
      }
    },
    async onMachineChange() {
      if (!this.selectedMachineHistory) {
        return alert('Pilih line terlebih dahulu')
      }
      const machineNm = this.selectedMachineHistory
        .map((machine) => machine.machine_nm)
        .join(',')
      await this.$store.dispatch('fetchSchedules', machineNm)
    },

    editSchedule(schedules, index) {
      this.selectedDataIndex = index
      this.editedSchedule = {
        scheduleId: schedules.schedule_id,
        line_id: schedules.line_id,
        line_nm: schedules.line_nm,
        machine_id: schedules.machine_id,
        machine_nm: schedules.machine_nm,
        last_krs: schedules.last_krs,
        period_val: schedules.period_val,
        period_nm: schedules.period_nm,
        shift: schedules.shift,
      }
      console.log('editedSchedule', this.editedSchedule)

      this.$nextTick(() => {
        if (this.$refs.editDatePicker && this.$refs.editDatePicker._flatpickr) {
          this.$refs.editDatePicker._flatpickr.setDate(
            this.editedSchedule.last_krs,
            true,
          )
        }
      })
    },
    deleteSchedule(schedule_id) {
      this.scheduleToDelete = { scheduleId: schedule_id }
      // console.log('scheduleToDelete', this.scheduleToDelete)
    },
    confirmDeleteSchedule() {
      if (!this.scheduleToDelete) {
        return
      }
      this.$store.dispatch('actionDeleteSchedule', this.scheduleToDelete)
      this.scheduleToDelete = null // Reset setelah penghapusan
    },
  },
  mounted() {
    this.fetchLines()
    this.$store.dispatch('fetchSchedules') // Fetch schedules on mount
    this.$store.dispatch('fetchGeneratePlanKuras')
  },
}
</script>

<style>
.sz-dw {
  height: 50%;
}
.z-ind {
  z-index: 2;
  position: relative;
}
.sz-hst {
  height: 40px !important;
}
input-group .flex-grow-1 {
  display: flex;
  align-items: center;
}

.multiselect {
  width: 100%;
}
.search-placeholder .multiselect__placeholder {
  display: flex;
  align-items: center;
  justify-content: space-between; /* Untuk memastikan teks dan ikon memiliki jarak di antara mereka */
  font-weight: bold;
  color: #f54453;
  font-size: 14px;
}
.tb-emp th {
  background-color: rgb(198, 240, 240);
  height: 50px !important;
}
.table-bordered {
  border: 1px solid black;
}
.pagination {
  display: flex;
  flex-wrap: wrap; /* Membungkus elemen saat melebihi lebar */
  justify-content: center; /* Menjaga pagination di tengah */
}

.page-item {
  margin: 0 5px; /* Jarak antara item pagination */
}

.page-link {
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .pagination {
    font-size: 0.85rem; /* Ukuran font lebih kecil di layar sempit */
  }
  .page-link {
    padding: 0.25rem 0.5rem; /* Mengurangi padding untuk layar kecil */
  }
}
</style>
