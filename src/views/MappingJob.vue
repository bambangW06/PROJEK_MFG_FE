<template>
  <div class="container-fluid">
    <div class="card">
      <div class="card-body">
        <div class="row">
          <div class="col-5">
            <h6>PT.TOYOTA MOTOR MANUFACTURING INDONESIA</h6>
            <h6>ENGINE PRODUCTION KARAWANG DIVISION</h6>
            <h6>ENGINEERING SERVICE DEPARTMENT</h6>
          </div>
          <div class="col-5 align-self-center">
            <h3>ASSIGNMENT MAN POWER</h3>
          </div>
          <div class="col-2 d-flex align-items-center justify-content-end">
            <input
              class="form-control"
              v-model="todaydate"
              type="text"
              readonly
            />
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="container-fluid">
    <div class="card">
      <div class="card-body" style="position: relative">
        <img
          class="card-img-top"
          src="../assets/images/Mapping Assessment Board card.jpg"
          alt="Mapping Assessment Board"
          height="600px"
        />
        <PositionCard
          v-for="position in positions"
          :key="position.key"
          :position="position"
          :selectedEmployee="selectedEmployees[position.key]"
          :employees="employees"
          @show-popover="showPopover"
          @hide-popover="hidePopover"
          @update:selected-employee="
            (employee) => updateSelectedEmployee(position.key, employee)
          "
        />

        <Popover
          v-for="position in positions"
          :key="position.key"
          :position="position"
          :visible="popovers[position.key]"
          :style="{ top: position.popoverTop, left: position.popoverLeft }"
        />
      </div>
    </div>
  </div>
  <Struktur />
</template>

<script>
import Struktur from '../standalone/components/Struktur.vue'
import PositionCard from './PositionCard.vue'
import Popover from './Popover.vue'
import { mapGetters } from 'vuex'
import moment from 'moment-timezone'
import { reactive, toRefs } from 'vue'
import {
  ACTION_GET_OTHERS,
  ACTION_GET_SUPERVISOR,
  GET_SUPERVISOR,
} from '@/store/EmployeeModule'

