<template>
  <div class="modal" tabindex="-1" id="modalMasterMachines">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ isEditMode ? 'Edit Master Machine' : 'Add Master Machine' }}
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
              <v-select
                id="line"
                v-model="selectedLine"
                :options="GET_LINES"
                @update:modelValue="onLineChange"
                label="line_nm"
              />
            </div>
          </div>
          <div class="form-group mb-3">
            <label for="machineNm">Machine Name</label>
            <input
              id="machineNm"
              type="text"
              class="form-control"
              v-model="machine_nm"
            />
          </div>
          <div class="form-group mb-3">
            <label for="cell">Cell</label>
            <v-select
              label="cell_nm"
              placeholder="Pilih Cell"
              v-model="cell_nm"
              :options="GET_CELL_NM"
              @update:modelValue="onCellChange"
            >
            </v-select>
          </div>
          <div class="form-group mb-3">
            <label for="machineDsc">Machine Desc</label>
            <input
              id="machineDsc"
              type="text"
              class="form-control"
              v-model="machine_desc"
            />
          </div>
          <div class="form-group mb-3">
            <label for="maker">Maker</label>
            <input
              id="maker"
              type="text"
              class="form-control"
              v-model="machine_maker"
            />
          </div>
          <div class="form-group mb-3">
            <label for="idx_pos">Index Position</label>
            <input
              id="idx_pos"
              type="number"
              class="form-control"
              v-model="idx_pos"
              readonly
              placeholder="Auto Generate"
            />
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
            @click="saveMasterMachine"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal" tabindex="-1" id="modalDeleteMasterMachines">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Delete Master Machine</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <p>Are you sure want to delete this Master Machine?</p>
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
            @click="deleteMasterMachine"
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
        <h4 class="text-center m-0">Master Machines</h4>
        <div>
          <button
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#modalMasterMachines"
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
      <nav aria-label="Page navigation" class="mt-2">
        <ul class="pagination justify-content-center mb-0">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="goToPage(currentPage - 1)">
              <span aria-hidden="true">&laquo;</span>
              <span class="sr-only">Previous</span>
            </button>
          </li>
          <li
            class="page-item"
            v-for="page in totalPages"
            :key="page"
            :class="{ active: currentPage === page }"
          >
            <button class="page-link" @click="goToPage(page)">
              {{ page }}
            </button>
          </li>
          <li
            class="page-item"
            :class="{ disabled: currentPage === totalPages }"
          >
            <button class="page-link" @click="goToPage(currentPage + 1)">
              <span aria-hidden="true">&raquo;</span>
              <span class="sr-only">Next</span>
            </button>
          </li>
        </ul>
      </nav>
      <div class="d-flex justify-content-end mb-2">
        <input
          class="form-control mt-2"
          style="width: 15%"
          type="search"
          v-model="searchResult"
          placeholder="Search Tool..."
        />
      </div>
      <table class="table table-bordered text-center">
        <thead>
          <tr>
            <th style="width: 5%">No</th>
            <th style="width: 10%">Line Name</th>
            <th style="width: 5%">Machine</th>
            <th style="width: 5%">Cell</th>
            <th style="width: 15%">Machine Desc</th>
            <th style="width: 5%">Maker</th>
            <th style="width: 8%">Created By</th>
            <th style="width: 5%">Created At</th>
            <th style="width: 8%">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in paginatedData" :key="index">
            <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
            <td>{{ item.line_nm }}</td>
            <td>{{ item.machine_nm }}</td>
            <td>{{ item.cell_nm }}</td>
            <td>{{ item.machine_desc }}</td>
            <td>{{ item.machine_maker }}</td>
            <td>{{ item.changed_by ? item.changed_by : item.created_by }}</td>
            <td>{{ item.created_dt }}</td>
            <td>
              <button
                class="btn btn-primary me-2"
                data-bs-toggle="modal"
                data-bs-target="#modalMasterMachines"
                @click="editMasterMachines(item)"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button
                class="btn btn-danger"
                data-bs-toggle="modal"
                data-bs-target="#modalDeleteMasterMachines"
                @click="prepareDeleteMachine(item.machine_id)"
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
import { mapGetters } from 'vuex'

