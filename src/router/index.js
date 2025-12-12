import { createRouter, createWebHashHistory } from 'vue-router'
import { createApp, h } from 'vue'
import DefaultLayout from '@/layouts/DefaultLayout'
import DefaultLayoutStandAlone from '@/standalone/layouts/DefaultLayoutStandAlone'
import modalToken from '@/standalone/components/modalToken.vue'
import store from '@/store'

// token modal instance
let tokenModalInstance = null

const routes = [
  {
    path: '/',
    name: 'Home',
    component:
      process.env.VUE_APP_STANDALONE_SINGLE_SPA === 'true'
        ? DefaultLayoutStandAlone
        : DefaultLayout,
    redirect: '/login', // semua buka web langsung ke login
    children: [
      {
        path: '/app/dashboard',
        name: 'EAssignment',
        component: () => import('@/views/Employee/AbsensiDashboard.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/employeesData',
        name: 'Data Karyawan',
        component: () => import('@/views/Employee/AddEmployees.vue'),
        meta: { requiresSpecialToken: true, requiresAuth: true },
      },
      {
        path: '/grafikAbsensi',
        name: 'Absensi Karyawan',
        component: () => import('@/views/Employee/HistoryGraphAbsensi.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/MappingJob',
        name: 'Mapping Job',
        component: () => import('@/views/Employee/MappingJob.vue'),
        meta: { requiresAuth: true },
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
        meta: { requiresAuth: true },
      },
      {
        path: '/tool/nextProses',
        name: 'ProblemReport',
        component: () => import('@/views/ToolManagement/ProblemReport.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/tool/grafik',
        name: 'PencapaianOEE',
        component: () => import('@/views/ToolManagement/PencapaianOEE.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/tool/historyProblem',
        name: 'HistoryProblem',
        component: () => import('@/views/ToolManagement/HistoryProblem.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/tool/masterTimeReport',
        name: 'MasterTimeReport',
        component: () =>
          import('@/views/ToolManagement/MasterData/MasterTime.vue'),
        meta: { requiresSpecialToken: true, requiresAuth: true },
      },
      {
        path: '/tool/masterTools',
        name: 'MasterTools',
        component: () =>
          import('@/views/ToolManagement/MasterData/MasterTools.vue'),
        meta: { requiresSpecialToken: true, requiresAuth: true },
      },
      {
        path: '/chemical/gentani',
        name: 'Gentani',
        component: () => import('@/views/ChemicalsManagement/Gentani.vue'),
      },
      {
        path: '/tool/masterLines',
        name: 'MasterLines',
        component: () =>
          import('@/views/ToolManagement/MasterData/MasterLines.vue'),
        meta: { requiresSpecialToken: true, requiresAuth: true },
      },
      {
        path: '/tool/masterMachines',
        name: 'MasterMachines',
        component: () =>
          import('@/views/ToolManagement/MasterData/MasterMachines.vue'),
        meta: { requiresSpecialToken: true, requiresAuth: true },
      },
      {
        path: '/tool/masterProblems',
        name: 'MasterProblems',
        component: () =>
          import('@/views/ToolManagement/MasterData/MasterProblem.vue'),
        meta: { requiresSpecialToken: true, requiresAuth: true },
      },
      {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/LoginPage.vue'),
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
        meta: { requiresAuth: true },
      },

      {
        path: '/historyConc',
        name: 'HistoryConc',
        component: () => import('@/views/Coolant/HistoryCoolant.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/historyKuras',
        name: 'HistoryKuras',
        component: () => import('@/views/Coolant/HistoryKuras.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/ScheduleKuras',
        name: 'ScheduleKuras',
        component: () => import('@/views/Coolant/MasterSchedule.vue'),
        meta: { requiresSpecialToken: true, requiresAuth: true },
      },
      {
        path: '/delivery/kanban',
        name: 'KanbanToToolReg',
        component: () =>
          import('@/views/DeliveryManagement/KanbanToToolReg.vue'),
        meta: { requiresAuth: true },
      },

      {
        path: '/delivery/dataTool',
        name: 'MasterDataTool',
        component: () =>
          import('@/views/DeliveryManagement/MasterDataTool.vue'),
        meta: { requiresSpecialToken: true, requiresAuth: true },
      },
      {
        path: '/delivery/masterLine',
        name: 'MasterGelLines',
        component: () => import('@/views/DeliveryManagement/MasterLine.vue'),
        meta: { requiresSpecialToken: true, requiresAuth: true },
      },
      {
        path: '/master/chemicals',
        name: 'MasterChemicals',
        component: () =>
          import('@/views/ChemicalsManagement/MasterChemicals.vue'),
        meta: { requiresSpecialToken: true, requiresAuth: true },
      },
      {
        path: '/chemical/pemakaian',
        name: 'PemakaianOli',
        component: () =>
          import('@/views/ChemicalsManagement/PemakaianChemicals.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/master/optionParameters',
        name: 'MasterOptions',
        component: () =>
          import('@/views/ChemicalsManagement/MasterOptionParameters.vue'),
        meta: { requiresSpecialToken: true, requiresAuth: true },
      },
      {
        path: '/chemical/historyPemakaian',
        name: 'HistoryChemical',
        component: () =>
          import('@/views/ChemicalsManagement/HistoryPemakaian.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/chemical/reservasi',
        name: 'ReservasiChemical',
        component: () =>
          import('@/views/ChemicalsManagement/ReservasiChemical.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/master/notes',
        name: 'MasterNotes',
        component: () => import('@/views/ChemicalsManagement/MasterNote.vue'),
        meta: { requiresSpecialToken: true, requiresAuth: true },
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
    return { top: 0 }
  },
})

// router.beforeEach((to, from, next) => {
//   const validToken = 'Master#Token'

//   // Menghapus modal token jika pindah dari route yang membutuhkan
//   if (from.meta.requiresSpecialToken && !to.meta.requiresSpecialToken) {
//     localStorage.removeItem('special_token')
//   }

//   // Login gate: pakai sessionStorage + Vuex state
//   const isLoggedIn =
//     store.getters['auth/IS_LOGGED_IN'] ||
//     sessionStorage.getItem('IS_LOGGED_IN') === 'true'

//   if (to.meta.requiresAuth && !isLoggedIn && to.name !== 'Login') {
//     return next('/login')
//   }

//   // Modal token gate untuk route khusus
//   if (to.meta.requiresSpecialToken) {
//     const specialToken = localStorage.getItem('special_token')
//     if (!specialToken) {
//       if (!tokenModalInstance) {
//         const container = document.createElement('div')
//         document.body.appendChild(container)

//         const modalPromise = new Promise((resolve, reject) => {
//           const modalApp = createApp({
//             render: () =>
//               h(modalToken, {
//                 onTokenValidated: (isValid) => {
//                   if (isValid) {
//                     localStorage.setItem('special_token', validToken)
//                     resolve()
//                   } else {
//                     reject()
//                   }
//                   tokenModalInstance.unmount()
//                   document.body.removeChild(container)
//                   tokenModalInstance = null
//                 },
//               }),
//           })
//           tokenModalInstance = modalApp
//           modalApp.mount(container)
//         })

//         modalPromise.then(() => next()).catch(() => next(false))
//         return
//       }
//     }
//   }

//   next()
// })

router.beforeEach((to, from, next) => {
  const validToken = 'Master#Token'

  // ==========================
  // 1. LOGIN GATE (session + vuex)
  // ==========================
  const isLoggedIn =
    store.getters['auth/IS_LOGGED_IN'] ||
    sessionStorage.getItem('IS_LOGGED_IN') === 'true'

  if (to.meta.requiresAuth && !isLoggedIn && to.name !== 'Login') {
    return next('/login')
  }

  // ==========================
  // 2. CLEAR SPECIAL TOKEN jika keluar dari route spesial
  // ==========================
  if (from.meta.requiresSpecialToken && !to.meta.requiresSpecialToken) {
    localStorage.removeItem('special_token')
  }

  // ==========================
  // 3. SPECIAL TOKEN GATE
  // ==========================
  if (to.meta.requiresSpecialToken) {
    const specialToken = localStorage.getItem('special_token')

    // Kalau token BELUM ada → wajib buka modal token
    if (!specialToken) {
      // Pastikan modal tidak double
      if (!tokenModalInstance) {
        const container = document.createElement('div')
        document.body.appendChild(container)

        const modalPromise = new Promise((resolve, reject) => {
          const modalApp = createApp({
            render: () =>
              h(modalToken, {
                onTokenValidated: (isValid) => {
                  if (isValid) {
                    localStorage.setItem('special_token', validToken)
                    resolve()
                  } else {
                    reject()
                  }

                  // Bersihkan modal
                  tokenModalInstance.unmount()
                  document.body.removeChild(container)
                  tokenModalInstance = null
                },
              }),
          })

          tokenModalInstance = modalApp
          modalApp.mount(container)
        })

        modalPromise.then(() => next()).catch(() => next(false))

        return // STOP agar next() tidak lanjut
      }
    }
  }

  // ==========================
  // 4. LANJUTKAN ROUTE
  // ==========================
  next()
})

export default router
