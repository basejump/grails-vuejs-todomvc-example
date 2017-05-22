import Vue from 'vue'
import Vuex from 'vuex'
import itemVxStore from './itemVxStore'
// import _merge from 'lodash/merge'
// import _cloneDeep from 'lodash/cloneDeep'
import RestApi from '../shared/restApi'
Vue.use(Vuex)

let itemRestStore = {}

itemRestStore.options = function(resource) {
  //if (resource myVar == 'string')
  const restApi = RestApi.create(resource)
  this.restApi = restApi

  let actions = {
    async addItem ({ commit, dispatch }, itemData) {
      let resp = await restApi.post(itemData)
      commit('addItem', resp.data)
    },
    async updateItem ({ dispatch, commit }, {item, changes}) {
      changes.id = item.id
      let resp = await restApi.put(changes)
      commit('updateItem', {item, changes: resp.data})
    },
    async removeItem ({ commit }, item) {
      await restApi.delete(item)
      commit('removeItem', item)
    },
    async updateAll ({ dispatch, commit, state }, changes) {
      for(const item of state.items) {
        dispatch('updateItem', {item, changes})
      }
    },
    list ({ commit }) {
      restApi.list().then(resp => {
        commit('setItems', resp.data)
      })
    }
  }

  const plugins = [store => {
    restApi.defaultInterceptors(store)
  }]

  return itemVxStore.merge({ actions, plugins })

  // let opts = {
  //   strict: true, //strict: process.env.NODE_ENV !== 'production'
  //   state: itemVxStore.itemState(),
  //   mutations: itemVxStore.mutations,
  //   actions: actions,
  //   getters: itemVxStore.getters,
  //   plugins: [interceptorPlugin]
  // }
  //
  // itemVxStore
  //
  // return opts
}

itemRestStore.createStore = function(resource, opts = {}) {
  let o = Object.assign({}, this.options(resource), opts)
  return new Vuex.Store(o)
}

export default itemRestStore
