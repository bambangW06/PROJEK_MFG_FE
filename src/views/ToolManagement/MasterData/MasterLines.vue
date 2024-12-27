<template>
  <div class="modal" tabindex="-1" id="modalMasterLines">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ isEditMode ? 'Edit Master Lines' : 'Add Master Lines' }}
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
              <label for="line">Line Name</label>
              <input
                id="line"
                type="text"
                class="form-control"
                v-model="line_nm"
              />
              <div v-if="errorLineName" class="text-danger">
                {{ errorLineName }}
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
            @click="saveMasterLines"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal" tabindex="-1" id="modalDeleteMasterLines">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Delete Master Lines</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <p>Are you sure want to delete this Master Line?</p>
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
            @click="deleteMasterLines"
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
        <h4 class="text-center m-0">Master Line</h4>
        <div>
          <button
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#modalMasterLines"
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
              <th>Line Name</th>
              <th>Line Desc</th>
              <th>Created By</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in GET_LINES" :key="item.line_id">
              <td>{{ index + 1 }}</td>
              <td>{{ item.line_nm }}</td>
              <td>{{ item.line_desc }}</td>
              <td>{{ item.created_by }}</td>
              <td>{{ item.created_dt }}</td>
              <td>
                <button
                  class="btn btn-primary me-2"
                  data-bs-toggle="modal"
                  data-bs-target="#modalMasterLines"
                  @click="editMasterLines(item)"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  class="btn btn-danger"
                  data-bs-toggle="modal"
                  data-bs-target="#modalDeleteMasterLines"
                  @click="prepareDeleteLines(item.line_id)"
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
  ACTION_GET_LINES,
  GET_LINES,
  ACTION_EDIT_MASTER_LINE,
  ACTION_DELETE_MASTER_LINE,
  ACTION_ADD_MASTER_LINE,
} from '@/store/Tool/MasterLines.module'
import { mapGetters } from 'vuex'
export default {
  name: 'MasterLines',
  data() {
    return {
      isEditMode: false,
      line_nm: '',
      created_by: '',
      line_id: null,
      description: '',
      changed_by: '',
    }
  },
  computed: {
    ...mapGetters([GET_LINES]),
    isFilled() {
      if (this.isEditMode) {
        return (
          this.line_nm !== '' &&
          this.changed_by !== '' &&
          !this.errorLineName &&
          !this.errorDescription
        )
      } else {
        return (
          this.line_nm !== '' &&
          this.created_by !== '' &&
          !this.errorLineName &&
          !this.errorDescription
        )
      }
    },
    errorLineName() {
      if (!/^[A-Z][a-z]*( [A-Z][a-z]*)?$/.test(this.line_nm)) {
        return 'Harus diawali huruf besar Ex: Tool Regrinding'
      } else {
        return ''
      }
    },
    errorDescription() {
      if (!/^[A-Z][a-z]*( [A-Z][a-z]*)*$/.test(this.description)) {
        return 'Setiap kata harus diawali huruf besar. Contoh: Machining Cylinder Head'
      } else {
        return ''
      }
    },
  },
  mounted() {
    this.$store.dispatch(ACTION_GET_LINES)
  },
  methods: {
    openAddModal() {
      this.isEditMode = false
    },
    editMasterLines(item) {
      this.isEditMode = true
      this.line_id = item.line_id
      this.line_nm = item.line_nm
      this.changed_by = ''
      this.description = item.line_desc
    },
    prepareDeleteLines(line_id) {
      this.line_id = line_id
    },

    saveMasterLines() {
      if (this.isEditMode) {
        this.updateMasterLines()
      } else {
        this.addMasterLines()
      }
    },
    async addMasterLines() {
      try {
        const payload = {
          line_nm: this.line_nm,
          created_by: this.created_by,
          line_desc: this.description,
        }
        let response = await this.$store.dispatch(
          ACTION_ADD_MASTER_LINE,
          payload,
        )
        if (response.status === 201) {
          this.$swal({
            icon: 'success',
            title: 'Success',
            text: 'Data saved successfully!',
          })
          this.$store.dispatch(ACTION_GET_LINES)
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
    async updateMasterLines() {
      try {
        const payload = {
          line_id: this.line_id,
          line_nm: this.line_nm,
          changed_by: this.changed_by,
          line_desc: this.description,
        }

        let response = await this.$store.dispatch(
          ACTION_EDIT_MASTER_LINE,
          payload,
        )

        if (response.status === 200) {
          this.$swal({
            icon: 'success',
            title: 'Success',
            text: 'Data updated successfully!',
          })
          this.$store.dispatch(ACTION_GET_LINES)
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
    async deleteMasterLines() {
      try {
        const line_id = this.line_id
        let response = await this.$store.dispatch(
          ACTION_DELETE_MASTER_LINE,
          line_id,
        )
        if (response.status === 201) {
          this.$swal({
            icon: 'success',
            title: 'Success',
            text: 'Data deleted successfully!',
          })
          this.$store.dispatch(ACTION_GET_LINES)
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
      this.line_nm = ''
      this.created_by = ''
      this.isEditMode = false
      this.line_id = null
      this.description = ''
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
