import { createStore } from 'vuex'
import mappingModule from './mappingModule'
import CoolantModule from './CoolantModule'
import EmployeeModule from './EmployeeModule'
import AbsensiModule from './AbsensiModule'
import PlanKurasModule from './PlanKurasModule'
import DashBoardToolModule from './DashBoardToolModule'

export default createStore({
  state: {
    sidebarVisible: '',
    sidebarUnfoldable: false,
  },
  mutations: {
    toggleSidebar(state) {
      state.sidebarVisible = !state.sidebarVisible
    },
    toggleUnfoldable(state) {
      state.sidebarUnfoldable = !state.sidebarUnfoldable
    },
    updateSidebarVisible(state, payload) {
      state.sidebarVisible = payload.value
    },
  },
  actions: {},
  modules: {
    EmployeeModule,
    AbsensiModule,
    mappingModule,
    CoolantModule,
    PlanKurasModule,
    DashBoardToolModule,
  },
})
