<template>
  <schema-index :uri="uri" />
</template>

<script>
import SchemaIndex from '@/components/Schema'
export default {
  name: 'GoodsBrandCreate',
  components: { SchemaIndex },
  data() {
    return {
      uri: '/goods/brand/template/create'
    }
  }
}
</script>

<style scoped>

</style>
