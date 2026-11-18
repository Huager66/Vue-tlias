import { createRouter, createWebHashHistory } from 'vue-router'
import IndexView from '@/views/index/index.vue'
import ClazzView from '@/views/clazz/index.vue'
import DeptView from '@/views/dept/index.vue'
import EmpView from '@/views/emp/index.vue'
import LogView from '@/views/log/index.vue'
import StuView from '@/views/stu/index.vue'
import EmpReportView from '@/views/empReport/index.vue'
import StuReportView from '@/views/stuReport/index.vue'
import LayoutView from '@/views/layout/index.vue'
import LoginView from '@/views/login/index.vue'
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
       path: '/',
      redirect: '/login'
    },
     { path: '/login', name: 'login', component: LoginView },
    {
      path: '/',
      component: LayoutView,
      children: [
        { path: 'index', name: 'index1', component: IndexView },
        { path: 'clazz', name: 'clazz', component: ClazzView },
        { path: 'stu', name: 'stu', component: StuView },
        { path: 'dept', name: 'dept', component: DeptView },
        { path: 'emp', name: 'emp', component: EmpView },
        { path: 'log', name: 'log', component: LogView },
        { path: 'empReport', name: 'empReport', component: EmpReportView },
        { path: 'stuReport', name: 'stuReport', component: StuReportView },
      ],
    },
  ],
})

// 路由守卫【关键！】
router.beforeEach((to, from, next) => {
  // 拿到本地登录信息
  const loginUser = JSON.parse(localStorage.getItem('loginUser'))
  // 去登录页：直接放行
  if (to.path === '/login') {
    next()
  } else {
    // 去其他页面：判断有没有登录信息
    if (loginUser && loginUser.token) {
      next()
    } else {
      // 没登录，跳登录
      next('/login')
    }
  }
})
export default router
