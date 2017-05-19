/*eslint no-unused-vars: 0*/
import Vue from 'vue'
import VueRouter from 'vue-router'
import _isEmpty from 'lodash/isEmpty'
import _cloneDeep from 'lodash/cloneDeep'
import todoLocalStore from './store/todoLocalStore'
import todoRestStore from './store/todoRestStore'
import {mapStoreFunctions, addStoreProp} from './store/shared/helpers'
Vue.use(VueRouter)

import '../node_modules/todomvc-app-css/index.css'
// import './styles/styles.scss'

const filters = {
  all: todos => todos,
  active: todos => todos.filter(todo => !todo.completed),
  completed: todos => todos.filter(todo => todo.completed)
}

const router = new VueRouter({
  routes: [
    { path: '/:filterBy' } //normally we have a component but its not required, just want $route.params
  ]
})

// app Vue class using extend to see we can reuse it
let TodoBaseVue = Vue.extend({
  template: "#todoapp-tpl",
  router,
  // app initial state
  data () {
    return {
      editingTodo: {},
      visibility: 'all',
      name: 'local' // just the name that is shown on header list
      // state: this.$store.state  //<= can tie in the state data right here but is set in class creation components below
    }
  },

  // watch route property for changes to filter visibility
  watch: {
    '$route': function () {
      this.visibility = this.$route.params.filterBy || 'all'
    }
  },

  computed: {
    error () { return this.$store.state.error },
    activeItem () { return this.$store.state.activeItem },
    todos () { return this.$store.state.items },
    allChecked () { return this.todos.every(todo => todo.completed) },
    filteredTodos () { return filters[this.visibility](this.todos) },
    remaining () { return this.todos.filter(todo => !todo.completed).length }
  },

  filters: {
    pluralize: n => n === 1 ? 'item' : 'items'
  },

  //some methods will be added in the concrete classes below and be delegated to store
  methods: {
    addTodo (e) {
      if(!e.target.value.trim()) return
      let newTodo = {
        title: e.target.value.trim(),
        completed: false
      }
      this.addItem(newTodo).then(() => {
        e.target.value = ''
      })
    },

    editTodo(todo) {
      this.setActiveItem(todo)
      this.editingTodo = _cloneDeep(todo) //clone it for editing so we don't mess with master copy
    },
    doneEdit () {
      const {item, changes} = {item: this.activeItem, changes: this.editingTodo}
      if (_isEmpty(item)) return //prevents both [blur] and [enter key] events from running this, only 1 needs to run it.

      this.updateItem({item, changes}).then(() => {
        console.log("doneEdit success", {item, changes})
        this.resetEdit()
      })
    },
    resetEdit (todo, e) {
      console.log("resetEdit", e)
      this.editingTodo = {}
      this.setActiveItem(false)
      this.clearErrors()
    }
  },

  directives: {
    'todo-focus' (el, binding, { context }) {
      if (binding.value) context.$nextTick(() => el.focus())
    }
  },

  created: function() {
    console.log("Ready " + this._uid)
    this.list()
    //ensures its properly set
    if(this.$route.params.filterBy) this.visibility = this.$route.params.filterBy
  }
})
//add the $store getter to Vue so this.$store works, uses Vuex if present
addStoreProp(TodoBaseVue)

//the list of store methods to merge in that will be delegated to the store
let mappedMethods = mapStoreFunctions([
  'addItem', 'updateItem', 'removeItem', 'updateAll', 'list',
  'toggleComplete', 'removeCompleted', 'clearErrors', 'getErrorMessage', 'editActiveItem', 'setActiveItem'
])

//Vue will merge whats set here into the "component" that was create as a babse abobve
let todoRestVue = new TodoBaseVue({
  el: '#todoapp-rest',
  //can do with a data function too for merge. add it to data so it gets the watchers
  data: { state: todoRestStore.state },
  methods: mappedMethods,
  store: todoRestStore
})
todoRestVue.name = 'Rest'
console.log("todoRestVue ", todoRestVue)

let todoLocalVue = new TodoBaseVue({
  el: '#todoapp-local',
  methods: mappedMethods,
  data: { state: todoLocalStore.state },
  store: todoLocalStore
})
console.log("todoLocalVue ", todoLocalVue)
