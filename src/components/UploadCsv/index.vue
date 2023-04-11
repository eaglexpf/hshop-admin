<template>
  <div class="component_upload_csv">
    <el-button :type="buttonType" :size="buttonSize" @click="showDialog">
      {{ buttonName }}
    </el-button>
    <el-dialog :visible="visible" width="80%" :before-close="handleClose">
      <div class="tip-info">
        <p>
          上传文件如果有处理失败的行数后将会生成错误文件，请及时查看错误信息修改后重新下载，错误描述文件只保留<strong>15天</strong>。
        </p>
        <p>超过<strong>15天</strong>的错误描述文件将会删除，不再提供下载查看</p>
      </div>
      <div class="content-button-box">
        <el-upload
          class="float-left"
          action=""
          :on-change="uploadHandleChange"
          :auto-upload="false"
          :show-file-list="false"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
        <el-button type="primary" size="small" @click="downloadUploadTemplate">下载模版</el-button>
        <el-button class="float-right" type="primary" size="small" @click="refreshList">刷新列表</el-button>
      </div>
      <div class="content-table-box">

        <el-table ref="uploadTable" v-loading="listLoading" :data="dataList" element-loading-text="数据加载中" :default-expand-all="true" row-key="id" border fit highlight-current-row>
          <el-table-column prop="file_name" label="上传文件" min-width="180">
            <template slot-scope="{row}">
              <div class="table-tb-title">
                <el-tooltip effect="dark" content="文件名称" placement="top-start"><i class="el-icon-office-building" /></el-tooltip> {{ row.file_name }}
              </div>

              <div class="table-tb-subtitle">
                <el-tooltip effect="dark" content="文件大小" placement="top-start"><svg-icon icon-class="size" /></el-tooltip> {{ row.file_size_format }}
              </div>

              <div class="table-tb-subtitle">
                <el-tooltip effect="dark" content="上传时间" placement="top-start"><i class="el-icon-time" /></el-tooltip> {{ row.created_at }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="处理状态" min-width="180">
            <template slot-scope="{row}">
              <div class="table-tb-title">
                <el-tooltip effect="dark" content="处理状态" placement="top-start"><i class="el-icon-cpu" /></el-tooltip>
                <span v-if="row.handle_status === 'wait'"> 等待处理</span>
                <span v-if="row.handle_status === 'processing'"> 处理中</span>
                <span v-if="row.handle_status === 'finish'"> 处理完成</span>
              </div>

              <div v-if="row.handle_status === 'finish'" class="table-tb-subtitle">
                <el-tooltip effect="dark" content="处理完成时间" placement="top-start"><i class="el-icon-time" /></el-tooltip> {{ row.finish_time }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="导入文件行数" min-width="110" align="center">
            <template slot-scope="{row}">
              <span>{{ row.handle_line_num }}行</span>
            </template>
          </el-table-column>
          <el-table-column label="处理成功" align="center">
            <template slot-scope="{row}">
              <span>{{ row.success_line_num }}行</span>
            </template>
          </el-table-column>
          <el-table-column label="处理失败" align="center">
            <template slot-scope="{row}">
              <span>
                {{ row.error_line_num }}行
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" min-width="110">
            <template slot-scope="{row}">
              <el-link type="primary" @click="exportUploadRaw(row)">下载原始文件</el-link>
              <el-link v-if="row.handle_status === 'finish' && row.error_line_num > 0" type="primary" @click="exportUploadError(row)">下载错误详情</el-link>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total>0" align="center" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.page_size" @pagination="getList" />
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  apiDownloadUploadErrorFile,
  apiDownloadUploadTemplate,
  apiUploadCsv,
  apiUploadLists
} from '@/api/system/upload_file'
import Pagination from '@/components/Pagination'

export default {
  name: 'UploadCsv',
  components: { Pagination },
  props: {
    buttonType: {
      type: String,
      default: 'primary'
    },
    buttonSize: {
      type: String,
      default: 'mini'
    },
    buttonName: {
      type: String,
      default: '导入'
    },
    fileType: {
      type: String,
      required: true
    },
    fileRelId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      visible: false,
      dataList: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        page_size: 10,
        file_type: '',
        file_rel_id: 0
      }
    }
  },
  methods: {
    showDialog() {
      this.visible = true
      this.refreshList()
    },
    handleClose() {
      this.visible = false
    },
    downloadUploadTemplate() {
      const query = {
        file_type: this.fileType,
        file_name: '导入模板'
      }
      apiDownloadUploadTemplate(query).then((response) => {
        const a = document.createElement('a')
        a.href = response.data.file
        a.download = response.data.name
        document.body.appendChild(a)
        a.click()
        a.remove()
        // eslint-disable-next-line handle-callback-err
      }).catch((err) => {
        this.$message.error('导入模板下载失败')
      })
    },
    uploadHandleChange(file, fileList) {
      const params = {
        file_type: this.fileType,
        file_rel_id: this.fileRelId
      }
      apiUploadCsv(params, file.raw).then((response) => {
        this.$message.success('文件上传成功')
        this.refreshList()
        // eslint-disable-next-line handle-callback-err
      }).catch((err) => {
        console.log(err)
        this.$message.error('文件上传失败')
      })
    },
    refreshList() {
      this.resetListQuery()
      this.getList()
    },
    resetListQuery() {
      this.listQuery.page = 1
      this.listQuery.page_size = 10
    },
    getList() {
      this.listQuery.file_type = this.fileType
      this.listQuery.file_rel_id = this.fileRelId
      this.listLoading = true
      apiUploadLists(this.listQuery).then((response) => {
        this.dataList = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    exportUploadRaw(row) {
      const a = document.createElement('a')
      a.href = row.handle_raw_path
      a.download = row.file_name
      document.body.appendChild(a)
      a.click()
      a.remove()
      this.$message.success('下载成功')
    },
    exportUploadError(row) {
      apiDownloadUploadErrorFile({ upload_id: row.id }).then((response) => {
        const a = document.createElement('a')
        a.href = response.data.path
        document.body.appendChild(a)
        a.click()
        a.remove()
        this.$message.success('下载成功')
        // eslint-disable-next-line handle-callback-err
      }).catch((err) => {
        this.$message.error('下载失败')
      })
    }
  }
}
</script>
<style lang="scss">
.component_upload_csv {
  display: inline-block;
  text-align: left;
  .el-button {
    margin-top: 10px;
    margin-left: 10px;
  }
  .tip-info {
    padding: 8px 16px;
    background-color: #fff6f7;
    border-radius: 4px;
    border-left: 5px solid #ff7800;
    margin: 10px;
    p {
      padding: 0;
      margin: 0;
    }
  }
  .content-button-box {
    padding-bottom: 15px;
    .float-right {
      margin-right: 10px;
      margin-left: 0;
    }
  }
}

.table-tb-title {
  padding-bottom: 5px;
  font-size: 16px;
  i {
    cursor: pointer;
  }
}

.table-tb-subtitle {
  color: #999;
}
</style>
