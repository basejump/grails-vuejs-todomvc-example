import { mapMutations, mapActions, mapGetters } from 'vuex'
import todoVxStore from './store/todoVxStore'
import todoRestVxStore from './store/todoRestVxStore'

export const mountVxVue = (Klass, el) => {
  let store = todoVxStore.createStore()
  console.log("todoVxStore ", store)
  let methods = {
    ...mapMutations([
      'removeItem', 'updateAll', 'clearErrors', 'setActiveItem'
    ]),
    ...mapActions([
      'addItem', 'updateItem', 'editActiveItem', 'toggleComplete', 'list', 'removeCompleted'
    ])
  }
  let computed = mapGetters(['getErrorMessage'])

  let vxvue = new Klass({computed, methods, store})
  vxvue.name = 'Vx Local'
  vxvue.$mount(el)
  console.log("todoLocalVue ", vxvue)
  return vxvue
}

export const mountVxRestVue = (Klass, el) => {
  let restStore = todoRestVxStore.createStore()
  let methods = {
    ...mapMutations([
      'clearErrors', 'setActiveItem'
    ]),
    ...mapActions([
      'addItem', 'updateItem', 'editActiveItem', 'toggleComplete', 'list',
      'removeCompleted', 'removeItem', 'updateAll'
    ])
  }
  let computed = mapGetters(['getErrorMessage'])

  let vxvue = new Klass({computed, methods, store: restStore})
  vxvue.name = 'Vx Rest'
  vxvue.$mount(el)
  console.log("todoLocalVue ", vxvue)
  return vxvue
}
