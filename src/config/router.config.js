// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, PageView } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'
export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/dashboard/workspace',
    children: [
      // 首页
      {
        path: '/dashboard',
        name: 'dashboard',
        redirect: '/dashboard/workspace',
        component: PageView,
        hideChildrenInMenu: true,
        meta: { title: '控制台', keepAlive: true, icon: bxAnaalyse },
        children: [
          {
            path: '/dashboard/workspace',
            name: 'WorkSpace',
            component: () => import('@/views/dashboard/WorkSpace'),
            meta: { title: '首页', keepAlive: true }
          },{
            path: '/dashboard/about',
            name: 'About',
            component: () => import('@/views/about/About'),
            meta: { title: '关于我们', keepAlive: true ,hiddenHeaderContent:true},
            hidden:true
          }
        ]
      },
      {
        path: '/info',
        redirect: '/info/warehouse',
        component: PageView,
        name: 'Warehouse',
        meta: { title: '信息管理', icon: 'form' },
        children: [
          {
            path: '/info/warehouse',
            name: 'Warehouse',
            component:  () => import('@/views/info/Warehouse'),
            meta: { title: '仓库管理', keepAlive: true },
          },
          {
            path: '/info/store',
            name: 'Store',
            component:  () => import('@/views/info/Store'),
            meta: { title: '门店管理', keepAlive: true },
          },
          {
            path: '/info/goods',
            name: 'Goods',
            component: () => import('@/views/info/Goods'),
            meta: { title: '商品管理'},
            hidden:true
          },
          {
            path: '/info/driver',
            name: 'Driver',
            component:  () => import('@/views/info/Driver'),
            meta: { title: '司机管理', keepAlive: true },
          },
          {
            path: '/info/truck',
            name: 'Truck',
            component:  () => import('@/views/info/Truck'),
            meta: { title: '车辆管理', keepAlive: true },
          },
          {
            path: '/info/truck/setdriver',
            name: 'SetDriver',
            component:  () => import('@/views/info/SetDriver'),
            meta: { title: '更换司机', keepAlive: true },
            hidden:true
          },
        ]
      },
     

      // 需求管理
      {
        path: '/need',
        name: 'Need',
        component: PageView,
        redirect: '/need/manage',
        meta: { title: '需求管理', icon: 'table' },
        children: [
          {
            path: '/need/list',
            name: 'NeedList',
            hideChildrenInMenu: true,  
            component: () => import('@/views/need/NeedList'),
            meta: { title: '需求审核', keepAlive: true }
          },
          {
            path: '/need/info',
            name: 'NeedInfo',
            component: () => import('@/views/need/NeedInfo'),
            meta: { title: '需求详情', keepAlive: true },
            hidden:true
          },
          {
            path: '/need/goods',
            name: 'NeedGoods',
            hideChildrenInMenu: true,  
            component: () => import('@/views/need/NeedGoods'),
            meta: { title: '需求配送', keepAlive: true }
          },
          {
            path: '/need/goods/temp',
            name: 'NeedGoodsTemp',
            component: () => import('@/views/need/NeedGoodsTemp'),
            meta: { title: '配送确认'},
            hidden:true
          }
        ]
      },

      // 运输管理
      {
        path: '/transport',
        name: 'Transport',
        component: PageView,
        redirect: '/transport/list',
        meta: { title: '运输管理', icon: 'profile' },
        hideChildrenInMenu: true,
        children: [
          {
            path: '/transport/list',
            name: 'Transport',
            component: () => import('@/views/transport/Transport'),
            meta: { title: '运输管理', keepAlive: true }
          },
          {
            path: '/transport/info',
            name: 'TransportInfo',
            hideChildrenInMenu: true,  
            component: () => import('@/views/transport/TransportInfo'),
            meta: { title: '运输单详情', keepAlive: true }
          },
        ]
      },

 

      // 系统管理
      {
        path: '/sys',
        name: 'sys',
        component: PageView,
        redirect: '/sys/admin',
        meta: { title: '系统管理', icon: 'warning' },
        children: [
  
          {
            path: '/sys/admin',
            name: 'exception',
            component: () => import('@/views/exception/404.vue'),
            meta: { title: '管理员管理' }
          },
          {
            path: '/sys/rode',
            name: 'rode',
            component: () => import('@/views/exception/404.vue'),
            meta: { title: '权限管理' },
          }
        ]
      },
    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'retrieve-pwd',
        name: 'RetrievePwd',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RetrievePwd')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      }
    ]
  },{
    path: '/about',
    name: 'CommonAbout',
    component: () => import(/* webpackChunkName: "user" */ '@/views/about/AboutCommon')
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  },

]
