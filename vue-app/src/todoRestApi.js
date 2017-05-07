import axios from 'axios'
//import async from 'async'

const RestAx = axios.create({
  baseURL: 'http://localhost:8080/api/'
})

export default {

  list: todos => {
    RestAx.get(`todo`).then(response => {
      todos.push(...response.data)
      console.log("list ", todos)
    })
  },

  save: todo => {
    console.log("saving", todo)
    RestAx.post('todo', todo).then(response => {
      console.log("Saved", response)
      todo.id = response.data.id
    })
  },

  update: todo => {
    console.log("updating", todo)
    RestAx.put('todo/' + todo.id, todo).then(response => {
      console.log("updated", response)
    })
  },

  delete: todo => {
    console.log("deleting", todo)
    RestAx.delete('todo/' + todo.id).then(response => {
      console.log("deleted", response)
    })
  },

  updateAll: todos => {
    console.log("updating", todos)
    todos.forEach(function (todo) {
      RestAx.put('todo/' + todo.id, todo).then(response => {
        console.log("Updated", response)
        //callback(null, response.data)
      })
    })
  },

  archiveCompleted: todos => {
    console.log("archiveCompleted", todos)

    todos.filter(function (todo) {
      return todo.completed
    }).forEach(function (todo) {
      RestAx.delete('todo/' + todo.id).then(response => {
        todos.splice(todos.indexOf(todo), 1)
        console.log("deleted", todo)
      })
    })
  }
}
