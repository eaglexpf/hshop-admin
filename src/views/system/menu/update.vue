<template>
  <schema-index :uri="uri" />
</template>

<script>
import SchemaIndex from '@/components/Schema'
export default {
  name: 'SystemMenuUpdate',
  components: { SchemaIndex },
  data() {
    return {
      uri: '/system/auth/menu/template/update'
    }
  }
}
</script>

<style scoped>

</style>
