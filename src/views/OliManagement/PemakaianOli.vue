<template>
  <div class="modal" tabindex="-1" id="modalPemakaianOli">
    <!-- Modal content -->
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <!-- {{ isEditMode ? 'Edit Pemakaian Oli' : 'Add Pemakaian Oli' }} -->
            Add Pemakaian Oli
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
            <h5>PIC</h5>
          </div>
          <div>
            <v-select
              v-model="pic"
              :options="getKaryawanList"
              label="nama"
            ></v-select>
          </div>
          <!-- <div>
            <h5>Line</h5>
          </div>
          <div>
            <v-select
              v-model="selectedLine"
              :options="GET_LINES"
              label="line_nm"
              @update:modelValue="onLineChange"
            ></v-select>
          </div> -->
          <div class="mt-2">
            <h5>Mesin</h5>
          </div>
          <div>
            <v-select
              v-model="selectedMachine"
              :options="GET_MASTER_MACHINES"
              label="machine_nm"
            ></v-select>
          </div>
          <div>
            <h5>Nama Oli</h5>
          </div>
          <v-select
            v-model="oil_nm"
            :options="GET_MASTER_OIL"
            label="oil_nm"
            @update:modelValue="onOilChange"
          ></v-select>
          <div class="input-group mt-2">
            <h5>Type Oli</h5>
          </div>
          <input v-model="type_nm" type="text" class="form-control" />

          <div class="input-group mt-2">
            <h5>Jumlah</h5>
          </div>
          <div>
            <div class="input-group">
              <input
                v-model="oil_volume"
                type="number"
                class="form-control"
                step="any"
                @input="validateInput"
              />
              <span class="input-group-text">Liter</span>
            </div>
            <p v-if="warning" class="text-danger">{{ warning }}</p>
          </div>
          <div class="input-group mt-2">
            <h5>Tanggal</h5>
          </div>
          <input v-model="date" type="date" class="form-control" />
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
            @click="addPemakaianOli"
            type="button"
            class="btn btn-primary"
            data-bs-dismiss="modal"
            :disabled="!isFilled"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="container-fluid">
    <div class="card p-2 mb-2">
      <div class="d-flex justify-content-between align-items-center">
        <h4 class="text-center m-0">Pemakaian Oli</h4>
        <!-- <div>
          <button
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#modalPemakaianOli"
            @click="openAddModal"
          >
            <i class="fas fa-plus"></i>
          </button>
        </div> -->
      </div>
    </div>
  </div>
  <marquee behavior="" direction="" style="font-size: x-large; color: red"
    >Still Development</marquee
  >
  <div class="container-fluid dashboard">
    <!-- Crank Shaft -->

    <div
      class="card p-2"
      v-if="groupedMachines.normal && groupedMachines.normal['Crank Shaft']"
    >
      <div class="row p-3">
        <div class="line-title text-center" style="border: 1px solid black">
          Crank Shaft
        </div>
        <div class="col" style="border: 1px solid black">
          <div
            class="card p-2 mb-2 mt-2 cell-section"
            style="border: 1px solid black !important"
            v-for="(machines, cellName) in sortedMachines.normal['Crank Shaft']"
            :key="cellName"
          >
            <h4 class="cell-title">{{ cellName }}</h4>
            <div class="machine-container">
              <div
                v-for="machine in machines"
                :key="machine.machine_id"
                class="machine-box-wrapper"
              >
                <button
                  @mouseover="showPopover($event, machine)"
                  @mouseleave="hidePopover"
                  data-bs-toggle="modal"
                  data-bs-target="#modalPemakaianOli"
                  @click="openAddModal(machine)"
                  class="machine-box"
                >
                  <div class="machine-icon-wrapper">
                    <img
                      src="../../assets/images/MC. NC.png"
                      alt="Machine Icon"
                      class="machine-img"
                    />
                    <i
                      v-if="hasOilData(machine)"
                      class="fas fa-fill-drip badge-icon"
                    ></i>
                  </div>
                </button>
                <p class="machine-label">{{ machine.machine_nm }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Cylinder Block -->
    <div
      class="card mt-2 p-2"
      v-if="
        groupedMachines.special && groupedMachines.special['Cylinder Block']
      "
    >
      <div class="row p-3">
        <div class="line-title text-center" style="border: 1px solid black">
          Cylinder Block
        </div>
        <div class="col-md-6">
          <h4 class="category-title text-center">Rough Area</h4>
          <div
            v-for="(machines, cellName) in sortedMachines.special[
              'Cylinder Block'
            ].Rough"
            :key="cellName"
            class="cell-section card p-2 mb-2"
            style="border: 1px solid black !important"
          >
            <h5 class="cell-title">{{ cellName }}</h5>
            <div class="machine-container">
              <div
                v-for="machine in machines"
                :key="machine.machine_id"
                class="machine-box-wrapper"
              >
                <button
                  @mouseover="showPopover($event, machine)"
                  @mouseleave="hidePopover"
                  class="machine-box"
                  data-bs-toggle="modal"
                  data-bs-target="#modalPemakaianOli"
                  @click="openAddModal(machine)"
                >
                  <img
                    src="../../assets/images/MC. NC.png"
                    alt="Machine Icon"
                    class="machine-img"
                  />
                  <i
                    v-if="hasOilData(machine)"
                    class="fas fa-fill-drip badge-icon"
                  ></i>
                </button>
                <p class="machine-label">{{ machine.machine_nm }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <h4 class="category-title text-center">Finish Area</h4>
          <div
            v-for="(machines, cellName) in sortedMachines.special[
              'Cylinder Block'
            ].Finish"
            :key="cellName"
            class="cell-section card p-2 mb-2"
            style="border: 1px solid black !important"
          >
            <h5 class="cell-title">{{ cellName }}</h5>
            <div class="machine-container">
              <div
                v-for="machine in machines"
                :key="machine.machine_id"
                class="machine-box-wrapper"
              >
                <button
                  @mouseover="showPopover($event, machine)"
                  @mouseleave="hidePopover"
                  class="machine-box"
                  data-bs-toggle="modal"
                  data-bs-target="#modalPemakaianOli"
                  @click="openAddModal(machine)"
                >
                  <img
                    src="../../assets/images/MC. NC.png"
                    alt="Machine Icon"
                    class="machine-img"
                  />
                  <i
                    v-if="hasOilData(machine)"
                    class="fas fa-fill-drip badge-icon"
                  ></i>
                </button>
                <p class="machine-label">{{ machine.machine_nm }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Cylinder Head -->
    <div
      class="card mt-2 p-2"
      v-if="groupedMachines.special && groupedMachines.special['Cylinder Head']"
    >
      <div class="row p-3">
        <div class="line-title text-center" style="border: 1px solid black">
          Cylinder Head
        </div>
        <div class="col-md-6">
          <h4 class="category-title">Rough Area</h4>
          <div
            v-for="(machines, cellName) in sortedMachines.special[
              'Cylinder Head'
            ].Rough"
            :key="cellName"
            class="cell-section card p-2 mb-2"
            style="border: 1px solid black !important"
          >
            <h5 class="cell-title">{{ cellName }}</h5>
            <div class="machine-container">
              <div
                v-for="machine in machines"
                :key="machine.machine_id"
                class="machine-box-wrapper"
              >
                <button
                  @mouseover="showPopover($event, machine)"
                  @mouseleave="hidePopover"
                  class="machine-box"
                  data-bs-toggle="modal"
                  data-bs-target="#modalPemakaianOli"
                  @click="openAddModal(machine)"
                >
                  <img
                    src="../../assets/images/MC. NC.png"
                    alt="Machine Icon"
                    class="machine-img"
                  />
                  <i
                    v-if="hasOilData(machine)"
                    class="fas fa-fill-drip badge-icon"
                  ></i>
                </button>
                <p class="machine-label">{{ machine.machine_nm }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <h4 class="category-title">Finish Area</h4>
          <div
            v-for="(machines, cellName) in sortedMachines.special[
              'Cylinder Head'
            ].Finish"
            :key="cellName"
            class="cell-section card p-2 mb-2"
            style="border: 1px solid black !important"
          >
            <h5 class="cell-title">{{ cellName }}</h5>
            <div class="machine-container">
              <div
                v-for="machine in machines"
                :key="machine.machine_id"
                class="machine-box-wrapper"
              >
                <button
                  @mouseover="showPopover($event, machine)"
                  @mouseleave="hidePopover"
                  class="machine-box"
                  data-bs-toggle="modal"
                  data-bs-target="#modalPemakaianOli"
                  @click="openAddModal(machine)"
                >
                  <img
                    src="../../assets/images/MC. NC.png"
                    alt="Machine Icon"
                    class="machine-img"
                  />
                  <i
                    v-if="hasOilData(machine)"
                    class="fas fa-fill-drip badge-icon"
                  ></i>
                </button>
                <p class="machine-label">{{ machine.machine_nm }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Cam Shaft -->
    <div
      class="card mt-2 p-2"
      v-if="groupedMachines.normal && groupedMachines.normal['Cam Shaft']"
    >
      <div class="row p-3">
        <div class="line-title text-center" style="border: 1px solid black">
          Cam Shaft
        </div>

        <div class="col" style="border: 1px solid black">
          <div
            class="card p-2 mb-2 mt-2 cell-section"
            style="border: 1px solid black !important"
            v-for="(machines, cellName) in sortedMachines.normal['Cam Shaft']"
            :key="cellName"
          >
            <h4 class="cell-title">{{ cellName }}</h4>
            <div class="machine-container">
              <div
                v-for="machine in machines"
                :key="machine.machine_id"
                class="machine-box-wrapper"
              >
                <button
                  @mouseover="showPopover($event, machine)"
                  @mouseleave="hidePopover"
                  class="machine-box"
                  data-bs-toggle="modal"
                  data-bs-target="#modalPemakaianOli"
                  @click="openAddModal(machine)"
                >
                  <img
                    src="../../assets/images/MC. NC.png"
                    alt="Machine Icon"
                    class="machine-img"
                  />
                  <i
                    v-if="hasOilData(machine)"
                    class="fas fa-fill-drip badge-icon"
                  ></i>
                </button>
                <p class="machine-label">{{ machine.machine_nm }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- POPUP TOOLTIP -->
    <div
      v-if="popoverVisible"
      class="popover"
      :style="{ top: popoverY + 'px', left: popoverX + 'px' }"
      ref="popover"
    >
      <table class="style-table table-responsive">
        <thead>
          <!-- Baris pertama: Nama Mesin -->
          <tr>
            <th colspan="3">Nama Mesin: {{ popoverContent.machine_nm }}</th>
          </tr>

          <!-- Header untuk daftar oli -->
          <tr>
            <th>Chemical</th>
            <th>Type</th>
            <th>Jumlah (Liter)</th>
          </tr>
        </thead>

        <tbody class="body-table">
          <!-- List oli yang dipakai di mesin -->
          <tr v-for="(oil, index) in popoverContent.oil_usage" :key="index">
            <td>{{ oil.oil_nm }}</td>
            <td>{{ oil.type_nm }}</td>
            <td>{{ oil.oil_volume }}</td>
          </tr>
        </tbody>
        <tfoot
          v-if="
            popoverContent.oil_usage.some(
              (oil) => oil.oil_nm === 'Tidak ada data',
            )
          "
        >
          <tr>
            <td colspan="3" class="text-center text-info">
              Klik untuk tambah pemakaian chemical
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>
<script>
import {
  ACTION_GET_MASTER_OIL,
  GET_MASTER_OIL,
} from '@/store/Oli/MasterOli.module'
import {
  ACTION_ADD_PEMAKAIAN_OLI,
  ACTION_GET_MACHINES,
  ACTION_GET_OILS_USAGE,
  GET_DATA_MACHINES_ALL,
  GET_OILS_USAGE,
} from '@/store/Oli/pemakaianOli.module'
import { ACTION_GET_LINES, GET_LINES } from '@/store/Tool/MasterLines.module'
import {
  ACTION_GET_MASTER_MACHINES,
  GET_MASTER_MACHINES,
} from '@/store/Tool/MasterMachines.module'
import { mapGetters } from 'vuex'
import moment from 'moment-timezone'
import draggable from 'vuedraggable'

export default {
  name: 'PemakaianOli',
  components: {
    draggable,
  },
  data() {
    return {
      selectedLine: '',
      oil_nm: '',
      type_nm: '',
      selectedMachine: '',
      oil_volume: '',
      date: moment().tz('Asia/Jakarta').format('YYYY-MM-DD'),
      warning: '',
      pic: '',
      popoverVisible: false,
      popoverContent: {},
      popoverX: 0,
      popoverY: 0,
    }
  },

  computed: {
    ...mapGetters([
      GET_LINES,
      GET_MASTER_MACHINES,
      GET_DATA_MACHINES_ALL,
      GET_MASTER_OIL,
      'getKaryawanList',
      GET_OILS_USAGE,
    ]),
    sortedMachines() {
      const orderCrank = ['Line B', 'Line A']
      const orderBlockHead = ['Rough D', 'Rough C', 'Rough B', 'Rough A']
      const orderCam = ['Line EX', 'Line IN']

      const sortCells = (machines, order) => {
        return Object.keys(machines)
          .sort((a, b) => order.indexOf(a) - order.indexOf(b))
          .reduce((obj, key) => {
            obj[key] = machines[key]
            return obj
          }, {})
      }

      return {
        normal: {
          'Crank Shaft': sortCells(
            this.groupedMachines.normal['Crank Shaft'] || {},
            orderCrank,
          ),
          'Cam Shaft': sortCells(
            this.groupedMachines.normal['Cam Shaft'] || {},
            orderCam,
          ),
        },
        special: {
          'Cylinder Block': {
            Rough: sortCells(
              this.groupedMachines.special['Cylinder Block']?.Rough || {},
              orderBlockHead,
            ),
            Finish:
              this.groupedMachines.special['Cylinder Block']?.Finish || {},
          },
          'Cylinder Head': {
            Rough: sortCells(
              this.groupedMachines.special['Cylinder Head']?.Rough || {},
              orderBlockHead,
            ),
            Finish: this.groupedMachines.special['Cylinder Head']?.Finish || {},
          },
        },
      }
    },
    formattedOilVolume() {
      if (!this.oil_volume) return ''
      return parseFloat(this.oil_volume).toFixed(2) // Maksimal 2 angka di belakang koma
    },
    GET_LINES() {
      return this.$store.getters.GET_LINES
    },

    groupedMachines() {
      // console.log('DATA MESIN:', this.GET_DATA_MACHINES_ALL)
      // console.log('LINES:', this.GET_LINES)

      let grouped = { special: {}, normal: {} }

      // Buat mapping root_line_id ke line_nm dari GET_LINES
      let lineMap = this.GET_LINES.reduce((map, line) => {
        map[line.line_id] = line.line_nm
        return map
      }, {})

      // Urutan prioritas khusus
      const lineOrder = [
        'Crank Shaft',
        'Cylinder Block',
        'Cylinder Head',
        'Cam Shaft',
      ]

      // Looping root_line_id di GET_DATA_MACHINES_ALL
      Object.entries(this.GET_DATA_MACHINES_ALL).forEach(
        ([root_line_id, cells]) => {
          let line_nm = lineMap[root_line_id] || `Unknown (${root_line_id})`

          // Pastikan `line_nm` cocok dengan `lineOrder`
          let orderedLineNm =
            lineOrder.find((name) => line_nm.includes(name)) || line_nm

          if (
            orderedLineNm === 'Cylinder Head' ||
            orderedLineNm === 'Cylinder Block'
          ) {
            // Kategorikan Cylinder Head & Block ke dalam Rough & Finish
            if (!grouped.special[orderedLineNm]) {
              grouped.special[orderedLineNm] = { Rough: {}, Finish: {} }
            }

            Object.entries(cells).forEach(([cell_nm, machines]) => {
              let category = cell_nm.includes('Finish') ? 'Finish' : 'Rough'

              if (!grouped.special[orderedLineNm][category][cell_nm]) {
                grouped.special[orderedLineNm][category][cell_nm] = []
              }

              grouped.special[orderedLineNm][category][cell_nm] = machines.sort(
                (a, b) => a.idx_pos - b.idx_pos,
              )
            })
          } else if (
            orderedLineNm === 'Crank Shaft' ||
            orderedLineNm === 'Cam Shaft'
          ) {
            // Masukkan Crank Shaft & Cam Shaft ke grouped.normal
            if (!grouped.normal[orderedLineNm]) {
              grouped.normal[orderedLineNm] = {}
            }

            Object.entries(cells).forEach(([cell_nm, machines]) => {
              if (!grouped.normal[orderedLineNm][cell_nm]) {
                grouped.normal[orderedLineNm][cell_nm] = []
              }

              grouped.normal[orderedLineNm][cell_nm] = machines.sort(
                (a, b) => a.idx_pos - b.idx_pos,
              )
            })
          }
        },
      )

      // Urutkan hasilnya berdasarkan lineOrder
      grouped.special = Object.fromEntries(
        Object.entries(grouped.special).sort((a, b) => {
          return lineOrder.indexOf(a[0]) - lineOrder.indexOf(b[0])
        }),
      )

      grouped.normal = Object.fromEntries(
        Object.entries(grouped.normal).sort((a, b) => {
          let indexA = lineOrder.indexOf(a[0])
          let indexB = lineOrder.indexOf(b[0])

          if (indexA === -1) indexA = 999
          if (indexB === -1) indexB = 999

          return indexA - indexB
        }),
      )

      // console.log('GROUPED MACHINES (Sorted):', grouped)
      return grouped
    },
    isFilled() {
      return (
        this.oil_volume !== '' &&
        this.oil_id !== '' &&
        this.machine_id !== '' &&
        this.oil_nm !== '' &&
        this.pic !== ''
      )
    },
  },
  async mounted() {
    await this.$store.dispatch(ACTION_GET_LINES)
    await this.$store.dispatch(ACTION_GET_MACHINES)
    await this.fetchDataOli()
    await this.$store.dispatch('fetchKaryawanList')
    await this.$store.dispatch(ACTION_GET_OILS_USAGE)
  },
  methods: {
    openAddModal(machine) {
      this.selectedMachine = machine
    },
    hasOilData(machine) {
      return this.GET_OILS_USAGE.some(
        (oil) => oil.machine_id === machine.machine_id,
      )
    },
    showPopover(event, machine) {
      const buttonRect = event.target.getBoundingClientRect()
      const oilsData = this.GET_OILS_USAGE.filter(
        (oil) => oil.machine_id === machine.machine_id,
      )

      this.popoverContent = {
        ...machine,
        oil_usage: oilsData.length
          ? oilsData
          : [{ oil_nm: 'Tidak ada data', type_nm: '-', oil_volume: '0' }],
      }
      this.popoverVisible = true

      this.$nextTick(() => {
        setTimeout(() => {
          const popover = this.$refs.popover
          if (popover) {
            const popoverWidth = popover.offsetWidth
            const popoverHeight = popover.offsetHeight // Ambil tinggi popover

            this.popoverX =
              buttonRect.left +
              window.scrollX +
              buttonRect.width / 2 -
              popoverWidth / 2

            // **Jika popover lebih tinggi, geser lebih jauh ke atas**
            this.popoverY = buttonRect.top + window.scrollY - popoverHeight - 30
          }
        }, 0)
      })
    },

    hidePopover() {
      this.popoverVisible = false
    },

    sortedMachines(machines) {
      return [...machines].sort((a, b) => a.idx_pos - b.idx_pos)
    },
    validateInput() {
      const volumeStr = String(this.oil_volume) // Konversi ke string
      if (this.oil_volume < 0) {
        this.warning = 'Volume tidak boleh negatif!'
      } else if (
        volumeStr.includes('.') &&
        volumeStr.split('.')[1]?.length > 2
      ) {
        this.warning = 'Maksimal 2 angka di belakang koma!'
      } else {
        this.warning = ''
      }
    },

    async fetchDataOli() {
      await this.$store.dispatch(ACTION_GET_MASTER_OIL)
    },
    onOilChange() {
      this.type_nm = this.oil_nm?.type_nm ? this.oil_nm.type_nm : ''
    },
    async addPemakaianOli() {
      try {
        if (!this.oil_nm.oil_id) {
          this.$swal({
            icon: 'error',
            title: 'Error',
            text: 'Silahkan pilih oli terlebih dahulu!',
          })
          return
        }
        const currentTime = moment().tz('Asia/Jakarta').format('HH:mm:ss')
        // Gabungkan tanggal dari input dengan jam sekarang
        const formattedDate = moment(
          `${this.date} ${currentTime}`,
          'YYYY-MM-DD HH:mm:ss',
        )
          .tz('Asia/Jakarta')
          .format('YYYY-MM-DD HH:mm:ss')
        const payload = {
          oil_id: this.oil_nm.oil_id,
          oil_nm: this.oil_nm.oil_nm,
          type_nm: this.type_nm,
          machine_id: this.selectedMachine.machine_id,
          machine_nm: this.selectedMachine.machine_nm,
          oil_volume: this.oil_volume,
          pic: this.pic.nama,
          created_dt: formattedDate,
        }
        // console.log('payload', payload)

        let response = await this.$store.dispatch(
          ACTION_ADD_PEMAKAIAN_OLI,
          payload,
        )
        if (response.status === 201) {
          this.$swal({
            icon: 'success',
            title: 'Success',
            text: 'Data saved successfully!',
          })
          this.$store.dispatch(ACTION_GET_OILS_USAGE)
        }
        this.resetModal()
      } catch (error) {
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: error,
        })
      }
    },
    resetModal() {
      this.selectedLine = null
      this.selectedMachine = null
      this.oil_nm = null
      this.selectedMachine = null
      this.oil_volume = null
      this.pic = null
      this.type_nm = null
    },
  },
}
</script>

