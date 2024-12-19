<template>
  <div class="modal" tabindex="-1" id="modalMasterTime">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ isEditMode ? 'Edit Master Time' : 'Add Master Time' }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label">Shift</label>
            <select class="form-select" v-model="shift">
              <option value="Siang">Siang</option>
              <option value="Malam">Malam</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">Time Range</label>
            <input type="text" class="form-control" v-model="time_range" />
            <!-- Display warning message if time range format is incorrect -->
            <div v-if="warningMessage" class="text-danger mt-2">
              {{ warningMessage }}
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
            class="btn btn-primary"
            data-bs-dismiss="modal"
            :disabled="isSaveButtonDisabled"
            @click="saveMasterTime"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal" tabindex="-1" role="dialog" id="modalDeleteMasterTime">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Konfirmasi Hapus</h5>
          <button
            type="button"
            class="close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          Apakah Anda yakin ingin menghapus data ini?
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Batal
          </button>
          <button
            type="button"
            class="btn btn-danger"
            data-bs-dismiss="modal"
            @click="deleteMasterTime"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="container-fluid">
    <div class="card p-2 mb-2">
      <div class="d-flex justify-content-between align-items-center">
        <h4 class="text-center m-0">Master Time</h4>
        <div>
          <button
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#modalMasterTime"
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
      <table class="table table-bordered text-center">
        <thead>
          <tr>
            <th>No</th>
            <th>Created Date</th>
            <th>Shift</th>
            <th>Time Range</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in GET_MASTER_TIME_RANGE" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ item.created_dt }}</td>
            <td>{{ item.shift }}</td>
            <td>{{ item.time_range }}</td>
            <td>
              <button
                class="btn btn-primary me-2"
                data-bs-toggle="modal"
                data-bs-target="#modalMasterTime"
                @click="showEditMasterTime(item)"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button
                class="btn btn-danger"
                data-bs-toggle="modal"
                data-bs-target="#modalDeleteMasterTime"
                @click="showDeleteMasterTime(item)"
              >
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import {
  ACTION_ADD_MASTER_TIME_RANGE,
  ACTION_DELETE_MASTER_TIME_RANGE,
  ACTION_EDIT_MASTER_TIME_RANGE,
  ACTION_GET_MASTER_TIME_RANGE,
  GET_MASTER_TIME_RANGE,
} from '@/store/MasterTime.module'
import { mapGetters } from 'vuex'

export default {
  name: 'MasterTime',
  data() {
    return {
      shift: '',
      time_range: '',
      time_id: null,
      isEditMode: false, // Menandakan apakah modal dalam mode edit
      currentItem: null, // Untuk menyimpan item yang sedang diedit
      warningMessage: '',
      deleteID: null,
    }
  },
  computed: {
    ...mapGetters([GET_MASTER_TIME_RANGE]),
    // Computed property to disable the Save button
    isSaveButtonDisabled() {
      // The Save button is disabled if:
      // 1. `time_range` is empty or invalid format
      const timeRangePattern = /^\d{2}:\d{2} - \d{2}:\d{2}$/
      return !this.time_range || !timeRangePattern.test(this.time_range)
    },
  },
  watch: {
    // Watch for changes in the time_range field
    time_range(newValue) {
      // Validate the new value of time_range as the user types
      const timeRangePattern = /^\d{2}:\d{2} - \d{2}:\d{2}$/
      if (!timeRangePattern.test(newValue)) {
        this.warningMessage =
          'Pastikan format time_range adalah "HH:mm - HH:mm". Contoh: "06:30 - 07:30".'
      } else {
        this.warningMessage = '' // Clear warning if format is correct
      }
    },
  },
  mounted() {
    this.$store.dispatch(ACTION_GET_MASTER_TIME_RANGE)
  },
  methods: {
    openAddModal() {
      this.isEditMode = false
      this.shift = ''
      this.time_range = ''
    },
    showEditMasterTime(item) {
      this.isEditMode = true
      this.shift = item.shift
      this.time_range = item.time_range
      this.time_id = item.time_id
      this.currentItem = item // Menyimpan item yang sedang diedit
    },

    // Fungsi untuk menyimpan data
    saveMasterTime() {
      if (this.isEditMode) {
        // Jika dalam mode edit, update data yang ada
        this.updateMasterTime()
      } else {
        // Jika dalam mode tambah, simpan data baru
        this.addMasterTime()
      }
    },

    // Fungsi untuk menambah data
    async addMasterTime() {
      try {
        const payload = {
          shift: this.shift,
          time_range: this.time_range,
        }
        console.log('payload', payload)
        let response = await this.$store.dispatch(
          ACTION_ADD_MASTER_TIME_RANGE,
          payload,
        )

        if (response.status === 201) {
          this.$swal({
            icon: 'success',
            title: 'Success',
            text: 'Data added successfully',
          })
          this.$store.dispatch(ACTION_GET_MASTER_TIME_RANGE)
          this.resetModal()
        }
      } catch (error) {
        this.$swal({
          icon: 'error',
          title: 'Gagal',
          text: 'Gagal menambahkan Master Time',
        })
      }
    },

    // Fungsi untuk mengupdate data
    async updateMasterTime() {
      try {
        const payload = {
          time_id: this.time_id,
          shift: this.shift,
          time_range: this.time_range,
        }
        let response = await this.$store.dispatch(
          ACTION_EDIT_MASTER_TIME_RANGE,
          payload,
        )
        if (response.status === 201) {
          this.$swal({
            icon: 'success',
            title: 'Success',
            text: 'Data updated successfully',
          })
          this.$store.dispatch(ACTION_GET_MASTER_TIME_RANGE)
        }

        this.resetModal()
      } catch (error) {
        this.$swal({
          icon: 'error',
          title: 'Gagal',
          text: 'Gagal mengupdate Master Time',
        })
      }
    },

    // Fungsi untuk mereset modal
    resetModal() {
      this.shift = ''
      this.time_range = ''
      this.isEditMode = false
      this.currentItem = null
      this.time_id = null
      this.warningMessage = ''
      this.deleteID = null
    },
    showDeleteMasterTime(item) {
      this.deleteID = item.time_id
    },
    async deleteMasterTime() {
      try {
        const time_id = this.deleteID
        console.log('Delete item', time_id)
        let response = await this.$store.dispatch(
          ACTION_DELETE_MASTER_TIME_RANGE,
          time_id,
        )
        if (response.status === 200) {
          this.$swal({
            icon: 'success',
            title: 'Success',
            text: 'Data deleted successfully',
          })
          this.$store.dispatch(ACTION_GET_MASTER_TIME_RANGE)
        }
        this.resetModal()
      } catch (error) {
        this.$swal({
          icon: 'error',
          title: 'Gagal',
          text: 'Gagal menghapus Master Time',
        })
      }
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
