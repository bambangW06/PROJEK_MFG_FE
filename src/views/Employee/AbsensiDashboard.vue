<template>
  <div class="container-fluid">
    <div class="card p-2 mb-2">
      <div class="d-flex justify-content-between align-items-center">
        <h4 class="text-center m-0">Absensi</h4>
        <div>
          <span style="font-size: large; color: #000">
            <strong>{{ today }}</strong>
          </span>
        </div>
      </div>
    </div>
  </div>

  <div class="container-fluid">
    <div class="card d-flex justify-content-center align-items-center">
      <AbsensiSupervisor></AbsensiSupervisor>
    </div>

    <div class="card">
      <div class="row align-items-center p-3">
        <div class="col text-center">
          <h2 class="font-weight-bold mb-0">
            Kehadiran Karyawan:
            <span
              :style="{
                color: parseFloat(percentageHadir) >= 100 ? '#000' : 'red',
              }"
            >
              {{ percentageHadir }}
            </span>
          </h2>
        </div>
      </div>

      <div class="container">
        <div class="row mt-2">
          <!-- Bagian untuk Shift Red -->
          <div
            class="col-md-6"
            :class="{
              active: currentShift === 'Red',
              'red-background': currentShift === 'Red',
            }"
          >
            <h2
              class="text-center"
              @click="toggleShift('Red')"
              style="cursor: pointer; transition: all 0.3s ease-out"
            >
              Shift Red
            </h2>
            <!-- Loop melalui redShiftEmployees -->
            <div
              v-for="(employee, cardIndex) in redShiftEmployees"
              :key="'red_' + cardIndex"
            >
              <!-- Card untuk setiap pegawai di Shift Red -->
              <div
                class="card"
                :class="{
                  'red-border': employee.status !== 'Hadir',
                  'green-border': employee.status === 'Hadir',
                  'not-border': employee.status === '',
                }"
              >
                <div class="row mb-2">
                  <div class="col-auto align-self-center pr-0">
                    <button class="border-round" disabled>
                      <img class="img-rd" :src="employee.photourl" alt="" />
                    </button>
                  </div>
                  <div class="col">
                    <form>
                      <div class="row align-items-center">
                        <label
                          for="name{{ cardIndex }}"
                          class="col-auto col-form-label mb-0"
                          style="width: 85px"
                          >Nama</label
                        >
                        <div class="col pl-0">
                          <input
                            type="text"
                            class="form-control bg"
                            style="min-width: 100px"
                            :id="'name' + cardIndex"
                            v-model="employee.nama"
                          />
                        </div>
                      </div>
                    </form>
                    <form>
                      <div class="row align-items-center">
                        <label
                          for="pos{{ cardIndex }}"
                          class="col-auto col-form-label mb-0"
                          style="width: 85px"
                          >Noreg</label
                        >
                        <div class="col pl-0">
                          <input
                            type="text"
                            class="form-control bg"
                            style="min-width: 100px"
                            :id="'pos' + cardIndex"
                            v-model="employee.noreg"
                          />
                        </div>
                      </div>
                    </form>
                    <form>
                      <div class="row align-items-center">
                        <label
                          for="pos{{ cardIndex }}"
                          class="col-auto col-form-label mb-0"
                          style="width: 85px"
                          >Jabatan</label
                        >
                        <div class="col pl-0">
                          <input
                            type="text"
                            class="form-control bg"
                            style="min-width: 100px"
                            :id="'pos' + cardIndex"
                            v-model="employee.jabatan"
                          />
                        </div>
                      </div>
                    </form>
                    <div class="row align-items-center">
                      <label
                        :for="'status' + cardIndex"
                        class="col-auto col-form-label mb-0"
                        style="width: 85px"
                        >Status</label
                      >
                      <div class="col pl-0">
                        <select
                          class="form-control bg"
                          style="min-width: 100px"
                          :id="'status' + cardIndex"
                          v-model="employee.status"
                          @change="updateStatus(0, cardIndex)"
                          @click="handleSelectClick"
                        >
                          <option value="" disabled selected></option>
                          <option value="Hadir">Hadir</option>
                          <option value="Cuti">Cuti</option>
                          <option value="Sakit">Sakit</option>
                          <option value="Opname">Opname</option>
                          <option value="Others">Others</option>
                        </select>
                      </div>
                    </div>
                    <!--row align-items-center select-->
                  </div>
                  <!--col card-->
                </div>
                <!--row card-->
              </div>
              <!--card :class-->
            </div>
            <!--v-for-->
          </div>
          <!--col-md-6-->

          <!-- Bagian untuk Shift White -->
          <div
            class="col-md-6"
            :class="{
              active: currentShift === 'White',
              'white-background': currentShift === 'White',
            }"
          >
            <h2
              class="text-center"
              @click="toggleShift('White')"
              style="cursor: pointer; transition: all 0.3s ease-out"
            >
              Shift White
            </h2>
            <!-- Loop melalui whiteShiftEmployees -->
            <div
              v-for="(employee, cardIndex) in whiteShiftEmployees"
              :key="'white_' + cardIndex"
            >
              <!-- Card untuk setiap pegawai di Shift White -->
              <div
                class="card"
                :class="{
                  'red-border': employee.stat !== 'Hadir',
                  'green-border': employee.status === 'Hadir',
                  'not-border': employee.status === '',
                }"
              >
                <div class="row mb-2">
                  <div class="col-auto align-self-center pr-0">
                    <button class="border-round" disabled>
                      <img class="img-rd" :src="employee.photourl" alt="" />
                    </button>
                  </div>
                  <div class="col">
                    <form>
                      <div class="row align-items-center">
                        <label
                          for="name{{ cardIndex }}"
                          class="col-auto col-form-label mb-0"
                          style="width: 85px"
                          >Nama</label
                        >
                        <div class="col pl-0">
                          <input
                            type="text"
                            class="form-control bg"
                            style="min-width: 100px"
                            :id="'name' + cardIndex"
                            v-model="employee.nama"
                          />
                        </div>
                      </div>
                    </form>
                    <form>
                      <div class="row align-items-center">
                        <label
                          for="pos{{ cardIndex }}"
                          class="col-auto col-form-label mb-0"
                          style="width: 85px"
                          >Noreg</label
                        >
                        <div class="col pl-0">
                          <input
                            type="text"
                            class="form-control bg"
                            style="min-width: 100px"
                            :id="'pos' + cardIndex"
                            v-model="employee.noreg"
                          />
                        </div>
                      </div>
                    </form>
                    <form>
                      <div class="row align-items-center">
                        <label
                          for="pos{{ cardIndex }}"
                          class="col-auto col-form-label mb-0"
                          style="width: 85px"
                          >Jabatan</label
                        >
                        <div class="col pl-0">
                          <input
                            type="text"
                            class="form-control bg"
                            style="min-width: 100px"
                            :id="'pos' + cardIndex"
                            v-model="employee.jabatan"
                          />
                        </div>
                      </div>
                    </form>
                    <div class="row align-items-center">
                      <label
                        :for="'status' + cardIndex"
                        class="col-auto col-form-label mb-0"
                        style="width: 85px"
                        >Status</label
                      >
                      <div class="col pl-0">
                        <select
                          class="form-control bg"
                          style="min-width: 100px"
                          :id="'status' + cardIndex"
                          v-model="employee.status"
                          @change="updateStatus(1, cardIndex)"
                          @click="handleSelectClick"
                        >
                          <!---->
                          <option value="" disabled selected></option>
                          <option value="Hadir">Hadir</option>
                          <option value="Cuti">Cuti</option>
                          <option value="Sakit">Sakit</option>
                          <option value="Opname">Opname</option>
                          <option value="Others">Others</option>
                        </select>
                      </div>
                    </div>
                    <!--row align-items-center select-->
                  </div>
                  <!--col card-->
                </div>
                <!--row card-->
              </div>
              <!--card :class-->
            </div>
            <!--v-for-->
          </div>
          <!--col-md-6 :class-->
        </div>
      </div>
    </div>

    <!-- <div class="card d-flex justify-content-center align-items-center">
      <AbsensiNonShift></AbsensiNonShift>
    </div> -->
  </div>
