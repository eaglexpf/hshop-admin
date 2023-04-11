<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加账号
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleExport">
        导出
      </el-button>
    </div>

    <!-- Note that row-key is necessary to get a correct row order. -->
    <el-table ref="dragTable" v-loading="listLoading" :data="dataList" :default-expand-all="true" row-key="id" border fit highlight-current-row>
      <!-- <el-table-column align="center" label="ID" width="65">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column> -->

      <el-table-column label="账号类型">
        <template slot-scope="{row}">
          <span>{{ responseEnumDriver[row.driver] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="AppId">
        <template slot-scope="{row}">
          <span>{{ row.app_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Secret">
        <template slot-scope="{row}">
          <span>{{ row.secret }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Token">
        <template slot-scope="{row}">
          <span>{{ row.token }}</span>
        </template>
      </el-table-column>
      <el-table-column label="AesKey">
        <template slot-scope="{row}">
          <span>{{ row.aes_key }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="primary" size="mini" @click="handleJsonSchema(row)">
            装修
          </el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row)">
            删除
          </el-button>
          <UploadCsv :file-type="'demo'" :file-rel-id="1" />
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" align="center" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.page_size" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 100%;padding: 0 20px;">
        <el-form-item label="账号类型" prop="driver">
          <el-select v-model="temp.driver" clearable>
            <el-option v-for="item in enumDriver" :key="item.key" :label="item.label" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="AppId" prop="app_id">
          <el-input v-model="temp.app_id" />
        </el-form-item>
        <el-form-item label="Secret" prop="secret">
          <el-input v-model="temp.secret" />
        </el-form-item>
        <el-form-item label="Token" prop="token">
          <el-input v-model="temp.token" />
        </el-form-item>
        <el-form-item label="AesKey" prop="aes_key">
          <el-input v-model="temp.aes_key" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?submitCreateData():submitUpdateData()">
          确定
        </el-button>
      </div>
    </el-dialog>

    <json-schema ref="JsonSchema" />
  </div>
</template>

<script>
import { apiEnumDriver, apiWechatList, apiWechatCreate, apiWechatUpdate, apiWechatDelete } from '@/api/system/wechat'
import Pagination from '@/components/Pagination'
import JsonSchema from '@/components/JsonSchema'
import UploadCsv from '@/components/UploadCsv'
import { apiExportDownload } from '@/api/system/export_file'

export default {
  name: 'WechatSetting',
  components: { UploadCsv, Pagination, JsonSchema },
  data() {
    return {
      dataList: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        page_size: 20
      },
      temp: {
        driver: '',
        app_id: '',
        secret: '',
        token: '',
        aes_key: ''
      },
      temp_filter: {
        id: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改微信账号',
        create: '添加微信账号'
      },
      rules: {
        driver: [{ required: true, message: '账号类型必填', trigger: 'blur' }],
        app_id: [{ required: true, message: 'app_id必填', trigger: 'blur' }],
        secret: [{ required: true, message: 'secret必填', trigger: 'blur' }]
      },
      responseEnumDriver: [],
      enumDriver: [],
      defaultDriver: '',
      showJsonSchema: false
    }
  },
  computed: {
  },
  created() {
    this.getEnumData()
  },
  methods: {
    async getEnumData() {
      const response_driver = await apiEnumDriver()
      this.responseEnumDriver = response_driver.data.list
      const enumDriver = new Array(0)
      for (const key in response_driver.data.list) {
        const value = response_driver.data.list[key]
        enumDriver.push({
          key: key,
          label: value
        })
      }
      this.enumDriver = enumDriver
      this.defaultDriver = response_driver.data.default

      await this.getList()
    },
    async getList() {
      this.listLoading = true
      const { data } = await apiWechatList(this.listQuery)
      this.dataList = data.list
      this.total = data.total
      this.listLoading = false
    },
    resetTemp() {
      this.temp = {
        driver: '',
        app_id: '',
        secret: '',
        token: '',
        aes_key: ''
      }
    },
    handleFilter() {
      this.getList()
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp_filter = {
        id: row.id
      }
      this.temp = {
        driver: row.driver,
        app_id: row.app_id,
        secret: row.secret,
        token: row.token,
        aes_key: row.aes_key
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(row) {
      this.$confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        apiWechatDelete({ id: row.id }).then(() => {
          this.$notify({
            title: 'Success',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    submitCreateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          apiWechatCreate(tempData).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '添加成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    },
    submitUpdateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempFilter = Object.assign({}, this.temp_filter)
          const tempData = Object.assign({}, this.temp)
          this.updateApiData(tempFilter, tempData)
        }
      })
    },
    updateApiData(tempFilter, tempData) {
      apiWechatUpdate(tempFilter, tempData).then(() => {
        this.dialogFormVisible = false
        this.$notify({
          title: 'Success',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
    },
    handleJsonSchema() {
      this.$refs.JsonSchema.showDialog()
    },
    handleExport() {
      apiExportDownload({ export_type: 'demo', request_data: this.listQuery }).then((response) => {
        console.log(response)
      })
    }
  }
}
</script>
