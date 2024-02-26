<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate()">
        添加顶级菜单
      </el-button>
    </div>

    <!-- Note that row-key is necessary to get a correct row order. -->
    <el-table ref="dragTable" v-loading="listLoading" :data="menuTree" :default-expand-all="true" row-key="menu_id" border fit highlight-current-row style="width: 100%">
      <!-- <el-table-column align="center" label="ID" width="65">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column> -->

      <el-table-column label="菜单名称">
        <template slot-scope="{row}">
          <!-- <span :style="{'padding-left':row.level * 20 + 'px'}">{{ row.name }}</span> -->
          <span>{{ row.menu_name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="菜单别名">
        <template slot-scope="{row}">
          <span>{{ row.menu_alias }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="排序" width="80">
        <template slot-scope="{row}">
          <span>{{ row.sort }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="是否显示" width="80">
        <template slot-scope="{row}">
          <el-tag v-if="row.is_show" type="success">是</el-tag>
          <el-tag v-else type="info">否</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="菜单类型">
        <template slot-scope="{row}">
          <el-tag type="success">{{ apiEnumMenuTypeData[row.menu_type] }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="380" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" type="success" @click="handleCreate(row)">
            添加子菜单
          </el-button>
          <el-button type="primary" size="mini" @click="handleUpdateApis(row)">
            Api权限
          </el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form v-if="dialogStatus==='update_apis'" ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 100%; padding:0 20px;">
        <el-alert
          title="设置菜单API权限集，请添加每个API后回车"
          type="info"
          close-text="知道了"
        />
        <el-input
          v-model="temp.apis"
          type="textarea"
          :rows="15"
          placeholder="请输入内容"
        />
      </el-form>
      <el-form v-else ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 100%; padding:0 20px;">
        <el-form-item label="父节点" prop="pid">
          <span>{{ temp.parent_name }}</span>
          <el-input v-show="false" v-model="temp.parent_id" />
        </el-form-item>
        <el-form-item label="菜单名称" prop="menu_name">
          <el-input v-model="temp.menu_name" />
        </el-form-item>
        <el-form-item label="菜单别名" prop="menu_alias">
          <el-input v-model="temp.menu_alias" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="temp.sort" />
        </el-form-item>
        <el-form-item label="是否显示" prop="is_show">
          <el-switch v-model="temp.is_show" active-color="#13ce66" inactive-color="#ff4949" />
        </el-form-item>
        <el-form-item label="菜单类型" prop="menu_type">
          <el-select v-model="temp.menu_type" clearable class="filter-item">
            <el-option v-for="item in enumMenuType" :key="item.key" :label="item.label" :value="item.key" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create' || dialogStatus==='create_children'?submitCreateData():submitUpdateData()">
          确定
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { apiEnumMenuType, apiMenuList, apiMenuCreate, apiMenuUpdate, apiMenuDelete } from '@/api/system/menu'
import waves from '@/directive/waves'

export default {
  name: 'AuthMenu',
  directives: { waves },
  data() {
    return {
      apiEnumMenuTypeData: [],
      enumMenuType: [],
      defaultMenuType: '',
      menuList: [],
      menuTree: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        page_size: 10
      },
      temp: {
        parent_id: 0,
        parent_name: '顶级菜单',
        menu_name: '',
        menu_alias: '',
        sort: 0,
        is_show: true,
        menu_type: ''
      },
      temp_filter: {
        menu_id: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改菜单',
        update_apis: '设置菜单API权限集',
        create: '添加顶级菜单',
        create_children: '添加子菜单'
      },
      rules: {
        name: [{ required: true, message: '名称必填', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getEnumData()
  },
  methods: {
    async getEnumData() {
      // const response_menu_type = await apiEnumMenuType()
      // this.apiEnumMenuTypeData = response_menu_type.data.list
      // const enumMenuType = new Array(0)
      // for (const key in response_menu_type.data.list) {
      //   const value = response_menu_type.data.list[key]
      //   enumMenuType.push({
      //     key: key,
      //     label: value
      //   })
      // }
      // this.enumMenuType = enumMenuType
      // this.defaultMenuType = response_menu_type.data.default

      await this.getList()
    },
    async getList() {
      this.listLoading = true
      const { data } = await apiMenuList(this.listQuery)
      this.menuList = data.list
      this.menuTree = data.list
      this.total = data.total
      this.listLoading = false
    },
    resetTemp() {
      this.temp = {
        parent_id: 0,
        parent_name: '顶级菜单',
        menu_name: '',
        menu_alias: '',
        sort: 0,
        is_show: true,
        menu_type: this.defaultMenuType
      }
    },
    handleFilter() {
      this.getList()
    },
    handleCreate(row) {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      if (row) {
        this.dialogStatus = 'create_children'
        this.temp.parent_name = row.menu_name
        this.temp.parent_id = row.menu_id
      }
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp = {
        parent_id: row.parent_id,
        parent_name: row.parent_name,
        menu_name: row.menu_name,
        menu_alias: row.menu_alias,
        sort: row.sort,
        is_show: row.is_show,
        menu_type: row.menu_type
      }
      this.temp_filter = {
        menu_id: row.menu_id
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdateApis(row) {
      this.temp = {
        apis: row.apis
      }
      this.temp_filter = {
        menu_id: row.menu_id
      }
      this.dialogStatus = 'update_apis'
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
        apiMenuDelete({ menu_id: row.menu_id }).then(() => {
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
          // eslint-disable-next-line no-undef
          const tempData = structuredClone(this.temp)
          apiMenuCreate(tempData).then(() => {
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
          // eslint-disable-next-line no-undef
          const tempFilter = structuredClone(this.temp_filter)
          // eslint-disable-next-line no-undef
          const tempData = structuredClone(this.temp)
          this.apiUpdateMenuData(tempFilter, tempData)
        }
      })
    },
    apiUpdateMenuData(filter, data) {
      apiMenuUpdate(filter, data).then(() => {
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

