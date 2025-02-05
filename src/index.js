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
};

let longDate = new Date(Date.now());
let shortDate = longDate.toDateString();
addTodo('clean code', 'refactor everything', shortDate, 'low');
