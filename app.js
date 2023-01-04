
// Asynchronous function that receives data for the dashboard
async function getDashboardData(url = '/data.json') {

  // Sending a request and waiting for a response
  const response = await fetch(url);

  // We receive data via the .json() method from the response object
  const data = await response.json();

  return data;
}

// Creating a class for drawing cards. When an instance of a class is created, a card is created.
class DashboardItem {

  //
  static PERIODS = {
    daily: 'Day',
    weekly: 'Week',
    monthly: 'Month'
  }

  // The constructor takes data (an object of one of the cards), a container selector, and a display type
  constructor(data, container = '.dashboard__content', view = 'weekly') {
    this.data = data;
    this.container = document.querySelector(container);
    this.view = view;

    // The method is launched when an instance is created, it immediately places the card in a container in html
    this._createMarkup();
  }

  // Method for creating markup:
  _createMarkup() {
    const {title, timeframes} = this.data;

    const id = title.toLowerCase().replace(/ /g, '-');
    const {current, previous} = timeframes[this.view.toLowerCase()];

    this.container.insertAdjacentHTML('beforeend', `
      <div class="dashboard__item dashboard__item--${id}">
        <article class="tracking-card">
          <header class="tracking-card__header">
            <h4 class="tracking-card__title">${title}</h4>
            <img class= "tracking-card__menu" src="images/icon-ellipsis.svg" alt="menu">
          </header>
          <div class="tracking-card__body">
            <div class="tracking-card__time">
              ${current}hrs
            </div>
            <div class="tracking-card__prev-period">
              Last ${DashboardItem.PERIODS[this.view]} - ${previous}hrs
            </div>
          </div>
        </article>
      </div>
    `);

    this.time = this.container.querySelector(`.dashboard__item--${id} .tracking-card__time`);
    this.prev = this.container.querySelector(`.dashboard__item--${id} .tracking-card__prev-period`);
  }

  // Method for changing the display when a radio button is selected (Daily, Weekly, Monthly)
  changeView(view) {
    this.view = view.toLowerCase();
    const {current, previous} = this.data.timeframes[this.view];

    this.time.innerText = `${current}hrs`;
    this.prev.innerText = `Last ${DashboardItem.PERIODS[this.view]} - ${previous}hrs`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  getDashboardData()
    .then(data => {
      
      // After receiving the data, create an array with card instances, a piece of data for the card gets into the instance, the markup is placed in html
      const activities = data.map(activity => new DashboardItem(activity));

      // Collect an array with divs-display switches
      const selectors = document.querySelectorAll('.view-selector__item');

      // Go through the array with switches and hang events on each
      selectors.forEach(selector => selector.addEventListener('click', (e) => {
        // When the event fires, we remove the activity class for everyone, and hang the activity class on the div where the event fired
        selectors.forEach(sel => sel.classList.remove('view-selector__item--active'));
        selector.classList.add('view-selector__item--active');

        // Take the text from the radio button and use it to change the display of all cards
        const currentView = selector.innerText.trim();
        activities.forEach(activity => activity.changeView(currentView));
      }));   
    });
});