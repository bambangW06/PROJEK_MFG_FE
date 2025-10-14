import { createStore } from 'vuex'
import mappingModule from './Employee/mappingModule'
import CoolantModule from './Coolant/CoolantModule'
import EmployeeModule from './Employee/EmployeeModule'
import AbsensiModule from './Employee/AbsensiModule'
import PlanKurasModule from './Coolant/PlanKurasModule'
import DashBoardToolModule from './Tool/DashBoardToolModule'
import DeliveryModule from './Tool/Delivery.Module'
import MasterLineDelivery from './Tool/MasterLineDelivery.module'
import KanbanToToolReg from './Tool/KanbanToToolReg.module'
import METAModule from './META.module'
import KanbanFromGel from './Tool/KanbanFromGel.module'
import LaporanHarian from './Tool/LaporanHarian.module'
import Analisaproblem from './Tool/Analisaproblem.module'
import HistoryProblem from './Tool/HistoryProblem.module'
import MasterTime from '@/store/Tool/MasterTime.module'
import MasterTools from './Tool/MasterTools.module'
import MasterLines from './Tool/MasterLines.module'
import MasterMachines from './Tool/MasterMachines.module'
import HistoryKurasModule from './Coolant/HistoryKuras.module'
import MasterProblemsModule from './Tool/MasterProblems.module'
import MasterOliModule from './Chemical/MasterChemicals.module'
import pemakaianOliModule from './Chemical/pemakaianChemicals.module'
import parametersCheckModule from './Chemical/parametersCheck.module'
import MasterOption from './Chemical/MasterOption.module'
import HistoryPemakaianModule from './Chemical/HistoryPemakaian.module'
import MasterNote from './Chemical/MasterNote.module'
import ReservasiChemicalModule from './Chemical/ReservasiChemical.module'

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
    HistoryKurasModule,
    MasterProblemsModule,
    MasterOliModule,
    pemakaianOliModule,
    parametersCheckModule,
    MasterOption,
    HistoryPemakaianModule,
    MasterNote,
    ReservasiChemicalModule,
  },
})