import {
  ACTION_ADD_MASTER_MACHINE,
  ACTION_DELETE_MASTER_MACHINE,
  ACTION_EDIT_MASTER_MACHINE,
  ACTION_GET_CELL_NM,
  ACTION_GET_LAST_INDEX_POS,
  ACTION_GET_MASTER_MACHINES,
  GET_CELL_NM,
  GET_LAST_INDEX_POS,
  GET_MASTER_MACHINES,
} from '@/store/Tool/MasterMachines.module'
import { ACTION_GET_LINES, GET_LINES } from '@/store/Tool/MasterLines.module'
export default {
  name: 'MasterMachines',
  data() {
    return {
      isEditMode: false,
      selectedLine: null,
      machine_nm: '',
      cell_nm: '',
      machine_desc: '',
      machine_maker: '',
      created_by: '',
      changed_by: '',
      pageSize: 20, // Items per page
      currentPage: 1, // Current page
      searchResult: '',
      machine_id: null,
      idx_pos: null,
    }
  },
  computed: {
    ...mapGetters([
      GET_MASTER_MACHINES,
      GET_LINES,
      GET_CELL_NM,
      GET_LAST_INDEX_POS,
    ]),
    isFilled() {
      if (this.isEditMode) {
        return (
          this.selectedLine !== '' &&
          this.changed_by !== '' &&
          this.machine_nm !== '' &&
          this.cell_nm !== '' &&
          this.machine_desc !== '' &&
          this.machine_maker !== ''
        )
      } else {
        return (
          this.selectedLine !== '' &&
          this.created_by !== '' &&
          this.machine_nm !== '' &&
          this.cell_nm !== '' &&
          this.machine_desc !== '' &&
          this.machine_maker !== ''
        )
      }
    },
    totalPages() {
      const query = this.searchResult.trim().toLowerCase()
      const filteredData = query
        ? this.GET_MASTER_MACHINES.filter((tool) =>
            tool.machine_nm.toLowerCase().includes(query),
          )
        : this.GET_MASTER_MACHINES

      return Math.ceil(filteredData.length / this.pageSize)
    },

    paginatedData() {
      const query = this.searchResult.trim().toLowerCase() // Ambil input pencarian
      const filteredData = query
        ? this.GET_MASTER_MACHINES.filter((tool) =>
            tool.machine_nm.toLowerCase().includes(query),
          )
        : this.GET_MASTER_MACHINES // Jika tidak ada pencarian, gunakan data asli

      const startIndex = (this.currentPage - 1) * this.pageSize
      const endIndex = this.currentPage * this.pageSize
      return filteredData.slice(startIndex, endIndex)
    },
  },
  mounted() {
    this.$store.dispatch(ACTION_GET_MASTER_MACHINES)
    this.$store.dispatch(ACTION_GET_LINES)
  },
  methods: {
    async onLineChange() {
      try {
        const payload = {
          root_line_id: this.selectedLine.line_id,
        }

        await this.$store.dispatch(ACTION_GET_CELL_NM, payload)
      } catch (error) {
        console.log(error)
      }
    },
    async onCellChange() {
      try {
        const payload = {
          line_id: this.cell_nm.line_id,
          root_line_id: this.selectedLine.line_id,
          cell_nm: this.cell_nm.cell_nm,
        }

        let response = await this.$store.dispatch(
          ACTION_GET_LAST_INDEX_POS,
          payload,
        )

        if (response.status === 200) {
          // console.log('response', response)

          this.idx_pos = this.GET_LAST_INDEX_POS[0].maxidx
          // console.log('idx_pos', this.idx_pos)
        }
      } catch (error) {
        console.log(error)
      }
    },
    goToPage(page) {
      if (page < 1 || page > this.totalPages) return
      this.currentPage = page
    },
    openAddModal() {
      this.isEditMode = false
    },

    editMasterMachines(item) {
      this.isEditMode = true
      this.selectedLine = item
      this.machine_id = item.machine_id
      this.machine_nm = item.machine_nm
      this.cell_nm = item.cell_nm
      this.machine_desc = item.machine_desc
      this.idx_pos = item.idx_pos
      this.machine_maker = item.machine_maker
      this.created_by = ''
    },
    saveMasterMachine() {
      if (this.isEditMode) {
        this.updateMasterMachine()
      } else {
        this.addMasterMachine()
      }
    },
    async addMasterMachine() {
      try {
        const payload = {
          line_id: this.cell_nm.line_id,
          root_line_id: this.selectedLine.line_id,
          machine_nm: this.machine_nm,
          cell_nm: this.cell_nm.cell_nm,
          machine_desc: this.machine_desc,
          machine_maker: this.machine_maker,
          idx_pos: this.idx_pos,
          created_by: this.created_by,
        }

        let response = await this.$store.dispatch(
          ACTION_ADD_MASTER_MACHINE,
          payload,
        )
        if (response.status === 201) {
          this.$swal({
            icon: 'success',
            title: 'Success',
            text: 'Data saved successfully!',
          })
          this.$store.dispatch(ACTION_GET_MASTER_MACHINES)
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
    async updateMasterMachine() {
      try {
        const payload = {
          line_id: this.GET_CELL_NM.line_id,
          machine_id: this.machine_id,
          root_line_id: this.selectedLine.root_line_id,
          cell_nm: this.cell_nm,
          machine_nm: this.machine_nm,
          machine_desc: this.machine_desc,
          machine_maker: this.machine_maker,
          idx_pos: this.idx_pos,
          changed_by: this.changed_by,
        }
        let response = await this.$store.dispatch(
          ACTION_EDIT_MASTER_MACHINE,
          payload,
        )
        if (response.status === 201) {
          this.$swal({
            icon: 'success',
            title: 'Success',
            text: 'Data updated successfully!',
          })
          this.$store.dispatch(ACTION_GET_MASTER_MACHINES)
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
    prepareDeleteMachine(machine_id) {
      this.machine_id = machine_id
    },
    async deleteMasterMachine() {
      try {
        let response = await this.$store.dispatch(
          ACTION_DELETE_MASTER_MACHINE,
          this.machine_id,
        )
        if (response.status === 201) {
          this.$swal({
            icon: 'success',
            title: 'Success',
            text: 'Data deleted successfully!',
          })
          this.$store.dispatch(ACTION_GET_MASTER_MACHINES)
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
      this.isEditMode = false
      this.machine_nm = ''
      this.cell_nm = ''
      this.machine_desc = ''
      this.machine_maker = ''
      this.created_by = ''
      this.changed_by = ''
      this.selectedLine = null
      this.machine_id = null
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
