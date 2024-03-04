<template>
  <div v-loading="loading" class="app-container">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-position="right"
      label-width="100px"
    >
      <el-card>
        <div slot="header">
          <span>基础信息</span>
        </div>
        <div class="card-body">
          <el-row :gutter="layout.gutter">
            <el-col :xs="layout.xs" :sm="layout.sm" :md="layout.md" :lg="layout.lg">
              <el-form-item
                label="商品标题"
                prop="spu_name"
              >
                <el-input
                  v-model="ruleForm.spu_name"
                  type="text"
                  placeholder="请输入商品标题"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :xs="layout.xs" :sm="layout.sm" :md="layout.md" :lg="layout.lg">
              <el-form-item
                label="商品分类"
                prop="category_ids"
              >
                <el-cascader
                  v-model="ruleForm.category_ids"
                  :options="goodsCategoryData"
                  :props="{ multiple: true }"
                  collapse-tags
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :xs="layout.xs" :sm="layout.sm" :md="layout.md" :lg="layout.lg">
              <el-form-item
                label="商品价格"
                prop="spu_price"
              >
                <el-input
                  v-model.number="ruleForm.spu_price"
                  placeholder="请输入商品价格，单位分"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="layout.gutter">
              <el-form-item
                label="商品描述"
                prop="spu_brief"
              >
                <el-input v-model="ruleForm.spu_brief" type="textarea" />
              </el-form-item>
            </el-col>
            <el-col :span="layout.gutter">
              <el-form-item
                label="商品缩略图"
                prop="spu_thumb"
              >
                <schema-dialog-upload-img
                  :dialog-rel-img="ruleForm.spu_thumb"
                  @check-change="(val) => dialogUploadImgChange('spu_thumb', val)"
                />
              </el-form-item>
            </el-col>
            <el-col :span="layout.gutter">
              <el-form-item
                label="商品轮播图"
                prop="spu_images"
              >
                <schema-dialog-upload-img
                  :num="9"
                  :dialog-rel-data="ruleForm.spu_images"
                  @check-change="(val) => dialogUploadImgChange('spu_images', val)"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-card>
      <el-card>
        <div slot="header">
          <span>商品参数</span>
          <el-button style="float: right;" type="primary" size="mini" @click="choseGoodsParams">选择参数</el-button>
        </div>
        <el-form-item prop="params_value" label-width="0">
          <div class="card-body">
            <el-row :gutter="layout.gutter">
              <el-col v-for="(item, index) in goodsParamsData" :key="index" :xs="layout.xs" :sm="layout.sm" :md="layout.md" :lg="layout.lg">
                <el-form-item
                  :label="item.label"
                >
                  <el-select
                    v-model="ruleForm.params_value[item.id]"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="val in item.options"
                      :key="val.value"
                      :label="val.label"
                      :value="val.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form-item>
      </el-card>
      <el-card>
        <div slot="header">
          <span>图文详情</span>
        </div>
        <el-form-item prop="spu_intro" label-width="0">
          <div class="card-body">
            <Tinymce ref="editor" v-model="ruleForm.spu_intro" :height="500" />
          </div>
        </el-form-item>
      </el-card>
    </el-form>
    <div slot="footer" style="text-align: center;">
      <el-button type="primary" @click="resetForm">重置</el-button>
      <el-button type="primary" @click="createGoodsSpu">保存</el-button>
    </div>
    <chose-dialog-goods-params :visible="goodsParamsDialogVisible" :dialog-rel-data="goodsParamsIds" @change="choseGoodsParamsValueChange" @close="closeChoseDialogGoodsParams" />
  </div>
</template>

<script>
import SchemaDialogUploadImg from '@/components/Schema/dialog/uploadImg'
import ChoseDialogGoodsParams from './components/choseDialogGoodsParams'
import Tinymce from '@/components/Tinymce'
import { apiGoodsCategoryCascadeList } from '@/api/goods/category'
import { apiGoodsSpuCreate } from '@/api/goods/spu'
import rules from './formFule'
import layout from '@/utils/formItemLayout'
export default {
  name: 'GoodsSpuCreate',
  components: { SchemaDialogUploadImg, ChoseDialogGoodsParams, Tinymce },
  data() {
    return {
      loading: false,
      layout: layout,
      goodsCategoryData: [],
      goodsParamsIds: [],
      goodsParamsData: [],
      ruleForm: {
        spu_name: '',
        spu_brief: '',
        spu_price: '',
        spu_thumb: '',
        spu_images: [],
        spu_intro: '',
        category_ids: [],
        brand_ids: [],
        params_value: {}
      },
      rules: rules,
      // goods params dialog
      goodsParamsDialogVisible: false
    }
  },
  mounted() {
    this.getGoodsCategoryData()
  },
  methods: {
    getGoodsCategoryData() {
      this.loading = true
      apiGoodsCategoryCascadeList().then((res) => {
        this.goodsCategoryData = res.data
      }).finally(() => {
        this.loading = false
      })
    },
    dialogUploadImgChange(index, val) {
      this.ruleForm[index] = val
    },
    choseGoodsParams() {
      this.goodsParamsDialogVisible = true
    },
    choseGoodsParamsValueChange(val) {
      const data = []
      const ids = []
      val.forEach((item) => {
        const options = []
        item.params_value.forEach((children) => {
          options.push({
            label: children['params_value_name'],
            value: children['params_value_id']
          })
        })
        ids.push(item.params_id)
        data.push({
          id: item.params_id,
          label: item.params_name,
          options: options
        })
      })
      this.goodsParamsData = data
      this.goodsParamsIds = ids
    },
    closeChoseDialogGoodsParams() {
      this.goodsParamsDialogVisible = false
    },
    resetForm() {
      this.$refs['ruleForm'].resetFields()
    },
    createGoodsSpu() {
      this.$refs['ruleForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.loading = true
        apiGoodsSpuCreate(this.ruleForm).then((res) => {
          if (res['code'] === 0) {
            this.$notify.success('添加成功')
            this.$router.go(-1)
          }
        }).finally(() => {
          this.loading = false
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.card-body {
  .el-select{
    width: 100%;
  }
}
.el-card+.el-card {
  margin-top: 20px;
}
</style>
