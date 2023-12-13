<template>
  <schema-index :uri="uri" />
</template>

<script>
import SchemaIndex from '@/components/Schema'
export default {
  name: 'SystemRoleUpdate',
  components: { SchemaIndex },
  data() {
    return {
      uri: '/system/auth/role/template/update'
    }
  }
}
</script>

<style scoped>

</style>
