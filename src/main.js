import './scss/styles.scss'

const inputTodoNewElement = document.getElementById('todo-new')
const todoFormElement = document.getElementById('todo-form')
const todoListElement = document.getElementById('todo-list')
const todoCountElement = document.getElementById('todo-count')


const Todo = {
  todoList: [new Task('1'), new Task('2')],
  render() {
    todoListElement.innerHTML = ''
    this.todoList.forEach((task) => {
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
      buttonIsCompletedElement.addEventListener('change', (e) => {
        this.todoList.find(e => e.id === task.id).isCompleted = buttonIsCompletedElement.checked
        // task.isCompleted = !task.isCompleted
        console.log(this.todoList.map(i => i.isCompleted))
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
  }
}

todoFormElement.addEventListener('submit', (e) => {
  e.preventDefault()
  Todo.addTask()
})

Todo.render()


function Task(text, isActive) {
  this.id = crypto.randomUUID()
  this.text = text
  this.isCompleted = false
}
