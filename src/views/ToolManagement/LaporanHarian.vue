<template>
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
            <Treeselect
              v-model="selectedMachine"
              :options="machineOptions"
              placeholder="Select Machine"
              :clearable="true"
              :searchable="true"
            />
          </div>
          <label for="">Tool</label>
          <div>
            <Treeselect
              v-model="selectedTool"
              :options="toolOptions"
              placeholder="Select Tool"
              :clearable="true"
              :searchable="true"
            />
          </div>
          <label>Counter</label>
          <div>
            <input type="number" class="form-control" v-model="counter" />
          </div>
          <label> Problem</label>
          <div>
            <input
              type="text"
              class="form-control"
              v-model="problemNextProcess"
            />
          </div>
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
            data-bs-dismiss="modal"
            class="btn btn-primary"
            @click="addProblem"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal lain tetap sama -->
  <div class="modal" tabindex="-1" id="viewProblemModal">
    <div class="modal-dialog">
      <div class="modal-content">
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
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>No</th>
                <th>Category</th>
                <th>Problem</th>
                <th>Waktu</th>
                <th>Action</th>
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
                    class="btn btn-danger btn-sm"
                    data-bs-toggle="modal"
                    data-bs-target="#deleteProblemModal"
                    @click="deleteProblem(problem.problem_id)"
                  >
                    <i class="fas fa-trash" aria-hidden="true"></i>
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

        <div v-if="modalType === 'next proses'">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>No</th>
                <th>Line</th>
                <th>Machine</th>
                <th>Tool</th>
                <th>Aktual Counter</th>
                <th>Std Counter</th>
                <th>Problem</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody v-if="GET_PROBLEM_MODAL.length > 0">
              <tr v-for="(problem, index) in GET_PROBLEM_MODAL" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ problem.line_nm }}</td>
                <td>{{ problem.machine_nm }}</td>
                <td>{{ problem.tool_nm }}</td>
                <td>{{ problem.act_counter }}</td>
                <td>{{ problem.std_counter }}</td>
                <td>{{ problem.problem_nm }}</td>
                <td>
                  <button
                    class="btn btn-danger btn-sm"
                    data-bs-toggle="modal"
                    data-bs-target="#deleteProblemModal"
                    @click="deleteProblem(problem.problem_id)"
                  >
                    <i class="fas fa-trash" aria-hidden="true"></i>
                  </button>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="8" class="text-center">No Data</td>
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

  <div
    :class="[
      'container-fluid',
      'card-laporan-harian',
      isScrolled ? 'scrolled' : '',
    ]"
  >
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
              <th style="width: 100px">Jam</th>
              <th style="width: 80px">From CL/R</th>
              <th style="width: 80px">Penambahan Tool</th>
              <th style="width: 80px">Regrind & Setting</th>
              <th style="width: 80px">Tool Delay</th>
              <th style="width: 80px">Waktu Delay</th>
              <th>Problem In Proses</th>
              <th>Problem Next Proses</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in filteredDataByShift" :key="index">
              <td>{{ row.jam }}</td>
              <td>
                <input
                  class="form-control"
                  type="number"
                  v-model="row.from_clr"
                />
              </td>
              <td>
                <input
                  class="form-control"
                  type="number"
                  v-model="row.penambahan_tool"
                />
              </td>
              <td>
                <input
                  class="form-control"
                  type="number"
                  v-model="row.regrind_setting"
                />
              </td>
              <td>
                <input
                  readonly
                  class="form-control"
                  type="number"
                  v-model="row.tool_delay"
                />
              </td>
              <td>
                <input
                  readonly
                  class="form-control"
                  type="text"
                  v-model="row.waktu_delay"
                />
              </td>
              <td>
                <button
                  class="btn btn-primary me-2"
                  data-bs-toggle="modal"
                  data-bs-target="#addProblemModal"
                  @click="
                    setModalTitle('Add Problem In Proses', 'category', row.jam)
                  "
                >
                  Add
                </button>
                <button
                  class="btn btn-success"
                  data-bs-toggle="modal"
                  data-bs-target="#viewProblemModal"
                  @click="
                    handleViewProblem(
                      'View Problem in Proses',
                      'category',
                      row.jam,
                    )
                  "
                >
                  View
                </button>
              </td>
              <td>
                <button
                  class="btn btn-primary me-2"
                  data-bs-toggle="modal"
                  data-bs-target="#addProblemModal"
                  @click="
                    setModalTitle(
                      'Add Problem Next Proses',
                      'next proses',
                      row.jam,
                    )
                  "
                >
                  Add
                </button>
                <button
                  class="btn btn-success"
                  data-bs-toggle="modal"
                  data-bs-target="#viewProblemModal"
                  @click="
                    handleViewProblem(
                      'View Problem Next Proses',
                      'next proses',
                      row.jam,
                    )
                  "
                >
                  View
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
import { mapGetters } from 'vuex'
// import the component
import Treeselect from 'vue3-treeselect'
// import the styles
import 'vue3-treeselect/dist/vue3-treeselect.css'
import {
  ACTION_ADD_PROBLEM,
  ACTION_ADD_PROBLEM_NEXT_PROCESS,
  ACTION_ADD_REPORT_REG_SET,
  ACTION_DELETE_PROBLEM,
  ACTION_GET_CATEGORIES,
  ACTION_GET_PROBLEM_MODAL,
  ACTION_GET_REPORT_REG_SET,
  ACTION_GET_STD_COUNTER,
  ACTION_GET_TOOLS,
  GET_CATEGORIES,
  GET_PROBLEM,
  GET_PROBLEM_MODAL,
  GET_REPORT,
  GET_STD_COUNTER,
  GET_TOOLS,
} from '@/store/LaporanHarian.module'
import moment from 'moment-timezone'

