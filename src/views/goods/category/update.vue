<template>
  <schema-index :uri="uri" />
</template>

<script>
import SchemaIndex from '@/components/Schema'
export default {
  name: 'GoodsCategoryUpdate',
  components: { SchemaIndex },
  data() {
    return {
      uri: '/goods/category/template/update'
    }
  }
}
</script>

<style scoped>

</style>
