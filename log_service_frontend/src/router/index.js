import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LogView from '../components/LogView.vue'
import AdminView from '../views/AdminView.vue'
import IDMS from '@/components/IDMS/MainPage.vue'
import ModuleStatesListViewVue from '@/components/IDMS/ModuleStatesListView.vue'
import { configs } from '@/config'

const routes =
  configs.mode == 'gmm'
    ? [
        {
          path: '/',
          name: 'home',
          component: HomeView,
        },
        {
          path: '/admin',
          name: 'admin',
          component: AdminView,
        },
        {
          path: '/log',
          name: 'log',
          component: LogView,
        },
      ]
    : [
        {
          path: '/',
          name: 'home',
          component: IDMS,
        },
        {
          path: '/admin',
          name: 'admin',
          component: AdminView,
        },
        {
          path: '/log',
          name: 'log',
          component: LogView,
        },
        {
          path: '/idms',
          name: 'idms',
          component: IDMS,
        },
        {
          path: '/idms/module-states',
          name: 'module-states',
          component: ModuleStatesListViewVue,
        },
        {
          path: '/about',
          name: 'about',
          component: () =>
            import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
        },
      ]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
