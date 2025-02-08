import bulmaCalendar from 'bulma-calendar';

const CalendarController = (() => {
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

    bulmaCalendar.attach('[type="date"]', defaultOptions);

    // To access to bulmaCalendar instance of an element
    const element = document.querySelector('#duedate');
    if (element) {
      element.bulmaCalendar.on('select', (datepicker) => {
        console.log(datepicker.data.value());
      });

      // Force scroll to bottom when calendar opens
      element.bulmaCalendar.on('show', () => {
        const modalContent = document.querySelector('.modal-content');
        if (modalContent) {
          setTimeout(() => {
            modalContent.scrollTop = modalContent.scrollHeight;
          }, 50); // Small delay to ensure calendar is visible
        }
      });
    }
  };
  return { initCalendar };
})();

export default CalendarController;
