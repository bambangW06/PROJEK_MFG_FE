<template>
  <div class="modal" tabindex="-1" id="modalPemakaianOli">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{
              isCheckParameter
                ? 'Cek Parameter Coolant'
                : 'Add Pemakaian Chemical'
            }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            @click="resetModal"
          ></button>
        </div>

        <div class="modal-body">
          <!-- Toggle mode -->
          <div class="mb-3">
            <h5 class="form-label">Mode</h5>
            <v-select
              v-model="mode"
              :options="['Pemakaian Chemical', 'Cek Parameter']"
              @update:modelValue="onModeChange"
              style="font-size: larger; font-weight: bold"
            ></v-select>
          </div>

          <!-- Jika mode Add Pemakaian -->
          <template v-if="mode === 'Pemakaian Chemical'">
            <div>
              <h5>PIC</h5>
            </div>
            <v-select
              v-model="pic"
              :options="getKaryawanList"
              label="nama"
            ></v-select>

            <div class="mt-2">
              <h5>Mesin</h5>
            </div>
            <v-select
              v-model="selectedMachine"
              :options="GET_MASTER_MACHINES"
              label="machine_nm"
            ></v-select>

            <div>
              <h5>Nama Chemical</h5>
            </div>
            <v-select
              v-model="oil_nm"
              :options="GET_MASTER_OIL"
              label="oil_nm"
              @update:modelValue="onOilChange"
            ></v-select>

            <div class="input-group mt-2">
              <h5>Type Chemical</h5>
            </div>
            <input v-model="type_nm" type="text" class="form-control" />

            <div class="input-group mt-2">
              <h5>Jumlah</h5>
            </div>
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

            <div class="input-group mt-2">
              <h5>Note</h5>
            </div>
            <v-select
              :options="GET_MASTER_NOTE"
              label="note_nm"
              v-model="note_nm"
            >
            </v-select>

            <div class="input-group mt-2">
              <h5>Tanggal</h5>
            </div>
            <input v-model="date" type="date" class="form-control" />
          </template>

          <!-- Jika mode Cek Parameter -->
          <template v-else>
            <div>
              <h5>PIC</h5>
            </div>
            <v-select
              v-model="pic"
              :options="getKaryawanList"
              label="nama"
            ></v-select>

            <div class="mt-2">
              <h5>Mesin</h5>
            </div>
            <v-select
              v-model="selectedMachine"
              :options="GET_MASTER_MACHINES"
              label="machine_nm"
            ></v-select>

            <div class="mt-2">
              <h5>Visual</h5>
              <div style="display: flex; align-items: center; gap: 12px">
                <div
                  :style="
                    selectedVisual && selectedVisual.ilustration
                      ? 'flex: 1 1 auto; max-width: calc(100% - 120px);'
                      : 'width: 100%'
                  "
                >
                  <v-select
                    v-model="selectedVisual"
                    :options="visualOptions"
                    label="opt_nm"
                  />
                </div>

                <div
                  v-if="selectedVisual && selectedVisual.ilustration"
                  style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                  "
                >
                  <small><strong>Ilustrasi:</strong></small>
                  <img
                    :src="selectedVisual.ilustration"
                    :alt="selectedVisual.opt_nm"
                    style="max-width: 100px; height: auto; border-radius: 4px"
                  />
                </div>
              </div>
            </div>

            <div class="mt-2">
              <h5>Aroma</h5>
              <v-select
                v-model="selectedAroma"
                :options="aromaOptions"
                label="opt_nm"
              >
              </v-select>
            </div>

            <div class="mt-2">
              <h5>Sludge</h5>
              <div style="display: flex; align-items: center; gap: 12px">
                <div
                  :style="
                    selectedSludge && selectedSludge.ilustration
                      ? 'flex: 1 1 auto; max-width: calc(100% - 120px);'
                      : 'width: 100%'
                  "
                >
                  <v-select
                    v-model="selectedSludge"
                    :options="sludgeOptions"
                    label="opt_nm"
                  />
                </div>

                <div
                  v-if="selectedSludge && selectedSludge.ilustration"
                  style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                  "
                >
                  <small><strong>Ilustrasi:</strong></small>
                  <img
                    :src="selectedSludge.ilustration"
                    :alt="selectedSludge.opt_nm"
                    style="max-width: 100px; height: auto; border-radius: 4px"
                  />
                </div>
              </div>
            </div>

            <div class="mt-2">
              <h5>Konsentrasi</h5>
              <v-select
                v-model="concentration"
                :options="cons_range_values"
                label="opt_nm"
                class="tight-select"
              />
              <small class="standard-text">
                Standar: {{ cons_options[0].min_value }} -
                {{ cons_options[0].max_value }} %
              </small>
            </div>

            <div class="mt-2">
              <h5>pH</h5>
              <v-select v-model="ph" :options="ph_range_values" label="opt_nm">
              </v-select>
              <small class="standard-text">
                Standar: {{ ph_options[0].min_value }} -
                {{ ph_options[0].max_value }} %
              </small>
            </div>

            <div class="input-group mt-2">
              <h5>Tanggal</h5>
            </div>
            <input v-model="date" type="date" class="form-control" />
          </template>
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
            class="btn btn-primary"
            data-bs-dismiss="modal"
            :disabled="!isFilled"
            @click="
              mode === 'Pemakaian Chemical'
                ? addPemakaianOli()
                : saveCekParameter()
            "
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
        <h4 class="text-center m-0">Pemakaian Chemical</h4>
      </div>
    </div>
  </div>

  <div class="container-fluid">
    <!-- Crank Shaft -->
    <div
      class="card p-2"
      v-if="groupedMachines.normal && groupedMachines.normal['Crank Shaft']"
    >
      <div class="card p-2">
        <div class="card card-title text-center">Crank Shaft</div>
        <div
          class="card mb-2 mt-2 cell-section"
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
                <div
                  :class="getJudgeClass(machine)"
                  class="machine-icon-wrapper"
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
                  <i
                    v-if="!isCheckScheduled(machine)"
                    class="fas fa-calendar-check schedule-icon"
                    title="Sudah di cek"
                  ></i>
                </div>
              </button>
              <p class="machine-label">{{ machine.machine_nm }}</p>
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
        <div class="card card-title text-center">Cylinder Block</div>
        <div class="col-md-6 card">
          <h4 class="category-title text-center">Rough Area</h4>
          <div
            v-for="(machines, cellName) in sortedMachines.special[
              'Cylinder Block'
            ].Rough"
            :key="cellName"
            class="cell-section card mb-2"
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
                  data-bs-toggle="modal"
                  data-bs-target="#modalPemakaianOli"
                  @click="openAddModal(machine)"
                  class="machine-box"
                >
                  <div
                    :class="getJudgeClass(machine)"
                    class="machine-icon-wrapper"
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
                    <i
                      v-if="!isCheckScheduled(machine)"
                      class="fas fa-calendar-check schedule-icon"
                      title="Sudah di cek"
                    ></i>
                  </div>
                </button>
                <p class="machine-label">{{ machine.machine_nm }}</p>
              </div>
            </div>
          </div>
        </div>
        <div
          class="col-md-6 card d-flex justify-content-center align-items-center"
        >
          <h4 class="category-title text-center">Finish Area</h4>
          <div
            v-for="(machines, cellName) in sortedMachines.special[
              'Cylinder Block'
            ].Finish"
            :key="cellName"
            class="cell-section card mb-2"
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
                  data-bs-toggle="modal"
                  data-bs-target="#modalPemakaianOli"
                  @click="openAddModal(machine)"
                  class="machine-box"
                >
                  <div
                    :class="getJudgeClass(machine)"
                    class="machine-icon-wrapper"
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
                    <i
                      v-if="!isCheckScheduled(machine)"
                      class="fas fa-calendar-check schedule-icon"
                      title="Sudah di cek"
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

    <!-- Cylinder Head -->
    <div
      class="card mt-2 p-2"
      v-if="groupedMachines.special && groupedMachines.special['Cylinder Head']"
    >
      <div class="row p-3">
        <div class="card card-title text-center">Cylinder Head</div>
        <div class="col-md-6 card">
          <h4 class="category-title text-center">Rough Area</h4>
          <div
            v-for="(machines, cellName) in sortedMachines.special[
              'Cylinder Head'
            ].Rough"
            :key="cellName"
            class="cell-section card mb-2"
            style="border: 1px solid black !important"
          >
            <h5 class="cell-title">{{ cellName }}</h5>
            <div class="machine-container-khusus">
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
                  <div
                    :class="getJudgeClass(machine)"
                    class="machine-icon-wrapper"
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
                    <i
                      v-if="!isCheckScheduled(machine)"
                      class="fas fa-calendar-check schedule-icon"
                      title="Sudah di cek"
                    ></i>
                  </div>
                </button>
                <p class="machine-label">{{ machine.machine_nm }}</p>
              </div>
            </div>
          </div>
        </div>
        <div
          class="col-md-6 card d-flex justify-content-center align-items-center"
        >
          <h4 class="category-title text-center">Finish Area</h4>
          <div
            v-for="(machines, cellName) in sortedMachines.special[
              'Cylinder Head'
            ].Finish"
            :key="cellName"
            class="cell-section card mb-2"
            style="border: 1px solid black !important"
          >
            <h5 class="cell-title">{{ cellName }}</h5>
            <div class="machine-container-khusus">
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
                  <div
                    :class="getJudgeClass(machine)"
                    class="machine-icon-wrapper"
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
                    <i
                      v-if="!isCheckScheduled(machine)"
                      class="fas fa-calendar-check schedule-icon"
                      title="Sudah di cek"
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

    <!-- Cam Shaft -->
    <div
      class="card p-2"
      v-if="groupedMachines.normal && groupedMachines.normal['Cam Shaft']"
    >
      <div class="card p-2">
        <div class="card card-title text-center">Cam Shaft</div>

        <div
          class="card mb-2 mt-2 cell-section"
          style="border: 1px solid black !important"
          v-for="(machines, cellName) in sortedMachines.normal['Cam Shaft']"
          :key="cellName"
        >
          <h4 class="cell-title">{{ cellName }}</h4>
          <div class="machine-container-khusus">
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
                <div
                  :class="getJudgeClass(machine)"
                  class="machine-icon-wrapper"
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
                  <i
                    v-if="!isCheckScheduled(machine)"
                    class="fas fa-calendar-check schedule-icon"
                    title="Sudah di cek"
                  ></i>
                </div>
              </button>
              <p class="machine-label">{{ machine.machine_nm }}</p>
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
      <!-- TABEL 1 -->
      <div class="table-wrapper table-responsive text-center">
        <table>
          <thead>
            <tr>
              <th colspan="5">Nama Mesin: {{ popoverContent.machine_nm }}</th>
            </tr>
            <tr>
              <th>Chemical</th>
              <th>Type</th>
              <th>Jumlah (Liter)</th>
              <th>Note</th>
              <th>PIC</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(oil, index) in popoverContent.oil_usage" :key="index">
              <td>{{ oil.oil_nm }}</td>
              <td>{{ oil.type_nm }}</td>
              <td>{{ oil.oil_volume }}</td>
              <td>
                {{
                  oil.oil_nm !== 'Tidak ada data'
                    ? oil.note_nm || 'REGULER'
                    : ''
                }}
              </td>
              <td>{{ oil.pic }}</td>
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
              <td colspan="5" class="text-center text-info">
                Klik untuk tambah pemakaian chemical
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- TABEL 2 -->
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Visual</th>
              <th>Aroma</th>
              <th>Sludge</th>
              <th>Cons</th>
              <th>pH</th>
              <th>PIC Check</th>
              <th>Judge</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(data, index) in popoverContent.result_data"
              :key="index"
            >
              <td>{{ data.visual_nm }}</td>
              <td>{{ data.aroma_nm }}</td>
              <td>{{ data.sludge_nm }}</td>
              <td>{{ data.cons_val }}</td>
              <td>{{ data.ph_val }}</td>
              <td>{{ data.pic_check }}</td>
              <td>{{ data.judge_sts }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
import {
  ACTION_GET_MASTER_OIL,
  GET_MASTER_OIL,
} from '@/store/Chemical/MasterChemicals.module'
import {
  ACTION_ADD_PEMAKAIAN_OLI,
  ACTION_GET_MACHINES,
  ACTION_GET_OILS_USAGE,
  GET_DATA_MACHINES_ALL,
  GET_OILS_USAGE,
} from '@/store/Chemical/pemakaianChemicals.module'
import { ACTION_GET_LINES, GET_LINES } from '@/store/Tool/MasterLines.module'
import {
  ACTION_GET_MASTER_MACHINES,
  GET_MASTER_MACHINES,
} from '@/store/Tool/MasterMachines.module'
import { mapGetters } from 'vuex'
import moment from 'moment-timezone'
import {
  ACTION_GET_OPTIONS_PARAMETERS,
  ACTION_GET_RANGE_OPTION,
  ACTION_GET_RESULT_CHECK,
  ACTION_POST_PARAMETERS_CHECK,
  GET_OPTIONS_PARAMETERS,
  GET_RANGE_OPTION,
  GET_RESULT_DATA,
} from '@/store/Chemical/parametersCheck.module'
import {
  ACTION_GET_MASTER_NOTE,
  GET_MASTER_NOTE,
} from '@/store/Chemical/MasterNote.module'

export default {
  name: 'PemakaianOli',
  data() {
    return {
      mode: 'Pemakaian Chemical', // atau 'Cek Parameter'
      isCheckParameter: false,
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
      scheduleCheckData: [],
      concentration: null,
      ph: null,
      selectedVisual: null,
      selectedAroma: null,
      selectedSludge: null,
      visualOptions: [],
      aromaOptions: [],
      sludgeOptions: [],
      concentration_options: [],
      ph_options: [],
      cons_options: [],
      cons_range_values: [],
      ph_range_values: [],
      note_nm: null,
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
      GET_OPTIONS_PARAMETERS,
      GET_RANGE_OPTION,
      GET_RESULT_DATA,
      GET_MASTER_NOTE,
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
      if (this.mode === 'Pemakaian Chemical') {
        return (
          this.oil_volume !== '' &&
          this.oil_id !== '' &&
          this.machine_id !== '' &&
          this.oil_nm !== '' &&
          this.pic !== ''
        )
      }
      return (
        this.pic !== '' &&
        this.selectedMachine !== '' &&
        this.selectedVisual !== '' &&
        this.selectedAroma !== '' &&
        this.selectedSludge !== '' &&
        this.concentration !== '' &&
        this.ph !== ''
      )
    },
  },
  async mounted() {
    await this.$store.dispatch(ACTION_GET_LINES)
    await this.$store.dispatch(ACTION_GET_MACHINES)
    await this.fetchDataOli()
    await this.$store.dispatch('fetchKaryawanList')
    await this.$store.dispatch(ACTION_GET_OILS_USAGE)
    await this.$store.dispatch(ACTION_GET_RESULT_CHECK)
    await this.$store.dispatch(ACTION_GET_MASTER_NOTE)
  },
  methods: {
    getJudgeClass(machine) {
      const result = this.GET_RESULT_DATA.find(
        (r) => r.machine_id === machine.machine_id,
      )
      const judge = result?.judge_sts || 'Normal'

      return {
        'bg-normal': judge === 'Normal',
        'bg-warning': judge === 'Warning',
        'bg-danger': judge === 'Danger',
      }
    },

    async saveCekParameter() {
      try {
        const currentTime = moment().tz('Asia/Jakarta').format('HH:mm:ss')
        // Gabungkan tanggal dari input dengan jam sekarang
        const formattedDate = moment(
          `${this.date} ${currentTime}`,
          'YYYY-MM-DD HH:mm:ss',
        )
          .tz('Asia/Jakarta')
          .format('YYYY-MM-DD HH:mm:ss')
        const payload = {
          pic: this.pic.nama,
          machine_nm: this.selectedMachine.machine_nm,
          machine_id: this.selectedMachine.machine_id,
          visual_nm: this.selectedVisual.opt_nm,
          aroma_nm: this.selectedAroma.opt_nm,
          sludge_nm: this.selectedSludge.opt_nm,
          cons_val: this.concentration,
          ph: this.ph,
          created_dt: formattedDate,
        }
        let response = await this.$store.dispatch(
          ACTION_POST_PARAMETERS_CHECK,
          payload,
        )
        if (response.status === 200) {
          await this.$store.dispatch(ACTION_GET_RESULT_CHECK)
          this.$swal({
            icon: 'success',
            title: 'Success',
            text: 'Data Berhasil Disimpan',
            showConfirmButton: false,
            timer: 1700,
          })
          this.resetModal()
        } else {
          this.$swal({
            icon: 'error',
            title: 'Error',
            text: 'Data Gagal Disimpan',
          })
        }
      } catch (error) {
        console.error('Error saving cek parameter:', error)
      }
    },
    async getOptions() {
      try {
        const payload = {
          line_id: this.selectedMachine.root_line_id,
          machine_id: this.selectedMachine.machine_id,
        }
        let response_range = await this.$store.dispatch(
          ACTION_GET_RANGE_OPTION,
          payload,
        )

        if (response_range.status === 200) {
          console.log('getrangeoption', this.GET_RANGE_OPTION)

          const { std_min_cons, std_max_cons, std_ph_min, std_ph_max } =
            this.GET_RANGE_OPTION

          // 🔹 Simpan ke struktur lama tanpa option_id
          this.ph_options = [
            {
              min_value: parseFloat(std_ph_min),
              max_value: parseFloat(std_ph_max),
            },
          ]

          this.cons_options = [
            {
              min_value: parseFloat(std_min_cons),
              max_value: parseFloat(std_max_cons),
            },
          ]

          // === BIKIN DAFTAR ANGKA (range values) ===
          // ph range
          if (this.ph_options.length > 0) {
            const { min_value, max_value } = this.ph_options[0]
            // bikin list kelipatan 0.1 biar smooth, bisa kamu ubah ke integer juga
            this.ph_range_values = Array.from(
              { length: Math.floor((max_value - min_value) * 10) + 1 },
              (_, i) => (min_value + i / 10).toFixed(1),
            )
          }

          // cons range
          if (this.cons_options.length > 0) {
            const { min_value, max_value } = this.cons_options[0]
            this.cons_range_values = Array.from(
              { length: Math.floor((max_value - min_value) * 10) + 1 },
              (_, i) => (min_value + i / 10).toFixed(1),
            )
          }
        }

        let response = await this.$store.dispatch(ACTION_GET_OPTIONS_PARAMETERS)
        // console.log('response options', response)
        if (response.status === 200) {
          this.visualOptions = this.GET_OPTIONS_PARAMETERS.filter(
            (option) => option.param_id === 4,
          )

          this.aromaOptions = this.GET_OPTIONS_PARAMETERS.filter(
            (option) => option.param_id === 5,
          )
          this.sludgeOptions = this.GET_OPTIONS_PARAMETERS.filter(
            (option) => option.param_id === 8,
          )
          // console.log('visualOptions', this.visualOptions)
        }
      } catch (error) {
        console.error(error)
      }
    },
    isCheckScheduled(machine) {
      // Anggap kamu punya data dari backend: scheduleCheckData
      // Bentuknya array of objects misal: [{machine_id: 1, checked: true}, ...]

      const check = this.GET_RESULT_DATA.find(
        (item) => item.machine_id === machine.machine_id,
      )
      return !check // return true jika BELUM dicek
    },
    onModeChange(value) {
      this.isCheckParameter = value === 'Cek Parameter'
    },
    async openAddModal(machine) {
      this.selectedMachine = machine
      await this.getOptions()
    },
    hasOilData(machine) {
      return this.GET_OILS_USAGE.some(
        (oil) => oil.machine_id === machine.machine_id,
      )
    },
    showPopover(event, machine) {
      const buttonRect = event.target.getBoundingClientRect()
      const resultData = this.GET_RESULT_DATA.filter(
        (result) => result.machine_id === machine.machine_id,
      )
      const oilsData = this.GET_OILS_USAGE.filter(
        (oil) => oil.machine_id === machine.machine_id,
      )

      this.popoverContent = {
        ...machine,
        oil_usage: oilsData.length
          ? oilsData
          : [{ oil_nm: 'Tidak ada data', type_nm: '-', oil_volume: '0' }],
        result_data: resultData,
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

        const line_id = this.selectedMachine?.root_line_id

        const currentTime = moment().tz('Asia/Jakarta').format('HH:mm:ss')
        const formattedDate = moment(
          `${this.date} ${currentTime}`,
          'YYYY-MM-DD HH:mm:ss',
        )
          .tz('Asia/Jakarta')
          .format('YYYY-MM-DD HH:mm:ss')

        // --- Payload default
        const payload = {
          oil_id: this.oil_nm.oil_id,
          oil_nm: this.oil_nm.oil_nm,
          type_nm: this.type_nm,
          oil_volume: this.oil_volume,
          pic: this.pic.nama,
          created_dt: formattedDate,
          note_id: this.note_nm ? this.note_nm.note_id : null,
          note_nm: this.note_nm ? this.note_nm.note_nm : null,
        }

        // --- Kondisi khusus untuk MIXING REGULER
        if (this.note_nm?.note_nm === 'MIXING REGULER') {
          payload.line_id = line_id
        } else {
          payload.machine_id = this.selectedMachine.machine_id
          payload.machine_nm = this.selectedMachine.machine_nm
        }

        const response = await this.$store.dispatch(
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

      this.type_nm = null
      this.selectedAroma = null
      this.selectedSludge = null
      this.selectedVisual = null
      this.concentration = null
      this.ph = null
      this.note_nm = null
    },
  },
}
</script>

<style>
.bg-warning {
  background-color: rgb(236, 236, 41) !important;
}

.bg-danger {
  background-color: rgb(255, 84, 84) !important;
}

.tight-select >>> .vs__dropdown-toggle {
  margin-bottom: 0px !important;
  padding-bottom: 2px; /* optional */
}

.standard-text {
  margin-top: -10px;
  display: block;
  color: rgb(51, 201, 5);
}

.popover {
  position: absolute;
  background: white;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 2px 2px 12px rgba(0, 0, 0, 0.2);
  z-index: 9999;
  font-size: 12px;
  /* min-width: 100px; */
  max-width: 35vw;
  border: 1px solid #aaa;
}

/* Panah popover */
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

/* Table wrapper untuk masing-masing tabel */
.table-wrapper {
  overflow-x: auto;
  margin-bottom: 16px;
}

/* Table styling */
.popover table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.popover th,
.popover td {
  padding: 8px;
  border: 1px solid #ddd;
  text-align: center;
  word-wrap: break-word;
}

.popover th {
  background-color: #666;
  color: white;
}

.text-danger {
  color: red;
  font-size: 14px;
  margin-top: 5px;
}

/* dashboard {
  padding: 20px;
} */

/* Global Styling */
.line-title {
  font-size: 1.5rem;
  font-weight: bold;
  background-color: #79e7fa; /* Biru modern */
  color: black;
  text-align: center;
  padding: 10px;
  border: none;
  border-radius: 8px;
  margin-bottom: 10px;
}

/* Judul */
.category-title,
.cell-title {
  font-size: 1.3rem;
  font-weight: bold;
  color: #263238; /* Biru kehitaman modern */
}

.cell-title {
  font-size: 1.1rem;
  margin-top: 10px;
  color: #37474f;
}

/* Section untuk mesin */
.cell-section {
  background-color: #e3f2fd !important; /* Soft blue */
  padding: 4%;
}

/* Container untuk mesin */
.machine-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  align-items: center;
}
/* Container untuk mesin */
.machine-container-khusus {
  display: flex;
  flex-wrap: wrap;
  gap: 22px;
  justify-content: center;
  align-items: center;
}
/* Mesin */
.machine-box-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.3s ease;
}

.machine-box-wrapper:hover {
  transform: scale(1.1);
}

.machine-label {
  margin-top: 5px;
  font-size: 0.6rem;
  font-weight: 500;
  color: #455a64;
}

/* Ikon Mesin */
.machine-icon-wrapper {
  position: relative;
  display: inline-block;
  background-color: #fffefe;
  border-radius: 10px;
  padding: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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
  background-color: rgb(226, 226, 226);
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
  top: 0px;
  left: 1px;
  color: rgb(65, 218, 78); /* Warna indikator */
  font-size: 14px;
}
.schedule-icon {
  position: absolute;
  top: 2px;
  right: 2px;
  color: rgb(65, 218, 78);
  font-size: 14px;
}
.card-title {
  background-color: rgb(42, 207, 207) !important;
  font-size: 1.5rem;
  font-weight: bold;
  color: #263238; /* Biru kehitaman modern */
}
</style>