<style>
.body-table td {
  border: 1px solid white;
  text-align: center !important;
}

.style-table th {
  border: 1px solid white;
  text-align: center !important;
}

/* Styling Popover */
.popover {
  position: absolute;
  background: white;
  padding: 8px;
  border-radius: 5px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 9999;
  font-size: 14px;
  min-width: 220px;
  border: 1px solid #aaa;
}

/* Table style */
.popover table {
  width: 100%;
  border-collapse: collapse;
}

.popover th {
  background: #666;
  color: white;
  padding: 5px;
  text-align: left;
}

.popover td {
  padding: 5px;
  background: #f0f0f0;
}

/* Bikin panah ke bawah */
.popover::after {
  content: '';
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  border-width: 10px;
  border-style: solid;
  border-color: white transparent transparent transparent;
}

.text-danger {
  color: red;
  font-size: 14px;
  margin-top: 5px;
}

dashboard {
  padding: 20px;
}

/* Global Styling */
.line-title {
  font-size: 1.5rem;
  font-weight: bold;
  background-color: #222; /* Hitam pekat */
  color: white;
  text-align: center;
  padding: 10px;
  border: 1px solid black;
}

.col,
.col-md-6 {
  background-color: #f5f5f5; /* Abu muda */
  border: 1px solid black;
}

