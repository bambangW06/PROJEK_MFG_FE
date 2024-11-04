<template>
  <div class="modal" tabindex="-1" id="analisaProblemModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Analisa Problem</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <label>Tool</label>
          <div>
            <input type="text" class="form-control" v-model="tool" />
          </div>
          <label for="">Problem</label>
          <div>
            <input type="text" class="form-control" v-model="problem" />
          </div>
          <label for="">Analisa</label>
          <div>
            <textarea
              type="text"
              class="form-control"
              v-model="analisa"
            ></textarea>
          </div>
          <label for="">Foto</label>
          <div>
            <input
              type="file"
              class="form-control"
              id="toolImage"
              name="foto"
              ref="fileInput"
              multiple
              @change="onFileImageChange"
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
            class="btn btn-danger"
            @click="actionAddAnalisaProblem"
            data-bs-dismiss="modal"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="container-fluid">
    <div class="card p-2 mb-1">
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
                <th>Mesin</th>
                <th>Tool</th>
                <th>Act Counter</th>
                <th>Std Counter</th>
                <th>Problem</th>
                <th>Action</th>
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
                <td>
                  <button
                    class="btn btn-danger btn-sm"
                    data-bs-toggle="modal"
                    data-bs-target="#analisaProblemModal"
                    @click="analisaProblem(problem)"
                  >
                    <i class="fas fa-edit" aria-hidden="true"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <div class="container-fluid">
    <div class="card p-2 mt-1">
      <div class="d-flex justify-content-between align-items-center">
        <h4 class="text-center m-0">Analisa Problem Next Proses</h4>
      </div>
    </div>
  </div>

  <div class="container-fluid mt-1">
    <div class="card p-2">
      <table
        class="table table-bordered table-problem table-hover"
        style="table-layout: fixed; width: 100%"
      >
        <thead>
          <tr>
            <th style="width: 8%">No</th>
            <th style="width: 10%">Tanggal</th>
            <th style="width: 10%">Line</th>
            <th style="width: 10%">Mesin</th>
            <th style="width: 10%">Tool</th>
            <th style="width: 10%">Proses</th>
            <th style="width: 10%">Counter</th>
            <th style="width: 15%">Problem</th>
            <th style="width: 35%" class="analisa-column">Analisa</th>
            <th style="width: 15%" class="foto-column">Foto</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(problem, index) in GET_PROBLEM_ANALISA" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ problem.created_dt }}</td>
            <td>{{ problem.line_nm }}</td>
            <td>{{ problem.machine_nm }}</td>
            <td>{{ problem.tool_nm }}</td>
            <td>{{ problem.process_nm }}</td>
            <td>{{ problem.act_counter }}/{{ problem.std_counter }}</td>
            <td>{{ problem.problem_nm }}</td>
            <td class="analisa-column">{{ problem.analisa }}</td>
            <td class="foto-column">
              <div v-if="Array.isArray(problem.foto)">
                <img
                  v-for="(foto, fotoIndex) in problem.foto"
                  :key="fotoIndex"
                  :src="foto"
                  alt=""
                  class="thumbnail"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import {
  ACTION_ADD_ANALISA_PROBLEM,
  ACTION_GET_PROBLEM_ANALISA,
  GET_PROBLEM_ANALISA,
} from '@/store/Analisaproblem.module'
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
      now: new Date(),
      selectedDate: '',
      selectedShift: 'Siang',
      tool: '',
      problem: '',
      analisa: '',
      foto: [],
      tool_id: null,
      problem_id: null,
      created_dt: '',
      machine_id: null,
    }
  },
  computed: {
    ...mapGetters([
      GET_PROBLEM_IN_PROCESS,
      GET_PROBLEM_NEXT_PROCESS,
      GET_PROBLEM_ANALISA,
    ]),
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
    this.getAnlisaProblem()
  },
  methods: {
    analisaProblem(seletedProblem) {
      try {
        this.machine_id = seletedProblem.machine_id
        this.problem_id = seletedProblem.problem_id
        this.tool_id = seletedProblem.tool_id
        this.created_dt = seletedProblem.created_dt
        this.tool = seletedProblem.tool_nm
        this.problem = seletedProblem.problem_nm
        this.anlisa = ''
        this.foto = []
      } catch (error) {
        console.log(error)
      }
    },
    onFileImageChange(event) {
      const files = Array.from(event.target.files)
      this.foto = [] // Reset daftar foto sebelumnya

      files.forEach((file) => {
        const maxSize = 500 * 1024 // 500 KB

        if (!file.type.startsWith('image/')) {
          alert('Pilih file gambar yang valid.')
          return
        }

        if (file.size > maxSize) {
          alert('Ukuran file terlalu besar. Maksimal 500 KB.')
          return
        }

        this.foto.push(file) // Simpan file asli ke dalam foto
        console.log('File berhasil diunggah:', file)
        console.log('Daftar file yang diunggah:', this.foto)
      })
    },

    async actionAddAnalisaProblem() {
      try {
        // Membuat objek payload
        const payload = {
          shift: this.selectedShift,
          problem_id: this.problem_id,
          problem_nm: this.problem,
          tool_id: this.tool_id,
          tool_nm: this.tool,
          machine_id: this.machine_id,
          created_dt: this.created_dt,
          analisa: this.analisa,
          foto: this.foto, // Menyimpan array file foto
        }

        // Mengirimkan payload ke store
        const response = await this.$store.dispatch(
          ACTION_ADD_ANALISA_PROBLEM,
          payload,
        )

        if (response.status === 201) {
          console.log('Data Berhasil')
          this.getAnlisaProblem()
        }

        // Reset input
        this.analisa = ''
        this.foto = []
        this.$refs.fileInput.value = null // Reset elemen input file
      } catch (error) {
        console.error(error)
      }
    },
    async getAnlisaProblem() {
      try {
        // Mengambil data analisa problem setelah penambahan berhasil
        let response = await this.$store.dispatch(ACTION_GET_PROBLEM_ANALISA, {
          shift: this.selectedShift,
          date: this.selectedDate,
        })

        if (response.status === 200 && this.GET_PROBLEM_ANALISA.length > 0) {
          console.log('Data Berhasil di Dapat', this.GET_PROBLEM_ANALISA)
        } else {
          this.GET_PROBLEM_ANALISA = []
        }
      } catch (error) {
        console.log(error)
      }
    },

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
.thumbnail {
  max-width: 90px; /* Batas lebar gambar */
  max-height: 90px; /* Batas tinggi gambar */
  width: auto;
  height: auto;
  object-fit: cover; /* Menjaga rasio dan mengisi area */
  margin: 5px;
}

.analisa-column {
  max-width: 150px; /* Sesuaikan lebar maksimum */
  overflow-wrap: break-word;
  word-break: break-word;
  white-space: normal;
}
</style>
