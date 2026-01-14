<template>
  <!-- Modal Note -->
  <div
    class="modal"
    id="noteModal"
    tabindex="-1"
    aria-hidden="true"
    ref="noteModal"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content p-3">
        <h6 class="fw-bold mb-2">Tambah / Edit Note</h6>

        <div class="mb-2">
          <label class="form-label">Tanggal</label>
          <input
            type="date"
            class="form-control form-control-sm"
            v-model="noteForm.date"
          />
        </div>

        <div class="mb-2">
          <label class="form-label">Shift</label>
          <select class="form-select form-select-sm" v-model="noteForm.shift">
            <option value="R">R</option>
            <option value="W">W</option>
          </select>
        </div>

        <div class="mb-2">
          <label class="form-label">Note</label>
          <v-select
            :options="GET_MASTER_NOTE"
            v-model="noteForm.selectedNote"
            label="note_nm"
            placeholder="Pilih note..."
          />
        </div>

        <div class="text-end">
          <button class="btn btn-secondary btn-sm me-2" data-bs-dismiss="modal">
            Batal
          </button>
          <button
            class="btn btn-primary btn-sm"
            @click="saveNote"
            data-bs-dismiss="modal"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="container-fluid p-3">
    <!-- Header -->
    <div class="card p-3 mb-3 shadow-sm">
      <div class="d-flex justify-content-between align-items-center flex-wrap">
        <h4 class="fw-bold m-0">Reservasi Chemical</h4>
        <div class="d-flex align-items-center gap-2">
          <label class="fw-bold">Pilih Bulan:</label>
          <input
            type="month"
            v-model="selectedMonth"
            class="form-control"
            style="width: 180px"
            @change="generateDays"
          />
        </div>
      </div>
    </div>

    <div class="card shadow-sm">
      <div class="card-body table-responsive">
        <div
          class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2"
        >
          <!-- Judul Bulan -->
          <div class="fw-bold fs-5">
            Data Reservasi Chemical Bulan :
            <span class="text-primary">
              {{ formatMonthName(selectedMonth) }}
            </span>
          </div>

          <!-- Filter Chemical -->
          <div>
            <v-select
              :options="chemicalOptions"
              v-model="selectedChemical"
              label="oil_nm"
              :reduce="(c) => c.oil_id"
              placeholder="Pilih Chemical"
              clearable
              style="width: 220px"
            />
          </div>
        </div>

        <!-- Pilih PIC -->
        <div>
          <label class="fw-bold" style="color: red"
            >Pilih PIC Sebelum Input Data</label
          >

          <v-select
            :options="getKaryawanList"
            v-model="selectedPIC"
            label="nama"
            placeholder="Pilih PIC"
            style="width: 220px"
          />
        </div>

        <div class="table-wrapper">
          <table
            class="table table-bordered align-middle text-center small sticky-table"
          >
            <thead>
              <tr>
                <th class="sticky-col sticky-col-1">No</th>
                <th class="sticky-col sticky-col-2">Chemical Type</th>
                <th class="sticky-col sticky-col-3">No Item</th>
                <th class="sticky-col sticky-col-4">Shift</th>
                <th v-for="day in days" :key="day" :class="getDayClass(day)">
                  {{ day }}
                </th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <template
                v-for="(chem, i) in filteredChemicals"
                :key="chem.oil_id"
              >
                <tr>
                  <td class="sticky-col sticky-col-1" :rowspan="3">
                    {{ i + 1 }}
                  </td>
                  <td class="sticky-col sticky-col-2" :rowspan="3">
                    {{ chem.oil_nm }}
                  </td>
                  <td class="sticky-col sticky-col-3" :rowspan="3">
                    <div>{{ chem.material_no }}</div>
                    <button
                      class="btn btn-sm btn-outline-secondary mt-1"
                      title="Tambah / Edit Note"
                      data-bs-toggle="modal"
                      data-bs-target="#noteModal"
                      @click="openNoteModal(chem)"
                    >
                      Notes
                    </button>
                  </td>

                  <td class="sticky-col sticky-col-4 fw-semibold text-danger">
                    R
                  </td>
                  <td
                    v-for="day in days"
                    :key="'r' + day"
                    :class="getDayClass(day)"
                  >
                    <input
                      type="number"
                      class="form-control form-control-sm text-center"
                      style="width: 45px"
                      v-model.number="chem.shift.R[day]"
                      @input="handleInput(chem, day, 'R')"
                    />
                  </td>
                  <td class="fw-semibold">{{ sumShift(chem.shift.R) }}</td>
                </tr>

                <tr>
                  <td class="fw-semibold sticky-col sticky-col-4">W</td>
                  <td
                    v-for="day in days"
                    :key="'w' + day"
                    :class="getDayClass(day)"
                  >
                    <input
                      type="number"
                      class="form-control form-control-sm text-center"
                      style="width: 45px"
                      v-model.number="chem.shift.W[day]"
                      @input="handleInput(chem, day, 'W')"
                    />
                  </td>
                  <td class="fw-semibold">{{ sumShift(chem.shift.W) }}</td>
                </tr>

                <tr class="table-secondary fw-semibold">
                  <td class="sticky-col sticky-col-4">Σ</td>
                  <td
                    v-for="day in days"
                    :key="'c' + day"
                    :class="getDayClass(day)"
                  >
                    <strong>{{ chem.cumulative[day] || 0 }}</strong>
                  </td>
                  <td>
                    <strong>{{ totalCumulative(chem) }}</strong>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="card p-3 mb-2 mt-3 shadow-sm">
      <h4 class="fw-bold mb-3">Pareto Chemical Bulan Ini</h4>
      <div>
        <v-select
          :options="chemicalOptions"
          v-model="selectedChemicalGraph"
          label="oil_nm"
          :reduce="(c) => c.oil_id"
          :append-to-body="true"
          placeholder="Pilih Chemical"
          clearable
          style="width: 220px"
        />
      </div>
    </div>

    <div class="card mb-3 shadow-sm p-3">
      <!-- Grafik Pareto -->
      <apexchart
        type="bar"
        height="350"
        :options="paretoOptions"
        :series="paretoSeries"
      />
    </div>

    <!-- Table list data -->
    <div class="card shadow-sm p-3">
      <h6 class="fw-bold mb-2">Detail Data</h6>
      <div class="table-responsive">
        <table class="table table-bordered table-sm text-center align-middle">
          <thead>
            <tr>
              <th>No</th>
              <th>Chemical</th>
              <th>Shift</th>
              <th>Tanggal</th>
              <th>Volume</th>
              <th>PIC</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody v-if="paginatedData.length > 0">
            <tr v-for="(item, index) in paginatedData" :key="item.reservasi_id">
              <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td>{{ item.oil_nm }}</td>
              <td>{{ item.shift }}</td>
              <td>{{ formatDate(item.created_dt) }}</td>
              <td>{{ item.vol }}</td>
              <td>{{ item.created_by ? item.created_by : item.updated_by }}</td>
              <td>{{ item.note_nm }}</td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="7" class="text-center">No data available</td>
            </tr>
          </tbody>
        </table>
        <div class="d-flex justify-content-between align-items-center mt-2">
          <!-- Tombol Prev / Next -->
          <div>
            <button
              class="btn btn-sm btn-primary me-2"
              :disabled="currentPage === 1"
              @click="currentPage--"
            >
              Prev
            </button>
            <button
              class="btn btn-sm btn-primary"
              :disabled="currentPage === totalPages"
              @click="currentPage++"
            >
              Next
            </button>
          </div>

          <!-- Info halaman + row per page -->
          <div class="d-flex align-items-center">
            <span>Page {{ currentPage }} of {{ totalPages }}</span>

            <!-- Dropdown row per page -->
            <select
              v-model.number="itemsPerPage"
              class="form-select form-select-sm w-auto ms-2"
            >
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="25">25</option>
              <option :value="50">50</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div
      v-if="toastMessage"
      class="toast align-items-center text-white bg-success show"
      style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 9999;
      "
      role="alert"
    >
      <div class="d-flex">
        <div class="toast-body">{{ toastMessage }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts'
import {
  ACTION_GET_MASTER_OIL,
  GET_MASTER_OIL,
} from '@/store/Chemical/MasterChemicals.module'
import {
  ACTION_GET_MASTER_NOTE,
  GET_MASTER_NOTE,
} from '@/store/Chemical/MasterNote.module'
import {
  ACTION_ADD_RESERVASI,
  ACTION_GET_RESERVASI,
  ACTION_UPDATE_NOTE_RESERVASI,
  GET_RESERVASI,
} from '@/store/Chemical/ReservasiChemical.module'
import { mapGetters } from 'vuex'

export default {
  name: 'ReservasiChemical',
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      notesUsed: 'line',
      currentPage: 1,
      itemsPerPage: 10,
      paretoSeries: [],
      paretoOptions: {},
      selectedMonth: new Date().toISOString().slice(0, 7),
      days: [],
      toastMessage: '',
      saveTimers: {}, // debounce per input
      chemicals: [], // dari BE
      selectedChemical: null,
      selectedPIC: null,
      noteForm: {
        chem: null, // chemical yang sedang dipilih
        date: '', // tanggal note
        shift: 'R', // shift default R
        selectedNote: null, // note yang dipilih user
      },
      selectedChemicalGraph: null,
    }
  },
  computed: {
    ...mapGetters([
      GET_MASTER_OIL,
      'getKaryawanList',
      GET_RESERVASI,
      GET_MASTER_NOTE,
    ]),

    filteredData() {
      const month = this.selectedMonth

      let data = (this[GET_RESERVASI] || []).filter(
        (r) => r.created_dt.slice(0, 7) === month,
      )

      if (this.selectedChemicalGraph) {
        data = data.filter(
          (r) => Number(r.oil_id) === Number(this.selectedChemicalGraph),
        )
      }

      return data
    },
    paginatedData() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      // slicing dari filteredData, bukan GET_RESERVASI
      return this.filteredData.slice(start, end)
    },
    totalPages() {
      return Math.ceil(this.filteredData.length / this.itemsPerPage)
    },
    filteredChemicals() {
      if (!this.selectedChemical) return this.chemicals
      return this.chemicals.filter((c) => c.oil_id === this.selectedChemical)
    },

    chemicalOptions() {
      return this[GET_MASTER_OIL] || []
    },
  },
  watch: {
    filteredData: {
      handler(newVal) {
        this.preparePareto()
      },
      immediate: true,
    },
    async selectedMonth(newVal, oldVal) {
      if (newVal !== oldVal) {
        await this.$store.dispatch(ACTION_GET_RESERVASI, this.selectedMonth)
        this.initChemicals()
        this.generateDays()
        this.populateVolFromBackend()
        this.preparePareto()
      }
    },
  },
  async mounted() {
    await this.$store.dispatch(ACTION_GET_MASTER_OIL)
    await this.$store.dispatch('fetchKaryawanList')
    await this.$store.dispatch(ACTION_GET_RESERVASI)
    await this.$store.dispatch(ACTION_GET_MASTER_NOTE, {
      notesuses: this.notesUsed,
    })
    this.initChemicals()
    this.generateDays()
    this.populateVolFromBackend()
    this.preparePareto()
  },
  methods: {
    preparePareto() {
      const data = this.filteredData
      if (!data.length) return

      // Aggregate total per chemical
      const totals = {}
      data.forEach((r) => {
        totals[r.oil_nm] = (totals[r.oil_nm] || 0) + Number(r.vol || 0)
      })

      // Sort descending
      const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1])

      const categories = sorted.map((s) => s[0])
      const values = sorted.map((s) => s[1])

      // Hitung cumulative %
      const totalSum = values.reduce((a, b) => a + b, 0)
      const cumulative = []
      let running = 0
      values.forEach((v) => {
        running += v
        cumulative.push((running / totalSum) * 100)
      })

      // Set series & options
      this.paretoSeries = [
        {
          name: 'Volume',
          type: 'bar',
          data: values,
        },
      ]
      //  {
      //           name: 'Cumulative %',
      //           type: 'line',
      //           data: cumulative,
      //         },

      this.paretoOptions = {
        chart: {
          height: 350,
          type: 'line',
          stacked: false,
        },
        stroke: {
          width: [0, 3],
          curve: 'straight', // biar garis cumulative lurus
        },
        title: {
          text: 'Pareto Chart Chemical',
          align: 'center',
        },
        xaxis: {
          categories,
          labels: {
            rotate: 0,
            formatter: function (val) {
              if (val.length > 10) return val.slice(0, 10) + '...'
              return val
            },
            style: { fontSize: '12px' },
          },
          axisBorder: {
            show: true,
            color: '#333', // warna garis sumbu
            height: 2, // tebal garis
          },
          axisTicks: {
            show: true,
            color: '#333',
            height: 6, // panjang tick marks
            thickness: 2, // tebal tick marks
          },
        },
        yaxis: [
          {
            axisBorder: {
              show: true,
              color: '#333', // warna garis sumbu
              height: 2, // tebal garis
            },
            axisTicks: {
              show: true,
              color: '#333',
              height: 6, // panjang tick marks
              thickness: 2, // tebal tick marks
            },
            title: { text: 'Volume' },
            labels: {
              formatter: (val) => {
                if (val == null || isNaN(val)) return val
                return val % 1 === 0 ? val : Number(val.toFixed(2))
              },
            },
          },
        ],
        // {
        //     opposite: true,
        //     max: 100,
        //     title: { text: 'Cumulative %' },
        //     labels: {
        //       formatter: (val) => (val?.toFixed(1) ?? '0.0') + '%',
        //     },
        //   },
        tooltip: {
          shared: true,
          intersect: false,
          x: {
            formatter: function (val, opts) {
              // ambil nama full dari categories asli
              return categories[opts.dataPointIndex] || val
            },
          },
          y: {
            formatter: (val, opts) => {
              if (opts.seriesIndex === 1) return val.toFixed(1) + '%'
              return val % 1 === 0 ? val : Number(val.toFixed(2))
            },
          },
        },
        dataLabels: {
          enabled: true,
          formatter: (val, opts) => {
            if (opts.seriesIndex === 1) return val.toFixed(1) + '%'
            return val % 1 === 0 ? val : Number(val.toFixed(2))
          },
        },
      }
    },

    formatDate(dt) {
      const d = new Date(dt)
      return d.toISOString().slice(0, 10)
    },
    async saveNote() {
      const { chem, date, shift, selectedNote } = this.noteForm

      // 1. Cek input tanggal
      if (!date) {
        this.showToast('Data tidak ada')
        return
      }

      // 2. Cari data reservasi sesuai tanggal + shift + chemical
      const backendData = this.GET_RESERVASI || []
      const record = backendData.find(
        (r) =>
          r.oil_id === chem.oil_id &&
          r.shift === shift &&
          this.getDisplayDate(r.created_dt) === date,
      )

      if (!record) {
        this.showToast('Data tidak ada')
        return
      }

      // 3. Siapkan payload untuk update note
      const payload = {
        reservasi_id: record.reservasi_id,
        note_id: selectedNote?.note_id || null,
        note_nm: selectedNote?.note_nm || null,
      }

      try {
        const response = await this.$store.dispatch(
          ACTION_UPDATE_NOTE_RESERVASI,
          payload,
        )
        if (response.status === 200) {
          await this.$store.dispatch(ACTION_GET_RESERVASI, this.selectedMonth)
          this.populateVolFromBackend()
          this.closeNoteModal()
          this.showToast('Note tersimpan')
        }
      } catch (error) {
        console.error('Error saving note:', error)
        this.showToast('Gagal menyimpan note')
      }
    },
    closeNoteModal() {
      this.noteForm.chem = null
      this.noteForm.date = ''
      this.noteForm.shift = 'R'
      this.noteForm.selectedNote = null
    },
    openNoteModal(chem) {
      // Simpan chemical yang sedang dipilih
      this.noteForm.chem = chem

      // Reset form default
      const today = new Date()
      this.noteForm.date = today.toISOString().slice(0, 10)
      this.noteForm.shift = 'R' // default R, user bisa ganti
      this.noteForm.selectedNote = null
    },
    getDayClass(day) {
      const dateStr = `${this.selectedMonth}-${String(day).padStart(2, '0')}`
      const date = new Date(dateStr)
      const dayOfWeek = date.getDay() // 0 = Minggu, 6 = Sabtu

      if (dayOfWeek === 6) return 'saturday'
      if (dayOfWeek === 0) return 'sunday'
      return ''
    },

    populateVolFromBackend() {
      const backendData = this.GET_RESERVASI || []
      this.chemicals.forEach((chem) => {
        this.days.forEach((day) => {
          const dayStr = this.selectedMonth + '-' + String(day).padStart(2, '0')
          const recordR = backendData.find(
            (r) =>
              r.oil_id === chem.oil_id &&
              r.shift === 'R' &&
              this.getDisplayDate(r.created_dt) === dayStr,
          )
          const recordW = backendData.find(
            (r) =>
              r.oil_id === chem.oil_id &&
              r.shift === 'W' &&
              this.getDisplayDate(r.created_dt) === dayStr,
          )
          chem.shift.R[day] = recordR ? Number(recordR.vol) : 0
          chem.shift.W[day] = recordW ? Number(recordW.vol) : 0
        })
        this.updateCumulative(chem)
      })
    },

    // --- helper untuk generate display_date sesuai logika BE (jam <7 masuk hari sebelumnya) ---
    getDisplayDate(recordDt) {
      const dt = new Date(recordDt)
      if (dt.getHours() < 7) {
        dt.setDate(dt.getDate() - 1) // shift sebelum jam 7 masuk hari sebelumnya
      }
      return dt.toISOString().slice(0, 10) // format "YYYY-MM-DD"
    },

    initChemicals() {
      const list = this[GET_MASTER_OIL] || []
      this.chemicals = list.map((c) => ({
        ...c, // biarin properti asli dari backend tetap utuh
        shift: c.shift || { R: {}, W: {} },
        cumulative: c.cumulative || {},
      }))
    },

    formatMonthName(ym) {
      if (!ym) return ''
      const [y, m] = ym.split('-')
      const monthNames = [
        'Januari',
        'Februari',
        'Maret',
        'April',
        'Mei',
        'Juni',
        'Juli',
        'Agustus',
        'September',
        'Oktober',
        'November',
        'Desember',
      ]
      return `${monthNames[parseInt(m) - 1]} ${y}`
    },

    generateDays() {
      const [year, month] = this.selectedMonth.split('-')
      const lastDay = new Date(year, month, 0).getDate()
      this.days = Array.from({ length: lastDay }, (_, i) => i + 1)
      this.chemicals.forEach((chem) => {
        this.days.forEach((d) => {
          if (chem.shift.R[d] === undefined) chem.shift.R[d] = 0
          if (chem.shift.W[d] === undefined) chem.shift.W[d] = 0
          if (chem.cumulative[d] === undefined) chem.cumulative[d] = 0
        })
        this.updateCumulative(chem)
      })
    },

    updateCumulative(chem) {
      let running = 0
      this.days.forEach((d) => {
        running +=
          (Number(chem.shift.R[d]) || 0) + (Number(chem.shift.W[d]) || 0)
        chem.cumulative[d] = running
      })
    },

    sumShift(shift) {
      return Object.values(shift).reduce((a, b) => a + Number(b || 0), 0)
    },

    totalCumulative(chem) {
      const lastDay = this.days[this.days.length - 1]
      return chem.cumulative[lastDay] || 0
    },

    handleInput(chem, day, shiftType) {
      this.updateCumulative(chem)

      const key = `${chem.id}-${day}-${shiftType}`
      clearTimeout(this.saveTimers[key])

      // auto-save delay 2 detik
      this.saveTimers[key] = setTimeout(() => {
        this.saveToBackend(chem, day, shiftType)
      }, 2000)
    },

    async saveToBackend(chem, day, shiftType) {
      try {
        if (!this.selectedPIC) {
          this.showToast('Pilih PIC terlebih dahulu')
          return
        }
        const volume = chem.shift[shiftType][day] || 0

        // Format tanggal lengkap dengan jam menit detik (timestamp)
        const now = new Date()
        const [year, month] = this.selectedMonth.split('-')
        const created_dt = `${year}-${month}-${String(day).padStart(
          2,
          '0',
        )} ${String(now.getHours()).padStart(2, '0')}:${String(
          now.getMinutes(),
        ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`

        const payload = {
          oil_id: chem.oil_id,
          oil_nm: chem.oil_nm,
          material_no: chem.material_no,
          created_dt, // timestamp siap untuk MySQL/Postgre
          shift: shiftType,
          vol: volume,
          created_by: this.selectedPIC.nama,
        }

        // console.log('Auto-save payload:', payload)
        let response = await this.$store.dispatch(ACTION_ADD_RESERVASI, payload)
        if (response.status === 201) {
          await this.$store.dispatch(ACTION_GET_RESERVASI, this.selectedMonth)
          this.populateVolFromBackend()
          this.preparePareto()
          this.showToast(
            `Data ${chem.oil_nm} (Shift ${shiftType} tgl ${day}) tersimpan`,
          )
        }
      } catch (error) {
        console.error('Error saving data:', error)
      }
    },

    showToast(msg) {
      this.toastMessage = msg
      setTimeout(() => (this.toastMessage = ''), 2000)
    },
  },
}
</script>

