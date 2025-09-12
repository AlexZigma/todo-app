'use strict'
import './scss/styles.scss'

const inputTodoNewElement = document.getElementById('todo-new')
const todoFormElement = document.getElementById('todo-form')
const todoListElement = document.getElementById('todo-list')
const todoCountElement = document.getElementById('todo-count')
const clearCompletedElement = document.querySelector('.todo__button-clear')
const filterButtonAll = document.getElementById('filterButtonAll')
const filterButtonActive = document.getElementById('filterButtonActive')
const filterButtonCompleted = document.getElementById('filterButtonCompleted')
const completeAllButton = document.getElementById('completeAllButton')

const Todo = {
  todoList: [new Task('1'), new Task('2')],
  filter: 'all',
  render() {
    todoListElement.innerHTML = ''
    let todoList = this.todoList
    switch (this.filter) {
      case 'all':
        break
      case 'completed':
        todoList = todoList.filter(task => task.isCompleted)
        break
      case 'active':
        todoList = todoList.filter(task => !task.isCompleted)
        break
    }

    todoList.forEach((task) => {
      const li = document.createElement('li')
      li.classList.add('todo__element')
      // li.id = todo.id
      li.innerHTML =
        // <li class="todo__element id=${todo.id}">
        `
        <div class="card">
          <input class="card__checkbox" type="checkbox" name="" id=""
          ${task.isChecked ? 'checked' : ''}>
          <span class="card__text">${task.text}</span>
          <button class="card__button-remove" type="button""></button>
        </div>
        `
      // </li>
      const buttonDeleteElement = li.querySelector('.card__button-remove')
      const buttonIsCompletedElement = li.querySelector('.card__checkbox')


      buttonDeleteElement.addEventListener('click', (e) => this.deleteTask(task.id))

      buttonIsCompletedElement.checked = task.isCompleted
      buttonIsCompletedElement.addEventListener('change', (e) => {
        this.todoList.find(e => e.id === task.id).isCompleted = buttonIsCompletedElement.checked
        // task.isCompleted = !task.isCompleted
      })
      todoListElement.appendChild(li)
    })

    todoCountElement.textContent = this.todoList.length
  },
  deleteTask(id) {
    // id = this.parentElement.parentElement.id
    // alert(id)
    this.todoList = this.todoList.filter(task => task.id !== id)
    this.render()
  },
  addTask() {
    if (inputTodoNewElement.value) {
      const newTask = new Task(inputTodoNewElement.value)
      this.todoList.push(newTask)
      inputTodoNewElement.value = '';
      this.render()
    }
  },
  clearCompleted() {
    this.todoList = this.todoList.filter(task => !task.isCompleted)
    this.render()
  },
  completeAll() {
    const isAllCompleted = this.todoList.every(task => task.isCompleted)
    this.todoList.map(task => {
      task.isCompleted = !isAllCompleted
    })
    this.render()
  }
}

todoFormElement.addEventListener('submit', (e) => {
  e.preventDefault()
  Todo.addTask()
})

clearCompletedElement.addEventListener('click', (event) => {
  Todo.clearCompleted()
})

const filterButtons = document.querySelectorAll('.filter-button');
for (let button of filterButtons) {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.remove('filter-button--selected'));
    button.classList.add('filter-button--selected');
  })
}

completeAllButton.addEventListener('click', (event) => {
  Todo.completeAll()
})

filterButtonAll.addEventListener('click', (event) => {
  Todo.filter = 'all'
  Todo.render()
})
filterButtonActive.addEventListener('click', (event) => {
  Todo.filter = 'active'
  Todo.render()
})
filterButtonCompleted.addEventListener('click', (event) => {
  Todo.filter = 'completed'
  Todo.render()
})

Todo.render()


function Task(text, isActive) {
  this.id = crypto.randomUUID()
  this.text = text
  this.isCompleted = false
}
