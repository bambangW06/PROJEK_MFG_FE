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
        <!-- Filter -->
        <div class="card p-3 mb-3 shadow-sm">
          <div class="row d-flex flex-wrap gap-3 mb-3 align-items-end mb-2">
            <div class="col filter-group flex-grow-1">
              <label class="form-label fw-semibold mb-1">Line</label>
              <v-select
                :options="getLineNames"
                v-model="selectedLineGentani"
                label="line_nm"
                placeholder="Pilih Line"
                class="w-100"
                :append-to-body="true"
              />
            </div>
            <div class="col filter-group flex-grow-1 mb-3">
              <label class="form-label fw-semibold mb-1">Bulan</label>
              <input
                type="month"
                v-model="selectedMonth"
                class="form-control w-100"
              />
            </div>
          </div>

          <!-- Table  -->
          <div class="table-responsive table-wrapper">
            <table
              class="table table-bordered table-sm text-center align-middle sticky-table"
            >
              <thead>
                <tr>
                  <th class="sticky-col sticky-col-1">No</th>
                  <th class="sticky-col sticky-col-2">Line</th>
                  <th class="sticky-col sticky-col-3">Tanggal</th>

                  <th v-for="day in days" :key="day" :class="getDayClass(day)">
                    {{ day }}
                  </th>

                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                <!-- PLAN PROD -->
                <tr class="table-info">
                  <td class="sticky-col sticky-col-1" rowspan="2">1</td>
                  <td class="sticky-col sticky-col-2" rowspan="2">
                    {{ selectedLineGentani?.line_nm || '-' }}
                  </td>

                  <!-- Row 1: PLAN -->
                  <td class="sticky-col sticky-col-3 fw-semibold">Plan</td>

                  <td
                    v-for="day in days"
                    :key="'plan-' + day"
                    :class="getDayClass(day)"
                  >
                    <input
                      type="number"
                      class="form-control text-center plan-input"
                      style="width: 60px"
                      v-model.number="planProdDaily[day]"
                      @input="recalcCumulativePlan"
                      @change="savePlan(day)"
                    />
                  </td>

                  <td class="fw-semibold">
                    {{
                      Object.values(planProdDaily).reduce(
                        (a, b) => a + (Number(b) || 0),
                        0,
                      )
                    }}
                  </td>
                </tr>

                <!-- CUMULATIVE PLAN -->
                <tr class="table-primary fw-semibold">
                  <td class="sticky-col sticky-col-3">Cumulative</td>

                  <td
                    v-for="day in days"
                    :key="'cumu-plan-' + day"
                    :class="getDayClass(day)"
                  >
                    {{ cumulativePlan(day) }}
                  </td>

                  <td>
                    {{ planProdCumulative[days[days.length - 1]] || 0 }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- Table -->
        <div class="table-responsive">
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
                <option v-for="n in [10, 15, 20, 25, 30]" :key="n" :value="n">
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
import {
  ACTION_ADD_PLAN_PROD,
  ACTION_GET_PLAN_PROD,
  GET_PLAN_PROD,
} from '@/store/Chemical/PlanProd.module'
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
      selectedMonth: null,
      selectedLineGentani: null,
      gentaniList: [], // data dari API
      lineOptions: [], // data line master
      oilOptions: [], // data oil master
      form: {}, // data form untuk modal
      modalTitle: '',
      modalMode: 'add', // add / edit / delete
      perPage: 10, // default 5 per halaman
      currentPage: 1,
      planProdDaily: {},
      planProdCumulative: {},
      days: [],
    }
  },
  computed: {
    ...mapGetters([
      'getLineNames',
      GET_STD_GENTANI,
      GET_MASTER_OIL,
      'getLineNames',
      GET_PLAN_PROD,
    ]),
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
    async selectedLineGentani() {
      this.loadPlanProduction()
      await this.$store.dispatch(ACTION_GET_STD_GENTANI, {
        line_id: this.selectedLineGentani?.line_id,
        month: this.selectedMonth,
      })
    },
    async selectedMonth() {
      this.generateDays()
      this.loadPlanProduction()
      await this.$store.dispatch(ACTION_GET_STD_GENTANI, {
        line_id: this.selectedLineGentani?.line_id,
        month: this.selectedMonth,
      })
    },
  },
  async mounted() {
    const today = new Date()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const year = today.getFullYear()
    this.selectedMonth = `${year}-${month}`
    await this.$store.dispatch('fetchLines')
    const defaultLine = this.getLineNames.find(
      (line) => line.line_nm === 'Cylinder Block',
    )
    if (defaultLine) this.selectedLineGentani = defaultLine
    this.generateDays()
    await this.$store.dispatch(ACTION_GET_STD_GENTANI, {
      line_id: this.selectedLineGentani.line_id,
      month: this.selectedMonth,
    })
    await this.$store.dispatch(ACTION_GET_MASTER_OIL)
    this.loadPlanProduction()
  },
  methods: {
    generateDays() {
      const [year, month] = this.selectedMonth.split('-')
      const lastDay = new Date(year, month, 0).getDate()
      this.days = Array.from({ length: lastDay }, (_, i) => i + 1)
    },
    async savePlan(day) {
      try {
        if (!this.selectedLineGentani) return

        const payload = {
          line_id: this.selectedLineGentani.line_id,
          plan_dt: `${this.selectedMonth}-${String(day).padStart(2, '0')}`,
          plan_prod: Number(this.planProdDaily[day] || 0),
        }

        let response = await this.$store.dispatch(ACTION_ADD_PLAN_PROD, payload)
        if (response.status === 201) {
          console.log('payload', payload)
        }
        // reload setelah save
        this.loadPlanProduction()
      } catch (err) {
        console.error('Save plan error:', err)
      }
    },

    async loadPlanProduction() {
      try {
        if (!this.selectedLineGentani || !this.selectedMonth) return
        const payload = {
          line_id: this.selectedLineGentani.line_id,
          month: this.selectedMonth,
        }
        let res = await this.$store.dispatch(ACTION_GET_PLAN_PROD, payload)
        if (res.status === 200) {
          const daily = {}
          this.days.forEach((day) => {
            const found = this.GET_PLAN_PROD.find((r) => {
              const d = new Date(r.plan_dt).getDate() // ⛔ convert plan_dt → day number
              return d === day
            })

            daily[day] = found ? Number(found.plan_prod) : 0
          })

          this.planProdDaily = daily
          this.recalcCumulativePlan()
        }
      } catch (error) {
        console.error(error)
      }
    },

    planProd(day) {
      return this.planProdDaily[day] ?? 0
    },

    cumulativePlan(day) {
      if (!this.planProdCumulative[day]) return 0
      return this.planProdCumulative[day]
    },

    // Hitung cumulative setiap kali plan daily berubah
    recalcCumulativePlan() {
      let total = 0
      this.planProdCumulative = {}

      this.days.forEach((day) => {
        const val = Number(this.planProdDaily[day] || 0)
        total += val
        this.planProdCumulative[day] = total
      })
    },

    getDayClass(day) {
      const [year, month] = this.selectedMonth.split('-')
      const date = new Date(year, parseInt(month) - 1, day)
      if (date.getDay() === 6) return 'saturday'
      if (date.getDay() === 0) return 'sunday'
      return ''
    },
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
        console.log('form edit', this.form)
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
      try {
        const payload = {
          line_id: this.form.line_obj?.line_id,
          oil_id: this.form.oil_obj?.oil_id,
          gentani_val: this.form.gentani_val,
          plan_prod: this.form.plan_prod,
          created_by: this.form.created_by,
        }
        let response = await this.$store.dispatch(
          ACTION_ADD_STD_GENTANI,
          payload,
        )
        if (response.status == 201) {
          this.$swal({
            icon: 'success',
            title: 'Success',
            text: 'Gentani added successfully',
          })
          this.$store.dispatch(ACTION_GET_STD_GENTANI, {
            line_id: this.selectedLineGentani.line_id,
            month: this.selectedMonth,
          })
          this.resetModal()
        }
      } catch (error) {
        console.log(error)
      }
    },

    async updateGentani() {
      console.log('kepanggil')

      try {
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

          this.resetModal()
        }
        this.$store.dispatch(ACTION_GET_STD_GENTANI, {
          line_id: this.selectedLineGentani.line_id,
          month: this.selectedMonth,
        })
      } catch (error) {
        console.log(error)
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
          this.$store.dispatch(ACTION_GET_STD_GENTANI, {
            line_id: this.selectedLineGentani.line_id,
            month: this.selectedMonth,
          })
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
.table-wrapper {
  overflow: auto;
  max-height: 400px;
  border: 1px solid #ccc;
}
/* ===============================
   BASE TABLE STYLE
   =============================== */
.sticky-table {
  border-collapse: separate;
  border-spacing: 0;
  width: max-content;
  min-width: 100%;
}

.sticky-table th,
.sticky-table td {
  border: 1px solid #000;
  padding: 4px 6px;
  text-align: center;
  vertical-align: middle;
  white-space: nowrap;
  background-clip: padding-box;
}

/* ===============================
   STICKY HEADER
   =============================== */
.sticky-table thead th {
  position: sticky;
  top: 0;
  background-color: rgb(198, 240, 240);
  z-index: 200; /* header tanggal */
}

/* Header sticky col harus di atas semuanya */
.sticky-table thead .sticky-col {
  z-index: 300 !important;
  background-color: rgb(198, 240, 240) !important;
}

/* ===============================
   STICKY COLUMN FIX
   =============================== */
.sticky-col {
  position: sticky;
  background-color: #fff !important;
  background-clip: padding-box;
  z-index: 150;

  /* Biar garis horizontal utama tidak terputus */
  border-left: 1px solid #000 !important;
  border-right: 1px solid #000 !important;
}

/* Tambahkan border atas hanya di THEAD sticky */
.sticky-table thead .sticky-col {
  border-top: 1px solid #000 !important;
}

/* Tambahkan border bawah hanya di row terakhir */
.sticky-table tbody tr:last-child .sticky-col {
  border-bottom: 1px solid #000 !important;
}

/* ===============================
   STICKY COLUMN POSITIONS
   =============================== */
.sticky-col-1 {
  left: 0;
  min-width: 50px;
  max-width: 50px;
}
.sticky-col-2 {
  left: 50px;
  min-width: 150px;
  max-width: 150px;
}
.sticky-col-3 {
  left: 200px;
  min-width: 120px;
  max-width: 120px;
}

/* ===============================
   CELL WRAPPING (khusus Chemical Type)
   =============================== */
.sticky-table th.sticky-col-2,
.sticky-table td.sticky-col-2 {
  white-space: normal !important;
  word-wrap: break-word;
  line-height: 1.2;
}

/* ===============================
   CUMULATIVE ROW
   =============================== */
.table-secondary td {
  background-color: #f3f3f3 !important;
  font-weight: 600;
}

/* ===============================
   WEEKEND COLORING
   =============================== */
.saturday {
  background-color: #ffeaea !important;
}
.sunday {
  background-color: #ffdcdc !important;
}
/* Input */
.sticky-table input[type='number'] {
  width: 45px;
  text-align: center;
  border: 1px solid #ccc;
  box-sizing: border-box;
}
.sticky-table input[type='number']::-webkit-inner-spin-button,
.sticky-table input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
/* ===============================
   TABLE BORDER WRAPPER
   =============================== */
.table-bordered {
  border: 1px solid black;
}
.table-bordered th {
  background-color: rgb(198, 240, 240);
}
</style>
