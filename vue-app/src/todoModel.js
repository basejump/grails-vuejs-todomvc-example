import Model from 'v-model'
import Promise from 'bluebird'

// set baseURL and install plugin
Model.http.defaults.baseURL = 'http://localhost:8080/api/';

const TodoModel = Model.extend('/todo/:id')

TodoModel.updateAll = todos => {
  todos.forEach(function (todo) {
    todo.$update()
  })
}

TodoModel.archiveCompleted = todos => {
  todos.filter(function (todo) {
    return todo.completed
  }).forEach(function (todo) {
    todo.$delete().then(response => {
      todos.splice(todos.indexOf(todo), 1)
      //console.log("deleted", todo)
    })
  })
}

TodoModel.errors = { message: '' } //set to data.

// Add a response interceptor for default errors from Grails rest
TodoModel.http.interceptors.response.use(function (response) {
  TodoModel.errors.message = ''
  return response
}, function (error) {
  console.log("error.response ", error.response)
  TodoModel.errors.message = error.response.data.message
  return Promise.reject(error)
})

export default TodoModel
