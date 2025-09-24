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
          <div v-if="tool_nm">
            <label>Tool</label>
            <div>
              <input type="text" class="form-control" v-model="tool" />
            </div>
          </div>

          <!-- Tampilkan Line untuk "Problem Next Proses" -->
          <div v-if="line_nm">
            <label>Line</label>
            <input
              type="text"
              class="form-control"
              v-model="line_nm"
              readonly
            />
          </div>

          <!-- Tampilkan Category untuk "Problem In Proses" -->
          <div v-if="category_nm">
            <label>Category</label>
            <input
              type="text"
              class="form-control"
              v-model="category_nm"
              readonly
            />
          </div>

          <label>Problem</label>
          <div>
            <input
              type="text"
              class="form-control"
              v-model="problem"
              readonly
            />
          </div>
          <div v-if="waktu">
            <label>Waktu</label>
            <div class="input-group">
              <input
                type="text"
                class="form-control"
                v-model="waktu"
                readonly
              />
              <span class="input-group-text">menit</span>
            </div>
          </div>

          <!-- Tampilkan Act Counter dan Std Counter jika ada -->
          <div v-if="act_counter && std_counter">
            <label>Act Counter</label>
            <input
              type="text"
              class="form-control"
              v-model="act_counter"
              readonly
            />
            <label>Std Counter</label>
            <input
              type="text"
              class="form-control"
              v-model="std_counter"
              readonly
            />
          </div>

          <label>Analisa</label>
          <div>
            <textarea class="form-control" v-model="analisa"></textarea>
          </div>

          <label>Foto</label>
          <div>
            <input
              type="file"
              class="form-control"
              ref="fileInputadd"
              multiple
              @change="FileImageChange($event, 'add')"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Tutup
          </button>
          <button
            type="button"
            class="btn btn-danger"
            @click="actionAddAnalisaProblem"
            data-bs-dismiss="modal"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal" tabindex="-1" id="editProblemAnalisa">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Edit Problem</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <label>Problem</label>
          <div>
            <input
              type="text"
              class="form-control"
              v-model="editProblem"
              readonly
            />
          </div>
          <label for="">Analisa</label>
          <div>
            <textarea
              type="text"
              class="form-control"
              v-model="editAnalisa"
            ></textarea>
          </div>
          <label for="">Foto</label>
          <div>
            <input
              type="file"
              class="form-control"
              id="toolImage"
              name="foto"
              ref="fileInputedit"
              multiple
              @change="FileImageChange($event, 'edit')"
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
            @click="actionEditProblem"
            data-bs-dismiss="modal"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal" tabindex="-1" id="deleteProblemAnalisa">
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
          <p>Are you sure want to delete this problem?</p>
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
            @click="actionDeleteProblem"
            data-bs-dismiss="modal"
          >
            Delete
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
                <th>Add Analysis</th>
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
                <td>
                  <button
                    class="btn p-0"
                    data-bs-toggle="modal"
                    data-bs-target="#analisaProblemModal"
                    @click="analisaProblem(problem)"
                  >
                    <i class="fas fa-edit text-primary" aria-hidden="true"></i>
                  </button>
                </td>
              </tr>
            </tbody>
            <tbody v-if="filteredInProcess.length === 0">
              <tr>
                <td colspan="7" class="text-center">No data available</td>
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
                <th>Add Analysis</th>
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
                <td>
                  {{
                    problem.other_nm
                      ? `${problem.problem_nm} : ${problem.other_nm}`
                      : problem.problem_nm
                  }}
                </td>
                <td>
                  <button
                    class="btn p-0"
                    data-bs-toggle="modal"
                    data-bs-target="#analisaProblemModal"
                    @click="analisaProblem(problem)"
                  >
                    <i class="fas fa-edit text-primary" aria-hidden="true"></i>
                  </button>
                </td>
              </tr>
            </tbody>
            <tbody v-if="filteredNextProcess.length === 0">
              <tr>
                <td colspan="10" class="text-center">No data available</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <div class="container-fluid mt-1">
    <div class="card p-2">
      <div class="card">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h4 class="text-center m-0">Analisa Problem</h4>
        </div>
        <div class="table-responsive">
          <table
            class="table table-bordered table-problem table-hover"
            style="table-layout: fixed; width: 100%"
          >
            <thead>
              <tr>
                <th style="width: 8%">No</th>
                <th style="width: 15%">Tanggal</th>
                <th style="width: 8%">Line</th>
                <th style="width: 10%">Mesin</th>
                <th style="width: 10%">Tool</th>
                <th style="width: 12%">Counter</th>
                <th style="width: 15%">Proses</th>
                <th style="width: 20%">Problem</th>
                <th style="width: 30%" class="analisa-column">Analisa</th>
                <th style="width: 15%" class="foto-column">Foto</th>
                <th style="width: 10%">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(problem, index) in GET_PROBLEM_ANALISA" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ problem.created_dt }}</td>
                <td>{{ problem.line_nm || '-' }}</td>
                <td>{{ problem.machine_nm || '-' }}</td>
                <td>{{ problem.tool_nm || '-' }}</td>

                <td>
                  {{ problem.act_counter || '-' }}/{{
                    problem.std_counter || '-'
                  }}
                </td>
                <td>
                  <!-- Menampilkan category_nm jika process_nm kosong -->
                  {{ problem.process_nm || problem.category_nm || '-' }}
                </td>
                <td>{{ problem.problem_nm }}</td>
                <td
                  class="analisa-column"
                  v-html="problem.analisa || 'No analysis provided'"
                ></td>
                <td class="foto-column">
                  <div
                    v-if="Array.isArray(problem.foto) && problem.foto.length"
                  >
                    <img
                      v-for="(foto, fotoIndex) in problem.foto"
                      :key="fotoIndex"
                      :src="foto"
                      alt="foto"
                      class="thumbnail"
                    />
                  </div>
                  <div v-else>
                    <span>No photo</span>
                  </div>
                </td>
                <td>
                  <div class="action-buttons">
                    <button
                      class="btn btn-sm"
                      data-bs-toggle="modal"
                      data-bs-target="#editProblemAnalisa"
                      @click="prepareEdit(problem.problem_id)"
                    >
                      <i
                        class="fas fa-edit text-primary"
                        aria-hidden="true"
                      ></i>
                    </button>
                    <button
                      class="btn btn-sm"
                      data-bs-toggle="modal"
                      data-bs-target="#deleteProblemAnalisa"
                      @click="prepareDelete(problem.problem_id)"
                    >
                      <i
                        class="fas fa-trash text-danger"
                        aria-hidden="true"
                      ></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
            <tbody v-if="GET_PROBLEM_ANALISA.length === 0">
              <tr>
                <td colspan="11" class="text-center">No data available</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  ACTION_ADD_ANALISA_PROBLEM,
  ACTION_DELETE_ANALISA_PROBLEM,
  ACTION_EDIT_ANALISA_PROBLEM,
  ACTION_GET_PROBLEM_ANALISA,
  GET_PROBLEM_ANALISA,
} from '@/store/Tool/Analisaproblem.module'
import {
  ACTION_GET_PROBLEM_TABLE,
  GET_PROBLEM_IN_PROCESS,
  GET_PROBLEM_NEXT_PROCESS,
} from '@/store/Tool/LaporanHarian.module'
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
      category_id: null,
      category_nm: '',
      waktu: '',
      editProblem: '', // Untuk modal edit
      editAnalisa: '', // Untuk modal edit
      editCategoryId: null,
      analisa_id: null,
      editFoto: [], // Untuk modal edi
      selectedProblemId: null, // Menyimpan problem_id yang dipilih
      selectedDeleteProblemId: null, // Menyimpan problem_id untuk delete
      deletedCategoryId: null,
      problemCategory: '',
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
  watch: {
    selectedDate(oldValue, newValue) {
      if (newValue !== oldValue) {
        this.getAnlisaProblem()
      }
    },
    selectedShift(oldValue, newValue) {
      if (newValue !== oldValue) {
        this.getAnlisaProblem()
      }
    },
  },
  mounted() {
    this.$store.dispatch(ACTION_GET_PROBLEM_TABLE, this.selectedDate)
    this.setShiftByCurrentTime()
    this.getAnlisaProblem()
  },
  methods: {
    prepareEdit(problemId) {
      const selectedProblem = this.GET_PROBLEM_ANALISA.find(
        (problem) => problem.problem_id === problemId,
      )
      if (selectedProblem) {
        this.selectedProblemId = problemId
        this.editProblem = selectedProblem.problem_nm
        this.editAnalisa = selectedProblem.analisa
          ? selectedProblem.analisa.replace(/<br\s*\/?>/gi, '\n')
          : ''
        this.editFoto = selectedProblem.foto || [] // Jika ada foto, isi array dengan link gambar
        this.analisa_id = selectedProblem.analisa_id
      }
      if (selectedProblem.category_id) {
        this.editCategoryId = selectedProblem.category_id
      }
      console.log('ini analisa id', selectedProblem)
    },
    async actionEditProblem() {
      try {
        // Buat payload awal
        const payload = {
          analisa_id: this.analisa_id,
          problem_id: this.selectedProblemId,
          problem_nm: this.editProblem,
          analisa: this.editAnalisa,
          foto: this.editFoto,
        }

        // Tambahkan category_id jika ada
        if (this.editCategoryId) {
          payload.category_id = this.editCategoryId
        }

        console.log('payload vue', payload)

        let response = await this.$store.dispatch(
          ACTION_EDIT_ANALISA_PROBLEM,
          payload,
        )
        if (response.status === 200) {
          console.log('status', response.status)
          this.getAnlisaProblem()
          this.editProblem = ''
          this.editAnalisa = ''
          this.editFoto = []
          // Reset file input using DOM manipulation

          const fileInputEdit = this.$refs.fileInputedit

          // Direct DOM manipulation to reset the file input

          fileInputEdit.value = ''
        }
      } catch (error) {
        console.log(error)
        this.$swal({
          icon: 'error',
          text: 'Gagal',
        })
      }
    },
    prepareDelete(problemId) {
      const selectedProblem = this.GET_PROBLEM_ANALISA.find(
        (problem) => problem.problem_id === problemId,
      )
      if (selectedProblem) {
        this.selectedDeleteProblemId = problemId
      }
      // Simpan problem_id yang akan dihapus

      // Jika ada category_id, simpan ke deletedCategoryId
      if (selectedProblem.category_id) {
        this.deletedCategoryId = selectedProblem.category_id
      }
      console.log(
        'Problem ID:',
        this.selectedDeleteProblemId,
        'Category ID:',
        this.deletedCategoryId,
      )
    },

    async actionDeleteProblem() {
      try {
        const payload = {
          problem_id: this.selectedDeleteProblemId,
        }

        // Tambahkan category_id ke payload jika ada
        if (this.deletedCategoryId) {
          payload.category_id = this.deletedCategoryId
        }

        console.log('Payload to delete:', payload)
        // Hapus `return` agar dapat melanjutkan proses
        let response = await this.$store.dispatch(
          ACTION_DELETE_ANALISA_PROBLEM,
          payload,
        )

        // Tampilkan pesan berhasil atau gagal
        if (response.status === 200) {
          this.$swal({
            icon: 'success',
            text: 'Berhasil',
          })
          this.getAnlisaProblem() // Refresh data
        }
      } catch (error) {
        console.error('Error:', error)
        this.$swal({
          icon: 'error',
          text: 'Gagal',
        })
      }
    },

    analisaProblem(selectedProblem) {
      try {
        // Reset variabel modal
        this.tool = ''
        this.problem = ''
        this.analisa = ''
        this.foto = []
        this.problem_id = ''
        this.created_dt = ''
        this.machine_id = ''
        this.tool_id = ''
        this.act_counter = ''
        this.std_counter = ''
        this.category_id = ''
        this.category_nm = ''
        this.line_nm = ''
        this.waktu = ''

        // Cek apakah data berasal dari "Problem In Proses" atau "Problem Next Proses"
        if ('tool_id' in selectedProblem) {
          // Data dari Problem Next Proses
          this.machine_id = selectedProblem.machine_id
          this.problem_id = selectedProblem.problem_id
          this.tool_id = selectedProblem.tool_id
          this.created_dt = selectedProblem.created_dt
          this.tool = selectedProblem.tool_nm
          this.problem = selectedProblem.problem_nm
          this.line_nm = selectedProblem.line_nm // Misalnya untuk menampilkan nama line
          this.act_counter = selectedProblem.act_counter
          this.std_counter = selectedProblem.std_counter
        } else {
          // Data dari Problem In Proses
          this.problem_id = selectedProblem.problem_id
          this.created_dt = selectedProblem.created_dt
          this.category_id = selectedProblem.category_id
          this.category_nm = selectedProblem.category_nm
          this.problem = selectedProblem.problem_nm
          this.waktu = selectedProblem.waktu // Waktu penyelesaian
        }
      } catch (error) {
        console.log(error)
      }
    },

    FileImageChange(event, mode) {
      const files = Array.from(event.target.files)
      const maxSize = 500 * 1024 // 500 KB

      // Reset daftar foto sebelumnya berdasarkan mode
      if (mode === 'add') {
        this.foto = []
      } else if (mode === 'edit') {
        this.editFoto = []
      }

      files.forEach((file) => {
        if (!file.type.startsWith('image/')) {
          alert('Pilih file gambar yang valid.')
          return
        }

        if (file.size > maxSize) {
          alert('Ukuran file terlalu besar. Maksimal 500 KB.')
          return
        }

        // Simpan file asli ke dalam foto atau editFoto sesuai dengan mode
        if (mode === 'add') {
          this.foto.push(file)
        } else if (mode === 'edit') {
          this.editFoto.push(file)
        }

        console.log('File berhasil diunggah:', file)
        console.log(
          'Daftar file yang diunggah:',
          mode === 'add' ? this.foto : this.editFoto,
        )
      })
    },

    async actionAddAnalisaProblem() {
      try {
        // Membuat objek payload dengan data dari analisaProblem
        const payload = {
          shift: this.selectedShift, // Pastikan shift dipilih sebelumnya
          problem_id: this.problem_id,
          problem_nm: this.problem,
          analisa: this.analisa,
          foto: this.foto, // Menyertakan foto yang diupload
          created_dt: this.created_dt,
        }

        // Cek apakah data berasal dari "Problem Next Proses"
        if (this.tool_id && this.machine_id) {
          // Jika "Problem Next Proses", kirim data terkait tool dan machine
          payload.tool_id = this.tool_id
          payload.tool_nm = this.tool
          payload.machine_id = this.machine_id
          payload.line_nm = this.line_nm // Line name hanya untuk Next Proses
        } else {
          // Jika "Problem In Proses", kirim data kategori dan waktu
          payload.category_id = this.category_id
          payload.category_nm = this.category_nm
          payload.waktu = this.waktu // Waktu penyelesaian hanya untuk In Proses
        }
        console.log('ini payload', payload)

        // Mengirimkan payload ke store
        const response = await this.$store.dispatch(
          ACTION_ADD_ANALISA_PROBLEM,
          payload,
        )

        if (response.status === 201) {
          console.log('Data Berhasil Ditambahkan')
          this.getAnlisaProblem()
        }

        //Reset input setelah berhasil menyimpan
        this.analisa = ''
        this.foto = []
        const fileInputAdd = this.$refs.fileInputadd
        fileInputAdd.value = ''
      } catch (error) {
        console.error('Error:', error)
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
          console.log('GET', this.GET_PROBLEM_ANALISA)

          this.GET_PROBLEM_ANALISA = this.GET_PROBLEM_ANALISA.map((item) => {
            if (item.analisa) {
              item.analisa = item.analisa.replace(/\r\n/g, '<br>')
            }
            return item
          })
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
  max-width: 100%; /* Batasi lebar gambar agar tidak melebihi kolom */
  height: auto;
  object-fit: cover;
}

/* Responsif untuk layar kecil */
@media (max-width: 768px) {
  .foto-column {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .thumbnail {
    max-width: 80px; /* Batasi ukuran gambar lebih kecil untuk layar kecil */
    margin-bottom: 8px;
  }
}

.analisa-column {
  max-width: 150px; /* Sesuaikan lebar maksimum */
  overflow-wrap: break-word;
  word-break: break-word;
  white-space: normal;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: center;
}

.action-buttons > * {
  font-size: 0.9em; /* Perkecil ukuran teks */
  padding: 8px 12px; /* Perkecil padding */
  width: 80%; /* Sesuaikan lebar tombol */
  max-width: 200px; /* Batasi lebar maksimal jika perlu */
}

/* Untuk layar kecil */
@media (max-width: 768px) {
  .action-buttons > * {
    font-size: 0.8em; /* Sesuaikan ukuran teks lebih kecil */
    padding: 6px 10px; /* Perkecil padding lebih jauh */
    width: 100%; /* Buat tombol mengisi lebar container */
  }
}
</style>
