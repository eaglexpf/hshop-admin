<template>
  <schema-index :uri="uri" />
</template>

<script>
import SchemaIndex from '@/components/Schema'
export default {
  name: 'GoodsParamsCreate',
  components: { SchemaIndex },
  data() {
    return {
      uri: '/goods/params/template/create'
    }
  }
}
</script>

<style scoped>

</style>
