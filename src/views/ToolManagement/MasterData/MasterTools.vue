<template>
  <div class="modal" tabindex="-1" id="modalMasterTools">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ isEditMode ? 'Edit Master Tools' : 'Add Master Tools' }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            @click="resetModal"
          ></button>
        </div>
        <div class="modal-body">
          <div class="form-group mb-3">
            <label for="line">Line</label>
            <v-select
              id="line"
              v-model="selectedLine"
              :options="GET_MASTER_LINES"
              @update:modelValue="onLineChange"
              label="line_nm"
            />
          </div>
          <div class="form-group mb-3">
            <label for="machine">Op</label>
            <v-select
              id="machine"
              v-model="selectedOpNo"
              :options="OPOptions"
              label="op_no"
            />
          </div>
          <div class="form-group mb-3">
            <label for="tool">Tool No</label>
            <input
              id="tool"
              type="text"
              class="form-control"
              v-model="tool_no"
              :class="{ 'is-invalid': !isValidToolNo && tool_no }"
            />
            <div v-if="!isValidToolNo && tool_no" class="invalid-feedback">
              Tool No harus diawali dengan 'T' dan diikuti angka (contoh: T1,
              T12).
            </div>
          </div>
          <div class="form-group mb-3">
            <label for="description">Tool Name</label>
            <input
              id="toolName"
              type="text"
              class="form-control"
              v-model="tool_nm"
              :class="{ 'is-inValidToolName': !isValidToolName && tool_nm }"
            />
            <div
              v-if="!isValidToolName && tool_nm"
              class="invalid-feedback-toolNm"
            >
              Contoh format : DSSW-09131
            </div>
          </div>
          <div class="form-group mb-3">
            <label for="description">Process Name</label>
            <input
              id="description"
              type="text"
              class="form-control"
              v-model="process_nm"
            />
          </div>
          <div class="form-group mb-3">
            <label for="std">Standart Counter</label>
            <input
              id="std"
              type="number"
              class="form-control"
              v-model="std_ctr"
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
            @click="saveMasterTools"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal" tabindex="-1" id="modalDeleteMasterTools">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Delete Master Tools</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <p>Are you sure want to delete this Master Tools?</p>
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
            @click="deleteMasterTools"
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
        <h4 class="text-center m-0">Master Tools</h4>
        <div>
          <button
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#modalMasterTools"
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
      <div class="d-flex justify-content-end">
        <input
          class="form-control mt-2"
          style="width: 15%"
          type="search"
          v-model="searchResult"
          placeholder="Search Tool..."
        />
      </div>
      <table class="table table-bordered text-center mt-1">
        <thead>
          <tr>
            <th style="width: 3%">No</th>
            <th style="width: 10%">Line</th>
            <th style="width: 5%">Op No</th>
            <th style="width: 5%">Tool No</th>
            <th style="width: 10%">Tool Name</th>
            <th style="width: 25%">Process Name</th>
            <th style="width: 8%">Std Counter</th>
            <th style="width: 10%">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in paginatedData" :key="item.tool_id">
            <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
            <td>{{ item.line_nm }}</td>
            <td>{{ item.op_no }}</td>
            <td>{{ item.tool_no }}</td>
            <td>{{ item.tool_nm }}</td>
            <td>{{ item.process_nm }}</td>
            <td>{{ item.std_counter }}</td>
            <td>
              <button
                class="btn me-2"
                data-bs-toggle="modal"
                data-bs-target="#modalMasterTools"
                @click="editMasterTools(item)"
              >
                <i class="fas fa-edit text-primary"></i>
              </button>
              <button
                data-bs-toggle="modal"
                data-bs-target="#modalDeleteMasterTools"
                class="btn"
                @click="prepareDeleteTools(item.tool_id)"
              >
                <i class="fas fa-trash text-danger"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import {
  ACTION_ADD_MASTER_TOOLS,
  ACTION_DELETE_MASTER_TOOLS,
  ACTION_EDIT_MASTER_TOOLS,
  ACTION_GET_MACHINES_OP_NO,
  ACTION_GET_MASTER_LINES,
  ACTION_GET_MASTER_TOOLS,
  GET_DATA_MACHINES,
  GET_MASTER_LINES,
  GET_MASTER_TOOLS,
} from '@/store/Tool/MasterTools.module'
export default {
  name: 'MasterTools',
  components: {
    vSelect,
  },
  data() {
    return {
      isEditMode: false,
      selectedLine: null,
      selectedOpNo: null,
      OPOptions: [],
      tool_no: '',
      tool_nm: '',
      process_nm: '',
      pageSize: 20, // Items per page
      currentPage: 1, // Current page
      searchResult: '',
      line_id: '',
      std_ctr: '',
      tool_id: null,
    }
  },
  computed: {
    ...mapGetters([GET_MASTER_LINES, GET_DATA_MACHINES, GET_MASTER_TOOLS]),
    isValidToolNo() {
      // Validasi menggunakan regex: T diikuti angka
      return /^T\d+$/.test(this.tool_no)
    },
    isValidToolName() {
      // Validasi menggunakan regex: HURUF BESAR-huruf/angka bebas-HURUF BESAR
      return /^[A-Z]+-[A-Z0-9]+$/.test(this.tool_nm)
    },
    totalPages() {
      const query = this.searchResult.trim().toLowerCase()
      const filteredData = query
        ? this.GET_MASTER_TOOLS.filter((tool) =>
            tool.tool_nm.toLowerCase().includes(query),
          )
        : this.GET_MASTER_TOOLS

      return Math.ceil(filteredData.length / this.pageSize)
    },

    paginatedData() {
      const query = this.searchResult.trim().toLowerCase() // Ambil input pencarian
      const filteredData = query
        ? this.GET_MASTER_TOOLS.filter((tool) =>
            tool.tool_nm.toLowerCase().includes(query),
          )
        : this.GET_MASTER_TOOLS // Jika tidak ada pencarian, gunakan data asli

      const startIndex = (this.currentPage - 1) * this.pageSize
      const endIndex = this.currentPage * this.pageSize
      return filteredData.slice(startIndex, endIndex)
    },
    isFilled() {
      return (
        this.selectedLine !== null &&
        this.selectedOpNo !== null &&
        this.tool_no !== '' &&
        this.tool_nm !== '' &&
        this.process_nm !== '' &&
        this.std_ctr !== ''
      )
    },
  },
  mounted() {
    this.$store.dispatch(ACTION_GET_MASTER_LINES)
    this.$store.dispatch(ACTION_GET_MASTER_TOOLS)
  },

  methods: {
    goToPage(page) {
      if (page < 1 || page > this.totalPages) return
      this.currentPage = page
    },
    openAddModal() {
      this.isEditMode = false
    },
    async onLineChange() {
      try {
        if (this.selectedLine === null) return
        const line_nm = this.selectedLine.line_nm
        let response = await this.$store.dispatch(
          ACTION_GET_MACHINES_OP_NO,
          line_nm,
        )
        if (response.status === 200) {
          this.OPOptions = this.GET_DATA_MACHINES
        }
      } catch (error) {
        console.error('Error fetching machines:', error)
        this.$swal({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        })
      }
    },
    saveMasterTools() {
      if (this.isEditMode) {
        this.updateMasterTools()
      } else {
        this.addMasterTools()
      }
    },
    async addMasterTools() {
      try {
        const payload = {
          line_id: this.selectedLine.line_id,
          line_nm: this.selectedLine.line_nm,
          op_no: this.selectedOpNo.op_no,
          tool_no: this.tool_no,
          tool_nm: this.tool_nm,
          process_nm: this.process_nm,
          std_counter: this.std_ctr,
        }
        let response = await this.$store.dispatch(
          ACTION_ADD_MASTER_TOOLS,
          payload,
        )
        if (response.status === 201) {
          this.$store.dispatch(ACTION_GET_MASTER_TOOLS)
          this.$swal({
            icon: 'success',
            title: 'Success',
            text: 'Data saved successfully!',
          })
        }
        this.resetModal()
      } catch (error) {
        this.$swal({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        })
      }
    },
    editMasterTools(item) {
      this.isEditMode = true
      this.tool_id = item.tool_id
      this.line_id = item.line_id
      this.selectedLine = item.line_nm
      this.selectedOpNo = item.op_no
      this.tool_no = item.tool_no
      this.tool_nm = item.tool_nm
      this.process_nm = item.process_nm
      this.std_ctr = item.std_counter
    },
    async updateMasterTools() {
      try {
        const payload = {
          tool_id: this.tool_id,
          line_id: this.line_id,
          line_nm: this.selectedLine,
          op_no: this.selectedOpNo,
          tool_no: this.tool_no,
          tool_nm: this.tool_nm,
          process_nm: this.process_nm,
          std_counter: this.std_ctr,
        }
        let response = await this.$store.dispatch(
          ACTION_EDIT_MASTER_TOOLS,
          payload,
        )
        if (response.status === 200) {
          this.$store.dispatch(ACTION_GET_MASTER_TOOLS)
          this.$swal({
            icon: 'success',
            title: 'Success',
            text: 'Data updated successfully!',
          })
          this.resetModal()
        }
      } catch (error) {
        this.$swal({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        })
      }
    },
    prepareDeleteTools(tool_id) {
      this.tool_id = tool_id
    },

    async deleteMasterTools() {
      try {
        let response = await this.$store.dispatch(
          ACTION_DELETE_MASTER_TOOLS,
          this.tool_id,
        )
        if (response.status === 200) {
          this.$store.dispatch(ACTION_GET_MASTER_TOOLS)
          this.$swal({
            icon: 'success',
            title: 'Success',
            text: 'Data deleted successfully!',
          })
          this.resetModal()
        }
      } catch (error) {
        this.$swal({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        })
      }
    },
    resetModal() {
      this.selectedLine = null
      this.selectedOpNo = null
      this.tool_no = ''
      this.tool_nm = ''
      this.process_nm = ''
      this.std_ctr = ''
      this.isEditMode = false
      this.line_id = ''
      this.tool_id = null
    },
  },
}
</script>

<style>
/* Tambahkan gaya untuk input yang tidak valid */
.is-invalid {
  border-color: red;
  background-color: rgba(253, 60, 60, 0.1) !important;
}
.invalid-feedback {
  color: red;
  font-size: 0.875rem;
}
.is-inValidToolName {
  border-color: red;
  background-color: rgba(253, 60, 60, 0.1) !important;
}
.invalid-feedback-toolNm {
  color: red;
  font-size: 0.875rem;
}

.table-bordered th {
  background-color: rgb(198, 240, 240);
}
.table-bordered {
  border: 1px solid black;
}
</style>
