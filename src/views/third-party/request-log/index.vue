<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-if="enumRequestMethod.length>1" v-model="defaultRequestMethod" clearable placeholder="请求方式" class="filter-item">
        <el-option v-for="item in enumRequestMethod" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-input v-model="listQuery.host" clearable placeholder="请求域名" style="width: 200px;" class="filter-item" @keyup.enter.native="getList" />
      <el-input v-model="listQuery.path" clearable placeholder="请求地址" style="width: 200px;" class="filter-item" @keyup.enter.native="getList" />
      <el-select v-if="enumRequestStatusCode.length>1" v-model="defaultRequestStatusCode" clearable placeholder="status code" class="filter-item">
        <el-option v-for="item in enumRequestStatusCode" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-select v-if="enumRequestStatus.length>1" v-model="defaultRequestStatus" clearable placeholder="请求状态" class="filter-item">
        <el-option v-for="item in enumRequestStatus" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-input v-model="listQuery.params" clearable placeholder="请求参数" style="width: 200px;" class="filter-item" @keyup.enter.native="getList" />
      <el-input v-model="listQuery.result" clearable placeholder="返回参数" style="width: 200px;" class="filter-item" @keyup.enter.native="getList" />
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
    <el-table ref="dragTable" v-loading="listLoading" :data="dataList" row-key="id" border fit highlight-current-row style="width: 100%">
      <!-- <el-table-column align="center" label="ID" width="65">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column> -->
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-button
            v-clipboard:copy="props.row.params"
            v-clipboard:success="onCopy"
            type="success"
            size="mini"
          >
            点我复制
          </el-button>
          <span><pre>{{ props.row.params }}</pre></span>
          <el-button
            v-clipboard:copy="props.row.result"
            v-clipboard:success="onCopy"
            type="success"
            size="mini"
          >
            点我复制
          </el-button>
          <span><pre>{{ props.row.result }}</pre></span>
        </template>
      </el-table-column>

      <el-table-column label="请求方式" width="80" align="center">
        <template slot-scope="{row}">
          <span>{{ row.method }}</span>
        </template>
      </el-table-column>

      <el-table-column label="域名" min-width="260" align="center">
        <template slot-scope="{row}">
          <span>{{ row.host }}</span>
        </template>
      </el-table-column>

      <el-table-column label="路径" min-width="260">
        <template slot-scope="{row}">
          <span>{{ row.path }}</span>
        </template>
      </el-table-column>

      <el-table-column label="HTTP状态" min-width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.status_code }}</span>
        </template>
      </el-table-column>

      <el-table-column label="接口状态" min-width="80" align="center">
        <template slot-scope="{row}">
          <span>{{ row.status }}</span>
        </template>
      </el-table-column>

      <el-table-column label="请求时间" width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.transfer_time }}</span>
        </template>
      </el-table-column>

      <el-table-column label="记录时间" width="180" align="center">
        <template slot-scope="{row}">
          <span>{{ row.created_at }}</span>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" align="center" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.page_size" @pagination="getList" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { apiRequestEnumMethod, apiRequestEnumStatus, apiRequestEnumStatusCode, apiRequestLogList } from '@/api/third-party/request-log'

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
        method: '',
        host: '',
        path: '',
        status: '',
        status_code: 0,
        params: '',
        result: '',
        time_start_begin: 0,
        time_start_end: 0,
        page: 1,
        page_size: 20
      },
      enumRequestMethod: [],
      defaultRequestMethod: '',
      enumRequestStatus: [],
      defaultRequestStatus: '',
      enumRequestStatusCode: [],
      defaultRequestStatusCode: ''
    }
  },
  computed: {
  },
  created() {
    this.getEnumData()
  },
  methods: {
    async getEnumData() {
      const response_enum_method = await apiRequestEnumMethod()
      const enumRequestMethod = new Array(0)
      for (const key in response_enum_method.data.list) {
        const value = response_enum_method.data.list[key]
        enumRequestMethod.push({
          key: key,
          label: value
        })
      }
      this.enumRequestMethod = enumRequestMethod
      this.defaultRequestMethod = response_enum_method.data.default

      const response_enum_status = await apiRequestEnumStatus()
      const enumRequestStatus = new Array(0)
      for (const key in response_enum_status.data.list) {
        const value = response_enum_status.data.list[key]
        enumRequestStatus.push({
          key: key,
          label: value
        })
      }
      this.enumRequestStatus = enumRequestStatus
      this.defaultRequestStatus = response_enum_status.data.default

      const response_enum_status_code = await apiRequestEnumStatusCode()
      const enumRequestStatusCode = new Array(0)
      for (const key in response_enum_status_code.data.list) {
        const value = response_enum_status_code.data.list[key]
        enumRequestStatusCode.push({
          key: key,
          label: value
        })
      }
      this.enumRequestStatusCode = enumRequestStatusCode
      this.defaultRequestStatusCode = response_enum_status_code.data.default

      await this.getList()
    },
    async getList() {
      this.listLoading = true
      this.listQuery.method = this.defaultRequestMethod
      this.listQuery.status = this.defaultRequestStatus
      this.listQuery.status_code = this.defaultRequestStatusCode
      const { data } = await apiRequestLogList(this.listQuery)
      this.dataList = data.list
      this.dataList.forEach((value, index) => {
        this.dataList[index].params = JSON.stringify(value.params, null, 4)
        this.dataList[index].result = JSON.stringify(value.result, null, 4)
      })
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
