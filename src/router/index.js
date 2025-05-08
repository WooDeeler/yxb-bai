import { createRouter, createWebHistory } from 'vue-router'

// 路由配置
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/index.vue'),
    hidden: true
  },
  {
    path: '/',
    component: () => import('../layout/index.vue'),
    redirect: '/dashboard',
    meta: { title: '首页', icon: 'House' }, 
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/dashboard/index.vue'),
        meta: { title: '首页', icon: 'House' }
      }
    ]
  },
  {
    path: '/file',
    component: () => import('../layout/index.vue'),
    meta: { title: '文件管理', icon: 'Folder' },
    children: [
      {
        path: 'list',
        name: 'FileList',
        component: () => import('../views/file/index.vue'),
        meta: { title: '文件列表' }
      }
    ]
  },
  {
    path: '/school',
    component: () => import('../layout/index.vue'),
    meta: { title: '院校管理', icon: 'School' },
    children: [
      {
        path: 'list',
        name: 'SchoolList',
        component: () => import('../views/school/index.vue'),
        meta: { title: '院校列表' }
      }
    ]
  },
  {
    path: '/major',
    component: () => import('../layout/index.vue'),
    meta: { title: '专业管理', icon: 'Management' },
    children: [
      {
        path: 'list',
        name: 'MajorList',
        component: () => import('../views/school/major.vue'),
        meta: { title: '专业列表' }
      }
    ]
  },
  {
    path: '/news',
    component: () => import('../layout/index.vue'),
    meta: { title: '新闻管理', icon: 'Document' },
    children: [
      {
        path: 'list',
        name: 'NewsList',
        component: () => import('../views/news/index.vue'),
        meta: { title: '新闻列表' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path === '/login') {
    next()
  } else {
    if (!token) {
      next('/login')
    } else {
      next()
    }
  }
})

export default router