/* Kartu */
.card {
  background-color: #f5f7fa; /* Background lebih nyaman */
  border: 1px solid #b0bec5; /* Border lebih soft */
  padding: 10px;
  margin: 10px 0;
}

/* Judul */
.category-title,
.cell-title {
  font-size: 1.3rem;
  font-weight: bold;
  color: #2c3e50; /* Warna teks lebih enak dibaca */
}

.cell-title {
  font-size: 1.1rem;
  margin-top: 10px;
}

/* Section untuk mesin */
.cell-section {
  background-color: #9c9a9a !important;
}

/* Container untuk mesin */
.machine-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center; /* Pusatkan secara horizontal */
  align-items: center; /* Pusatkan secara vertikal */
}

.machine-box-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.3s ease;
}

.machine-box-wrapper:hover {
  transform: scale(1.2);
}

.machine-label {
  margin-top: 5px;
  font-size: 0.5rem; /* Ukuran lebih kecil */
  font-weight: bold;
  text-align: center;
  color: #333;
  transition: transform 0.3s ease; /* Agar ikut animasi */
}

/* Gambar mesin */
.machine-icon-wrapper {
  position: relative;
  display: inline-block;
}

.machine-img {
  width: 40px;
  height: 50px;
}

.machine-box {
  width: 50px;
  height: 50px;
  border: none;
  border-radius: 8px;
  position: relative;
  cursor: pointer;
  display: flex;
  flex-direction: column; /* Susun ke bawah */
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.machine-box::after {
  content: '';
  position: absolute;
  width: 80px; /* Lebih besar untuk mencakup label */
  height: 80px;
  background-color: white;
  border-radius: 10px;
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s ease;
}

/* Efek Hover */
.machine-box:hover::after {
  opacity: 1;
}

/* Badge icon untuk indikator */
.badge-icon {
  position: absolute;
  top: -5px;
  left: 1px;
  color: rgb(247, 103, 46); /* Warna indikator */
  font-size: 14px;
}
</style>
