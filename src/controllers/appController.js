import CalendarController from './calendarController';
import DisplayController from './displayController';
import ModalController from './modalController';
import ProjectsController from './projectsController';
import TodoController from './todoController';

const AppController = (function () {
  const init = () => {
    CalendarController.initCalendar();
    DisplayController.renderTodos();
    ModalController.init();
    ProjectsController.loadProjects();
    TodoController.setupEventListeners();
  };

  return { init };
})();

export default AppController;
