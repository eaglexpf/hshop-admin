<template>
  <div v-loading="loading" style="min-height: 500px">
    <schema-table-index v-if="showTable" :schema="schemaData" />
    <schema-form-index v-if="showForm" :schema="schemaData" />
  </div>

</template>

<script>
import request from '@/utils/request'
import SchemaFormIndex from '@/components/Schema/form'
import SchemaTableIndex from '@/components/Schema/table'
export default {
  name: 'SchemaIndex',
  components: {
    SchemaTableIndex,
    SchemaFormIndex
  },
  props: {
    uri: {
      type: String,
      default: ''
    },
    schema: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      loading: false,
      showTable: false,
      showForm: false,
      schemaData: {}
    }
  },
  watch: {
    uri(val) {
      if (val) {
        this.getSchemaByURI()
      }
    }
  },
  mounted() {
    if (this.uri) {
      this.getSchemaByURI()
    } else {
      this.setSchema(this.schema)
    }
  },
  methods: {
    async getSchemaByURI() {
      this.loading = true
      const { data } = await this.apiGetSchema()
      this.setSchema(data)
      this.loading = false
    },
    apiGetSchema() {
      return request({
        url: this.uri,
        method: 'get'
      })
    },
    setSchema(data) {
      switch (data.type) {
        case 'table':
          this.showTable = true
          break
        case 'form':
          this.showForm = true
          break
      }
      this.schemaData = data
    }
  }
}
</script>

<style scoped>

</style>
