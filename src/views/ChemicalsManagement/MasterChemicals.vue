<template>
  <div class="modal" tabindex="-1" id="modalMasterOli">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ isEditMode ? 'Edit Master Oli' : 'Add Master Oli' }}
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
            <div class="form-group mb-3">
              <label for="no">Material Number</label>
              <input
                id="no"
                type="text"
                class="form-control"
                v-model="material_no"
              />
              <div v-if="errorMaterialNo" class="text-danger">
                {{ errorMaterialNo }}
              </div>
            </div>
          </div>
          <div>
            <div class="form-group mb-3">
              <label for="nama">Nama Oli</label>
              <input
                id="nama"
                type="text"
                class="form-control"
                v-model="oil_nm"
              />
              <div v-if="errorOilName" class="text-danger">
                {{ errorOilName }}
              </div>
            </div>
          </div>
          <div>
            <div class="form-group mb-3">
              <label for="type">Type Oli</label>
              <input
                id="type"
                type="text"
                class="form-control"
                v-model="type_nm"
              />
              <div v-if="errorOilType" class="text-danger">
                {{ errorOilType }}
              </div>
            </div>
          </div>
          <div class="form-group mb-3">
            <label for="description"> Description</label>
            <input
              id="description"
              type="text"
              class="form-control"
              v-model="description"
            />
            <div v-if="errorDescription" class="text-danger">
              {{ errorDescription }}
            </div>
          </div>
          <div class="form-group mb-3">
            <div v-if="!isEditMode">
              <label for="createdBy">Created By</label>
              <input
                id="createdBy"
                type="text"
                class="form-control"
                v-model="created_by"
              />
            </div>
            <div v-else>
              <label for="updatedBy">Updated By</label>
              <input
                id="updatedBy"
                type="text"
                class="form-control"
                v-model="changed_by"
              />
            </div>
          </div>
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
            data-bs-dismiss="modal"
            class="btn btn-primary"
            :disabled="!isFilled"
            @click="saveMasterOli"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal" tabindex="-1" id="modalDeleteMasterOli">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Delete Master Oli</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <p>Are you sure want to delete this Master Oli?</p>
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
            class="btn btn-danger"
            data-bs-dismiss="modal"
            @click="deleteMasterOli"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="container-fluid">
    <div class="card p-2 mb-2">
      <div class="d-flex justify-content-between align-items-center">
        <h4 class="text-center m-0">Master Chemical</h4>
        <div>
          <button
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#modalMasterOli"
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
      <div class="table-responsive">
        <table class="table table-hover table-bordered text-center">
          <thead>
            <tr>
              <th>No</th>
              <th>Material No</th>
              <th>Nama Oli</th>
              <th>Type Oli</th>
              <th>Oli Desc</th>
              <th>Created By</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in GET_MASTER_OIL" :key="item.oil_id">
              <td>{{ index + 1 }}</td>
              <td>{{ item.material_no }}</td>
              <td>{{ item.oil_nm }}</td>
              <td>{{ item.type_nm }}</td>
              <td>{{ item.oil_desc }}</td>
              <td>{{ item.updated_by ? item.updated_by : item.created_by }}</td>
              <td>{{ item.display_dt }}</td>

              <td>
                <button
                  class="btn btn-primary me-2"
                  data-bs-toggle="modal"
                  data-bs-target="#modalMasterOli"
                  @click="editMasterOli(item)"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  class="btn btn-danger"
                  data-bs-toggle="modal"
                  data-bs-target="#modalDeleteMasterOli"
                  @click="prepareDeleteOli(item.oil_id)"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
