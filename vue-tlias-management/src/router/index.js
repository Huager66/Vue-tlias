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

export default router
