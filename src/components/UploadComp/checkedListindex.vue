<template>
  <div class="image-list">
    <div v-for="(item, index) in data" :key="index" class="image-item">
      <el-image
        class="image"
        :src="item.full_url"
        fit="contain"
      />
    </div>
  </div>
</template>

<script>

import Pagination from '@/components/Pagination'
export default {
  name: 'Uploads',
  // eslint-disable-next-line vue/no-unused-components
  components: { Pagination },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    data: {
      type: Array
    }
  },
  data() {
    return {
    }
  },
  created() {

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.image-list{
  display: flex;
  flex-wrap: wrap;
}
.image-item{
  width: 178px;
  height: 178px;
  margin-bottom: 20px;
  position: relative;
  border: 1px dashed #ccc;
  margin-right: 10px;
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
</style>
