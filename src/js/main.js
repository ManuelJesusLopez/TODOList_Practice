// ! DOM
const form = document.getElementById("form");
const info = document.getElementById("info");
const tasks = document.getElementById("tasks");

// ! Globals

let taskList = [];
const currentDate = new Date();
const taskIsValid = {
  task: false,
  priority: false,
  date: false,
};

// * Element for Info
const taskInfo = document.createElement("P");

// ! Functions

const getRemainTime = (deadline) => {
  const now = new Date();
  const remainTime = (new Date(deadline) - now + 1000) / 1000;
  const remainSeconds = ("0" + Math.floor(remainTime % 60)).slice(-2);
  const remainMinutes = ("0" + Math.floor((remainTime / 60) % 60)).slice(-2);
  const remainHours = ("0" + Math.floor((remainTime / 3600) % 24)).slice(-2);
  const remainDays = Math.floor(remainTime / (3600 * 24));

  return {
    remainTime,
    remainSeconds,
    remainMinutes,
    remainHours,
    remainDays,
  };
};

const countdown = (deadline, elem, finalMessage) => {
  const el = document.getElementById(elem);
  const timerUpdate = setInterval(() => {
    const t = getRemainTime(deadline);
    el.textContent = `${t.remainDays}d:${t.remainHours}h:${t.remainMinutes}m:${t.remainSeconds}s`;

    if (t.remainTime <= 1) {
      clearInterval(timerUpdate);
      el.textContent = finalMessage;
    }
  }, 1000);
};

const createTask = (task, priority, date) => {
  const item = {
    name: task,
    priority: priority,
    date: date,
    idCount: Math.round(Math.random() * 100),
  };
  taskList.unshift(item);
  return item;
};

const addTask = () => {
  localStorage.setItem("task", JSON.stringify(taskList));
  printTask();
};

const printTask = () => {
  tasks.innerHTML = "";

  taskList = JSON.parse(localStorage.getItem("task"));
  if (taskList === null) {
    taskList = [];
  } else {
    taskList.forEach((element) => {
      const elementClass = element.priority;
      const elementName = element.name;
      const elementDate = element.date;
      const elementCount = element.idCount;

      tasks.innerHTML += `
      <div class="task priority__${elementClass}">
        <p class="task__name">${elementName}</p>
          <div class="date-view">
            <div class="date-view__top">
              <p class="date-view__item">La fecha de finalización es:</p>
            </div>
            <div class="date-view__bottom">
              <p class="date-view__item" id="${elementCount}"></p>
            </div>
          </div>
        <button class="delete-task">
          <span class="material-icons">
            delete
          </span>
        </button>
      </div>
      `;
      countdown(elementDate, elementCount, "La tarea esta fuera de tiempo");
      // ! Sigo con el error
      console.log(elementCount);
    });
  }
};

const deleteTask = (id) => {
  const indexTask = taskList.findIndex((element) => {
    return element.name === id;
  });

  taskList.splice(indexTask, 1);
  addTask();
};

// * Validate and Show Error Info
const validateTask = () => {
  const taskValues = Object.values(taskIsValid);
  const valid = taskValues.findIndex((value) => value === false);

  const fragment = document.createDocumentFragment();

  switch (valid) {
    case -1:
      taskInfo.classList.remove("incorrect-task");
      taskInfo.classList.add("correct-task");
      taskInfo.textContent =
        "Tarea Creada correctamente. Click encima de la tarea para completarla.";
      fragment.append(taskInfo);
      setTimeout(() => {
        taskInfo.classList.remove("correct-task");
        taskInfo.classList.add("hidden");
      }, 3000);
      form.reset();
      break;
    case 0:
      taskInfo.classList.remove("hidden");
      taskInfo.classList.add("incorrect-task");
      taskInfo.textContent = "Necesita escribir un nombre a la tarea";
      fragment.append(taskInfo);
      break;
    case 1:
      taskInfo.classList.remove("hidden");
      taskInfo.classList.add("incorrect-task");
      taskInfo.textContent = "Seleccione prioridad";
      fragment.append(taskInfo);
      break;
    case 2:
      taskInfo.classList.remove("hidden");
      taskInfo.classList.add("incorrect-task");
      taskInfo.textContent = "Seleccione una fecha válida";
      fragment.append(taskInfo);
      break;

    default:
      break;
  }
  info.append(fragment);
};

// ! Events

// * Validate Forms Fields
form.addEventListener("change", (e) => {
  e.preventDefault();
  if (e.target.type === "text") {
    if (e.target.value.trim().length > 0) taskIsValid.task = true;
    else taskIsValid.task = false;
  }
  if (e.target.type === "radio") {
    if (e.target.checked === true) taskIsValid.priority = true;
    else taskIsValid.priority = false;
  }
  if (e.target.type === "datetime-local") {
    const date = new Date(e.target.value);
    if (date.getTime() > currentDate.getTime()) taskIsValid.date = true;
    else taskIsValid.date = false;
  }
});

// * Send form and add task
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // * Locals
  const name = e.target.taskName.value;
  const priority = e.target.taskPriority.value;
  const date = e.target.taskDate.value;

  validateTask();
  // * Add task to localStore
  if (
    taskIsValid.task === true &&
    taskIsValid.priority === true &&
    taskIsValid.date === true
  ) {
    createTask(name, priority, date);
    // * Reset validation
    taskIsValid.task = false;
    taskIsValid.priority = false;
    taskIsValid.date = false;
  }
  addTask();
});

// * Load Tasks
document.addEventListener("DOMCOntentLoaded", printTask());

// * Task Delete
tasks.addEventListener("click", (e) => {
  e.preventDefault();
  const taskNameForDelete = e.path[2].childNodes[1].innerText;

  if (e.target.innerText.trim() === "delete") {
    deleteTask(taskNameForDelete);
  }
});

// * Task Done
tasks.addEventListener("click", (e) => {
  const done = e.target;
  const parentDone = e.target.parentElement;

  if (done.classList.contains("task__name")) {
    if (done.classList.contains("task__done")) {
      done.classList.remove("task__done");
      parentDone.classList.remove("task__done-parent");
    } else {
      done.classList.add("task__done");
      parentDone.classList.add("task__done-parent");
    }
  }
});
