import Vue from 'vue'
import Vuex from 'vuex'
import itemVxStore from "./item/itemVxStore"
// import _merge from 'lodash/merge'
// import _cloneDeep from 'lodash/cloneDeep'
import {LOCALSTORAGE_KEY} from "./todoLocalStore"
Vue.use(Vuex)

let store = {}

store.options = function() {
  let actions = {
    //removes all completed
    async removeCompleted ({ dispatch, commit, state }) {
      for(const item of state.items.filter(todo => todo.completed)) {
        commit('removeItem', item)
      }
    },
    //removes all completed
    toggleComplete({ dispatch }, item) {
      let changes = { completed: !item.completed }
      dispatch('updateItem', {item, changes})
    },
    list ({ commit }) {
      let items = JSON.parse(window.localStorage.getItem(LOCALSTORAGE_KEY) || '[]')
      commit('setItems', items)
    },
    validate ({ commit, state }, item) {
      console.log("store validate ", item)
      if(('title' in item) && (item.title === 'xxx' || !item.title.trim())) {
        commit('setErrorMessage', 'xxx and null not allowed')
        return Promise.reject('xxx and null not allowed')
      }
    }
  }

  let plugins = [store => {
    store.subscribe((mutation, { items }) => {
      window.localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(items))
    })
  }]

  return itemVxStore.merge({ actions, plugins })
}

store.createStore = function(opts = {}) {
  let o = Object.assign({}, this.options(), opts)
  return new Vuex.Store(o)
}

export default store

