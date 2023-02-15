<template>
  <div :class="{'component-wrap' : true, 'active': active}">
    <div class="current-active" />
    <div v-if="result.base.title" class="component-header">
      <div class="component-title">
        <div>{{ result.base.title }}</div>
        <div class="subtitle">{{ result.base.sub_title }}</div>
      </div>
      <div class="component-more">
        <div class="three-dot" />
      </div>
    </div>
    <el-carousel indicator-position="none" arrow="never" :autoplay="true" @change="change">
      <el-carousel-item v-for="(item, index) in result.data" :key="index">
        <div class="box-center">
          <el-image :src="item.imgUrl || 'https://fakeimg.pl/320x'+ config.height + '/EFEFEF/CCC/?text=image&font=lobster'" fit="contain"></el-image>

          <div class="text-deploy">

            <!-- 模板1 -->
<!--            <div class="template current-page">-->
<!--              <div class='text1 animation1'> {{data[config.current].mainTitle}}</div>-->
<!--              <div class='text2 animation2'>{{data[config.current].subtitle}}</div>-->
<!--              <div class='text3 animation3'>{{data[config.current].subtitleTow}}</div>-->
<!--              <div class='text4 animation4' :style="'border-color:'+base.WordColor">{{data[config.current].button}}</div>-->
<!--            </div>-->

          </div>

        </div>
        <h3>{{ item.contents }}</h3>
      </el-carousel-item>
    </el-carousel>
    <div v-if="currentIndex >= 0 && result.data[currentIndex].content" class="slider-caption">
      {{ result.data[currentIndex].content }}
    </div>
  </div>
</template>
<script>
export default {
  props: {
    componentData: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {}
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      config: {
        height: '240'
      },
      result: {
        base: {
          title: '',
          sub_title: ''
        },
        data: []
      },
      currentIndex: -1
    }
  },
  watch: {
    componentData: {
      deep: true,
      immediate: true,
      handler(value) {
        if (value) {
          // object是引用类型，直接赋值的时候子组件内数据改变是会造成父组件数据的改变
          // Object.assign可以切断引用
          this.result = Object.assign({}, value)
        }
      }
    }
  },
  methods: {
    change(index, oldIndex) {
      this.currentIndex = index
    }
  }
}
</script>
<style scoped lang="scss">
.box-center{
  height: 100%;
  text-align: center;
}
.el-carousel .el-image{
  height: 100%;
}
.slider-caption {
  padding: 10px 15px;
  color: #999;
}
</style>
