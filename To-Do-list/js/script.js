const form = document.getElementById('task-form');

const hideModal = document.getElementById('hide-modal');
const infoModal = document.getElementById('modal');

const listItemBtn = document.getElementById('list-item-btn');

const modalTaskTitle = document.getElementById('task-info-title');
const modalTaskNotes = document.getElementById('task-info-notes');
const modalTaskDeadline = document.getElementById('task-info-deadline');
const modalTaskStatus = document.getElementById('task-info-status');
const modalTaskPriority = document.getElementById('task-info-priority');
const modalTaskCategory = document.getElementById('task-info-category');

const emptyScreen = document.getElementById('empty-list');
const taskList = document.getElementById('list-box');

const selectMenuBtn = document.getElementById('list-menu-select');
const deleteMenuBtn = document.getElementById('list-menu-delete');
const infoMenuBtn = document.getElementById('list-menu-info');

const tasksViewBtn = document.getElementById('tasks-view-btn');
const formSection = document.getElementById('form-section');
const listSection = document.getElementById('list-section');
const reorderMenuBtn = document.getElementById('list-menu-reorder');

let formScreen = false;
let sortableInstance = null;

let TaskMemory = [];
let selectedItems = []

tasksViewBtn.addEventListener('click', (e) => {
    if (formScreen) {
        formSection.style.display = 'block'
        listSection.style.display = 'none'
        formScreen = false;
        e.target.innerHTML = 'All Tasks'
    } else {
        formSection.style.display = 'none'
        listSection.style.display = 'flex'
        e.target.innerHTML = 'Create Task'
        formScreen = true;
    }
});

window.addEventListener('DOMContentLoaded', () => {
    const storedTasks = window.localStorage.getItem('storedTasks')
    if (storedTasks) {
        TaskMemory = JSON.parse(storedTasks);
    }
    displayTasks();
});

form.addEventListener('submit', (e) => {

    e.preventDefault();
    const formdata = new FormData(form).entries();
    const task = Object.fromEntries(formdata);
    TaskMemory.push(task);
    window.localStorage.setItem('storedTasks', JSON.stringify(TaskMemory));
    displayTasks()

});

hideModal.addEventListener('click', () => {
    infoModal.style.display = 'none'
});

selectMenuBtn.addEventListener('click', (e) => {
    if (TaskMemory.length > 0) {
        changeItemButton('<input type="checkbox" class="item-checkbox" />')
        e.target.innerHTML = 'Select All <input type="checkbox" class="all-items-checkbox" id="select-all-items" />';
        const listBoxItems = taskList.childNodes;
        listBoxItems.forEach(li => {
            const itemCheckbox = li.childNodes[2].childNodes[0];
            itemCheckbox.addEventListener('change', (e) => {
                const index = e.target.parentNode.parentNode.getAttribute('data-index');
                if (e.target.checked) {
                    selectedItems.push(Number.parseInt(index));
                } else {
                    selectedItems = selectedItems.filter((item) => item !== Number.parseInt(index));
                }
                disabledDeleteButton(!(selectedItems.length === 0));
            });
        });
        const allItemsCheckbox = document.getElementById('select-all-items');
        allItemsCheckbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                selectAllItems(true);
                selectedItems = TaskMemory.map((task, index) => index)
            } else {
                selectAllItems(false);
                selectedItems = []
            }
        })
        enableDraging(false)
        destroySorting();
    }
});

deleteMenuBtn.addEventListener('click', (e) => {

    if (selectedItems.length > 0) {
        TaskMemory = TaskMemory.filter((task, idx) => !selectedItems.includes(idx))
        window.localStorage.setItem('storedTasks', JSON.stringify(TaskMemory));
        displayTasks();
        selectedItems = [];
        selectMenuBtn.innerHTML = 'Select'
        disabledDeleteButton(false)
    }
});

infoMenuBtn.addEventListener('click', (e) => {
    changeItemButton('<img class="list-item-btn" src="assets/info.svg" alt="View Info of a Task" />');
    addEventToListItem()
    selectMenuBtn.innerHTML = 'Select'
    enableDraging(false);
    destroySorting();
});

