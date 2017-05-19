import itemRestStore from "./item/itemRestStore"

let restStore = itemRestStore.createStore('todo')
console.log("restStore ", restStore)

const todoStore = {
  ...restStore, //use the es6 spread operator to add in from base itemRestStore
  //removes all completed
  async removeCompleted () {
    for(const item of this.state.items.filter(todo => todo.completed)) {
      this.removeItem(item)
    }
  },
  toggleComplete(item) {
    let changes = { completed: !item.completed }
    this.updateItem({item, changes})
  }
}

export default todoStore
