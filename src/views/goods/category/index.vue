<template>
  <router-view v-if="$route.meta['routerView']" />
  <SchemaIndex v-else :uri="uri" />
</template>

<script>
import SchemaIndex from '@/components/Schema/index'
export default {
  name: 'GoodsCategoryList',
  components: { SchemaIndex },
  data() {
    return {
      uri: '/goods/category/template/list'
    }
  }
}
</script>

<style scoped>

</style>
