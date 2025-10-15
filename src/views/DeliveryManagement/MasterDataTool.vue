<template>
  <!-- Modal for adding tool -->
  <div class="modal" tabindex="-1" id="modalTambahTool">
    <!-- Modal content -->
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Modal header -->
        <div class="modal-header">
          <h5 class="modal-title">Add Tool</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <!-- Modal body -->
        <div class="modal-body">
          <div class="mb-3">
            <label for="line" class="form-label">Line</label>
            <select
              name="line"
              class="form-select"
              id="line"
              v-model="selectedMasterLine"
            >
              <option value="" disabled selected>Select Line</option>
              <option
                v-for="line in getMasterLine"
                :key="line.line_id"
                :value="line.line_id"
              >
                {{ line.line_nm }}
              </option>
            </select>
          </div>
          <div class="mb-3">
            <label for="op" class="form-label">OP</label>
            <input type="text" class="form-control" id="op" v-model="op" />
          </div>
          <div class="mb-3">
            <label for="toolNo" class="form-label">Tool No </label>
            <input
              type="text"
              class="form-control"
              id="toolNo"
              v-model="toolNo"
            />
          </div>
          <div class="mb-3">
            <label for="toolName" class="form-label">Tool Name</label>
            <input
              type="text"
              class="form-control"
              id="toolName"
              v-model="toolName"
            />
          </div>
          <div class="mb-3">
            <label for="process" class="form-label">Process</label>
            <input
              type="text"
              class="form-control"
              id="toolName"
              v-model="process"
            />
          </div>
          <div class="mb-3">
            <label for="toolImage" class="form-label">Tool Image</label>
            <input
              type="file"
              class="form-control"
              id="toolImage"
              name="foto"
              @change="onFileImageChange"
            />
          </div>
        </div>
        <!-- Modal footer -->
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
            @click="saveDataTool"
            data-bs-dismiss="modal"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal" tabindex="-1" id="modalEditTool">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Edit Tool</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="line" class="form-label">Line</label>
            <select
              name="line"
              class="form-select"
              id="line"
              v-model="editedTool.line_id"
            >
              <option value="" disabled selected>Select Line</option>
              <option
                v-for="line in getMasterLine"
                :key="line.line_id"
                :value="line.line_id"
              >
                {{ line.line_nm }}
              </option>
            </select>
          </div>
          <div class="mb-3">
            <label for="op" class="form-label">OP</label>
            <input
              type="text"
              class="form-control"
              id="op"
              v-model="editedTool.op_no"
            />
          </div>
          <div class="mb-3">
            <label for="toolNo" class="form-label">Tool No </label>
            <input
              type="text"
              class="form-control"
              id="toolNo"
              v-model="editedTool.tool_no"
            />
          </div>
          <div class="mb-3">
            <label for="toolName" class="form-label">Tool Name</label>
            <input
              type="text"
              class="form-control"
              id="toolName"
              v-model="editedTool.tool_nm"
            />
          </div>
          <div class="mb-3">
            <label for="process" class="form-label">Process</label>
            <input
              type="text"
              class="form-control"
              id="toolName"
              v-model="editedTool.process_nm"
            />
          </div>
          <div class="mb-3">
            <label for="toolImage" class="form-label">Tool Image</label>
            <input
              type="file"
              class="form-control"
              id="toolImage"
              name="foto"
              @change="onFileImageChange"
            />
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
            @click="saveEditDataTool"
            data-bs-dismiss="modal"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal" tabindex="-1" id="modalDeleteDataTool">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Delete Tool</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete this tool?</p>
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
            @click="deleteDataTool"
            data-bs-dismiss="modal"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- Modal for previewing image -->
  <div class="modal" tabindex="-1" id="modalPreviewImage">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Preview Image</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div
          v-for="(dataTool, index) in searchResult.length > 0
            ? searchResult
            : paginatedData"
          :key="dataTool.tool_id"
          class="modal-body"
        >
          <img
            v-if="dataTool.previewUrl"
            :src="dataTool.previewUrl"
            :alt="dataTool.tool_nm"
            class="img-fluid"
          />
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- Display Master Data Tool -->
  <nav aria-label="Page navigation" class="mb-2">
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
      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
        <button class="page-link" @click="goToPage(currentPage + 1)">
          <span aria-hidden="true">&raquo;</span>
          <span class="sr-only">Next</span>
        </button>
      </li>
    </ul>
  </nav>
  <div class="container-fluid">
    <div class="card p-2 mb-2">
      <div class="d-flex justify-content-between align-items-center">
        <h4 class="text-center m-0">Master Data Tool</h4>
        <button
          type="button"
          class="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#modalTambahTool"
        >
          Add Tool
        </button>
      </div>
    </div>
    <div class="card">
      <div class="card-body">
        <div class="card p-2 mb-2">
          <div class="d-flex justify-content-end align-items-center">
            <input
              style="width: fit-content; border: 1px solid red"
              ref="searchInput"
              type="seacrh"
              class="form-control"
              placeholder="Search Tool..."
              v-model="search"
              @input="searchTool"
            />
          </div>
        </div>
        <table class="table table-bordered table-striped">
          <thead>
            <tr>
              <th style="width: 5%">No</th>
              <th style="width: 10%">Line</th>
              <th style="width: 5%">OP</th>
              <th style="width: 7%">Tool No</th>
              <th style="width: 15%">Tool Name</th>
              <th style="width: 35%">Process</th>
              <th style="width: 7%">Preview</th>
              <th style="width: 12%">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(dataTool, index) in searchResult.length > 0
                ? searchResult
                : paginatedData"
              :key="dataTool.tool_id"
            >
              <td>{{ (currentPage - 1) * pageSize + (index + 1) }}</td>
              <td>{{ dataTool.line_nm }}</td>
              <td>{{ dataTool.op_no }}</td>
              <td>{{ dataTool.tool_no }}</td>
              <td>{{ dataTool.tool_nm }}</td>
              <td>{{ dataTool.process_nm }}</td>
              <td>
                <button
                  class="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#modalPreviewImage"
                >
                  <i class="fas fa-eye"></i>
                </button>
              </td>
              <td>
                <button
                  data-bs-toggle="modal"
                  data-bs-target="#modalEditTool"
                  @click="editDataTool(dataTool)"
                  class="btn btn-primary"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  data-bs-toggle="modal"
                  data-bs-target="#modalDeleteDataTool"
                  @click="showDeleteConfirmationDataTool(dataTool.tool_id)"
                  class="btn btn-primary ms-2"
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

