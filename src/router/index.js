console.log('router/index.js')
import { createRouter, createWebHashHistory, Route } from 'vue-router'

import DefaultLayout from '@/layouts/DefaultLayout'
import DefaultLayoutStandAlone from '@/standalone/layouts/DefaultLayoutStandAlone'
import modalToken from '@/standalone/components/modalToken.vue'
import { createApp, h } from 'vue'
// Declare tokenModalInstance outside of the router to ensure it is in the same scope
let tokenModalInstance = null
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
        component: () => import('@/views/Employee/AbsensiDashboard.vue'),
      },
      {
        path: '/employeesData',
        name: 'Data Karyawan',
        component: () => import('@/views/Employee/AddEmployees.vue'),
        meta: { requiresSpecialToken: true },
      },
      {
        path: '/grafikAbsensi',
        name: 'Absensi Karyawan',
        component: () => import('@/views/Employee/HistoryGraphAbsensi.vue'),
      },
      {
        path: '/MappingJob',
        name: 'Mapping Job',
        component: () => import('@/views/Employee/MappingJob.vue'),
      },
      // {
      //   path: '/tool/kanbanFromGel',
      //   name: 'KanbanFromGel',
      //   component: () => import('@/views/ToolManagement/KanbanFromGel.vue'),
      // },
      {
        path: '/tool/LaporanHarian',
        name: 'LaporanHarian',
        component: () => import('@/views/ToolManagement/LaporanHarian.vue'),
      },
      {
        path: '/tool/nextProses',
        name: 'ProblemReport',
        component: () => import('@/views/ToolManagement/ProblemReport.vue'),
      },
      {
        path: '/tool/grafik',
        name: 'PencapaianOEE',
        component: () => import('@/views/ToolManagement/PencapaianOEE.vue'),
      },
      {
        path: '/tool/historyProblem',
        name: 'HistoryProblem',
        component: () => import('@/views/ToolManagement/HistoryProblem.vue'),
      },
      {
        path: '/tool/masterTimeReport',
        name: 'MasterTimeReport',
        component: () =>
          import('@/views/ToolManagement/MasterData/MasterTime.vue'),
        meta: { requiresSpecialToken: true },
      },
      {
        path: '/tool/masterTools',
        name: 'MasterTools',
        component: () =>
          import('@/views/ToolManagement/MasterData/MasterTools.vue'),
        meta: { requiresSpecialToken: true },
      },
      {
        path: '/tool/masterLines',
        name: 'MasterLines',
        component: () =>
          import('@/views/ToolManagement/MasterData/MasterLines.vue'),
        meta: { requiresSpecialToken: true },
      },
      {
        path: '/tool/masterMachines',
        name: 'MasterMachines',
        component: () =>
          import('@/views/ToolManagement/MasterData/MasterMachines.vue'),
        meta: { requiresSpecialToken: true },
      },
      {
        path: '/tool/masterProblems',
        name: 'MasterProblems',
        component: () =>
          import('@/views/ToolManagement/MasterData/MasterProblem.vue'),
        meta: { requiresSpecialToken: true },
      },

      // {
      //   path: '/tool',
      //   name: 'DashboardTool',
      //   component: () => import('@/views/DashboardTool.vue'),
      // },

      {
        path: '/planSchedule',
        name: 'PlanSchedule',
        component: () => import('@/views/Coolant/PlanSchedule.vue'),
      },

      {
        path: '/historyConc',
        name: 'HistoryConc',
        component: () => import('@/views/Coolant/HistoryCoolant.vue'),
      },
      {
        path: '/historyKuras',
        name: 'HistoryKuras',
        component: () => import('@/views/Coolant/HistoryKuras.vue'),
      },
      {
        path: '/ScheduleKuras',
        name: 'ScheduleKuras',
        component: () => import('@/views/Coolant/MasterSchedule.vue'),
        meta: { requiresSpecialToken: true },
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
      {
        path: '/master/chemicals',
        name: 'MasterChemicals',
        component: () =>
          import('@/views/ChemicalsManagement/MasterChemicals.vue'),
        meta: { requiresSpecialToken: true },
      },
      {
        path: '/chemical/pemakaian',
        name: 'PemakaianOli',
        component: () =>
          import('@/views/ChemicalsManagement/PemakaianChemicals.vue'),
      },
      {
        path: '/master/optionParameters',
        name: 'MasterOptions',
        component: () =>
          import('@/views/ChemicalsManagement/MasterOptionParameters.vue'),
      },
      {
        path: '/chemical/historyPemakaian',
        name: 'HistoryChemical',
        component: () =>
          import('@/views/ChemicalsManagement/HistoryPemakaian.vue'),
      },
      {
        path: '/master/notes',
        name: 'MasterNotes',
        component: () => import('@/views/ChemicalsManagement/MasterNote.vue'),
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

router.beforeEach((to, from, next) => {
  const validToken = 'Master#Token'

  // Menghapus token jika tidak diperlukan
  if (from.meta.requiresSpecialToken && !to.meta.requiresSpecialToken) {
    localStorage.removeItem('special_token')
  }

  if (to.meta.requiresSpecialToken) {
    const specialToken = localStorage.getItem('special_token')

    if (!specialToken) {
      if (!tokenModalInstance) {
        const container = document.createElement('div')
        document.body.appendChild(container)
        // console.log('Container untuk modal telah dibuat.')

        // Modal wrapper yang mengembalikan Promise
        const modalPromise = new Promise((resolve, reject) => {
          const modalApp = createApp({
            render: () =>
              h(modalToken, {
                onTokenValidated: (isValid) => {
                  if (isValid) {
                    localStorage.setItem('special_token', validToken)
                    resolve() // Token valid, lanjutkan navigasi
                  } else {
                    reject() // Token tidak valid, batalkan navigasi
                  }

                  // Cleanup modal setelah validasi
                  tokenModalInstance.unmount()
                  document.body.removeChild(container)
                  tokenModalInstance = null
                },
              }),
          })

          // console.log('Aplikasi modal sedang dimount.')
          tokenModalInstance = modalApp
          modalApp.mount(container)
        })

        // Tangani Promise dan panggil next() setelah modal selesai
        modalPromise
          .then(() => next()) // Jika token valid, lanjutkan
          .catch(() => next(false)) // Jika token tidak valid, batalkan
      } else {
        console.log('Modal sudah ada, tidak perlu membuat modal baru.')
      }
    } else {
      next() // Jika token sudah ada, lanjutkan navigasi
    }
  } else {
    next() // Jika tidak memerlukan token khusus, lanjutkan navigasi
  }
})

export default router
