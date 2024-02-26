<template>
  <div :id="id">
    <div v-if="num > 1" class="upload-list">
      <draggable v-model="data" :options="dragIssuesOptions" class="components-view" @update="draggableUpdate">
        <div v-for="(item, index) in data" :key="index" class="upload-item" @mouseenter="mouseEnter(index)" @mouseleave="mouseLeave">
          <el-image
            class="upload-item-image"
            :src="item.full_url"
            :style="'width:' + imgSize + 'px;height:' + imgSize + 'px'"
            fit="contain"
          />
          <div class="upload-item-mask" :class="(picsCurrent === index) ? 'on' : ''">
            <i class="el-icon-delete" @click="remoteUploadItem(index)" />
            <i class="el-icon-rank" />
          </div>
        </div>
      </draggable>
      <div
        class="upload-item"
        @click="handleImgChange"
      >
        <i class="el-icon-plus upload-item-icon" :style="'width:' + imgSize + 'px;height:' + imgSize + 'px;line-height:' + imgSize + 'px'" />
      </div>
    </div>
    <div v-else class="upload-list">
      <div
        v-if="data.length === 0"
        class="upload-item"
        @click="handleImgChange"
      >
        <i class="el-icon-plus upload-item-icon" :style="'width:' + imgSize + 'px;height:' + imgSize + 'px;line-height:' + imgSize + 'px'" />
      </div>
      <div v-for="(item, index) in data" v-else :key="index" class="upload-item" @mouseenter="mouseEnter(index)" @mouseleave="mouseLeave">
        <el-image
          class="upload-item-image"
          :src="item.full_url"
          :style="'width:' + imgSize + 'px;height:' + imgSize + 'px'"
          fit="contain"
          @click="handleImgChange"
        />
      </div>
    </div>
    <el-dialog
      title="本地上传"
      :visible.sync="dialogVisible"
      width="80%"
      append-to-body
      :before-close="handleClose"
      class="store-dialog"
      :close-on-click-modal="false"
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
                :before-upload="beforeUploadImage"
                :http-request="handleUpload"
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
              :page-sizes="[10, 20, 30]"
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
  </div>
</template>

<script>
import { apiUploadImages, apiUploadsImageList } from '@/api/system/uploads'
import { beforeUploadImageCheck } from '@/utils'
import Pagination from '@/components/Pagination'
import draggable from 'vuedraggable'

export default {
  name: 'SchemaDialogUploadImg',
  components: { Pagination, draggable },
  props: {
    num: {
      type: Number,
      default() {
        return 1
      }
    },
    dialogRelImg: {
      type: String,
      default() {
        return ''
      }
    },
    dialogRelData: {
      type: Array,
      default() {
        return []
      }
    },
    imgSize: {
      type: Number,
      default() {
        return 178
      }
    }
  },
  data() {
    return {
      id: '',
      data: [],
      picsCurrent: -1,
      dragIssuesOptions: {
        animation: 300,
        forceFallback: false,
        scroll: true,
        handle: '.el-icon-rank',
        draggable: '.upload-item'
      },
      dialogVisible: false,
      listQuery: {
        page: 1,
        page_size: 10
      },
      total: 0,
      list: [],
      checkIds: [],
      checkData: []
    }
  },
  watch: {
    dialogRelImg: {
      immediate: true,
      handler(val) {
        if (this.num > 1) {
          return
        }
        if (val) {
          this.data = [{ full_url: val }]
        } else {
          this.data = []
        }
      }
    },
    dialogRelData: {
      immediate: true,
      handler(val) {
        if (this.num <= 1) {
          return
        }
        const data = []
        val.forEach(row => {
          data.push({ full_url: row })
        })
        // eslint-disable-next-line no-undef
        this.data = structuredClone(data)
      }
    }
  },
  methods: {
    mouseEnter(index) {
      this.picsCurrent = index
    },
    mouseLeave() {
      this.picsCurrent = -1
    },
    remoteUploadItem(index) {
      this.picsCurrent = -1
      this.data.splice(index, 1)
    },
    draggableUpdate() {
      this.handleSubmit()
    },
    handleImgChange(index) {
      this.dialogVisible = true
      this.checkIds = []
      this.checkData = []
      this.getList()
    },
    handleClose() {
      this.checkIds = []
      this.checkData = []
      this.dialogVisible = false
    },
    async getList() {
      this.listLoading = true
      const { data } = await apiUploadsImageList(this.listQuery)
      data.list.forEach(item => {
        item.isChecked = this.checkIds.indexOf(item.img_id) !== -1
      })
      this.list = data.list
      this.total = data.total
      this.listLoading = false
    },
    handleChecked(item, index) {
      if (item.isChecked) {
        item.isChecked = false
        // eslint-disable-next-line no-undef
        this.checkData = structuredClone(this.checkData.filter(row => row.img_id !== item.img_id))
        // eslint-disable-next-line no-undef
        this.checkIds = structuredClone(this.checkIds.filter(row => row !== item.img_id))
      } else if (this.num === 1) {
        item.isChecked = true
        this.list.forEach(row => {
          if (row.img_id !== item.img_id && row.isChecked) {
            row.isChecked = false
          }
        })
        this.checkData = [item]
        this.checkIds = [item.img_id]
      } else if (this.checkIds.length + this.data.length >= this.num) {
        this.$message.warning('最多只能选择' + this.num + '张图片')
      } else {
        item.isChecked = true
        this.checkData.push(item)
        this.checkIds.push(item.img_id)
      }
      this.$forceUpdate()
    },
    handleSubmit() {
      if (this.num > 1) {
        this.checkData.forEach(item => {
          this.data.push(item)
        })
        const data = []
        this.data.forEach(row => {
          data.push(row.full_url)
        })
        this.$emit('check-change', data)
      } else {
        // eslint-disable-next-line no-undef
        this.data = structuredClone(this.checkData)
        let data = ''
        this.data.forEach(row => {
          data = row.full_url
        })
        this.$emit('check-change', data)
      }
      this.handleClose()
    },
    // 上传图片el-upload
    beforeUploadImage(file) {
      return beforeUploadImageCheck(file)
    },
    // 自定义上传
    handleUpload(e) {
      apiUploadImages(e.file).then(
        res => e.onSuccess(res),
        err => e.onError(err)
      ).catch(err => e.onError(err))
    },
    // 上传成功
    handleUploadSuccess(res, file) {
      this.$message({
        message: '上传成功',
        type: 'success',
        duration: 5 * 1000
      })
      this.getList()
    },
    // 上传错误回调
    uploadError(e) {
      console.error(e)
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-list .upload-item {
  display: inline-block;
  text-align: center;
  outline: 0;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  margin-right: 5px;
  vertical-align: middle;
  .upload-item-mask {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.2);
    cursor: pointer;
    &.on {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    i {
      margin: 0 8px;
      font-size: 20px;
      color: #fff;
    }
  }
}
.upload-list .upload-item:hover {
  border-color: #409EFF;
}
.upload-item-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.upload-item-image {
  width: 178px;
  height: 178px;
  display: block;
}

.upload_box{
  padding-bottom: 20px;
}
.image-list{
  display: flex;
  flex-wrap: wrap;
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
