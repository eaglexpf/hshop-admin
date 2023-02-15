/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const systemRouter = {
  path: '/third-party',
  component: Layout,
  name: '第三方系统',
  meta: { title: '第三方系统', icon: 'el-icon-s-help', alias: ['app.third-party'] },
  children: [
    {
      path: 'request-log',
      name: '请求日志',
      component: () => import('@/views/third-party/request-log/index'),
      meta: { title: '请求日志', icon: 'table', alias: ['app.third-party.request-log'] }
    }
  ]
}
export default systemRouter
