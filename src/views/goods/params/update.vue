<template>
  <schema-index :uri="uri" />
</template>

<script>
import SchemaIndex from '@/components/Schema'
export default {
  name: 'GoodsParamsUpdate',
  components: { SchemaIndex },
  data() {
    return {
      uri: '/goods/params/template/update'
    }
  }
}
</script>

<style scoped>

</style>
