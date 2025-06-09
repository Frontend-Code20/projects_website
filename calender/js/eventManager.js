class EventManager {
    constructor() {
        this.events = JSON.parse(localStorage.getItem('EVENTS')) || [];
    }

    addEvent(item) {
        this.events.push(item);
        localStorage.setItem('EVENTS', JSON.stringify(this.events));
    }

    deleteEvent(index) {
        if (index >= 0 && index < this.events.length) {
            this.events.splice(index, 1);
            localStorage.setItem('EVENTS', JSON.stringify(this.events));
        }
    }

    getEvents() {
        return this.events;
    }
}

const eventManager = new EventManager();
export default eventManager;