<style>

  .todo-list li.editing {
    border-bottom: 1px solid transparent;
  }

  .todo-list li.editing .edit {
    border:1px solid transparent;
    border-bottom: 1px solid lightblue;
    box-shadow: none;
  }

</style>
<template>
  <li class="todo"
      :key="todo.id"
      :class="{ completed: todo.completed, editing: editingTodo }">
    <div >
      <input class="toggle" type="checkbox" :checked="todo.completed"
             @click="todoRepo.toggleComplete(todo)" >
      <label class="view" @click="editTodo()">{{ todo.title }}</label>
      <input class="edit" type="text"
             v-todo-focus="editingTodo"
             v-model="editingTodo.title"
             @keyup.enter="doneEdit()"
             @keyup.esc="resetEdit()"
             @blur="doneEdit()">
      <button class="destroy" @click="todoRepo.removeItem(todo)"></button>
    </div>

  </li>
</template>

<script>
  import _cloneDeep from 'lodash/cloneDeep'

  export default {
    name: 'Todo',
    props: ['todo'],
    inject: ['todoRepo'],
    data () {
      return {
        editingTodo: false //either a copy of the todo we are editing or false
      }
    },
    directives: {
      'todo-focus' (el, binding, { context }) {
        if (binding.value) context.$nextTick(() => el.focus())
      }
    },

    methods: {
      editTodo () {
        this.editingTodo = _cloneDeep(this.todo) //clone it for editing so we don't mess with master copy
      },
      doneEdit () {
        const {item, changes} = {item: this.todo, changes: this.editingTodo}
        if (!this.editingTodo) return //prevents both [blur] and [enter key] events from running this, only 1 needs to run it.

        this.todoRepo.updateItem({item, changes}).then(() => {
          console.log("doneEdit success", {item, changes})
          this.resetEdit()
        })
      },
      resetEdit (e) {
        console.log("resetEdit", e)
        this.editingTodo = false
        this.todoRepo.clearErrors()
      }
    }
  }
</script>
