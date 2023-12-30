<template>
  <schema-index :uri="uri" />
</template>

<script>
import SchemaIndex from '@/components/Schema'
export default {
  name: 'GoodsCategoryCreate',
  components: { SchemaIndex },
  data() {
    return {
      uri: '/goods/category/template/create'
    }
  }
}
</script>

<style scoped>

</style>
