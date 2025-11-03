<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Login</h2>
      <!-- LOGIN FORM -->
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label for="username">Username:</label>
          <input
            type="text"
            v-model="username"
            id="username"
            placeholder="Username"
            required
          />
        </div>

        <div class="input-group password-container">
          <label for="password">Password:</label>
          <div class="input-wrapper">
            <input
              :type="passwordVisible ? 'text' : 'password'"
              v-model="password"
              id="password"
              placeholder="Password"
              required
            />
            <button
              type="button"
              @click="togglePasswordVisibility"
              class="toggle-password"
            >
              <i
                :class="passwordVisible ? 'fas fa-eye-slash' : 'fas fa-eye'"
              ></i>
            </button>
          </div>
        </div>

        <button type="submit">Login</button>

        <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
        <p v-if="successMsg" class="success">{{ successMsg }}</p>
      </form>

      <!-- LINK REGISTER -->
      <p style="text-align: center; margin-top: 15px">
        Belum punya akun?
        <a href="#" @click.prevent="showRegister = !showRegister">
          Daftar di sini
        </a>
      </p>

      <!-- bagian REGISTER FORM -->
      <div v-if="showRegister" class="register-box">
        <h3>Register User Baru</h3>
        <div class="input-group">
          <label>Username baru:</label>
          <input v-model="regUsername" placeholder="Username baru" />
        </div>
        <div class="input-group">
          <label>Password baru:</label>
          <input
            type="password"
            v-model="regPassword"
            placeholder="Password baru"
          />
        </div>
        <div class="input-group">
          <label>Role:</label>
          <select v-model="regRole" class="styled-select">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div class="input-group">
          <label>Admin Username:</label>
          <input v-model="adminUsername" placeholder="Username admin" />
        </div>
        <div class="input-group">
          <label>Admin Password:</label>
          <input
            type="password"
            v-model="adminPassword"
            placeholder="Password admin"
          />
        </div>
        <button @click="handleRegister">Register User</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { ACTION_LOGIN, ACTION_REGISTER, GET_USER } from '@/store/Login.module'
import axios from 'axios'

export default {
  name: 'LoginPage',
  data() {
    return {
      username: '',
      password: '',
      passwordVisible: false,
      errorMsg: '',
      successMsg: '',
      loading: false,

      showRegister: false,
      regUsername: '',
      regPassword: '',
      adminUsername: '',
      adminPassword: '',
      regRole: 'user',
    }
  },
  computed: {
    ...mapGetters([GET_USER]),
    isLoggedIn() {
      return !!this.getUser || sessionStorage.getItem('IS_LOGGED_IN') === 'true'
    },
  },
  watch: {
    isLoggedIn(newVal) {
      if (newVal) this.$router.push('/app/dashboard')
    },
  },
  methods: {
    ...mapActions([ACTION_LOGIN]),

    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible
    },

    async handleLogin() {
      this.errorMsg = ''
      this.successMsg = ''
      this.loading = true
      try {
        const res = await this.$store.dispatch(ACTION_LOGIN, {
          username: this.username,
          password: this.password,
        })

        sessionStorage.setItem('IS_LOGGED_IN', 'true')
        this.successMsg = 'Login berhasil!'
        this.$router.push('/app/dashboard')
      } catch (err) {
        this.errorMsg = err.message || 'Login gagal.'
      } finally {
        this.loading = false
      }
    },

    async handleRegister() {
      this.errorMsg = ''
      this.successMsg = ''

      if (
        !this.regUsername ||
        !this.regPassword ||
        !this.adminUsername ||
        !this.adminPassword
      ) {
        this.errorMsg = 'Semua field harus diisi.'
        return
      }

      try {
        // 1️⃣ Validasi login admin
        const adminRes = await this.$store.dispatch(ACTION_LOGIN, {
          username: this.adminUsername,
          password: this.adminPassword,
        })

        if (adminRes?.data.user?.role !== 'admin') {
          this.errorMsg = 'Hanya admin yang bisa membuat user baru.'
          return
        }

        // 2️⃣ Register user baru via Vuex action
        const res = await this.$store.dispatch(ACTION_REGISTER, {
          username: this.regUsername,
          password: this.regPassword,
          role: this.regRole,
        })

        this.successMsg = res.message || 'User baru berhasil dibuat.'
        this.errorMsg = ''

        // reset form
        this.regUsername = ''
        this.regPassword = ''
        this.adminUsername = ''
        this.adminPassword = ''
        this.regRole = 'user'
        this.showRegister = false
      } catch (err) {
        this.errorMsg = err.response?.data?.message || 'Gagal register.'
        this.successMsg = ''
      }
    },
  },
  mounted() {
    if (this.isLoggedIn) {
      this.$router.push('/app/dashboard')
    }
  },
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: above;
  min-height: 50vh;
  padding: 0 20px;
}

.login-box,
.register-box {
  background: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  margin-bottom: 20px;
}

h2,
h3 {
  text-align: center;
  margin-bottom: 20px;
}

.input-group {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

.input-wrapper {
  position: relative;
}

.input-wrapper input {
  width: 100%;
  padding-right: 40px;
}

.toggle-password {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #555;
}

.toggle-password:hover {
  color: #007bff;
}

input {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  outline: none;
}

button[type='submit'],
.register-box button {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button[type='submit']:hover,
.register-box button:hover {
  background-color: #0056b3;
}

.error {
  color: #e74c3c;
  text-align: center;
}

.success {
  color: #2ecc71;
  text-align: center;
}
.styled-select {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  outline: none;
  appearance: none; /* hilangkan arrow default di beberapa browser */
}
</style>
