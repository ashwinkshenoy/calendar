/**
 * Get a date post current date, based on params
 * @param {String} days No of days
 */
Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

/**
 * Get a date prior to current date, based on params
 * @param {String} days No of days
 */
Date.prototype.removeDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() - days);
  return date;
};

/**
 * Get Array of Dates (from and to)
 * @param {Date} startDate Start Date
 * @param {Date} stopDate EndDate
 */
function getDates(startDate, stopDate) {
  var dateArray = new Array();
  var currentDate = startDate;
  while (currentDate <= stopDate) {
    dateArray.push(new Date(currentDate));
    currentDate = currentDate.addDays(1);
  }
  return dateArray;
}

/**
 * Render total days
 * @param {Date} today start Date: Default => current date
 * @param {Date} endDate No of days: Default => current date + 6
 */
function renderTotalDays(today = new Date(), endDate) {
  const dates = getDates(today, endDate || today.addDays(6));
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const calDate = document.querySelector('.cal-dates');
  let renderValue = '';

  dates.map((item) => {
    renderValue += `
      <div class="cal-date__col ${isDateMonth(item)}">
        <div class="cal-date__head">
          <div class="cal-date__day">${days[item.getDay()]}</div>
          <div class="cal-date__date">${item.getDate()}</div>
        </div>
        <div class="cal-date__event">
          ${renderEventBlock()}
        </div>
      </div>
    `;
  });
  calDate.innerHTML = renderValue;
  renderMonthYear(dates);
}

/**
 * Render total days
 * @param {Array} dates Array of start dates to end dates
 */
function renderMonthYear(dates) {
  const monthsSmall = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  const monthsBig = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  let startMonth = monthsBig[dates[0].getMonth()];
  let endMonth = monthsBig[dates[dates.length - 1].getMonth()];
  let monthToDisplay = `${startMonth} ${dates[0].getFullYear()}`;
  const calDate = document.querySelector('.cal-month-year');

  if (startMonth !== endMonth) {
    startMonth = monthsSmall[dates[0].getMonth()];
    endMonth = monthsSmall[dates[dates.length - 1].getMonth()];
    monthToDisplay = `${startMonth} ${dates[0].getFullYear()}  -  ${endMonth} ${dates[dates.length - 1].getFullYear()}`;
  }
  calDate.innerHTML = monthToDisplay;
}

function isDateMonth(item) {
  const today = new Date();
  if (item.getDate() === today.getDate() && item.getMonth() === today.getMonth()) {
    return 'cal-today';
  }
  return '';
}

/**
 * Render Blocks for a particular day
 */
function renderEventBlock() {
  let eventBlock = '';
  for (let i = 0; i <= 23; i++) {
    eventBlock += `
      <div class="cal-date__block" data-time="${i}"></div>
    `;
  }
  return eventBlock;
}

/**
 * Render no. of hours
 */
(function renderHours() {
  const calTimeZone = document.querySelector('.cal-hours-timezone');
  const calHours = document.querySelector('.cal-hours');

  calTimeZone.innerHTML = new Date().toString().match(/([A-Z]+[\+-][0-9]+)/)[1];
  for (let i = 0; i < 24; i++) {
    calHours.innerHTML += `
      <div class="cal-hour">
        ${i === 0 ? '12 AM' : i < 12 ? i + ' AM' : i == 12 ? '12 PM' : i === 24 ? '12 AM' : i - 12 + ' PM'}
      </div>
    `;
  }
})();

const calToday = document.getElementById('calToday');
const calPrev = document.getElementById('calPrev');
const calNext = document.getElementById('calNext');
let todayDate = new Date();
let paginationStartDate = new Date();

calToday.addEventListener('click', initCalendar);
calNext.addEventListener('click', renderNext);
calPrev.addEventListener('click', renderPrev);

// Render Next Week from pagination date
function renderNext() {
  paginationStartDate = paginationStartDate.addDays(7);
  renderTotalDays(paginationStartDate);
}

// Render Previous Week from pagination date
function renderPrev() {
  paginationStartDate = paginationStartDate.removeDays(7);
  renderTotalDays(paginationStartDate);
}

function initCalendar() {
  if (todayDate.getDay() !== 0) {
    todayDate = todayDate.removeDays(7 - (7 - todayDate.getDay()));
    paginationStartDate = todayDate;
  }
  renderTotalDays(todayDate);
}

initCalendar();
