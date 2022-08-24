import { createRouter, createWebHashHistory } from 'vue-router'
import ServerOverview from '@/pages/GPMAdminPage/Views/ServerOverivew.vue'
const routes = [
  {
    path: '/',
    name: 'Overview',
    component: ServerOverview,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

/**
 * 取得所有路由 name 屬性
 */
export function GetRouters() {
  return routes
}

export default router
