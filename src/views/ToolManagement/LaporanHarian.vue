<template>
  <div class="modal" tabindex="-1" id="viewProblemModal">
    <div class="modal-dialog">
      <div
        class="modal-content"
        :class="{
          'modal-extra-wide': modalType === 'next proses',
          'modal-xl': modalType !== 'next proses',
        }"
      >
        <div class="modal-header">
          <h5 class="modal-title">{{ modalTitle }}</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div v-if="modalType === 'category'" class="modal-body">
          <table class="table custom-modal table-bordered custom-table">
            <thead>
              <tr>
                <th style="width: 5%">No</th>
                <th style="width: 15%">Category</th>
                <th class="problem-column" style="width: 30%">Problem</th>
                <th style="width: 8%">Waktu</th>
                <th style="width: 8%">Action</th>
              </tr>
            </thead>
            <tbody v-if="GET_PROBLEM_MODAL.length > 0">
              <tr v-for="(problem, index) in GET_PROBLEM_MODAL" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ problem.category_nm }}</td>
                <td>{{ problem.problem_nm }}</td>
                <td>{{ problem.waktu }}'</td>
                <td>
                  <button
                    class="btn p-0 me-2"
                    data-bs-toggle="modal"
                    data-bs-target="#addProblemModal"
                    @click="editProblem(problem)"
                  >
                    <i class="fas fa-edit text-primary"></i>
                  </button>
                  <button
                    class="btn p-0"
                    data-bs-toggle="modal"
                    data-bs-target="#deleteProblemModal"
                    @click="deleteProblem(problem.problem_id)"
                  >
                    <i class="fas fa-trash text-danger" aria-hidden="true"></i>
                  </button>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="5" class="text-center">No Data</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="modalType === 'next proses'" class="modal-body">
          <table class="table custom-modal table-bordered custom-table">
            <thead>
              <tr>
                <th style="width: 7%">No</th>
                <th style="width: 8%">Line</th>
                <th style="width: 12%">Mesin</th>
                <th style="width: 20%">Tool</th>
                <th style="width: 13%">Counter</th>
                <th class="problem-column" style="width: 25%">Problem</th>
                <th style="width: 12%">Action</th>
              </tr>
            </thead>
            <tbody v-if="GET_PROBLEM_MODAL.length > 0">
              <tr v-for="(problem, index) in GET_PROBLEM_MODAL" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ problem.line_nm }}</td>
                <td>{{ problem.machine_nm }}</td>
                <td>{{ problem.tool_nm }}</td>
                <td>{{ problem.act_counter }}/{{ problem.std_counter }}</td>
                <td>
                  {{
                    problem.other_nm
                      ? `${problem.problem_nm} : ${problem.other_nm}`
                      : problem.problem_nm
                  }}
                </td>

                <td>
                  <button
                    class="btn p-0 me-2"
                    data-bs-toggle="modal"
                    data-bs-target="#addProblemModal"
                    @click="editProblem(problem)"
                  >
                    <i class="fas fa-edit text-primary"></i>
                  </button>
                  <button
                    class="btn p-0"
                    data-bs-toggle="modal"
                    data-bs-target="#deleteProblemModal"
                    @click="deleteProblem(problem.problem_id)"
                  >
                    <i class="fas fa-trash text-danger" aria-hidden="true"></i>
                  </button>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="7" class="text-center">No Data</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal" tabindex="-1" id="addProblemModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ modalTitle }}</h5>
          <!-- Ubah title sesuai modalTitle -->
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="resetModal"
          ></button>
        </div>
        <div v-if="modalType === 'category'" class="modal-body">
          <label>Category</label>
          <div>
            <select v-model="selectedCategory" class="form-select">
              <option
                v-for="category in GET_CATEGORIES"
                :key="category.category_id"
                :value="category"
              >
                {{ category.category_nm }}
              </option>
            </select>
          </div>

          <label>Problem</label>
          <div>
            <input type="text" class="form-control" v-model="problemCategory" />
          </div>

          <label>Waktu</label>
          <div class="d-flex align-items-center">
            <input
              type="number"
              class="form-control me-2"
              v-model="timeCategory"
            />
            <span class="form-control fc">menit</span>
          </div>
        </div>

        <div v-if="modalType === 'next proses'" class="modal-body">
          <label>Line</label>
          <div>
            <select
              class="form-select sz-hst"
              v-model="selectedLine"
              @change="onLineChange"
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
          <label for="">Machine</label>
          <div>
            <v-select
              :key="resetKey"
              v-model="selectedMachine"
              label="machine_nm"
              :options="machineOptions"
            >
            </v-select>
          </div>

          <label for="">Tool</label>
          <div>
            <v-select
              :key="resetKey"
              v-model="selectedTool"
              :options="toolOptions"
              label="tool_nm"
              @update:modelValue="onToolSelect"
            >
            </v-select>
          </div>

          <label>Counter</label>
          <div class="input-group">
            <input type="number" class="form-control" v-model="counter" />
            <span class="input-group-text">
              <strong>/ {{ stdCounter }}</strong></span
            >
          </div>

          <label> Problem</label>
          <div>
            <v-select
              id="problemNextProcess"
              :options="GET_MASTER_PROBLEMS"
              v-model="problemNextProcess"
              label="problem_nm"
            />
            <textarea
              v-if="
                (problemNextProcess &&
                  problemNextProcess.problem_nm === 'Other') ||
                problemNextProcessDescription
              "
              v-model="problemNextProcessDescription"
              class="form-control"
              placeholder="Deskripsikan problemnya"
            />
          </div>
        </div>

        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
            @click="resetModal"
          >
            Close
          </button>
          <button
            type="button"
            data-bs-dismiss="modal"
            class="btn btn-primary"
            @click="addProblem"
            :disabled="!isFormValid"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal" tabindex="-1" id="deleteProblemModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Delete Problem</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete this problem?</p>
        </div>
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
            class="btn btn-danger"
            @click="actionDeleteProblem()"
            data-bs-dismiss="modal"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="container-fluid">
    <div class="card p-2 mb-2">
      <div class="d-flex justify-content-between align-items-center">
        <h4 class="text-center m-0">Laporan Harian</h4>
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
            @change="getReport()"
          />
        </div>
      </div>

      <!-- Scroll hanya pada tabel -->
      <div class="table-wrapper">
        <table
          class="table custom-table tb-emp table-bordered"
          style="table-layout: fixed"
        >
          <thead class="sticky-thead">
            <tr>
              <th style="width: 95px">Time</th>
              <th style="width: 100px">Clean Room Request</th>
              <th style="width: 95px">Tool Addition</th>
              <th style="width: 115px">Regrinding & Setting Result</th>
              <th style="width: 100px">Tool Awaiting Processing</th>
              <th style="width: 150px">Processing Time for Awaiting Tools</th>
              <th>Problem In Proses</th>
              <th>Problem Next Proses</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in GET_TIME_RANGES" :key="index">
              <td>{{ item.time_range }}</td>
              <td>
                <input
                  class="form-control"
                  type="number"
                  v-model="item.from_clr"
                />
              </td>
              <td>
                <input
                  class="form-control"
                  type="number"
                  v-model="item.penambahan_tool"
                />
              </td>
              <td>
                <input
                  class="form-control"
                  type="number"
                  v-model="item.regrind_setting"
                />
              </td>
              <td>
                <input
                  class="form-control"
                  type="number"
                  :value="calculateToolDelay(item)"
                  readonly
                />
              </td>
              <td>
                <input
                  class="form-control"
                  type="text"
                  :value="`${calculateWaktuDelay(item)}'`"
                  readonly
                />
              </td>
              <td>
                <button
                  class="btn me-2"
                  data-bs-toggle="modal"
                  data-bs-target="#addProblemModal"
                  @click="
                    openModal(
                      item.time_range,
                      'Add Problem In Proses',
                      'category',
                    )
                  "
                >
                  <i class="fas fa-edit text-primary"></i>
                </button>
                <button
                  class="btn"
                  data-bs-toggle="modal"
                  data-bs-target="#viewProblemModal"
                  @click="
                    handleViewProblem(
                      item.time_range,
                      'View Problem in Proses',
                      'category',
                    )
                  "
                >
                  <i class="fas fa-eye text-danger"></i>
                </button>
              </td>
              <td>
                <button
                  class="btn me-2"
                  data-bs-toggle="modal"
                  data-bs-target="#addProblemModal"
                  @click="
                    openModal(
                      item.time_range,
                      'Add Problem Next Proses',
                      'next proses',
                    )
                  "
                >
                  <i class="fas fa-edit text-primary"></i>
                </button>
                <button
                  class="btn"
                  data-bs-toggle="modal"
                  data-bs-target="#viewProblemModal"
                  @click="
                    handleViewProblem(
                      item.time_range,
                      'View Problem Next Proses',
                      'next proses',
                    )
                  "
                >
                  <i class="fas fa-eye text-danger"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="row">
        <div class="col text-center">
          <div class="card">
            <h4>Result Regrinding</h4>
            <table class="table table-bordered custom-table table-oee">
              <thead>
                <tr>
                  <th>Man Power</th>
                  <th>Working Hours</th>
                  <th>Total Regrind</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input v-model="actMp" type="number" class="form-control" />
                  </td>
                  <td>
                    <input
                      v-model="jamKerja"
                      type="number"
                      class="form-control"
                    />
                  </td>
                  <td>
                    <input
                      :value="totalRegSetting"
                      type="number"
                      class="form-control"
                      readonly
                    />
                  </td>
                  <td>
                    <!-- Menampilkan nilai OEE menggunakan computed property -->
                    <input
                      :value="formattedOEE"
                      type="text"
                      class="form-control"
                      readonly
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="col text-center">
          <div class="card">
            <h4>Absensi Karyawan</h4>
            <table class="table table-bordered custom-table table-absensi">
              <thead>
                <tr>
                  <th>GL</th>
                  <th>TL</th>
                  <th
                    v-for="(item, index) in getKehadiranByJabatan(
                      'Team Member',
                    )"
                    :key="'opr-header-' + index"
                  >
                    OPR
                  </th>
                  <th>Ttl</th>
                  <th>Eva</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <span
                      v-for="item in getKehadiranByJabatan('Group Leader')"
                      :key="item.absen_id"
                    >
                      <span
                        v-if="item.status === 'Hadir'"
                        class="hollow-circle"
                      ></span>
                      <span v-else>❌</span>
                    </span>
                  </td>
                  <td>
                    <span
                      v-for="item in getKehadiranByJabatan('Team Leader')"
                      :key="item.absen_id"
                    >
                      <span
                        v-if="item.status === 'Hadir'"
                        class="hollow-circle"
                      ></span>
                      <span v-else>❌</span>
                    </span>
                  </td>
                  <td
                    v-for="item in getKehadiranByJabatan('Team Member')"
                    :key="item.absen_id"
                  >
                    <span
                      v-if="item.status === 'Hadir'"
                      class="hollow-circle"
                    ></span>
                    <span v-else>❌</span>
                  </td>
                  <td>{{ totalHadir }}</td>
                  <td>{{ evaluasiHadir }}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Treeselect from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'
