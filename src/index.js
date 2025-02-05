const todos = [];

class Todo {
  constructor(title, description, dueDate, priority, project) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.project = project;
  }
}

const addTodo = (title, desc, dueDate, priority, project = 'general') => {
  const newTodo = new Todo(title, desc, dueDate, priority, project);
  todos.push(newTodo);
  localStorage.setItem('odinTodos', JSON.stringify(todos));
};

const showTodos = () => {
  const todoCont = document.getElementById('todos-container');
  let todos = localStorage.getItem('odinTodos');
  if (todos) {
    todos = JSON.parse(todos);
    todos.forEach((todo) => {
      const todoDiv = document.createElement('div');
      todoDiv.classList.add('todo-item');
      todoDiv.innerHTML = `
        <h3>${todo.title}</h3>
        <p>Description: ${todo.description}</p>
        <p>Due: ${todo.dueDate}</p>
        <p>Priority: ${todo.priority}</p>
        <p>Project: ${todo.project}</p>
      `;
      todoCont.appendChild(todoDiv);
    });
  }
};

showTodos();
