import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
// import LogView from '../components/LogView.vue'
import AdminView from '../views/AdminView.vue'
import IDMS from '@/components/IDMS/MainPage.vue'
import ModuleStatesListViewVue from '@/components/IDMS/ModuleStatesListView.vue'
import QueryPage from '@/components/IDMS/QueryPage.vue'
import { configs } from '@/config'

var gmm_mode_routes = [
  {
    path: '/',
    name: 'SSM',
    component: HomeView,
  },
  {
    path: '/admin',
    name: 'ADMIN',
    component: AdminView,
  },
]

var gpm_mode_routes = [
  {
    path: '/',
    name: '診斷頁面',
    component: IDMS,
  },
  {
    path: '/idms/module-states',
    name: '感測器狀態',
    component: ModuleStatesListViewVue,
  },
  {
    path: '/idms/query',
    name: 'Query',
    component: QueryPage,
  },
]

var dev_mode_routes = [
  {
    path: '/',
    name: 'SSM',
    component: HomeView,
  },
  {
    path: '/admin',
    name: 'ADMIN',
    component: AdminView,
  },
  {
    path: '/idms',
    name: '診斷頁面',
    component: IDMS,
  },
  {
    path: '/idms/module-states',
    name: '感測器狀態',
    component: ModuleStatesListViewVue,
  },
  {
    path: '/idms/query',
    name: 'Query',
    component: QueryPage,
  },
]

const routes =
  configs.mode == 'dev'
    ? dev_mode_routes
    : configs.mode == 'gmm'
    ? gmm_mode_routes
    : gpm_mode_routes

const router = createRouter({
  history: createWebHistory(),
  routes,
})

/**
 * 取得所有路由 name 屬性
 */
export function GetRouters() {
  return routes
}

export default router
