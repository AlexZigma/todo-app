'use strict'
import './scss/styles.scss'

class Task {
  constructor(text, isCompleted = false, id = crypto.randomUUID()) {
    this.text = text
    this.id = id
    this.isCompleted = isCompleted
  }

  toggle() {
    this.isCompleted = !this.isCompleted
  }
}

class Todo {
  storageKey = 'todo-storage'
  constructor() {
    this.newTaskInput = document.getElementById('todo-new')
    this.todoForm = document.getElementById('todo-form')
    this.todoListElement = document.getElementById('todo-list')
    this.todoCountElement = document.getElementById('todo-count')
    this.todoActionsElement = document.querySelector('.todo__actions')
    this.clearCompletedButton = document.querySelector('.todo__clear-button')
    this.filterListElement = document.querySelector('.filter')
    this.completeAllButton = document.getElementById('completeAllButton')

    this.filter = 'all'
    this.todoList = this.loadTodo()

    this.bindEvents()
    this.render()
  }

  render(force = true) {
    this.updateCount()
    this.updateClearButton()
    this.updateActions()

    if (!force) return

    const todoList = this.filterItems()

    const inner = []
    todoList.forEach((task) => {
      inner.push(this.getTemplate(task))
    })
    this.todoListElement.replaceChildren(...inner)
  }

  getTemplate(task) {
    const li = document.createElement('li')
    li.classList.add('todo__item', 'todo-item', 'card')
    li.dataset.id = task.id

    const input = document.createElement('input')
    input.classList.add('todo-item__checkbox')
    input.type = 'checkbox'
    input.checked = task.isCompleted

    const span = document.createElement('span')
    span.classList.add('todo-item__text')
    span.textContent = task.text

    const button = document.createElement('button')
    button.classList.add('todo-item__delete-button')
    button.type = 'button'

    li.append(input, span, button)
    return (li)
  }

  loadTodo() {
    const rawData = localStorage.getItem(this.storageKey)
    if (rawData) {
      try {
        return JSON.parse(rawData).map(item => new Task(item.text, item.isCompleted, item.id))
      } catch (error){
        console.error("error while load from storage", error);
        return []
      }
    }
    return []
  }

  saveTodo() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.todoList))
  }

  update(force = true) {
    this.saveTodo()
    this.render(force)
  }

  addTask(text) {
    const newTask = new Task(text.trim())
    this.todoList.unshift(newTask)
    this.update()
  }

  editTask(id, text) {
    const task = this.getTask(id)
    task.text = text.trim()
    this.update(false)
  }

  getTask(id) {
    return this.todoList.find(task => task.id === id)
  }

  deleteTask(id) {
    this.todoList = this.todoList.filter(task => task.id !== id)
    this.update()
  }

  toggleTask(id) {
    const todo = this.todoList.find(e => e.id === id)
    todo.toggle()
    this.update(this.filter !== 'all')
  }

  toggleAll() {
    const isAllCompleted = this.todoList.every(task => task.isCompleted)
    this.todoList.forEach(task => {
      task.isCompleted = !isAllCompleted
    })
    this.update()
  }

  clearCompleted() {
    this.todoList = this.todoList.filter(task => !task.isCompleted)
    this.update()
  }

  setFilter(filter) {
    this.filter = filter
    this.render()
  }

  filterItems() {
    switch (this.filter) {
      case 'active':
        return this.todoList.filter(task => !task.isCompleted);
      case 'completed':
        return this.todoList.filter(task => task.isCompleted);
      default:
        return this.todoList;
    }
  }

  updateClearButton() {
    const isAnyCompleted = this.todoList.some(task => task.isCompleted)
    this.clearCompletedButton.classList.toggle('hidden', !isAnyCompleted)
  }

  updateCount() {
    const count = this.todoList.filter(task => !task.isCompleted).length
    this.todoCountElement.textContent = `${count} ${count === 1 ? 'item' : 'items'} left`
  }

  updateActions() {
    const count = this.todoList.length
    this.todoActionsElement.classList.toggle('hidden', count === 0)
    this.completeAllButton.classList.toggle('hidden', count === 0)
  }

  onNewTaskSubmit = (event) => {
    event.preventDefault()
    const inputValue = this.newTaskInput.value

    if (inputValue.trim().length > 0) {
      this.addTask(inputValue)
      this.newTaskInput.value = ''
    }
  }

  onNewTaskBlur = () => {
    const inputValue = this.newTaskInput.value

    if (inputValue.trim().length > 0) {
      this.addTask(inputValue)
      this.newTaskInput.value = ''
    }
  }

  onTodoClick = (event) => {
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
      this.toggleTask(id)
    }
  }

  onTodoDblClick = (event) => {
    const li = event.target.closest('.todo__item')
    if (!li) return

    if (li.querySelector('.todo-item__input') ||
      event.target.matches('.todo-item__checkbox')) {
      return
    }
    const id = li.dataset.id
    const task = this.getTask(id)

    const input = this.startEditingTask(li, task)
  }

  startEditingTask(li, task) {
    const input = document.createElement('input')
    input.classList.add('todo-item__input')
    input.value = task.text

    li.classList.add('todo-item--editing')
    li.appendChild(input)
    input.focus()

    input.addEventListener('blur', () => {
      if (input.value.trim().length === 0) {
        this.deleteTask(task.id)
      } else {
        this.editTask(task.id, input.value)
        const label = li.querySelector('span')
        label.textContent = input.value
        input.remove()
        li.classList.remove('todo-item--editing')
      }
    })

    input.addEventListener('keydown', (event) => {
      if (['Enter'].includes(event.key)) {
        input.blur()
      }
      if (['Escape'].includes(event.key)) {
        input.value = task.text
        input.blur()
      }
    })
  }


  onClickClearCompleted = () => {
    this.clearCompleted()
  }

  onClickToggleAll = () => {
    this.toggleAll()
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
    this.todoForm.addEventListener('submit', this.onNewTaskSubmit)
    this.newTaskInput.addEventListener('blur', this.onNewTaskBlur)
    this.todoListElement.addEventListener('click', this.onTodoClick)
    this.todoListElement.addEventListener('change', this.onChangeTask)
    this.todoListElement.addEventListener('dblclick', this.onTodoDblClick)
    this.clearCompletedButton.addEventListener('click', this.onClickClearCompleted)
    this.completeAllButton.addEventListener('click', this.onClickToggleAll)
    this.filterListElement.addEventListener('click', this.onFilterClick)
  }
}

new Todo()


