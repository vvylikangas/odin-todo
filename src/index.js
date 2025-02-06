import { format } from 'date-fns';

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
      const todoDiv = document.createElement('div');
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

  const renderByProject = (projectName) => {
    const todoContainer = document.getElementById('todos-container');
    todoContainer.innerHTML = '';

    let filteredTodos = TodoModule.getTodos().filter(
      (todo) => todo.project === projectName
    );

    filteredTodos.forEach((todo, index) => {
      const todoDiv = document.createElement('div');
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
        renderByProject(projectName);
      });
    });
  };

  return { renderTodos, renderByProject };
})();

const AppController = (function () {
  const loadProjects = () => {
    const projectSelect = document.getElementById('project');
    projectSelect.innerHTML = '';

    const projects = JSON.parse(localStorage.getItem('odinTodoProjects')) || [
      'General',
    ];

    projects.forEach((project) => {
      const option = document.createElement('option');
      option.value = project;
      option.textContent = project;
      projectSelect.appendChild(option);

      addProjectButton(project);
    });
  };

  const setupEventListeners = () => {
    // handle adding new project type
    document
      .getElementById('new-project-btn')
      .addEventListener('click', (e) => {
        e.preventDefault();

        const projectSelect = document.getElementById('project');
        const newProjectInput = document.getElementById('newproject');
        const newProject = newProjectInput.value.trim();
        const projects = JSON.parse(
          localStorage.getItem('odinTodoProjects')
        ) || ['General'];

        if (newProject && !projects.includes(newProject)) {
          // save project name
          projects.push(newProject);
          localStorage.setItem('odinTodoProjects', JSON.stringify(projects));

          // add new project button
          addProjectButton(newProject);

          // add new project as a dropdown option
          const option = document.createElement('option');
          option.value = newProject;
          option.textContent = newProject;
          projectSelect.appendChild(option);

          // select new project
          projectSelect.value = newProject;

          // empty input field
          newProjectInput.value = '';
        }
      });

    // handle adding new todo
    document.getElementById('add-todo-btn').addEventListener('click', (e) => {
      e.preventDefault();

      const title = document.getElementById('title').value;
      const desc = document.getElementById('desc').value;
      const dueDateInput = document.getElementById('duedate').value;
      const priority = document.querySelector(
        'input[name="priority"]:checked'
      ).value;
      const projectSelect = document.getElementById('project');

      const dueDateFormatted = dueDateInput
        ? format(new Date(dueDateInput), 'dd.MM.yyyy')
        : null;

      // Determine which project to use
      const project = projectSelect.value;

      // title and due date must be provided
      if (title && dueDateFormatted) {
        TodoModule.addTodo(title, desc, dueDateFormatted, priority, project);
        DisplayController.renderTodos();
      }
    });

    // handle filtering by project
    document.getElementById('all').addEventListener('click', () => {
      DisplayController.renderTodos();
    });
  };

  const addProjectButton = (projectName) => {
    const projectContainer = document.querySelector('.todo-projects');

    if (
      Array.from(projectContainer.children).some(
        (btn) => btn.textContent === projectName
      )
    ) {
      return;
    }

    const projectButton = document.createElement('button');
    projectButton.textContent = projectName;
    projectButton.dataset.project = projectName;

    projectButton.addEventListener('click', () => {
      DisplayController.renderByProject(projectName);
    });

    projectContainer.appendChild(projectButton);
  };

  const init = () => {
    loadProjects();
    setupEventListeners();
    DisplayController.renderTodos();
  };

  return { init };
})();

AppController.init();
