/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const goodsRouter = {
  path: '/goods',
  component: Layout,
  redirect: '/goods/spu',
  name: '商品',
  meta: { title: '商品', icon: 'el-icon-s-help', alias: ['app.goods'] },
  children: [
    {
      path: 'spu',
      name: '商品列表',
      component: () => import('@/views/goods/spu/index'),
      redirect: '/goods/spu/list',
      meta: { title: '商品列表', icon: 'table', alias: ['app.goods.spu'] },
      children: [
        {
          path: 'list',
          name: '商品列表',
          hidden: true,
          component: () => import('@/views/goods/spu/list'),
          meta: { icon: 'table', routerView: true, alias: ['app.goods.spu.list'], activeMenu: '/goods/spu' }
        },
        {
          path: 'create',
          name: '添加商品',
          hidden: true,
          component: () => import('@/views/goods/spu/create'),
          meta: { title: '添加商品', icon: 'table', routerView: true, alias: ['app.goods.spu.create'], activeMenu: '/goods/spu' }
        },
        {
          path: 'update',
          name: '修改商品',
          hidden: true,
          component: () => import('@/views/goods/spu/update'),
          meta: { title: '修改商品', icon: 'table', routerView: true, alias: ['app.goods.spu.update'], activeMenu: '/goods/spu' }
        }
      ]
    },
    {
      path: 'category',
      name: '商品分类',
      component: () => import('@/views/goods/category/index'),
      meta: { title: '商品分类', icon: 'table', alias: ['app.goods.category'] },
      children: [
        {
          path: 'create',
          name: '添加分类',
          hidden: true,
          component: () => import('@/views/goods/category/create'),
          meta: { title: '添加分类', icon: 'table', routerView: true, alias: ['app.goods.category.create'], activeMenu: '/goods/category' }
        },
        {
          path: 'update',
          name: '修改分类',
          hidden: true,
          component: () => import('@/views/goods/category/update'),
          meta: { title: '修改分类', icon: 'table', routerView: true, alias: ['app.goods.category.update'], activeMenu: '/goods/category' }
        }
      ]
    },
    {
      path: 'brand',
      name: '商品品牌',
      component: () => import('@/views/goods/brand/index'),
      meta: { title: '商品品牌', icon: 'table', alias: ['app.goods.brand'] },
      children: [
        {
          path: 'create',
          name: '添加品牌',
          hidden: true,
          component: () => import('@/views/goods/brand/create'),
          meta: { title: '添加品牌', icon: 'table', routerView: true, alias: ['app.goods.brand.create'], activeMenu: '/goods/brand' }
        },
        {
          path: 'update',
          name: '修改品牌',
          hidden: true,
          component: () => import('@/views/goods/brand/update'),
          meta: { title: '修改品牌', icon: 'table', routerView: true, alias: ['app.goods.brand.update'], activeMenu: '/goods/brand' }
        }
      ]
    },
    {
      path: 'spec',
      name: '商品规格',
      component: () => import('@/views/goods/spec/index'),
      meta: { title: '商品规格', icon: 'table', alias: ['app.goods.spec'] },
      children: [
        {
          path: 'create',
          name: '添加规格',
          hidden: true,
          component: () => import('@/views/goods/spec/create'),
          meta: { title: '添加规格', icon: 'table', routerView: true, alias: ['app.goods.spec.create'], activeMenu: '/goods/spec' }
        },
        {
          path: 'update',
          name: '修改规格',
          hidden: true,
          component: () => import('@/views/goods/spec/update'),
          meta: { title: '修改规格', icon: 'table', routerView: true, alias: ['app.goods.spec.update'], activeMenu: '/goods/spec' }
        }
      ]
    },
    {
      path: 'params',
      name: '商品参数',
      component: () => import('@/views/goods/params/index'),
      meta: { title: '商品参数', icon: 'table', alias: ['app.goods.params'] },
      children: [
        {
          path: 'create',
          name: '添加参数',
          hidden: true,
          component: () => import('@/views/goods/params/create'),
          meta: { title: '添加参数', icon: 'table', routerView: true, alias: ['app.goods.params.create'], activeMenu: '/goods/params' }
        },
        {
          path: 'update',
          name: '修改参数',
          hidden: true,
          component: () => import('@/views/goods/params/update'),
          meta: { title: '修改参数', icon: 'table', routerView: true, alias: ['app.goods.params.update'], activeMenu: '/goods/params' }
        }
      ]
    }
  ]
}
export default goodsRouter
