import Vue from 'vue'
import Model from 'v-model'
import Promise from 'bluebird'

// set baseURL and install plugin
Model.http.defaults.baseURL = 'http://localhost:8080/api/';
Vue.use(Model)

const TodoModel = Model.extend('/todo/:id')

Object.assign(TodoModel, {
  store: null
  errors: {
    message: ''
  },

  updateAll(todos) {
    todos.forEach(function (todo) {
      todo.$update()
    })
  },

  archiveCompleted(todos) {
    todos.filter(function (todo) {
      return todo.completed
    }).forEach(function (todo) {
      todo.$delete().then(response => {
        todos.splice(todos.indexOf(todo), 1)
        //console.log("deleted", todo)
      })
    })
  }

});

//toggles the completed and saves to server
TodoModel.prototype.$toggleCompleted = function() {
  console.log("$toggleCompleted", this)
  this.completed = !this.completed
  this.$update()
}

// Add a default response interceptor for default errors from Grails rest
//see https://github.com/mzabriskie/axios#handling-errors
TodoModel.http.interceptors.response.use(function (response) {
  TodoModel.errors.message = ''
  return response
}, function (error) {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    TodoModel.errors.message = error.response.data.message
    console.log('response Error ', error.response)
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.log("request error ", error.request);
    TodoModel.errors.message = error.request
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log('Error ', error.message);
    TodoModel.errors.message = error.message
  }
  return Promise.reject(error)
})

export default TodoModel
