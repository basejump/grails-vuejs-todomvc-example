/*
 * Generic item store that can be extended and used for anything.
 * loosely based on the Storage API but with errors
 * https://developer.mozilla.org/en-US/docs/Web/API/Storage
 */

import _ from 'lodash'

export const itemState = function() {
  return {
    items: [],
    activeItem: {},
    error: {
      message: '',
      errors: []
    }
  }
}

export const itemMutations = {

  setItems (items) {
    this.state.items = items
  },
  async addItem (changes) {
    await this.validate(changes)
    this.state.items.push(Object.assign({}, changes))
  },

  async updateItem ({item, changes}) {
    await this.validate(changes)
    _.merge(item, changes)
  },

  async removeItem (item) {
    this.state.items.splice(this.state.items.indexOf(item), 1)
  },

  updateAll (changes) {
    for(const item of this.state.items) {
      this.updateItem({item, changes})
    }
  },

  setActiveItem (item) {
    let aitem = (item === false) ? {} : item
    this.state.activeItem = aitem
  },
  //clears the items, active and errors
  clear () {
    this.items = []
    this.activeItem = {}
    this.clearErrors()
  },

  updateActiveItem (changes) {
    this.updateItem(this.activeItem, changes)
  },

  setErrors (errors) {
    this.state.error.errors = errors
  },
  //clears and then sets a single error message into the errors array
  setErrorMessage (message) {
    this.state.error.message = message
  },
  //gets the first error message
  getErrorMessage () {
    return this.state.error.message
  },

  clearErrors () {
    this.state.error.message = ''
    this.state.error.errors = []
  },

  //empty validator, to be overriden if needed
  validate (item) {
    return Promise.resolve()
  }
}

let ItemStore = _.clone(itemMutations)
ItemStore.state = itemState()

export default ItemStore

