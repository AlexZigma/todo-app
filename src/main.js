'use strict'
import './scss/styles.scss'

class Task {
  constructor(text, isCompleted = false) {
    this.id = crypto.randomUUID()
    this.text = text
    this.isCompleted = isCompleted
  }

  setIsCompleted(isCompleted) {
    this.isCompleted = isCompleted
  }
}

class Todo {
  localStorageKey = 'todo-storage'
  constructor() {
    this.inputTodoNewElement = document.getElementById('todo-new')
    this.todoFormElement = document.getElementById('todo-form')
    this.todoListElement = document.getElementById('todo-list')
    this.todoCountElement = document.getElementById('todo-count')
    this.clearCompletedButton = document.querySelector('.todo__clear-button')
    this.filterListElement = document.querySelector('.filter')
    this.completeAllButton = document.getElementById('completeAllButton')

    this.filter = 'all'
    // this.todoList = this.loadTodo()
    this.todoList = [new Task('1'), new Task('2')]

    this.bindEvents()
    this.render()
  }

  render() {
    const todoList = this.filterItems()

    let inner = ''
    todoList.slice().reverse().forEach((task) => {
      inner += this.template(task)
    })
    this.todoListElement.innerHTML = inner

    this.updateCount()
    this.updateClearButton()
  }

  template(task) {
    return (
      `<li class="todo__item todo-item card" data-id=${task.id}>
        <input class="todo-item__checkbox" 
          type="checkbox" 
          ${task.isCompleted ? 'checked' : ''}>
        <span class="todo-item__text">${task.text}</span>
        <button class="todo-item__delete-button" type="button"></button>
      </li>`
    )
  }

  loadTodo() {

  }

  saveTodo() {

  }

  addTask(text) {
    const newTask = new Task(text)
    this.todoList.push(newTask)
    this.render()
  }

  deleteTask(id) {
    this.todoList = this.todoList.filter(task => task.id !== id)
    this.render()
  }

  setTaskCompleted(id, isCompleted) {
    this.todoList.find(e => e.id === id).isCompleted = isCompleted
    this.render()
  }

  completeAll() {
    const isAllCompleted = this.todoList.every(task => task.isCompleted)
    this.todoList.forEach(task => {
      task.isCompleted = !isAllCompleted
    })
  }

  clearCompleted() {
    this.todoList = this.todoList.filter(task => !task.isCompleted)
  }

  setFilter(filter) {
    this.filter = filter
    this.render()
  }

  filterItems() {
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
    return todoList
  }

  updateClearButton() {
    const isAnyCompleted = this.todoList.some(task => task.isCompleted)
    this.clearCompletedButton.classList.toggle('hidden', !isAnyCompleted)
  }

  updateCount() {
    const count = this.todoList.filter(task => !task.isCompleted).length
    this.todoCountElement.textContent = `${count} item${count === 1 ? '' : 's'} left`
  }

  onAddNewTask = (event) => {
    event.preventDefault()
    const inputValue = this.inputTodoNewElement.value

    if (inputValue.trim().length > 0) {
      this.addTask(inputValue)
      this.inputTodoNewElement.value = ''
    }
  }

  onDeleteTask = (event) => {
    if (event.target.matches('.todo-item__delete-button')) {
      const li = event.target.closest('.todo__item')
      const id = li.dataset.id
      this.deleteTask(id)
    }
  }

  onChangeTask = (event) => {
    if (event.target.matches('.todo-item__checkbox')) {
      const li = event.target.closest('.todo__item')
      const id = li.dataset.id
      this.setTaskCompleted(id, event.target.checked)
    }
  }

  onEditTask = (event) => {
    if (event.target.matches('.todo__item')) {
      const li = event.target.closest('.todo__item')
      const id = li.dataset.id

    }
  }

  onClearCompleted = (event) => {
    this.clearCompleted()
    this.render()
  }

  onCompleteAllButtonClick = (event) => {
    this.completeAll()
    this.render()
  }

  onFilterClick = (event) => {
    const filterButton = event.target.closest('.filter__button')
    if (!filterButton) return

    const filterButtons = event.currentTarget.querySelectorAll('.filter__button');
    for (let button of filterButtons) {
      button.classList.remove('filter__button--selected');
    }
    filterButton.classList.add('filter__button--selected');

    const filter = filterButton.dataset.filter
    this.setFilter(filter)

  }

  bindEvents() {
    this.todoFormElement.addEventListener('submit', this.onAddNewTask)
    this.todoListElement.addEventListener('click', this.onDeleteTask)
    this.todoListElement.addEventListener('change', this.onChangeTask)
    this.todoListElement.addEventListener('dblclick', this.onEditTask)
    this.clearCompletedButton.addEventListener('click', this.onClearCompleted)
    this.completeAllButton.addEventListener('click', this.onCompleteAllButtonClick)
    this.filterListElement.addEventListener('click', this.onFilterClick)
  }
}

new Todo()


