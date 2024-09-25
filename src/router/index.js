console.log('router/index.js')
import { createRouter, createWebHashHistory, Route } from 'vue-router'

import DefaultLayout from '@/layouts/DefaultLayout'
import DefaultLayoutStandAlone from '@/standalone/layouts/DefaultLayoutStandAlone'

/*define const other in here*/

console.log(process.env.VUE_APP_STANDALONE_SINGLE_SPA)
const routes = [
  {
    path: '/',
    name: 'Home',
    component:
      process.env.VUE_APP_STANDALONE_SINGLE_SPA === 'true'
        ? DefaultLayoutStandAlone
        : DefaultLayout,
    redirect:
      process.env.VUE_APP_STANDALONE_SINGLE_SPA !== 'true' &&
      (!localStorage.id_token || localStorage.id_token == '')
        ? () => {
            window.location.href = process.env.dc + '/#/sc/login'
            // return '/redirectingToLogin' // not important since redirecting
          }
        : '/app/dashboard',
    children: [
      {
        path: '/app/dashboard',
        name: 'EAssignment',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('@/views/EAssignment.vue'),
      },
      {
        path: '/AddEmployees',
        name: 'Data Karyawan',
        component: () => import('@/views/AddEmployees.vue'),
      },
      {
        path: '/EAbsensi',
        name: 'Absensi Karyawan',
        component: () => import('@/views/EAbsensi.vue'),
      },
      {
        path: '/MappingJob',
        name: 'Mapping Job',
        component: () => import('@/views/MappingJob.vue'),
      },
      {
        path: '/tool/kanbanFromGel',
        name: 'KanbanFromGel',
        component: () => import('@/views/ToolManagement/KanbanFromGel.vue'),
      },
      {
        path: '/tool/LaporanHarian',
        name: 'LaporanHarian',
        component: () => import('@/views/ToolManagement/LaporanHarian.vue'),
      },

      {
        path: '/tool',
        name: 'DashboardTool',
        component: () => import('@/views/DashboardTool.vue'),
      },

      {
        path: '/planSchedule',
        name: 'PlanSchedule',
        component: () => import('@/views/PlanSchedule.vue'),
      },

      {
        path: '/historyCoolant',
        name: 'HistoryCoolant',
        component: () => import('@/views/HistoryCoolant.vue'),
      },

      {
        path: '/ScheduleKuras',
        name: 'ScheduleKuras',
        component: () => import('@/views/MasterSchedule.vue'),
      },
      {
        path: '/delivery/kanban',
        name: 'KanbanToToolReg',
        component: () =>
          import('@/views/DeliveryManagement/KanbanToToolReg.vue'),
      },

      {
        path: '/delivery/dataTool',
        name: 'MasterDataTool',
        component: () =>
          import('@/views/DeliveryManagement/MasterDataTool.vue'),
      },
      {
        path: '/delivery/masterLine',
        name: 'MasterGelLines',
        component: () => import('@/views/DeliveryManagement/MasterLine.vue'),
      },

      /*define other in here*/
    ],
  },
  {
    path: '/404',
    name: 'Page404',
    component: () => import('@/views/pages/Page404'),
  },
  {
    path: '/500',
    name: 'Page500',
    component: () => import('@/views/pages/Page500'),
  },
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    // always scroll to top
    return { top: 0 }
  },
})

export default router
