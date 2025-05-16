<template>
  <div class="modal" tabindex="-1" id="modalMasterOption">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ isEditMode ? 'Edit Master Options' : 'Add Master Options' }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            @click="resetModal"
          ></button>
        </div>
        <div class="modal-body">
          <div>
            <div class="form-group mb-3">
              <label for="no">Option Name</label>
              <input
                id="no"
                type="text"
                class="form-control"
                v-model="opt_nm"
              />
            </div>
          </div>
          <div>
            <div class="form-group mb-3">
              <label for="nama">Option Desc</label>
              <input
                id="nama"
                type="text"
                class="form-control"
                v-model="opt_desc"
              />
            </div>
          </div>
          <div>
            <div class="form-group mb-3">
              <label for="type">Image</label>
              <input
                id="img"
                type="file"
                class="form-control"
                name="foto"
                @change="onFileChange"
              />
              <!-- Menampilkan preview foto jika ada -->
              <img
                v-if="previewFile"
                :src="previewFile"
                class="mt-3"
                alt="#"
                style="max-width: 18%"
              />
            </div>
          </div>
          <div class="form-group mb-3">
            <div v-if="!isEditMode">
              <label for="createdBy">Created By</label>
              <input
                id="createdBy"
                type="text"
                class="form-control"
                v-model="created_by"
              />
            </div>
            <div v-else>
              <label for="updatedBy">Updated By</label>
              <input
                id="updatedBy"
                type="text"
                class="form-control"
                v-model="changed_by"
              />
            </div>
          </div>
          <div class="form-group mb-3">
            <label for="createdDt"> Created Date</label>
            <input
              id="createdDt"
              type="date"
              class="form-control"
              v-model="created_dt"
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
            :disabled="!isFilled"
            @click="saveMasterOption"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal" tabindex="-1" id="modalDeleteMasterOption">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Delete Master Option</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <p>Are you sure want to delete this Master Option?</p>
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
            class="btn btn-danger"
            data-bs-dismiss="modal"
            @click="deleteMasterOption"
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
        <h4 class="text-center m-0">Master Option Parameter</h4>
        <div>
          <button
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#modalMasterOption"
            @click="openAddModal"
          >
            <i class="fas fa-plus"></i>
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="container-fluid">
    <div class="card p-2">
      <div class="table-responsive">
        <table class="table table-hover table-bordered text-center">
          <thead>
            <tr>
              <th>No</th>
              <th>Option Name</th>
              <th>Desc</th>
              <th>Image</th>
              <th>Created By</th>
              <th>Created Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in paginate(GET_OPTIONS_PARAMETERS)"
              :key="item.option_id"
            >
              <td>
                {{
                  index +
                  1 +
                  (pagination.currentPage - 1) * pagination.itemsPerPage
                }}
              </td>
              <td>{{ item.opt_nm }}</td>
              <td>{{ item.opt_desc }}</td>
              <td>
                <img
                  v-if="item.ilustration"
                  :src="item.ilustration"
                  :alt="item.opt_nm"
                  style="max-width: 50%; height: 100%"
                />
              </td>
              <td>{{ item.changed_by ? item.changed_by : item.created_by }}</td>
              <td>{{ item.created_dt }}</td>
              <td>
                <button
                  class="btn btn-primary me-2"
                  data-bs-toggle="modal"
                  data-bs-target="#modalMasterOption"
                  @click="editMasterOption(item)"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  class="btn btn-danger"
                  data-bs-toggle="modal"
                  data-bs-target="#modalDeleteMasterOption"
                  @click="prepareDeleteOption(item.option_id)"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <nav aria-label="Page navigation">
          <ul class="pagination">
            <li
              class="page-item"
              :class="{ disabled: pagination.currentPage === 1 }"
            >
              <a class="page-link" @click="pagination.currentPage--"
                >Previous</a
              >
            </li>
            <li
              v-for="page in Math.ceil(
                pagination.totalItems / pagination.itemsPerPage,
              )"
              :key="page"
              class="page-item"
              :class="{ active: pagination.currentPage === page }"
            >
              <a class="page-link" @click="pagination.currentPage = page">{{
                page
              }}</a>
            </li>
            <li
              class="page-item"
              :class="{
                disabled:
                  pagination.currentPage ===
                  Math.ceil(pagination.totalItems / pagination.itemsPerPage),
              }"
            >
              <a class="page-link" @click="pagination.currentPage++">Next</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
import {
  ACTION_ADD_OPTION_PARAMETERS,
  ACTION_DELETE_OPTION_PARAMETERS,
  ACTION_EDIT_OPTION_PARAMETERS,
} from '@/store/Chemical/MasterOption.module'
import {
  ACTION_GET_OPTIONS_PARAMETERS,
  GET_OPTIONS_PARAMETERS,
} from '@/store/Chemical/parametersCheck.module'
import { mapGetters } from 'vuex'

