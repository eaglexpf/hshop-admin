<template>
  <el-dialog
    title="本地上传"
    :visible.sync="dialogVisible"
    width="80%"
    append-to-body
    :before-close="handleClose"
  >
    <div class="app-container">
      <el-tabs type="border-card">
        <el-tab-pane label="本地图片">
          <div class="upload_box">
            <el-upload
              class="upload-demo"
              :multiple="true"
              action=""
              accept="image/jpeg,image/png,image/gif"
              :show-file-list="false"
              :http-request="handleUpload"
              :before-upload="beforeUploadImage"
              :on-success="handleUploadSuccess"
              :on-error="uploadError"
            >
              <el-button type="primary">本地上传</el-button>

              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过2M
              </div>
            </el-upload>
          </div>
          <div class="image-list">

            <el-row :gutter="20">
              <el-col v-for="(item, index) in list" :key="index" :lg="{span:'4-8'}" :sm="12" :xs="24">
                <div class="image-item" @click="handleChecked(item, index)">
                  <el-image
                    class="image"
                    :src="item.full_url"
                    fit="contain"
                  />
                  <div v-if="item.isChecked" class="maskSelect">
                    <i class="el-icon-check icon" />
                  </div>
                </div>
              </el-col>
            </el-row>

          </div>

          <pagination
            v-show="total>0"
            align="center"
            :total="total"
            :page.sync="listQuery.page"
            :page-sizes="[1, 2, 3, 4]"
            :limit.sync="listQuery.page_size"
            @pagination="getList"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>

import { apiUploadImages, apiUploadsImageList } from '@/api/system/uploads'
import Pagination from '@/components/Pagination'
import { beforeUploadImageCheck } from '@/utils'
export default {
  name: 'Uploads',
  components: { Pagination },
  props: {
    isSingle: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      checkData: [],
      checkIds: [],
      total: 0,
      list: [],
      listLoading: true,
      listQuery: {
        page: 1,
        page_size: 1
      }
    }
  },
  created() {

  },
  methods: {
    showDialog() {
      this.dialogVisible = true
      this.checkData = []
      this.checkIds = []
      this.listQuery = {
        page: 1,
        page_size: 1
      }
      this.getList()
    },
    handleClose(done) {
      done()
    },
    handleSubmit() {
      this.$emit('confirmUpload', this.checkData)
      this.dialogVisible = false
    },
    handleChecked(item, index) {
      if (item.isChecked) {
        item.isChecked = false
        const checkedIndex = this.checkIds.indexOf(item.img_id)
        this.checkData.splice(checkedIndex, 1)
      } else {
        if (this.isSingle && this.checkData.length > 0) {
          this.checkData.forEach(item => {
            if (item.img_id === this.checkIds[0]) {
              item.isChecked = false
              this.checkIds = []
              this.checkData = []
            }
          })
        }
        item.isChecked = true
        this.checkData.push(item)
        this.checkIds.push(item.img_id)
      }
      this.$forceUpdate()
    },
    async getList() {
      this.listLoading = true
      const { data } = await apiUploadsImageList(this.listQuery)
      data.list.forEach(item => {
        if (this.checkIds.indexOf(item.img_id) !== -1) {
          item.isChecked = true
        }
      })
      this.list = data.list
      this.total = data.total
      this.listLoading = false
    },
    beforeUploadImage(file) {
      return beforeUploadImageCheck(file)
    },
    handleUploadSuccess(res, file) {
      this.$message({
        message: '上传成功',
        type: 'success',
        duration: 5 * 1000
      })
      this.getList()
    },
    // 自定义上传
    handleUpload(e) {
      apiUploadImages(e.file).then(
        res => e.onSuccess(res),
        err => e.onError(err)
      ).catch(err => e.onError(err))
    },
    // 上传错误回调
    uploadError(e) {
      console.error(e)
    }
  }
}
</script>

<style lang="scss" scoped>
.upload_box{
  padding-bottom: 20px;
}
.image-item{
  box-shadow: 0 0 5px #ccc;
  margin-bottom: 20px;
  position: relative;
  .image{
    width: 100%;
    height: 200px;
  }
  .title{
    padding:  10px 0;
    text-align: center;
  }
  .footer_btn{
    display: flex;
    >div{
      width: 50%;
      display: flex;
      align-items: center;
      height: 40px;
      justify-content: center;
      background: #e7e7eb;
    }
  }
  .maskSelect{
    position: absolute;right: 0;left: 0;top: 0;bottom: 0;
    background: rgba(0,0,0,0.7);
    display: flex;align-items: center;justify-content: center;
    .icon{
      font-size: 78px;
      color: #fff;
    }
  }
}
@media only screen and (min-width: 992px) {
  .el-col-lg-4-8 {
    width: 20%;
  }
  .el-col-lg-offset-4-8 {
    margin-left: 20%;
  }
  .el-col-lg-pull-4-8 {
    position: relative;
    right: 20%;
  }
  .el-col-lg-push-4-8 {
    position: relative;
    left: 20%;
  }
}
</style>
