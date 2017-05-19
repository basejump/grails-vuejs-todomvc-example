//returns just the functions on an object that match the passed in funcs array
//we do this so we can take advantage of the spread operator and proxy functions from Vue
export const mapStoreFunctions = (funcs) => {
  return funcs.reduce((mergeObj, fn) => {
    mergeObj[fn] = function mappedMethod(...args) {
      return this.$store[fn].apply(this.$store, args)
    }
    return mergeObj
  }, {})
}

//adds a store prop. simulates how vuex does it
export const addStoreProp = function(vueClass) {
  //add the $store getter to Vue
  Object.defineProperty(vueClass.prototype, '$store', {
    get() {
      const options = this.$options
      let store
      //pulled from how vuex does it so it works for any store we setup
      if (options.store) {
        store = options.store
      } else {
        store = this.$root.$options.store
      }
      return store
    }
  })
}
