import axios from 'axios'
import _merge from 'lodash/merge'
import _has from 'lodash/has'

let axiosDefaults = {
  baseURL: 'http://localhost:8080/api/'
}

let restApi = {
  axiosInstance: {},
  create: null
}

// Factory for creating new instances
restApi.create = function(config) {
  let opts = {}
  if (typeof config !== 'string') {
    opts = config
  } else if (typeof config === 'string') {
    opts.resource = config
  }
  let axiosOpts = _merge({}, axiosDefaults, opts)
  const ax = axios.create(axiosOpts)
  restApi.axiosInstance = ax

  let api = {
    post: itemData => ax.post(opts.resource, itemData),
    put: changes => ax.put(opts.resource + '/' + changes.id, changes),
    delete: item => ax.delete(opts.resource + '/' + item.id),
    list: query => ax.get(opts.resource, query),
    get: id => ax.get(opts.resource + '/' + id)
  }
  _merge(this, api)
  if(opts.store) this.defaultInterceptors(opts.store)
  return this
}

//setup default interceptos to catch and set the errors on the store
restApi.defaultInterceptors = function(store) {
  restApi.axiosInstance.interceptors.response.use(
    response => {
      _has(store, 'clearErrors') ? store.clearErrors() : store.commit('clearErrors')
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
      _has(store, 'setErrorMessage') ? store.setErrorMessage(errMsg) : store.commit('setErrorMessage', errMsg)
      return Promise.reject(error)
    }
  )
}
export default restApi
