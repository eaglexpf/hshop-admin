/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const systemRouter = {
  path: '/system',
  component: Layout,
  redirect: '/system/menu',
  name: '系统设置',
  meta: { title: '系统设置', icon: 'el-icon-s-help', alias: ['app.system'] },
  children: [
    {
      path: 'menu',
      name: '菜单设置',
      component: () => import('@/views/system/menu/index'),
      meta: { title: '菜单设置', icon: 'table', alias: ['app.system.menu'] }
    },
    {
      path: 'role',
      name: '角色设置',
      component: () => import('@/views/system/role/index'),
      meta: { title: '角色设置', icon: 'table', alias: ['app.system.role'] }
    },
    {
      path: 'user',
      name: '用户设置',
      component: () => import('@/views/system/user'),
      meta: { title: '用户设置', icon: 'table', alias: ['app.system.user'] },
      allowShow: true,
      children: [
        {
          path: 'edit',
          name: '编辑用户',
          hidden: true,
          component: () => import('@/views/system/user/edit'),
          meta: { title: '编辑用户', icon: 'table', alias: ['app.system.user.edit'], activeMenu: '/system/user' }
        }
      ]
    },
    {
      path: 'uploads',
      name: '素材管理',
      component: () => import('@/views/system/uploads/index'),
      meta: { title: '素材管理', icon: 'table', alias: ['app.system.uploads'] }
    },
    {
      path: 'backend/log',
      name: '操作日志',
      component: () => import('@/views/system/log/index'),
      meta: { title: '操作日志', icon: 'table', alias: ['app.system.backend.log'] }
    },
    {
      path: 'wechat',
      name: '微信管理',
      component: () => import('@/views/system/wechat/index'),
      meta: { title: '微信管理', icon: 'table', alias: ['app.system.wechat'] }
    },
    {
      path: 'export',
      name: '导出列表',
      component: () => import('@/views/system/export/index'),
      meta: { title: '导出列表', icon: 'table', alias: ['app.system.export'] }
    }
  ]
}
export default systemRouter
