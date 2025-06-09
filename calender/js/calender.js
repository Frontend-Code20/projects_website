import { convertToReadableDate, findFirstDayOfMonth, stripDate, viewEvent  } from "./utils.js";
import eventManager from "./eventManager.js";
import { calenderDom } from "./DOM.js";

const today = new Date();
let currentMonth = new Date().getMonth();
let currentYear = today.getFullYear();

calenderDom.date.textContent = convertToReadableDate(today);

calenderDom.day.textContent = today.toLocaleDateString('en-US', {
    weekday: 'long'
});


calenderDom.month.textContent = today.toLocaleDateString('en-US', {
    month: 'long'
})

calenderDom.year.textContent = currentYear;

calenderDom.preYear.addEventListener('click', () => {
    currentYear--;
    year.textContent = currentYear;
    updateCalender();
});

calenderDom.nextYear.addEventListener('click', () => {
    currentYear++;
    year.textContent = currentYear;
    updateCalender();
});

calenderDom.preMonth.addEventListener('click', () => {

    if (currentMonth === 0) {
        currentMonth = 11;
        currentYear--;
        year.textContent = currentYear;
    } else {
        currentMonth--;
    }
    month.textContent = new Date(currentYear, currentMonth).toLocaleDateString('en-US', {
        month: 'long'
    });
    updateCalender();
});

calenderDom.nextMonth.addEventListener('click', () => {
    if (currentMonth === 11) {
        currentMonth = 0;
        currentYear++;
        year.textContent = currentYear;
    } else {
        currentMonth++;
    }
    month.textContent = new Date(currentYear, currentMonth).toLocaleDateString('en-US', {
        month: 'long'
    });
    updateCalender();
})

calenderDom.dayEventsClose.addEventListener('click', () => {
    calenderDom.dayEventslist.innerHTML = '';
    calenderDom.dayEventsBox.style.display = 'none';
});

calenderDom.dayEventslist.addEventListener('click', (e) => {
    if(e.target.closest('li')) {
        const target = e.target.closest('li');
        const index = target.getAttribute('data-index');
        viewEvent(index);
    }
});

calenderDom.calenderBody.addEventListener('click', (e) => {
    if(e.target.closest('.cell-content')) {
        const target = e.target.closest('.cell-content');
        const ids = JSON.parse(target.getAttribute('data-ids') || '[]');
        if(ids.length === 1) {
            viewEvent(ids[0] - 1);
        }else{
            const events = eventManager.getEvents();
            const dateEvents = events.filter(event => ids.includes(event.id));
            calenderDom.dayEventslist.innerHTML = '';
            dateEvents.forEach(event => { 
                const li = document.createElement('li');
                li.innerHTML = event.title;
                li.setAttribute('data-index', event.id - 1);
                calenderDom.dayEventslist.appendChild(li);
            });
            calenderDom.dayEventsBox.style.display = 'flex';
        }
    }
});

export function updateCalender() {

    clearCalender();

    const tableRows = calenderDom.calenderBody.children;
    let column = findFirstDayOfMonth(currentYear, currentMonth);
    const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate() || 1;
    let row = 0;

    for (let i = 1; i <= totalDaysInMonth; i++) {
        const cell = tableRows[row].children[column];
        const cellContent = cell.querySelector('.cell-content');
        cellContent.innerHTML = i;

        cell.classList.remove('active');
        addEventToCalender(i, cellContent);

        if (column === 6) {
            column = 0;
            row++;
        } else {
            column++;
        }

        if (i === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
            cell.classList.add('active');
        }
    }
};

function clearCalender() {
    const tableRows = calenderDom.calenderBody.children;
    for (let i = 0; i < tableRows.length; i++) {
        const cells = tableRows[i].children;
        for (let j = 0; j < cells.length; j++) {
            const cellContent = cells[j].querySelector('.cell-content');
            cellContent.innerHTML = '';
            cells[j].classList.remove('active');
        }
    }
}


function addEventToCalender(day, cell) {

    const targetDate = new Date(currentYear, currentMonth, day);
    const events = eventManager.getEvents();
    
    const checkDateRange = (startDate, endDate, recurrence) => {
         const eventStartDate = new Date(startDate);
        const eventEndDate = new Date(endDate);
        switch(recurrence){
            case 'none':
                return stripDate(targetDate) >= stripDate(eventStartDate) && stripDate(targetDate) <= stripDate(eventEndDate);
            case 'daily':
                return day >= new Date(startDate).getDate();
            case 'weekly':
                const dayOfWeek = targetDate.getDay();
                const startDayOfWeek = eventStartDate.getDay();
                const endDayOfWeek = eventEndDate.getDay();
                return dayOfWeek >= startDayOfWeek && dayOfWeek <= endDayOfWeek;
            case 'monthly':
                const startMonthDay = eventStartDate.getDate();
                const targetMonthDay = targetDate.getDate();
                const endMonthDay = eventEndDate.getDate();
                return targetMonthDay >= startMonthDay && targetMonthDay <= endMonthDay;
            case 'yearly':
                return (targetDate.getDate() === eventStartDate.getDate()) && (targetDate.getMonth() === eventStartDate.getMonth());
            default:
                return false;
        }
    };
    
    const eventsForDate = events.filter(event => checkDateRange(event.startDate, event.endDate, event.recurrence));
    const ids = eventsForDate.map(event => event.id);
    cell.setAttribute('data-ids', JSON.stringify(ids));
    
    if (eventsForDate.length === 1) {
        const dayEvent = document.createElement('span');
        dayEvent.className = 'day-event';
        dayEvent.textContent = eventsForDate[0].title.length > 6 ? `${eventsForDate[0].title.slice(0, 6)}...` : eventsForDate[0].title;
        cell.appendChild(dayEvent);
    } else if (eventsForDate.length > 1) {
        const eventCount = document.createElement('span');
        eventCount.className = 'event-count';
        eventCount.textContent = eventsForDate.length;
        cell.appendChild(eventCount);
    }

}
