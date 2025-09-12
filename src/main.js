'use strict'
import './scss/styles.scss'

const inputTodoNewElement = document.getElementById('todo-new')
const todoFormElement = document.getElementById('todo-form')
const todoListElement = document.getElementById('todo-list')
const todoCountElement = document.getElementById('todo-count')
const clearCompletedButton = document.querySelector('.todo__button-clear')
const filterListElement = document.querySelector('.filter-list')
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
      li.dataset.id = task.id
      li.innerHTML = `
        <div class="card">
          <input class="card__checkbox" type="checkbox" name="" id=""
          ${task.isCompleted ? 'checked' : ''}>
          <span class="card__text">${task.text}</span>
          <button class="card__button-remove" type="button""></button>
        </div>
        `
      todoListElement.appendChild(li)
    })
    this.updateCount()
    this.updateClearButton()
  },
  setTaskCompleted(id, isCompleted) {
    this.todoList.find(e => e.id === id).isCompleted = isCompleted
    this.render()
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
  },
  setFilter(filter) {
    this.filter = filter
    this.render()
  },
  updateClearButton() {
    const isAnyCompleted = Todo.todoList.some(task => task.isCompleted)
    clearCompletedButton.classList.toggle('hidden', !isAnyCompleted)
  },
  updateCount() {
    const count = this.todoList.filter(task => !task.isCompleted).length
    todoCountElement.textContent = `${count} item${count === 1 ? '' : 's'} left`
  }
}

todoFormElement.addEventListener('submit', (e) => {
  e.preventDefault()
  Todo.addTask()
})

todoListElement.addEventListener('click', (event) => {
  const li = event.target.closest('.todo__element')
  if (!li) {
    return
  }

  const id = li.dataset.id
  if (event.target.matches('.card__button-remove')) {
    Todo.deleteTask(id)
  }
})

todoListElement.addEventListener('change', (event) => {
  const li = event.target.closest('.todo__element')
  if (!li) {
    return
  }

  const id = li.dataset.id
  if (event.target.matches('.card__checkbox')) {
    Todo.setTaskCompleted(id, event.target.checked)
  }

})

clearCompletedButton.addEventListener('click', (event) => {
  Todo.clearCompleted()
})

completeAllButton.addEventListener('click', (event) => {
  Todo.completeAll()
})

filterListElement.addEventListener('click', (event) => {
  const filterButton = event.target.closest('.filter-button')
  if (!filterButton) return

  const filterButtons = event.currentTarget.querySelectorAll('.filter-button');
  for (let button of filterButtons) {
    button.classList.remove('filter-button--selected');
  }
  filterButton.classList.add('filter-button--selected');

  const filter = filterButton.dataset.filter
  Todo.setFilter(filter)
})

Todo.render()

function Task(text) {
  this.id = crypto.randomUUID()
  this.text = text
  this.isCompleted = false
}
