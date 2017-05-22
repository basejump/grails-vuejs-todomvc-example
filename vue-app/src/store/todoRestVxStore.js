import Vue from 'vue'
import Vuex, { mapMutations, mapActions } from 'vuex'
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

//returns a simple vue instance just to access store methods directly on the instance.
thisStore.createRepo = function(options = {}) {
  let vxStore = this.createStore(options)
  console.log("todoVxStore ", vxStore)
  let vxMixin = {
    methods: {
      ...mapMutations([
        'clearErrors', 'setActiveItem'
      ]),
      ...mapActions([
        'addItem', 'updateItem', 'editActiveItem', 'toggleComplete', 'list',
        'removeCompleted', 'removeItem', 'updateAll'
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

export default thisStore

