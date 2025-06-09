import { viewDom } from './DOM.js';
import eventManager  from './eventManager.js';

/**
 * 
 * @param {} date receives a date as string 
 * @returns returns a date object with the time stripped off
 */
export function stripDate (date){
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

/**
 * 
 * @param {Date} dateObject Date object to be converted
 * @returns {string} Returns a formatted date string in 'Month Day, Year' format
 */  
export function convertToReadableDate(dateObject) {
    return dateObject.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
}

/**
 * 
 * @param {Date} Year
 * @param {Date} Month 
 * @returns 
 */
export function findFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
}

export function viewEvent(idx) {
    
    viewDom.viewEventModal.style.display = 'flex';
    const events = eventManager.getEvents();
    const event = events[idx];
    
    viewDom.viewEventTitle.textContent = event.title;
    viewDom.viewEventStartTime.textContent = event.startTime;
    viewDom.viewEventEndTime.textContent = event.endTime;
    viewDom.viewEventDescription.textContent = event.description;
    viewDom.recurrence.textContent = event.recurrence;
    viewDom.viewEventStartDate.textContent = convertToReadableDate(new Date(event.startDate));
    viewDom.viewEventEndDate.textContent = convertToReadableDate(new Date(event.endDate));
    viewDom.viewEventLocation.textContent = event.location;
    viewDom.eventDelete.setAttribute('data-index', idx);

    if (event.allDay) {
        viewDom.viewEventStartTime.textContent = 'All Day';
        viewDom.viewEventEndTime.textContent = 'All Day';
    } else {
        viewDom.viewEventStartTime.textContent = event.startTime;
        viewDom.viewEventEndTime.textContent = event.endTime;
    }
}