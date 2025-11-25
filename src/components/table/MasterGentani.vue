<template>
  <div ref="wrapper">
    <!-- Modal: Add / Edit / Delete -->
    <div
      class="modal fade"
      id="modalMasterGentani"
      tabindex="-1"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ modalTitle }}</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>

          <div class="modal-body">
            <!-- Delete Confirmation -->
            <div v-if="modalMode === 'delete'">
              <p>
                Are you sure you want to delete
                <strong>{{ form.oil_nm }} ({{ form.line_nm }})</strong>?
              </p>
            </div>

            <!-- Add / Edit Form -->
            <div v-else>
              <div class="mb-2">
                <label class="form-label">Line</label>
                <v-select
                  :options="getLineNames"
                  v-model="form.line_obj"
                  label="line_nm"
                  placeholder="Select Line"
                ></v-select>
              </div>
              <div class="mb-2">
                <label class="form-label">Oil</label>
                <v-select
                  :options="GET_MASTER_OIL"
                  v-model="form.oil_obj"
                  label="oil_nm"
                  placeholder="Select Oil"
                ></v-select>
              </div>
              <div class="mb-2">
                <label class="form-label">Gentani Value</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="form.gentani_val"
                  @input="normalizeDecimal"
                />
              </div>
              <div class="mb-2">
                <label class="form-label">Plan Production</label>
                <input
                  type="number"
                  class="form-control"
                  v-model="form.plan_prod"
                />
              </div>
              <div class="mb-2">
                <label class="form-label">Created By</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="form.created_by"
                />
              </div>
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
              class="btn"
              data-bs-dismiss="modal"
              :disabled="!isFilled"
              :class="modalMode === 'delete' ? 'btn-danger' : 'btn-primary'"
              @click="submitModal"
            >
              {{ modalMode === 'delete' ? 'Delete' : 'Save' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showMasterGentani === true" class="container-fluid">
      <!-- Header & Add Button -->
      <div class="card p-2 mb-2">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h4 class="m-0">Master Gentani</h4>
          <div>
            <button
              class="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#modalMasterGentani"
              @click="openModal('add')"
            >
              <i class="fas fa-plus"></i> Add
            </button>
          </div>
        </div>

        <!-- Table -->
        <div class="table-responsiv">
          <table class="table table-striped table-bordered text-center">
            <thead>
              <tr>
                <th>No</th>
                <th>Line</th>
                <th>Oil</th>
                <th>Gentani Value</th>
                <th>Plan Production</th>
                <th>Created By</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in paginatedData" :key="item.target_id">
                <td>{{ (currentPage - 1) * perPage + index + 1 }}</td>
                <td>{{ item.line_nm }}</td>
                <td>{{ item.oil_nm }}</td>
                <td>{{ item.gentani_val }}</td>
                <td>{{ item.plan_prod }}</td>
                <td>{{ item.created_by }}</td>
                <td>{{ formatDate(item.created_dt) }}</td>
                <td>
                  <button
                    class="btn btn-sm btn-warning me-1"
                    data-bs-toggle="modal"
                    data-bs-target="#modalMasterGentani"
                    @click="openModal('edit', item)"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    class="btn btn-sm btn-danger"
                    data-bs-toggle="modal"
                    data-bs-target="#modalMasterGentani"
                    @click="openModal('delete', item)"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="GET_STD_GENTANI.length === 0">
                <td colspan="8" class="text-center">No data available</td>
              </tr>
            </tbody>
          </table>
          <!-- Pagination Controls -->
          <div class="d-flex justify-content-between align-items-center mt-3">
            <!-- Per Page Selector -->
            <div>
              <select
                v-model="perPage"
                class="form-select form-select-sm"
                style="width: 80px"
              >
                <option
                  v-for="n in [5, 10, 15, 20, 25, 30]"
                  :key="n"
                  :value="n"
                >
                  {{ n }}
                </option>
              </select>
            </div>

            <!-- Page Buttons -->
            <nav>
              <ul class="pagination pagination-sm mb-0">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <button
                    class="page-link"
                    @click="currentPage--"
                    :disabled="currentPage === 1"
                  >
                    Prev
                  </button>
                </li>

                <li
                  v-for="page in totalPages"
                  :key="page"
                  class="page-item"
                  :class="{ active: currentPage === page }"
                >
                  <button class="page-link" @click="currentPage = page">
                    {{ page }}
                  </button>
                </li>

                <li
                  class="page-item"
                  :class="{ disabled: currentPage === totalPages }"
                >
                  <button
                    class="page-link"
                    @click="currentPage++"
                    :disabled="currentPage === totalPages"
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  ACTION_ADD_STD_GENTANI,
  ACTION_DELETE_STD_GENTANI,
  ACTION_EDIT_STD_GENTANI,
  ACTION_GET_STD_GENTANI,
  GET_STD_GENTANI,
} from '@/store/Chemical/Gentani.module'
import {
  ACTION_GET_MASTER_OIL,
  GET_MASTER_OIL,
} from '@/store/Chemical/MasterChemicals.module'
import { mapGetters } from 'vuex'

export default {
  name: 'MasterGentani',
  props: {
    showMasterGentani: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      gentaniList: [], // data dari API
      lineOptions: [], // data line master
      oilOptions: [], // data oil master
      form: {}, // data form untuk modal
      modalTitle: '',
      modalMode: 'add', // add / edit / delete
      perPage: 5, // default 5 per halaman
      currentPage: 1,
    }
  },
  computed: {
    ...mapGetters(['getLineNames', GET_STD_GENTANI, GET_MASTER_OIL]),
    // total page
    totalPages() {
      return Math.ceil(this.GET_STD_GENTANI.length / this.perPage)
    },

    // data yg ditampilkan di tabel
    paginatedData() {
      const start = (this.currentPage - 1) * this.perPage
      return this.GET_STD_GENTANI.slice(start, start + this.perPage)
    },
    isFilled() {
      // Mode delete → langsung true
      if (this.modalMode === 'delete') return true

      // Mode add/edit → cek field yang wajib
      return (
        this.form.line_obj &&
        this.form.oil_obj &&
        this.form.gentani_val &&
        this.form.plan_prod
      )
    },
  },
  watch: {
    'form.line_obj': function (newLine) {
      if (newLine) {
        // cari data terakhir plan_prod sesuai line_id
        const lineData = this.GET_STD_GENTANI.find(
          (item) => item.line_id === newLine.line_id,
        )
        if (lineData) {
          this.form.plan_prod = lineData.plan_prod
        } else {
          this.form.plan_prod = null
        }
      } else {
        this.form.plan_prod = null
      }
    },
  },
  async mounted() {
    await this.$store.dispatch(ACTION_GET_STD_GENTANI)
    await this.$store.dispatch('fetchLines')
    await this.$store.dispatch(ACTION_GET_MASTER_OIL)
  },
  methods: {
    normalizeDecimal(event) {
      let val = event.target.value
      val = val.replace(',', '.') // ganti koma jadi titik
      event.target.value = val
      this.form.gentani_val = val // update model
    },
    openModal(mode, item = null) {
      document.activeElement.blur() // FIX → hilangkan focus dulu
      this.modalMode = mode

      if (mode === 'add') {
        this.modalTitle = 'Add Gentani'
        this.form = {
          line_obj: null,
          oil_obj: null,
          gentani_val: null,
          plan_prod: null,
          created_by: null,
        }
      } else if (mode === 'edit') {
        this.modalTitle = 'Edit Gentani'

        this.form = {
          target_id: item.target_id,
          oil_id: item.oil_id,
          line_id: item.line_id,
          gentani_val: item.gentani_val,
          plan_prod: item.plan_prod,
          created_by: item.created_by,

          // Cari object line berdasarkan line_id
          line_obj: this.getLineNames.find((x) => x.line_id === item.line_id),

          // Cari object oil berdasarkan oil_id
          oil_obj: this.GET_MASTER_OIL.find((x) => x.oil_id === item.oil_id),
        }
      } else if (mode === 'delete') {
        this.modalTitle = 'Delete Gentani'
        this.form = { ...item }
      }
    },

    submitModal() {
      if (this.modalMode === 'add') {
        this.addGentani()
      } else if (this.modalMode === 'edit') {
        this.updateGentani()
      } else if (this.modalMode === 'delete') {
        this.removeGentani()
      }
    },
    async addGentani() {
      const payload = {
        line_id: this.form.line_obj?.line_id,
        oil_id: this.form.oil_obj?.oil_id,
        gentani_val: this.form.gentani_val,
        plan_prod: this.form.plan_prod,
        created_by: this.form.created_by,
      }
      let response = await this.$store.dispatch(ACTION_ADD_STD_GENTANI, payload)
      if (response.status == 201) {
        this.$swal({
          icon: 'success',
          title: 'Success',
          text: 'Gentani added successfully',
        })
        this.$store.dispatch(ACTION_GET_STD_GENTANI)
        this.resetModal()
      }
    },

    async updateGentani() {
      const payload = {
        target_id: this.form.target_id,
        line_id: this.form.line_obj?.line_id,
        oil_id: this.form.oil_obj?.oil_id,
        gentani_val: this.form.gentani_val,
        plan_prod: this.form.plan_prod,
        created_by: this.form.created_by,
      }
      let response = await this.$store.dispatch(
        ACTION_EDIT_STD_GENTANI,
        payload,
      )
      if (response.status == 200) {
        this.$swal({
          icon: 'success',
          title: 'Success',
          text: 'Gentani updated successfully',
        })
        this.$store.dispatch(ACTION_GET_STD_GENTANI)
        this.resetModal()
      }
    },

    async removeGentani() {
      try {
        const target_id = this.form.target_id
        let response = await this.$store.dispatch(
          ACTION_DELETE_STD_GENTANI,
          target_id,
        )
        if (response.status == 200) {
          this.$swal({
            icon: 'success',
            title: 'Success',
            text: 'Gentani deleted successfully',
          })
          this.$store.dispatch(ACTION_GET_STD_GENTANI)
          this.resetModal()
        }
      } catch (error) {
        console.log(error)
      }
    },
    formatDate(dt) {
      return dt ? new Date(dt).toLocaleString() : '-'
    },
    resetModal() {
      this.form = {
        target_id: null,
        line_obj: null,
        oil_obj: null,
        gentani_val: null,
        plan_prod: null,
      }
    },
  },
}
</script>

<style scoped>
.table-bordered {
  border: 1px solid black;
}
.table-bordered th {
  background-color: rgb(198, 240, 240);
}
</style>