export default {
  name: 'MappingJob',
  components: {
    Struktur,
    PositionCard,
    Popover,
  },
  setup() {
    const state = reactive({
      todaydate: '',
      popovers: {
        NC: false,
        GL: false,
        QC: false,
        WnD: false,
        SnO: false,
      },
      selectedEmployees: {
        GL: null,
        NC: null,
        QC: null,
        SettingDelivery: null,
        OilSupply: null,
        Supervisor: null,
        CB: null,
      },
      positions: [
        {
          key: 'CB',
          top: '80%',
          left: '30%',
          popoverTop: '80%',
          popoverLeft: '36%',
          label: 'C/B & Crank',
          content: ['1. Manage Kiriko Line Cylinder Block Dan Crank Shaft.'],
        },
        {
          key: 'CH',
          top: '80%',
          left: '36%',
          popoverTop: '80%',
          popoverLeft: '42%',
          label: 'C/H & CAM',
          content: ['1. Manage Kiriko Line Cylinder Head Dan Cam Shaft.'],
        },
        {
          key: 'CoolantSupply',
          top: '80%',
          left: '42%',
          popoverTop: '80%',
          popoverLeft: '48%',
          label: 'Manage Coolant',
          content: ['1. Supply Coolant to Line Cylinder Head Dan Cam Shaft'],
        },
        {
          key: 'ConsentrasiCheck',
          top: '80%',
          left: '48%',
          popoverTop: '80%',
          popoverLeft: '54%',
          label: ' Manage Coolant',
          content: [
            '1. Check Konsentrasi dan Ph Coolant.',
            '2. Manage Limbah Dan Filtramag',
          ],
        },
        {
          key: 'Supervisor',
          top: '20%',
          left: '25%',
          popoverTop: '20%',
          popoverLeft: '32%',
          label: 'SPV',
        },
        {
          key: 'GL',
          top: '7%',
          left: '5%',
          popoverTop: '7%',
          popoverLeft: '11%',
          label: 'GL',
        },
        {
          key: 'TL',
          top: '50%',
          left: '10%',
          popoverTop: '50%',
          popoverLeft: '16%',
          label: 'QC GATE',
          content: [
            '1. 100% check.',
            '2. Input data tool finish regrinding & finish setting.',
            '3. Pendataan tool yang akan direservasi.',
            '4. Mengirim tool out sourching ke gudang.',
            '5. Konfirmasi jika ada pemakaian tool yang over.',
          ],
        },
        {
          key: 'NC',
          top: '35%',
          left: '67%',
          popoverTop: '11%',
          popoverLeft: '55%',
          label: 'POS NC',
          content: [
            '1. Proses rough drill, tap, reamer, endmill dll.',
            '2. pengasahan tool manual (MC, Plank cutter)',
            '3. Proses finishing Drill, Tap, Reamer, Endmill dll.',
            '4. Pengasahan Tool spesial (BC, Ball nose)',
            '5. Konfirmasi kualitas dengan tool regrinding drawing.',
            '6. Check kesesuaian jumlah dan type tool dengan box',
          ],
        },
        {
          key: 'OilSupply',
          top: '75%',
          left: '10%',
          popoverTop: '75%',
          popoverLeft: '16%',
          label: 'SUPPLY OLI',
          content: [
            '1. Pengisian dan pengecekan level oli.',
            '2. Dokumentasi penggunaan oli.',
          ],
        },
        {
          key: 'SettingDelivery',
          top: '55%',
          left: '52%',
          popoverTop: '55%',
          popoverLeft: '58%',
          label: 'DELIVERY & SETTING',
          content: [
            '1. Mengelompokan tool yang akan diregrinding.',
            '2. Mengelompokan tool yang akan direservasi.',
            '3. Memisahkan tool problem.',
            '4. Membersihkan tool, box & check internal coolant.',
            '5. Mengechek "L" minim, jmulah tool & keausan mata potong.',
            '6. Input data tool bekas yang masuk.',
            '7. Menempatkan tool pada rak sesuai jam delivery.',
            '8. Menempatkan tool sesuai lokasi pengerjaanya (regrinding dan setting).',
            '9. Cleaning milling cutter dan membersihkan insert.',
            '10. Mencuci body cutter / washing.',
            '11. Menyeleksi insert yang masih bisa dipakai.',
            '12. menyeting milling cutter(manual, analog, laser)',
            '13. mengganti insert yang kurang.',
          ],
        },
      ],
      employees: [],
    })

    return { ...toRefs(state) }
  },
  computed: {
    ...mapGetters([
      'getCurrentShift',
      'getPositionRedShift',
      'getPositionWhiteShift',
      'getSelectedEmployees',
      'getActualPosition',
      GET_SUPERVISOR,
    ]),
  },
  async created() {
    await this.displayTodayDate()
    await this.$store.dispatch('ambilShift')
    await this.$store.dispatch('fetchEmployeeForSelect')
    await this.$store.dispatch('fetchActualPosition')
    this.selectEmployeesByShift()
    this.defaultPosition()
  },
  methods: {
    displayTodayDate() {
      this.todaydate = moment().format('DD-MM-YYYY')
    },
    selectEmployeesByShift() {
      const currentShift = this.getCurrentShift
      const employeesByShift =
        currentShift === 'Red'
          ? this.getPositionRedShift
          : this.getPositionWhiteShift
      // console.log('getPositionRedShift', this.getPositionRedShift)
      // console.log('getPositionWhiteShift', this.getPositionWhiteShift)
      this.employees = employeesByShift.filter(
        (employee) => employee.status === 'Hadir' || employee.status === null,
      )
    },
    updateSelectedEmployee(positionKey, employee) {
      if (employee && typeof employee === 'object') {
        // Periksa jika posisi sebelumnya dari karyawan yang dipilih adalah default
        const previousDefaultPosition = Object.keys(
          this.selectedEmployees,
        ).find(
          (key) =>
            this.selectedEmployees[key] === employee && key !== positionKey,
        )

        // Set karyawan yang dipilih ke posisi
        this.selectedEmployees[positionKey] = employee
        this.updatePosition(positionKey)

        if (previousDefaultPosition) {
          // Jika posisi sebelumnya adalah posisi default, kosongkan posisi tersebut
          this.selectedEmployees[previousDefaultPosition] = null
          this.updatePosition(previousDefaultPosition)
        }
      } else {
        // Jika karyawan tidak dipilih, kosongkan posisi
        if (
          this.selectedEmployees[positionKey] &&
          this.selectedEmployees[positionKey] === this.defaultPosition
        ) {
          this.selectedEmployees[positionKey] = null
          this.updatePosition(positionKey)
        }
      }
    },
    updatePosition(positionKey) {
      const selectedEmployee = this.selectedEmployees[positionKey]
      // console.log('selectedEmployee', selectedEmployee)
      if (!selectedEmployee) {
        // alert(`Tidak ada karyawan yang dipilih untuk posisi ${positionKey}`)
        return
      }
      const date_pos = moment().tz('Asia/Jakarta').format('YYYY-MM-DD')
      const payload = {
        employee_id: selectedEmployee.employee_id,
        nama: selectedEmployee.nama,
        noreg: selectedEmployee.noreg,
        posisi: positionKey,
        date_assign: date_pos,
        photourl: selectedEmployee.photourl,
        jabatan: selectedEmployee.jabatan,
      }
      // console.log('payload', payload)
      this.$store.dispatch('updatePositionEmployee', payload)
      alert(`Pos ${positionKey} berhasil dikirim`)
    },

    async defaultPosition() {
      const API_URL = process.env.VUE_APP_API_URL
      const currentShift = this.getCurrentShift
      const employeesWithCurrentShift =
        currentShift === 'Red'
          ? this.getPositionRedShift
          : this.getPositionWhiteShift

      // Dapatkan posisi aktual dari getter
      const actualPositions = this.getActualPosition || []

      // Convert array to object for easier lookup
      const actualPositionMap = actualPositions.reduce((map, position) => {
        map[position.employee_id] = position.actual_position
        return map
      }, {})

      // Atur posisi default atau aktual
      for (const employee of employeesWithCurrentShift) {
        if (employee.status === 'Hadir' || employee.status === null) {
          const actualPosition = actualPositionMap[employee.employee_id]
          if (actualPosition) {
            // Jika actual_position ada, set ke posisi aktual
            this.selectedEmployees[actualPosition] = employee
          } else {
            // Jika tidak, gunakan posisi default
            if (employee.default_position) {
              this.selectedEmployees[employee.default_position] = employee
            }
          }
        }
      }

      // Ambil data supervisor dari store
      const supervisorData = this.GET_SUPERVISOR[0] // Pastikan GET_SUPERVISOR mengembalikan array dengan data supervisor

      if (supervisorData) {
        // Pastikan photourl menggunakan API_URL
        if (
          supervisorData.photourl &&
          !supervisorData.photourl.startsWith(API_URL)
        ) {
          supervisorData.photourl = `${API_URL}${supervisorData.photourl}`
        }

        // Tambahkan supervisor ke employees jika belum ada
        const existingEmployee = this.employees.find(
          (emp) => emp.employee_id === supervisorData.employee_id,
        )
        if (!existingEmployee) {
          this.employees.push({
            ...supervisorData,
            jabatan: 'Supervisor', // Atur jabatan supervisor
          })
        }

        // Atur supervisor ke posisi Supervisor
        this.selectedEmployees['Supervisor'] = {
          ...supervisorData,
          jabatan: 'Supervisor', // Atur jabatan supervisor
        }
      }

      // Log final state of selectedEmployees
      console.log('Final selectedEmployees:', this.selectedEmployees)
    },

    showPopover(positionKey) {
      this.popovers[positionKey] = true
    },
    hidePopover(positionKey) {
      this.popovers[positionKey] = false
    },
    actualPosition() {
      this.$store.dispatch('fetchActualPosition')
    },
  },
}
</script>

<style scoped>
input.form-control {
  border: none;
  border-bottom: 1px solid black;
  outline: none;
  background-color: none;
  font-size: x-large;
}
</style>
