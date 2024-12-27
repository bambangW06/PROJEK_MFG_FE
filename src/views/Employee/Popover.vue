<template>
  <div
    class="card"
    v-if="visible"
    :style="{ position: 'absolute', top: position.top, left: position.left }"
  >
    <div class="popover-title" style="text-align: center">
      {{ position.label }}
    </div>
    <div
      v-for="(item, index) in position.content"
      :key="index"
      class="popover-item"
    >
      {{ item }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    position: Object,
    visible: Boolean,
  },
}
</script>

<style scoped>
.popover-title {
  font-weight: bold;
  margin-bottom: 5px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 5px;
  background-color: #f0f0f0;
}
</style>
