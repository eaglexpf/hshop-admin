<template>
  <div>
    <el-button
      :class="schema.btn.class ? schema.btn.class : ''"
      :style="schema.btn.style ? schema.btn.style : ''"
      :type="schema.btn.type ? schema.btn.type : 'primary'"
      :icon="schema.btn.icon ? schema.btn.icon : ''"
      :size="schema.btn.size ? schema.btn.size : ''"
      @click="dialogClick"
    >
      {{ schema.btn.title }}
    </el-button>
    <el-table
      :data="selectRows"
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
      <el-table-column label="操作" align="center">
        <template slot-scope="{row}">
          <el-button type="danger" size="mini" @click="delSelectRows(row)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      width="75%"
      class="store-dialog"
      :title="schema.title"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :before-close="closeDialog"
      append-to-body
    >
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
        ref="multipleTable"
        v-loading="loading"
        :data="tableData"
        :default-expand-all="true"
        :row-key="row => { return row[tableRowKey].toString()}"
        border
        fit
        highlight-current-row
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          align="center"
          :reserve-selection="true"
          width="50"
        />
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

      </el-table>

      <pagination v-show="tableTotal>0" :align="'center'" :total="tableTotal" :page.sync="tableQuery.page" :limit.sync="tableQuery.page_size" @pagination="getTableData" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="saveDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/utils/request'
import Pagination from '@/components/Pagination'

export default {
  name: 'SchemaDialogTable',
  components: { Pagination },
  props: {
    dialogSchema: {
      type: Object,
      default() {
        return {}
      }
    },
    dialogRelData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      // schema
      schema: {},
      headerSchema: {},
      headerFiltersSchema: {},
      headerActionsSchema: {},
      tableSchema: {},
      tableColumnsSchema: {},
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
      tableTotal: 0,
      // dialog
      dialogVisible: false,
      multipleSelection: [],
      selectRows: [],
      selection: []
    }
  },
  watch: {
    dialogSchema: {
      immediate: true,
      handler(val) {
        this.schema = val
        this.setSchema()
      }
    },
    dialogRelData: {
      immediate: true,
      handler(val) {
        if (val.length > 0) {
          this.getSelectRows(val)
        }
      }
    }
  },
  methods: {
    setSchema() {
      if (this.schema.dialog.header) {
        this.headerSchema = this.schema.dialog.header
      }
      if (this.schema.dialog.table) {
        this.tableSchema = this.schema.dialog.table
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
      if (this.tableURI) {
        this.getTableData()
      }
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
          this.toggleRowSelection()
        }
        this.loading = false
      })
    },
    async getSelectRows(val) {
      const requestData = {
        url: this.tableURI,
        method: this.tableMethod
      }
      switch (requestData.method) {
        case 'get':
          requestData.params = {
            page_size: -1
          }
          requestData.params[this.tableRowKey] = val
          break
        case 'post':
          requestData.data = {
            page_size: -1
          }
          requestData.data[this.tableRowKey] = val
          break
      }
      request(requestData).then(res => {
        if (res['code'] === 0) {
          this.selectRows = res.data.list
        }
      })
    },
    delSelectRows(val) {
      this.selectRows = [...this.selectRows.filter(row => row[this.tableRowKey] !== val[this.tableRowKey])]
    },
    handleActions(item) {
      this.requestActions(item, this.tableQuery)
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
          if (row[queryItem]) {
            queryData[queryItem] = row[queryItem]
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
        if (res['code'] === 0 && item.url['refresh']) {
          this.getTableData()
        } else if (res['code'] === 0 && item['is_search']) {
          this.tableData = res.data.list
          this.tableTotal = res.data.total
          this.toggleRowSelection()
          this.loading = false
        } else {
          this.loading = false
        }
      })
    },
    dialogClick() {
      this.multipleSelection = [...this.selectRows]
      this.dialogVisible = true
      this.$nextTick(() => {
        this.toggleRowSelection()
      })
    },
    toggleRowSelection() {
      if (this.$refs.multipleTable) {
        const multipleTable = []
        this.multipleSelection.forEach(row => {
          multipleTable.push(row[this.tableRowKey])
        })
        this.selection = []
        this.$refs.multipleTable.clearSelection()
        this.tableData.forEach(row => {
          if (multipleTable.indexOf(row[this.tableRowKey]) > -1) {
            this.$refs.multipleTable.toggleRowSelection(row)
            this.selection.push(row)
          }
        })
      }
    },
    handleSelectionChange(val) {
      // 删除取消勾选的
      const selectionVal = []
      const delData = []
      val.forEach(row => {
        selectionVal.push(row[this.tableRowKey])
      })
      this.selection.forEach(row => {
        if (selectionVal.indexOf(row[this.tableRowKey]) === -1) {
          delData.push(row[this.tableRowKey])
        }
      })
      this.multipleSelection = [...this.multipleSelection.filter(row => delData.indexOf(row[this.tableRowKey]) === -1)]
      // 添加新选中的
      const multipleTable = []
      this.multipleSelection.forEach(row => {
        multipleTable.push(row[this.tableRowKey])
      })
      val.forEach(row => {
        if (multipleTable.indexOf(row[this.tableRowKey]) === -1) {
          this.multipleSelection.push(row)
        }
      })
      this.selection = val
    },
    closeDialog() {
      this.multipleSelection = []
      this.$refs.multipleTable.clearSelection()
      this.dialogVisible = false
    },
    saveDialog() {
      this.selectRows = [...this.multipleSelection]
      const dialogData = []
      this.selectRows.forEach(row => {
        if (row[this.tableRowKey]) {
          dialogData.push(row[this.tableRowKey])
        }
      })
      this.$emit('check-change', dialogData)
      this.closeDialog()
    }
  }
}
</script>

<style scoped>

</style>
