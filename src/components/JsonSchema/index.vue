<template>
  <el-dialog :visible.sync="dialogVisible" :title="'编辑模板'" fullscreen lock-scroll>
    <section class="view-warp">
      <draggable v-model="initData" :options="dragIssuesOptions" class="complete-icon-view" @start="onStart" @end="onEnd">
        <div v-for="element in initData" :key="element.alias" class="list-complete-control">
          <div class="list-complete-item">
            <i :class="element.icon" />
            <span>{{ element.name }}</span>
          </div>
        </div>
      </draggable>
      <div class="template-view">
        <div class="template">
          <div class="template-header">
            <div class="template-title" :style="'background: #fff url('+ require('@/assets/topbar.png') +') no-repeat bottom; background-size: 100% auto;'">
              <span>标题</span>
            </div>
          </div>

          <div class="components-container">
            <draggable v-model="components" :options="dragViewOptions" class="components-wrap1" @start="onEditorStart" @end="onEditorEnd">
              <div v-for="(item, index) in components" :key="index" class="component-item" :style="{top:index === 0 && index === editorIndex ? '3px' : '0'}" @click="setCurrent(index)">
                <transition name="el-fade-in-linear">
                  <div v-if="editorIndex === index" class="iconfont icon-trash-alt" @click="removeCurrent"><i class="el-icon-delete" /></div>

                </transition>
                <swiper v-if="item.alias === 'swiper'" :component-data="item" :active="index === editorIndex" />
              </div>
            </draggable>
          </div>

        </div>
      </div>
      <div class="setting-view">
        <div v-if="editorIndex === null" class="view-placeholder">
          <i class="el-icon-edit-outline iconfont" />
          请选择左侧挂件
        </div>
        <template v-else>
          <swiper_editor :editor-data="editorData" @bindComponentEditorDataChange="componentEditorDataChange" />
        </template>
      </div>
    </section>
    <section class="section-white content-center">
      <el-button class="btn-save" type="primary" @click="saveConfig">保存</el-button>
    </section>
  </el-dialog>
</template>
<script>
import draggable from 'vuedraggable'
import swiper from '@/components/JsonSchema/template/swiper'
import swiper_editor from '@/components/JsonSchema/template/swiper_editor'

export default {
  name: 'JsonSchema',
  components: { draggable, swiper, swiper_editor },
  props: {
    // dialogVisible: {
    //   type: Boolean,
    //   default: false
    // }
  },
  data() {
    return {
      dragIssuesOptions: {
        group: {
          name: 'easyview',
          pull: 'clone', // B组拖拽时克隆到A组
          put: false
        },
        sort: false,
        fallbackClass: 'fallback-class',
        chosenClass: 'chosen-class',
        forceFallback: false
      },
      dragViewOptions: {
        group: {
          name: 'easyview'
        },
        animation: 300,
        forceFallback: false,
        scroll: true
      },
      initData: [
        {
          id: 1,
          name: '热区图',
          alias: 'picture',
          icon: 'el-icon-picture-outline',
          base: {
            title: '标题',
            sub_title: '副标题'
          }
        },
        {
          id: 2,
          name: '轮播图',
          alias: 'swiper',
          icon: 'el-icon-monitor',
          base: {
            title: '标题',
            sub_title: '副标题',
            padded: true
          }
        },
        {
          id: 3,
          name: '视频',
          alias: 'video',
          icon: 'el-icon-video-camera',
          base: {
            title: '标题',
            sub_title: '副标题'
          }
        }
      ],
      components: [],
      cacheChoseInitData: {},
      dialogVisible: false,
      editorIndex: null,
      editorData: {}
    }
  },
  watch: {
    components: {
      deep: true,
      handler(value) {
        console.log('components change', value)
      }
    },
    initData: {
      deep: true,
      handler(value) {
        console.log('initData change', value)
      }
    }
  },
  methods: {
    showDialog() {
      this.dialogVisible = true
    },
    // 拖拽绑定事件
    onStart(evt) {
      this.cacheChoseInitData = JSON.stringify(this.initData[evt.oldIndex])
    },
    onEnd(evt) {
      this.initData[evt.oldIndex] = JSON.parse(this.cacheChoseInitData)
      this.setCurrent(evt.newIndex)
    },
    onEditorStart(evt) {
    },
    onEditorEnd(evt) {
      if (this.editorIndex === evt.oldIndex) {
        this.setCurrent(evt.newIndex)
        return
      }
      if (this.editorIndex < evt.oldIndex && this.editorIndex < evt.newIndex) {
        return
      }
      if (this.editorIndex > evt.oldIndex && this.editorIndex > evt.newIndex) {
        return
      }
      if (evt.oldIndex < evt.newIndex) {
        this.setCurrent(this.editorIndex - 1)
      } else {
        this.setCurrent(this.editorIndex + 1)
      }
    },
    // 设置当前编辑的组件
    setCurrent(val) {
      this.editorIndex = val
      // object是引用类型，直接赋值的时候子组件内数据改变是会造成父组件数据的改变
      this.editorData = JSON.parse(JSON.stringify(this.components[val]))
    },
    // 删除当前组件
    removeCurrent() {
      this.$confirm('确认删除当前组件？')
        .then(_ => {
          this.editorData = {}
          this.components.splice(this.editorIndex, 1)
          this.editorIndex = null
        })
        .catch(_ => {})
    },
    componentEditorDataChange(val) {
      console.log('bind', this.editorIndex, val, this.components)
      this.$set(this.components, this.editorIndex, val)
    },
    saveConfig() {
      console.log('save')
    }
  }
}
</script>

