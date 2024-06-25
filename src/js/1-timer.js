import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

// Отримання елементів з DOM
const datetimePicker = document.getElementById('datetime-picker');
const startButton = document.querySelector('button[data-start]');
const daysSpan = document.querySelector('span[data-days]');
const hoursSpan = document.querySelector('span[data-hours]');
const minutesSpan = document.querySelector('span[data-minutes]');
const secondsSpan = document.querySelector('span[data-seconds]');

let timerInterval;
let userSelectedDate;

// Опції для flatpickr
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    if (selectedDate <= new Date()) {
      iziToast.error({ title: 'Error', message: 'Please choose a date in the future' });
      startButton.disabled = true;
    } else {
      userSelectedDate = selectedDate;
      startButton.disabled = false;
    }
  },
};

// Ініціалізація flatpickr
flatpickr(datetimePicker, options);

// Обробка натискання кнопки "Start"
startButton.addEventListener('click', () => {
  if (userSelectedDate) {
    startButton.disabled = true;
    datetimePicker.disabled = true;
    startTimer(userSelectedDate);
  }
});

// Функція для запуску таймера
function startTimer(endDate) {
  timerInterval = setInterval(() => {
    const now = new Date();
    const timeDifference = endDate - now;

    if (timeDifference <= 0) {
      clearInterval(timerInterval);
      datetimePicker.disabled = false;
      updateTimer(0, 0, 0, 0);
      return;
    }

    const { days, hours, minutes, seconds } = convertMs(timeDifference);
    updateTimer(days, hours, minutes, seconds);
  }, 1000);
}

// Функція для конвертації мілісекунд у дні, години, хвилини, секунди
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

// Функція для оновлення таймера на екрані
function updateTimer(days, hours, minutes, seconds) {
  daysSpan.textContent = addLeadingZero(days);
  hoursSpan.textContent = addLeadingZero(hours);
  minutesSpan.textContent = addLeadingZero(minutes);
  secondsSpan.textContent = addLeadingZero(seconds);
}

// Функція для додавання нуля перед числом, якщо воно менше 10
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}