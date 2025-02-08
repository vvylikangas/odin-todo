import ProjectsController from './projectsController.js';
import DisplayController from './displayController.js';

const TodoController = (() => {
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
        ProjectsController.insertNewProjectButton(newProject);

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

  return { setupEventListeners };
})();

export default TodoController;
