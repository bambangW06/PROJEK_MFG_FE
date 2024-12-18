<template>
    <div class="modal" tabindex="-1" id="modalMasterTime">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">{{ isEditMode ? 'Edit Master Time' : 'Add Master Time' }}</h5>
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
                        <input
                            type="text"
                            class="form-control"
                            v-model="shift"
                        />
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Time Range</label>
                        <input
                            type="text"
                            class="form-control"
                            v-model="time_range"
                        />
                    </div>
                </div>
                <div class="modal-footer">
                    <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                    >
                        close
                    </button>
                    <button
                        type="button"
                        class="btn btn-primary"
                        data-bs-dismiss="modal"
                        @click="saveMasterTime()"
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
import { ACTION_GET_MASTER_TIME_RANGE, GET_MASTER_TIME_RANGE } from '@/store/MasterTime.module';
import moment from 'moment';
import { mapGetters } from 'vuex';


    export default {
        name: 'MasterTime',
        data() {
            return {
                shift: '',
                time_range: '',
                isEditMode: false, // Menandakan apakah modal dalam mode edit
                currentItem: null, // Untuk menyimpan item yang sedang diedit
            }
        },
        computed: {
            ...mapGetters([GET_MASTER_TIME_RANGE]),
        },
        mounted(){
            this.$store.dispatch(ACTION_GET_MASTER_TIME_RANGE)
        },
        methods: {
            openAddModal() {
                this.isEditMode = false;
                this.shift = '';
                this.time_range = '';
            },
            showEditMasterTime(item) {
            this.isEditMode = true;
            this.shift = item.shift;
            this.time_range = item.time_range;
            this.currentItem = item; // Menyimpan item yang sedang diedit
            },

            // Fungsi untuk menyimpan data
            saveMasterTime() {
            if (this.isEditMode) {
                // Jika dalam mode edit, update data yang ada
                this.updateMasterTime();
            } else {
                // Jika dalam mode tambah, simpan data baru
                this.addMasterTime();
            }
            },

            // Fungsi untuk menambah data
        async addMasterTime() {
            try {
                const payload = {
                    shift: this.shift,
                    time_range: this.time_range,
                }
                let response = await this.$store.dispatch( payload)
                if (response.status === 201) {
                    this.$swal({
                        icon: 'success',
                        title: 'Success',
                        text: 'Data added successfully',
                    })
                    this.$store.dispatch(ACTION_GET_MASTER_TIME_RANGE)
                    this.resetModal();
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
            updateMasterTime() {
            if (this.currentItem) {
                this.currentItem.shift = this.shift;
                this.currentItem.time_range = this.time_range;
            }
            this.resetModal();
            },

            // Fungsi untuk mereset modal
            resetModal() {
            this.shift = '';
            this.time_range = '';
            this.isEditMode = false;
            this.currentItem = null;
            },

            // Fungsi untuk menghapus data (belum diimplementasikan)
            showDeleteMasterTime(item) {
            // Logic untuk menghapus item
            console.log('Delete item', item);
            },
        }

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