import _merge from 'lodash/merge'

export const itemState = function() {
  return {
    items: [],
    activeItem: {},
    error: {
      message: '',
      errors: []
    } // expects objects with at least a message [{ message: 'fubar' }]
  }
}

export const itemMutations = {

  setItems (state, items) {
    state.items = items
  },

  addItem (state, changes) {
    state.items.push(Object.assign({}, changes))
  },

  updateItem (state, {item, changes}) {
    _merge(item, changes)
  },

  updateAll (state, changes) {
    for(const item of state.items) {
      _merge(item, changes)
    }
  },

  removeItem (state, item) {
    state.items.splice(state.items.indexOf(item), 1)
  },

  setActiveItem (state, item) {
    let aitem = (item === false) ? {} : item
    state.activeItem = aitem
  },
  //clears the items, active and errors
  clear (state) {
    state.items = []
    state.activeItem = {}
    state.error = { message: '', errors: [] }
  },

  updateActiveItem (state, changes) {
    _merge(state.activeItem, changes)
  },

  setErrors (state, errors) {
    state.error.errors = errors
  },
  //clears and then sets a single error message into the errors array
  setErrorMessage (state, message) {
    state.error.message = message
  },
  clearErrors (state) {
    state.error = { message: '', errors: [] }
  }
}

export const itemActions = {
  list ({ commit }) {
    //must implement in extended object
  },
  async addItem ({ commit, dispatch }, itemData) {
    await dispatch('validate', itemData)
    commit('addItem', itemData)
    commit('clearErrors')
  },
  async updateItem ({ dispatch, commit }, {item, changes}) {
    console.log("store updateItem ", { item, changes })
    await dispatch('validate', changes)
    commit('updateItem', {item, changes})
    commit('clearErrors')
  },
  validate ({ commit, state }, item) {
    //implement in extended object
  }
}

export const itemGetters = {}

let itemStore = {}

itemStore.options = () => {
  return {
    strict: true, //strict: process.env.NODE_ENV !== 'production'
    state: itemState(),
    mutations: itemMutations,
    actions: itemActions,
    getters: itemGetters
  }
}

itemStore.merge = (opts) => {
  return _merge({}, itemStore.options(), opts)
}

export default itemStore
