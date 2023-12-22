<template>
  <router-view v-if="$route.meta['routerView']" />
  <SchemaIndex v-else :uri="uri" />
</template>

<script>
import SchemaIndex from '@/components/Schema/index'
export default {
  name: 'SystemMenuList',
  components: { SchemaIndex },
  data() {
    return {
      uri: '/system/auth/menu/template/list'
    }
  }
}
</script>

<style scoped>

</style>
