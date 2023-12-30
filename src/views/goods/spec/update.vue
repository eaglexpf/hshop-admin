<template>
  <schema-index :uri="uri" />
</template>

<script>
import SchemaIndex from '@/components/Schema'
export default {
  name: 'GoodsSpecUpdate',
  components: { SchemaIndex },
  data() {
    return {
      uri: '/goods/spec/template/update'
    }
  }
}
</script>

<style scoped>

</style>
