const STORAGE_KEY = 'grails-todomvc-example3'

//These are here for future rest use. Actions can return a promise
export const actions = {
  insert ({ commit, dispatch }, itemData) {
    return dispatch('validate', itemData).then(() => {
      commit('$addItem', itemData)
      commit('$updateErrors', '')
    })
  },
  update ({ dispatch, commit, state }, {item, changes}) {
    console.log("store $updateItem ", { item, changes })
    return dispatch('validate', changes).then(() => {
      commit('$updateItem', {item, changes})
      commit('$updateErrors', { message: '' })
    })
  },
  remove ({ commit }, item) {
    commit('$removeItem', item)
  },
  removeCompleted ({ commit }) {
    commit('$removeCompleted')
  },
  list ({ commit }) {
    let items = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]')
    commit('$setItems', items)
  },
  toggleCompleted ({ commit, state }, { todo, completed }) {
    commit('$toggleCompleted', {todo, completed})
  },
  toggleAll ({ commit, state }, { completed }) {
    state.items.forEach((todo) => {
      commit('$toggleCompleted', { todo, completed })
    })
  },
  validate ({ commit, state }, item) {
    console.log("store validate ", item)
    if(item.title === 'xxx' || !item.title.trim()) {
      commit('$updateErrors', { message: 'xxx and null not allowed' })
      return Promise.reject('xxx and null not allowed')
    }
  }
}

export const plugins = [store => {
  store.subscribe((mutation, { items }) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  })
}]
