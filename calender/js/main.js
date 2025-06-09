import eventManager from "./eventManager.js";
import { createEventItem } from "./DOM.js";
import { convertToReadableDate, viewEvent } from "./utils.js";
import { updateCalender } from "./calender.js";
import { eventDom, formDom, viewDom } from "./DOM.js";

const times = [
  "06:00 AM", "06:30 AM",
  "07:00 AM", "07:30 AM",
  "08:00 AM", "08:30 AM",
  "09:00 AM", "09:30 AM",
  "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM",
  "01:00 PM", "01:30 PM",
  "02:00 PM", "02:30 PM",
  "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM",
  "05:00 PM", "05:30 PM",
  "06:00 PM", "06:30 PM",
  "07:00 PM", "07:30 PM",
  "08:00 PM", "08:30 PM",
  "09:00 PM", "09:30 PM",
  "10:00 PM"
];


window.addEventListener('DOMContentLoaded', () => {

    displayEvents();
    updateCalender();

    formDom.dateControls.forEach((item) => {
        item.addEventListener('click', (e) => {
            const dateElement = e.target.nextElementSibling;
            if (dateElement.showPicker) {
                dateElement.showPicker();
            } else {
                dateElement.click();
            }
            dateElement.addEventListener('change', (e) => {
                const selectedDate = new Date(e.target.value);
                item.textContent = convertToReadableDate(selectedDate);
            });
        });

        item.textContent = "Select Date";
    })

    formDom.eventTime.forEach((item, idx) => {
        const datalist = document.createElement('datalist');
        datalist.id = `time-options${idx + 1}`;
        times.forEach(time => {
            const option = document.createElement('option');
            option.value = time;
            // option.textContent = time;
            datalist.appendChild(option);
        });
        item.setAttribute('list', `time-options${idx + 1}`);
        item.parentElement.appendChild(datalist);
    });
});

eventDom.eventBtn.addEventListener('click', () => {
    eventDom.eventModal.style.display = 'flex'
});

eventDom.eventClose.addEventListener('click', () => {
    formDom.eventForm.reset();
    formDom.successMessage.style.display = 'none';
    eventDom.eventModal.style.display = 'none';
});

eventDom.newEventBtn.addEventListener('click', () => {
    eventDom.eventModal.style.display = 'flex'
})

viewDom.viewEventClose.addEventListener('click', () => {
    viewDom.viewEventModal.style.display = 'none';
});

eventDom.allDayCheckbox.addEventListener('change', (e) => {

    if (e.target.checked) {
        formDom.eventTime.forEach(item => {
            item.disabled = true;
        });
    } else {
        formDom.eventTime.forEach(item => {
            item.disabled = false;
        });
    }

});

viewDom.eventDelete.addEventListener('click', (e) => {
    const eventIndex = e.target.getAttribute('data-index');
    if (eventIndex) {
        eventManager.deleteEvent(eventIndex);
        displayEvents();
        updateCalender();
        viewDom.viewEventModal.style.display = 'none';
    }
});

eventDom.eventList.addEventListener('click', (e) => {
    if (e.target.closest('.event-item')) {
        const index = e.target.closest('.event-item').getAttribute('data-index');
        viewEvent(index);
    }
});

formDom.eventForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(formDom.eventForm);
    const event = Object.fromEntries(formData.entries());
    const events = eventManager.getEvents();
    if (event) {
        event.id = events.length + 1;
        eventManager.addEvent(event);
        formDom.successMessage.style.display = 'flex';
        displayEvents();
    }
});

function displayEvents() {

    eventDom.eventList.innerHTML = '';
    const events = eventManager.getEvents();
    if (events.length === 0) {
        eventDom.emptyEvent.style.display = 'flex';
        eventDom.eventList.style.display = 'none'
    } else {
        eventDom.emptyEvent.style.display = 'none';
        eventDom.eventList.style.display = 'flex'
        events.forEach((item, idx) => {
            const li = createEventItem(item, idx);
            eventDom.eventList.appendChild(li);
        });
    }
}