<template>
  <schema-index :uri="uri" />
</template>

<script>
import SchemaIndex from '@/components/Schema'
export default {
  name: 'SystemRoleCreate',
  components: { SchemaIndex },
  data() {
    return {
      uri: '/system/auth/role/template/create'
    }
  }
}
</script>

<style scoped>

</style>
