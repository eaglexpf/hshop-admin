<template>
  <schema-index :uri="uri" />
</template>

<script>
import SchemaIndex from '@/components/Schema'
import { isEmptyObject } from '@/utils'
export default {
  name: 'SystemUserEdit',
  components: { SchemaIndex },
  data() {
    return {
      uri: ''
    }
  },
  mounted() {
    if (isEmptyObject(this.$route.query)) {
      this.uri = '/system/auth/user/template/create'
    } else {
      this.uri = '/system/auth/user/template/update'
    }
  }
}
</script>

<style scoped>

</style>
