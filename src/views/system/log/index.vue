<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.user_mobile" clearable placeholder="用户手机号" style="width: 200px;" class="filter-item" @keyup.enter.native="getList" />
      <el-input v-model="listQuery.api_name" clearable placeholder="接口名称" style="width: 200px;" class="filter-item" @keyup.enter.native="getList" />
      <el-input v-model="listQuery.api_alias" clearable placeholder="接口别名" style="width: 200px;" class="filter-item" @keyup.enter.native="getList" />
      <el-input v-model="listQuery.request_uri" clearable placeholder="请求地址" style="width: 200px;" class="filter-item" @keyup.enter.native="getList" />
      <el-input v-model="listQuery.params" clearable placeholder="参数详情" style="width: 200px;" class="filter-item" @keyup.enter.native="getList" />
      <el-date-picker
        v-model="valid_date"
        class="filter-item"
        clearable
        type="datetimerange"
        align="right"
        format="yyyy-MM-dd HH:mm:ss"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        prefix-icon="null"
        :default-time="defaultTime"
        @change="dateChange"
      />
      <el-button type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>

    <!-- Note that row-key is necessary to get a correct row order. -->
    <el-table ref="dragTable" :loading="listLoading" :data="dataList" row-key="log_id" border fit highlight-current-row style="width: 100%">
      <!-- <el-table-column align="center" label="ID" width="65">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column> -->
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="复制参数">
              <el-button
                v-clipboard:copy="props.row.params"
                v-clipboard:success="onCopy"
                type="success"
                size="mini"
              >
                点我复制
              </el-button>
            </el-form-item>
            <el-form-item label="参数详情">
              <span>{{ props.row.params }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column label="用户ID" width="65" align="center">
        <template slot-scope="{row}">
          <span>{{ row.user_id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="用户手机号" width="150" align="center">
        <template slot-scope="{row}">
          <span>{{ row.user_mobile }}</span>
        </template>
      </el-table-column>

      <el-table-column label="来源IP" width="150" align="center">
        <template slot-scope="{row}">
          <span>{{ row.from_ip }}</span>
        </template>
      </el-table-column>

      <el-table-column label="请求方式" width="80" align="center">
        <template slot-scope="{row}">
          <span>{{ row.request_method }}</span>
        </template>
      </el-table-column>

      <el-table-column label="接口名称" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.api_name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="接口别名" min-width="220">
        <template slot-scope="{row}">
          <span>{{ row.api_alias }}</span>
        </template>
      </el-table-column>

      <el-table-column label="请求地址" min-width="200">
        <template slot-scope="{row}">
          <span>{{ row.request_uri }}</span>
        </template>
      </el-table-column>

      <el-table-column label="请求时间" width="180" align="center">
        <template slot-scope="{row}">
          <span>{{ row.created_at }}</span>
        </template>
      </el-table-column>

      <!--
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-popover
            placement="right"
            width="500"
            trigger="click"
            :content="row.params">
            <el-button slot="reference" type="success" size="mini">参数详情</el-button>
          </el-popover>
        </template>
      </el-table-column>
      -->

    </el-table>

    <pagination v-show="total>0" align="center" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.page_size" @pagination="getList" />
  </div>
</template>

<script>
import { apiBackendLogList } from '@/api/system/log'
import Pagination from '@/components/Pagination'

export default {
  name: 'SystemBackendLog',
  components: { Pagination },
  data() {
    return {
      defaultTime: ['00:00:00', '23:59:59'],
      dataList: [],
      total: 0,
      listLoading: true,
      valid_date: [],
      listQuery: {
        user_mobile: '',
        api_name: '',
        api_alias: '',
        request_uri: '',
        params: '',
        time_start_begin: 0,
        time_start_end: 0,
        page: 1,
        page_size: 20
      }
    }
  },
  computed: {
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const { data } = await apiBackendLogList(this.listQuery)
      this.dataList = data.list
      this.total = data.total
      this.listLoading = false
    },
    dateChange(val) {
      if (Array.isArray(val) && val.length >= 2) {
        this.listQuery.time_start_begin = Date.parse(val[0]) / 1000
        this.listQuery.time_start_end = Date.parse(val[1]) / 1000
      } else {
        this.listQuery.time_start_begin = 0
        this.listQuery.time_start_end = 0
      }
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    onCopy() {
      this.$message({
        type: 'success',
        message: '复制成功'
      })
    }
  }
}
</script>
