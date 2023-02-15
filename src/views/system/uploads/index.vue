<template>
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
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2M</div>
          </el-upload>
        </div>
        <div class="image-list">

          <el-row :gutter="20">
            <el-col v-for="(item, index) in list" :key="index" :lg="{span:'4-8'}" :sm="12" :xs="24">
              <div class="image-item">
                <el-image
                  class="image"
                  :src="item.full_url"
                  :preview-src-list="[item.full_url]"
                  fit="contain"
                />
                <el-tooltip class="item" effect="dark" :content="item.img_name" placement="top-start">
                  <div class="title">{{ item.img_name }}</div>
                </el-tooltip>
                <div class="footer_btn">
                  <div @click="downloadItem(item, index)">
                    <el-tooltip class="item" effect="dark" content="下载" placement="top">
                      <i class="el-icon-download" />
                    </el-tooltip>
                  </div>
                  <div @click="removeItem(item, index)">
                    <el-tooltip class="item" effect="dark" content="删除" placement="top">
                      <div><i class="el-icon-delete" /></div>
                    </el-tooltip>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>

        </div>

        <pagination v-show="total>0" align="center" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.page_size" @pagination="getList" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

import { apiDeleteUploadsImage, apiUploadImages, apiUploadsImageList } from '@/api/system/uploads'
import Pagination from '@/components/Pagination'
import { beforeUploadImageCheck, downloadImage } from '@/utils'

export default {
  name: 'Uploads',
  components: { Pagination },
  data() {
    return {
      total: 0,
      list: [],
      listLoading: true,
      listQuery: {
        page: 1,
        page_size: 30
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const { data } = await apiUploadsImageList(this.listQuery)
      this.list = data.list
      this.total = data.total
      this.listLoading = false
    },
    removeItem(item, index) {
      this.$confirm('确定删除此图片吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        apiDeleteUploadsImage({ img_id: item.img_id }).then(response => {
          this.getList()
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 5 * 1000
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    downloadItem(item, index) {
      downloadImage(item.full_url, item.img_name)
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
  .image{
    width: 100%;
    height: 200px;
  }
  .title{
    border-top: 1px solid #e7e7eb;
    padding:  5px;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
