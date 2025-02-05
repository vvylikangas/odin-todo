const TodoModule = (function () {
  const todos = JSON.parse(localStorage.getItem('odinTodos')) || [];

  class Todo {
    constructor(title, description, dueDate, priority, project) {
      this.title = title;
      this.description = description;
      this.dueDate = dueDate;
      this.priority = priority;
      this.project = project || general;
    }
  }

  const addTodo = (title, desc, dueDate, priority, project = 'general') => {
    const newTodo = new Todo(title, desc, dueDate, priority, project);
    todos.push(newTodo);
    saveTodos();
  };

  const removeTodo = (index) => {
    todos.splice(index, 1);
    saveTodos();
  };

  const getTodos = () => todos;

  const saveTodos = () => {
    localStorage.setItem('odinTodos', JSON.stringify(todos));
  };

  return { addTodo, removeTodo, getTodos };
})();

const DisplayController = (function () {
  const renderTodos = () => {
    const todoContainer = document.getElementById('todos-container');
    todoContainer.innerHTML = '';

    TodoModule.getTodos().forEach((todo, index) => {
      todoDiv.classList.add('todo-item');
      todoDiv.innerHTML = `
        <h3>${todo.title}</h3>
        <p>Description: ${todo.description}</p>
        <p>Due: ${todo.dueDate}</p>
        <p>Priority: ${todo.priority}</p>
        <p>Project: ${todo.project}</p>
        <button class="delete-btn" data-index="${index}">Delete</button>
      `;
      todoContainer.appendChild(todoDiv);
    });

    document.querySelectorAll('.delete-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const index = e.target.dataset.index;
        TodoModule.removeTodo(index);
        renderTodos();
      });
    });
  };

  return { renderTodos };
})();
