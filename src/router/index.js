import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        // redirect: '/record/index',
        component: () => import('@/views/dashboard'),
        name: 'dashboard',
        meta: { title: '首页', icon: 'el-icon-menu', affix: true }
      }
    ]
  },
  // {
  //   path: '',
  //   component: Layout,
  //   redirect: 'dashboard',
  //   children: [
  //     {
  //       path: 'dashboard',
  //       component: () => import('@/views/dashboard/index'),
  //       name: 'Dashboard',
  //       meta: { title: 'dashboard', icon: 'dashboard', affix: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/documentation',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/documentation/index'),
  //       name: 'Documentation',
  //       meta: { title: 'documentation', icon: 'documentation', affix: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/guide',
  //   component: Layout,
  //   redirect: '/guide/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/guide/index'),
  //       name: 'Guide',
  //       meta: { title: 'guide', icon: 'guide', noCache: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/profile',
  //   component: Layout,
  //   redirect: '/profile/index',
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/profile/index'),
  //       name: 'Profile',
  //       meta: { title: 'profile', icon: 'user', noCache: true }
  //     }
  //   ]
  // }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
const asyncRoutes = [
  {
    path: '/home',
    redirect: 'noRedirect',
    component: Layout,
    meta: {
      title: '系统管理',
      icon: 'el-icon-s-home'
    },
    children: [
      {
        name: '2',
        path: 'first',
        component: () => import('@/pages/home/firstLevel'),
        meta: {
          title: '用户管理',
          icon: 'el-icon-notebook-2'
        }
      },
      {
        name: '3',
        path: 'second',
        component: () => import('@/pages/home/secLevel'),
        meta: {
          title: '组织机构管理',
          icon: 'el-icon-notebook-2'
        }
      },
      {
        name: '4',
        path: 'banner',
        component: () => import('@/pages/home/bannerMan'),
        meta: {
          title: '菜单管理',
          icon: 'el-icon-orange'
        }
      },
      {
        name: '5',
        path: 'homePic',
        component: () => import('@/pages/home/homePic'),
        meta: {
          title: '角色管理',
          icon: 'el-icon-picture-outline-round'
        }
      },
      {
        name: '6',
        path: 'dictionaries',
        component: () => import('@/pages/home/paper'),
        meta: {
          title: '字典管理',
          icon: 'el-icon-picture-outline-round'
        }
      },
      {
        name: '7',
        path: 'information',
        component: () => import('@/pages/home/information'),
        meta: {
          title: '员工健康信息',
          icon: 'el-icon-picture-outline-round'
        }
      },
      {
        name: '8',
        path: 'registration',
        component: () => import('@/pages/home/registration'),
        meta: {
          title: '出入登记',
          icon: 'el-icon-picture-outline-round'
        }
      },
      {
        name: '9',
        path: 'punck',
        component: () => import('@/pages/home/punck'),
        meta: {
          title: '上下班打卡',
          icon: 'el-icon-picture-outline-round'
        }
      },
      {
        name: '10',
        path: 'orientation',
        component: () => import('@/pages/home/orientation'),
        meta: {
          title: '定位',
          icon: 'el-icon-picture-outline-round'
        }
      },
      {
        name: '11',
        path: 'wuzi',
        component: () => import('@/pages/home/wuzi'),
        meta: {
          title: '物资管理',
          icon: 'el-icon-picture-outline-round'
        }
      },
      {
        name: '12',
        path: 'wuzi',
        component: () => import('@/pages/home/guard'),
        meta: {
          title: '门卫体温',
          icon: 'el-icon-picture-outline-round'
        }
      },
      {
        name: '13',
        path: 'scope',
        component: () => import('@/pages/home/scope'),
        meta: {
          title: '打卡范围',
          icon: 'el-icon-picture-outline-round'
        }
      },
      {
        name: '14',
        path: 'release',
        component: () => import('@/pages/home/release'),
        meta: {
          title: '发布管理',
          icon: 'el-icon-picture-outline-round'
        }
      }
    ]
  }
]

export { asyncRoutes }

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
