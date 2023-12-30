<template>
  <schema-index :uri="uri" />
</template>

<script>
import SchemaIndex from '@/components/Schema'
export default {
  name: 'GoodsBrandUpdate',
  components: { SchemaIndex },
  data() {
    return {
      uri: '/goods/brand/template/update'
    }
  }
}
</script>

<style scoped>

</style>
