<template>
  <div class="modal" tabindex="-1" id="modalTambahKaryawan">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Tambah Karyawan</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <!-- Modal Header -->
        <div class="modal-body">
          <label>Nama</label>
          <input type="text" v-model="newUser.nama" class="form-control" />

          <label>Noreg</label>
          <input type="text" v-model="newUser.noreg" class="form-control" />

          <label>Foto</label>
          <div class="text-center">
            <input
              type="file"
              ref="inputFile"
              class="form-control"
              @change="onFileChange"
              name="foto"
            />
            <!-- Menampilkan preview foto jika ada -->
            <img
              v-if="newUser.previewUrl"
              :src="newUser.previewUrl"
              class="mt-3"
              alt="Preview"
              style="max-width: 18%"
            />
          </div>
          <label>Shift</label>
          <select v-model="newUser.shift" class="form-control">
            <option disable selected></option>
            <option>Red</option>
            <option>White</option>
            <option>Non Shift</option>
          </select>

          <label>Jabatan</label>
          <select v-model="newUser.jabatan" class="form-control">
            <option disable selected></option>
            <option>Group Leader</option>
            <option>Team Leader</option>
            <option>Team Member</option>
            <option>Supervisor</option>
            <option>Others</option>
          </select>
          <label for="defaultPos">Pos</label>
          <div>
            <select
              v-model="newUser.defaultPos"
              class="form-control"
              id="defaultPos"
            >
              <option disable selected></option>
              <option>Supervisor</option>
              <option>GL</option>
              <option>TL</option>
              <option>NC</option>
              <option>SettingDelivery</option>
              <option>OilSupply</option>
              <option>CB</option>
              <option>CH</option>
              <option>CoolantSupply</option>
              <option>ConsentrasiCheck</option>
            </select>
          </div>
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
            @click="tambahKaryawan"
            data-bs-dismiss="modal"
            :disabled="isSaveDisabled()"
          >
            Save
          </button>
        </div>
        <!-- Modal Footer -->
      </div>
    </div>
    <!--modal dialog-->
  </div>
  <!-- Modal Edit Karyawan -->
  <div class="modal" tabindex="-1" id="editModal" @show="resetEditedUser">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Edit Karyawan</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <!-- Modal Header -->
        <div class="modal-body">
          <!-- Form untuk mengedit karyawan -->
          <label>Nama</label>
          <input type="text" v-model="editedUser.nama" class="form-control" />
          <label>Noreg</label>
          <input type="text" v-model="editedUser.noreg" class="form-control" />

          <label>Foto</label>
          <div class="text-center">
            <input
              type="file"
              ref="inputFile"
              class="form-control"
              @change="onFileChange"
              name="foto"
            />
            <!-- Menampilkan preview foto jika ada -->
            <img
              v-if="editedUser.previewUrl"
              :src="editedUser.previewUrl"
              class="mt-3"
              alt="#"
              style="max-width: 18%"
            />
          </div>
          <label>Shift</label>
          <select v-model="editedUser.shift" class="form-control">
            <option disable selected></option>
            <option>Red</option>
            <option>White</option>
            <option>Non Shift</option>
          </select>

          <label>Jabatan</label>
          <select v-model="editedUser.jabatan" class="form-control">
            <option disable selected></option>
            <option>Group Leader</option>
            <option>Team Leader</option>
            <option>Team Member</option>
            <option>Supervisor</option>
            <option>Others</option>
          </select>
          <label for="defaultPos">Pos</label>
          <div>
            <select
              v-model="editedUser.default_position"
              class="form-control"
              id="defaultPos"
            >
              <option disable selected></option>
              <option value=""></option>
              <option>Supervisor</option>
              <option>GL</option>
              <option>TL</option>
              <option>NC</option>
              <option>SettingDelivery</option>
              <option>OilSupply</option>
              <option>CB</option>
              <option>CH</option>
              <option>CoolantSupply</option>
              <option>ConsentasiCheck</option>
            </select>
          </div>
        </div>

        <!-- Modal Body -->

        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-primary"
            data-bs-dismiss="modal"
            @click="editKaryawan"
          >
            Simpan Perubahan
          </button>
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Tutup
          </button>
        </div>
        <!-- Modal Footer -->
      </div>
      <!--modal content-->
    </div>
    <!--modal dialog-->
  </div>
  <!-- Modal Edit Karyawan -->
  <!-- Modal Konfirmasi Delete -->
  <div class="modal" tabindex="-1" role="dialog" id="deleteConfirmationModal">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Konfirmasi Hapus Karyawan</h5>
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
          Apakah Anda yakin ingin menghapus karyawan ini?
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
            data-bs-dismiss="modal"
            @click="deleteKaryawan(selectedEmployee.employee_id)"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="container-fluid">
    <div class="card p-2">
      <div class="d-flex justify-content-end w-100">
        <h4>Data Karyawan</h4>
        <button
          class="btn btn-primary ms-auto"
          style="width: fit-content"
          data-bs-toggle="modal"
          data-bs-target="#modalTambahKaryawan"
        >
          Tambah Karyawan
        </button>
      </div>
    </div>
  </div>

  <div class="container-fluid mt-2">
    <div class="card p-2">
      <div class="d-flex align-items-center">
        <!-- Pagination -->
        <nav aria-label="Page navigation" class="ms-auto">
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

        <!-- Search input -->
        <input
          class="form-control ms-auto"
          type="text"
          v-model="searchInput"
          placeholder="Cari"
          @input="filterKaryawan"
          style="max-width: 150px"
        />
      </div>

      <div class="table-responsive">
        <table class="table mt-3 text-center tb-emp table-bordered">
          <thead style="height: 70px; font-size: large">
            <tr>
              <th scope="col">No</th>
              <th scope="col">Nama</th>
              <th scope="col">Noreg</th>
              <th scope="col">Foto</th>
              <th scope="col">Shift</th>
              <th scope="col">Jabatan</th>
              <th scope="col">Pos</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody id="dataKaryawan" style="text-align: center" class="fntSz">
            <!-- Data Karyawan akan ditampilkan di sini -->
            <tr
              v-for="(karyawan, index) in paginatedData"
              :key="karyawan.employee_id"
            >
              <td class="vAm">{{ index + 1 }}</td>
              <td class="vAm">{{ karyawan.nama }}</td>
              <td class="vAm">{{ karyawan.noreg }}</td>
              <td style="width: 10%">
                <img
                  v-if="karyawan.previewUrl"
                  :src="karyawan.previewUrl"
                  :alt="karyawan.nama"
                  style="max-width: 50%; height: 100%"
                />
              </td>
              <td class="vAm">{{ karyawan.shift }}</td>
              <td class="vAm">{{ karyawan.jabatan }}</td>
              <td class="vAm">{{ karyawan.default_position }}</td>
              <td class="vAm">
                <button
                  type="button"
                  class="btn btn-sm"
                  data-bs-toggle="modal"
                  data-bs-target="#editModal"
                  @click="prepareEdit(karyawan, index)"
                >
                  <i class="fas fa-edit text-primary"></i>
                </button>
                <button
                  type="button"
                  class="btn btn-sm"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteConfirmationModal"
                  @click="showDeleteConfirmation(karyawan.employee_id)"
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
  <!--  container-fluid -->
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'AddEmployees',
  props: {
    karyawan: Object, // Objek karyawan yang akan dihapus
  },
  data() {
    return {
      newUser: {
        // Inisialisasi newUser
        nama: '',
        noreg: '',
        selectedFile: null, // Menyimpan file foto yang dipilih
        shift: '',
        jabatan: '',
        previewUrl: '',
        profile: '',
        defaultPos: '',
      },
      editedUser: {
        // Inisialisasi editedUser
        nama: '',
        noreg: '',
        shift: '',
        jabatan: '',
        selectedFile: null,
        previewUrl: '',
        profile: '',
        default_position: '',
      },
      pageSize: 5, // Jumlah item per halaman
      currentPage: 1, // Halaman saat ini
      selectedEmployeeIndex: -1, // Inisialisasi dengan nilai -1
      selectedEmployee: {}, // Objek untuk menyimpan ID karyawan yang akan dihapus
      searchInput: '', // Properti search untuk menyimpan nilai input pencarian
    }
  },
  computed: {
    ...mapGetters(['getKaryawanList']),
    ...mapGetters(['getResponse']),

    // Total halaman berdasarkan data karyawan yang difilter
    totalPages() {
      const data = this.filteredKaryawanList
      return Math.ceil(data.length / this.pageSize)
    },

    // Data karyawan yang telah difilter
    filteredKaryawanList() {
      const searchTerm = this.searchInput.toLowerCase()
      return this.getKaryawanList.filter((karyawan) => {
        // Misalnya, kita ingin memfilter berdasarkan nama karyawan
        return karyawan.nama.toLowerCase().includes(searchTerm)
      })
    },

    // Data yang dipaginasikan berdasarkan data yang telah difilter
    paginatedData() {
      const data = this.filteredKaryawanList
      const startIndex = (this.currentPage - 1) * this.pageSize
      const endIndex = this.currentPage * this.pageSize
      return data.slice(startIndex, endIndex)
    },
  },

  watch: {
    getResponse(response) {
      console.log(response)
      if (response && response.status === 201) {
        alert('Data karyawan berhasil ditambahkan')
      } else if (response && response.message) {
        // Tampilkan pesan kesalahan jika ada
        alert(response.message)
      }
    },
  },
  created() {
    // Panggil aksi untuk mengambil data karyawan
    this.$store
      .dispatch('fetchKaryawanList')
      .then(() => {
        console.log(
          'Pencarian karyawan berhasil dilakukan saat komponen dibuat.',
        )
      })
      .catch((error) => {
        console.error(
          'Terjadi kesalahan saat melakukan pencarian karyawan:',
          error,
        )
      })
      .catch((error) => {
        console.error('Terjadi kesalahan saat mengambil data karyawan:', error)
      })
  },

  methods: {
    isSaveDisabled() {
      return !(
        this.newUser.nama &&
        this.newUser.noreg &&
        this.newUser.selectedFile &&
        this.newUser.shift &&
        this.newUser.jabatan
      )
    },
    // Metode untuk memeriksa previewUrl dari karyawan
    checkPreviewUrl() {
      if (this.getKaryawanList.length > 0) {
        // Memeriksa nilai previewUrl dari karyawan pertama dalam daftar
        console.log(
          'Preview URL dari karyawan pertama:',
          this.getKaryawanList[0].previewUrl,
        )
      } else {
        console.log('Data karyawan kosong atau belum dimuat.')
      }
    },
    // Metode untuk mengambil file foto saat diubah
    onFileChange(event) {
      const file = event.target.files[0]
      const maxSize = 500 * 1024 // 500 KB
      if (!file || !file.type.startsWith('image/')) {
        alert('Pilih file gambar yang valid.')
        return
      }

      if (file.size > maxSize) {
        alert('Ukuran file terlalu besar. Maksimal 500 KB.')
        return
      }

      const reader = new FileReader()
      reader.onload = () => {
        this.newUser.previewUrl = reader.result // Atur previewUrl newUser
        this.newUser.selectedFile = file // Atur selectedFile
        // Set juga previewUrl dan selectedFile pada editedUser
        this.editedUser.previewUrl = reader.result
        this.editedUser.selectedFile = file

        // Tambahkan console.log di sini
        console.log('Preview URL:', this.newUser.previewUrl)
        // Tambahkan logging untuk memeriksa nilai previewUrl setelah diatur
        console.log('Preview URL setelah diatur:', this.newUser.previewUrl)
      }

      reader.readAsDataURL(file)
    },

    async tambahKaryawan() {
      try {
        // Set properti profile dengan URL foto
        this.newUser.profile = this.newUser.previewUrl

        console.log('Data karyawan yang akan ditambahkan:', this.newUser)
        // Logging untuk memeriksa apakah properti profile berisi URL atau tidak
        console.log('Profile value:', this.newUser.profile)
        console.log(this.newUser)
        // Panggil aksi ActionTambahKaryawan dengan data karyawan yang baru
        await this.$store.dispatch('ActionTambahKaryawan', this.newUser)

        // Panggil fungsi checkPreviewUrl() untuk memeriksa previewUrl dari karyawan
        this.checkPreviewUrl()

        // Setelah menambahkan karyawan, reset form
        this.newUser = {
          nama: '',
          noreg: '',
          shift: '',
          jabatan: '',
          selectedFile: null,
          previewUrl: '',
          profile: '',
          defaultPos: '',
        }
        // Setelah menambahkan karyawan, reset input file
        const inputFile = this.$refs.inputFile
        if (inputFile) {
          inputFile.value = null
        }

        await this.$store.dispatch('fetchKaryawanList')

        console.log('Data karyawan setelah ditambahkan:', this.getKaryawanList)
      } catch (error) {
        console.error('Terjadi kesalahan saat menambah karyawan:', error)
      }
    },
    goToPage(page) {
      this.currentPage = page
    },
    prepareEdit(karyawan, index) {
      // Set indeks karyawan yang dipilih
      this.selectedEmployeeIndex = index

      // Cek apakah properti employee_id ada dalam objek karyawan
      if ('employee_id' in karyawan) {
        console.log('employee_id ditemukan:', karyawan)
        // Salin data karyawan yang akan diedit ke editedUser
        this.editedUser = { ...karyawan, employee_id: karyawan.employee_id }
      } else {
        console.log(
          'employee_id tidak ditemukan dalam objek karyawan:',
          karyawan,
        )
        // Jika employee_id tidak ditemukan, salin data karyawan tanpa employee_id
        this.editedUser = { ...karyawan }
      }
    },

    resetEditedUser() {
      if (this.selectedEmployeeIndex !== -1) {
        const selectedEmployee = this.paginatedData[this.selectedEmployeeIndex]
        this.editedUser = { ...selectedEmployee }
      }
    },
    editKaryawan() {
      try {
        console.log('Metode editKaryawan dijalankan.')

        // Pastikan ada karyawan yang dipilih
        if (this.selectedEmployeeIndex === -1) {
          console.log('Tidak ada karyawan yang dipilih untuk diedit.')
          return // Keluar dari fungsi jika tidak ada karyawan yang dipilih
        }

        // Ambil karyawan yang dipilih dari data yang dipaginasi
        const selectedEmployee = this.paginatedData[this.selectedEmployeeIndex]

        // Pastikan ada properti employee_id dalam objek karyawan yang dipilih
        if (!('employee_id' in selectedEmployee)) {
          console.log(
            'employee_id tidak ditemukan dalam objek karyawan:',
            selectedEmployee,
          )
          return // Keluar dari fungsi jika tidak ada employee_id
        }

        // Tampilkan payload sebelum mengirimnya ke backend
        console.log('Payload yang akan dikirim ke backend:', this.editedUser)

        // Panggil aksi ActionEditKaryawan dengan data yang diperlukan
        this.$store
          .dispatch('ActionEditKaryawan', {
            employee_id: this.editedUser.employee_id, // Sertakan ID karyawan yang akan diedit
            editedData: { ...this.editedUser }, // Gunakan langsung referensi ke editedUser
          })
          .then((response) => {
            // Reset editedUser setelah berhasil mengedit karyawan
            this.editedUser = {
              nama: '',
              noreg: '',
              shift: '',
              jabatan: '',
              selectedFile: null,
              previewUrl: '',
              profile: '',
              defaultPos: '',
            }

            console.log('Response dari server:', response) // Tambahkan logging untuk response dari server
          })
          .catch((error) => {
            console.error(
              'Terjadi kesalahan saat menyimpan perubahan karyawan:',
              error,
            )
          })

        // Reset selectedEmployeeIndex
        this.selectedEmployeeIndex = -1
      } catch (error) {
        console.error(
          'Terjadi kesalahan saat menyimpan perubahan karyawan:',
          error,
        )
        alert('Gagal Edit Data Karyawan')
      }
    },
    showDeleteConfirmation(employee_id) {
      // Simpan ID karyawan yang akan dihapus
      this.selectedEmployee = { employee_id: employee_id }
    },

    deleteKaryawan(employee_id) {
      try {
        // Kirim permintaan delete ke backend
        this.$store
          .dispatch('ActionDeleteKaryawan', { employeeId: employee_id })
          .then(() => {
            // Jika berhasil, update data karyawan
            this.$store.dispatch('fetchKaryawanList')
          })
          .catch((error) => {
            console.error('Gagal menghapus karyawan:', error)
          })
      } catch (error) {
        console.error('Gagal menghapus karyawan:', error)
        alert('Gagal menghapus karyawan.')
      }
    },
  },
}
</script>
<style>
.fntSz {
  font-size: 15px;
  align-items: center;
  background-color: transparent;
  border-bottom: 1px solid #00050a;
}
.fntSz img {
  max-width: 100%;
  height: auto;
  background-color: transparent; /* Mengatur latar belakang gambar menjadi transparan */
}
.vAm {
  vertical-align: middle;
}
.page-link {
  color: #007bff; /* Warna teks tombol */
  background-color: #fff; /* Warna latar belakang tombol */
  border: 1px solid #dee2e6; /* Garis tepi tombol */
  border-radius: 0.25rem; /* Sudut melengkung tombol */
  transition: all 0.3s ease; /* Efek transisi saat hover */
}

.page-link:hover {
  background-color: #e9ecef; /* Warna latar belakang saat tombol dihover */
}

.page-link:focus {
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25); /* Efek bayangan saat tombol mendapatkan fokus */
}

.page-item.disabled .page-link {
  color: #6c757d; /* Warna teks tombol yang dinonaktifkan */
  pointer-events: none; /* Menonaktifkan interaksi tombol yang dinonaktifkan */
}

.page-item.active .page-link {
  z-index: 1; /* Mendatangkan tombol ke depan */
  color: #fff; /* Warna teks tombol aktif */
  background-color: #007bff; /* Warna latar belakang tombol aktif */
  border-color: #007bff; /* Warna garis tepi tombol aktif */
}
.tb-emp th {
  background-color: rgb(198, 240, 240);
}
.table-bordered {
  border: 1px solid black;
}
</style>
