<template>
  <div>
    <el-button type="primary" @click="addFormItem">{{ schema.title }}</el-button>
    <template
      v-for="(dynamicItem, dynamicIndex) in dynamicValidateForm"
    >
      <el-form
        :key="dynamicIndex"
        :inline="true"
        :model="dynamicItem"
      >
        <el-form-item
          v-for="(item, index) in formSchemaData"
          v-show="item.show !== undefined ? item.show : true"
          :key="index"
          :prop="index"
        >
          <template v-if="item.type === 'image'">
            <schema-dialog-upload-img
              :id="index + '-upload-img'"
              :dialog-rel-img="dynamicItem[index]"
              :img-size="50"
              @check-change="(val) => dialogUploadImgChange(dynamicIndex, index, val)"
            />
          </template>
          <el-switch
            v-else-if="item.type === 'switch'"
            v-model="dynamicItem[index]"
            :active-color="item.activeColor !== undefined ? item.activeColor : '#13ce66'"
            :inactive-color="item.inactiveColor !== undefined ? item.inactiveColor : '#ff4949'"
            :active-text="item.activeText !== undefined ? item.activeText : ''"
            :inactive-text="item.inactiveText !== undefined ? item.inactiveText : ''"
          />
          <template v-else-if="item.type === 'span'">
            {{ item.value }}
            <el-input
              v-show="false"
              v-model="dynamicItem[index]"
            />
          </template>
          <schema-dialog-table
            v-else-if="item.type === 'dialog'"
            :dialog-schema="item"
            :dialog-rel-data="dynamicItem[index]"
            @check-change="(val) => dialogTableChange(dynamicIndex, index, val)"
          />
          <el-radio-group
            v-else-if="item.type === 'radio'"
            v-model="dynamicItem[index]"
          >
            <template v-for="(radioItem, radioIndex) in item.radio">
              <el-radio :key="radioIndex" :label="radioItem.value">{{ radioItem.label }}</el-radio>
            </template>
          </el-radio-group>
          <el-input
            v-else
            v-model="dynamicItem[index]"
            :type="item.type"
            :show-password="item.showPassword !== undefined ? item.showPassword : false"
            :placeholder="item.placeholder"
            :clearable="item.clearable"
            :disabled="item.disabled"
            :prefix-icon="item.prefixIcon"
            :suffix-icon="item.suffixIcon"
            :readonly="item.readonly"
            :max="item.max"
            :min="item.min"
          />
        </el-form-item>
        <el-form-item>
          <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
            <i class="el-icon-delete" style="font-size: 20px;" @click="deleteFormItem(dynamicIndex)" />
          </el-tooltip>
        </el-form-item>
      </el-form>
    </template>

  </div>
</template>

<script>
import SchemaDialogUploadImg from '@/components/Schema/dialog/uploadImg'
import SchemaDialogTable from '@/components/Schema/dialog/table'
export default {
  name: 'SchemaDynamicFormArray',
  components: { SchemaDialogUploadImg, SchemaDialogTable },
  props: {
    dynamicSchema: {
      type: Object,
      default() {
        return {}
      }
    },
    dynamicRelData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      // schema
      schema: {},
      formSchemaData: {},
      ruleForm: {},
      dynamicValidateForm: []
    }
  },
  watch: {
    dynamicSchema: {
      deep: true,
      immediate: true,
      handler(val) {
        this.schema = val
        this.formSchemaData = val['dynamic-form-array'].form
        this.ruleForm = val['dynamic-form-array'].ruleForm
        this.dynamicValidateForm = []
        // eslint-disable-next-line no-undef
        this.dynamicValidateForm.push(structuredClone(this.ruleForm))
      }
    },
    dynamicValidateForm: {
      deep: true,
      immediate: true,
      handler(val) {
        this.$emit('change', val)
      }
    },
    dynamicRelData: {
      immediate: true,
      handler(val) {
        if (JSON.stringify(val) === JSON.stringify(this.dynamicValidateForm)) {
          return
        }
        // eslint-disable-next-line no-undef
        this.dynamicValidateForm = structuredClone(val)
      }
    }
  },
  methods: {
    addFormItem() {
      // eslint-disable-next-line no-undef
      this.dynamicValidateForm.push(structuredClone(this.ruleForm))
    },
    deleteFormItem(index) {
      this.dynamicValidateForm.splice(index, 1)
    },
    dialogTableChange(dynamicIndex, index, val) {
      this.dynamicValidateForm[dynamicIndex][index] = val
    },
    dialogUploadImgChange(dynamicIndex, index, val) {
      this.dynamicValidateForm[dynamicIndex][index] = val
    }
  }
}
</script>

<style scoped>
.el-form {
  padding-top: 10px;
}
.el-form-item {
  vertical-align: middle;
}
</style>
