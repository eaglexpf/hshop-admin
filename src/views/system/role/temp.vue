<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加角色
      </el-button>
    </div>

    <!-- Note that row-key is necessary to get a correct row order. -->
    <el-table ref="dragTable" v-loading="listLoading" :data="dataList" :default-expand-all="true" row-key="id" border fit highlight-current-row style="width: 100%">
      <!-- <el-table-column align="center" label="ID" width="65">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column> -->

      <el-table-column label="角色名称">
        <template slot-scope="{row}">
          <span>{{ row.role_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色别名">
        <template slot-scope="{row}">
          <span>{{ row.role_alias }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="260" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!=='deleted'" size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" align="center" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.page_size" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 100%;padding: 0 20px;">
        <el-form-item label="角色名称" prop="role_name">
          <el-input v-model="temp.role_name" />
        </el-form-item>
        <el-form-item label="角色别名" prop="role_alias">
          <el-input v-model="temp.role_alias" />
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-tree
            :ref="refsTreeMenus"
            :check-strictly="checkStrictly"
            :data="menusData"
            :props="defaultProps"
            show-checkbox
            node-key="menu_id"
            class="permission-tree"
          />
        </el-form-item>
        <!-- <el-form-item label="icon" prop="icon">
          <el-input v-model="temp.icon" />
        </el-form-item> -->
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
  </div>
</template>

<script>
import { apiRoleList, apiRoleCreate, apiRoleUpdate, apiRoleDelete } from '@/api/system/role'
import { apiMenuList } from '@/api/system/menu'
import Pagination from '@/components/Pagination'

export default {
  name: 'AuthRole',
  components: { Pagination },
  data() {
    return {
      dataList: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        page_size: 20
      },
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'menu_name'
      },
      menusData: [],
      temp: {
        role_name: '',
        role_alias: '',
        menu_ids: []
      },
      temp_filter: {
        role_id: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改角色',
        create: '添加角色'
      },
      refsTreeMenus: 'menuTree',
      rules: {
        role_name: [{ required: true, message: '角色名称必填', trigger: 'blur' }],
        role_alias: [{ required: true, message: '角色别名必填', trigger: 'blur' }]
      }
    }
  },
  computed: {
    // menusData() {
    //   return this.$store.getters.menus
    // }
  },
  created() {
    this.getEnumData()
  },
  methods: {
    getCheckedNodes(refs) {
      const nodes = this.$refs[refs].getCheckedNodes()
      const node_ids = []
      for (const node of nodes) {
        node_ids.push(node.menu_id)
      }
      return node_ids
    },
    setCheckedKeys(refs, checkedKeys) {
      this.$refs[refs].setCheckedKeys(checkedKeys)
    },
    async getEnumData() {
      await this.getList()
      await this.getMenuList()
    },
    async getMenuList() {
      this.listLoading = true
      const { data } = await apiMenuList()
      this.menusData = data.tree
      this.listLoading = false
    },
    async getList() {
      this.listLoading = true
      const { data } = await apiRoleList(this.listQuery)
      this.dataList = data.list
      this.total = data.total
      this.listLoading = false
    },
    resetTemp() {
      this.temp = {
        role_name: '',
        role_alias: '',
        menu_ids: []
      }
    },
    handleFilter() {
      this.getList()
      this.getMenuList()
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
        this.setCheckedKeys(this.refsTreeMenus, [])
      })
    },
    handleUpdate(row) {
      this.temp_filter = {
        role_id: row.role_id
      }
      this.temp = {
        role_name: row.role_name,
        role_alias: row.role_alias,
        menu_ids: row.menu_ids
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
        this.setCheckedKeys(this.refsTreeMenus, row.menu_ids)
      })
    },
    handleDelete(row) {
      this.$confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        apiRoleDelete({ role_id: row.id }).then(() => {
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
      this.temp.menu_ids = this.getCheckedNodes(this.refsTreeMenus)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          apiRoleCreate(tempData).then(() => {
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
      this.temp.menu_ids = this.getCheckedNodes(this.refsTreeMenus)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempFilter = Object.assign({}, this.temp_filter)
          const tempData = Object.assign({}, this.temp)
          this.updateApiData(tempFilter, tempData)
        }
      })
    },
    updateApiData(tempFilter, tempData) {
      apiRoleUpdate(tempFilter, tempData).then(() => {
        this.dialogFormVisible = false
        this.$notify({
          title: 'Success',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
    }
  }
}
</script>
