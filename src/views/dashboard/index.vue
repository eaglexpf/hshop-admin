<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ user.user_name }}</div>
  </div>
</template>

<script>
import store from '@/store'

export default {
  name: 'Dashboard',
  computed: {
    user: () => {
      return store.getters.user
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
