import Vue from 'vue'
import VueRouter from 'vue-router'
import { mapMutations, mapActions, mapState } from 'vuex'
import cloneDeep from 'lodash/cloneDeep'
import isEmpty from 'lodash/isEmpty'
import { localStore, restStore } from './store'
//import { localStore } from './store'

import '../node_modules/todomvc-app-css/index.css'
// import './styles/styles.scss'
Vue.use(VueRouter)

// Full spec-compliant TodoMVC with localStorage persistence
// and hash-based routing in ~120 effective lines of JavaScript.

// visibility filters
const filters = {
  all: todos => todos,
  active: todos => todos.filter(todo => !todo.completed),
  completed: todos => todos.filter(todo => todo.completed)
}

const router = new VueRouter({
  routes: [
    {path: '/:filterBy'} //normally we have a component but its not required, just want $route.params
  ]
})

// app Vue instance
var RestApp = Vue.extend({
//new Vue({
//  store: localStore,
  template: "#todoapp-tpl",
  router,
  // app initial state
  data() {
    return {
      editingTodo: {},
      visibility: 'all',
      name: 'local'
    }
  },

  // watch route changes for localStorage persistence
  watch: {
    '$route': function () {
      console.log('filterBy ', this.$route.params.filterBy)
      this.visibility = this.$route.params.filterBy || 'all'
    }
  },

  // computed properties
  // http://vuejs.org/guide/computed.html
  computed: {
    ...mapState([
      'activeItem',
      'errors'
    ]),
    todos () {
      return this.$store.state.items ? this.$store.state.items : []
    },
    allChecked () {
      return this.todos.every(todo => todo.completed)
    },
    filteredTodos () {
      console.log(`filteredTodos visibility [${this.visibility}]`)
      return filters[this.visibility](this.todos)
    },
    remaining () {
      return this.todos.filter(todo => !todo.completed).length
    }
  },

  filters: {
    pluralize: function (n) {
      return n === 1 ? 'item' : 'items'
    }
  },

  // methods that implement data logic.
  // note there's no DOM manipulation here at all.
  methods: {
    ...mapMutations([
      '$updateErrors',
      '$setActiveItem'
    ]),
    ...mapActions([
      'insert',
      'update',
      'remove',
      'removeCompleted',
      'toggleAll',
      'toggleCompleted'
    ]),
    addTodo (e) {
      if(!e.target.value.trim()) return

      let newTodo = {
        title: e.target.value.trim(),
        completed: false
      }

      this.insert(newTodo).then(() => {
        e.target.value = ''
      })
    },
    editTodo(todo) {
      this.editingTodo = cloneDeep(todo)
      this.$setActiveItem(todo)
      console.log("editTodo activeItem", this.activeItem)
    },
    doneEdit () {
      const {editingTodo, activeItem} = this
      if (isEmpty(activeItem)) return //prevents the other events from firing
      this.update({ item: activeItem, changes: editingTodo }).then(() => {
        console.log("doneEdit success", {editingTodo, activeItem})
        this.resetEdit()
      }).catch(e => {
        console.log("doneEdit error", e)
      })
    },
    resetEdit (todo, e) {
      console.log("resetEdit", e)
      this.editingTodo = {}
      this.$setActiveItem({})
      this.$updateErrors({ message: '' })
    }
  },

  // a custom directive to wait for the DOM to be updated
  // before focusing on the input field.
  // http://vuejs.org/guide/custom-directive.html
  directives: {
    'todo-focus': function (el, binding) {
      if (binding.value) {
        el.focus()
      }
    }
  },

  created: function() {
    console.log("Ready")
    this.$store.dispatch('list')
    //ensures its properly set
    if(this.$route.params.filterBy) this.visibility = this.$route.params.filterBy
    console.log("this.$route.params.filterBy ", this.$route.params.filterBy)
  }
})//.$mount('.todoapp')

let rv = null
function setupVue(name, store) {
  if(document.getElementById(`todoapp-${name}`)) {
    rv = new RestApp({ el: `#todoapp-${name}`, store })
    rv.name = name
  }
}
new Vue({
  el: '#switcharoo',
  data: {showList: 'local'},
  methods: {
    showRestStore() {
      this.showList = 'rest'
      setupVue(this.showList, restStore)
    },
    showLocalStore() {
      this.showList = 'local'
    }
  },
  mounted() {
    //show the local store by default
    setupVue(this.showList, localStore)
  }
}).$mount('#switcharoo')

// mount

