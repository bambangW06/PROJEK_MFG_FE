<template>
  <div class="modal" tabindex="-1" id="modalPlanSchedule">
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
            <select
              class="form-select"
              v-model="selectedSearchLine"
              @change="onLineChange('selectedSearchLine')"
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
          <div class="multiselect-container">
            <Multiselect
              class="sz-dw"
              v-model="selectedSearchMachine"
              :options="getMachinesNames"
              :multiple="true"
              :disabled="!selectedSearchLine"
              track-by="machine_id"
              label="machine_nm"
              placeholder="Pilih mesin..."
              :taggable="true"
              @select="searchPlanSchedule"
            >
            </Multiselect>
          </div>

          <label class="form-label" for="selectedDate">Planing Kuras</label>
          <div class="input-group">
            <input
              class="form-control"
              type="text"
              ref="datePicker"
              v-model="modalFormData.date"
              placeholder="Pilih tanggal..."
            />
            <div class="input-group-append">
              <button
                class="btn btn-outline-secondary sz-up"
                type="button"
                @click="showSearchDatePicker('datePicker')"
              >
                <span class="fa fa-calendar"></span>
              </button>
            </div>
          </div>
          <label for="">Shift</label>
          <select v-model="modalFormData.shift" class="form-control">
            <option disable selected></option>
            <option>Red</option>
            <option>White</option>
          </select>
          <label for="reason">Reason</label>
          <input
            type="text"
            v-model="modalFormData.reason"
            class="form-control"
          />
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
            @click="addPlanSchedule"
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
  <div class="card">
    <h3 class="text-center">Schedule Kuras Bulan : {{ currenthMonth }}</h3>
  </div>
  <div class="card mt-2">
    <div class="card-body">
      <div class="table-responsive">
        <div class="row">
          <div class="col">
            <nav aria-label="Page navigation">
              <ul class="pagination justify-content-center mb-0">
                <li
                  class="page-item"
                  :class="{ disabled: selectedMonth === 1 }"
                >
                  <button
                    class="page-link"
                    @click="goToPage(selectedMonth - 1)"
                  >
                    <span aria-hidden="true">&laquo;</span>
                    <span class="sr-only">Previous</span>
                  </button>
                </li>
                <li
                  class="page-item"
                  v-for="month in months"
                  :key="month.value"
                  :class="{ active: selectedMonth === month.value }"
                >
                  <button class="page-link" @click="goToPage(month.value)">
                    {{ month.text }}
                    <span
                      v-if="monthWarnings[`${month.value}-${selectedYear}`]"
                      class="badge text-white badge-circle"
                    >
                      !
                    </span>
                  </button>
                </li>
                <li
                  class="page-item"
                  :class="{ disabled: selectedMonth === 12 }"
                >
                  <button
                    class="page-link"
                    @click="goToPage(selectedMonth + 1)"
                  >
                    <span aria-hidden="true">&raquo;</span>
                    <span class="sr-only">Next</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <div class="row mt-2">
          <div class="col">
            <input
              type="text"
              class="form-control"
              placeholder="Search Machine..."
              v-model="searchQuery"
              style="width: fit-content"
            />
          </div>
          <div
            class="col-auto ms-auto d-flex justify-content-end align-items-center"
          >
            <button
              class="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#modalPlanSchedule"
            >
              <i class="fas fa-edit"></i> Edit Schedule
            </button>
          </div>
        </div>

        <table class="table custom-table tbl-emp table-bordered mt-1">
          <thead>
            <tr>
              <th style="width: 5%">No</th>
              <th style="width: 10%">Line</th>
              <th style="width: 13%">Mesin</th>
              <th style="width: 10%">Periodik</th>
              <th style="width: 10%">Plan</th>
              <th style="width: 12%">Shift</th>
              <th style="width: 15%">Actual</th>
              <th style="width: 15%">Alasan Kuras</th>
              <th style="width: 15%">Status</th>
              <th style="width: 10%">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(kuras, index) in filteredData"
              :key="kuras.schedule_id"
              :class="rowClass(index)"
            >
              <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
              <td>{{ kuras.line_nm }}</td>
              <td>{{ kuras.machine_nm }}</td>
              <td>{{ kuras.period_val }} {{ kuras.period_nm }}</td>
              <td>{{ kuras.plan_dt }}</td>
              <td>
                <select v-model="kuras.shift" class="form-select">
                  <option value="" disabled selected></option>
                  <option value="Red">Red</option>
                  <option value="White">White</option>
                </select>
              </td>
              <td>
                <div class="d-flex align-items-center">
                  <input
                    type="text"
                    class="form-control"
                    v-model="actualDates[index]"
                    :ref="`actualDate_${index}`"
                    @change="changeStatus(index, kuras.plan_dt)"
                  />
                  <div class="input-group-append">
                    <button
                      class="btn btn-outline-secondary"
                      type="button"
                      @click="showActualDate(`actualDate_${index}`, index)"
                    >
                      <span class="fa fa-calendar"></span>
                    </button>
                  </div>
                </div>
              </td>
              <td>
                <input
                  v-model="kuras.reason_plan"
                  type="text"
                  class="form-control"
                />
              </td>
              <td>
                <input
                  class="form-control"
                  type="text"
                  v-model="statusKuras[index]"
                  readonly
                />
              </td>
              <td>
                <button
                  v-if="!isSaved[(currentPage - 1) * pageSize + index]"
                  type="button"
                  class="btn btn-primary"
                  @click="saveSchedule(index)"
                >
                  Simpan
                </button>
                <button v-else type="button" class="btn btn-success">
                  Selesai
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- /.table-responsive -->
    </div>
    <!-- /.card-body -->
  </div>
  <!-- /.card -->

  <!-- /card -->
