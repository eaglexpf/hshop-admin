<template>
  <div class="app-container">
    <div class="filter-container">
      <template v-for="(item, index) in headerFiltersSchema">
        <el-input
          :key="index"
          v-model="tableQuery[index]"
          :type="item.type ? item.type : 'input'"
          :placeholder="item.placeholder ? item.placeholder : ''"
          :style="item.style ? item.style : 'width: 200px;'"
          :class="item.class ? item.class : 'filter-item'"
          :clearable="item.clearable ? item.clearable : false"
          @keyup.enter.native="getTableData"
        />
      </template>

      <el-button
        v-for="(item, index) in headerActionsSchema"
        :key="index"
        :class="item.class ? item.class : 'filter-item'"
        :style="item.style ? item.style : ''"
        :type="item.type ? item.type : 'primary'"
        :icon="item.icon ? item.icon : ''"
        :size="item.size ? item.size : ''"
        @click="handleActions(item)"
      >
        {{ item.title }}
      </el-button>
    </div>

    <el-table
      ref="dragTable"
      v-loading="loading"
      :data="tableData"
      :default-expand-all="true"
      :row-key="row => { return row[tableRowKey].toString()}"
      border
      fit
      highlight-current-row
    >

      <el-table-column
        v-for="(item, index) in tableColumnsSchema"
        :key="index"
        :align="item.align ? item.align : ''"
        :class-name="item.class ? item.class : ''"
        :width="item.width ? item.width : ''"
        :label="item.title"
      >
        <template slot-scope="{row}">
          <el-image v-if="item.type === 'avatar'" class="img-circle" :src="row[index]">
            <div slot="placeholder" class="image-slot">
              加载中<span class="dot">...</span>
            </div>
          </el-image>
          <el-image v-else-if="item.type === 'image'" :src="row[index]">
            <div slot="placeholder" class="image-slot">
              加载中<span class="dot">...</span>
            </div>
          </el-image>
          <template v-else-if="item.type === 'tag'">
            <el-tag v-if="item.tag && item.tag[row[index]]" :type="item.tag[row[index]].type">{{ item.tag[row[index]].message }}</el-tag>
          </template>
          <span v-else>{{ row[index] }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="tableActionsSchema" label="操作" align="center" width="260" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button
            v-for="(item, index) in tableActionsSchema"
            :key="index"
            :class="item.class ? item.class : 'filter-item'"
            :style="item.style ? item.style : ''"
            :type="item.type ? item.type : 'primary'"
            :icon="item.icon ? item.icon : ''"
            :size="item.size ? item.size : 'mini'"
            @click="tableActions(item, row)"
          >
            {{ item.title }}
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="tableTotal>0" :align="'center'" :total="tableTotal" :page.sync="tableQuery.page" :limit.sync="tableQuery.page_size" @pagination="getTableData" />

  </div>
</template>

<script>
import request from '@/utils/request'
import Pagination from '@/components/Pagination'

export default {
  name: 'SchemaTableIndex',
  components: { Pagination },
  props: {
    schema: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      // schema
      headerSchema: {},
      headerFiltersSchema: {},
      headerActionsSchema: {},
      tableSchema: {},
      tableColumnsSchema: {},
      tableActionsSchema: {},
      // base
      loading: false,
      tableURI: '',
      tableRowKey: 'id',
      tableMethod: 'get',
      tableQuery: {
        page: 1,
        page_size: 20
      },
      tableData: [],
      tableTotal: 0
    }
  },
  mounted() {
    if (this.schema.header) {
      this.headerSchema = this.schema.header
    }
    if (this.schema.table) {
      this.tableSchema = this.schema.table
    }
    if (this.headerSchema.filter) {
      this.headerFiltersSchema = this.headerSchema.filter
    }
    if (this.headerSchema.actions) {
      this.headerActionsSchema = this.headerSchema.actions
    }
    if (this.tableSchema.url) {
      this.tableURI = this.tableSchema.url.const
    }
    if (this.tableSchema.method) {
      this.tableMethod = this.tableSchema.url.method
    }
    if (this.tableSchema.page) {
      this.tableQuery.page = this.tableSchema.page
    }
    if (this.tableSchema.page_size) {
      this.tableQuery.page_size = this.tableSchema.page_size
    }
    if (this.tableSchema.key) {
      this.tableRowKey = this.tableSchema.key
    }
    if (this.tableSchema.columns) {
      this.tableColumnsSchema = this.tableSchema.columns
    }
    if (this.tableSchema.actions) {
      this.tableActionsSchema = this.tableSchema.actions
    }
    if (this.tableURI) {
      this.getTableData()
    }
  },
  methods: {
    async getTableData() {
      this.loading = true
      const requestData = {
        url: this.tableURI,
        method: this.tableMethod
      }
      switch (requestData.method) {
        case 'get':
          requestData.params = this.tableQuery
          break
        case 'post':
          requestData.data = this.tableQuery
          break
      }
      request(requestData).then(res => {
        if (res['code'] === 0) {
          this.tableData = res.data.list
          this.tableTotal = res.data.total
        }
        this.loading = false
      })
    },
    handleActions(item) {
      this.tableActions(item, this.tableQuery)
    },
    tableActions(item, row) {
      if (item['jump']) {
        // 跳转到新页面
        this.jumpActions(item, row)
      } else if (item['confirm']) {
        this.$confirm(item['confirm']['message'], item['confirm']['title'], {
          confirmButtonText: item['confirm']['confirmButtonText'] ? item['confirm']['confirmButtonText'] : '确定',
          cancelButtonText: item['confirm']['cancelButtonText'] ? item['confirm']['cancelButtonText'] : '取消',
          type: item['confirm']['type'] ? item['confirm']['type'] : 'warning'
        }).then(() => {
          // 在当前页面请求接口
          this.requestActions(item, row)
        })
      } else {
        // 在当前页面请求接口
        this.requestActions(item, row)
      }
    },
    jumpActions(item, row) {
      const routerData = {
        path: item.url.const
      }
      if (item.url.query) {
        const queryData = {}
        for (const index in item.url.query) {
          const queryItem = item.url.query[index]
          if (row[index]) {
            queryData[queryItem] = row[index]
          }
        }
        if (queryData) {
          routerData.query = queryData
        }
      }
      this.$router.push(routerData)
    },
    async requestActions(item, row) {
      this.loading = true
      const requestData = {
        url: item.url.const,
        method: 'get'
      }
      if (item.url.method) {
        requestData.method = item.url.method
      }
      if (item.url.query) {
        const queryData = {}
        for (const index in item.url.query) {
          const queryItem = item.url.query[index]
          if (row[index]) {
            queryData[queryItem] = row[index]
          }
        }
        switch (requestData.method) {
          case 'get':
            requestData.params = queryData
            break
          case 'post':
            requestData.data = queryData
            break
        }
      }
      request(requestData).then(res => {
        if (res['code'] === 0 && item.url['notice'] && item.url['notice'].success) {
          this.$notify({
            title: item.url['notice'].success.title ? item.url['notice'].success.title : 'error',
            message: item.url['notice'].success.message ? item.url['notice'].success.message : res['msg'],
            type: item.url['notice'].success.type ? item.url['notice'].success.type : 'success',
            duration: item.url['notice'].success.duration ? item.url['notice'].success.duration : 2000,
            onClose: () => {
              this.loading = false
              if (item.url['notice'].success.refresh !== false) {
                this.getTableData()
              }
            }
          })
        } else if (res['code'] !== 0 && item.url['notice'] && item.url['notice'].error) {
          this.$notify({
            title: item.url['notice'].error.title ? item.url['notice'].error.title : 'error',
            message: item.url['notice'].error.message ? item.url['notice'].error.message : res['msg'],
            type: item.url['notice'].error.type ? item.url['notice'].error.type : 'error',
            duration: item.url['notice'].error.duration ? item.url['notice'].error.duration : 2000,
            onClose: () => {
              this.loading = false
              if (item.url['notice'].error.refresh !== false) {
                this.getTableData()
              }
            }
          })
        } else if (res['code'] === 0 && item.url['refresh']) {
          this.getTableData()
        } else if (res['code'] === 0 && item['is_search']) {
          this.tableData = res.data.list
          this.tableTotal = res.data.total
          this.loading = false
        } else {
          this.loading = false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