import { mapGetters } from 'vuex'
import {
  ACTION_ADD_OEE,
  ACTION_ADD_PROBLEM,
  ACTION_ADD_PROBLEM_NEXT_PROCESS,
  ACTION_ADD_REPORT_REG_SET,
  ACTION_DELETE_PROBLEM,
  ACTION_GET_ABSENSI,
  ACTION_GET_CATEGORIES,
  ACTION_GET_OEE,
  ACTION_GET_PROBLEM_MODAL,
  ACTION_GET_REPORT_REG_SET,
  ACTION_GET_TIME_RANGES,
  ACTION_GET_TOOLS,
  ACTION_STD_COUNTER,
  GET_ABSENSI,
  GET_CATEGORIES,
  GET_OEE,
  GET_PROBLEM,
  GET_PROBLEM_MODAL,
  GET_REPORT,
  GET_STD_COUNTER,
  GET_TIME_RANGES,
  GET_TOOLS,
} from '@/store/Tool/LaporanHarian.module'

import moment from 'moment'
import {
  ACTION_GET_MASTER_PROBLEMS,
  GET_MASTER_PROBLEMS,
} from '@/store/Tool/MasterProblems.module'

export default {
  name: 'dummy',
  components: {
    Treeselect,
  },

  data() {
    return {
      problem_id: null,
      isEditMode: false,
      selectedShift: 'Siang',
      selectedDate: '',
      selectedTimeRange: '',
      modalTitle: '',
      modalType: '',
      selectedLine: null,
      selectedMachine: null,
      machine_id: null,
      machineOptions: [],
      tool_id: null,
      selectedTool: null,
      toolOptions: [],
      counter: '',
      stdCounter: '',
      problemNextProcess: '',
      problemNextProcessName: '',
      problemNextProcessDescription: '',
      modalType: '',
      selectedJam: '',
      selectedCategory: '',
      problemCategory: [],
      timeCategory: '',
      selectedProblemId: null,
      resetKey: 0,
      timeoutId: null,
      reportFlags: {},
      previousValues: {},
      actMp: '', // Input manual untuk Mp Opr
      jamKerja: '', // Input manual untuk Jam Kerja
      isFetching: false,
      shouldSend: false,
      hasManualInput: false,
      now: new Date(),
    }
  },
  computed: {
    ...mapGetters([
      'getLineNames',
      'getMachinesNames',
      GET_TOOLS,
      GET_CATEGORIES,
      GET_STD_COUNTER,
      GET_PROBLEM_MODAL,
      GET_REPORT,
      GET_OEE,
      GET_ABSENSI,
      GET_TIME_RANGES,
      GET_MASTER_PROBLEMS,
    ]),
    isFormValid() {
      if (this.modalType === 'category') {
        return (
          this.selectedCategory && this.problemCategory && this.timeCategory > 0
        )
      } else if (this.modalType === 'next proses') {
        return (
          this.selectedLine &&
          this.selectedMachine &&
          this.selectedTool &&
          this.counter > 0 &&
          this.problemNextProcess
        )
      } else if (
        this.modalType === 'next proses' &&
        this.problemNextProcessDescription
      ) {
        return (
          this.selectedLine &&
          this.selectedMachine &&
          this.selectedTool &&
          this.counter > 0 &&
          this.problemNextProcess &&
          this.problemNextProcessDescription
        )
      }
      return false // Default to false if modalType is not recognized
    },
    today() {
      // Dapatkan waktu sekarang
      let currentDate = new Date(this.now)

      // Atur batas waktu jam 07:00 hari ini
      let shiftSiangStart = new Date(currentDate)
      shiftSiangStart.setHours(7, 0, 0, 0) // Set waktu ke jam 07:00 hari ini

      // Jika waktu sekarang masih sebelum jam 07:00, gunakan tanggal kemarin
      if (currentDate < shiftSiangStart) {
        currentDate.setDate(currentDate.getDate() - 1) // Set tanggal ke kemarin
      }

      // Format tanggal dalam bahasa Indonesia
      return currentDate.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    },

    totalRegSetting() {
      if (!Array.isArray(this.GET_TIME_RANGES)) {
        return 0 // Kembalikan 0 jika GET_TIME_RANGES tidak terdefinisi
      }
      return this.GET_TIME_RANGES.reduce((total, item) => {
        return total + (parseFloat(item.regrind_setting) || 0)
      }, 0)
    },

    totalRequest() {
      if (!Array.isArray(this.GET_TIME_RANGES)) {
        return 0 // Kembalikan 0 jika GET_TIME_RANGES tidak terdefinisi
      }
      return this.GET_TIME_RANGES.reduce((total, item) => {
        return total + (parseFloat(item.from_clr) || 0)
      }, 0)
    },

    calculatedOEE() {
      const totalRequestValue = this.totalRequest // Retrieve total request
      const totalRegSettingValue = this.totalRegSetting // Retrieve total regrind setting

      if (totalRequestValue > 0) {
        let oeeValue = (totalRegSettingValue / totalRequestValue) * 100

        if (oeeValue > 100) {
          oeeValue = 100 // Set OEE to 100 if it exceeds 100%
        }

        return oeeValue.toFixed(2)
      }
      return 0 // Return 0 if total request is 0
    },

    formattedOEE() {
      return `${this.calculatedOEE}%` // Menggabungkan nilai OEE dengan simbol %
    },
    totalHadir() {
      return this.GET_ABSENSI.filter((item) => item.status === 'Hadir').length
    },
    evaluasiHadir() {
      // Cek apakah ada data absensi
      if (this.GET_ABSENSI.length === 0) {
        return 0 // Set persentase ke 0 jika tidak ada data
      }
      // Hitung persentase kehadiran
      return ((this.totalHadir / this.GET_ABSENSI.length) * 100).toFixed(2)
    },
  },
  watch: {
    selectedDate(newValue, oldValue) {
      // console.log('selectedDate changed from', oldValue, 'to', newValue)
      if (newValue !== oldValue) {
        this.absensiKaryawan()
        this.getTimeRanges()
        this.actMp = 0
        this.jamKerja = 0
        this.fetchOEE()
      }
    },
    selectedShift(oldValue, newValue) {
      if (newValue !== oldValue) {
        this.absensiKaryawan()
        // Reset nilai dan flag
        this.actMp = 0
        this.jamKerja = 0
        this.shouldSend = false
        this.getTimeRanges()
        this.getReport() // Mengambil data laporan saat shift berubah
        this.fetchOEE()
      }
    },
    actMp(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.shouldSend = true
        this.checkAndSend()
      }
    },
    jamKerja(newValue, oldValue) {
      if (newValue > 10) {
        this.jamKerja = '' // Reset jamKerja to 0
        this.$swal({
          icon: 'error',
          title: 'Oops...',
          text: 'JAM KERJA MELEBIHI 10 JAM',
        })
      } else if (newValue !== oldValue) {
        this.shouldSend = true
        this.checkAndSend()
      }
    },
    calculatedOEE(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.shouldSend = true
        this.checkAndSend()
      }
    },
    selectedLine(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.onLineChange()
      }
    },
    selectedTool(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.onToolSelect()
      }
    },
  },

  mounted() {
    this.setSelectedShift()
    this.getTimeRanges()
    this.getReport()
    this.$store.dispatch('fetchLines')
    this.$store.dispatch(ACTION_GET_CATEGORIES)
    this.$store.dispatch(ACTION_GET_REPORT_REG_SET, {
      selectedDate: this.selectedDate,
      shift: this.selectedShift,
    })
    this.fetchOEE()
    this.absensiKaryawan()
    this.$store.dispatch(ACTION_GET_MASTER_PROBLEMS)
  },
  methods: {
    setSelectedShift() {
      const now = new Date()
      const currentHour = now.getHours()
      // console.log(currentHour)

      if (currentHour >= 7 && currentHour < 20) {
        this.selectedShift = 'Siang'
      } else {
        this.selectedShift = 'Malam'
      }
    },
    openModal(timeRange, title, type) {
      this.selectedTimeRange = timeRange // Store the selected time_range
      this.setModalTitle(title, type) // Set the modal title and type
      // console.log('timerange', this.selectedTimeRange)
    },

    handleViewProblem(timeRange, title, type) {
      try {
        this.setModalTitle(title, type)
        this.selectedTimeRange = timeRange
        this.fetchProblemData()
        this.isEditMode = false // Set to add mode by default
      } catch (error) {
        console.log('Error saat handleViewProblem:', error)
      }
    },

    setModalTitle(title, type) {
      this.modalTitle = title
      this.modalType = type
    },

    // New method for opening modal in edit mode
    editProblem(problem) {
      // console.log('edit problem', problem)

      this.setModalTitle('Edit Problem', this.modalType) // Update title
      this.isEditMode = true // Switch to edit mode
      this.selectedProblem = problem // Store the selected problem for editing
      this.populateModalFields(problem) // Populate fields with problem dat
    },
    populateModalFields(problem) {
      if (this.modalType === 'category') {
        this.problem_id = problem.problem_id
        this.selectedCategory = this.GET_CATEGORIES.find(
          (category) => category.category_id === problem.category_id,
        )
        this.problemCategory = problem.problem_nm
        this.timeCategory = problem.waktu
        this.selectedTimeRange = problem.time_range || ''
      } else if (this.modalType === 'next proses') {
        // Line data
        this.problem_id = problem.problem_id
        this.selectedLine = this.getLineNames.find(
          (line) => line.line_id === problem.line_id,
        )
        this.selectedTimeRange = problem.time_range
        // Machine data dengan debugging
        this.selectedMachine = problem.machine_nm
        this.machine_id = problem.machine_id
        // console.log('Selected Machine:', this.selectedMachine)

        // Tool data dengan debugging
        this.selectedTool = problem.tool_nm
        this.tool_id = problem.tool_id
        // console.log('Selected Tool:', this.selectedTool)

        this.counter = problem.act_counter
        this.stdCounter = problem.std_counter
        this.problemNextProcess = problem.problem_nm
        // Jika problem_nm bernilai "Other", tambahkan problemNextProcessDescription
        this.problemNextProcessDescription = problem.other_nm
      }
    },

    async onToolSelect() {
      try {
        if (!this.selectedTool) {
          return
        }
        // Simpan tool yang dipilih
        this.tool_id = this.selectedTool.tool_id
        // console.log('Selected Tool:', this.tool_id)

        // Dispatch action untuk mendapatkan counter berdasarkan tool yang dipilih
        let response = await this.$store.dispatch(
          ACTION_STD_COUNTER,
          this.tool_id,
        )
        // console.log('Response dari ACTION_STD_COUNTER:', response)

        // Jika respons sukses dan data tersedia di GET_STD_COUNTER
        if (response.status === 200 && response.data.data.length > 0) {
          // Ambil stdCounter dari data yang diterima
          this.stdCounter = this.GET_STD_COUNTER[0].std_counter
        } else {
          // Handle jika respons tidak sesuai atau data kosong
          // console.log(
          //   'Tidak ada data counter yang ditemukan atau respons tidak berhasil.',
          // )
        }

        // console.log('stdCounter:', this.stdCounter)
      } catch (error) {
        // Tangani error jika terjadi kesalahan
        console.error('Error saat memilih tool:', error)
      }
    },
    async fetchProblemData() {
      // console.log('fetchProblemData dipanggil') // Log pemanggilan fetchProblemData
      try {
        const payload = {
          modalType: this.modalType, // Mengambil tipe modal dari state
          time_range: this.selectedTimeRange, // Mengambil jam yang dipilih dari state
          selectedDate: this.selectedDate, // Mengambil tanggal yang dipilih dari state
        }
        // console.log('payload fetchProblemData', payload)

        let response = await this.$store.dispatch(
          ACTION_GET_PROBLEM_MODAL,
          payload,
        )
        if (response.status === 200 && response.data.data.length > 0) {
          this.GET_PROBLEM_MODAL = response.data.data
          // console.log('GET_PROBLEM_MODAL:', this.GET_PROBLEM_MODAL)

          this.GET_PROBLEM_MODAL.forEach((item) => {
            // Pemetaan singkatan langsung di sini
            item.line_nm =
              item.line_nm === 'Cylinder Head'
                ? 'C/H'
                : item.line_nm === 'Cylinder Block'
                ? 'C/B'
                : item.line_nm === 'Crank Shaft'
                ? 'C/S'
                : item.line_nm === 'Cam Shaft'
                ? 'C/M'
                : item.line_nm // Tetap sama jika tidak ada dalam pemetaan
          })
        }
      } catch (error) {
        console.log('Error saat fetchProblemData:', error)
      }
    },
    async onLineChange() {
      // console.log('kepanggil')

      try {
        const selectedLine = this.selectedLine.line_id
        // console.log(selectedLine)
        const line_nm = this.selectedLine.line_nm
        await this.$store.dispatch('fetchMachines', selectedLine)

        this.machineOptions = this.getMachinesNames

        await this.$store.dispatch(ACTION_GET_TOOLS, line_nm)
        this.toolOptions = this.GET_TOOLS
      } catch (error) {
        console.log(error)
      }
    },
    async addProblem() {
      try {
        let payload

        // Tentukan apakah mode adalah 'edit' atau 'add'
        const mode = this.isEditMode ? 'edit' : 'add' // Misalnya `this.isEditMode` adalah flag yang menentukan apakah ini mode edit atau tambah
        if (this.modalType === 'category') {
          payload = {
            category_id: this.selectedCategory.category_id,
            problem_nm: this.problemCategory,
            waktu: this.timeCategory,
            time_range: this.selectedTimeRange,
            mode: mode,
          }
        } else if (this.modalType === 'next proses') {
          payload = {
            line_id: this.selectedLine.line_id,
            machine_id: this.selectedMachine.machine_id,
            tool_id: this.tool_id,
            act_counter: this.counter,
            time_range: this.selectedTimeRange,
            mode: mode,
          }
          if (this.problemNextProcessDescription) {
            payload.problem_nm = this.problemNextProcess.problem_nm
            payload.other_nm = this.problemNextProcessDescription
          } else {
            payload.problem_nm = this.problemNextProcess.problem_nm
          }
        }
        // Jika dalam mode edit, tambahkan problem_id ke payload
        if (this.isEditMode) {
          payload.problem_id = this.problem_id // Gantilah `selectedProblemId` dengan properti yang sesuai yang menyimpan ID masalah yang sedang diedit
        }
        // console.log('payload', payload)

        let response
        if (this.modalType === 'category') {
          response = await this.$store.dispatch(ACTION_ADD_PROBLEM, payload)
        } else if (this.modalType === 'next proses') {
          response = await this.$store.dispatch(
            ACTION_ADD_PROBLEM_NEXT_PROCESS,
            payload,
          )
        }

        // Jika response status 201 (berhasil)
        if (response.status === 201) {
          this.$swal({
            icon: 'success',
            title: 'Success',
            text: 'Data added successfully',
          })

          // Jika mode edit, panggil ACTION_GET_PROBLEM_MODAL
          if (this.isEditMode) {
            this.fetchProblemData()
          }
        }

        this.resetModal()
      } catch (error) {
        console.log(error)
      }
    },
    calculateToolDelay(item) {
      const fromClr = item.from_clr
      const penambahanTool = item.penambahan_tool
      const regrindSetting = item.regrind_setting

      // Calculate tool_delay
      const toolDelay = fromClr + penambahanTool - regrindSetting

      // Update the item object directly if needed
      item.tool_delay = toolDelay
      return toolDelay
    },

    calculateWaktuDelay(item) {
      const toolDelay = this.calculateToolDelay(item)

      // Hanya lanjutkan jika ada toolDelay yang valid
      if (toolDelay > 0) {
        const newWaktuDelay = toolDelay * 15

        // Cek perubahan pada waktu_delay
        if (item.waktu_delay !== newWaktuDelay) {
          item.waktu_delay = newWaktuDelay
          item.isReported = false

          const isToday =
            !this.selectedDate ||
            this.selectedDate === moment().format('YYYY-MM-DD')

          // Periksa perubahan di previousValues sebelum mengirim laporan
          const prev = this.previousValues[item.time_id] || {}
          const hasChanged =
            (item.from_clr !== prev.from_clr && item.from_clr !== 0) ||
            (item.penambahan_tool !== prev.penambahan_tool &&
              item.penambahan_tool !== 0) ||
            (item.regrind_setting !== prev.regrind_setting &&
              item.regrind_setting !== 0)

          if (hasChanged && isToday) {
            // Simpan nilai terbaru ke previousValues
            this.previousValues[item.time_id] = {
              from_clr: item.from_clr,
              penambahan_tool: item.penambahan_tool,
              regrind_setting: item.regrind_setting,
            }

            // Reset reportFlags untuk memungkinkan pengiriman ulang
            this.reportFlags[item.time_id] = false

            clearTimeout(this.timeoutId)
            this.timeoutId = setTimeout(() => {
              this.addReportReg(item.time_range, item)
              this.reportFlags[item.time_id] = true // Tandai sebagai sudah dilaporkan
            }, 3000)
          }
        }
        return newWaktuDelay
      } else {
        return item.waktu_delay || 0
      }
    },

    async addReportReg(timeRange, item) {
      // Cek jika item sudah dilaporkan untuk menghindari duplikasi
      if (this.reportFlags[item.time_id]) return

      // Verifikasi semua field yang dibutuhkan ada
      if (
        !item.from_clr ||
        !item.penambahan_tool ||
        !item.regrind_setting ||
        !item.tool_delay ||
        !item.waktu_delay
      ) {
        // console.log('Incomplete item data:', item)
        return
      }

      try {
        const payload = {
          shift: this.selectedShift,
          time_range: timeRange,
          from_gel: item.from_clr,
          penambahan: item.penambahan_tool,
          reg_set: item.regrind_setting,
          tool_delay: item.tool_delay,
          time_delay: item.waktu_delay,
        }

        const response = await this.$store.dispatch(
          ACTION_ADD_REPORT_REG_SET,
          payload,
        )

        if (response.status === 201) {
          // console.log('Report successfully sent for item:', item)
          this.reportFlags[item.time_id] = true // Tandai item sebagai sudah dilaporkan
          await this.getReport() // Refresh report data setelah berhasil submit
        }
      } catch (error) {
        console.error('Error in addReportReg:', error)
        this.$swal({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        })
      }
    },
    async getTimeRanges() {
      let response = await this.$store.dispatch(
        ACTION_GET_TIME_RANGES,
        this.selectedShift,
      )
      if (response.status === 200) {
        this.GET_TIME_RANGES.forEach((item) => {
          item.tool_delay = item.tool_delay || ''
          item.waktu_delay = item.waktu_delay || ''
          item.from_clr = item.from_clr || ''
          item.penambahan_tool = item.penambahan_tool || ''
          item.regrind_setting = item.regrind_setting || ''
        })
      }
    },
    async getReport() {
      try {
        const payload = {
          selectedDate: this.selectedDate,
          shift: this.selectedShift,
        }

        const response = await this.$store.dispatch(
          ACTION_GET_REPORT_REG_SET,
          payload,
        )

        // Pastikan selectedDate memiliki format yang benar jika ada nilai
        if (this.selectedDate) {
          this.selectedDate = moment(this.selectedDate).format('YYYY-MM-DD')
        }

        // Kondisi untuk menampilkan alert jika data kosong dan tanggal dipilih bukan hari ini
        const isToday = this.selectedDate === moment().format('YYYY-MM-DD')

        // console.log('Tanggal terpilih:', this.selectedDate)
        // console.log('isToday:', isToday)
        // console.log('Data Response:', response.data.data)

        // Tampilkan alert "NO DATA!" hanya jika data kosong, ada `selectedDate`, dan tanggal bukan hari ini
        if (response.data.data.length === 0 && this.selectedDate && !isToday) {
          this.$swal({
            icon: 'error',
            text: 'NO DATA!',
          })
          return
        }

        // Pembaruan data berdasarkan report yang diterima
        this.GET_TIME_RANGES.forEach((item) => {
          const reportData = response.data.data.find(
            (report) => report.time_range === item.time_range,
          )

          if (reportData) {
            Object.assign(item, {
              from_clr: reportData.from_gel,
              penambahan_tool: reportData.penambahan,
              regrind_setting: reportData.reg_set,
              tool_delay: reportData.tool_delay,
              waktu_delay: reportData.time_delay,
            })
          } else {
            // Reset nilai jika tidak ada data
            Object.assign(item, {
              from_clr: '',
              penambahan_tool: '',
              regrind_setting: '',
              tool_delay: '',
              waktu_delay: '',
            })
          }
        })
      } catch (error) {
        console.error('Error in getReport:', error)
      } finally {
        this.isFetching = false // Reset flag setelah selesai
      }
    },

    deleteProblem(problemId) {
      this.selectedProblemId = problemId
      // console.log('ini problem id', this.selectedProblemId)
    },
    async actionDeleteProblem() {
      try {
        // Siapkan payload sesuai dengan tipe modal
        let payload
        if (this.modalType === 'category') {
          payload = {
            modalType: this.modalType,
            id: this.selectedProblemId,
          }
        } else if (this.modalType === 'next proses') {
          payload = {
            modalType: this.modalType,
            id: this.selectedProblemId,
          }
        }

        // Panggil API untuk delete
        let response = await this.$store.dispatch(
          ACTION_DELETE_PROBLEM,
          payload,
        )

        if (response.status === 200) {
          // Jika delete berhasil, hapus item dari data yang ditampilkan di modal
          this.updateModalView()

          // Tampilkan pesan sukses
          this.$swal({
            icon: 'success',
            title: 'Deleted!',
            text: 'Data berhasil dihapus.',
          })
          this.fetchProblemData()
        }
      } catch (error) {
        console.log(error)
        this.$swal({
          icon: 'error',
          title: 'Oops...',
          text: 'Gagal menghapus data!',
        })
      }
    },
    updateModalView() {
      if (
        this.modalType === 'category' &&
        Array.isArray(this.problemCategory)
      ) {
        this.problemCategory = this.problemCategory.filter(
          (problem) => problem.id !== this.selectedProblemId,
        )
      } else if (
        this.modalType === 'next proses' &&
        Array.isArray(this.problemNextProcess)
      ) {
        this.problemNextProcess = this.problemNextProcess.filter(
          (problem) => problem.id !== this.selectedProblemId,
        )
      }

      // Panggil ulang data dari API jika diperlukan
      this.fetchProblemData()
    },
    async absensiKaryawan() {
      try {
        const payload = {
          date: this.selectedDate,
          shift: this.selectedShift,
        }

        let response = await this.$store.dispatch(ACTION_GET_ABSENSI, payload)
        if (response.status === 200) {
          if (this.GET_ABSENSI?.length > 0) {
            // console.log('mangtabsss')
          }
        }
      } catch (error) {
        console.log(error)
        this.$swal({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        })
      }
    },
    getKehadiranByJabatan(jabatan) {
      return this.GET_ABSENSI.filter((item) => item.jabatan === jabatan)
    },

    async checkAndSend() {
      // Cek apakah semua input terisi sebelum mengirim
      if (
        this.actMp > 0 &&
        this.jamKerja > 0 &&
        this.totalRegSetting > 0 &&
        this.calculatedOEE > 0
      ) {
        if (this.shouldSend) {
          if (
            !this.selectedDate ||
            this.selectedDate === moment().format('YYYY-MM-DD')
          ) {
            // Jika selectedDate adalah hari ini, langsung kirim
            this.sendOEEData()
          } else {
            // Jika selectedDate bukan hari ini, panggil fetchOEE terlebih dahulu
            await this.fetchOEE()

            // Cek apakah fetchOEE menemukan data untuk tanggal dan shift yang dipilih
            const isDataAvailable = this.actMp > 0 && this.jamKerja > 0
            if (!isDataAvailable) {
              // Jika data OEE untuk tanggal ini kosong, kirim data
              this.sendOEEData()
            } else {
              console.log(
                'Data untuk tanggal ini sudah ada, tidak akan mengirim ulang.',
              )
            }
          }
        }
      } else {
        // Jika salah satu input kosong, jangan kirim
        console.log('Data tidak lengkap, tidak akan mengirim OEE')
        this.shouldSend = false // Reset flag jika tidak ada data yang valid
      }
    },

    // Fungsi untuk mengirim payload data OEE
    async sendOEEData() {
      const payload = {
        shift: this.selectedShift,
        actMp: this.actMp,
        jamKerja: this.jamKerja,
        total: this.totalRegSetting,
        oee: this.calculatedOEE,
      }

      await this.actionAddOEE(payload) // Kirim payload yang sudah dipersiapkan
      this.shouldSend = false // Reset flag setelah pengiriman
    },

    async fetchOEE() {
      try {
        const payload = {
          date: this.selectedDate,
          shift: this.selectedShift,
        }
        await this.$store.dispatch(ACTION_GET_OEE, payload)

        const filteredData = this.GET_OEE.find(
          (oee) => oee.shift === this.selectedShift,
        )

        if (filteredData) {
          this.actMp = filteredData.act_mp != null ? filteredData.act_mp : 0 // Reset jika null
          this.jamKerja =
            filteredData.jam_kerja != null ? filteredData.jam_kerja : 0 // Reset jika null
          this.shouldSend = true // Set flag jika data valid
        }
      } catch (error) {
        console.error('Error fetching OEE data:', error)
      }
    },

    async actionAddOEE(payload) {
      try {
        let response = await this.$store.dispatch(ACTION_ADD_OEE, payload)

        if (response.status === 201) {
          // console.log('OEE added successfully')
          this.fetchOEE() // Ambil ulang data OEE setelah berhasil
        }
      } catch (error) {
        console.log('Error saat actionAddOEE:', error)
        this.$swal({
          icon: 'error',
          title: 'Gagal',
          text: 'Gagal menambahkan OEE',
        })
      }
    },
    resetModal() {
      this.isEditMode = false
      this.problemCategory = ''
      this.problemNextProcess = ''
      this.selectedCategory = null
      this.selectedLine = null
      this.timeCategory = null
      this.selectedTimeRange = null
      this.counter = null
      this.stdCounter = null

      // Reset Treeselect fields
      this.selectedMachine = null
      this.selectedTool = null
      this.problemNextProcessDescription = ''
      // Gunakan $nextTick untuk memastikan reset selesai
      this.$nextTick(() => {
        this.selectedMachine = null
        this.selectedTool = null
      })
      this.machine_id = null
      this.tool_id = null
      // Tingkatkan resetKey untuk re-render Treeselect
      this.resetKey += 1
      // console.log(
      //   'Resetting fields:',
      //   this.selectedMachine,
      //   this.selectedTool,
      //   this.stdCounter,
      // )
    },
  },
}
</script>
<style scoped>
.container-fluid {
  max-width: 1200px;
  margin: auto;
}

