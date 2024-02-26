<template>
  <div class="app-container">
    <el-button
      v-for="(item, index) in headerActionsSchema"
      :key="index"
      :class="item.class ? item.class : 'filter-item'"
      :style="item.style ? item.style : ''"
      :type="item.type ? item.type : 'primary'"
      :icon="item.icon ? item.icon : ''"
      :size="item.size ? item.size : 'small'"
      @click="handleActions(item)"
    >
      {{ item.title }}
    </el-button>
    <div v-if="hasFilter" :class="filterBoxClass">
      <div ref="schema_filter_items" class="schema-filter-items">
        <div ref="schema_filter_form_box">
          <el-form ref="filterForm" :inline="true">

            <el-form-item v-for="(item, index) in headerFiltersSchema" :key="index" :label="item.title ? item.title : ''" class="schema-filter-items-form-item">
              <el-select
                v-if="item.type === 'select'"
                :key="index"
                v-model="tableQuery[index]"
                :placeholder="item.placeholder ? item.placeholder : ''"
                :style="item.style ? item.style : ''"
                :class="item.class ? item.class : ''"
                :clearable="item.clearable ? item.clearable : false"
              >
                <el-option
                  v-for="option in item.options"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
              <el-input
                v-else
                :key="index"
                v-model="tableQuery[index]"
                :type="item.type ? item.type : 'input'"
                :placeholder="item.placeholder ? item.placeholder : ''"
                :style="item.style ? item.style : ''"
                :class="item.class ? item.class : ''"
                :clearable="item.clearable ? item.clearable : false"
              />
            </el-form-item>
          </el-form>
        </div>

      </div>
      <div class="schema-filter-actions">
        <div class="schema-filter-actions-btn">
          <el-button type="primary" size="small" icon="el-icon-search" @click="handleFilter">查询</el-button>
          <el-button type="primary" size="small" icon="el-icon-refresh-left" @click="resetFilterForm">重置</el-button>
        </div>
        <div v-if="showExtend" class="schema-filter-actions-extend">
          <el-button type="text" :class="extend ? 'el-icon-arrow-down' : 'el-icon-arrow-up'" @click="handleExtend">{{ extend ? '展开' : '收起' }}</el-button>
        </div>
      </div>
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
        :fixed="item.fixed ? item.fixed: false"
      >
        <template slot-scope="{row}">
          <el-image v-if="item.type === 'avatar'" class="img-circle" :src="row[index]">
            <div slot="placeholder" class="image-slot">
              加载中<span class="dot">...</span>
            </div>
          </el-image>
          <el-image v-else-if="item.type === 'image'" class="table-image" :src="row[index]">
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

      <el-table-column v-if="tableActionsSchema" label="操作" width="260" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button
            v-for="(item, index) in tableActionsSchema"
            v-show="tableActionShow(item, row)"
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
import { isEmptyObject } from '@/utils'

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
      // filter
      hasFilter: false,
      extend: true,
      showExtend: false,
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
  computed: {
    filterBoxClass() {
      return {
        'schema-filter': true,
        'schema-filter-extend': this.extend
      }
    }
  },
  created() {
    window.onresize = () => {
      this.checkShowExtend()
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
      this.hasFilter = !isEmptyObject(this.headerFiltersSchema)
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
    this.$nextTick(() => {
      this.checkShowExtend()
    })
  },
  methods: {
    handleExtend() {
      this.extend = !this.extend
    },
    resetFilterForm() {
      this.$refs['filterForm'].resetFields()
      this.tableQuery.page = 1
      this.getTableData()
    },
    checkShowExtend() {
      if (!this.hasFilter) {
        return false
      }
      const weight = this.$refs.schema_filter_items.clientWidth
      let lineWeight = 0
      let row = 1
      this.$refs.filterForm.$children.forEach((value) => {
        lineWeight += value.$el.clientWidth + 30
        if (lineWeight > weight) {
          row++
          lineWeight = value.$el.clientWidth + 30
        }
      })
      this.showExtend = row > 2
    },
    handleFilter() {
      this.tableQuery.page = 1
      this.getTableData()
    },
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
    tableActionShow(item, row) {
      if (item['vShow']) {
        // eslint-disable-next-line no-eval
        item['vShow'] = eval(item['vShow'])
        return item['vShow'](row)
      }
      return true
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

<style lang="scss" scoped>
.table-image {
  width: 70px;
}
.schema-filter{
  padding-top: 15px;
  margin: 10px 0 15px 0;
  overflow: hidden;
  background-color: #f6f7f9;
  display: flex;
}
.schema-filter-extend{
  max-height: 120px;
}
.schema-filter-items{
  padding: 0;
  margin: 0;
  flex: 1;
  flex-wrap: wrap;
  display: flex;
}
.schema-filter-items-form-item{
  margin: 0 0 10px 30px;
}
.schema-filter-actions{
  width: 180px;
  margin: 0 20px 20px auto;
.el-button + .el-button {
  margin-top: 0;
}
}
.schema-filter-actions-btn{
  text-align: right;
}
.schema-filter-actions-extend{
  margin: 10px 0 0 20px;
}
</style>
