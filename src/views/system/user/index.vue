<template>
  <SchemaIndex v-if="$route.matched.length === 2" :uri="uri" />
  <router-view v-else />
</template>

<script>
import SchemaIndex from '@/components/Schema/index'
export default {
  name: 'SystemUserList',
  components: { SchemaIndex },
  data() {
    return {
      uri: '/system/auth/user/schema/list'
    }
  }
}
</script>

<style scoped>

</style>
