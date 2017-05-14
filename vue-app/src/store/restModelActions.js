import axios from 'axios'

const RestApi = axios.create({
  baseURL: 'http://localhost:8080/api/'
})
// Add a default response interceptor for default errors from Grails rest
//see https://github.com/mzabriskie/axios#handling-errors
export const plugins = [store => {
  RestApi.interceptors.response.use(
    response => {
      store.commit('$updateErrors', { error: null, message: "" })
      return response
    },
    error => {
      let errMsg
      if (error.response) {
        // The request was made and the server responded with a status code not in the range of 2xx
        errMsg = error.response.data.message
        console.log('response Error ', error.response)
      } else if (error.request) {
        // The request was made but no response was received
        console.log("request error ", error.request)
        errMsg = error.request
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error ', error.message);
        errMsg = error.message
      }
      store.commit('$updateErrors', { error: error, message: errMsg })
      return Promise.reject(error)
    }
  )
}]

//These are here for future rest use. Actions can return a promise
export const actions = {
  insert ({ commit, dispatch }, itemData) {
    return RestApi.post('todo', itemData).then(r => {
      console.log("Saved", r.data)
      Object.assign(itemData, r.data)
      commit('$addItem', itemData)
    })
  },
  update ({ dispatch, commit, state }, {item, changes}) {
    console.log("store $updateItem ", { item, changes })
    return RestApi.put(`todo/${item.id}`, changes).then(r => {
      console.log("store update success ", r.data)
      commit('$updateItem', { item, changes: r.data })
    })
  },
  remove ({ commit }, item) {
    return RestApi.delete(`todo/${item.id}`).then(response => {
      console.log("deleted ", response)
      commit('$removeItem', item)
    })
  },
  removeCompleted ({ state, dispatch }) {
    //TODO should somehow wrap these iterations in promise and return it
    state.items.filter(it => it.completed).forEach(todo => {
      dispatch("remove", todo)
    })
  },
  list ({ commit }) {
    return RestApi.get(`todo`).then(response => {
      commit('$SetItems', response.data)
    })
  },
  toggleCompleted ({ state, dispatch }, { todo, completed }) {
    let changes = { completed: completed }
    dispatch("update", { item: todo, changes })
  },
  toggleAll ({ state, dispatch }, { completed }) {
    state.items.forEach((todo) => {
      dispatch("toggleCompleted", { todo, completed })
    })
  },
  //not used here right now
  validate ({ commit, state }, item) {
    console.log("store validate ", item)
    if(item.title === 'xxx' || !item.title.trim()) {
      commit('$updateErrors', { message: 'xxx and null not allowed' })
      return Promise.reject('xxx and null not allowed')
    }
  }
}

