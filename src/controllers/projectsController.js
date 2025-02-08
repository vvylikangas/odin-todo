import DisplayController from './displayController';

const ProjectsController = (() => {
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

  return { loadProjects, insertNewProjectButton };
})();

export default ProjectsController;