.d-flex {
  display: flex;
}

.custom-table {
  width: 100%;
  border: 1px solid black;
}

.custom-table th,
.custom-table td {
  text-align: center;
  padding: 8px;
}

.custom-table th {
  background-color: rgb(198, 240, 240);
}

.custom-table td {
  background-color: #ffffff;
}

input {
  width: 100%;
  padding: 5px;
}
.fc {
  width: fit-content;
}
.hollow-circle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5em; /* Sesuaikan ukuran agar sesuai */
  height: 100%;
  vertical-align: middle;
}
.hollow-circle {
  width: 1em;
  height: 1em;
  border: 2px solid green;
  border-radius: 50%;
  box-sizing: border-box;
}
.table-absensi {
  height: 75px; /* Sesuaikan dengan tinggi yang diinginkan */
}
.table-oee tbody {
  max-height: 100px; /* Sesuaikan tinggi yang diinginkan */
  overflow-y: auto; /* Menambahkan scroll jika konten terlalu banyak */
}

.table-oee td,
.table-oee th {
  padding: 5px; /* Mengurangi padding agar lebih kompak */
}

.custom-modal {
  table-layout: fixed;
}

.custom-table th,
.custom-table td {
  overflow-wrap: break-word;
  word-break: break-word;
  white-space: normal;
}

.problem-column {
  overflow-wrap: break-word;
  word-break: break-word;
  white-space: normal; /* Membuat teks dalam kolom ini terbungkus */
}
.modal-extra-wide {
  width: 130%;
}
</style>
