<template>
  <div class="app-container">
    <div class="app-container-header">
      <el-alert type="info" title="下载提示" show-icon>
        <div>
          已经生成的文件只保留约一小时，请及时下载
        </div>
      </el-alert>
    </div>
    <el-tabs tab-position="left" :value="tab_default" @tab-click="handleClick">
      <template v-for="(item, index) in exportTypeList">
        <el-tab-pane :key="index" :name="item.type" :label="item.name" />
      </template>

      <div class="tab-content">
        <el-table ref="dragTable" v-loading="listLoading" :data="dataList" :default-expand-all="true" row-key="id" border fit highlight-current-row>

          <el-table-column label="ID">
            <template slot-scope="{row}">
              <span>{{ row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column label="文件名称">
            <template slot-scope="{row}">
              <span>{{ row.file_name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="处理完成时间">
            <template slot-scope="{row}">
              <span>{{ row.finish_time }}</span>
            </template>
          </el-table-column>
          <el-table-column label="处理状态">
            <template slot-scope="{row}">
              <div class="table-tb-title">
                <el-tooltip effect="dark" content="处理状态" placement="top-start"><i class="el-icon-cpu" /></el-tooltip>
                <span v-if="row.handle_status === 'wait'"> 等待处理</span>
                <span v-if="row.handle_status === 'processing'"> 处理中</span>
                <span v-if="row.handle_status === 'finish'"> 处理完成</span>
                <span v-if="row.handle_status === 'fail'"> 处理失败</span>
              </div>

              <div v-if="row.handle_status === 'fail'" class="table-tb-subtitle">
                <el-tooltip effect="dark" content="错误原因" placement="top-start"><i class="el-icon-error" /></el-tooltip> {{ row.error_message }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="{row}">
              <el-link v-if="row.handle_status === 'finish'" type="primary" @click="downloadFile(row)">下载</el-link>
            </template>
          </el-table-column>

        </el-table>

        <pagination v-show="total>0" align="center" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.page_size" @pagination="getList" />

      </div>
    </el-tabs>
  </div>
</template>

<script>
import { apiExportLogList, apiExportTypeList } from '@/api/system/export_file'
import Pagination from '@/components/Pagination'

export default {
  name: 'WechatSetting',
  components: { Pagination },
  data() {
    return {
      tab_default: '',
      exportTypeList: [],
      dataList: [],
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        page_size: 20,
        export_type: ''
      }
    }
  },
  computed: {
  },
  created() {
    this.getExportTypeList()
  },
  methods: {
    getExportTypeList() {
      apiExportTypeList().then((response) => {
        this.exportTypeList = response.data
        if (response.data.length > 0) {
          this.tab_default = response.data[0].type
          this.listQuery.export_type = this.tab_default
          this.getList()
        }
      })
    },
    handleClick(tab) {
      this.listQuery.export_type = tab.name
      this.getList()
    },
    getList() {
      apiExportLogList(this.listQuery).then((response) => {
        this.dataList = response.data.list
        this.total = response.data.total
      })
    },
    downloadFile(row) {
      const a = document.createElement('a')
      a.href = row.file_url
      a.download = row.file_name
      document.body.appendChild(a)
      a.click()
      a.remove()
      this.$message.success('下载成功')
    }
  }
}
</script>
