<template>
  <section class="section">
    <div class="section-header with-border">
      设置
    </div>
    <div class="section-body">
      <el-form label-width="100px">
        <el-form-item label="标题">
          <el-input v-model="result.base.title" type="text" />
        </el-form-item>
        <el-form-item label="副标题">
          <el-input v-model="result.base.sub_title" />
        </el-form-item>
        <el-form-item label="轮播项">
          <div v-for="(item, index) in result.data" :key="index" class="setting-item slider">
            <div class="setting-remove" @click="removeItem(index)">
              <i class="el-icon-delete" />
            </div>
            <img
              v-if="item.imgUrl"
              :src="item.imgUrl"
              class="banner-uploader"
              @click="handleImgChange(index)"
            />
            <div
              v-else
              class="banner-uploader"
              @click="handleImgChange(index)"
            >
              <i class="el-icon-plus avatar-uploader-icon" />
              上传图片
            </div>
            <div class="uploader-setting">
              <el-input
                v-model="item.content"
                type="textarea"
                placeholder="文字描述"
              />

              <div class="goods-select" @click="handleGoodsChange(index)">
<!--                <div v-if="item.id" class="link-content">-->
<!--                  <template v-if="item.linkPage === 'goods'">商品：</template>-->
<!--                  <template v-if="item.linkPage === 'category'">分类：</template>-->
<!--                  <template v-if="item.linkPage === 'article'">文章：</template>-->
<!--                  <template v-if="item.linkPage === 'planting'">软文：</template>-->
<!--                  <template v-if="item.linkPage === 'link'">页面：</template>-->
<!--                  <template v-if="item.linkPage === 'marketing'">营销：</template>-->
<!--                  {{ item.title }}-->
<!--                </div>-->
                <div class="content-center">
                  <i
                    class="iconfont icon-link"
                    @click="handleGoodsChange(index)"
                  />
                  设置路径
                </div>
              </div>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div class="content-center">
        <div class="frm-tips">
          只能上传jpg/png文件，且不超过2M （建议尺寸：375px * 200px） (max10)
        </div>
        <el-button
          :disabled="result.data && result.data.length >= 10"
          type="default"
          class="iconfont icon-plus-circle banner-button-uploader"
          @click="addItem"
        ><i class="el-icon-upload" /> 添加轮播图</el-button>
      </div>
    </div>
    <UploadComp ref="UploadComp" :is-single="checkedUploadData.isSingle" @confirmUpload="confirmUpload" />
  </section>
</template>

<script>
import UploadComp from '@/components/UploadComp'
export default {
  components: {
    // eslint-disable-next-line vue/no-unused-components
    UploadComp
  },
  props: {
    editorData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      result: {
        base: {
          title: '',
          sub_title: ''
        }
      },
      checkedUploadData: {
        index: -1,
        isSingle: false
      }
    }
  },
  watch: {
    editorData: {
      deep: true,
      immediate: true,
      handler(value) {
        if (value) {
          // object是引用类型，直接赋值的时候子组件内数据改变是会造成父组件数据的改变
          // 适用json切断引用
          this.result = JSON.parse(JSON.stringify(value))
        }
      }
    },
    result: {
      deep: true,
      handler(value) {
        if (value) {
          this.$emit('bindComponentEditorDataChange', value)
        }
      }
    }
  },
  methods: {
    addItem() {
      if (!this.result.data) {
        this.result.data = []
      }
      const item = {
        imgUrl: '',
        linkPage: '',
        content: '',
        id: '',
        template: 'one'
      }
      if (this.result.data.length > 9) {
        this.$message({
          message: '轮播图最多添加10个图片',
          type: 'error',
          duration: 5 * 1000
        })
      } else {
        this.result.data.push(item)
        this.result = Object.assign({}, this.result)
      }
      this.$forceUpdate()
    },
    removeItem(index) {
      this.result.data.splice(index, 1)
      this.$forceUpdate()
    },
    handleImgChange1(index) {
    },
    handleImgChange(index) {
      this.$refs.UploadComp.showDialog()
      this.checkedUploadData = {
        index: index,
        isSingle: true
      }
    },
    confirmUpload(data) {
      console.log(data)
      if (data.length > 0) {
        if (this.checkedUploadData.isSingle) {
          this.result.data[this.checkedUploadData.index].imgUrl = data[0].full_url
        }
        console.log(2222222, this.result.data)
        this.$forceUpdate()
      }
    },
    handleGoodsChange(index) {

    }
  }
}
</script>

<style scoped lang="scss">
.banner-button-uploader {
  font-size: 16px;
  i{
    font-size: 20px;
  }
}
</style>