<style lang="scss">
.view-warp {
  position: relative;
  padding-bottom: 20px;
}
.complete-icon-view {
  position: absolute;
  top: 0;
  left: 0;
  width: 80px;
  height: 100%;
  overflow: auto;
}
.list-complete-control {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 75px;
  text-align: center;
}
.list-complete-item {
  margin: 5px;
  width: 50px;
  height: 100%;
  text-align: center;
  float: left;
  font-size: 50px;
  color: #24292e;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}
.list-complete-item span {
  font-size: 14px;
}

.template-view {
  width: 460px;
  margin-left: 80px;
  overflow-y: scroll;
  background: #efefef;
}
.template-view .template {
  position: relative;
}
.template-view .template .template-header {
  padding-top: 20px;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
}
.template-view .template .template-header .template-title {
  width: 320px;
  height: 60px;
  margin: 0 auto;
  text-align: center;
}
.template-view .template .template-header .template-title span {
  display: inline-block;
  padding-top: 30px;
}
.fallback-class {
  width: 50px;
  height: 50px;
}
.components-container {
  position: relative;
  padding-top: 80px;
  padding-bottom: 40px;
  overflow-y: scroll;
  height: calc(100vh - 180px);
  .chosen-class {
    position: relative;
    height: 50px;
    text-align: center;
    .list-complete-item {
      display: none;
    }
    &::after {
      position: absolute;
      top: 0;
      left: 50px;
      height: 100%;
      width: 360px;
      bottom: 0;
      background: #ffb28b;
      box-shadow: inset 0 0 0 2px #ff5000;
      content: "";
    }
  }
  .component-wrap{
    position: relative;
    width: 320px;
    margin: 0 auto;
    padding: 10px 0;
    cursor: pointer;
    background: #fff;
    .current-active {
      position: absolute;
      left: -3px;
      top: -3px;
      right: -3px;
      bottom: -3px;
      border: 3px solid #ff5000;
      z-index: -1;
      opacity: 0;
      box-shadow: 0 0 5px rgba(255, 80, 0, 0.3);
      background: rgba(255, 80, 0, 0.2);
      transition: all 0.3s ease;
    }
    &.active .current-active {
      opacity: 1;
      z-index: 999;
    }
    .component-header {
      display: flex;
      align-items: center;
      padding: 0 10px 5px 10px;
      .component-title {
        display: flex;
        align-items: flex-end;
        flex: 1;
        font-size: 16px;
        &.middle {
          align-items: center;
        }
        .subtitle {
          padding-left: 5px;
          font-size: 12px;
          color: #999;
        }
      }
      .component-more {
        display: flex;
        justify-content: center;
        width: 25px;
        .three-dot {
          position: relative;
          width: 4px;
          height: 4px;
          background: #333;
          border-radius: 50%;
          &::before,
          &::after {
            position: absolute;
            width: 4px;
            height: 4px;
            background: #333;
            border-radius: 50%;
            content: "";
          }
          &::before {
            transform: translateX(-160%);
          }
          &::after {
            transform: translateX(160%);
          }
        }
      }
    }
    .component-body {
      &.with-padding {
        padding: 0 10px;
      }
    }
  }
  .components-wrap1 {
    height: 100%;
    overflow-y: scroll;
  }
  .component-item {
    position: relative;
    .icon-trash-alt {
      position: absolute;
      right: 25px;
      color: #ff5000;
      cursor: pointer;
    }
  }
}
.setting-view {
  position: absolute;
  left: 540px;
  top: 0;
  right: 0;
  height: 100%;
  .view-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #dadadd;
    font-size: 14px;
    .iconfont {
      font-size: 42px;
    }
  }
}
.setting-view {
  .section {
    position: relative;
    height: 100%;
    .section-header {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      background: #f8f8f8;
      z-index: 20;
    }
    .section-body {
      overflow-y: auto;
      overflow-x: hidden;
      padding-top: 60px;
      height: 100%;
    }
  }
}
.setting-item {
  display: flex;
  position: relative;
  margin-bottom: 10px;
  .setting-remove {
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;
    color: #ff5000;
  }
  .banner-uploader:last-child {
    margin-bottom: 0;
  }
}
.el-form-item__content .setting-item:last-child {
  margin-bottom: 0;
}
.item-selected {
  .thumbnail {
    display: block;
    width: 60px;
    height: 60px;
    line-height: 55px;
    margin-right: 10px;
  }
}
</style>
