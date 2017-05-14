import Vue from 'vue'
import Vuex from 'vuex'
import { plugins, actions } from './restModelActions.js'
import { plugins as localPlugins, actions as localActions } from './localStorageActions.js'
Vue.use(Vuex)

const state = function() {
  return {
    items: [],
    activeItem: {},
    errors: {
      message: ''
    }
  }
}

const mutations = {
  $SetItems (state, items) {
    state.items = items
  },

  $addItem (state, payload) {
    const newItem = Object.assign({}, payload)
    state.items.push(newItem)
  },

  $updateItem (state, {item, changes}) {
    console.log("$updateItem ", { item, changes })
    //this records the changes in the store. not sure why this works
    Object.assign(item, changes)
  },

  $removeItem (state, item) {
    state.items.splice(state.items.indexOf(item), 1)
  },

  $toggleCompleted (state, { todo, completed }) {
    todo.completed = completed
  },

  $removeCompleted (state) {
    state.items = state.items.filter(todo => !todo.completed)
  },

  $updateErrors (state, {message}) {
    state.errors.message = message
  },

  $setActiveItem (state, item) {
    state.activeItem = item
  }

}

export const localStore = new Vuex.Store({
  strict: true, //strict: process.env.NODE_ENV !== 'production'
  state: state(),
  mutations,
  actions: localActions,
  plugins: localPlugins
})

export const restStore = new Vuex.Store({
  strict: true, //strict: process.env.NODE_ENV !== 'production'
  state: state(),
  mutations,
  actions,
  plugins
})
