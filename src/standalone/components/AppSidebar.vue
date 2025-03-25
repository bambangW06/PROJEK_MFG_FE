<template>
  <CSidebar
    class="bg-white"
    position="fixed"
    :unfoldable="sidebarUnfoldable"
    :visible="sidebarVisible"
    @visible-change="
      (event) =>
        $store.commit({
          type: 'updateSidebarVisible',
          value: event,
        })
    "
  >
    <CSidebarBrand>
      <img
        src="../assets/brand/Toyota_logo.png"
        class="img-fluid sidebar-brand-full"
        width="200"
        height="200"
      />
      <img
        src="../assets/brand/Toyota_logo.png"
        class="sidebar-brand-narrow"
        width="36"
        height="10"
      />
    </CSidebarBrand>
    <AppSidebarNav v-bind:nav="nav" />
    <CSidebarToggler
      id="SidebarToggler"
      class="d-none d-lg-flex submenu-background"
      @click="$store.commit('toggleUnfoldable')"
    />
  </CSidebar>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { AppSidebarNav } from './AppSidebarNav'
import { logoNegative } from '@/standalone/assets/brand/logo-negative'
import { sygnet } from '@/standalone/assets/brand/sygnet'
import utils from '@/utils/CommonUtils'
import api from '@/apis/CommonAPI'
import navtemplate from '@/_nav.js'
import { CNavGroup } from '@coreui/vue'

var strAuthorizedNav = ''
var appAuthorized = {}
const generateNav = async (newAuthorizedData, isChild) => {
  strAuthorizedNav += '['
  let newAuthorizedDataLength = newAuthorizedData.length
  for (var i = 0; i < newAuthorizedDataLength; i++) {
    let currentNewAuthorizedData = newAuthorizedData[i]
    if (
      currentNewAuthorizedData.children &&
      currentNewAuthorizedData.children.length > 0
    ) {
      strAuthorizedNav += '{'
      strAuthorizedNav += ' "component": "CNavGroup",'
      strAuthorizedNav +=
        ' "name": "' +
        (isChild ? '' : '') +
        currentNewAuthorizedData.displayText +
        '",'
      strAuthorizedNav += ' "to": "' + currentNewAuthorizedData.path + '",'
      strAuthorizedNav += ' "icon": "' + currentNewAuthorizedData.icon + '",'
      strAuthorizedNav +=
        ' "parentId": "' + currentNewAuthorizedData.parentId + '",'
      strAuthorizedNav += ' "items": '
      generateNav(currentNewAuthorizedData.children, true)
      strAuthorizedNav += '},'
    } else {
      strAuthorizedNav += '{'
      strAuthorizedNav += ' "component": "CNavItem",'
      strAuthorizedNav +=
        ' "name": "' +
        (isChild ? '' : '') +
        currentNewAuthorizedData.displayText +
        '",'
      strAuthorizedNav += ' "to": "' + currentNewAuthorizedData.path + '",'
      strAuthorizedNav += ' "icon": "' + currentNewAuthorizedData.icon + '",'
      strAuthorizedNav +=
        ' "parentId": "' + currentNewAuthorizedData.parentId + '",'
      strAuthorizedNav +=
        ' "applicationId": "' + currentNewAuthorizedData.applicationId + '",'
      strAuthorizedNav +=
        ' "linkProps": { "queryParams": { "applicationId": "' +
        currentNewAuthorizedData.applicationId +
        '", "functionId": "' +
        currentNewAuthorizedData.functionId +
        '" } }'
      strAuthorizedNav += '},'
    }
  }
  strAuthorizedNav += ']'
}

