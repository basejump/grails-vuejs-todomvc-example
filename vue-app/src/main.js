import Vue from 'vue'
import TodoModel from './todoModel'

import '../node_modules/todomvc-app-css/index.css'
// import './styles/styles.scss'

// Full spec-compliant TodoMVC with localStorage persistence
// and hash-based routing in ~120 effective lines of JavaScript.

// visibility filters
var filters = {
  all: function (todos) {
    return todos
  },
  active: function (todos) {
    return todos.filter(function (todo) {
      return !todo.completed
    })
  },
  completed: function (todos) {
    return todos.filter(function (todo) {
      return todo.completed
    })
  }
}

// app Vue instance
var app = new Vue({
  // app initial state
  data: {
    todos: [],
    newTodo: '',
    editedTodo: null,
    visibility: 'all',
    errors: TodoModel.errors
  },

  // watch todos change for localStorage persistence
  watch: {
    todos: {
      handler: function (todos) {
        console.log("changed", todos)
      },
      deep: true
    }
  },

  // computed properties
  // http://vuejs.org/guide/computed.html
  computed: {
    filteredTodos: function () {
      return filters[this.visibility](this.todos)
    },
    remaining: function () {
      return filters.active(this.todos).length
    },
    allDone: {
      get: function () {
        return this.remaining === 0
      },
      set: function (value) {
        this.todos.forEach(function (todo) {
          todo.completed = value
        })
        TodoModel.updateAll(this.todos)
      }
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
    addTodo: function () {
      let self = this

      var value = this.newTodo && this.newTodo.trim()
      if (!value) {
        return
      }

      let newTodoObj = TodoModel.save({
        title: value
      })

      newTodoObj.$promise.then(function (response) {
        self.todos.push(newTodoObj)
        console.log("addTodo ", newTodoObj)
        self.newTodo = ''
      })
    },
    removeTodo: function (todo) {
      todo.$delete()
      this.todos.splice(this.todos.indexOf(todo), 1)
    },

    editTodo: function (todo) {
      this.beforeEditCache = todo.title
      this.editedTodo = todo
    },

    doneEdit: function (todo) {
      if (!this.editedTodo) {
        return
      }
      this.editedTodo = null
      todo.title = todo.title.trim()
      if (!todo.title) {
        this.removeTodo(todo)
      } else {
        let self = this
        todo.$update().catch(function (ex) {
          self.editedTodo = todo //reset it back so input doesn't go away
        })
      }
    },

    cancelEdit: function (todo) {
      this.editedTodo = null
      todo.title = this.beforeEditCache
    },

    removeCompleted: function () {
      TodoModel.archiveCompleted(this.todos)
    },

    setCompleted: function(todo) {
      todo.completed = !todo.completed
      todo.$update()
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
    this.todos = TodoModel.query()
    //TodoModel.list(this.todos)
  }
})

// handle routing
function onHashChange () {
  var visibility = window.location.hash.replace(/#\/?/, '')
  if (filters[visibility]) {
    app.visibility = visibility
  } else {
    window.location.hash = ''
    app.visibility = 'all'
  }
}

window.addEventListener('hashchange', onHashChange)
onHashChange()

// mount
app.$mount('.todoapp')