<style scoped>
.table-wrapper {
  overflow: auto;
  max-height: 400px;
  border: 1px solid #ccc;
}

/* Table */
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

/* Sticky Header */
.sticky-table thead th {
  position: sticky;
  top: 0;
  background-color: rgb(198, 240, 240);
  z-index: 200; /* header tanggal di bawah header kolom sticky */
}

/* Sticky Column */
.sticky-col {
  position: sticky;
  background-color: #fff;
  background-clip: padding-box;
  z-index: 150;
}

/* Sticky Column (di bagian thead) harus lebih tinggi z-index-nya */
.sticky-table thead .sticky-col {
  z-index: 300; /* di atas semua */
  background-color: rgb(198, 240, 240);
}

/* Offset kiri */
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
.sticky-col-4 {
  left: 320px;
  min-width: 60px;
  max-width: 60px;
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
.sticky-table th.sticky-col-2,
.sticky-table td.sticky-col-2 {
  white-space: normal !important; /* boleh membungkus teks */
  word-wrap: break-word;
  text-align: center; /* biar rapi, opsional */
  line-height: 1.2; /* biar baris teks gak terlalu renggang */
}
/* Cumulative Row */
.table-secondary td {
  background-color: #f3f3f3 !important;
  font-weight: 600;
}
.saturday {
  background-color: #ffeaea !important; /* light red */
}
.sunday {
  background-color: #ffdcdc !important; /* slightly stronger light red */
}
.table-bordered th {
  background-color: rgb(198, 240, 240);
}
.table-bordered {
  border: 1px solid black;
}
</style>