export default {
  name: 'AppSidebar',
  components: {
    AppSidebarNav,
  },
  data() {
    return {
      nav: [
        {
          component: 'CNavGroup',
          name: 'Employee Management',
          icon: 'cilUser',
          items: [
            {
              component: 'CNavItem',
              name: 'Absensi Karyawan',
              to: '/app/dashboard',
              icon: 'cilCheckCircle',
              parentId: 'ROOT',
            },

            {
              component: 'CNavItem',
              name: 'Mapping Job', // Nama menu untuk EAssesment
              to: '/MappingJob', // Path yang dituju saat menu EAssesment diklik
              icon: 'cilMap', // Ikonya bisa disesuaikan
              parentId: 'ROOT',
            },
            {
              component: 'CNavItem',
              name: ' History Kehadiran ', // Nama menu untuk EAssesment
              to: '/grafikAbsensi', // Path yang dituju saat menu EAssesment diklik
              icon: 'cilHistory', // Ikonya bisa disesuaikan
              parentId: 'ROOT',
            },
            {
              component: 'CNavItem',
              name: 'Data Karyawan', // Nama menu untuk EAssesment
              to: '/employeesData', // Path yang dituju saat menu EAssesment diklik
              icon: 'cilGroup', // Ikonya bisa disesuaikan
              parentId: 'ROOT',
            },
          ],
        },

        {
          componet: 'CNavGroup',
          name: 'Tool Management', // Nama menu untuk EAssesment
          icon: 'cilSettings', // Ikonya bisa disesuaikan
          items: [
            // {
            //   component: 'CNavItem',
            //   name: 'Kanban From Gel', // Nama menu untuk EAssesment
            //   to: '/tool/kanbanFromGel', // Path yang dituju saat menu EAssesment diklik
            //   icon: 'cilPencil', // Ikonya bisa disesuaikan
            //   parentId: 'ROOT',
            // },
            {
              component: 'CNavItem',
              name: 'Laporan Harian', // Nama menu untuk EAssesment
              to: '/tool/LaporanHarian', // Path yang dituju saat menu EAssesment diklik
              icon: 'cilSpreadsheet', // Ikonya bisa disesuaikan
              parentId: 'ROOT',
            },

            {
              component: 'CNavItem',
              name: 'Problem Report', // Nama menu untuk EAssesment
              to: '/tool/nextProses', // Path yang dituju saat menu EAssesment diklik
              icon: 'cilWarning', // Ikonya bisa disesuaikan
              parentId: 'ROOT',
            },
            // {
            //   component: 'CNavItem',
            //   name: 'Dummy', // Nama menu untuk EAssesment
            //   to: '/tool/dummy', // Path yang dituju saat menu EAssesment diklik
            //   icon: 'cilMap', // Ikonya bisa disesuaikan
            //   parentId: 'ROOT',
            // },
            {
              component: 'CNavItem',
              name: 'Pencapaian Regrinding', // Nama menu untuk EAssesment
              to: '/tool/grafik', // Path yang dituju saat menu EAssesment diklik
              icon: 'cilChart', // Ikonya bisa disesuaikan
              parentId: 'ROOT',
            },
            {
              component: 'CNavItem',
              name: 'History Problem', // Nama menu untuk EAssesment
              to: '/tool/historyProblem', // Path yang dituju saat menu EAssesment diklik
              icon: 'cilHistory', // Ikonya bisa disesuaikan
              parentId: 'ROOT',
            },
            {
              component: 'CNavGroup',
              name: 'Master Data',
              icon: 'cilFolder',
              items: [
                {
                  component: 'CNavItem',
                  name: 'Master Time Report',
                  to: '/tool/masterTimeReport',
                  icon: 'cilClock',
                  parentId: 'ROOT',
                },
                {
                  component: 'CNavItem',
                  name: 'Master Tools',
                  to: '/tool/masterTools',
                  icon: 'cilSettings',
                  parentId: 'ROOT',
                },
                {
                  component: 'CNavItem',
                  name: 'Master Lines',
                  to: '/tool/masterLines',
                  icon: 'cilMap',
                  parentId: 'ROOT',
                },
                {
                  component: 'CNavItem',
                  name: 'Master Machines',
                  to: '/tool/masterMachines',
                  icon: 'cilFactory',
                  parentId: 'ROOT',
                },
                {
                  component: 'CNavItem',
                  name: 'Master Problems',
                  to: '/tool/masterProblems',
                  icon: 'cilWarning',
                  parentId: 'ROOT',
                },
              ],
            },
          ],
        },

        {
          component: 'CNavGroup',
          name: 'Coolant Management', // Nama menu untuk EAssesment
          icon: 'cilDrop', // Ikonya bisa disesuaikan
          items: [
            {
              component: 'CNavItem',
              name: 'Planing Kuras Coolant ', // Nama menu untuk EAssesment
              to: '/planSchedule', // Path yang dituju saat menu EAssesment diklik
              icon: 'cilCalendar', // Ikonya bisa disesuaikan
            },
            {
              component: 'CNavItem',
              name: 'History Conc & pH', // Nama menu untuk EAssesment
              to: '/historyConc', // Path yang dituju saat menu EAssesment diklik
              icon: 'cilHistory', // Ikonya bisa disesuaikan
            },
            {
              component: 'CNavItem',
              name: 'History Kuras', // Nama menu untuk EAssesment
              to: '/historyKuras', // Path yang dituju saat menu EAssesment diklik
              icon: 'cilHistory', // Ikonya bisa disesuaikan
            },
            {
              component: 'CNavItem',
              name: 'Master Schedule', // Nama menu untuk EAssesment
              to: '/ScheduleKuras', // Path yang dituju saat menu EAssesment diklik
              icon: 'cilLibraryAdd', // Ikonya bisa disesuaikan
            },
          ],
        },
        {
          component: 'CNavGroup',
          name: 'Oli Management', // Nama menu untuk EAssesment
          icon: 'cilDrop', // Ikonya bisa disesuaikan
          items: [
            {
              component: 'cNavItem',
              name: 'Pemakaian Chemical',
              to: '/chemical/pemakaian',
              icon: 'cilBeaker',
            },
            {
              component: 'CNavGroup',
              name: 'Master Data ', // Nama menu untuk EAssesment
              icon: 'cilLibraryAdd', // Ikonya bisa disesuaikan
              items: [
                {
                  component: 'CNavItem',
                  name: 'Master Chemicals',
                  to: '/master/chemicals',
                  icon: 'cilDrop',
                },
              ],
            },
          ],
        },
        // {
        //   component: 'CNavGroup',
        //   name: 'Delivery Management', // Nama menu untuk EAssesment
        //   icon: 'cilTruck', // Ikonya bisa disesuaikan
        //   items: [
        //     {
        //       component: 'CNavItem',
        //       name: 'Kanban To Tool Regrinding',
        //       to: '/delivery/kanban',
        //       // icon: 'cilMap',
        //       parentId: 'ROOT',
        //     },
        //     {
        //       component: 'CNavItem',
        //       name: 'Master Data Tool',
        //       to: '/delivery/dataTool',
        //       // icon: 'cilMap',
        //       parentId: 'ROOT',
        //     },
        //     {
        //       component: 'CNavItem',
        //       name: 'Master Line',
        //       to: '/delivery/masterLine',
        //       // icon: 'cilMap',
        //       parentId: 'ROOT',
        //     },
        //   ],
        // },
        // {
        //   component: 'CNavItem',
        //   to: '/contoh',
        //   name: 'Contoh',
        //   icon: '',
        //   parentId: 'ROOT',
        // },
        // {
        //   component: 'CNavItem',
        //   to: '/qdc/gauge-control',
        //   name: 'Gauge Control',
        //   icon: '',
        //   parentId: 'ROOT',
        // },
        // {
        //   component: 'CNavItem',
        //   to: '/qdc/gauge-control/detail/:id',
        //   name: 'Gauge Control Detail',
        //   icon: '',
        //   parentId: 'ROOT',
        // },
        // {
        //   component: 'CNavItem',
        //   to: '/qdc/gauge-control/add',
        //   name: 'Gauge Control Add',
        //   icon: '',
        //   parentId: 'ROOT',
        // },
        // {
        //   component: 'CNavItem',
        //   to: '/qdc/gauge-control/edit/:id',
        //   name: 'Gauge Control Edit',
        //   icon: '',
        //   parentId: 'ROOT',
        // },
        // {
        //   component: 'CNavItem',
        //   to: '/qdc/calibration-item/:idGauge',
        //   name: 'Calibration Item',
        //   icon: '',
        //   parentId: 'ROOT',
        // },
        // {
        //   component: 'CNavItem',
        //   to: '/qdc/calibration-item/add/:idGauge',
        //   name: 'Calibration Item Add',
        //   icon: '',
        //   parentId: 'ROOT',
        // },
        // {
        //   component: 'CNavItem',
        //   to: '/qdc/calibration-item/edit/:id',
        //   name: 'Calibration Item Edit',
        //   icon: '',
        //   parentId: 'ROOT',
        // },
        // {
        //   component: 'CNavItem',
        //   to: '/qdc/monthly-planning',
        //   name: 'Monthly Planning',
        //   icon: '',
        //   parentId: 'ROOT',
        // },
        // {
        //   component: 'CNavItem',
        //   to: '/qdc/daily-management',
        //   name: 'Daily Management',
        //   icon: '',
        //   parentId: 'ROOT',
        // },
        // {
        //   component: 'CNavItem',
        //   to: '/qdc/monthly-planning-holiday',
        //   name: 'Monthly Planning Holiday',
        //   icon: '',
        //   parentId: 'ROOT',
        // },
        // {
        //   component: 'CNavItem',
        //   to: '/qdc/monthly-planning-holiday/add',
        //   name: 'Monthly Planning Holiday Add',
        //   icon: '',
        //   parentId: 'ROOT',
        // },
        // {
        //   component: 'CNavItem',
        //   to: '/qdc/monthly-planning-holiday/edit/:id',
        //   name: 'Monthly Planning Holiday Edit',
        //   icon: '',
        //   parentId: 'ROOT',
        // },
        // {
        //   component: 'CNavItem',
        //   to: '/qdc/custom-planning',
        //   name: 'Custom Planning',
        //   icon: '',
        //   parentId: 'ROOT',
        // },
        // {
        //   component: 'CNavItem',
        //   to: '/qdc/custom-planning/add',
        //   name: 'Custom Planning',
        //   icon: '',
        //   parentId: 'ROOT',
        // },
        // {
        //   component: 'CNavItem',
        //   to: '/qdc/custom-planning/edit/:id',
        //   name: 'Custom Planning',
        //   icon: '',
        //   parentId: 'ROOT',
        // }

        /*define other in here*/
      ],
    }
  },
  setup() {
    const store = useStore()
    return {
      logoNegative,
      sygnet,
      sidebarUnfoldable: computed(() => store.state.sidebarUnfoldable),
      sidebarVisible: computed(() => store.state.sidebarVisible),
    }
  },
  // async created() {
  //   let authorizedView = await api.scQueryApi('/api/common/menu-authorized', 'POST', '');
  //   strAuthorizedNav = '';
  //   if (authorizedView.data) {
  //     await generateNav(authorizedView.data.children)
  //     let jsonAuthorizedNavJSON = JSON.parse('{"value": ' + strAuthorizedNav.replaceAll('},]', '}]') + '}');

  //     //this.nav = this.nav.concat(jsonAuthorizedNavJSON.value);
  //     // this.nav=navtemplate;
  //   }
  //   setInterval(async () => {
  //     let authorizedView = await api.scQueryApi('/api/common/user-info', 'POST', '');
  //   }, 60 * 1000);

  //   //this.$router.push('/dc/dashboard');
  // }
}
</script>

<style>
.submenu-background {
  background-color: #f8f9fa !important;
}
</style>