export default {
  name: 'MasterDataTool',
  data() {
    return {
      currentPage: 1,
      pageSize: 40,
      search: '',
      selectedMasterLine: '',
      op: '',
      toolNo: '',
      process: '',
      toolName: '',
      image: '',
      selectedImage: null,
      previewUrl: '',
      editedTool: {
        line_id: '',
        op_no: '',
        tool_no: '',
        process_nm: '',
        tool_nm: '',
        image: '',
        selectedImage: null,
      },
      searchResult: [],
    }
  },
  computed: {
    ...mapGetters(['getDataTool', 'getMasterLine']),
    totalPages() {
      const data =
        this.searchResult.length > 0 ? this.searchResult : this.getDataTool
      return Math.ceil(data.length / this.pageSize)
    },
    paginatedData() {
      const data =
        this.searchResult.length > 0 ? this.searchResult : this.getDataTool
      const startIndex = (this.currentPage - 1) * this.pageSize
      const endIndex = this.currentPage * this.pageSize
      return data.slice(startIndex, endIndex)
    },
  },
  mounted() {
    this.$store.dispatch('ActionFetchDataTool')
    this.$store.dispatch('fetchMasterLine')
    this.$refs.searchInput.focus()
  },
  methods: {
    onFileImageChange(e) {
      const file = e.target.files[0]
      const maxSize = 500 * 1024 // 500 KB

      if (!file) {
        alert('No file selected.')
        return
      }

      if (!file.type.startsWith('image/')) {
        alert('Select a valid image file.')
        return
      }

      if (file.size > maxSize) {
        alert('File size is too large. Maximum 500 KB.')
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        this.image = event.target.result
        this.selectedImage = file

        this.editedTool.image = event.target.result
        this.editedTool.selectedImage = file
      }

      reader.onerror = () => {
        alert('Error reading the file.')
      }

      reader.readAsDataURL(file)
    },

    goToPage(page) {
      if (page < 1 || page > this.totalPages) return
      this.currentPage = page
    },

    previewImage(priviewUrl) {
      this.previewUrl = priviewUrl
    },

    saveDataTool() {
      const payload = {
        line_id: this.selectedMasterLine,
        op_no: this.op,
        tool_no: this.toolNo,
        process_nm: this.process,
        tool_nm: this.toolName,
        tool_img: this.selectedImage,
      }

      // console.log('Payload sent to backend:', payload)
      this.$store.dispatch('ActionSaveDataTool', payload).then(() => {
        this.$store.dispatch('ActionFetchDataTool')
      })
    },
    editDataTool(dataTool) {
      this.editedTool = dataTool
    },
    saveEditDataTool() {
      // console.log('Payload sent to backend:', this.editedTool)
      this.$store.dispatch('ActionEditDataTool', this.editedTool).then(() => {
        this.$store.dispatch('ActionFetchDataTool')
      })
    },
    searchTool() {
      // Jika pencarian kosong
      if (this.search === '') {
        // Hasil pencarian diatur menjadi array kosong
        this.searchResult = []
      } else {
        // Memfilter data dari getDataTool berdasarkan input pencarian
        this.searchResult = this.getDataTool.filter((data) =>
          data.tool_nm.toLowerCase().includes(this.search.toLowerCase()),
        )
      }
    },
    showDeleteConfirmationDataTool(id) {
      this.deletedTool = id
      // console.log('id', this.deletedTool)
    },
    deleteDataTool() {
      const id = this.deletedTool
      // console.log('id', id)
      this.$store.dispatch('ActionDeleteDataTool', id).then(() => {
        this.$store.dispatch('ActionFetchDataTool')
      })
    },
  },
}
</script>

<style>
/* Add your component-specific styles here */
</style>
