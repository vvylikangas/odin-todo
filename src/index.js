import 'bulma/css/bulma.min.css';
import 'bulma-calendar/dist/css/bulma-calendar.min.css';
import bulmaCalendar from 'bulma-calendar';

var defaultOptions = {
  color: 'primary',
  isRange: false,
  allowSameDayRange: true,
  lang: 'en-US',
  startDate: new Date(Date.now()),
  endDate: undefined,
  minDate: null,
  maxDate: null,
  disabledDates: [],
  disabledWeekDays: undefined,
  highlightedDates: [],
  weekStart: 0,
  dateFormat: 'dd.MM.yyyy',
  enableMonthSwitch: true,
  enableYearSwitch: true,
  displayYearsCount: 50,
};

// Initialize all input of date type.
const calendars = bulmaCalendar.attach('[type="date"]', defaultOptions);

// To access to bulmaCalendar instance of an element
const element = document.querySelector('#duedate');
if (element) {
  // bulmaCalendar instance is available as element.bulmaCalendar
  element.bulmaCalendar.on('select', (datepicker) => {
    console.log(datepicker.data.value());
  });
}

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
        <button class=" button is-danger is-outlined delete-btn" data-index="${index}">Delete</button>
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
        <button class="button is-danger is-outlined delete-btn" data-index="${index}">Delete</button>
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

      // Determine which project to use
      const project = projectSelect.value;

      // title and due date must be provided
      if (title && dueDateInput) {
        TodoModule.addTodo(title, desc, dueDateInput, priority, project);
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
    projectButton.classList.add('button');
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
