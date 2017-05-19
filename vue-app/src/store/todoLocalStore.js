import ItemStore from "./item/ItemStore"
import _cloneDeep from 'lodash/cloneDeep'

export const LOCALSTORAGE_KEY = 'grails-vue-todomvc-example'

let itemStore = _cloneDeep(ItemStore)

const TodoStore = {
  ...itemStore, //use spread operator to add in functions
  //removes all completed
  async removeCompleted () {
    this.state.items = this.state.items.filter(todo => !todo.completed)
  },
  //removes all completed
  toggleComplete(item) {
    let changes = { completed: !item.completed }
    return itemStore.updateItem.apply(this, [{item, changes}])
  },
  list () {
    let items = JSON.parse(window.localStorage.getItem(LOCALSTORAGE_KEY) || '[]')
    this.setItems(items)
  },
  //example validate to simulate error
  validate (item) {
    console.log("store validate ", item)
    if(('title' in item) && (item.title === 'xxx' || !item.title.trim())) {
      this.setErrorMessage('xxx and null not allowed')
      return Promise.reject('xxx and null not allowed')
    } else{
      return Promise.resolve()
    }
  }
}

//use proxy, mostly just playing around with them here. could just over load the function too above
for(const fn of ['removeItem', 'removeCompleted', 'updateItem', 'addItem']) {
  TodoStore[fn] = new Proxy(TodoStore[fn], {
    apply: async function (fn, thisArg, argList) {
      await Reflect.apply(fn, thisArg, argList)
      window.localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(TodoStore.state.items))
      TodoStore.clearErrors()
    }
  })
}

console.log("TodoStore ", TodoStore)

export default TodoStore
