import Vue from 'vue'
import Vuex, { mapMutations, mapActions } from 'vuex'
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

store.createRepo = function(options = {}) {
  let vxStore = this.createStore(options)
  console.log("todoVxStore ", vxStore)
  let vxMixin = {
    methods: {
      ...mapMutations([
        'removeItem', 'updateAll', 'clearErrors', 'setActiveItem'
      ]),
      ...mapActions([
        'addItem', 'updateItem', 'editActiveItem', 'toggleComplete', 'list', 'removeCompleted'
      ])
    },
    computed: { state () { return this.$store.state } }
  }

  //empty vue to wrap the store with methods above so we can use it like a normal object without all the commit and store methods
  return new Vue({
    mixins: [vxMixin],
    store: vxStore
  })
}

export default store

