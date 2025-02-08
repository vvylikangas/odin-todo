import TodoModule from '../models/todoModel'; // Ensure this is the correct path
import DisplayController from './displayController'; // Ensure this is the correct path

const ModalController = (function () {
  const modal = document.querySelector('.modal');
  const modalBackground = document.querySelector('.modal-background');
  const modalClose = document.querySelector('.modal-close');
  const modalTrigger = document.querySelector('.js-modal-trigger');
  const addTodoBtn = document.getElementById('add-todo-btn');
  const taskTitleInput = document.getElementById('title');
  const dueDateInput = document.getElementById('duedate');
  const calendar = dueDateInput?.bulmaCalendar;

  const toggleAddTodoButton = () => {
    if (taskTitleInput.value.trim() === '' || dueDateInput.value === '') {
      addTodoBtn.disabled = true;
    } else {
      addTodoBtn.disabled = false;
    }
  };

  const openModal = () => {
    modal.classList.add('is-active');
  };

  const closeModal = () => {
    modal.classList.remove('is-active');
  };

  const handleAddTodo = (e) => {
    e.preventDefault();

    const title = taskTitleInput.value.trim();
    const desc = document.getElementById('desc').value.trim();
    const dueDate = dueDateInput.value;
    const priority = document.querySelector(
      'input[name="priority"]:checked'
    )?.value;
    const project = document.getElementById('project')?.value;

    if (title && dueDate) {
      TodoModule.addTodo(title, desc, dueDate, priority, project);
      DisplayController.renderTodos();
      closeModal(); // Close modal after adding task

      // Reset the form
      const form = document.querySelector('#todo-form');
      form.reset();

      // Set defaults
      document.querySelector(
        'input[name="priority"][value="Low"]'
      ).checked = true;
      document.getElementById('project').value = 'General';

      if (dueDateInput && dueDateInput.bulmaCalendar) {
        // Reset the calendar to today’s date
        const today = new Date();
        dueDateInput.bulmaCalendar.value(today);
        dueDateInput.bulmaCalendar.refresh();
      }
      toggleAddTodoButton();
    }
  };

  const setupEventListeners = () => {
    // Toggle Add Todo button
    taskTitleInput.addEventListener('input', toggleAddTodoButton);
    dueDateInput.addEventListener('input', toggleAddTodoButton);

    // Ensure Bulma Calendar updates the input field and triggers an event
    if (calendar) {
      calendar.on('select', () => {
        dueDateInput.value = calendar.value();
        dueDateInput.dispatchEvent(new Event('input'));
      });

      calendar.on('clear', () => {
        dueDateInput.value = '';
        dueDateInput.dispatchEvent(new Event('input'));
      });
    }

    // Open modal on trigger click
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
      addTodoBtn.addEventListener('click', handleAddTodo);
    }
  };

  const init = () => {
    setupEventListeners();
    toggleAddTodoButton();
  };

  return { init };
})();

export default ModalController;
