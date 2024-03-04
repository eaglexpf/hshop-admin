<template>
  <el-dialog
    width="75%"
    class="store-dialog"
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :before-close="closeDialog"
    append-to-body
  >
    <div class="filter-container">
      <el-input
        v-model="tableQuery.params_name"
        type="input"
        placeholder="参数名称"
        class="filter-item"
        style="width: 200px"
        :clearable="true"
        @keyup.enter.native="getTableData"
      />

      <el-button type="primary" @click="handleSearch">搜索</el-button>
      <el-button type="primary" style="float: right;margin: 0;" @click="handleCreate">添加</el-button>
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
      <el-table-column label="参数名称" prop="params_name" width="180" />
      <el-table-column label="参数值">
        <template slot-scope="{row}">
          <el-tag v-for="(item, index) in row.params_value" :key="index">{{ item.params_value_name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="tableTotal>0" :align="'center'" :total="tableTotal" :page.sync="tableQuery.page" :limit.sync="tableQuery.page_size" @pagination="getTableData" />
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="saveDialog">确 定</el-button>
    </span>
    <el-dialog
      width="70%"
      :title="textMap[dialogStatus]"
      :visible.sync="ruleFormVisible"
      append-to-body
    >
      <el-form ref="dataForm" v-loading="ruleFormLoading" :rules="ruleFormRules" :model="ruleForm" label-position="left" label-width="80px" style="width: 100%;padding: 0 20px;">
        <el-form-item label="参数名称" prop="params_name">
          <el-input v-model="ruleForm.params_name" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="ruleForm.sort" />
        </el-form-item>
        <el-form-item label="参数值" prop="params_value">
          <schema-dynamic-form-array
            :dynamic-schema="ruleFormParamsValueSchema"
            :dynamic-rel-data="ruleForm.params_value"
            @change="createDynamicFormArrayChange"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="ruleFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? handleCreateSubmit() : handleUpdateSubmit()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
import Pagination from '@/components/Pagination'
import SchemaDynamicFormArray from '@/components/Schema/dynamic/formArray'
import { apiGoodsParamsCreate, apiGoodsParamsList, apiGoodsParamsUpdate } from '@/api/goods/params'
export default {
  name: 'ChoseDialogGoodsParams',
  components: { Pagination, SchemaDynamicFormArray },
  props: {
    title: {
      type: String,
      default() {
        return '选择商品参数'
      }
    },
    visible: {
      type: Boolean,
      default() {
        return false
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
      // base
      loading: false,
      tableRowKey: 'params_id',
      tableQuery: {
        hasValue: true,
        params_name: '',
        page: 1,
        page_size: 20
      },
      tableData: [],
      tableTotal: 0,
      // dialog
      dialogVisible: false,
      multipleSelection: [],
      selectRows: [],
      selection: [],
      // rule form dialog
      dialogStatus: '',
      textMap: {
        update: '修改商品参数',
        create: '添加商品参数'
      },
      ruleFormVisible: false,
      ruleFormLoading: false,
      ruleFormFilter: {
        params_id: 0
      },
      ruleForm: {
        params_name: '',
        sort: '',
        params_value: []
      },
      ruleFormRules: {
        params_name: [
          { required: true, message: '参数名称必填', trigger: 'change' }
        ],
        sort: [
          { required: true, message: '排序必填', trigger: 'change' }
        ],
        params_value: [
          { required: true, message: '参数值必填', trigger: 'change' },
          { validator: (rule, value, callback) => {
            value.forEach(item => {
              if (item['params_value_name'] === '') {
                callback(new Error('请输入参数值'))
              }
            })
            callback()
          }, trigger: 'change' }
        ]
      },
      ruleFormParamsValueSchema: {
        title: '添加参数值',
        type: 'dynamic-form-array',
        'dynamic-form-array': {
          form: {
            params_value_name: {
              title: '参数值',
              placeholder: '请输入参数值'
            }
          },
          ruleForm: {
            params_value_name: ''
          }
        }
      }
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val
      if (this.dialogVisible) {
        // eslint-disable-next-line no-undef
        this.multipleSelection = structuredClone(this.selectRows)
        this.getTableData()
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
    async getTableData() {
      this.loading = true
      apiGoodsParamsList(this.tableQuery).then((res) => {
        if (res['code'] === 0) {
          this.tableData = res.data.list
          this.tableTotal = res.data.total
        }
        this.$nextTick(() => {
          this.toggleRowSelection()
        })
      }).finally(() => {
        this.loading = false
      })
    },
    handleSearch() {
      this.getTableData()
    },
    resetRuleForm() {
      this.ruleForm = {
        params_name: '',
        sort: '',
        params_value: []
      }
    },
    createDynamicFormArrayChange(val) {
      this.ruleForm.params_value = val
    },
    handleCreate() {
      this.resetRuleForm()
      this.dialogStatus = 'create'
      this.ruleFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleCreateSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.ruleFormLoading = true
          apiGoodsParamsCreate(this.ruleForm).then((res) => {
            if (res['code'] === 0) {
              this.ruleFormVisible = false
              this.$notify({
                title: 'Success',
                message: '添加成功',
                type: 'success',
                duration: 2000
              })
              this.getTableData()
            }
          }).finally(() => {
            this.ruleFormLoading = false
          })
        }
      })
    },
    handleUpdate(row) {
      this.ruleFormFilter.params_id = row.params_id
      this.ruleForm = {
        params_name: row.params_name,
        sort: row.sort,
        params_value: row.params_value
      }
      this.dialogStatus = 'update'
      this.ruleFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdateSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.ruleFormLoading = true
          apiGoodsParamsUpdate(this.ruleFormFilter, this.ruleForm).then((res) => {
            if (res['code'] === 0) {
              this.ruleFormVisible = false
              this.$notify({
                title: 'Success',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
              this.getTableData()
            }
          }).finally(() => {
            this.ruleFormLoading = false
          })
        }
      })
    },
    async getSelectRows(val) {
      apiGoodsParamsList({
        params_id: val
      }).then((res) => {
        if (res['code'] === 0) {
          this.selectRows = res.data.list
        }
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
      // eslint-disable-next-line no-undef
      this.multipleSelection = structuredClone(this.multipleSelection.filter(row => delData.indexOf(row[this.tableRowKey]) === -1))
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
      this.$emit('close')
    },
    saveDialog() {
      // eslint-disable-next-line no-undef
      this.selectRows = structuredClone(this.multipleSelection)
      const dialogData = []
      this.selectRows.forEach(row => {
        dialogData.push(row)
      })
      this.$emit('change', dialogData)
      this.closeDialog()
    }
  }
}
</script>

<style scoped>
.el-tag+.el-tag{
  margin-left: 5px;
}
</style>
