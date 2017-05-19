import Vue from 'vue'
import Vuex from 'vuex'
import itemRestVxStore from "./item/itemRestVxStore"
Vue.use(Vuex)

let thisStore = {}

thisStore.options = function() {
  let restStoreOpts = itemRestVxStore.options('todo')

  let vxOpts = Object.assign({}, restStoreOpts)

  vxOpts.actions = {
    ...restStoreOpts.actions,
    //removes all completed
    async removeCompleted ({dispatch, commit, state}) {
      for (const item of state.items.filter(todo => todo.completed)) {
        dispatch('removeItem', item)
      }
    },
    //removes all completed
    toggleComplete({dispatch}, item) {
      let changes = {completed: !item.completed}
      dispatch('updateItem', {item, changes})
    }
  }

  return vxOpts
}

thisStore.createStore = function(options = {}) {
  let opts = Object.assign({}, this.options(), options)
  return new Vuex.Store(opts)
}

export default thisStore

