<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加用户
      </el-button>
    </div>

    <!-- Note that row-key is necessary to get a correct row order. -->
    <el-table
      ref="dragTable"
      :loading="listLoading"
      :data="dataList"
      :default-expand-all="true"
      row-key="id"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <!-- <el-table-column align="center" label="ID" width="65">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column> -->

      <el-table-column align="center" label="昵称">
        <template slot-scope="{row}">
          <span>{{ row.user_name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="头像">
        <template slot-scope="{row}">
          <el-image class="img-circle" :src="row.avatar_url">
            <div slot="placeholder" class="image-slot">
              加载中<span class="dot">...</span>
            </div>
          </el-image>
        </template>
      </el-table-column>

      <el-table-column align="center" label="账号">
        <template slot-scope="{row}">
          <span>{{ row.login_name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="手机号">
        <template slot-scope="{row}">
          <span>{{ row.mobile }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="260" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" align="center" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.page_size" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 100%; padding:0 20px;">
        <el-form-item label="账号" prop="login_name">
          <el-input v-model="temp.login_name" />
        </el-form-item>
        <el-form-item v-if="dialogStatus==='create'" label="密码" prop="password">
          <el-input v-model="temp.password" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="temp.mobile" />
        </el-form-item>
        <el-form-item label="昵称" prop="user_name">
          <el-input v-model="temp.user_name" />
        </el-form-item>
        <el-form-item label="头像" prop="avatar_url">
          <div class="avatar-uploader" @click="imagecropperShow=true">
            <div class="el-upload el-upload--text">
              <img v-if="temp.avatar_url" :src="temp.avatar_url" class="avatar" alt="">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </div>
          </div>
        </el-form-item>
        <el-form-item label="角色权限">
          <el-tree
            :ref="refsTreeRoles"
            :check-strictly="checkStrictly"
            :data="rolesData"
            :props="roleProps"
            show-checkbox
            node-key="role_id"
            class="permission-tree"
          />
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-tree
            :ref="refsTreeMenus"
            :check-strictly="checkStrictly"
            :data="menusData"
            :props="menuProps"
            show-checkbox
            node-key="menu_id"
            class="permission-tree"
          />
        </el-form-item>
        <!--        <el-form-item label="是否禁用" prop="is_show">-->
        <!--          <el-switch v-model="temp.user_status" active-color="#13ce66" inactive-color="#ff4949" />-->
        <!--        </el-form-item>-->
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
    <image-cropper
      v-show="imagecropperShow"
      :key="imagecropperKey"
      field="upload"
      :width="300"
      :height="300"
      :url="uploadUrl"
      lang-type="zh"
      @close="close"
      @crop-upload-success="cropSuccess"
    />
    <!--    上传图片组件-->
    <UploadComp ref="UploadComp" :is-single="checkedUploadData.isSingle" @confirmUpload="confirmUpload" />
  </div>
</template>

<script>
import { apiUserList, apiUserCreate, apiUserUpdate, apiUserDelete } from '@/api/system/user'
import { apiMenuList } from '@/api/system/menu'
import { apiRoleList } from '@/api/system/role'
import ImageCropper from '@/components/ImageCropper'
import Pagination from '@/components/Pagination'
import { apiCreateUploadsImage } from '@/api/system/uploads'
import UploadComp from '@/components/UploadComp/index'

export default {
  name: 'AuthUser',
  components: { ImageCropper, Pagination, UploadComp },
  data() {
    return {
      checkedUploadData: {
        str: '',
        isSingle: false
      },
      imagecropperShow: false,
      imagecropperKey: 0,
      dataList: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        page_size: 20
      },
      checkStrictly: false,
      roleProps: {
        children: 'children',
        label: 'role_name'
      },
      menuProps: {
        children: 'children',
        label: 'menu_name'
      },
      menusData: [],
      rolesData: [],
      temp: {
        user_name: '',
        avatar_url: '',
        mobile: '',
        login_name: '',
        password: '',
        menu_ids: [],
        role_ids: []
      },
      temp_filter: {
        user_id: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改用户',
        create: '添加用户'
      },
      refsTreeMenus: 'menuTree',
      refsTreeRoles: 'roleTree',
      rules: {
        login_name: [{ required: true, message: '账号必填', trigger: 'blur' }],
        password: [{ required: true, message: '密码必填', trigger: 'blur' }],
        user_name: [{ required: true, message: '昵称必填', trigger: 'blur' }],
        mobile: [{ required: true, message: '手机号必填', trigger: 'blur' }]
      }
    }
  },
  computed: {
    uploadUrl() {
      return process.env.VUE_APP_BASE_API + apiCreateUploadsImage
    }
  },
  created() {
    this.getEnumData()
  },
  methods: {
    handleUpload(str, bool) {
      this.$refs.UploadComp.showDialog()
      this.checkedUploadData = {
        str: str,
        isSingle: bool
      }
    },
    confirmUpload(data) {
      if (data.length > 0) {
        if (this.checkedUploadData.isSingle) {
          this.temp[this.checkedUploadData.str] = data[0].full_url
        } else {
          this.temp[this.checkedUploadData.str] = this.temp[this.checkedUploadData.str].concat(data)
        }
        console.log(2222222, this.temp)
        this.$forceUpdate()
      }
    },
    cropSuccess(resData) {
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
      this.temp.avatar_url = resData.full_url
    },
    close() {
      this.imagecropperShow = false
    },
    getCheckedMenuNodes(refs) {
      const nodes = this.$refs[refs].getCheckedNodes()
      const node_ids = []
      for (const node of nodes) {
        node_ids.push(node.menu_id)
      }
      return node_ids
    },
    getCheckedRoleNodes(refs) {
      const nodes = this.$refs[refs].getCheckedNodes()
      const node_ids = []
      for (const node of nodes) {
        node_ids.push(node.role_id)
      }
      return node_ids
    },
    setCheckedKeys(refs, checkedKeys) {
      this.$refs[refs].setCheckedKeys(checkedKeys)
    },
    async getEnumData() {
      await this.getList()
      await this.getRoleList()
      await this.getMenuList()
    },
    async getRoleList() {
      const { data } = await apiRoleList({ page: 1, page_size: 1000 })
      this.rolesData = data.list
      console.log(data)
    },
    async getMenuList() {
      const { data } = await apiMenuList({ menu_version: this.defaultRoleType })
      this.menusData = data.tree
    },
    async getList() {
      this.listLoading = true
      const { data } = await apiUserList(this.listQuery)
      this.dataList = data.list
      this.total = data.total
      this.listLoading = false
    },
    resetTemp() {
      this.temp = {
        user_name: '',
        avatar_url: '',
        mobile: '',
        login_name: '',
        password: '',
        menu_ids: [],
        role_ids: []
      }
    },
    handleFilter() {
      this.getList()
      this.getRoleList()
      this.getMenuList()
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
        this.setCheckedKeys(this.refsTreeRoles, [])
        this.setCheckedKeys(this.refsTreeMenus, [])
      })
    },
    handleUpdate(row) {
      this.temp_filter = {
        user_id: row.user_id
      }
      this.temp = {
        user_name: row.user_name,
        avatar_url: row.avatar_url,
        mobile: row.mobile,
        login_name: row.login_name,
        menu_ids: row.menu_ids,
        role_ids: row.menu_id
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
        this.setCheckedKeys(this.refsTreeRoles, row.role_ids)
        this.setCheckedKeys(this.refsTreeMenus, row.menu_ids)
      })
    },
    handleDelete(row) {
      apiUserDelete({ user_id: row.user_id }).then(() => {
        this.$notify({
          title: 'Success',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
    },
    submitCreateData() {
      this.temp.menu_ids = this.getCheckedMenuNodes(this.refsTreeMenus)
      this.temp.role_ids = this.getCheckedRoleNodes(this.refsTreeRoles)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          apiUserCreate(tempData).then(() => {
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
      this.temp.menu_ids = this.getCheckedMenuNodes(this.refsTreeMenus)
      this.temp.role_ids = this.getCheckedRoleNodes(this.refsTreeRoles)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempFilter = Object.assign({}, this.temp_filter)
          const tempData = Object.assign({}, this.temp)
          this.updateApiData(tempFilter, tempData)
        }
      })
    },
    updateApiData(tempFilter, tempData) {
      apiUserUpdate(tempFilter, tempData).then(() => {
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

<style>
.img-circle {
  border-radius: 50%;
  width: 50px;
  height: 50px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
