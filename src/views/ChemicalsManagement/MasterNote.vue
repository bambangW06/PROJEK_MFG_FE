<template>
  <div class="modal" tabindex="-1" id="modalAddNote">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add Note</h5>
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
              <label for="notename" class="form-label">Note Name</label>
              <input
                type="text"
                class="form-control"
                id="notename"
                v-model="note_nm"
                @input="note_nm = note_nm.toUpperCase()"
              />
            </div>
            <div class="mb-3">
              <label for="notedesc" class="form-label">Note Description</label>
              <input
                type="text"
                class="form-control"
                id="notedesc"
                v-model="note_desc"
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
            @click="saveMasterNote"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal" tabindex="-1" id="modalEditMasterNote">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Edit Note</h5>
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
              <label for="editMasterNoteName" class="form-label"
                >Note Name</label
              >
              <input
                type="text"
                class="form-control"
                id="editMasterNoteName"
                v-model="editedNote.note_nm"
                @input="editedNote.note_nm = editedNote.note_nm.toUpperCase()"
              />
            </div>
            <div class="mb-3">
              <label for="editMasterNoteDesc" class="form-label"
                >Note Description</label
              >
              <input
                type="text"
                class="form-control"
                id="editMasterNoteName"
                v-model="editedNote.note_desc"
              />
            </div>
            <div class="mb-3">
              <label for="editCreated_by" class="form-label">Updated By</label>
              <input
                type="text"
                class="form-control"
                id="editCreated_by"
                v-model="editedNote.updated_by"
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
            @click="saveEditMasterNote"
            data-bs-dismiss="modal"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal" tabindex="-1" id="modalDeleteMasterNote">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Delete Note</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete this Note?</p>
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
            @click="deleteMasterNote"
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
        <h4 class="text-center m-0">Master Note</h4>
        <button
          type="button"
          class="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#modalAddNote"
        >
          Add Note
        </button>
      </div>
    </div>

    <div class="card mt-2">
      <div class="card-body table-responsive">
        <table
          class="table table-bordered table-striped"
          style="text-align: center"
        >
          <thead>
            <tr>
              <th>No</th>
              <th>Note Name</th>
              <th>Note Description</th>
              <th>Created By</th>
              <th>Register Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody v-if="GET_MASTER_NOTE.length > 0">
            <tr v-for="(dataNote, index) in GET_MASTER_NOTE" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ dataNote.note_nm }}</td>
              <td>{{ dataNote.note_desc }}</td>
              <td>
                {{
                  dataNote.updated_by
                    ? dataNote.updated_by
                    : dataNote.created_by
                }}
              </td>
              <td>
                {{
                  dataNote.updated_dt
                    ? dataNote.updated_dt
                    : dataNote.created_dt
                }}
              </td>
              <td>
                <button
                  class="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#modalEditMasterNote"
                  @click="showEditMasterNote(dataNote)"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  class="btn btn-danger ms-2"
                  data-bs-toggle="modal"
                  data-bs-target="#modalDeleteMasterNote"
                  @click="showDeleteMasterNote(dataNote.note_id)"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="6" class="text-center">No data available</td>
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
import {
  ACTION_ADD_MASTER_NOTE,
  ACTION_DELETE_MASTER_NOTE,
  ACTION_EDIT_MASTER_NOTE,
  ACTION_GET_MASTER_NOTE,
  GET_MASTER_NOTE,
} from '@/store/Chemical/MasterNote.module'

export default {
  name: 'MasterNotes',
  data() {
    return {
      note_nm: '',
      note_desc: '',
      created_by: '',
      editedNote: {
        note_nm: '',
        note_desc: '',
        updated_by: '',
      },
      deletedNoteId: null,
    }
  },
  computed: {
    ...mapGetters([GET_MASTER_NOTE]),
  },
  mounted() {
    this.$store.dispatch(ACTION_GET_MASTER_NOTE)
  },
  methods: {
    async saveMasterNote() {
      try {
        const today = moment().format('YYYY-MM-DD HH:mm:ss')
        const payload = {
          note_nm: this.note_nm,
          note_desc: this.note_desc,
          created_by: this.created_by,
          created_dt: today,
        }

        let response = await this.$store.dispatch(
          ACTION_ADD_MASTER_NOTE,
          payload,
        )
        if (response.status === 201) {
          this.$swal({
            icon: 'success',
            title: 'Success',
            text: 'Data saved successfully!',
          })
          this.$store.dispatch(ACTION_GET_MASTER_NOTE)
        }

        this.resetForm()
      } catch (error) {
        console.log(error)
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: error,
        })
      }
    },
    resetForm() {
      this.note_nm = ''
      this.note_desc = ''
      this.created_by = ''
      this.editedNote = {
        note_nm: '',
        note_desc: '',
        updated_by: '',
      }
      this.deletedNoteId = null
    },
    showEditMasterNote(dataNote) {
      this.editedNote = dataNote
    },
    async saveEditMasterNote() {
      try {
        let response = await this.$store.dispatch(
          ACTION_EDIT_MASTER_NOTE,
          this.editedNote,
        )
        if (response.status === 200) {
          this.$swal({
            icon: 'success',
            title: 'Success',
            text: 'Data saved successfully!',
          })
          this.$store.dispatch(ACTION_GET_MASTER_NOTE)
          this.resetForm()
        }
      } catch (error) {
        console.log(error)
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: error,
        })
      }
    },
    showDeleteMasterNote(note_id) {
      this.deletedNoteId = note_id
    },
    async deleteMasterNote() {
      try {
        let response = await this.$store.dispatch(
          ACTION_DELETE_MASTER_NOTE,
          this.deletedNoteId,
        )
        if (response.status === 200) {
          this.$swal({
            icon: 'success',
            title: 'Success',
            text: 'Data deleted successfully!',
          })
          this.$store.dispatch(ACTION_GET_MASTER_NOTE)
          this.resetForm()
        }
      } catch (error) {
        console.log(error)
        this.$swal({
          icon: 'error',
          title: 'Error',
          text: error,
        })
      }
    },
  },
}
</script>
<style scoped>
.table-bordered th {
  background-color: rgb(198, 240, 240);
}
.table-bordered {
  border: 1px solid black;
}
</style>
