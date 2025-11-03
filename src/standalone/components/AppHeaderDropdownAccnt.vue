<template>
  <CDropdown variant="nav-item">
    <CDropdownToggle
      placement="bottom-end"
      class="py-0"
      href="javascript:void(0);"
    >
      {{ userName }}&ensp;
      <img
        v-if="photo"
        :src="photo"
        class="rounded-circle"
        style="width: 36px; height: 36px"
      />
      <CAvatar v-else color="danger" text-color="white">{{ initial }}</CAvatar>
    </CDropdownToggle>

    <CDropdownMenu class="pt-0">
      <CDropdownHeader component="h6" class="fw-semibold py-2">
        Account
      </CDropdownHeader>

      <CDropdownItem href="/#/sc/profile">
        <CIcon icon="cil-user" /> Profile
      </CDropdownItem>

      <CDropdownDivider />

      <CDropdownItem href="#" @click="logout">
        <CIcon icon="cilAccountLogout" /> Logout
      </CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { GET_USER, ACTION_LOGOUT } from '@/store/Login.module'
import avatar from '@/standalone/assets/images/avatars/8.jpg'

function generateInitialFromUsername(username) {
  if (!username) return 'AA'
  const parts = username.split('_')
  if (parts.length >= 2) {
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase()
  } else {
    return (username.charAt(0) + (username.charAt(1) || '')).toUpperCase()
  }
}

export default {
  name: 'AppHeaderDropdownAccnt',

  data() {
    return {
      photo: null,
    }
  },

  computed: {
    ...mapGetters([GET_USER]),

    userName() {
      return this[GET_USER]?.username || ''
    },

    initial() {
      return generateInitialFromUsername(this[GET_USER]?.username)
    },
  },

  setup() {
    return { avatar }
  },

  methods: {
    ...mapActions([ACTION_LOGOUT]),

    async logout() {
      try {
        await this[ACTION_LOGOUT]() // dispatch logout ke Vuex
        sessionStorage.removeItem('IS_LOGGED_IN')
        this.$store.commit('SET_USER', null)
        this.$router.push('/login')
      } catch (err) {
        console.error('Logout gagal:', err)
        this.$store.commit('SET_USER', null)
        sessionStorage.removeItem('IS_LOGGED_IN')
        this.$router.push('/login')
      }
    },
  },
}
</script>
