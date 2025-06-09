import { convertToReadableDate } from "./utils.js";

export const viewDom = {
    viewEventTitle: document.getElementById('view-event-title'),
    viewEventStartTime: document.getElementById('view-event-start-time'),
    viewEventEndTime: document.getElementById('view-event-end-time'),
    viewEventStartDate: document.getElementById('view-event-start-date'),
    viewEventEndDate: document.getElementById('view-event-end-date'),
    viewEventDescription: document.getElementById('view-event-description'),
    recurrence: document.getElementById('view-event-recurrence'),
    viewEventLocation: document.getElementById('view-event-location'),
    eventDelete: document.getElementById('event-delete'),
    viewEventModal: document.getElementById('view-event-modal'),
    viewEventClose: document.getElementById('view-event-close')
};

export const eventDom = {
    eventList: document.getElementById('event-list'),
    emptyEvent: document.getElementById('empty-event'),
    eventModal: document.getElementById('event-modal'),
    eventBtn: document.getElementById('event-btn'),
    eventClose: document.getElementById('event-close'),
    newEventBtn: document.getElementById('new-event-btn'),
    allDayCheckbox: document.getElementById('all-day')
};

export const formDom = {
    eventForm: document.getElementById('event-form'),
    successMessage: document.getElementById('success-message'),
    eventTime: document.querySelectorAll('.event-time'),
    dateControls: document.querySelectorAll('.date-control')
};

export const calenderDom = {
    calenderBody: document.getElementById('calender-body'),
    preMonth: document.getElementById('pre-month'),
    nextMonth: document.getElementById('next-month'),
    month: document.getElementById('month'),
    preYear: document.getElementById('pre-year'),
    nextYear: document.getElementById('next-year'),
    year: document.getElementById('year'),
    date: document.getElementById('date'),
    day: document.getElementById('day'),
    dayEventsBox: document.getElementById('day-events-box'),
    dayEventslist: document.getElementById('day-events-list'),
    dayEventsClose: document.getElementById('day-events-close')
};

export function createEventItem(eventItem, index) {

    const createElement = (element, className, innerHTML, id) => {
        const tag = document.createElement(element);
        className ? tag.setAttribute('class', className) : null;
        id ? tag.setAttribute('class', id) : null;
        innerHTML ? tag.innerHTML = innerHTML : null;
        return tag;
    };

    const li = createElement('li', 'event-item');
    li.setAttribute('data-index', index);

    const itemHeader = createElement('div', 'item-header');

    const title = eventItem?.title.length > 10 ? `${eventItem?.title.slice(0, 10)}...` : eventItem?.title;
    const titleTag = createElement('h2', 'event-title', title);
    const time = eventItem?.allDay ? 'All Day' : `${eventItem?.startTime} To ${eventItem?.endTime}`;
    const timeTag = createElement('span', 'small-text', time);
    const dateTag = createElement('span', 'small-text', `${convertToReadableDate(new Date(eventItem?.startDate))} To ${convertToReadableDate(new Date(eventItem?.endDate))}`);

    const description = eventItem?.description.length > 40 ? `${eventItem?.description.slice(0, 40)}...` : eventItem?.description;
    const descriptionTag = createElement('p', 'event-description', description);

    itemHeader.append(titleTag, timeTag)
    li.append(itemHeader, dateTag, descriptionTag);
    return li;
}