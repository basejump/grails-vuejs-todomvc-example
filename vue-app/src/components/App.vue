<style src="todomvc-app-css/index.css"></style>

<style>
  .todoapp{ margin-top: 85px; }
  .todoapp h1{ top: -80px; font-size: 50px; text-align: left;}
  div.errors{
    padding:5px;border:1px solid orange;
    color:#c4641b
  }
  .todoapp div.filter {
    position: absolute;
    top: -25px;
    width: 100%;
    text-align: right;
  }
  .todoapp div.filter input {
    font-size: 14px;
  }
</style>

<template>
  <section class="todoapp">
    <!-- header -->
    <header class="header">
      <h1>{{name}} todos</h1>
      <div class="filter"><input placeholder="filter..." v-model="filterVal"></div>
      <div class="errors" v-show="error.message"><p>{{ error.message }}</p></div>
      <input class="new-todo"
             autofocus autocomplete="off"
             placeholder="What needs to be done?"
             @keyup.enter="addTodo">
    </header>

    <!-- main section -->
    <section class="main" v-show="todos.length" >
      <input class="toggle-all" type="checkbox"
             :checked="allChecked"
             @change="todoRepo.updateAll({ completed: !allChecked })">
      <ul class="todo-list">
        <todo v-for="(todo, index) in filteredTodos" :key="index" :todo="todo"></todo>
      </ul>
    </section>

    <!-- footer -->
    <footer class="footer" v-show="todos.length" v-cloak>
        <span class="todo-count">
          <strong>{{ remaining }}</strong> {{ remaining | pluralize }} left
        </span>
      <ul class="filters">
        <li><router-link to="/all" :class="{ selected: visibility == 'all' }">All</router-link></li>
        <li><router-link to="/active" :class="{ selected: visibility == 'active' }">Active</router-link></li>
        <li><router-link to="/completed" :class="{ selected: visibility == 'completed' }">Completed</router-link></li>
      </ul>
      <button class="clear-completed" @click="todoRepo.removeCompleted()" v-show="todos.length > remaining">
        Clear completed
      </button>
    </footer>

  </section>
</template>

<script>
  import Todo from './Todo.vue'

  const filters = {
    all: todos => todos,
    active: todos => todos.filter(todo => !todo.completed),
    completed: todos => todos.filter(todo => todo.completed)
  }

  // app Vue class using extend to see we can reuse it
  export default {
    props: ['name'],
    components: { Todo },
    inject: ['todoRepo'],
    // app initial state
    data () {
      return {
        visibility: 'all',
        filterVal: ''
      }
    },

    // watch route property for changes to filter visibility
    watch: {
      '$route': function () {
        this.visibility = this.$route.params.filterBy || 'all'
      }
    },

    computed: {
      error () { return this.todoRepo.state.error },
      // activeItem () { return this.$store.state.activeItem },
      todos () { return this.todoRepo.state.items },
      allChecked () { return this.todos.every(todo => todo.completed) },
      filteredTodos () {
        let filteredData = filters[this.visibility](this.todos)
        let filterVal = this.filterVal && this.filterVal.toLowerCase()
        if (filterVal) {
          filteredData = filteredData.filter(row => {
            return row.title.toLowerCase().indexOf(filterVal) > -1
          })
        }
        //console.log("filteredData", filteredData)
        return filteredData
      },
      remaining () { return this.todos.filter(todo => !todo.completed).length }
    },

    filters: {
      pluralize: n => n === 1 ? 'item' : 'items'
    },

    //some methods will be added in the concrete classes below and be delegated to store
    methods: {
      addTodo (e) {
        if(!e.target.value.trim()) return
        let newTodo = {
          title: e.target.value.trim(),
          completed: false
        }
        this.todoRepo.addItem(newTodo).then(() => {
          e.target.value = ''
        })
      }
    },

    created: function() {
      console.log("Ready " + this._uid)
      this.todoRepo.list()
      //ensures its properly set
      if(this.$route.params.filterBy) this.visibility = this.$route.params.filterBy
    }
  }
</script>