export default {
  name: 'MasterOptions',
  data() {
    return {
      isEditMode: false,
      option_id: null,
      opt_nm: '',
      opt_desc: '',
      ilustrasion: '',
      created_by: '',
      created_dt: '',
      changed_by: '',
      selectedFile: null,
      previewFile: '',
      pagination: {
        currentPage: 1,
        totalItems: 0,
        itemsPerPage: 10,
      },
    }
  },
  computed: {
    ...mapGetters([GET_OPTIONS_PARAMETERS]),
    isFilled() {
      if (this.isEditMode) {
        return (
          this.opt_nm !== '' &&
          this.opt_desc !== '' &&
          this.changed_by !== '' &&
          this.created_dt
        )
      } else {
        return (
          this.opt_nm !== '' &&
          this.opt_desc !== '' &&
          this.created_by !== '' &&
          this.created_dt !== ''
        )
      }
    },
  },
  async mounted() {
    await this.$store.dispatch(ACTION_GET_OPTIONS_PARAMETERS)
  },
  methods: {
    paginate(data) {
      const start =
        (this.pagination.currentPage - 1) * this.pagination.itemsPerPage
      const end = start + this.pagination.itemsPerPage
      return data.slice(start, end)
    },
    openAddModal() {
      this.isEditMode = false
    },
    editMasterOption(item) {
      this.isEditMode = true
      this.option_id = item.option_id
      this.opt_nm = item.opt_nm
      this.opt_desc = item.opt_desc
      this.ilustrasion = item.ilustrasion
      this.created_dt = ''
      this.changed_by = ''
    },
    prepareDeleteOption(id) {
      this.option_id = id
    },
    onFileChange(event) {
      const file = event.target.files[0]
      const maxSize = 2 * 1024 * 1024 // 2 MB dalam byte

      if (!file || !file.type.startsWith('image/')) {
        alert('Pilih file gambar yang valid.')
        return
      }

      if (file.size > maxSize) {
        alert('Ukuran file terlalu besar. Maksimal 2 mb.')
        return
      }

      const reader = new FileReader()
      reader.onload = () => {
        this.previewFile = reader.result // Atur previewFile newUser
        this.selectedFile = file // Atur selectedFile
      }

      reader.readAsDataURL(file)
    },
    saveMasterOption() {
      if (this.isEditMode) {
        this.updateMasterOption()
      } else {
        this.addMasterOption()
      }
    },
    async addMasterOption() {
      try {
        const payload = {
          opt_nm: this.opt_nm,
          opt_desc: this.opt_desc,
          ilustrasion: this.selectedFile,
          created_by: this.created_by,
          created_dt: this.created_dt,
        }
        let response = await this.$store.dispatch(
          ACTION_ADD_OPTION_PARAMETERS,
          payload,
        )
        if (response.status === 201) {
          this.$swal({
            icon: 'success',
            title: 'Success',
            text: 'Data saved successfully!',
          })
          this.$store.dispatch(ACTION_GET_OPTIONS_PARAMETERS)
          this.resetModal()
        } else {
          this.$swal({
            icon: 'error',
            title: 'Error',
            text: 'Failed to save data',
          })
        }
      } catch (error) {
        console.error(error)
      }
    },
    async updateMasterOption() {
      try {
        const payload = {
          option_id: this.option_id,
          opt_nm: this.opt_nm,
          opt_desc: this.opt_desc,
          ilustrasion: this.selectedFile,
          changed_by: this.changed_by,
          created_dt: this.created_dt,
        }
        let response = await this.$store.dispatch(
          ACTION_EDIT_OPTION_PARAMETERS,
          payload,
        )
        if (response.status === 201) {
          this.$swal({
            icon: 'success',
            title: 'Success',
            text: 'Data updated successfully!',
          })
          this.$store.dispatch(ACTION_GET_OPTIONS_PARAMETERS)
          this.resetModal()
        } else {
          this.$swal({
            icon: 'error',
            title: 'Error',
            text: 'Failed to update data',
          })
        }
      } catch (error) {
        console.error(error)
      }
    },
    async deleteMasterOption() {
      try {
        const payload = {
          option_id: this.option_id,
        }
        let response = await this.$store.dispatch(
          ACTION_DELETE_OPTION_PARAMETERS,
          payload,
        )
        if (response.status === 201) {
          this.$swal({
            icon: 'success',
            title: 'Success',
            text: 'Data deleted successfully!',
          })
          this.$store.dispatch(ACTION_GET_OPTIONS_PARAMETERS)
          this.resetModal()
        } else {
          this.$swal({
            icon: 'error',
            title: 'Error',
            text: error,
          })
        }
      } catch (error) {
        console.log(error)
      }
    },
    resetModal() {
      this.option_id = null
      this.opt_nm = ''
      this.opt_desc = ''
      this.ilustrasion = ''
      this.created_by = ''
      this.created_dt = ''
      this.changed_by = ''
      this.selectedFile = null
      this.previewFile = ''
    },
  },
}
</script>
<style>
.table-bordered th {
  background-color: rgb(198, 240, 240);
}
.table-bordered {
  border: 1px solid black;
}
</style>
