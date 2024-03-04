<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加商品
      </el-button>
    </div>
    <div class="schema-filter schema-filter-extend">
      <div ref="schema_filter_items" class="schema-filter-items">
        <div ref="schema_filter_form_box">
          <el-form ref="filterForm" :inline="true">
            <el-form-item label="商品名称" class="schema-filter-items-form-item">
              <el-input v-model="tableQuery.spu_name" type="input" placeholder="请输入商品名称" clearable />
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
        fixed="right"
        label="操作"
        width="100"
      >
        <template slot-scope="{row}">
          <el-button type="text" size="small" @click="handleUpdate(row)">编辑</el-button>
          <el-button v-if="row.status === 'on_sale'" type="text" size="small" @click="handleUpdateSome(row, { status: 'off_sale' }, '确定要下架商品: ' + row.spu_name)">下架</el-button>
          <el-button v-else type="text" size="small" @click="handleUpdateSome(row, { status: 'on_sale' }, '确定要上架商品: ' + row.spu_name)">上架</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="spu_name" label="商品名称" />
      <el-table-column align="center" label="商品状态">
        <template slot-scope="{row}">
          <el-tag v-if="row.status === 'on_sale'" type="success">上架</el-tag>
          <el-tag v-else-if="row.status === 'off_sale'" type="warning">下架</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品缩略图">
        <template slot-scope="{row}">
          <el-image class="table-image" :src="row.spu_thumb">
            <div slot="placeholder" class="image-slot">
              加载中<span class="dot">...</span>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="price_min" label="商品价格" />
    </el-table>

    <pagination v-show="tableTotal>0" :align="'center'" :total="tableTotal" :page.sync="tableQuery.page" :limit.sync="tableQuery.page_size" @pagination="getTableData" />

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { apiGoodsSpuList, apiGoodsSpuUpdateSome } from '@/api/goods/spu'
export default {
  name: 'GoodsSpuList',
  components: { Pagination },
  data() {
    return {
      // filter
      hasFilter: false,
      extend: true,
      showExtend: false,
      // base
      loading: false,
      tableRowKey: 'spu_id',
      tableQuery: {
        page: 1,
        page_size: 20
      },
      tableData: [],
      tableTotal: 0
    }
  },
  mounted() {
    this.getTableData()
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
    handleCreate() {
      this.$router.push({ path: '/goods/spu/create' })
    },
    handleUpdate(row) {
      this.$router.push({ path: '/goods/spu/update', query: { spu_id: row.spu_id }})
    },
    handleUpdateSome(row, data, message) {
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        apiGoodsSpuUpdateSome({ spu_id: row.spu_id }, data).then((res) => {
          if (res['code'] === 0) {
            this.getTableData()
          }
        }).finally(() => {
          this.loading = false
        })
      })
    },
    async getTableData() {
      this.loading = true
      apiGoodsSpuList(this.tableQuery).then((res) => {
        if (res['code'] === 0) {
          this.tableData = res.data.list
          this.tableTotal = res.data.total
        }
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
