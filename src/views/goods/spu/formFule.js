const rules = {
  spu_name: [
    { required: true, message: '商品名称必填', trigger: 'change' }
  ],
  price_min: [
    { required: true, message: '商品价格必填', trigger: 'change' },
    { type: 'number', message: '商品价格必须为数字', trigger: 'change' },
    { validator: (rule, value, callback) => {
      if (value < 1) {
        callback(new Error('商品价格最小为1'))
      }
      callback()
    }, trigger: 'change' }
  ],
  spu_thumb: [
    { required: true, message: '商品缩略图必填', trigger: 'change' }
  ],
  spu_images: [
    { required: true, message: '商品轮播图必填', trigger: 'change' }
  ],
  spu_intro: [
    { required: true, message: '图文详情必填', trigger: 'change' }
  ],
  category_ids: [
    { required: true, message: '商品分类必填', trigger: 'change' }
  ],
  params_value: [
    { required: true, message: '商品参数必填', trigger: 'change' },
    { validator: (rule, value, callback) => {
      for (const key in value) {
        if (value[key] === '') {
          callback(new Error('请选择参数值'))
        }
      }
      callback()
    }, trigger: 'change' }
  ]
}

export default rules
