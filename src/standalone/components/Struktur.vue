<template>
  <div>
    <div class="container-fluid">
      <div class="card">
        <div class="card-body">
          <div class="row">
            <div class="col-12 col-md-6" style="text-align: center">
              <div class="card">
                <h3>
                  <strong>Struktur Organisasi</strong>
                </h3>
                <div class="card tb-bgr">
                  <h4>
                    <strong> Red Shift </strong>
                  </h4>
                </div>
                <div class="table-responsive">
                  <table class="table custom-table table-bordered">
                    <thead>
                      <tr>
                        <th>GL</th>
                        <th>TL</th>
                        <th>TM</th>
                        <th>TM</th>
                        <th>TM</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <div>
                            <img
                              v-if="
                                getEmployeeByPosition('Group Leader', 0, 'Red')
                              "
                              :src="
                                getEmployeeByPosition('Group Leader', 0, 'Red')
                                  .photourl
                              "
                              alt=""
                              class="img-rnd"
                            />
                            <div class="employee-name">
                              {{
                                getEmployeeByPosition(
                                  'Group Leader',
                                  0,
                                  'Red',
                                )?.nama.split(' ')[0] ||
                                '' ||
                                ''
                              }}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            <img
                              v-if="
                                getEmployeeByPosition('Team Leader', 1, 'Red')
                              "
                              :src="
                                getEmployeeByPosition('Team Leader', 1, 'Red')
                                  .photourl
                              "
                              alt=""
                              class="img-rnd"
                            />
                            <div class="employee-name">
                              {{
                                getEmployeeByPosition(
                                  'Team Leader',
                                  1,
                                  'Red',
                                )?.nama.split(' ')[0] ||
                                '' ||
                                ''
                              }}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            <img
                              v-if="
                                getEmployeeByPosition('Team Member', 2, 'Red')
                              "
                              :src="
                                getEmployeeByPosition('Team Member', 2, 'Red')
                                  .photourl
                              "
                              alt=""
                              class="img-rnd"
                            />
                            <div class="employee-name">
                              {{
                                getEmployeeByPosition(
                                  'Team Member',
                                  2,
                                  'Red',
                                )?.nama.split(' ')[0] ||
                                '' ||
                                ''
                              }}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            <img
                              v-if="
                                getEmployeeByPosition('Team Member', 3, 'Red')
                              "
                              :src="
                                getEmployeeByPosition('Team Member', 3, 'Red')
                                  .photourl
                              "
                              alt=""
                              class="img-rnd"
                            />
                            <div class="employee-name">
                              {{
                                getEmployeeByPosition(
                                  'Team Member',
                                  3,
                                  'Red',
                                )?.nama.split(' ')[0] ||
                                '' ||
                                ''
                              }}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            <img
                              v-if="
                                getEmployeeByPosition('Team Member', 4, 'Red')
                              "
                              :src="
                                getEmployeeByPosition('Team Member', 4, 'Red')
                                  .photourl
                              "
                              alt=""
                              class="img-rnd"
                            />
                            <div class="employee-name">
                              {{
                                getEmployeeByPosition(
                                  'Team Member',
                                  4,
                                  'Red',
                                )?.nama.split(' ')[0] || ''
                              }}
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="card tb-bgw">
                  <h4>
                    <strong> White Shift </strong>
                  </h4>
                </div>
                <div class="table-responsive">
                  <table class="table custom-table table-bordered">
                    <thead>
                      <tr>
                        <th>GL</th>
                        <th>TL</th>
                        <th>TM</th>
                        <th>TM</th>
                        <th>TM</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <div>
                            <img
                              v-if="
                                getEmployeeByPosition(
                                  'Group Leader',
                                  0,
                                  'White',
                                )
                              "
                              :src="
                                getEmployeeByPosition(
                                  'Group Leader',
                                  0,
                                  'White',
                                ).photourl
                              "
                              alt=""
                              class="img-rnd"
                            />
                            <div class="employee-name">
                              {{
                                getEmployeeByPosition(
                                  'Group Leader',
                                  0,
                                  'White',
                                )?.nama.split(' ')[0] || ''
                              }}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            <img
                              v-if="
                                getEmployeeByPosition('Team Leader', 1, 'White')
                              "
                              :src="
                                getEmployeeByPosition('Team Leader', 1, 'White')
                                  .photourl
                              "
                              alt=""
                              class="img-rnd"
                            />
                            <div class="employee-name">
                              {{
                                getEmployeeByPosition(
                                  'Team Leader',
                                  1,
                                  'White',
                                )?.nama.split(' ')[0] || ''
                              }}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            <img
                              v-if="
                                getEmployeeByPosition('Team Member', 2, 'White')
                              "
                              :src="
                                getEmployeeByPosition('Team Member', 2, 'White')
                                  .photourl
                              "
                              alt=""
                              class="img-rnd"
                            />
                            <div class="employee-name">
                              {{
                                getEmployeeByPosition(
                                  'Team Member',
                                  2,
                                  'White',
                                )?.nama.split(' ')[1] || ''
                              }}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            <img
                              v-if="
                                getEmployeeByPosition('Team Member', 3, 'White')
                              "
                              :src="
                                getEmployeeByPosition('Team Member', 3, 'White')
                                  .photourl
                              "
                              alt=""
                              class="img-rnd"
                            />
                            <div class="employee-name">
                              {{
                                getEmployeeByPosition(
                                  'Team Member',
                                  3,
                                  'White',
                                )?.nama.split(' ')[1] || ''
                              }}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            <img
                              v-if="
                                getEmployeeByPosition('Team Member', 4, 'White')
                              "
                              :src="
                                getEmployeeByPosition('Team Member', 4, 'White')
                                  .photourl
                              "
                              alt=""
                              class="img-rnd"
                            />
                            <div class="employee-name">
                              {{
                                getEmployeeByPosition(
                                  'Team Member',
                                  4,
                                  'White',
                                )?.nama.split(' ')[0] || ''
                              }}
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <!--card-->
            </div>
            <!--col-->
            <div class="col-12 col-md-6" style="text-align: center">
              <div class="card">
                <h3>
                  <strong>Change Point</strong>
                </h3>
                <div class="table-responsive">
                  <table class="table custom-table th-bgr table-bordered">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Nama</th>
                        <th>Noreg</th>
                        <th>Foto</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(employee, index) in absenEmployees"
                        :key="index"
                      >
                        <td>{{ index + 1 }}</td>
                        <td>{{ employee.nama }}</td>
                        <td>{{ employee.noreg }}</td>
                        <td>
                          <img
                            :src="employee.photourl"
                            alt=""
                            class="img-rnd"
                          />
                        </td>
                        <td>{{ employee.status }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <!--card-->
            </div>
            <!--col-->
          </div>
          <!--row-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Struktur',
  computed: {
    ...mapGetters([
      'getRedShiftEmployees',
      'getWhiteShiftEmployees',
      'getCurrentShift',
      'getPositionRedShift',
      'getPositionWhiteShift',
    ]),
    redShiftEmployees() {
      // Mengambil karyawan dari shift merah tanpa filter
      return this.getRedShiftEmployees
    },
    whiteShiftEmployees() {
      // Mengambil karyawan dari shift putih tanpa filter
      return this.getWhiteShiftEmployees
    },
    absenEmployees() {
      // Mengambil shift yang dipilih dari store
      const currentShift = this.getCurrentShift

      // Mengambil karyawan dari shift yang sesuai dengan currentShift
      const selectedEmployees =
        currentShift === 'Red'
          ? this.getPositionRedShift
          : this.getPositionWhiteShift

      // Menyaring karyawan yang statusnya bukan 'Hadir'
      const filteredEmployees = selectedEmployees.filter(
        (employee) => employee.status !== 'Hadir',
      )

      return filteredEmployees
    },
  },
  methods: {
    getEmployeeByPosition(jabatan, position, shift) {
      // Mendapatkan daftar karyawan berdasarkan shift yang dipilih
      const employees =
        shift === 'Red' ? this.redShiftEmployees : this.whiteShiftEmployees
      // console.log('employees', employees);
      // Mencari karyawan berdasarkan jabatan dan posisi dalam array
      return employees.find(
        (employee) =>
          employee.jabatan === jabatan &&
          employees.indexOf(employee) === position,
      )
    },
  },
  created() {
    this.$store.dispatch('fetchEmployeeData')
    this.$store.dispatch('fetchEmployeeForSelect')
  },
}
</script>

<style>
.custom-table {
  width: 100%;
  table-layout: auto;
  text-align: center;
}

.custom-table th,
.custom-table td {
  text-align: center;
  vertical-align: middle;
}

.custom-table th {
  background-color: rgb(198, 240, 240);
}

.tb-bgr {
  background-color: rgb(236, 46, 46) !important;
}

.tb-bgw {
  background-color: rgb(218, 218, 218) !important;
}

.img-rnd {
  border-radius: 50%;
  width: 40px; /* Tambahkan kembali ukuran foto */
  height: auto; /* Atur tinggi foto agar sesuai dengan proporsi */
}

.th-bgr th {
  background-color: rgb(236, 46, 46);
}

.table-responsive {
  display: block;
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
.employee-name {
  margin-top: 8px; /* Jarak antara foto dan nama */
  font-size: 10px; /* Ukuran font nama */
  font-weight: bold; /* Membuat nama lebih tebal */
  color: #333;
}
</style>
