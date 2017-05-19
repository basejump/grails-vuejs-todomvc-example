import itemStore from "./ItemStore"
//import _ from 'lodash'
import RestApi from '../shared/restApi'

let itemRestStore = {}

itemRestStore.createStore = function(resource) {
  let restApi = RestApi.create(resource)

  this.store = {
    ...itemStore,
    //overrides ItemStore for validation
    async addItem (changes) {
      let resp = await restApi.post(changes)
      itemStore.addItem.apply(this, [resp.data])
    },
    //overrides ItemStore for validation
    async updateItem ({item, changes}) {
      changes.id = item.id
      let resp = await restApi.put(changes)
      itemStore.updateItem.apply(this, [{item, changes: resp.data}])
    },
    async removeItem (item) {
      await restApi.delete(item)
      itemStore.removeItem.apply(this, [item])
    },
    list () {
      restApi.list().then(resp => {
        this.setItems(resp.data)
      })
    }
  }
  restApi.defaultInterceptors(this.store)
  return this.store
}

export default itemRestStore

