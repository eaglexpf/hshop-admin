<template>
  <router-view v-if="$route.meta['routerView']" />
  <SchemaIndex v-else :uri="uri" />
</template>

<script>
import SchemaIndex from '@/components/Schema/index'
export default {
  name: 'SystemUserList',
  components: { SchemaIndex },
  data() {
    return {
      uri: '/system/auth/user/template/list'
    }
  },
  mounted() {
    console.log(this.$route)
  }
}
</script>

<style scoped>

</style>