export default {
  name: 'LaporanHarian',
  components: {
    Treeselect,
  },

  data() {
    return {
      selectedShift: '',
      isScrolled: false,
      today: new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      modalTitle: '',
      selectedLine: null,
      selectedMachine: null,
      machineOptions: [],
      selectedTool: null,
      toolOptions: [],
      counter: '',
      stdCounter: '',
      problemNextProcess: [],
      modalType: '',
      selectedJam: '',
      selectedCategory: '',
      problemCategory: [],
      timeCategory: '',
      selectedDate: '',
      selectedProblemId: null,
      tableData: [
        {
          jam: '07:30 - 09:30',
          from_clr: '',
          penambahan_tool: '',
          regrind_setting: '',
          tool_delay: '',
          waktu_delay: '',
        },
        {
          jam: '09:40 - 11:45',
          from_clr: '',
          penambahan_tool: '',
          regrind_setting: '',
          tool_delay: '',
          waktu_delay: '',
        },
        {
          jam: '12:30 - 14:00',
          from_clr: '',
          penambahan_tool: '',
          regrind_setting: '',
          tool_delay: '',
          waktu_delay: '',
        },
        {
          jam: '14:10 - 16:00',
          from_clr: '',
          penambahan_tool: '',
          regrind_setting: '',
          tool_delay: '',
          waktu_delay: '',
        },
        {
          jam: '16:00 - 20:00',
          from_clr: '',
          penambahan_tool: '',
          regrind_setting: '',
          tool_delay: '',
          waktu_delay: '',
        },
        {
          jam: '20:00 - 22:00',
          from_clr: '',
          penambahan_tool: '',
          regrind_setting: '',
          tool_delay: '',
          waktu_delay: '',
        },
        {
          jam: '22:10 - 00:00',
          from_clr: '',
          penambahan_tool: '',
          regrind_setting: '',
          tool_delay: '',
          waktu_delay: '',
        },
        {
          jam: '00:30 - 02:30',
          from_clr: '',
          penambahan_tool: '',
          regrind_setting: '',
          tool_delay: '',
          waktu_delay: '',
        },
        {
          jam: '02:40 - 05:45',
          from_clr: '',
          penambahan_tool: '',
          regrind_setting: '',
          tool_delay: '',
          waktu_delay: '',
        },
        {
          jam: '05:45 - 07:00',
          from_clr: '',
          penambahan_tool: '',
          regrind_setting: '',
          tool_delay: '',
          waktu_delay: '',
        },
      ],
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
    ]),
    filteredDataByShift() {
      if (this.selectedShift === 'Siang') {
        // Filter jam antara 07:30 sampai 20:00
        return this.tableData.filter((item) => {
          const jam = this.convertTo24Hour(item.jam)
          return jam >= '07:30' && jam <= '20:00'
        })
      } else if (this.selectedShift === 'Malam') {
        // Filter jam antara 20:00 sampai 07:30 di hari berikutnya
        return this.tableData.filter((item) => {
          const jam = this.convertTo24Hour(item.jam)
          return jam < '07:30' || jam >= '20:00'
        })
      } else {
        // Tampilkan semua data jika shift belum dipilih
        return this.tableData
      }
    },
  },
  watch: {
    tableData: {
      handler(newValue) {
        if (
          !this.selectedDate ||
          this.selectedDate === moment().format('YYYY-MM-DD')
        ) {
          newValue.forEach((row) => {
            // Perhitungan tool_delay
            if (row.from_clr && row.penambahan_tool && row.regrind_setting) {
              row.tool_delay =
                row.from_clr + row.penambahan_tool - row.regrind_setting
            } else {
              row.tool_delay = ''
            }

            // Perhitungan waktu_delay
            if (row.tool_delay) {
              row.waktu_delay = `${row.tool_delay * 15}'`
            } else {
              row.waktu_delay = ''
            }

            // Reset reportSent flag jika ada perubahan pada row
            if (
              row.from_clr !== row.previousFromClr ||
              row.penambahan_tool !== row.previousPenambahan ||
              row.regrind_setting !== row.previousRegrindSetting
            ) {
              row.reportSent = false // Reset flag jika ada perubahan
            }
            // Hanya panggil addReportReg jika waktu_delay terisi dan belum dikirim
            if (row.waktu_delay && !row.reportSent) {
              // Gunakan setTimeout untuk memberikan jeda
              setTimeout(() => {
                this.addReportReg(row)
                row.reportSent = true // Tandai bahwa data ini sudah diproses
              }, 2000) // 2000 ms = 2 detik

              // Simpan nilai sebelumnya untuk pengecekan di kemudian hari
              row.previousFromClr = row.from_clr
              row.previousPenambahan = row.penambahan_tool
              row.previousRegrindSetting = row.regrind_setting
            }
          })
        }
      },
      deep: true,
    },
    GET_REPORT(newValue) {
      if (newValue && newValue.length) {
        // Pemetaan rentang waktu di tableData
        const timeRanges = {
          '07:30 - 09:30': 0, // Misalkan index 0 di tableData untuk jam 07:30 - 09:30
          '09:40 - 11:45': 1, // Misalkan index 1 di tableData untuk jam 09:40 - 11:45
          '12:30 - 14:00': 2, // Dan seterusnya
          '14:10 - 16:00': 3,
          '16:00 - 20:00': 4,
          '20:00 - 22:00': 5,
          '22:10 - 00:00': 6,
          '00:30 - 02:30': 7,
          '02:40 - 05:45': 8,
          '05:45 - 07:00': 9,
        }
        // Reset tableData sebelum mengisi data baru
        this.tableData.forEach((row) => {
          row.from_clr = ''
          row.penambahan_tool = ''
          row.regrind_setting = ''
          row.tool_delay = ''
          row.waktu_delay = ''
        })
        // Sinkronisasi data dari GET_REPORT ke tableData
        newValue.forEach((report) => {
          const timeRange = report.time_range

          // Cek apakah time_range dari report cocok dengan salah satu rentang waktu di tableData
          const index = timeRanges[timeRange]
          if (index !== undefined && this.tableData[index]) {
            // Masukkan data dari report ke tableData berdasarkan index
            this.tableData[index].from_clr = report.from_gel || ''
            this.tableData[index].penambahan_tool = report.penambahan || ''
            this.tableData[index].regrind_setting = report.reg_set || ''
            this.tableData[index].tool_delay = report.tool_delay || ''
            this.tableData[index].waktu_delay = report.time_delay || ''
          }
        })
      } else {
        this.tableData.forEach((row) => {
          row.from_clr = ''
          row.penambahan_tool = ''
          row.regrind_setting = ''
          row.tool_delay = ''
          row.waktu_delay = ''
        })
      }
    },
  },
  mounted() {
    this.$store.dispatch('fetchLines')
    this.$store.dispatch(ACTION_GET_CATEGORIES)
    this.$store.dispatch(ACTION_GET_REPORT_REG_SET, this.selectedDate)
    window.addEventListener('scroll', this.handleScroll)
    this.setShiftByCurrentTime()
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll) // Hapus listener ketika component di-destroy
  },
  methods: {
    setShiftByCurrentTime() {
      const now = new Date()
      const currentHour = now.getHours()
      console.log(currentHour)

      if (currentHour >= 7 && currentHour < 20) {
        this.selectedShift = 'Siang'
      } else {
        this.selectedShift = 'Malam'
      }
    },
    convertTo24Hour(time) {
      // Implementasi logika konversi jam ke format 24-jam jika perlu
      return time
    },
    handleScroll() {
      this.isScrolled = window.scrollY > 0 // Ubah isScrolled jadi true jika scroll lebih dari 0
    },
    handleViewProblem(title, type, jam) {
      try {
        // Set judul modal dan tipe
        this.setModalTitle(title, type, jam)

        // Setelah itu, fetch data problem yang sesuai
        this.fetchProblemData()
      } catch (error) {
        console.log('Error saat handleViewProblem:', error)
      }
    },

    setModalTitle(title, type, jam) {
      // console.log(`Setting modal title: ${title}, type: ${type}, jam: ${jam}`) // Cek nilai
      this.modalTitle = title
      this.modalType = type
      this.selectedJam = jam
    },
    async fetchProblemData() {
      // console.log('fetchProblemData dipanggil') // Log pemanggilan fetchProblemData
      try {
        const payload = {
          modalType: this.modalType, // Mengambil tipe modal dari state
          time_range: this.selectedJam, // Mengambil jam yang dipilih dari state
          selectedDate: this.selectedDate, // Mengambil tanggal yang dipilih dari state
        }

        await this.$store.dispatch(ACTION_GET_PROBLEM_MODAL, payload)
      } catch (error) {
        console.log('Error saat fetchProblemData:', error)
      }
    },
    async onLineChange() {
      try {
        const selectedLine = this.selectedLine.line_id
        console.log(selectedLine)
        const line_nm = this.selectedLine.line_nm
        await this.$store.dispatch('fetchMachines', selectedLine)

        this.machineOptions = this.getMachinesNames.map((machine) => ({
          id: machine.machine_id,
          label: machine.machine_nm,
        }))
        await this.$store.dispatch(ACTION_GET_TOOLS, line_nm)
        this.toolOptions = this.GET_TOOLS.map((tool) => ({
          id: tool.tool_id,
          label: tool.tool_nm,
        }))
      } catch (error) {
        console.log(error)
      }
    },

    async addProblem() {
      try {
        let payload
        if (this.modalType === 'category') {
          payload = {
            category_id: this.selectedCategory.category_id,
            problem_nm: this.problemCategory,
            waktu: this.timeCategory,
            time_range: this.selectedJam,
          }
        } else if (this.modalType === 'next proses') {
          payload = {
            line_id: this.selectedLine.line_id,
            machine_id: this.selectedMachine,
            tool_id: this.selectedTool,
            act_counter: this.counter,
            problem_nm: this.problemNextProcess,
            time_range: this.selectedJam,
          }
        }
        console.log('payload', payload)
        if (this.modalType === 'category') {
          let response = await this.$store.dispatch(ACTION_ADD_PROBLEM, payload)
          if (response.status === 201) {
            this.$swal({
              icon: 'success',
              title: 'Success',
              text: 'Data added successfully',
            })
          }
        } else if (this.modalType === 'next proses') {
          let response = await this.$store.dispatch(
            ACTION_ADD_PROBLEM_NEXT_PROCESS,
            payload,
          )
          if (response.status === 201) {
            this.$swal({
              icon: 'success',
              title: 'Success',
              text: 'Data added successfully',
            })
          }
        }

        this.resetModal()
      } catch (error) {
        console.log(error)
      }
    },
    async addReportReg(row) {
      try {
        const payload = {
          time_range: row.jam,
          from_gel: row.from_clr,
          penambahan: row.penambahan_tool,
          reg_set: row.regrind_setting,
          tool_delay: row.tool_delay,
          time_delay: row.waktu_delay,
        }
        // console.log('payload', payload)
        let response = await this.$store.dispatch(
          ACTION_ADD_REPORT_REG_SET,
          payload,
        )
        if (response.status === 201) {
          console.log('Success')
        }
        await this.$store.dispatch(ACTION_GET_REPORT_REG_SET, this.selectedDate)
      } catch (error) {
        console.log(error)
        this.$swal({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        })
      }
    },
    async getReport() {
      try {
        const selectedDate = this.selectedDate
        console.log('payload', selectedDate)
        let response = await this.$store.dispatch(
          ACTION_GET_REPORT_REG_SET,
          selectedDate,
        )
        if (response.data.data.length === 0) {
          this.$swal({
            icon: 'error',
            text: 'NO DATA!',
          })
        }
      } catch (error) {
        console.log(error)
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

    resetModal() {
      ;(this.selectedCategory = null),
        (this.problemCategory = null),
        (this.timeCategory = null),
        (this.selectedLine = null),
        (this.selectedMachine = null),
        (this.selectedTool = null),
        (this.counter = null),
        (this.problemNextProcess = null)
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
</style>