</template>
<script>
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.css'
import { mapGetters } from 'vuex'
import flatpickr from 'flatpickr'
import 'flatpickr/dist/flatpickr.css'
import moment from 'moment-timezone'

export default {
  name: 'PlanSchedule',
  components: {
    Multiselect,
  },
  data() {
    return {
      searchQuery: '',
      currentPage: 1,
      pageSize: 40,
      datepickerInstances: {},
      actualDates: [],
      selectedIndex: null,
      statusKuras: [],
      selectedSearchLine: null,
      selectedSearchMachine: [],
      modalFormData: {
        date: '',
        shift: '',
        reason: '',
      },
      isSaved: [],
      currenthMonth: this.getCurrentMonth(),
      selectedMonth: new Date().getMonth() + 1, // Initialize to the current month (1-12)
      selectedYear: new Date().getFullYear(),
      months: [
        { text: 'Jan', value: 1 },
        { text: 'Feb', value: 2 },
        { text: 'Mar', value: 3 },
        { text: 'Apr', value: 4 },
        { text: 'Mei', value: 5 },
        { text: 'Juni', value: 6 },
        { text: 'Juli', value: 7 },
        { text: 'Agst', value: 8 },
        { text: 'Sept', value: 9 },
        { text: 'Okt', value: 10 },
        { text: 'Nov', value: 11 },
        { text: 'Des', value: 12 },
      ],
    }
  },
  computed: {
    ...mapGetters([
      'getPlanKuras',
      'getLineNames',
      'getMachinesNames',
      'getSearchPlanKuras',
      'getDataSchedules',
      'mergedPlanKuras',
    ]),
    totalPages() {
      // Fixed to 12 as we are representing 12 months
      return 12
    },
    paginatedData() {
      const data = this.mergedPlanKuras
      // console.log('data', data)

      // Get the current year
      const currentYear = new Date().getFullYear()

      return data.filter((kuras) => {
        // Parse the date in DD-MM-YYYY format to extract the month and year
        const [day, month, year] = kuras.plan_dt.split('-').map(Number)
        // console.log('Parsed date', { day, month, year })

        // Check if the month and year match the selected month and current year
        return month === this.selectedMonth && year === currentYear
      })
    },
    filteredData() {
      if (!this.searchQuery) {
        return this.paginatedData
      }

      const lowerCaseQuery = this.searchQuery.toLowerCase()

      return this.paginatedData.filter((kuras) => {
        return kuras.machine_nm.toLowerCase().includes(lowerCaseQuery)
      })
    },
    monthWarnings() {
      const warnings = {}
      const currentDate = new Date()
      const currentMonth = currentDate.getMonth() + 1 // Bulan saat ini (1-12)
      const currentYear = currentDate.getFullYear() // Tahun saat ini

      // Loop melalui semua data jadwal yang sudah di-merge
      this.mergedPlanKuras.forEach((kuras) => {
        const [day, month, year] = kuras.plan_dt.split('-').map(Number)
        const planDate = new Date(year, month - 1, day)
        const key = `${month}-${year}`

        // Cek apakah bulan tersebut sudah memiliki warning
        if (!warnings[key]) {
          warnings[key] = false
        }

        // Update warning jika statusnya kosong dan planDate sudah lewat
        // serta bulan dan tahun bukan bulan dan tahun saat ini
        if (
          !kuras.status &&
          planDate < currentDate &&
          (month < currentMonth || year < currentYear)
        ) {
          warnings[key] = true
        }
      })

      return warnings
    },

    currentMonthWithYear() {
      return `${this.months.find((m) => m.value === this.selectedMonth).text} ${
        this.selectedYear
      }`
    },
  },
  watch: {
    selectedSearchMachine() {
      this.searchPlanSchedule() // Fetch schedules after machine is selected
    },
    getSearchPlanKuras: {
      handler(newSchedules) {
        // Update modal data when getSchedules changes
        this.updateModalFormData()
      },
      immediate: true, // Also run this on component mount
    },
    paginatedData(newData) {
      // Panggil initializeData() ketika paginatedData() berubah
      this.initializeData()
    },
    selectedMonth(newMonth) {
      this.updateCurrentMonthWithYear()
    },
  },
  mounted() {
    // Fetch all required data
    Promise.all([
      this.$store.dispatch('ActionGetHistorySchedules'),
      this.$store.dispatch('fetchPlanKuras'),
      this.$store.dispatch('fetchLines'),
      this.$store.dispatch('fetchGeneratePlanKuras'),
    ]).then(() => {
      this.initializeData() // Initialize data after all fetches complete
    })
  },

  methods: {
    updateCurrentMonthWithYear() {
      this.currenthMonth = `${
        this.months.find((m) => m.value === this.selectedMonth).text
      } ${this.selectedYear}`
    },
    rowClass(index) {
      // Ambil status dari array statusKuras
      const status = this.statusKuras[index]

      // Kembalikan nama kelas berdasarkan status
      return {
        'table-success': status === 'On Schedule',
        'table-warning': status === 'Delayed',
      }
    },
    getCurrentMonth() {
      const date = new Date()

      // Get the current month and year
      const monthIndex = date.getMonth() // getMonth() returns 0-11
      const year = date.getFullYear()

      // Array of month names in Indonesian
      const months = [
        'Januari',
        'Februari', // Corrected spelling from 'Febuari' to 'Februari'
        'Maret',
        'April',
        'Mei', // Corrected spelling from 'Mai' to 'Mei'
        'Juni',
        'Juli',
        'Agustus',
        'September',
        'Oktober',
        'November',
        'Desember',
      ]

      // Return the current month name and year as a single string
      return `${months[monthIndex]} ${year}`
    },

    initializeData() {
      const data = this.paginatedData
      if (!data || data.length === 0) return

      this.actualDates = data.map((kuras) => kuras.actual_dt || '')
      this.statusKuras = data.map((kuras) => kuras.status || '')
      this.isSaved = data.map((kuras) => kuras.is_saved || false)
      // console.log('actualDates:', this.actualDates)
      // console.log('statusKuras:', this.statusKuras)
      // console.log('isSaved:', this.isSaved)
    },
    async savePlanShift(index) {
      const payload = {
        planShift: this.paginatedData[index].shift,
      }
      // console.log(payload)
    },
    async saveSchedule(index) {
      if (
        !this.actualDates[index] &&
        !this.statusKuras[index] &&
        !this.paginatedData[index].reason_plan
      ) {
        return alert('Data Belum Lengkap')
      }
      const payload = {
        scheduleId: this.paginatedData[index].schedule_id, // ID dari item yang disimpan
        lineId: this.paginatedData[index].line_id, // ID mesin
        lineName: this.paginatedData[index].line_nm, // Nama mesin
        machineId: this.paginatedData[index].machine_id, // ID mesin
        machineName: this.paginatedData[index].machine_nm, // Nama mesin
        lastKrs: this.paginatedData[index].last_krs, // Kuras terakhir
        planDate: this.paginatedData[index].plan_dt, // Tanggal plan
        planShift: this.paginatedData[index].shift, // Shift plan
        actualDate: this.actualDates[index], // Data aktual yang akan disimpan
        planReason: this.paginatedData[index].reason_plan, // Alasan plan
        status: this.statusKuras[index],
      }
      // console.log('payload:', payload)
      await this.$store.dispatch('ActionSaveSchedules', payload).then(() => {
        this.$store
          .dispatch('ActionGetHistorySchedules')
          .then(() => {
            this.initializeData()
            this.isSaved.splice(index, 1, true) // Mark the row as saved
          })
          .then(() => {
            this.$store.dispatch('fetchGeneratePlanKuras')
          })
      })
    },
    goToPage(month) {
      if (month < 1) {
        // Jika pindah dari Januari ke Desember tahun sebelumnya
        this.selectedMonth = 12
        this.selectedYear -= 1
      } else if (month > 12) {
        // Jika pindah dari Desember ke Januari tahun berikutnya
        this.selectedMonth = 1
        this.selectedYear += 1
      } else {
        this.selectedMonth = month
      }
      this.updateCurrentMonthWithYear()
    },
    showActualDate(refName, index) {
      this.selectedIndex = index
      const datePickerInput = this.$refs[refName]

      if (!datePickerInput) {
        console.error(`Datepicker reference '${refName}' not found`)
        return
      }

      if (!this.datepickerInstances) {
        this.datepickerInstances = {} // Initialize if not already
      }

      if (!this.datepickerInstances[refName]) {
        this.datepickerInstances[refName] = flatpickr(datePickerInput, {
          dateFormat: 'd-m-Y',
          onChange: (selectedDates) => {
            if (selectedDates.length > 0) {
              const selectedDate = moment(selectedDates[0]).format('DD-MM-YYYY')
              this.actualDates[this.selectedIndex] = selectedDate
              this.changeStatus(
                this.selectedIndex,
                this.paginatedData[this.selectedIndex].plan_dt,
              )
            }
          },
        })

        // Ensure the datepicker opens immediately after initialization
        setTimeout(() => {
          this.datepickerInstances[refName].open()
        }, 100) // Adjust as needed
      } else {
        if (this.actualDates[this.selectedIndex]) {
          this.datepickerInstances[refName].setDate(
            this.actualDates[this.selectedIndex],
          )
        }
        // Ensure the datepicker opens immediately
        setTimeout(() => {
          this.datepickerInstances[refName].open()
        }, 100) // Adjust as needed
      }
    },

    changeStatus(index, plan_dt) {
      // Parsing actualDate dengan format yang sama dengan yang digunakan dalam plan_dt
      const actualDate = moment(this.actualDates[index], 'DD-MM-YYYY')
      console.log('Parsed Actual Date:', actualDate.format('YYYY-MM-DD'))

      // Parsing planningDate dengan format yang benar
      const planningDate = moment(plan_dt, 'DD-MM-YYYY')
      // console.log('Parsed Planning Date:', planningDate.format('YYYY-MM-DD'))

      // Periksa apakah actualDate setelah bulan dari planningDate
      const isAfterPlanningMonth = actualDate.isAfter(planningDate, 'month')
      // console.log('Is Actual Date After Planning Month?:', isAfterPlanningMonth)

      // Tentukan status berdasarkan pemeriksaan tanggal
      this.statusKuras[index] = isAfterPlanningMonth ? 'Delayed' : 'On Schedule'

      // Pastikan reaktivitas dijaga
      this.statusKuras = [...this.statusKuras]

      // console.log('Status Kuras:', this.statusKuras)
    },

    onLineChange(inputType) {
      if (inputType === 'selectedSearchLine' && this.selectedSearchLine) {
        this.$store.dispatch('fetchMachines', this.selectedSearchLine.line_id)
        // console.log('selectedSearchLine:', this.selectedSearchLine)
      }
    },
    updateModalFormData() {
      // Cari data yang sesuai dari getSchedules berdasarkan line dan machine
      if (this.selectedSearchLine && this.selectedSearchMachine) {
        const matchedSchedules = this.selectedSearchMachine.map(
          (selectedMachine) => {
            return this.getSearchPlanKuras.find(
              (schedule) =>
                schedule.line_id === this.selectedSearchLine.line_id &&
                schedule.machine_id === selectedMachine.machine_id,
            )
          },
        )

        // Ambil jadwal pertama yang ditemukan
        const schedule = matchedSchedules.find((sch) => sch !== undefined)

        if (schedule) {
          this.modalFormData.date = schedule.plan_dt || ''
          this.modalFormData.shift = schedule.shift || ''
          this.modalFormData.reason = schedule.reason || ''
        } else {
          // Reset modalFormData jika tidak ada data yang cocok
          this.modalFormData.date = ''
          this.modalFormData.shift = ''
          this.modalFormData.reason = ''
        }
      }
    },
    async addPlanSchedule() {
      const scheduleId = this.getSearchPlanKuras[0].schedule_id
      // console.log('scheduleId:', scheduleId)
      const payload = {
        schedule_id: scheduleId,
        line_id: this.selectedSearchLine.line_id,
        line_nm: this.selectedSearchLine.line_nm,
        machine_id: this.selectedSearchMachine.machine_id,
        machines: this.selectedSearchMachine.machine_nm,
        plan_dt: this.modalFormData.date,
        shift: this.modalFormData.shift,
        reason: this.modalFormData.reason,
      }
      // console.log('payload:', payload)
      await this.$store
        .dispatch('ActionEditSearchSchedule', payload)
        .then(() => {
          this.$store.dispatch('fetchPlanKuras')
        })

      // Reset modalFormData
      this.modalFormData = {
        schedule_id: '',
        line_id: '',
        line_nm: '',
        machine_id: '',
        machines: '',
        plan_dt: '',
        shift: '',
        reason: '',
      }
    },

    async searchPlanSchedule() {
      // console.log('kepanggil')

      // Ensure the selected machine is defined before dispatching the action
      if (!this.selectedSearchMachine) {
        return alert('Pilih line terlebih dahulu')
      }
      const machineNm = this.selectedSearchMachine
        .map((machine) => machine.machine_nm)
        .join(',')
      // console.log('machineNm:', machineNm)
      // Dispatch Vuex action to fetch schedules based on the selected machine's name
      await this.$store.dispatch('ActionSearchSchedules', machineNm)
    },

    showSearchDatePicker(refName) {
      const datePickerInput = this.$refs[refName] // Access ref directly

      if (!datePickerInput) {
        console.error(`Datepicker reference '${refName}' not found`)
        return
      }

      // Initialize the flatpickr instance if not already done
      if (!this.datepickerInstances[refName]) {
        this.datepickerInstances[refName] = flatpickr(datePickerInput, {
          dateFormat: 'Y-m-d',
          onChange: (selectedDates) => {
            if (selectedDates.length > 0) {
              const selectedDate = moment(selectedDates[0]).format('YYYY-MM-DD')
              this.modalFormData.date = selectedDate
              // console.log('selectedDate:', this.modalFormData.date)
            }
          },
        })
      }

      // Ensure the datepicker opens immediately after initialization
      setTimeout(() => {
        this.datepickerInstances[refName].open()
      }, 100) // Adjust as needed
    },
  },
}
</script>
<style>
.multiselect-container {
  display: flex;
  align-items: center; /* Center items vertically */
}
.table-success {
  background-color: #ffffff !important; /* Warna hijau untuk status "On Schedule" */
}

.table-warning {
  background-color: #f35c20 !important; /* Warna orange untuk status "Delayed" */
}

.tbl-emp th {
  background-color: rgb(243, 216, 60); /* Warna latar belakang th */
  height: 50px !important;
  text-align: center;
  vertical-align: middle;
}

.table-bordered {
  border: 1px solid black;
  text-align: center;
  border-collapse: collapse; /* Gabungkan batas tepi tabel */
  width: 100%;
}

.tbl-emp th,
.tbl-emp td {
  border: 1px solid black; /* Batas tepi untuk sel-sel dalam tabel */
  text-align: center;
  padding: 8px; /* Atur jarak antara konten dan batas tepi */
}
.badge-circle {
  width: 10px;
  height: 20px;
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  background-color: red;
}

/* Pastikan penyesuaian CSS diterapkan dengan benar */
</style>
