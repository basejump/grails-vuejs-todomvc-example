import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const STORAGE_KEY = 'grails-todomvc-example3'
// console.log('localstorage',
//   window.localStorage.getItem(STORAGE_KEY)
// )
const state = {
  items: [],
  activeItem: {},
  errors: {
    message: ''
  }
}

const mutations = {
  $setItems (state, items) {
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

//These are here for future rest use. Actions can return a promise
const actions = {
  insert ({ commit, dispatch }, itemData) {
    return dispatch('validate', itemData).then(() => {
      commit('$addItem', itemData)
      commit('$updateErrors', '')
    })
  },
  update ({ dispatch, commit, state }, {item, changes}) {
    console.log("store $updateItem ", { item, changes })
    return dispatch('validate', changes).then(() => {
      commit('$updateItem', {item, changes})
      commit('$updateErrors', { message: '' })
    })
  },
  remove ({ commit }, item) {
    commit('$removeItem', item)
  },
  removeCompleted ({ commit }) {
    commit('$removeCompleted')
  },
  list ({ commit }, item) {
    let items = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]')
    commit('$setItems', items)
  },
  toggleCompleted ({ commit, state }, { todo, completed }) {
    commit('$toggleCompleted', {todo, completed})
  },
  toggleAll ({ commit, state }, { completed }) {
    state.items.forEach((todo) => {
      commit('$toggleCompleted', { todo, completed })
    })
  },
  validate ({ commit, state }, item) {
    console.log("store validate ", item)
    if(item.title === 'xxx' || !item.title.trim()) {
      commit('$updateErrors', { message: 'xxx and null not allowed' })
      return Promise.reject('xxx and null not allowed')
    }
  }
}

const plugins = [store => {
  store.subscribe((mutation, { items }) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  })
}]

export default new Vuex.Store({
  strict: true, //strict: process.env.NODE_ENV !== 'production'
  state,
  mutations,
  actions,
  plugins
})

