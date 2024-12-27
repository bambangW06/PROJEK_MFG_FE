import { createStore } from 'vuex'
import mappingModule from './mappingModule'
import CoolantModule from './CoolantModule'
import EmployeeModule from './EmployeeModule'
import AbsensiModule from './AbsensiModule'
import PlanKurasModule from './PlanKurasModule'
import DashBoardToolModule from './DashBoardToolModule'
import DeliveryModule from './Delivery.Module'
import MasterLineDelivery from './MasterLineDelivery.module'
import KanbanToToolReg from './KanbanToToolReg.module'
import METAModule from './META.module'
import KanbanFromGel from './KanbanFromGel.module'
import LaporanHarian from './LaporanHarian.module'
import Analisaproblem from './Analisaproblem.module'
import HistoryProblem from './HistoryProblem.module'
import MasterTime from '@/store/MasterTime.module'
import MasterTools from './MasterTools.module'
import MasterLines from './MasterLines.module'
import MasterMachines from './MasterMachines.module'

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
    DeliveryModule,
    MasterLineDelivery,
    KanbanToToolReg,
    METAModule,
    KanbanFromGel,
    LaporanHarian,
    Analisaproblem,
    HistoryProblem,
    MasterTime,
    MasterTools,
    MasterLines,
    MasterMachines,
  },
})
