<template>
  <div v-if="showModal" class="modal" tabindex="-1" id="modaltoken">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body">
          <h3>Masukkan Token Khusus</h3>
          <div class="input-group">
            <input
              :type="showPassword ? 'text' : 'password'"
              class="form-control"
              v-model="userToken"
              placeholder="Masukkan token"
            />
            <span class="input-group-text" @click="togglePasswordVisibility">
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </span>
          </div>
        </div>
        <div class="modal-footer">
          <button
            class="btn btn-primary"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="submitToken"
          >
            Submit
          </button>
          <button
            class="btn btn-secondary"
            data-bs-dismiss="modal"
            @click="cancelToken"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModalToken',
  data() {
    return {
      showModal: true,
      userToken: '',
      showPassword: false, // Kontrol visibilitas password
    }
  },
  methods: {
    submitToken() {
      const validToken = 'Master#Token'
      if (this.userToken === validToken) {
        localStorage.setItem('special_token', this.userToken)
        this.$emit('token-validated', true) // Emit valid token event
        this.showModal = false
      } else {
        alert('Token tidak valid!')
        this.userToken = ''
      }
    },
    cancelToken() {
      this.$emit('token-validated', false) // Emit invalid token event
      this.showModal = false
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword // Toggle visibilitas password
    },
  },
}
</script>

<style scoped>
.modal {
  display: block; /* pastikan modal terlihat */
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1050;
}
.modal-dialog {
  position: relative;
  margin-top: 10%;
  margin-left: auto;
  margin-right: auto;
}
.modal-content {
  background-color: whitesmoke;
  border-radius: 4px;
  padding: 20px;
}
.input-group-text {
  cursor: pointer;
}
</style>
