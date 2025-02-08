import TodoModule from '../models/todoModel';

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
        const allProjectsButton = document.getElementById('all');
        allProjectsButton.classList.add('is-selected', 'is-primary');
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

export default DisplayController;
