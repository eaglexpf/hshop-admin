<template>
  <router-view v-if="$route.meta['routerView']" />
  <SchemaIndex v-else :uri="uri" />
</template>

<script>
import SchemaIndex from '@/components/Schema/index'
export default {
  name: 'SystemRoleList',
  components: { SchemaIndex },
  data() {
    return {
      uri: '/system/auth/role/template/list'
    }
  }
}
</script>

<style scoped>

</style>
