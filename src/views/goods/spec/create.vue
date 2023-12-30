<template>
  <schema-index :uri="uri" />
</template>

<script>
import SchemaIndex from '@/components/Schema'
export default {
  name: 'GoodsSpecCreate',
  components: { SchemaIndex },
  data() {
    return {
      uri: '/goods/spec/template/create'
    }
  }
}
</script>

<style scoped>

</style>
