import axios from 'axios'
const API_URL = process.env.VUE_APP_API_URL

const state = {
  kanbanTool: {},
  cart: [], // Menyimpan item-item dalam keranjang
}

const getters = {
  getKanbanTool: (state) => state.kanbanTool,
  getCart: (state) => state.cart, // Getter untuk mendapatkan seluruh keranjang
}

const mutations = {
  setKanbanTool(state, payload) {
    state.kanbanTool = payload
  },
  addToCart(state, tool) {
    const existingItem = state.cart.find(
      (item) => item.tool_id === tool.tool_id,
    )
    if (existingItem) {
      existingItem.quantity++
    } else {
      state.cart.push({ ...tool, quantity: 1 })
    }
  },

  removeFromCart(state, tool) {
    const index = state.cart.findIndex((item) => item.tool_id === tool.tool_id)
    if (index !== -1) {
      if (state.cart[index].quantity > 1) {
        state.cart[index].quantity--
      } else {
        state.cart.splice(index, 1)
      }
    }
  },
  clearCart(state) {
    state.cart = []
  },

  resetToolQuantities(state) {
    Object.keys(state.kanbanTool).forEach((line) => {
      state.kanbanTool[line].forEach((tool) => {
        tool.quantity = 0
      })
    })
  },
}

const actions = {
  async fectDataKanbanTool({ commit }) {
    try {
      const response = await axios.get(`${API_URL}/kanban/get`)

      commit('setKanbanTool', response.data.data)
      console.log(response.data.data)
    } catch (error) {
      console.error('Error fetching kanban tool data:', error)
    }
  },

  addToCart({ commit }, tool) {
    commit('addToCart', tool)
  },

  removeFromCart({ commit }, tool) {
    commit('removeFromCart', tool)
  },
  clearCart({ commit }) {
    commit('clearCart')
  },

  resetToolQuantities({ commit }) {
    commit('resetToolQuantities')
  },
  async ActionSaveRequestTool({ commit }, payload) {
    try {
      const response = await axios.post(`${API_URL}/kanban/add`, {
        tools: payload,
      })
      if (response.status === 200) {
        alert('Request Tool Berhasil')
      } else {
        alert('Gagal Request Tool')
      }
      console.log(response.data.data)
    } catch (error) {
      console.log(error)
    }
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