</template>

<script>
import AbsensiNonShift from '@/standalone/components/AbsensiNonShift.vue'
import AbsensiSupervisor from '@/standalone/components/AbsensiSupervisor.vue'
import moment from 'moment'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'EAssignment',
  components: { AbsensiSupervisor, AbsensiNonShift },

  computed: {
    ...mapGetters([
      'getPercentageHadir',
      'getCurrentShift',
      'getRedShiftEmployees',
      'getWhiteShiftEmployees',
    ]),
    redShiftEmployees() {
      console.log(' redShiftEmployees', this.getRedShiftEmployees)

      return this.getRedShiftEmployees
    },
    whiteShiftEmployees() {
      console.log('whiteShiftEmployees', this.getWhiteShiftEmployees)

      return this.getWhiteShiftEmployees
    },
    selectedStatus() {
      return this.$store.getters.getSelectedStatus
    },
    percentageHadir() {
      console.log(this.getPercentageHadir)

      return this.getPercentageHadir // Menggunakan getter dari Vuex
    },
    currentShift() {
      return this.getCurrentShift
    },
    today() {
      // Dapatkan waktu sekarang dalam zona waktu Jakarta
      let currentDate = moment().tz('Asia/Jakarta').locale('id')

      // Atur batas waktu jam 07:00 hari ini di Jakarta
      let shiftSiangStart = moment()
        .tz('Asia/Jakarta')
        .set({ hour: 7, minute: 0, second: 0, millisecond: 0 })

      // Jika waktu sekarang masih sebelum jam 07:00, gunakan tanggal kemarin
      if (currentDate.isBefore(shiftSiangStart)) {
        currentDate.subtract(1, 'days') // Set tanggal ke kemarin
      }
      // Format tanggal dalam bahasa Indonesia
      return currentDate.format('dddd, DD-MM-YY')
    },
  },
  methods: {
    ...mapActions(['fetchPercentageHadir', 'addCurrentShift', 'ambilShift']), // Memetakan action fetchPercentageHadir
    handleSelectClick() {
      if (!this.currentShift) {
        alert('Pilih shift terlebih dahulu')
        return
      }
    },
    async toggleShift(shift) {
      // console.log('ini shift vue', shift);
      await this.$store.dispatch('addCurrentShift', shift)
      // Panggil metode untuk menghitung ulang persentase hadir saat shift berubah
      await this.$store.dispatch('ambilShift')
      await this.$store.dispatch('fetchHistoryAbsence')
    },
    async updateStatus(shiftIndex, cardIndex) {
      if (!this.currentShift) {
        alert('Pilih shift terlebih dahulu')
        return
      }
      // Periksa apakah shiftIndex sesuai dengan currentShift
      if (
        (this.currentShift === 'Red' && shiftIndex !== 0) ||
        (this.currentShift === 'White' && shiftIndex !== 1)
      ) {
        alert('Shiftnya salah kakak')
        return
      }

      const employee =
        this.currentShift === 'Red'
          ? this.redShiftEmployees[cardIndex]
          : this.whiteShiftEmployees[cardIndex]
      const selectedStatus = employee.status
      // console.log('selectedStatus:', selectedStatus);
      let response = await this.$store.dispatch('updateEmployeeStatus', {
        shiftIndex,
        cardIndex,
        status: selectedStatus,
      })
      if (response === 201) {
        this.$store.dispatch('fetchHistoryAbsence')
        this.updatePercentageHadir()
      } else {
        alert('gagal update status')
      }
    },

    async updatePercentageHadir() {
      try {
        await this.$store.dispatch('fetchPercentageHadir')
      } catch (error) {
        console.error('Error updating percentage hadir:', error)
      }
    },
  },
  mounted() {
    // Fetch data from Vuex action when component is created
    this.$store.dispatch('fetchEmployeeData')
    this.$store.dispatch('ambilShift')
    this.$store.dispatch('fetchHistoryAbsence')
    this.updatePercentageHadir()
  },
}
</script>

<style>
.border-round {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: none;
  background-color: transparent;
}
.img-rd {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: none;
  object-fit: center cover;
}
.card {
  background-color: rgba(255, 255, 255, 0.5);
  margin-bottom: 5px;
}
.form-control bg {
  background-color: transparent;
  border: none; /* Hapus border */
  border-bottom: 1px solid #7e7d7d; /* Tambahkan garis bawah */
  outline: none; /* Hilangkan garis fokus saat dihover */
}
.red-background {
  background-color: rgba(
    240,
    246,
    248,
    0.5
  ); /* Warna latar belakang merah transparan*/
  color: inherit; /* Warna teks tidak berubah */
  border-radius: 5px;
}

h2.text-center:hover {
  transform: scale(1.05); /* Efek hover untuk memperbesar teks */
}

.white-background {
  background-color: rgba(255, 255, 255, 0.8); /* Putih transparan */
  color: inherit; /* Memastikan warna teks tidak berubah */
}
.red-border {
  border: 2px solid red !important;
}
.green-border {
  border: 2px solid rgb(97, 233, 63) !important;
}
.not-border {
  border: none !important;
}
.fnrg {
  text-align: end;
}
.fnlf {
  text-align: start;
}
</style>
