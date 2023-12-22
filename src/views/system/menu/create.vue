<template>
  <schema-index :uri="uri" />
</template>

<script>
import SchemaIndex from '@/components/Schema'
export default {
  name: 'SystemMenuCreate',
  components: { SchemaIndex },
  data() {
    return {
      uri: '/system/auth/menu/template/create'
    }
  }
}
</script>

<style scoped>

</style>
