<template>
  <div class="modal" tabindex="-1" id="modalRequestTool">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Request Tool To Tool Regrinding</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <table class="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Line</th>
                <th>OP</th>
                <th>Tool Name</th>
                <th>Quantity</th>
                <th>Notes</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in getCart" :key="item.tool_no">
                <td>{{ shortenLineName(item.line_nm) }}</td>
                <td>{{ item.op_no }}</td>
                <td>{{ item.tool_nm }}</td>
                <td>{{ item.quantity }}</td>
                <td>
                  <input
                    class="form-control"
                    v-model="item.notes"
                    type="text"
                  />
                </td>
                <td>
                  <button
                    type="button"
                    class="btn btn-danger"
                    @click="removeFromCart(item)"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
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
            @click="saveRequestTool"
            class="btn btn-primary"
            data-bs-dismiss="modal"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Tombol keranjang dengan badge -->
  <div class="container-fluid">
    <div class="card p-2 mb-2">
      <div class="d-flex justify-content-between align-items-center">
        <h4 class="text-center m-0">Request Tool To Tool Regrinding</h4>
        <button
          type="button"
          class="btn btn-primary position-relative"
          data-bs-toggle="modal"
          data-bs-target="#modalRequestTool"
        >
          <i class="fas fa-shopping-cart"></i>
          <span
            class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
          >
            {{ cartItemCount }}
          </span>
        </button>
      </div>
    </div>
  </div>

  <!-- Konten lainnya -->
  <div class="container-fluid">
    <div v-for="(tool, line) in getKanbanTool" :key="line" class="mb-3">
      <div class="card">
        <div class="card-header">
          <h5>{{ line }}</h5>
        </div>
        <div class="card-body">
          <div class="d-flex justify-content-end mb-2">
            <input
              style="width: fit-content; border: 1px solid red"
              type="search"
              class="form-control"
              v-model="searchTerms[line]"
              placeholder="Search Tool..."
              @input="searchTool(line)"
            />
          </div>

          <Carousel :itemsToShow="5" :pagination="true" :navigation="true">
            <Slide
              v-for="tool in filteredTools(line)"
              :key="tool.tool_id"
              class="p-2"
            >
              <div
                class="card cardTool custom-card-style"
                :style="getCardStyle(line)"
              >
                <div class="card-body">
                  <img
                    v-if="tool.previewUrl"
                    :src="tool.previewUrl"
                    style="width: 50%"
                  />
                  <h6 class="card-title">{{ tool.tool_nm }}</h6>
                  <p class="card-text">Op No: {{ tool.op_no }}</p>
                  <div
                    class="d-flex justify-content-between align-items-center mt-3"
                  >
                    <button @click="addToCart(tool)" class="btn btn-primary">
                      <i class="fas fa-plus"></i>
                    </button>
                    <span class="quantity">{{ getQuantity(tool) }}</span>
                    <button
                      @click="removeFromCart(tool)"
                      class="btn btn-secondary"
                    >
                      <i class="fas fa-minus"></i>
                    </button>
                  </div>
                </div>
              </div>
            </Slide>
            <template #addons>
              <Navigation />
            </template>
          </Carousel>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Navigation } from 'vue3-carousel'

export default {
  name: 'KanbanToToolReg',
  components: {
    Carousel,
    Slide,
    Navigation,
  },

  data() {
    return {
      searchTerms: {},
    }
  },

  computed: {
    ...mapGetters(['getKanbanTool', 'getCart']),

    cartItemCount() {
      return this.getCart.reduce((total, item) => total + item.quantity, 0)
    },

    filteredTools() {
      return (line) => {
        const searchTerm = this.searchTerms[line]?.toLowerCase() || ''
        if (!searchTerm) return this.getKanbanTool[line]

        return this.getKanbanTool[line].filter(
          (tool) => tool.tool_nm.toLowerCase().match(searchTerm.toLowerCase()),
          // tool.tool_nm.toLowerCase().startsWith(searchTerm),
        )
      }
    },
  },

  mounted() {
    this.$store.dispatch('fetchMasterLine')
    this.$store.dispatch('ActionFetchDataTool')
    this.$store.dispatch('fectDataKanbanTool')
  },

  methods: {
    ...mapActions([
      'addToCart',
      'removeFromCart',
      'clearCart',
      'resetToolQuantities',
    ]),

    getQuantity(tool) {
      const cartItem = this.getCart.find(
        (item) => item.tool_id === tool.tool_id,
      )
      return cartItem ? cartItem.quantity : 0
    },

    shortenLineName(lineName) {
      // Contoh logika untuk mempersingkat nama line
      switch (lineName) {
        case 'Cylinder Block':
          return 'C/B'
        case 'Cylinder Head':
          return 'C/H'
        case 'Crank Shaft':
          return 'C/S'
        case 'Cam Shaft':
          return 'Cam'
        // Tambahkan case untuk line names lainnya jika perlu
        default:
          return lineName // Jika tidak ada perubahan, kembalikan nama asli
      }
    },

    saveRequestTool() {
      try {
        const data = this.getCart.map((item) => ({
          tool_id: item.tool_id,
          line_id: item.line_id,
          line_nm: item.line_nm,
          tool_no: item.tool_no,
          tool_nm: item.tool_nm,
          op_no: item.op_no,
          quantity: item.quantity,
          notes: item.notes || '', // Pastikan catatan ditambahkan ke Vuex store Anda
        }))

        console.log('data', data)
        this.$store.dispatch('ActionSaveRequestTool', data)
        // Clear the cart and reset tool quantities
        this.clearCart()
        this.resetToolQuantities()
      } catch (error) {
        console.log(error)
      }
    },

    searchTool(line) {
      // This will trigger the computed property to filter tools
      this.$forceUpdate()
    },
    getBackgroundColor(line) {
      // Define colors for each line
      const colors = {
        'Cylinder Block': '#FFFF00',
        'Cylinder Head': '##008000',
        'Crank Shaft': '#FF0000',
        'Cam Shaft': '#0000FF',
        // Add more colors for other lines as needed
      }
      return colors[line] || '#ffffff' // Default color if line is not defined
    },

    getCardStyle(line) {
      return `background-color: ${this.getBackgroundColor(line)} !important`
    },
  },
}
</script>

<style scoped>
.container-fluid {
  padding: 20px;
}

.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.card-body {
  padding: 10px;
}

.card-title {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.card-text {
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.custom-card-style {
  width: 100%;
}

.quantity {
  display: inline-block;
  width: 30px;
  text-align: center;
  font-size: large;
  font-weight: bold;
}

.img-fluid {
  width: 100%;
  height: auto;
}

.card {
  transition: transform 0.3s ease;
}

.cardTool:hover {
  transform: translateY(-5px);
}

.btn-primary {
  background-color: #ff0055;
  border-color: #ff0055;
}

.btn-secondary {
  background-color: #6c757d;
  border-color: #6c757d;
}

.btn-primary:hover,
.btn-primary:focus {
  background-color: #0056b3;
  border-color: #0056b3;
}

.btn-secondary:hover,
.btn-secondary:focus {
  background-color: #545b62;
  border-color: #545b62;
}
.cardToolStyle {
  background-color: #0056b3 !important;
}
</style>
