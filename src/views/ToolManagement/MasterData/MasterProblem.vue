<template>
  <div class="modal" tabindex="-1" id="modalMasterProblems">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ isEditMode ? 'Edit Master Problem' : 'Add Master Problem' }}
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
              <label for="Problem">Problem Name</label>
              <input
                id="Problem"
                type="text"
                class="form-control"
                v-model="problem_nm"
              />
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
                v-model="updated_by"
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
            @click="saveMasterProblem"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal" tabindex="-1" id="modalDeleteMasterProblem">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Delete Master Problem</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <p>Are you sure want to delete this Master Problem?</p>
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
            @click="deleteMasterProblem"
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
        <h4 class="text-center m-0">Master Problem</h4>
        <div>
          <button
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#modalMasterProblems"
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
              <th>Problem Name</th>
              <th>Created By</th>
              <th>Created Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in paginate(GET_MASTER_PROBLEMS)"
              :key="item.problem_id"
            >
              <td>
                {{
                  index +
                  1 +
                  (pagination.currentPage - 1) * pagination.itemsPerPage
                }}
              </td>
              <td>{{ item.problem_nm }}</td>
              <td>{{ item.created_by }}</td>
              <td>{{ item.updated_by ? item.updated_by : item.created_by }}</td>
              <td>
                <button
                  class="btn btn-primary me-2"
                  data-bs-toggle="modal"
                  data-bs-target="#modalMasterProblems"
                  @click="editMasterProblem(item)"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  class="btn btn-danger"
                  data-bs-toggle="modal"
                  data-bs-target="#modalDeleteMasterProblem"
                  @click="prepareDeleteProblem(item.problem_id)"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <nav aria-label="Page navigation">
          <ul class="pagination">
            <li
              class="page-item"
              :class="{ disabled: pagination.currentPage === 1 }"
            >
              <a class="page-link" @click="pagination.currentPage--"
                >Previous</a
              >
            </li>
            <li
              v-for="page in Math.ceil(
                pagination.totalItems / pagination.itemsPerPage,
              )"
              :key="page"
              class="page-item"
              :class="{ active: pagination.currentPage === page }"
            >
              <a class="page-link" @click="pagination.currentPage = page">{{
                page
              }}</a>
            </li>
            <li
              class="page-item"
              :class="{
                disabled:
                  pagination.currentPage ===
                  Math.ceil(pagination.totalItems / pagination.itemsPerPage),
              }"
            >
              <a class="page-link" @click="pagination.currentPage++">Next</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>
<script>
import {
  ACTION_ADD_MASTER_PROBLEM,
  ACTION_DELETE_MASTER_PROBLEM,
  ACTION_EDIT_MASTER_PROBLEM,
  ACTION_GET_MASTER_PROBLEMS,
  GET_MASTER_PROBLEMS,
} from '@/store/Tool/MasterProblems.module'
import { mapGetters } from 'vuex'

export default {
  name: 'MasterProblem',
  data() {
    return {
      isEditMode: false,
      problem_id: null,
      problem_nm: '',
      created_by: '',
      updated_by: '',
      pagination: {
        currentPage: 1,
        totalItems: 0,
        itemsPerPage: 10,
      },
    }
  },
  computed: {
    ...mapGetters([GET_MASTER_PROBLEMS]),
    isFilled() {
      if (this.isEditMode) {
        return this.problem_nm !== '' && this.updated_by !== ''
      } else {
        return this.problem_nm !== '' && this.created_by !== ''
      }
    },
  },
  mounted() {
    this.$store.dispatch(ACTION_GET_MASTER_PROBLEMS)
    this.pagination.totalItems = this.GET_MASTER_PROBLEMS.length
  },
  methods: {
    paginate(data) {
      const start =
        (this.pagination.currentPage - 1) * this.pagination.itemsPerPage
      const end = start + this.pagination.itemsPerPage
      return data.slice(start, end)
    },
    openAddModal() {
      this.isEditMode = false
      this.problem_id = ''
      this.problem_nm = ''
      this.created_by = ''
    },
    saveMasterProblem() {
      if (this.isEditMode) {
        this.updateMasterProblem()
      } else {
        this.addMasterProblem()
      }
    },
    async addMasterProblem() {
      try {
        const payload = {
          problem_nm: this.problem_nm,
          created_by: this.created_by,
        }
        let response = await this.$store.dispatch(
          ACTION_ADD_MASTER_PROBLEM,
          payload,
        )
        if (response.status === 201) {
          this.$swal({
            icon: 'success',
            title: 'Success',
            text: 'Data saved successfully!',
          })
          this.$store.dispatch(ACTION_GET_MASTER_PROBLEMS)
          this.resetModal()
        }
      } catch (error) {
        this.$swal({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        })
      }
    },
    editMasterProblem(item) {
      this.isEditMode = true
      this.problem_id = item.problem_id
      this.problem_nm = item.problem_nm
      this.updated_by = ''
    },
    async updateMasterProblem() {
      try {
        const payload = {
          problem_id: this.problem_id,
          problem_nm: this.problem_nm,
          updated_by: this.updated_by,
        }
        let response = await this.$store.dispatch(
          ACTION_EDIT_MASTER_PROBLEM,
          payload,
        )
        if (response.status === 201) {
          this.$swal({
            icon: 'success',
            title: 'Success',
            text: 'Data updated successfully!',
          })
          this.$store.dispatch(ACTION_GET_MASTER_PROBLEMS)
          this.resetModal()
        }
      } catch (error) {
        this.$swal({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        })
      }
    },
    prepareDeleteProblem(problem_id) {
      this.problem_id = problem_id
    },
    async deleteMasterProblem() {
      try {
        let response = await this.$store.dispatch(
          ACTION_DELETE_MASTER_PROBLEM,
          this.problem_id,
        )
        if (response.status === 201) {
          this.$swal({
            icon: 'success',
            title: 'Success',
            text: 'Data deleted successfully!',
          })
          this.$store.dispatch(ACTION_GET_MASTER_PROBLEMS)
          this.resetModal()
        }
      } catch (error) {
        this.$swal({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        })
      }
    },
    resetModal() {
      this.isEditMode = false
      this.problem_id = ''
      this.problem_nm = ''
      this.created_by = ''
      this.updated_by = ''
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
