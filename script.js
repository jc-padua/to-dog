import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";


const appSettings = {
    databaseURL: 'https://todo-firebase-c98d8-default-rtdb.asia-southeast1.firebasedatabase.app/',
}

const app = initializeApp(appSettings);
const database = getDatabase(app);
const taskInDB = ref(database, "tasks")

const addBtn = document.getElementById('add-button');
const taskField = document.getElementById('input-field');
const taskList = document.getElementById('task-list');

// Functions
function clearInputField() {
    taskField.value = '';
}

function clearTaskList() {
    taskList.innerHTML = '';
}

function addTaskToList(task) {
    if (!task) return;

    let itemID = task[0];
    let itemValue = task[1];

    let newEl = document.createElement('li');
    newEl.textContent = itemValue;

    newEl.addEventListener('dblclick', () => {
        let locationOfTaskInDB = ref(database, `tasks/${itemID}`)
        remove(locationOfTaskInDB);
    })
    taskList.appendChild(newEl);
}

onValue(taskInDB, function (snapshot) {
    if (snapshot.exists()) {
        let taskArray = Object.entries(snapshot.val());
        clearTaskList();
        taskArray.forEach((item, i) => {
            let currentItem = taskArray[i];
            let currentID = currentItem[0];
            let currentValue = currentItem[1];
            addTaskToList(currentItem)
        })
    } else {
        taskList.innerHTML = "No task yet..."
    }
})

// Event Listeners

addBtn.addEventListener('click', () => {
    let inputValue = taskField.value;
    push(taskInDB, inputValue);
    clearInputField();

})
