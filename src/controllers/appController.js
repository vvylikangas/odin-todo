import CalendarController from './calendarController';
import DisplayController from './displayController';
import ModalController from './modalController';
import ProjectsController from './projectsController';
import TodoController from './todoController';

const AppController = (function () {
  // const loadProjects = () => {
  //   const projectSelect = document.getElementById('project');
  //   projectSelect.innerHTML = '';

  //   const projects = JSON.parse(localStorage.getItem('odinTodoProjects')) || [
  //     'General',
  //   ];

  //   projects.forEach((project) => {
  //     const option = document.createElement('option');
  //     option.value = project;
  //     option.textContent = project;
  //     projectSelect.appendChild(option);

  //     insertNewProjectButton(project);
  //   });
  // };

  // const setupEventListeners = () => {
  //   // handle adding new project type
  //   const addProjectButton = document.getElementById('new-project-btn');
  //   const newProjectInput = document.getElementById('newproject');

  //   const toggleAddProjectButton = () => {
  //     if (newProjectInput.value.trim() === '') {
  //       addProjectButton.disabled = true;
  //     } else {
  //       addProjectButton.disabled = false;
  //     }
  //   };

  //   toggleAddProjectButton();

  //   newProjectInput.addEventListener('input', toggleAddProjectButton);

  //   addProjectButton.addEventListener('click', (e) => {
  //     e.preventDefault();

  //     const projectSelect = document.getElementById('project');
  //     const newProject = newProjectInput.value.trim();
  //     const projects = JSON.parse(localStorage.getItem('odinTodoProjects')) || [
  //       'General',
  //     ];

  //     if (newProject && !projects.includes(newProject)) {
  //       // save project name
  //       projects.push(newProject);
  //       localStorage.setItem('odinTodoProjects', JSON.stringify(projects));

  //       // add new project button
  //       insertNewProjectButton(newProject);

  //       // add new project as a dropdown option
  //       const option = document.createElement('option');
  //       option.value = newProject;
  //       option.textContent = newProject;
  //       projectSelect.appendChild(option);

  //       // select new project
  //       projectSelect.value = newProject;

  //       // empty input field
  //       newProjectInput.value = '';
  //       toggleAddProjectButton();
  //     }
  //   });

  //   document.addEventListener('DOMContentLoaded', () => {
  //     const modal = document.querySelector('.modal');
  //     const modalBackground = document.querySelector('.modal-background');
  //     const modalClose = document.querySelector('.modal-close');
  //     const modalTrigger = document.querySelector('.js-modal-trigger');
  //     const addTodoBtn = document.getElementById('add-todo-btn');
  //     const taskTitleInput = document.getElementById('title');
  //     const dueDateInput = document.getElementById('duedate');
  //     const calendar = dueDateInput.bulmaCalendar;

  //     const toggleAddTodoButton = () => {
  //       if (taskTitleInput.value.trim() === '' || dueDateInput.value === '') {
  //         addTodoBtn.disabled = true;
  //       } else {
  //         addTodoBtn.disabled = false;
  //       }
  //     };

  //     toggleAddTodoButton();

  //     taskTitleInput.addEventListener('input', toggleAddTodoButton);
  //     dueDateInput.addEventListener('input', toggleAddTodoButton);

  //     // Ensure Bulma Calendar updates the input field and triggers an event
  //     if (calendar) {
  //       calendar.on('select', () => {
  //         dueDateInput.value = calendar.value(); // Ensure input is updated
  //         dueDateInput.dispatchEvent(new Event('input')); // Manually trigger input event
  //       });

  //       calendar.on('clear', () => {
  //         dueDateInput.value = ''; // Clear input field
  //         dueDateInput.dispatchEvent(new Event('input')); // Manually trigger input event
  //       });
  //     }

  //     function openModal() {
  //       modal.classList.add('is-active');
  //     }

  //     function closeModal() {
  //       modal.classList.remove('is-active');
  //     }

  //     // Open modal
  //     if (modalTrigger) {
  //       modalTrigger.addEventListener('click', openModal);
  //     }

  //     // Close modal when clicking close button or background
  //     [modalClose, modalBackground].forEach((el) => {
  //       if (el) el.addEventListener('click', closeModal);
  //     });

  //     // Close modal on Escape key
  //     document.addEventListener('keydown', (event) => {
  //       if (event.key === 'Escape') {
  //         closeModal();
  //       }
  //     });

  //     // Handle adding new todo & close modal
  //     if (addTodoBtn) {
  //       addTodoBtn.addEventListener('click', (e) => {
  //         e.preventDefault();

  //         const title = document.getElementById('title').value.trim();
  //         const desc = document.getElementById('desc').value.trim();
  //         const dueDateInput = document.getElementById('duedate').value;
  //         const priority = document.querySelector(
  //           'input[name="priority"]:checked'
  //         )?.value;
  //         const project = document.getElementById('project')?.value;

  //         if (title && dueDateInput) {
  //           TodoModule.addTodo(title, desc, dueDateInput, priority, project);
  //           DisplayController.renderTodos();
  //           closeModal(); // Close modal after adding task

  //           // Reset the form
  //           const form = document.querySelector('#todo-form'); // Assuming your form has an id of 'todo-form'
  //           form.reset(); // Resets all fields

  //           // Set defaults
  //           document.querySelector(
  //             'input[name="priority"][value="Low"]'
  //           ).checked = true;
  //           document.getElementById('project').value = 'General';

  //           const element = document.querySelector('#duedate');
  //           if (element && element.bulmaCalendar) {
  //             // Set today's date in the calendar
  //             const today = new Date();
  //             element.bulmaCalendar.value(today); // Set the date using the value method
  //             element.bulmaCalendar.refresh();
  //           }
  //         }
  //       });
  //     }
  //   });

  //   // show all projects
  //   const allProjectsButton = document.getElementById('all');

  //   allProjectsButton.addEventListener('click', () => {
  //     // Remove 'is-selected' and 'is-primary' from all project buttons
  //     document.querySelectorAll('.project-btn').forEach((button) => {
  //       button.classList.remove('is-selected', 'is-primary');
  //     });

  //     // Add the classes to the clicked button
  //     allProjectsButton.classList.add('is-selected', 'is-primary');
  //     DisplayController.renderTodos();
  //   });
  // };

  // const insertNewProjectButton = (projectName) => {
  //   const projectContainer = document.querySelector('.todo-projects');

  //   if (
  //     Array.from(projectContainer.children).some(
  //       (btn) => btn.textContent === projectName
  //     )
  //   ) {
  //     return;
  //   }

  //   const projectButton = document.createElement('button');
  //   projectButton.textContent = projectName;
  //   projectButton.classList.add('button', 'project-btn', 'is-flex-grow-1');
  //   projectButton.dataset.project = projectName;

  //   projectButton.addEventListener('click', () => {
  //     // Remove 'is-selected' and 'is-primary' from all project buttons
  //     document.querySelectorAll('.project-btn').forEach((button) => {
  //       button.classList.remove('is-selected', 'is-primary');
  //     });

  //     // Add the classes to the clicked button
  //     projectButton.classList.add('is-selected', 'is-primary');
  //     DisplayController.renderByProject(projectName);
  //   });

  //   projectContainer.appendChild(projectButton);
  // };

  // const initCalendar = () => {
  //   const defaultOptions = {
  //     color: 'primary',
  //     isRange: false,
  //     allowSameDayRange: true,
  //     lang: 'en-US',
  //     startDate: new Date(),
  //     endDate: undefined,
  //     minDate: null,
  //     maxDate: null,
  //     disabledDates: [],
  //     disabledWeekDays: undefined,
  //     highlightedDates: [],
  //     weekStart: 1,
  //     dateFormat: 'dd.MM.yyyy',
  //     enableMonthSwitch: true,
  //     enableYearSwitch: true,
  //     displayYearsCount: 50,
  //   };

  //   // Initialize all input of date type.
  //   const calendars = bulmaCalendar.attach('[type="date"]', defaultOptions);

  //   // To access to bulmaCalendar instance of an element
  //   const element = document.querySelector('#duedate');
  //   if (element) {
  //     // bulmaCalendar instance is available as element.bulmaCalendar
  //     element.bulmaCalendar.on('select', (datepicker) => {
  //       console.log(datepicker.data.value());
  //     });

  //     // 🔥 Force scroll to bottom when calendar opens
  //     element.bulmaCalendar.on('show', () => {
  //       const modalContent = document.querySelector('.modal-content'); // Make sure this is correct
  //       if (modalContent) {
  //         setTimeout(() => {
  //           modalContent.scrollTop = modalContent.scrollHeight;
  //         }, 50); // Small delay to ensure calendar is visible
  //       }
  //     });
  //   }
  // };

  const init = () => {
    CalendarController.initCalendar(); // Set up the calendar
    DisplayController.renderTodos(); // Set up the display rendering
    ModalController.init(); // Set up the modal functionality
    ProjectsController.loadProjects(); // Set up the projects management
    TodoController.setupEventListeners(); // Set up the todo management
  };

  return { init };
})();

export default AppController;
