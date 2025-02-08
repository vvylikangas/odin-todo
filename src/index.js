import 'bulma/css/bulma.min.css';
import 'bulma-calendar/dist/css/bulma-calendar.min.css';
import bulmaCalendar from 'bulma-calendar';

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
    todos.unshift(newTodo);
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
  const createTodoElement = (todo, index) => {
    const todoDiv = document.createElement('div');
    todoDiv.classList.add('todo-item', 'card', 'mb-1');

    let priorityClass = '';

    // Check the priority and assign the appropriate class
    switch (todo.priority) {
      case 'Low':
        priorityClass = 'has-text-success'; // Green for low priority
        break;
      case 'Medium':
        priorityClass = 'has-text-warning'; // Yellow for medium priority
        break;
      case 'High':
        priorityClass = 'has-text-danger'; // Red for high priority
        break;
      default:
        priorityClass = ''; // No color if the priority is not set
    }

    todoDiv.innerHTML = `
      <header class="card-header">
        <p class="card-header-title">${todo.title}</p>
        <p class="card-header-title">${todo.dueDate}</p>
        <button class="button is-danger is-outlined delete-btn m-1" data-index="${index}">Delete</button>
      </header>
      <div class="card-content">
        <div class="content">
          <p>Description: ${todo.description}</p>
        </div>
      </div>
      <footer class="card-footer">
        <p class="card-footer-item is-flex is-flex-direction-column"><strong>Due:</strong><span>${todo.dueDate}</span></p>
        <p class="card-footer-item is-flex is-flex-direction-column ${priorityClass}"><strong>Priority:</strong><span>${todo.priority}</span></p>
        <p class="card-footer-item is-flex is-flex-direction-column"><strong>Project:</strong><span>${todo.project}</span></p>
      </footer>
    `;
    return todoDiv;
  };

  const renderTodos = () => {
    const todoContainer = document.getElementById('todos-container');
    const deleteProjectDiv = document.getElementById('delete-project');
    todoContainer.innerHTML = '';
    deleteProjectDiv.innerHTML = '';

    TodoModule.getTodos().forEach((todo, index) => {
      const todoDiv = createTodoElement(todo, index);
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
    const deleteProjectDiv = document.getElementById('delete-project');
    todoContainer.innerHTML = '';
    deleteProjectDiv.innerHTML = '';

    let filteredTodos = TodoModule.getTodos().filter(
      (todo) => todo.project === projectName
    );

    if (projectName !== 'General') {
      const deleteProjectButton = document.createElement('button');
      deleteProjectButton.classList.add(
        'button',
        'is-danger',
        'is-outlined',
        'mb-3'
      );
      deleteProjectButton.textContent = `Delete Project: ${projectName}`;
      deleteProjectButton.addEventListener('click', () => {
        // remove all tasks for hte project
        TodoModule.getTodos().forEach((todo, index) => {
          if (todo.project === projectName) {
            TodoModule.removeTodo(index);
          }
        });

        // remove from project list
        const projects =
          JSON.parse(localStorage.getItem('odinTodoProjects')) || 'General';
        const updatedProjects = projects.filter(
          (project) => project != projectName
        );
        localStorage.setItem(
          'odinTodoProjects',
          JSON.stringify(updatedProjects)
        );

        // Remove the project button from the Menu
        const projectButtons = document.querySelectorAll('.project-btn');
        projectButtons.forEach((button) => {
          if (button.textContent === projectName) {
            button.remove();
          }
        });

        // Remove the project dropdown option
        const projectSelect = document.getElementById('project');
        const projectOption = projectSelect.querySelector(
          `option[value="${projectName}"]`
        );
        if (projectOption) {
          projectOption.remove();
        }

        // re-render
        renderTodos();
      });
      // add delete project button
      deleteProjectDiv.appendChild(deleteProjectButton);
    }

    filteredTodos.forEach((todo, index) => {
      const todoDiv = createTodoElement(todo, index);
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

      insertNewProjectButton(project);
    });
  };

  const setupEventListeners = () => {
    // handle adding new project type
    const addProjectButton = document.getElementById('new-project-btn');
    const newProjectInput = document.getElementById('newproject');

    const toggleAddProjectButton = () => {
      if (newProjectInput.value.trim() === '') {
        addProjectButton.disabled = true;
      } else {
        addProjectButton.disabled = false;
      }
    };

    toggleAddProjectButton();

    newProjectInput.addEventListener('input', toggleAddProjectButton);

    addProjectButton.addEventListener('click', (e) => {
      e.preventDefault();

      const projectSelect = document.getElementById('project');
      const newProject = newProjectInput.value.trim();
      const projects = JSON.parse(localStorage.getItem('odinTodoProjects')) || [
        'General',
      ];

      if (newProject && !projects.includes(newProject)) {
        // save project name
        projects.push(newProject);
        localStorage.setItem('odinTodoProjects', JSON.stringify(projects));

        // add new project button
        insertNewProjectButton(newProject);

        // add new project as a dropdown option
        const option = document.createElement('option');
        option.value = newProject;
        option.textContent = newProject;
        projectSelect.appendChild(option);

        // select new project
        projectSelect.value = newProject;

        // empty input field
        newProjectInput.value = '';
        toggleAddProjectButton();
      }
    });

    document.addEventListener('DOMContentLoaded', () => {
      const modal = document.querySelector('.modal');
      const modalBackground = document.querySelector('.modal-background');
      const modalClose = document.querySelector('.modal-close');
      const modalTrigger = document.querySelector('.js-modal-trigger');
      const addTodoBtn = document.getElementById('add-todo-btn');

      function openModal() {
        modal.classList.add('is-active');
      }

      function closeModal() {
        modal.classList.remove('is-active');
      }

      // Open modal
      if (modalTrigger) {
        modalTrigger.addEventListener('click', openModal);
      }

      // Close modal when clicking close button or background
      [modalClose, modalBackground].forEach((el) => {
        if (el) el.addEventListener('click', closeModal);
      });

      // Close modal on Escape key
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          closeModal();
        }
      });

      // Handle adding new todo & close modal
      if (addTodoBtn) {
        addTodoBtn.addEventListener('click', (e) => {
          e.preventDefault();

          const title = document.getElementById('title').value.trim();
          const desc = document.getElementById('desc').value.trim();
          const dueDateInput = document.getElementById('duedate').value;
          const priority = document.querySelector(
            'input[name="priority"]:checked'
          )?.value;
          const project = document.getElementById('project')?.value;

          if (title && dueDateInput) {
            TodoModule.addTodo(title, desc, dueDateInput, priority, project);
            DisplayController.renderTodos();
            closeModal(); // Close modal after adding task

            // Reset the form
            const form = document.querySelector('#todo-form'); // Assuming your form has an id of 'todo-form'
            form.reset(); // Resets all fields

            // Set defaults
            document.querySelector(
              'input[name="priority"][value="Low"]'
            ).checked = true;
            document.getElementById('project').value = 'General';

            const element = document.querySelector('#duedate');
            if (element && element.bulmaCalendar) {
              // Set today's date in the calendar
              const today = new Date();
              element.bulmaCalendar.value(today); // Set the date using the value method
              element.bulmaCalendar.refresh();
            }
          }
        });
      }
    });

    // show all projects
    const allProjectsButton = document.getElementById('all');

    allProjectsButton.addEventListener('click', () => {
      // Remove 'is-selected' and 'is-primary' from all project buttons
      document.querySelectorAll('.project-btn').forEach((button) => {
        button.classList.remove('is-selected', 'is-primary');
      });

      // Add the classes to the clicked button
      allProjectsButton.classList.add('is-selected', 'is-primary');
      DisplayController.renderTodos();
    });
  };

  const insertNewProjectButton = (projectName) => {
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
    projectButton.classList.add('button', 'project-btn', 'is-flex-grow-1');
    projectButton.dataset.project = projectName;

    projectButton.addEventListener('click', () => {
      // Remove 'is-selected' and 'is-primary' from all project buttons
      document.querySelectorAll('.project-btn').forEach((button) => {
        button.classList.remove('is-selected', 'is-primary');
      });

      // Add the classes to the clicked button
      projectButton.classList.add('is-selected', 'is-primary');
      DisplayController.renderByProject(projectName);
    });

    projectContainer.appendChild(projectButton);
  };

  const initCalendar = () => {
    const defaultOptions = {
      color: 'primary',
      isRange: false,
      allowSameDayRange: true,
      lang: 'en-US',
      startDate: new Date(),
      endDate: undefined,
      minDate: null,
      maxDate: null,
      disabledDates: [],
      disabledWeekDays: undefined,
      highlightedDates: [],
      weekStart: 1,
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

      // 🔥 Force scroll to bottom when calendar opens
      element.bulmaCalendar.on('show', () => {
        const modalContent = document.querySelector('.modal-content'); // Make sure this is correct
        if (modalContent) {
          setTimeout(() => {
            modalContent.scrollTop = modalContent.scrollHeight;
          }, 50); // Small delay to ensure calendar is visible
        }
      });
    }
  };

  const init = () => {
    loadProjects();
    setupEventListeners();
    initCalendar();
    DisplayController.renderTodos();
  };

  return { init };
})();

AppController.init();
