/*eslint no-unused-vars: 0*/
import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import todoLocalStore from './store/todoLocalStore'
import todoRestStore from './store/todoRestStore'
import todoVxStore from './store/todoVxStore'
import todoRestVxStore from './store/todoRestVxStore'
import App from './components/App.vue'

Vue.use(Vuex)
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/:filterBy' } //normally we have a component but its not required, just want $route.params
  ]
})

console.log("App ", App)
let todoLocalVue = new Vue({
  el: '#todoapp-local',
  provide: { todoRepo: todoLocalStore },
  //render: h => h(App),
  components: { App },
  data: { state: todoLocalStore.state }, // this registers state so its observed and reactive
  router
})
console.log("todoLocalVue ", todoLocalVue)

let todoRestVue = new Vue({
  el: '#todoapp-rest',
  provide: { todoRepo: todoRestStore }, //injection
  components: { App },
  data: { state: todoRestStore.state }, // this registers state so its observed and reactive
  router
})
console.log("todoRestVue ", todoRestVue)

/**** VUEX Local*****/
let vxvue = new Vue({
  el: '#todoapp-local-vuex',
  provide: {
    todoRepo: todoVxStore.createRepo()
  },
  components: { app: App },
  router
})

console.log("vxvue ", vxvue)

/**** VUEX REST*****/
let vxrestvue = new Vue({
  el: '#todoapp-rest-vuex',
  provide: {
    todoRepo: todoRestVxStore.createRepo()
  },
  components: { app: App },
  router
})

console.log("vxrestvue ", vxrestvue)