import {
  ACTION_ADD_MASTER_OIL,
  ACTION_DELETE_MASTER_OIL,
  ACTION_EDIT_MASTER_OIL,
  ACTION_GET_MASTER_OIL,
  GET_MASTER_OIL,
} from '@/store/Chemical/MasterChemicals.module'
import { mapGetters } from 'vuex'
export default {
  name: 'MasterChemicals',
  data() {
    return {
      isEditMode: false,
      oil_nm: '',
      type_nm: '',
      created_by: '',
      oil_id: null,
      description: '',
      changed_by: '',
      material_no: '',
    }
  },
  computed: {
    ...mapGetters([GET_MASTER_OIL]),
    isFilled() {
      if (this.isEditMode) {
        return this.oil_nm !== '' && !this.errorOilName
      } else {
        return (
          this.oil_nm !== '' && this.created_by !== '' && !this.errorOilName
        )
      }
    },
    errorOilName() {
      if (this.oil_nm) {
        this.oil_nm = this.oil_nm.toUpperCase() // Ubah ke huruf besar semua
      }

      if (!/^[A-Z0-9]+(?:[-\s]?[A-Z0-9]+)*$/.test(this.oil_nm)) {
        return 'Harus huruf besar Ex: CIRCULATING VG 32'
      }
      return ''
    },

    errorMaterialNo() {
      if (!/^[A-Z][A-Z0-9-]*$/.test(this.material_no)) {
        return 'Harus diawali huruf besar Ex: B854-888990'
      }
      return ''
    },

    errorOilType() {
      if (!/^[A-Z][a-zA-Z0-9]*(?: [A-Z0-9][a-zA-Z0-9]*)*$/.test(this.type_nm)) {
        return 'Harus diawali huruf besar Ex: H2'
      }
      return ''
    },

    errorDescription() {
      if (!/^[A-Z][a-z]*( [A-Z][a-z]*)*$/.test(this.description)) {
        return 'Setiap kata harus diawali huruf besar. Contoh: Oli Hidrolik'
      } else {
        return ''
      }
    },
  },
  mounted() {
    this.$store.dispatch(ACTION_GET_MASTER_OIL)
  },
  methods: {
    openAddModal() {
      this.isEditMode = false
    },
    editMasterOli(item) {
      this.isEditMode = true
      this.oil_id = item.oil_id
      this.oil_nm = item.oil_nm
      this.material_no = item.material_no
      this.type_nm = item.type_nm
      this.changed_by = ''
      this.description = item.oil_desc
    },
    prepareDeleteOli(oil_id) {
      this.oil_id = oil_id
    },

    saveMasterOli() {
      if (this.isEditMode) {
        this.updateMasterOil()
      } else {
        this.addMasterOil()
      }
    },
    async addMasterOil() {
      try {
        const payload = {
          material_no: this.material_no,
          oil_nm: this.oil_nm,
          type_nm: this.type_nm,
          created_by: this.created_by,
          oil_desc: this.description,
        }
        let response = await this.$store.dispatch(
          ACTION_ADD_MASTER_OIL,
          payload,
        )
        if (response.status === 201) {
          this.$swal({
            icon: 'success',
            title: 'Success',
            text: 'Data saved successfully!',
          })
          this.$store.dispatch(ACTION_GET_MASTER_OIL)
          this.resetModal()
        }
      } catch (error) {
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: error,
        })
      }
    },
    async updateMasterOil() {
      try {
        const payload = {
          oil_id: this.oil_id,
          material_no: this.material_no,
          oil_nm: this.oil_nm,
          type_nm: this.type_nm,
          updated_by: this.changed_by,
          oil_desc: this.description,
        }

        let response = await this.$store.dispatch(
          ACTION_EDIT_MASTER_OIL,
          payload,
        )

        if (response.status === 201) {
          this.$swal({
            icon: 'success',
            title: 'Success',
            text: 'Data updated successfully!',
          })
          this.$store.dispatch(ACTION_GET_MASTER_OIL)
          this.resetModal()
        }
      } catch (error) {
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: error,
        })
      }
    },
    async deleteMasterOli() {
      try {
        const oil_id = this.oil_id
        let response = await this.$store.dispatch(
          ACTION_DELETE_MASTER_OIL,
          oil_id,
        )
        if (response.status === 201) {
          this.$swal({
            icon: 'success',
            title: 'Success',
            text: 'Data deleted successfully!',
          })
          this.$store.dispatch(ACTION_GET_MASTER_OIL)
          this.resetModal()
        }
      } catch (error) {
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: error,
        })
      }
    },
    resetModal() {
      this.oil_id = ''
      this.oil_nm = ''
      this.material_no = ''
      this.type_nm = ''
      this.changed_by = ''
      this.description = ''
      this.created_by = ''
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
