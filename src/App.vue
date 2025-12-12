<template>
  <router-view />
</template>

<script>
export default {
  name: 'App',

  created() {
    // Cek session tiap kali halaman di-refresh
    this.$store.dispatch('auth/ACTION_CHECK_SESSION')
  },
}
</script>
<!-- 
<style lang="scss">
// Import Main styles for this application
//@import 'styles/style';
@import 'styles/custom';
</style>
-->