function createListItem(title, category, progress, priority, deadline, index) {

    const createElement = (element, className, innerHtml = '', id) => {
        const tag = document.createElement(element);
        className ? tag.setAttribute('class', className) : null;
        id ? tag.setAttribute('id', id) : null;
        tag.innerHTML = innerHtml;
        return tag;
    }

    const li = createElement('li', "list-item");
    li.setAttribute('data-index', index);

    const indicatorClass = `prioriy-indicator ${priority === 'High' ? 'high' : priority === 'Medium' ? 'medium' : 'low'}`
    const indicator = createElement('div', indicatorClass);
    const itemContent = createElement('div', 'list-item-content');
    const itemInfo = createElement('div', 'list-item-info');
    const titleBox = createElement('div', 'title-box');

    const shortTitle = title.length > 10 ? `${title.slice(0, 10)}...` : title
    const itemTitle = createElement('span', 'list-item-title', shortTitle);
    const taskProgress = createElement('span', 'task-progress', progress);
    const textDot = createElement('span', 'text-dot');

    const taskDeadline = createElement('div', 'task-deadline', deadline);
    const taskCategory = createElement('div', 'task-category', category);

    const listBtnBox = createElement('div', 'list-btn-box');
    const img = createElement('img', 'list-item-btn')
    img.src = 'assets/info.svg';
    img.alt = 'View Info of a Task';

    listBtnBox.appendChild(img)
    titleBox.append(itemTitle, textDot, taskProgress)
    itemInfo.append(titleBox, taskDeadline)
    itemContent.append(itemInfo, taskCategory)
    li.append(indicator, itemContent, listBtnBox)

    return li;
}

function displayTasks() {

    if (TaskMemory.length === 0) {
        taskList.style.display = 'none';
        emptyScreen.style.display = 'flex';
        return;
    }

    taskList.style.display = 'flex'
    emptyScreen.style.display = 'none'
    taskList.innerHTML = ''
    TaskMemory.forEach(({ taskTitle, deadline, priority, status, category }, idx) => {
        const taskli = createListItem(taskTitle, category, status, priority, deadline, idx)
        taskList.appendChild(taskli);
    })
    addEventToListItem()
}

function addEventToListItem() {
    const listItemBtns = document.querySelectorAll('.list-item-btn');
    listItemBtns?.forEach((itemBtn, index) => {
        itemBtn.addEventListener('click', () => {
            displayTaskInfo(index)
        })
    })
}

function displayTaskInfo(index) {

    const task = TaskMemory[index];
    if (task) {
        modalTaskTitle.textContent = task.taskTitle;
        modalTaskNotes.textContent = task.notes;
        modalTaskStatus.textContent = task.status;
        modalTaskPriority.textContent = task.priority;
        modalTaskCategory.textContent = task.category;
        modalTaskDeadline.textContent = task.deadline;
        infoModal.style.display = 'flex'
    }

}

function changeItemButton(button) {
    if (TaskMemory.length > 0) {
        const listBoxItems = taskList.childNodes;
        listBoxItems.forEach(li => {
            const itemBtnBox = li.childNodes[2];
            itemBtnBox.innerHTML = '';
            itemBtnBox.innerHTML = button
        });
    }
}

function selectAllItems(checked) {

    const listBoxItems = taskList.childNodes;
    listBoxItems.forEach(li => {
        const itemBtnBox = li.childNodes[2].childNodes[0];
        disabledDeleteButton(checked)
        itemBtnBox.checked = checked;
    });
}

function disabledDeleteButton(status) {
    if (status) {
        deleteMenuBtn.classList.remove("disabled")
        deleteMenuBtn.classList.add("active")
    } else {
        deleteMenuBtn.classList.add("disabled")
        deleteMenuBtn.classList.remove("active")
    }
}

function enableDraging(status) {
    const listBoxItems = taskList.childNodes
    listBoxItems.forEach(li => {
        li.draggable = status
    });
}


reorderMenuBtn.addEventListener('click', () => {


    changeItemButton('<img class="drap-item" src="assets/drag.svg" alt="Drag" />')
    selectMenuBtn.innerHTML = 'Select'
    disabledDeleteButton(false);
    enableDraging(true);

    if (!sortableInstance) {
        sortableInstance = new Sortable(taskList, {
            animation: 300,
            onEnd: function () {
                const newOrder = [];
                const listItems = taskList.children;
                Array.from(listItems).forEach(li => {
                    const index = Number.parseInt(li.getAttribute('data-index'));
                    newOrder.push(TaskMemory[index]);
                })

                TaskMemory = newOrder
                window.localStorage.setItem('storedTasks', JSON.stringify(TaskMemory));
            }
        })
    }
});

function destroySorting() {
    if (sortableInstance) {
        sortableInstance.destroy();
        sortableInstance = null;
    }
}