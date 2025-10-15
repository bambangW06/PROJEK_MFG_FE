<template>
  <div class="modal" tabindex="-1" id="modalAddLine">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add Line</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form>
            <div class="mb-3">
              <label for="LineName" class="form-label">Line Name</label>
              <input
                type="text"
                class="form-control"
                id="LineName"
                v-model="line_nm"
              />
            </div>
            <div class="mb-3">
              <label for="createdBy" class="form-label">Created By</label>
              <input
                type="text"
                class="form-control"
                id="createdBy"
                v-model="created_by"
              />
            </div>
          </form>
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
            @click="saveMasterLine"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal" tabindex="-1" id="modalEditMasterLine">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Edit Line</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form>
            <div class="mb-3">
              <label for="editMasterLineName" class="form-label"
                >Line Name</label
              >
              <input
                type="text"
                class="form-control"
                id="editMasterLineName"
                v-model="editedLine.line_nm"
              />
            </div>
            <div class="mb-3">
              <label for="editCreated_by" class="form-label">Created By</label>
              <input
                type="text"
                class="form-control"
                id="editCreated_by"
                v-model="editedLine.created_by"
              />
            </div>
          </form>
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
            @click="saveEditMasterLine"
            data-bs-dismiss="modal"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal" tabindex="-1" id="modalDeleteMasterLine">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Delete Distribution</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete this distribution?</p>
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
            class="btn btn-danger"
            @click="deleteMasterLine"
            data-bs-dismiss="modal"
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
        <button
          type="button"
          class="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#modalAddLine"
        >
          Add Line
        </button>
      </div>
    </div>

    <div class="card mt-2">
      <div class="card-body">
        <table
          class="table table-bordered table-striped"
          style="text-align: center"
        >
          <thead>
            <tr>
              <th>No</th>
              <th>Line Name</th>
              <th>Register Date</th>
              <th>Created By</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(dataLines, index) in getMasterLine" :key="dataLines.id">
              <td>{{ index + 1 }}</td>
              <td>{{ dataLines.line_nm }}</td>
              <td>{{ dataLines.register_dt }}</td>
              <td>{{ dataLines.created_by }}</td>
              <td>
                <button
                  class="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#modalEditMasterLine"
                  @click="showEditMasterLine(dataLines)"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  class="btn btn-danger ms-2"
                  data-bs-toggle="modal"
                  data-bs-target="#modalDeleteMasterLine"
                  @click="showDeleteMasterLine(dataLines.line_id)"
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
import { mapGetters } from 'vuex'
import moment from 'moment-timezone'

export default {
  name: 'MasterGelLines',
  data() {
    return {
      line_nm: '',
      created_by: '',
      editedLine: {
        line_nm: '',
        created_by: '',
      },
      deletedLine: {
        id: null,
      },
    }
  },
  computed: {
    ...mapGetters(['getMasterLine']),
  },
  mounted() {
    this.$store.dispatch('fetchMasterLine')
  },
  methods: {
    saveMasterLine() {
      try {
        const today = moment().format('YYYY-MM-DD HH:mm:ss')
        const payload = {
          line_nm: this.line_nm,
          register_dt: today,
          created_by: this.created_by,
        }
        // console.log(payload)
        this.$store.dispatch('ActionAddLine', payload).then(() => {
          this.$store.dispatch('fetchMasterLine')
        })
        this.resetForm()
      } catch (error) {
        console.log(error)
      }
    },
    resetForm() {
      this.line_nm = ''
      this.created_by = ''
    },
    showEditMasterLine(dataLines) {
      this.editedLine = dataLines
      // console.log(this.editedLine)
    },
    saveEditMasterLine() {
      // console.log('kepanggil saveMasterLine')
      try {
        this.$store
          .dispatch('ActionEditMasterLine', this.editedLine)
          .then(() => {
            this.$store.dispatch('fetchMasterLine')
          })
        // console.log(this.editedLine)
      } catch (error) {
        console.log(error)
      }
    },
    showDeleteMasterLine(id) {
      this.deletedLine = id
      // console.log('id', this.deletedLine)
    },
    deleteMasterLine() {
      try {
        this.$store
          .dispatch('ActionDeleteMasterLine', this.deletedLine)
          .then(() => {
            this.$store.dispatch('fetchMasterLine')
          })
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>
